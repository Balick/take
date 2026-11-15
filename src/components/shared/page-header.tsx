import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Small label above the title (e.g. a category or a step). */
  eyebrow?: React.ReactNode;
  /** Rendered above the title, typically a <Breadcrumb />. */
  breadcrumb?: React.ReactNode;
  /** Rendered to the right of the title on large screens. */
  actions?: React.ReactNode;
  className?: string;
}

/** Title block used at the top of every inner page. */
export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumb,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 pt-8 pb-8 sm:pt-12", className)}>
      {breadcrumb}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          {eyebrow && (
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="text-base text-pretty text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
