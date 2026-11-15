import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Original Take monogram: a split crossbar and a stepped T. Decorative. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      focusable="false"
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" className="fill-foreground" />
      <path d="M8 8h16v5h-6v11h-5V13H8z" className="fill-background" />
      <path d="M21 16h3v8h-3z" className="fill-background" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** Hide the wordmark and only show the monogram. */
  markOnly?: boolean;
  /** Called when the link is followed (e.g. to close a menu). */
  onNavigate?: () => void;
}

/** Store logo: monogram + wordmark, linking to the homepage. */
export function Logo({ className, markOnly, onNavigate }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      onClick={onNavigate}
      className={cn(
        "group/logo inline-flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <LogoMark className="motion-safe:transition-transform motion-safe:duration-300 group-hover/logo:-rotate-6" />
      {!markOnly && (
        <span className="text-[1.375rem] leading-none font-semibold tracking-[-0.06em] whitespace-nowrap">
          {siteConfig.name}
        </span>
      )}
    </Link>
  );
}
