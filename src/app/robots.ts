import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/** Private, per-visitor pages that have no value in search results. */
const privatePaths = ["/cart", "/checkout", "/account", "/wishlist"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: privatePaths,
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
