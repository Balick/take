import { cache } from "react";

import { getProducts } from "@/lib/queries";
import { getStoreStats } from "@/lib/store-stats";
import type { CategorySlug, Product } from "@/types";

/**
 * Data for the About page, read from the catalog so the imagery and figures
 * follow your products when you replace the demo data.
 */
export const getAboutData = cache(async () => {
  const [products, { rating, reviewCount }] = await Promise.all([
    getProducts({ sort: "rating" }),
    getStoreStats(),
  ]);

  /** An image from a category (falls back to any product), `index` picks a view. */
  function imageFrom(category: CategorySlug, index = 0) {
    const product: Product | undefined =
      products.find((item) => item.category === category) ?? products[0];
    return product?.images[index] ?? product?.images[0];
  }

  return {
    productCount: products.length,
    reviewCount,
    rating,
    images: {
      heroPrimary: imageFrom("dresses"),
      heroSecondary: imageFrom("t-shirts", 1),
      heroTertiary: imageFrom("accessories"),
      studio: imageFrom("long-sleeves", 1),
      lasting: imageFrom("drinkware"),
    },
  };
});
