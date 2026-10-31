import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AppStoreChooser from "@/components/AppStoreChooser";
import { openGraphFor } from "@/lib/seo";
import { ANDROID_APPS } from "@/lib/site";

// The one link Cheesy Scribe's "Share Cheesy Scribe" row sends (TKFW-88,
// CHEESE-71). It goes to people on any phone, so the page picks the store
// in the browser (AppStoreChooser) and never redirects: chat apps preview
// it, and their previews need this page's own metadata. Indexed and in the
// sitemap; analytics stay off under /apps/ (AnalyticsConsent). The icon is
// fetched from the app repo before each build (scripts/fetch-app-icons.mjs).

const app = ANDROID_APPS["cheesy-scribe"];

// The App Store listing, once the iPhone app ships (CHEESE-73). Until then
// the page says the iPhone app is on its way.
const APP_STORE_URL: string | null = null;

const description = `${app.name} is a cheese tasting journal for your phone: tasting notes, a flavor wheel, a library of cheese styles and optional backup.`;

export const metadata: Metadata = {
  title: app.name,
  description,
  openGraph: openGraphFor({
    type: "website",
    title: app.name,
    description,
    url: "/apps/cheesy-scribe/",
  }),
};

const projectHref = "/projects/cheesy-scribe/";

const linkClass =
  "text-purple-secondary underline underline-offset-2 transition-colors hover:text-purple-primary";

export default function CheesyScribeSharePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* The heading names the app, so the icon is decorative. */}
        <Image
          src="/apps/cheesy-scribe/icon.png"
          alt=""
          width={96}
          height={96}
          className="size-24 shrink-0 rounded-2xl"
          priority
        />
        <h1 className="font-sans text-3xl font-bold text-purple-primary md:text-4xl">
          {app.name}
        </h1>
      </div>
      <p className="mt-4 font-mono text-sm text-text-secondary">
        <Link href={projectHref} className={linkClass}>
          About the project
        </Link>
        {" · "}
        <Link href="/privacy/cheesy-scribe/" className={linkClass}>
          Privacy policy
        </Link>
      </p>

      <div className="mt-8 space-y-4 font-serif text-lg text-text-primary">
        <p>
          {app.name} is a cheese tasting journal for your phone. Write a note
          for every cheese you try, score its flavors on a wheel, look up
          styles in the cheese library, and back your notes up to an account
          if you&apos;d like them to follow you to your next phone.
        </p>
      </div>

      <AppStoreChooser
        appName={app.name}
        packageName={app.packageName}
        appStoreUrl={APP_STORE_URL}
        projectHref={projectHref}
      />

      <p className="mt-6 font-serif text-base text-text-secondary">
        While {app.name} is in testing, the Google Play link works for invited
        testers.
      </p>

      <p className="mt-10 font-serif text-sm text-text-secondary">
        Stuck? Email{" "}
        <a href="mailto:support@tkforgeworks.com" className={linkClass}>
          support@tkforgeworks.com
        </a>{" "}
        and we&apos;ll sort it out.
      </p>
    </div>
  );
}
