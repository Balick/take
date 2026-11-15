import { cache } from "react";

import { siteConfig } from "@/config/site";
import { getProducts } from "@/lib/queries";

/**
 * Catalog-wide social proof (average rating and review volume), derived from
 * the product data so the homepage never advertises numbers the catalog
 * can't back up. Memoized per request: the hero and the brand story share it.
 */
export const getStoreStats = cache(async () => {
  const products = await getProducts();
  const reviewCount = products.reduce((total, product) => total + product.reviewCount, 0);
  const weightedRating = products.reduce(
    (total, product) => total + product.rating * product.reviewCount,
    0,
  );
  const rating = reviewCount > 0 ? Math.round((weightedRating / reviewCount) * 10) / 10 : 0;

  // "1,100+" reads better than "1,199" and stays truthful. The "+" is only
  // added when the real total is actually above the rounded figure.
  const rounded = reviewCount >= 100 ? Math.floor(reviewCount / 100) * 100 : reviewCount;
  const reviewCountLabel = `${new Intl.NumberFormat(siteConfig.locale).format(rounded)}${
    rounded < reviewCount ? "+" : ""
  }`;

  return { rating, reviewCount, reviewCountLabel };
});
