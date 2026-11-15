"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";

import { siteConfig } from "@/config/site";

import "./globals.css";

/**
 * Last-resort boundary for errors thrown in the root layout. It replaces the
 * whole document, so it renders its own <html> and <body> and can't rely on
 * the providers (theme, toasts...) or the header and footer.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // The theme class set by next-themes is gone with the root layout: restore it.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const dark =
        stored === "dark" ||
        (stored !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
    } catch {
      // Storage can be unavailable (private mode): keep the light theme.
    }
  }, []);

  return (
    <html lang="en">
      {/* The next/font variables live in the root layout, which isn't rendered
          here: fall back to the system UI font. */}
      <body className="flex min-h-svh items-center justify-center bg-background p-6 [font-family:ui-sans-serif,system-ui,sans-serif] text-foreground antialiased">
        <title>{`Something went wrong · ${siteConfig.name}`}</title>
        <main className="flex max-w-md flex-col items-center gap-4 text-center">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {siteConfig.name}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            Something went wrong
          </h1>
          <p className="text-pretty text-muted-foreground">
            The store couldn’t load. Try again, and if the problem persists, come back in a few
            minutes.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Try again
            </button>
            {/* A full page load on purpose: the app shell itself failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex h-11 items-center rounded-full border px-5 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Back home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
