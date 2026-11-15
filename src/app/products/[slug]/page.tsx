import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductDetail } from "@/components/product-detail/product-detail";
import { ProductDetailSkeleton } from "@/components/product-detail/product-detail-skeleton";
import { siteConfig } from "@/config/site";
import { getProductBySlug, getProducts } from "@/lib/queries";

/** Prerender every product page at build time. */
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const url = `/products/${product.slug}`;
  const images = product.images.slice(0, 1).map((image) => ({
    url: image,
    alt: product.name,
  }));

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: product.name,
      description: product.description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: images.map((image) => image.url),
    },
  };
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  // `params` is read inside the boundary so the route's shared App Shell
  // (used by Partial Prefetching) stays independent of the product URL.
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}
