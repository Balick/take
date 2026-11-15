"use client";

import { XIcon } from "lucide-react";
import { useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

import { type CategoryFacet, RESULTS_HEADING_ID, type ShopFilters } from "./search-params";
import { useShop } from "./shop-provider";

interface Chip {
  key: string;
  label: string;
  remove: Partial<ShopFilters>;
}

function priceLabel(minPrice?: number, maxPrice?: number) {
  if (minPrice !== undefined && maxPrice !== undefined) {
    return `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;
  }
  if (maxPrice !== undefined) return `Under ${formatPrice(maxPrice)}`;
  return `Over ${formatPrice(minPrice ?? 0)}`;
}

function getChips(filters: ShopFilters, facets: CategoryFacet[]): Chip[] {
  const chips: Chip[] = [];
  if (filters.query) {
    chips.push({ key: "query", label: `“${filters.query}”`, remove: { query: undefined } });
  }
  if (filters.category) {
    const name = facets.find((facet) => facet.slug === filters.category)?.name;
    chips.push({
      key: "category",
      label: `Category: ${name ?? filters.category}`,
      remove: { category: undefined },
    });
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    chips.push({
      key: "price",
      label: priceLabel(filters.minPrice, filters.maxPrice),
      remove: { minPrice: undefined, maxPrice: undefined },
    });
  }
  if (filters.onSale) {
    chips.push({ key: "sale", label: "On sale", remove: { onSale: false } });
  }
  if (filters.inStock) {
    chips.push({ key: "stock", label: "In stock", remove: { inStock: false } });
  }
  return chips;
}

/** Removable chips for every active filter, plus "Clear all". */
export function ActiveFilters({
  facets,
  className,
}: {
  facets: CategoryFacet[];
  className?: string;
}) {
  const { filters, setFilters, clearFilters } = useShop();
  const listRef = useRef<HTMLUListElement>(null);
  const chips = getChips(filters, facets);

  if (chips.length === 0) return null;

  // The removed chip unmounts with focus inside it: hand focus to the next
  // control in the row so keyboard users keep their place.
  function moveFocusAfterRemoval(index: number) {
    requestAnimationFrame(() => {
      const controls = listRef.current?.querySelectorAll<HTMLButtonElement>("button");
      const next = controls?.[Math.min(index, controls.length - 1)];
      (next ?? document.getElementById(RESULTS_HEADING_ID))?.focus();
    });
  }

  return (
    <ul
      ref={listRef}
      aria-label="Active filters"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {chips.map((chip, index) => (
        <li key={chip.key}>
          <Badge
            asChild
            variant="secondary"
            className="h-7 gap-1.5 px-2.5 text-xs font-normal hover:bg-secondary/70 [&>svg]:size-3.5! [&>svg]:text-muted-foreground"
          >
            <button
              type="button"
              aria-label={`Remove filter: ${chip.label}`}
              onClick={() => {
                setFilters(chip.remove);
                moveFocusAfterRemoval(index);
              }}
              className="max-w-64 cursor-pointer"
            >
              <span className="truncate">{chip.label}</span>
              <XIcon aria-hidden />
            </button>
          </Badge>
        </li>
      ))}
      {chips.length > 1 && (
        <li>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => {
              clearFilters();
              moveFocusAfterRemoval(0);
            }}
            className="h-7 px-1.5 text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </li>
      )}
    </ul>
  );
}
