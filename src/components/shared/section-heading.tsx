import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Optional "View all" style link on the right. */
  link?: { href: string; label: string };
  as?: "h2" | "h3";
  className?: string;
}

/** Heading block used at the top of homepage and product page sections. */
export function SectionHeading({
  title,
  description,
  eyebrow,
  link,
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="flex max-w-xl flex-col gap-2">
        {eyebrow && (
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {eyebrow}
          </p>
        )}
        <Heading className="font-display text-3xl tracking-tight text-balance sm:text-4xl">
          {title}
        </Heading>
        {description && <p className="text-pretty text-muted-foreground">{description}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className="group/link inline-flex shrink-0 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          {link.label}
          <ArrowRightIcon
            className="size-4 transition-transform group-hover/link:translate-x-0.5"
            aria-hidden
          />
        </Link>
      )}
    </div>
  );
}
