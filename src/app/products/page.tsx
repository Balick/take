import type { Metadata } from "next";
import { Suspense } from "react";

import { parseShopSearchParams } from "@/components/shop/parse-search-params";
import { createShopHref } from "@/components/shop/search-params";
import { getShopHeading } from "@/components/shop/shop-data";
import { ShopListing } from "@/components/shop/shop-listing";
import { ShopSkeleton } from "@/components/shop/shop-skeleton";
import { getCategory } from "@/lib/queries";
import { socialMetadata } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: PageProps<"/products">): Promise<Metadata> {
  const filters = parseShopSearchParams(await searchParams);
  const category = filters.category ? await getCategory(filters.category) : undefined;
  const { metaTitle, description } = getShopHeading(filters, category);
  // Category and sale pages are the indexable landing pages; every other
  // combination (sort orders, price ranges, in-stock only...) points back to one of them.
  const landingPage = createShopHref({ category: filters.category, onSale: filters.onSale });
  const isSearch = Boolean(filters.query);

  return {
    title: metaTitle,
    description,
    // Search result pages are thin, near-duplicate content: keep them out of
    // the index but let crawlers follow the product links. They get no
    // canonical, since `noindex` plus a canonical sends conflicting signals.
    alternates: isSearch ? undefined : { canonical: landingPage },
    robots: isSearch ? { index: false, follow: true } : undefined,
    ...socialMetadata({
      title: metaTitle,
      description,
      path: isSearch
        ? createShopHref({ category: filters.category, onSale: filters.onSale, query: filters.query })
        : landingPage,
    }),
  };
}

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <div className="container-page pb-16 sm:pb-24">
      <Suspense fallback={<ShopSkeleton />}>
        <ShopListing searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
