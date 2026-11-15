import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Square monogram built from `siteConfig.shortName`. Decorative. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      focusable="false"
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" className="fill-foreground" />
      <circle
        cx="16"
        cy="16"
        r="11.5"
        fill="none"
        strokeWidth="0.75"
        className="stroke-background/35"
      />
      <text
        x="16"
        y="19.6"
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        letterSpacing="-0.4"
        className="fill-background font-mono"
      >
        {siteConfig.shortName}
      </text>
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
        <span className="font-display text-[1.375rem] leading-none tracking-tight whitespace-nowrap">
          {siteConfig.name}
        </span>
      )}
    </Link>
  );
}
