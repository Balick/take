import type { Metadata } from "next";

import { BrandStory } from "@/components/home/brand-story";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { NewArrivals } from "@/components/home/new-arrivals";
import { PromoBanner } from "@/components/home/promo-banner";
import { Testimonials } from "@/components/home/testimonials";
import { ValueProps } from "@/components/home/value-props";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { socialMetadata } from "@/lib/seo";

const description = `Heavyweight tees, long sleeves, dresses and accessories in a timeless monochrome palette. Free shipping on orders of ${formatPrice(siteConfig.freeShippingThreshold)} or more and ${siteConfig.returnWindowDays}-day free returns.`;

export const metadata: Metadata = {
  description,
  alternates: { canonical: "/" },
  ...socialMetadata({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description,
    path: "/",
  }),
};

/**
 * The catalog is read through the async data layer in `src/lib/queries.ts`.
 * The demo data is in-memory, so every section resolves during prerendering
 * and the whole page ships as static HTML. If you plug in a slow, uncached
 * backend, wrap the data-driven sections in <Suspense> with a skeleton
 * fallback (e.g. <ProductGridSkeleton count={4} />).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <NewArrivals />
      <Testimonials />
      <BrandStory />
    </>
  );
}
