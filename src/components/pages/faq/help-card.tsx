import { ArrowRightIcon, MessageCircleQuestionIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/** "Still need help?" call to action, shown at the end of the FAQ. */
export function HelpCard() {
  return (
    <section
      aria-labelledby="faq-help-heading"
      className="flex flex-col items-start gap-6 rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-foreground/10"
        >
          <MessageCircleQuestionIcon className="size-5" strokeWidth={1.75} />
        </span>
        <div className="flex flex-col gap-1">
          <h2 id="faq-help-heading" className="font-display text-2xl tracking-tight sm:text-3xl">
            Still need help?
          </h2>
          <p className="max-w-md text-sm text-pretty text-primary-foreground/70">
            Our team answers every message personally. {siteConfig.contact.responseTime}
          </p>
        </div>
      </div>
      <Button
        asChild
        size="lg"
        variant="secondary"
        className="h-11 shrink-0 rounded-full px-5"
      >
        <Link href="/contact">
          Contact us
          <ArrowRightIcon data-icon="inline-end" aria-hidden />
        </Link>
      </Button>
    </section>
  );
}
