import type { Metadata } from "next";
import Link from "next/link";
import AppLinkLanding from "@/components/AppLinkLanding";
import { ANDROID_APPS } from "@/lib/site";

// Where Cheesy Scribe's confirmation and password-reset mails redirect
// (TKFW-85, CHEESE-68): an Android App Link, so the app opens straight from
// the mail client. Verified installs never show this page; everyone else
// gets an explanation and the store link. Not indexed: it is a hand-off,
// not content.

const app = ANDROID_APPS["cheesy-scribe"];

export const metadata: Metadata = {
  title: `Opening ${app.name}`,
  description: `Sign-in links from ${app.name} emails open the app. This page is for when they could not.`,
  robots: { index: false, follow: false },
};

const linkClass =
  "text-purple-secondary underline underline-offset-2 transition-colors hover:text-purple-primary";

export default function CheesyScribeAuthPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        This link belongs to {app.name}
      </h1>
      <p className="mt-2 font-mono text-sm text-text-secondary">
        <Link href="/privacy/cheesy-scribe" className={linkClass}>
          Privacy policy
        </Link>
      </p>

      <AppLinkLanding appName={app.name} packageName={app.packageName} />

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
