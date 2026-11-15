import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { PageHeader } from "@/components/shared/page-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { maxCatalogPrice, sortOptions } from "@/lib/queries";
import type { Category } from "@/types";

import { ActiveFilters } from "./active-filters";
import { ClearFiltersButton } from "./clear-filters-button";
import { MobileFilters } from "./mobile-filters";
import { parseShopSearchParams, type RawSearchParams } from "./parse-search-params";
import { ProductFilters } from "./product-filters";
import { SearchForm } from "./search-form";
import { RESULTS_HEADING_ID, SHOP_PATH } from "./search-params";
import { getShopData, getShopHeading } from "./shop-data";
import { ShopEmptyState } from "./shop-empty-state";
import { ShopProvider, ShopResultsRegion } from "./shop-provider";
import { SortSelect } from "./sort-select";

/**
 * The URL-dependent part of /products. It awaits the search params, so the
 * page renders it inside <Suspense>: the layout and fallback form the static
 * shell, and this streams in per request.
 */
export async function ShopListing({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const filters = parseShopSearchParams(await searchParams);
  const { products, facets, facetTotal, categories, category } = await getShopData(filters);
  const heading = getShopHeading(filters, category);
  const panelProps = { facets, facetTotal, maxPrice: maxCatalogPrice };
  const count = products.length;

  return (
    <ShopProvider filters={filters}>
      <PageHeader
        // Lets a long unbroken search query wrap instead of overflowing on phones.
        title={<span className="wrap-anywhere">{heading.title}</span>}
        description={heading.description}
        breadcrumb={<ShopBreadcrumb category={category} />}
      />

      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
        <aside aria-labelledby="shop-filters-heading" className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-6 pb-8">
            <div className="flex items-center justify-between gap-2">
              <h2 id="shop-filters-heading" className="text-sm font-medium">
                Filters
              </h2>
              <ClearFiltersButton
                variant="ghost"
                size="xs"
                className="text-muted-foreground hover:text-foreground"
              />
            </div>
            <ProductFilters {...panelProps} />
          </div>
        </aside>

        <section aria-labelledby={RESULTS_HEADING_ID} className="flex min-w-0 flex-col gap-6">
          <h2 id={RESULTS_HEADING_ID} tabIndex={-1} className="sr-only">
            Products
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchForm className="sm:max-w-xs" />
            <div className="flex items-center justify-between gap-2">
              <MobileFilters {...panelProps} resultCount={count} className="lg:hidden" />
              <SortSelect options={sortOptions} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <p
              role="status"
              className="text-sm text-muted-foreground tabular-nums transition-opacity group-data-pending/shop:opacity-50"
            >
              {count} {count === 1 ? "product" : "products"}
            </p>
            <ActiveFilters facets={facets} />
          </div>

          <ShopResultsRegion>
            {count > 0 ? (
              <ProductGrid products={products} preloadCount={4} className="xl:grid-cols-3" />
            ) : (
              <ShopEmptyState
                filters={filters}
                category={category}
                suggestions={categories.filter((item) => item.slug !== category?.slug)}
              />
            )}
          </ShopResultsRegion>
        </section>
      </div>
    </ShopProvider>
  );
}

function ShopBreadcrumb({ category }: { category?: Category }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {category ? (
            <BreadcrumbLink asChild>
              <Link href={SHOP_PATH}>Shop</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Shop</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {category && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
