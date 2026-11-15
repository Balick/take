import { cn } from "@/lib/utils";

interface StatusMessageProps {
  /** Oversized editorial figure, e.g. "404". Decorative: the title carries the meaning. */
  display: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Primary actions (buttons, a search form...). */
  children?: React.ReactNode;
  /** Secondary content below the actions, e.g. popular links. */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Centered layout shared by the 404 and error pages. Server-safe (no hooks),
 * so it can be rendered by both Server and Client Components.
 */
export function StatusMessage({
  display,
  eyebrow,
  title,
  description,
  children,
  footer,
  className,
}: StatusMessageProps) {
  return (
    <div
      className={cn(
        "container-page flex flex-col items-center py-16 text-center sm:py-24",
        className,
      )}
    >
      <p
        aria-hidden
        className="font-display text-[7rem] leading-none tracking-tighter select-none sm:text-[11rem] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-700"
      >
        {display}
      </p>
      <div className="mt-6 flex max-w-xl flex-col items-center gap-3">
        {eyebrow && (
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl tracking-tight text-balance sm:text-4xl">{title}</h1>
        {description && (
          <div className="text-base text-pretty text-muted-foreground">{description}</div>
        )}
      </div>
      {children && (
        <div className="mt-8 flex w-full max-w-md flex-col items-center gap-4">{children}</div>
      )}
      {footer && <div className="mt-12 w-full max-w-2xl border-t pt-8">{footer}</div>}
    </div>
  );
}
