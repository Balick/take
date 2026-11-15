import { siteConfig } from "@/config/site";
import type { Product } from "@/types";

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

/**
 * schema.org `Product` structured data for rich results.
 * `<` is escaped so a product field can never close the script tag (XSS).
 */
export function ProductJsonLd({ product }: { product: Product }) {
  const url = absoluteUrl(`/products/${product.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map(absoluteUrl),
    description: product.description,
    sku: product.id,
    url,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url,
      price: product.price.toFixed(2),
      priceCurrency: siteConfig.currency,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating.toFixed(1),
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
