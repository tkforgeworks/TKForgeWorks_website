import type { Metadata } from "next";
import Link from "next/link";
import DeleteAccountForm from "@/components/DeleteAccountForm";
import { TURNSTILE_SITE_KEY } from "@/lib/site";

// Google Play's account-deletion URL for Cheesy Scribe (TKFW-83). The
// forge_core Edge Function forge-delete-confirm sends the visitor back here
// with ?status=done or ?status=invalid; DeleteAccountForm renders those.

const APP = "Cheesy Scribe";

export const metadata: Metadata = {
  title: `Delete your ${APP} account`,
  description: `How to delete your ${APP} account and the tasting notes backed up to it, from the app or with this form.`,
};

const linkClass =
  "text-purple-secondary underline underline-offset-2 transition-colors hover:text-purple-primary";

export default function DeleteAccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        Delete your {APP} account
      </h1>
      <p className="mt-2 font-mono text-sm text-text-secondary">
        <Link href="/privacy/cheesy-scribe" className={linkClass}>
          Privacy policy
        </Link>
      </p>

      <div className="mt-8 space-y-4 font-serif text-lg text-text-primary">
        <p>
          {APP} works without an account. If you signed in to back up your
          tasting notes, you can delete that account here or from the app.
          Deleting it is permanent.
        </p>
      </div>

      <h2 className="mt-10 font-sans text-2xl font-semibold text-purple-primary">
        What gets deleted
      </h2>
      <div className="mt-4 space-y-4 font-serif text-text-primary">
        <p>Everything stored in the account on our side:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>your email address, username and account ID</li>
          <li>every tasting note backed up to the account</li>
          <li>
            your profile row (your &ldquo;member since&rdquo; date and recent
            searches)
          </li>
        </ul>
        <p>
          As soon as the deletion is confirmed the account is closed: it can no
          longer be signed in to, and every phone that was signed in is signed
          out. The purge itself runs within minutes under normal conditions;
          if something is down it is retried until it goes through. Nothing is
          kept, in anonymised form or otherwise.
        </p>
        <p>
          Notes you made on your phone while signed out are untouched: they
          were never uploaded and stay in the app. To remove those too, clear
          the app&apos;s storage in Android settings or uninstall it.
        </p>
      </div>

      <h2 className="mt-10 font-sans text-2xl font-semibold text-purple-primary">
        In the app
      </h2>
      <div className="mt-4 space-y-4 font-serif text-text-primary">
        <p>
          If you still have {APP} installed, the quickest way is{" "}
          <strong>Account → Delete account</strong>. Type the confirmation
          word and the account is closed on the spot.
        </p>
      </div>

      <h2 className="mt-10 font-sans text-2xl font-semibold text-purple-primary">
        From this page
      </h2>
      <div className="mt-4 space-y-4 font-serif text-text-primary">
        <p>
          No longer have the app? Use the form below. We email the address a
          one-time confirmation link so nobody can delete your account by
          typing in your email. The link expires in 24 hours.
        </p>
      </div>

      <div className="mt-6">
        <DeleteAccountForm
          app="cheesy-scribe"
          appName={APP}
          siteKey={TURNSTILE_SITE_KEY}
        />
      </div>

      <p className="mt-8 font-serif text-sm text-text-secondary">
        Stuck? Email{" "}
        <a href="mailto:support@tkforgeworks.com" className={linkClass}>
          support@tkforgeworks.com
        </a>{" "}
        from the account&apos;s address and we&apos;ll sort it out.
      </p>
    </div>
  );
}
