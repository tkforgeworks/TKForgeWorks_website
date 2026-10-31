// Feedback relay for TK ForgeWorks apps (TKFW-82).
//
// Apps POST a small JSON form here and this Cloudflare Pages Function emails
// it to support through Resend. The Resend key lives only in the Pages secret
// RESEND_API_KEY, never in an app. Only the apps listed in APPS can send, and
// each one gets its own sender address (feedback+<app>@tkforgeworks.com) so
// the support inbox can filter by app.
//
// Request: POST application/json
//   { app, topic, rating?, comments, replyEmail?, appVersion, osVersion, device, screen? }
// Responses: 200 { ok: true } · 400 { error: "invalid" } · 405 · 413 · 415
//            · 502 { error: "send_failed" } (Resend refused or unreachable)

interface Env {
  RESEND_API_KEY?: string;
}

interface Context {
  request: Request;
  env: Env;
}

/** Apps allowed to send, by the id they post as `app`. */
const APPS: Record<string, string> = {
  "cheesy-scribe": "Cheesy Scribe",
};

const TOPICS: Record<string, string> = {
  bug: "Bug",
  idea: "Idea",
  confusing: "Something confusing",
  hello: "Just saying hi",
};

const TO = "support@tkforgeworks.com";
const MAX_BODY_BYTES = 16 * 1024;
const MAX_COMMENTS = 4000;
const EMAIL = /^[^\s@<>()",;:\\]+@[^\s@<>()",;:\\]+\.[^\s@<>()",;:\\]+$/;

interface Feedback {
  appId: string;
  topic: string;
  rating: number | null;
  comments: string;
  replyEmail: string | null;
  appVersion: string;
  osVersion: string;
  device: string;
  screen: string | null;
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

/** A string of 1..max characters with control characters removed, else null. */
function line(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  return cleaned.length > 0 && cleaned.length <= max ? cleaned : null;
}

function parseFeedback(input: unknown): Feedback | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }
  const o = input as Record<string, unknown>;

  const appId = typeof o.app === "string" && o.app in APPS ? o.app : null;
  const topic =
    typeof o.topic === "string" && o.topic in TOPICS ? o.topic : null;

  let rating: number | null = null;
  if (o.rating !== undefined && o.rating !== null) {
    if (!Number.isInteger(o.rating)) return null;
    rating = o.rating as number;
    if (rating < 1 || rating > 5) return null;
  }

  // Comments keep their line breaks; only other control characters go.
  const comments =
    typeof o.comments === "string"
      ? o.comments
          .replace(/\r\n?/g, "\n")
          .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "")
          .trim()
      : "";
  if (comments.length === 0 || comments.length > MAX_COMMENTS) return null;

  let replyEmail: string | null = null;
  if (o.replyEmail !== undefined && o.replyEmail !== null && o.replyEmail !== "") {
    if (
      typeof o.replyEmail !== "string" ||
      o.replyEmail.length > 254 ||
      !EMAIL.test(o.replyEmail)
    ) {
      return null;
    }
    replyEmail = o.replyEmail;
  }

  const appVersion = line(o.appVersion, 40);
  const osVersion = line(o.osVersion, 60);
  const device = line(o.device, 100);
  const screen =
    o.screen === undefined || o.screen === null || o.screen === "" ? null : line(o.screen, 60);
  if (o.screen !== undefined && o.screen !== null && o.screen !== "" && screen === null) return null;

  if (!appId || !topic || !appVersion || !osVersion || !device) return null;
  return {
    appId,
    topic,
    rating,
    comments,
    replyEmail,
    appVersion,
    osVersion,
    device,
    screen,
  };
}

function composeEmail(f: Feedback) {
  const appName = APPS[f.appId];
  const firstLine = f.comments.split("\n")[0].slice(0, 60);
  const ellipsis = f.comments.length > firstLine.length ? "…" : "";
  const text = [
    `Topic:       ${TOPICS[f.topic]}`,
    `Rating:      ${f.rating === null ? "not given" : `${f.rating} / 5`}`,
    `Reply to:    ${f.replyEmail ?? "no reply wanted"}`,
    `App version: ${f.appVersion}`,
    `Android:     ${f.osVersion}`,
    `Device:      ${f.device}`,
    `Screen:      ${f.screen ?? "not given"}`,
    "",
    f.comments,
  ].join("\n");
  return {
    from: `${appName} feedback <feedback+${f.appId}@tkforgeworks.com>`,
    to: [TO],
    subject: `[${appName}] ${TOPICS[f.topic]}: ${firstLine}${ellipsis}`,
    text,
    ...(f.replyEmail ? { reply_to: f.replyEmail } : {}),
  };
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
  const feedback = parseFeedback(body);
  if (!feedback) return json(400, { error: "invalid" });

  if (!env.RESEND_API_KEY) return json(502, { error: "send_failed" });
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(composeEmail(feedback)),
    });
    if (!res.ok) {
      console.error("Resend refused feedback", res.status, await res.text());
      return json(502, { error: "send_failed" });
    }
  } catch (e) {
    console.error("Resend unreachable", e);
    return json(502, { error: "send_failed" });
  }
  return json(200, { ok: true });
}
