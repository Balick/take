import { isCategorySlug, maxCatalogPrice, sortOptions } from "@/lib/queries";
import type { SortOption } from "@/types";

import { DEFAULT_SORT, MAX_QUERY_LENGTH, type ShopFilters } from "./search-params";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isSortOption(value: string | undefined): value is SortOption {
  return sortOptions.some((option) => option.value === value);
}

function parsePrice(value: string | undefined) {
  if (value === undefined || value.trim() === "") return undefined;
  const number = Number(value);
  if (!Number.isFinite(number)) return undefined;
  return Math.min(Math.max(Math.round(number), 0), maxCatalogPrice);
}

/**
 * Validates untrusted search params. Unknown categories and sort orders,
 * malformed numbers and out-of-range prices are ignored or clamped, so any URL
 * renders a sensible page.
 */
export function parseShopSearchParams(raw: RawSearchParams): ShopFilters {
  const category = first(raw.category);
  const sort = first(raw.sort);
  const query = first(raw.q)?.trim().replace(/\s+/g, " ").slice(0, MAX_QUERY_LENGTH);
  const sale = first(raw.sale);
  const stock = first(raw.stock);

  let minPrice = parsePrice(first(raw.min));
  let maxPrice = parsePrice(first(raw.max));
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  return {
    category: isCategorySlug(category) ? category : undefined,
    query: query || undefined,
    // Bounds equal to the full catalog range don't narrow anything.
    minPrice: minPrice ? minPrice : undefined,
    maxPrice: maxPrice !== undefined && maxPrice < maxCatalogPrice ? maxPrice : undefined,
    onSale: sale === "1" || sale === "true",
    inStock: stock === "1" || stock === "true",
    sort: isSortOption(sort) ? sort : DEFAULT_SORT,
  };
}
