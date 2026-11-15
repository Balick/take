import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Closing call to action of the About page. */
export function AboutCta() {
  return (
    <section aria-labelledby="about-cta-heading" className="container-page pb-16 sm:pb-24">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:py-24">
        <p className="text-xs font-medium tracking-widest text-primary-foreground/60 uppercase">
          The collection
        </p>
        <h2
          id="about-cta-heading"
          className="max-w-2xl font-display text-4xl leading-none tracking-tight text-balance sm:text-6xl"
        >
          Start with the <em className="italic">essentials</em>
        </h2>
        <p className="max-w-md text-pretty text-primary-foreground/70">
          Tees, long sleeves, dresses and accessories designed to be worn on repeat.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="secondary" className="h-11 rounded-full px-6">
            <Link href="/products">
              Shop the collection
              <ArrowRightIcon data-icon="inline-end" aria-hidden />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-11 rounded-full px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:hover:bg-primary-foreground/10"
          >
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
