import type { FaqSection } from "@/components/pages/faq/faq-data";

/**
 * Jump links to each FAQ group: a scrollable row of pills on small screens,
 * a sticky vertical list next to the questions on large screens.
 */
export function FaqNav({ sections }: { sections: FaqSection[] }) {
  return (
    <nav aria-label="FAQ topics" className="lg:sticky lg:top-24">
      <p className="mb-3 hidden text-xs font-medium tracking-widest text-muted-foreground uppercase lg:block">
        Topics
      </p>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 lg:flex-col lg:gap-0.5 lg:overflow-visible">
        {sections.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              className="flex h-9 items-center justify-between gap-3 rounded-full border px-4 text-sm whitespace-nowrap transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 lg:rounded-lg lg:border-transparent lg:px-3 lg:text-muted-foreground lg:hover:text-foreground"
            >
              {section.title}
              <span className="hidden text-xs text-muted-foreground tabular-nums lg:inline">
                {section.items.length}
                <span className="sr-only"> questions</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
