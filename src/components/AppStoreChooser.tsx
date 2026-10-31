"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { playStoreUrl } from "@/lib/site";

// The store section of an app's share page (/apps/<slug>/). The app shares
// that one URL for every phone, so the page picks the store here: Android
// gets the Google Play button, an iPhone or iPad hears whether its app is
// out yet, and anything else (a computer, an unknown browser) sees both.
// The server render is the "anything else" state, so link previews and
// browsers without JavaScript still get every option; the real platform
// arrives after mount, as in AppLinkLanding.

type Platform = "other" | "android" | "ios";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  // iPadOS 13+ asks for the desktop site and reports itself as a Mac; a
  // touch screen gives it away.
  if (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  return "other";
}

const primary =
  "rounded-lg bg-purple-primary px-6 py-3 text-center font-sans text-base font-medium text-white no-underline transition-colors hover:bg-purple-dark dark:text-background";
const secondary =
  "rounded-lg border border-purple-primary bg-purple-tint px-6 py-3 text-center font-sans text-base font-medium text-purple-primary no-underline transition-colors hover:bg-purple-tint-hover";
const comingSoon =
  "rounded-lg border border-border px-6 py-3 text-center font-sans text-base font-medium text-text-secondary";
const linkClass =
  "text-purple-secondary underline underline-offset-2 transition-colors hover:text-purple-primary";

export default function AppStoreChooser({
  appName,
  packageName,
  appStoreUrl,
  projectHref,
}: {
  appName: string;
  packageName: string;
  // null until the App Store listing exists; the iPhone option then reads
  // "coming soon" and is not a link.
  appStoreUrl: string | null;
  projectHref: string;
}) {
  const [platform, setPlatform] = useState<Platform>("other");

  useEffect(() => {
    const detected = detectPlatform();
    // A microtask later keeps the hooks lint happy, as in AppLinkLanding.
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setPlatform(detected);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const play = playStoreUrl(packageName);
  const playLabel = `Get ${appName} on Google Play`;
  const appStoreLabel = `Get ${appName} on the App Store`;

  if (platform === "android") {
    return (
      <div className="mt-8 space-y-4 font-serif text-lg text-text-primary">
        <div className="flex flex-col gap-4 sm:flex-row">
          <a href={play} className={primary} rel="noopener">
            {playLabel}
          </a>
        </div>
        <p className="text-base">
          <Link href={projectHref} className={linkClass}>
            More about {appName}
          </Link>
        </p>
      </div>
    );
  }

  if (platform === "ios") {
    return (
      <div className="mt-8 space-y-4 font-serif text-lg text-text-primary">
        {appStoreUrl ? (
          <div className="flex flex-col gap-4 sm:flex-row">
            <a href={appStoreUrl} className={primary} rel="noopener">
              {appStoreLabel}
            </a>
          </div>
        ) : (
          <p role="status">The iPhone app is on its way.</p>
        )}
        <p className="text-base text-text-secondary">
          Have an Android phone too?{" "}
          <a href={play} className={linkClass} rel="noopener">
            {appName} is on Google Play
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 font-serif text-lg text-text-primary">
      <div className="flex flex-col gap-4 sm:flex-row">
        <a href={play} className={primary} rel="noopener">
          {playLabel}
        </a>
        {appStoreUrl ? (
          <a href={appStoreUrl} className={secondary} rel="noopener">
            {appStoreLabel}
          </a>
        ) : (
          <span className={comingSoon}>App Store: coming soon</span>
        )}
      </div>
    </div>
  );
}
