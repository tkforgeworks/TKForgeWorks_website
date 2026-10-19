"use client";

import { useEffect, useState } from "react";
import { playStoreUrl } from "@/lib/site";

// The page behind an app's sign-in mail links (/apps/<slug>/auth/). Android
// opens the app for that URL when the App Link verified, so a visitor only
// sees this when it did not: no app installed, an unverified install, or a
// desktop browser. GoTrue appends either ?code=… (a one-time PKCE code the
// app exchanges; useless without the verifier stored on the phone) or an
// error (#error=…&error_code=otp_expired… or the same in the query). The
// component reads those once, takes them out of the address bar so they do
// not linger in history, and offers an intent: link that hands the same
// query to the app by package name as a fallback.

type Outcome =
  | { kind: "pending" }
  | { kind: "link"; search: string }
  | { kind: "error"; code: string | null };

function readOutcome(): Outcome {
  const query = new URLSearchParams(window.location.search);
  const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const param = (key: string) => query.get(key) ?? fragment.get(key);
  if (param("error") || param("error_code") || param("error_description")) {
    return { kind: "error", code: param("error_code") };
  }
  return { kind: "link", search: window.location.search };
}

function errorCopy(code: string | null): string {
  switch (code) {
    case "otp_expired":
      return "This link has expired. Sign-in links only work for a short while after they are sent.";
    case "access_denied":
      return "This link has already been used, or it was cancelled.";
    default:
      return "This link can't be used any more.";
  }
}

export default function AppLinkLanding({
  appName,
  packageName,
}: {
  appName: string;
  packageName: string;
}) {
  const [outcome, setOutcome] = useState<Outcome>({ kind: "pending" });
  const [android, setAndroid] = useState(false);

  useEffect(() => {
    const read = readOutcome();
    const onAndroid = /android/i.test(navigator.userAgent);
    if (window.location.search || window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
    // Rendered on the server without a URL to read, so the real state
    // arrives after mount (a microtask later keeps the hooks lint happy).
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setOutcome(read);
      setAndroid(onAndroid);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const store = playStoreUrl(packageName);
  // An Android intent URL names the package, so it reaches the app even
  // when the App Link itself was not verified; the fragment is dropped
  // because "#Intent;" is the URL's own syntax. Chrome falls back to the
  // store when the package is not installed.
  const intent =
    outcome.kind === "link"
      ? `intent://${window.location.host}${window.location.pathname}${outcome.search}` +
        `#Intent;scheme=https;package=${packageName};` +
        `S.browser_fallback_url=${encodeURIComponent(store)};end`
      : null;

  const primary =
    "rounded-lg bg-purple-primary px-6 py-3 text-center font-sans text-base font-medium text-white no-underline transition-colors hover:bg-purple-dark dark:text-background";
  const secondary =
    "rounded-lg border border-purple-primary bg-purple-tint px-6 py-3 text-center font-sans text-base font-medium text-purple-primary no-underline transition-colors hover:bg-purple-tint-hover";

  return (
    <div className="mt-8 space-y-6 font-serif text-lg text-text-primary">
      {outcome.kind === "error" ? (
        <>
          <p
            role="status"
            className="rounded-lg border border-error bg-error-light p-4 text-error-text"
          >
            {errorCopy(outcome.code)}
          </p>
          <p>
            Open {appName} and ask for a new one from the Account page: Send
            again under &ldquo;Check your email&rdquo;, or Forgot password.
          </p>
        </>
      ) : (
        <>
          <p>
            You tapped a sign-in link from a {appName} email. On an Android
            phone with {appName} installed, that link opens the app directly.
            If you are reading this, it didn&apos;t.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            {android && intent && (
              <a href={intent} className={primary}>
                Open {appName}
              </a>
            )}
            <a
              href={store}
              className={android && intent ? secondary : primary}
              rel="noopener"
            >
              Get {appName} on Google Play
            </a>
          </div>
          <p className="text-base text-text-secondary">
            {android
              ? `Not installed yet? Install ${appName}, go back to the email and tap the link again.`
              : `Opened this on a computer? Open the email on your Android phone instead and tap the link there.`}
          </p>
        </>
      )}
    </div>
  );
}
