import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    // Same light-mode colors as the `viewport.themeColor` of the root layout.
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["shopping", "lifestyle"],
    icons: [
      {
        // Served from `src/app/icon.svg`.
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
