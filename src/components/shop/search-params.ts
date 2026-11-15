import type { CategorySlug, SortOption } from "@/types";

/**
 * The shop listing is driven entirely by the URL, so every filter combination
 * is shareable, bookmarkable and crawlable. This module is the single source of
 * truth for writing those search params (parsing lives in `parse-search-params.ts`,
 * which reads the catalog and therefore stays on the server). It has no
 * dependencies so Client Components can import it without pulling the catalog
 * into the browser bundle.
 *
 *   /products?category=t-shirts&sort=price-asc&q=logo&sale=1&stock=1&min=20&max=60
 */

export const SHOP_PATH = "/products";
export const DEFAULT_SORT: SortOption = "featured";
export const PRICE_STEP = 5;
/** Longest accepted search query; longer `?q=` values are truncated. */
export const MAX_QUERY_LENGTH = 80;
/** Longest query echoed back in headings; longer ones end with an ellipsis. */
const DISPLAY_QUERY_LENGTH = 40;
/** Id of the (visually hidden) results heading, used as a focus fallback. */
export const RESULTS_HEADING_ID = "shop-results-heading";

export interface ShopFilters {
  category?: CategorySlug;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale: boolean;
  /** Hides sold-out products. */
  inStock: boolean;
  sort: SortOption;
}

export interface CategoryFacet {
  slug: CategorySlug;
  name: string;
  /** Products in this category that match every other active filter. */
  count: number;
}

export const emptyShopFilters: ShopFilters = { onSale: false, inStock: false, sort: DEFAULT_SORT };

/** Serializes filters into a canonical, minimal `/products?…` URL. */
export function createShopHref(filters: Partial<ShopFilters>) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.query) params.set("q", filters.query);
  if (filters.onSale) params.set("sale", "1");
  if (filters.inStock) params.set("stock", "1");
  if (filters.minPrice) params.set("min", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("max", String(filters.maxPrice));
  if (filters.sort && filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort);

  const search = params.toString();
  return search ? `${SHOP_PATH}?${search}` : SHOP_PATH;
}

export function hasPriceFilter(filters: ShopFilters) {
  return filters.minPrice !== undefined || filters.maxPrice !== undefined;
}

/** Number of filters set from the filter panel (category, price, sale, stock). */
export function countPanelFilters(filters: ShopFilters) {
  return [
    Boolean(filters.category),
    hasPriceFilter(filters),
    filters.onSale,
    filters.inStock,
  ].filter(Boolean).length;
}

/** Shortens a search query echoed in headings, so a long one doesn't dominate the page. */
export function truncateQuery(query: string) {
  // Code points, so an emoji is never split into a lone surrogate.
  const chars = Array.from(query);
  return chars.length > DISPLAY_QUERY_LENGTH
    ? `${chars.slice(0, DISPLAY_QUERY_LENGTH - 1).join("").trimEnd()}…`
    : query;
}

/** True when anything other than the sort order narrows the results. */
export function hasActiveFilters(filters: ShopFilters) {
  return countPanelFilters(filters) > 0 || Boolean(filters.query);
}

/** Filters reset to the full catalog, keeping the chosen sort order. */
export function clearShopFilters(filters: ShopFilters): ShopFilters {
  return { ...emptyShopFilters, sort: filters.sort };
}
