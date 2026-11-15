"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/types";

import { type CategoryFacet, createShopHref, PRICE_STEP } from "./search-params";
import { useShop } from "./shop-provider";

export interface ProductFiltersProps {
  facets: CategoryFacet[];
  /** Products matching the non-category filters, shown next to "All". */
  facetTotal: number;
  /** Upper bound of the price slider. */
  maxPrice: number;
  className?: string;
}

/**
 * The filter panel, rendered in the desktop sidebar and in the mobile sheet.
 * Section titles are h3s: the surrounding sidebar or sheet provides the h2.
 */
export function ProductFilters({ facets, facetTotal, maxPrice, className }: ProductFiltersProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <CategoryFilter facets={facets} total={facetTotal} />
      <Separator />
      <PriceFilter maxPrice={maxPrice} />
      <Separator />
      <AvailabilityFilter />
    </div>
  );
}

function FilterTitle({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
      {children}
    </h3>
  );
}

function CategoryFilter({ facets, total }: { facets: CategoryFacet[]; total: number }) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <FilterTitle id={titleId}>Category</FilterTitle>
      <ul className="-mx-2.5 flex flex-col gap-0.5">
        <li>
          <CategoryLink slug={undefined} label="All products" count={total} />
        </li>
        {facets.map((facet) => (
          <li key={facet.slug}>
            <CategoryLink slug={facet.slug} label={facet.name} count={facet.count} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * A real link (crawlable, works without JavaScript, opens in a new tab with a
 * modifier key) that is upgraded to an optimistic, transition-based update on
 * a regular click.
 */
function CategoryLink({
  slug,
  label,
  count,
}: {
  slug: CategorySlug | undefined;
  label: string;
  count: number;
}) {
  const { filters, setFilters } = useShop();
  const isActive = filters.category === slug;

  return (
    <Link
      href={createShopHref({ ...filters, category: slug })}
      scroll={false}
      aria-current={isActive ? "true" : undefined}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
          return;
        }
        event.preventDefault();
        setFilters({ category: slug });
      }}
      className={cn(
        "group/category flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {/* Empty categories get a dashed indicator rather than faded text, so
          the label and its "0" count keep full text contrast. */}
      <span
        aria-hidden
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
          isActive
            ? "border-primary bg-primary text-primary-foreground"
            : "border-input group-hover/category:border-foreground/40",
          !isActive && count === 0 && "border-dashed",
        )}
      >
        {isActive && <CheckIcon className="size-2.5" strokeWidth={3} />}
      </span>
      <span className="flex-1 truncate">{label}</span>
      <span
        className={cn(
          "text-xs tabular-nums",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {count}
        <span className="sr-only"> {count === 1 ? "product" : "products"}</span>
      </span>
    </Link>
  );
}

function PriceFilter({ maxPrice }: { maxPrice: number }) {
  const titleId = useId();
  const { filters, setFilters } = useShop();
  // Local value while dragging; the URL only changes when the thumb is released.
  const [draft, setDraft] = useState<number[] | null>(null);

  const committed = [filters.minPrice ?? 0, filters.maxPrice ?? maxPrice];
  const [low, high] = draft ?? committed;

  function commit([nextLow, nextHigh]: number[]) {
    setDraft(null);
    if (nextLow === committed[0] && nextHigh === committed[1]) return;
    setFilters({
      minPrice: nextLow > 0 ? nextLow : undefined,
      maxPrice: nextHigh < maxPrice ? nextHigh : undefined,
    });
  }

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <FilterTitle id={titleId}>Price</FilterTitle>
        {/* Not a live region: thumbs announce their own values while dragging. */}
        <p className="text-sm tabular-nums">
          {formatPrice(low)} – {formatPrice(high)}
        </p>
      </div>
      <div role="group" aria-labelledby={titleId} className="px-1.5 py-1">
        <Slider
          min={0}
          max={maxPrice}
          step={PRICE_STEP}
          minStepsBetweenThumbs={1}
          value={[low, high]}
          onValueChange={setDraft}
          onValueCommit={commit}
        />
      </div>
      <div aria-hidden className="flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>{formatPrice(0)}</span>
        <span>{formatPrice(maxPrice)}</span>
      </div>
    </section>
  );
}

function AvailabilityFilter() {
  const titleId = useId();
  const { filters, setFilters } = useShop();

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-4">
      <FilterTitle id={titleId}>Availability</FilterTitle>
      <div className="flex flex-col gap-3">
        <FilterCheckbox
          label="In stock only"
          checked={filters.inStock}
          onCheckedChange={(checked) => setFilters({ inStock: checked })}
        />
        <FilterCheckbox
          label="On sale only"
          checked={filters.onSale}
          onCheckedChange={(checked) => setFilters({ onSale: checked })}
        />
      </div>
    </section>
  );
}

function FilterCheckbox({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const id = useId();

  return (
    <Field orientation="horizontal">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <FieldLabel htmlFor={id} className="font-normal">
        {label}
      </FieldLabel>
    </Field>
  );
}
