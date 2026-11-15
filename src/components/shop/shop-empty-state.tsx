import { SearchXIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Category } from "@/types";

import { ClearFiltersButton } from "./clear-filters-button";
import {
  createShopHref,
  hasActiveFilters,
  hasPriceFilter,
  RESULTS_HEADING_ID,
  type ShopFilters,
  truncateQuery,
} from "./search-params";

function getEmptyCopy(filters: ShopFilters, category?: Category) {
  if (filters.query) {
    return {
      title: `No results for “${truncateQuery(filters.query)}”`,
      description: category
        ? `Nothing in ${category.name} matches your search. Try the whole collection or a broader term like “tee” or “bottle”.`
        : "Check the spelling or try a broader term like “tee”, “dress” or “bottle”.",
    };
  }
  if (filters.onSale && !category && !hasPriceFilter(filters)) {
    return {
      title: "Nothing on sale right now",
      description:
        "Our markdowns have sold through. New ones land regularly, so check back soon or browse the full collection.",
    };
  }
  if (hasPriceFilter(filters)) {
    return {
      title: "Nothing in this price range",
      description: "Try widening the price range or removing a filter to see more pieces.",
    };
  }
  if (category) {
    return {
      title: `Nothing in ${category.name} matches these filters`,
      description: "Remove a filter or explore another category.",
    };
  }
  if (!hasActiveFilters(filters)) {
    return {
      title: "The collection is empty",
      description: "New pieces are on their way. Check back soon.",
    };
  }
  return {
    title: "No products match these filters",
    description: "Remove a filter or explore another category.",
  };
}

export function ShopEmptyState({
  filters,
  category,
  suggestions,
}: {
  filters: ShopFilters;
  category?: Category;
  /** Categories offered as a fresh start. */
  suggestions: Category[];
}) {
  const copy = getEmptyCopy(filters, category);

  return (
    <Empty className="rounded-2xl border border-dashed bg-muted/30 py-16 sm:py-20">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="size-10 rounded-full bg-background ring-1 ring-border"
        >
          <SearchXIcon className="size-5" aria-hidden />
        </EmptyMedia>
        {/* Sits under the results h2, so it is exposed as the next heading level. */}
        <EmptyTitle
          role="heading"
          aria-level={3}
          className="font-display text-2xl font-normal text-balance wrap-anywhere sm:text-3xl"
        >
          {copy.title}
        </EmptyTitle>
        <EmptyDescription>{copy.description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="gap-6">
        {hasActiveFilters(filters) && (
          <div className="flex flex-wrap justify-center gap-2">
            <ClearFiltersButton size="lg" className="px-4" focusTargetId={RESULTS_HEADING_ID}>
              Clear filters
            </ClearFiltersButton>
            {filters.query && category && (
              <Button asChild variant="outline" size="lg" className="px-4">
                <Link href={createShopHref({ query: filters.query, sort: filters.sort })}>
                  Search all categories
                </Link>
              </Button>
            )}
          </div>
        )}
        {suggestions.length > 0 && (
          <nav aria-label="Browse categories" className="flex flex-col items-center gap-3">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Or browse
            </p>
            <ul className="flex flex-wrap justify-center gap-2">
              {suggestions.map((item) => (
                <li key={item.slug}>
                  <Button asChild variant="outline" size="sm" className="rounded-full px-3">
                    <Link href={createShopHref({ category: item.slug })}>{item.name}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </EmptyContent>
    </Empty>
  );
}
