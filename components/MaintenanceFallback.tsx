"use client";

import Link from "next/link";

export function MaintenanceFallback({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center max-w-lg">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Med Journey
        </p>
        <h1 className="mb-4 text-3xl sm:text-4xl font-bold">
          We&apos;re under maintenance
        </h1>
        <p className="mb-2 text-lg text-muted-foreground">
          We&apos;re making a few improvements and will be back shortly.
        </p>
        <p className="mb-8 text-base text-muted-foreground">
          Thanks for your patience—feel free to check the homepage or refresh
          this page in a little while.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={onReset}
            className="text-primary underline hover:text-primary/90"
          >
            Refresh page
          </button>
          <Link href="/" className="text-primary underline hover:text-primary/90">
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
