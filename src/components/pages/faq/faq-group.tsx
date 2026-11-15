import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import type { FaqSection } from "@/components/pages/faq/faq-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** One FAQ topic: an anchored section with its questions in an accordion. */
export function FaqGroup({ section }: { section: FaqSection }) {
  const headingId = `${section.id}-heading`;

  return (
    <section id={section.id} aria-labelledby={headingId} className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-1">
        <h2 id={headingId} className="font-display text-3xl tracking-tight">
          {section.title}
        </h2>
        <p className="text-sm text-muted-foreground">{section.description}</p>
      </div>
      <Accordion type="multiple" className="border-y">
        {section.items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="gap-4 py-5 text-base underline-offset-4 sm:text-[1.0625rem]">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="flex max-w-prose flex-col gap-3 pr-8 pb-6 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground [&_p:not(:last-child)]:mb-0">
              {item.answer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {item.link && (
                <Link
                  href={item.link.href}
                  className="group/link inline-flex w-fit items-center gap-1.5 font-medium text-foreground no-underline! hover:underline!"
                >
                  {item.link.label}
                  <ArrowRightIcon
                    aria-hidden
                    className="size-4 motion-safe:transition-transform group-hover/link:translate-x-0.5"
                  />
                </Link>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
