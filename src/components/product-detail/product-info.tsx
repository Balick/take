import { AddToCartForm } from "@/components/product-detail/add-to-cart-form";
import { Price } from "@/components/product/price";
import { ProductBadges } from "@/components/product/product-badges";
import { RatingStars } from "@/components/product/rating-stars";
import { siteConfig } from "@/config/site";
import type { Product } from "@/types";

const countFormatter = new Intl.NumberFormat(siteConfig.locale);

function reviewCountLabel(count: number) {
  return `${countFormatter.format(count)} ${count === 1 ? "review" : "reviews"}`;
}

export function ProductInfo({
  product,
  categoryName,
}: {
  product: Product;
  categoryName?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {categoryName && (
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {categoryName}
            </p>
          )}
          <ProductBadges product={product} />
        </div>

        <h1 className="font-display text-4xl tracking-tight text-balance sm:text-5xl">
          {product.name}
        </h1>

        <a
          href="#reviews"
          className="group/rating flex w-fit items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {product.reviewCount > 0 ? (
            <>
              <RatingStars rating={product.rating} />
              <span className="text-sm text-muted-foreground tabular-nums underline-offset-4 group-hover/rating:text-foreground group-hover/rating:underline">
                {/* Announced by RatingStars as "Rated 4.9 out of 5". */}
                <span aria-hidden>
                  <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
                  {" · "}
                </span>
                {reviewCountLabel(product.reviewCount)}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground underline-offset-4 group-hover/rating:text-foreground group-hover/rating:underline">
              No reviews yet, write the first one
            </span>
          )}
        </a>

        <Price
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="lg"
          showDiscount
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t pt-6">
        <p className="font-medium text-pretty">{product.tagline}</p>
        <p className="text-pretty text-muted-foreground">{product.description}</p>
      </div>

      {/* Only hand the client component the fields it needs. */}
      <AddToCartForm
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          images: product.images.slice(0, 1),
          stock: product.stock,
          sizes: product.sizes,
          colors: product.colors,
        }}
        className="mt-8"
      />
    </div>
  );
}
