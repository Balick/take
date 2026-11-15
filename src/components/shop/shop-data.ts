import { cacheTag } from "next/cache";

import { getCategories, getProducts } from "@/lib/queries";
import type { Category } from "@/types";

import { type CategoryFacet, type ShopFilters, truncateQuery } from "./search-params";

/**
 * Everything the listing needs for one combination of filters: the sorted
 * results, plus per-category counts computed against the other filters so the
 * sidebar shows how many products each category would return.
 *
 * Cached with `use cache` and keyed by the (already validated) filters, so the
 * results can be included in per-link prefetches (`<Link prefetch>`) and are
 * computed once per combination. Call `revalidateTag("products")` after
 * catalog updates when you plug in a real backend.
 */
export async function getShopData(filters: ShopFilters) {
  "use cache";
  cacheTag("products");

  const { category, query, minPrice, maxPrice, onSale, inStock, sort } = filters;
  const [products, facetProducts, categories] = await Promise.all([
    getProducts({ category, query, minPrice, maxPrice, onSale, inStock, sort }),
    getProducts({ query, minPrice, maxPrice, onSale, inStock }),
    getCategories(),
  ]);

  const facets: CategoryFacet[] = categories.map((item) => ({
    slug: item.slug,
    name: item.name,
    count: facetProducts.filter((product) => product.category === item.slug).length,
  }));

  return {
    products,
    facets,
    /** Matches across all categories, shown next to "All". */
    facetTotal: facetProducts.length,
    categories,
    category: categories.find((item) => item.slug === category),
  };
}

const genericDescription =
  "Heavyweight essentials, effortless dresses and everyday carry, designed in black and built to last.";

/** Page title and intro copy for the current filters (h1, breadcrumb and metadata). */
export function getShopHeading(filters: ShopFilters, category?: Category) {
  if (category) {
    return {
      title: category.name,
      metaTitle: filters.onSale ? `${category.name} on sale` : category.name,
      description: category.description,
    };
  }
  if (filters.query) {
    return {
      title: `Search results for “${truncateQuery(filters.query)}”`,
      metaTitle: `Search: ${filters.query}`,
      description: "Everything in the collection that matches your search, across every category.",
    };
  }
  if (filters.onSale) {
    return {
      title: "Sale",
      metaTitle: "Sale",
      description:
        "Last-chance pieces at reduced prices. Limited quantities, and once they're gone, they're gone.",
    };
  }
  return {
    title: "Shop all",
    metaTitle: "Shop all",
    description: genericDescription,
  };
}
