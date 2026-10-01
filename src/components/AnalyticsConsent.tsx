"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";

// Visitors from the EU, the wider EEA, the UK and Switzerland must opt in
// before analytics cookies are set. Everyone else gets analytics by default
// and can opt out from "Cookie settings" in the footer.
const CONSENT_COUNTRIES = new Set([
  // EU
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE",
  // EEA, UK, Switzerland
  "IS", "LI", "NO", "GB", "CH",
]);

const STORAGE_KEY = "analytics-consent";
const OPEN_EVENT = "open-consent-settings";

type Choice = "granted" | "denied";
type Consent = "pending" | "ask" | Choice;

function readStoredChoice(): Choice | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "granted" || saved === "denied" ? saved : null;
  } catch {
    return null;
  }
}

function storeChoice(choice: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
}

// Cloudflare answers /cdn-cgi/trace on every domain it serves with the
// visitor's country (a "loc=XX" line). If anything goes wrong (local dev,
// a blocked request, a timeout) we ask, so nobody is tracked by default
// without having had the choice.
async function needsConsent(): Promise<boolean> {
  try {
    const res = await fetch("/cdn-cgi/trace", {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return true;
    const country = (await res.text()).match(/^loc=([A-Z]{2})$/m)?.[1];
    return !country || CONSENT_COUNTRIES.has(country);
  } catch {
    return true;
  }
}

// Google Analytics sets _ga and _ga_<id> on the site's domain.
function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", `; domain=${host}`, `; domain=.${host.split(".").slice(-2).join(".")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

export default function AnalyticsConsent({ gaId }: { gaId: string }) {
  const [consent, setConsent] = useState<Consent>("pending");
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const stored = readStoredChoice();
    const resolve: Promise<Consent> = stored
      ? Promise.resolve(stored)
      : needsConsent().then((ask) => (ask ? "ask" : "granted"));
    resolve.then((result) => {
      if (!cancelled) setConsent(result);
    });

    const onOpen = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      cancelled = true;
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  function choose(choice: Choice) {
    storeChoice(choice);
    // gtag checks this flag before sending anything, so it switches off a
    // tag that already loaded on this page, and back on if they re-accept.
    (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] =
      choice === "denied";
    if (choice === "denied") clearAnalyticsCookies();
    setConsent(choice);
    setReopened(false);
  }

  const buttonClass =
    "rounded-lg bg-purple-primary px-5 py-2 font-sans text-sm font-medium text-white transition-colors hover:bg-purple-dark dark:text-background";

  return (
    <>
      {consent === "granted" && <GoogleAnalytics gaId={gaId} />}
      {(consent === "ask" || reopened) && (
        <div
          role="region"
          aria-label="Analytics cookie choice"
          className="fixed inset-x-0 bottom-0 z-50 p-4"
        >
          <div className="mx-auto max-w-3xl rounded-lg border border-purple-tint bg-background p-4 shadow-lg md:flex md:items-center md:gap-6 md:p-6">
            <p className="font-serif text-sm text-text-primary">
              This site uses Google Analytics cookies to see which pages people
              read. You can accept or reject them, and change your mind any
              time from Cookie settings in the footer.{" "}
              <Link
                href="/privacy/website"
                className="text-purple-secondary underline underline-offset-2 transition-colors hover:text-purple-primary"
              >
                Privacy policy
              </Link>
            </p>
            {/* Reject and Accept get the same weight: rejecting must be as easy as accepting. */}
            <div className="mt-4 flex shrink-0 gap-3 md:mt-0">
              <button type="button" onClick={() => choose("denied")} className={buttonClass}>
                Reject
              </button>
              <button type="button" onClick={() => choose("granted")} className={buttonClass}>
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={className}
    >
      Cookie settings
    </button>
  );
}
