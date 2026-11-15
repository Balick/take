import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getCategories, getProducts } from "@/lib/queries";

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

/** Indexable static pages. Private pages (cart, checkout, account, wishlist) are left out. */
const staticPages: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/products", changeFrequency: "daily", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
];

/**
 * Generated at build time from the data layer: add a product to the catalog
 * and it shows up here automatically. Dates come from the data (never
 * `new Date()`), so the output stays deterministic and fully prerendered.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const latestProductDate = products.reduce<string | undefined>(
    (latest, product) =>
      !latest || product.createdAt > latest ? product.createdAt : latest,
    undefined,
  );

  return [
    ...staticPages.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      // The home and shop pages change whenever the catalog does.
      lastModified: path === "/" || path === "/products" ? latestProductDate : undefined,
      changeFrequency,
      priority,
    })),
    ...categories.map((category) => {
      const latestInCategory = products
        .filter((product) => product.category === category.slug)
        .reduce<string | undefined>(
          (latest, product) =>
            !latest || product.createdAt > latest ? product.createdAt : latest,
          undefined,
        );

      return {
        url: absoluteUrl(`/products?category=${category.slug}`),
        lastModified: latestInCategory,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: [absoluteUrl(category.image)],
      };
    }),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: product.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: product.images.map(absoluteUrl),
    })),
  ];
}
