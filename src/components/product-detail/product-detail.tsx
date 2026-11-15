import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProductAccordion } from "@/components/product-detail/product-accordion";
import { ProductBreadcrumb } from "@/components/product-detail/product-breadcrumb";
import { ProductGallery } from "@/components/product-detail/product-gallery";
import { ProductInfo } from "@/components/product-detail/product-info";
import { ProductJsonLd } from "@/components/product-detail/product-json-ld";
import { ProductPerks } from "@/components/product-detail/product-perks";
import {
  ProductReviews,
  ProductReviewsSkeleton,
} from "@/components/product-detail/product-reviews";
import {
  RelatedProducts,
  RelatedProductsSkeleton,
} from "@/components/product-detail/related-products";
import { getCategory, getProductBySlug } from "@/lib/queries";

/**
 * Everything on the product page that depends on the URL. Rendered inside a
 * <Suspense> boundary by the page so the route shell can be shared.
 */
export async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const category = await getCategory(product.category);

  return (
    <>
      <ProductJsonLd product={product} />

      <div className="container-page pt-6 pb-16 sm:pt-8 sm:pb-24">
        <ProductBreadcrumb product={product} category={category} />

        <div className="mt-6 grid gap-10 sm:mt-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 xl:gap-20">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductInfo product={product} categoryName={category?.name} />
            <ProductPerks className="mt-8" />
            <ProductAccordion product={product} className="mt-8" />
          </div>
        </div>
      </div>

      <Suspense fallback={<ProductReviewsSkeleton />}>
        <ProductReviews product={product} />
      </Suspense>

      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts product={product} category={category} />
      </Suspense>
    </>
  );
}
