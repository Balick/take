import { FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface CheckoutSectionProps {
  step: number;
  title: string;
  description?: React.ReactNode;
  /** Rendered next to the title, e.g. a "Demo" badge. */
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Numbered step of the single-page checkout form. */
export function CheckoutSection({
  step,
  title,
  description,
  badge,
  children,
  className,
}: CheckoutSectionProps) {
  const descriptionId = `checkout-step-${step}-description`;

  return (
    <FieldSet
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "min-w-0 gap-6 border-t pt-10 first:border-t-0 first:pt-0",
        className,
      )}
    >
      {/* The legend must stay the first child of the fieldset. */}
      <FieldLegend className="mb-0 flex w-full items-center gap-3">
        <span
          aria-hidden
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background tabular-nums"
        >
          {step}
        </span>
        <h2 className="text-lg font-medium tracking-tight">
          <span className="sr-only">Step {step}: </span>
          {title}
        </h2>
        {badge}
      </FieldLegend>
      {/* Aligned with the title, after the 28px step marker and its 12px gap. */}
      {description && (
        <p id={descriptionId} className="-mt-4 pl-10 text-sm text-pretty text-muted-foreground">
          {description}
        </p>
      )}
      {children}
    </FieldSet>
  );
}
