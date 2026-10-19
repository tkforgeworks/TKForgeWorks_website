"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useTheme } from "@/components/ThemeProvider";

// The web account-deletion form (TKFW-83). One email field and a Cloudflare
// Turnstile widget, posted to the Pages Function at /api/delete-account,
// which forwards the address to the app's forge_core Edge Function. The
// server answers the same way whether or not the address has an account, so
// the "check your email" state is shown for every accepted submission.
//
// The confirmation link in that email lands back on this page with
// ?status=done (account flagged, deletion under way) or ?status=invalid
// (link expired or already used), which this component reads on mount.

const TURNSTILE_SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileOptions {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
}

interface Turnstile {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

type Landing = "done" | "invalid" | null;
type Phase = "idle" | "sending" | "sent" | "error";

export interface DeleteAccountFormProps {
  /** The app id the relay knows (its key in the function's APPS table). */
  app: string;
  /** Product name as on the store listing, for the copy. */
  appName: string;
  /** Turnstile site key (public). */
  siteKey: string;
}

export default function DeleteAccountForm({
  app,
  appName,
  siteKey,
}: DeleteAccountFormProps) {
  const { resolvedTheme } = useTheme();
  const [landing, setLanding] = useState<Landing>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const widgetHost = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // The confirm step sends the visitor back here with ?status=…
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("status");
    if (status === "done" || status === "invalid") setLanding(status);
  }, []);

  // Render the widget once the script is in and the host div exists, and
  // again when the theme flips so it matches the page.
  const showForm = landing !== "done" && phase !== "sent";
  useEffect(() => {
    const host = widgetHost.current;
    const turnstile = window.turnstile;
    if (!scriptReady || !showForm || !host || !turnstile) return;
    widgetId.current = turnstile.render(host, {
      sitekey: siteKey,
      theme: resolvedTheme,
      callback: (t) => setToken(t),
      "expired-callback": () => setToken(null),
      "error-callback": () => setToken(null),
    });
    return () => {
      if (widgetId.current) turnstile.remove(widgetId.current);
      widgetId.current = null;
      setToken(null);
    };
  }, [scriptReady, showForm, siteKey, resolvedTheme]);

  const onReady = useCallback(() => setScriptReady(true), []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || phase === "sending") return;
    setPhase("sending");
    try {
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ app, email: email.trim(), turnstileToken: token }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPhase("sent");
    } catch {
      setPhase("error");
      // A Turnstile token is single-use; get a fresh one for the retry.
      setToken(null);
      if (widgetId.current && window.turnstile) {
        window.turnstile.reset(widgetId.current);
      }
    }
  }

  const noticeClass = "rounded-lg border p-4 font-serif md:p-6";

  if (landing === "done") {
    return (
      <div
        role="status"
        className={`${noticeClass} border-success bg-success-light text-success-text`}
      >
        <h2 className="font-sans text-xl font-semibold">
          Your account is being deleted
        </h2>
        <p className="mt-2">
          Thanks for confirming. Your {appName} account is now closed: it can
          no longer be signed in to, and everything stored in it is being
          removed. That finishes within a few minutes, and in any case within
          24 hours. You can close this page.
        </p>
        <p className="mt-2">
          Anything kept only on your phone is untouched. If you still have
          the app installed, it has been signed out.
        </p>
      </div>
    );
  }

  if (phase === "sent") {
    return (
      <div
        role="status"
        className={`${noticeClass} border-info bg-info-light text-info-text`}
      >
        <h2 className="font-sans text-xl font-semibold">Check your email</h2>
        <p className="mt-2">
          If <strong>{email.trim()}</strong> has a {appName} account, we have
          sent it a confirmation link. Open that email and tap{" "}
          <strong>Yes, delete my account</strong> to finish. The link works
          once and expires in 24 hours.
        </p>
        <p className="mt-2">
          No email after a few minutes? Check your spam folder, and make sure
          the address is the one you signed in with. If you signed in with
          Google, that is your Google account&apos;s address.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Script src={TURNSTILE_SCRIPT} strategy="afterInteractive" onReady={onReady} />

      {landing === "invalid" && (
        <div
          role="alert"
          className={`${noticeClass} mb-6 border-warning bg-warning-light text-warning-text`}
        >
          <h2 className="font-sans text-xl font-semibold">
            That link didn&apos;t work
          </h2>
          <p className="mt-2">
            The confirmation link has expired, was already used, or wasn&apos;t
            complete. If your account is still there, enter your address below
            and we&apos;ll send a fresh one.
          </p>
        </div>
      )}

      <form
        onSubmit={submit}
        className="rounded-lg border border-purple-tint bg-background-light p-4 md:p-8"
      >
        <h2 className="font-sans text-xl font-semibold text-purple-primary">
          Request deletion
        </h2>
        <p className="mt-2 font-serif text-sm text-text-secondary">
          Enter the email address of your {appName} account. We&apos;ll email
          you a link to confirm; nothing is deleted until you open it.
        </p>

        <label
          htmlFor="delete-account-email"
          className="mt-6 block font-sans text-sm font-medium text-purple-dark"
        >
          Email address
        </label>
        <input
          id="delete-account-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={phase === "sending"}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-serif text-text-primary outline-none transition-colors focus:border-purple-secondary focus:ring-2 focus:ring-purple-tint disabled:opacity-60"
        />

        {/* Turnstile renders into this div once its script is in. */}
        <div ref={widgetHost} className="mt-4 min-h-[65px]" />

        {phase === "error" && (
          <p role="alert" className="mt-4 font-serif text-sm text-error-text">
            Something went wrong and the request wasn&apos;t sent. Please try
            again in a moment, or email{" "}
            <a
              href="mailto:support@tkforgeworks.com"
              className="text-purple-secondary underline underline-offset-2 transition-colors hover:text-purple-primary"
            >
              support@tkforgeworks.com
            </a>
            .
          </p>
        )}

        <button
          type="submit"
          disabled={!token || phase === "sending"}
          className="mt-6 rounded-lg bg-purple-primary px-5 py-2 font-sans text-sm font-medium text-white transition-colors hover:bg-purple-dark disabled:cursor-not-allowed disabled:opacity-50 dark:text-background"
        >
          {phase === "sending" ? "Sending…" : "Email me a confirmation link"}
        </button>
      </form>
    </div>
  );
}
