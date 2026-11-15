"use client"; // Error boundaries must be Client Components.

import { HomeIcon, RotateCwIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { StatusMessage } from "@/components/pages/status/status-message";
import { Button } from "@/components/ui/button";

/** Reference to quote to support: matches the server logs in production. */
function getDigest(error: unknown) {
  if (error instanceof Error && "digest" in error && typeof error.digest === "string") {
    return error.digest;
  }
  return undefined;
}

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // Send it to your error reporting service (Sentry, Datadog...) here.
    console.error(error);
  }, [error]);

  const digest = getDigest(error);

  return (
    <StatusMessage
      display={<em className="italic">Oops.</em>}
      eyebrow="Something went wrong"
      title="We couldn’t load this page"
      description={
        <>
          <p>
            It’s on our side, not yours. Try again in a moment. Your bag and wishlist are safe.
          </p>
          {digest && (
            <p className="mt-3 text-sm">
              Error reference: <code className="font-mono text-foreground">{digest}</code>
            </p>
          )}
        </>
      }
    >
      <div className="flex flex-wrap justify-center gap-2">
        <Button size="lg" className="h-11 rounded-full px-5" onClick={() => retry()}>
          <RotateCwIcon data-icon="inline-start" aria-hidden />
          Try again
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-5">
          <Link href="/">
            <HomeIcon data-icon="inline-start" aria-hidden />
            Back home
          </Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Still stuck?{" "}
        <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">
          Contact us
        </Link>
      </p>
    </StatusMessage>
  );
}
