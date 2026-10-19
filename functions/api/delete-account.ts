// Account-deletion request relay for TK ForgeWorks apps (TKFW-83).
//
// Google Play requires a web page where a user can ask for their account to
// be deleted. The page at /privacy/<app>/delete-account/ posts the address
// here; this Cloudflare Pages Function checks the Turnstile token, then
// forwards { email } to the app's forge_core Edge Function
// (forge-delete-request) with a shared header secret. That function emails a
// one-time confirmation link if the address has an account and answers
// 200 { ok: true } either way, and so do we: the response never says whether
// an account exists, so the form cannot be used to discover accounts.
// Upstream failures are logged here and still answered with { ok: true }.
//
// No Supabase key lives on the website: only the shared header secret.
//
// Secrets (Cloudflare Pages → Settings → Variables and Secrets):
//   TURNSTILE_SECRET_KEY            the Turnstile widget's secret key
//   FORGE_DELETE_SECRET             shared with the Edge Functions
//                                   (FORGE_WEB_DELETE_SECRET on Supabase)
//   FORGE_DELETE_URL_<APP>          the app's forge-delete-request URL,
//                                   one per app in APPS
//
// Request: POST application/json  { app, email, turnstileToken }
// Responses: 200 { ok: true } · 400 { error: "invalid" } · 403 { error: "challenge" }
//            · 405 · 413 · 415 · 503 { error: "unavailable" } (a secret is missing
//            or Turnstile could not be reached)

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  FORGE_DELETE_SECRET?: string;
  [name: string]: string | undefined;
}

interface Context {
  request: Request;
  env: Env;
}

/** Apps with accounts, by the id the page posts as `app`, and the name of
 *  the Pages secret holding each one's forge-delete-request URL. */
const APPS: Record<string, { urlVar: string }> = {
  "cheesy-scribe": { urlVar: "FORGE_DELETE_URL_CHEESY_SCRIBE" },
};

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_BODY_BYTES = 8 * 1024;
const MAX_TOKEN = 4096;
// Same loose check the Edge Function applies.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface DeletionRequest {
  appId: string;
  email: string;
  token: string;
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function parseRequest(input: unknown): DeletionRequest | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }
  const o = input as Record<string, unknown>;
  const appId = typeof o.app === "string" && o.app in APPS ? o.app : null;
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const token = typeof o.turnstileToken === "string" ? o.turnstileToken : "";
  if (!appId) return null;
  if (email.length === 0 || email.length > 254 || !EMAIL.test(email)) return null;
  if (token.length === 0 || token.length > MAX_TOKEN) return null;
  return { appId, email, token };
}

/** true = passed, false = failed, null = Turnstile could not be reached. */
async function verifyTurnstile(
  secret: string,
  token: string,
  ip: string | null
): Promise<boolean | null> {
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  try {
    const res = await fetch(SITEVERIFY, { method: "POST", body: form });
    if (!res.ok) {
      console.error("Turnstile siteverify answered", res.status);
      return null;
    }
    const result = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (result.success !== true) {
      console.warn("Turnstile rejected a token", result["error-codes"] ?? []);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Turnstile siteverify unreachable", e);
    return null;
  }
}

export async function onRequest({ request, env }: Context): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { allow: "POST" } });
  }
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) {
    return new Response(null, { status: 415 });
  }
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid" });
  }
  const req = parseRequest(body);
  if (!req) return json(400, { error: "invalid" });

  // Configuration problems are ours, not the visitor's, and reveal nothing
  // about any account, so they get an honest 503 rather than a silent ok.
  const upstreamUrl = env[APPS[req.appId].urlVar];
  const missing = [
    !env.TURNSTILE_SECRET_KEY && "TURNSTILE_SECRET_KEY",
    !env.FORGE_DELETE_SECRET && "FORGE_DELETE_SECRET",
    !upstreamUrl && APPS[req.appId].urlVar,
  ].filter(Boolean);
  if (missing.length > 0 || !upstreamUrl) {
    console.error("delete-account: missing secrets", missing.join(", "));
    return json(503, { error: "unavailable" });
  }

  const passed = await verifyTurnstile(
    env.TURNSTILE_SECRET_KEY!,
    req.token,
    request.headers.get("cf-connecting-ip")
  );
  if (passed === null) return json(503, { error: "unavailable" });
  if (!passed) return json(403, { error: "challenge" });

  // From here on the answer is always ok: whether the address has an
  // account, and whether the upstream call worked, stays on the server.
  try {
    const res = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.FORGE_DELETE_SECRET}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: req.email }),
    });
    if (!res.ok) {
      // The Edge Function's error bodies are short codes, never the address.
      console.error(
        `delete-account: ${req.appId} upstream refused`,
        res.status,
        await res.text()
      );
    }
  } catch (e) {
    console.error(`delete-account: ${req.appId} upstream unreachable`, e);
  }
  return json(200, { ok: true });
}
