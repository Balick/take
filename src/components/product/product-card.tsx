import Link from "next/link";

import { Price } from "@/components/product/price";
import { ProductBadges } from "@/components/product/product-badges";
import { ProductImage } from "@/components/product/product-image";
import { QuickAdd } from "@/components/product/quick-add";
import { RatingStars } from "@/components/product/rating-stars";
import { WishlistButton } from "@/components/product/wishlist-button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  preload?: boolean;
  className?: string;
}

export function ProductCard({ product, preload, className }: ProductCardProps) {
  const href = `/products/${product.slug}`;
  const secondImage = product.images[1];

  return (
    <article className={cn("group/card relative flex flex-col gap-3", className)}>
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden>
          <ProductImage
            src={product.images[0]}
            alt=""
            preload={preload}
            imageClassName={cn(
              "transition-[opacity,scale] duration-500 ease-out group-hover/card:scale-105",
              secondImage && "group-hover/card:opacity-0",
            )}
          />
          {secondImage && (
            <ProductImage
              src={secondImage}
              alt=""
              className="absolute inset-0 bg-transparent dark:bg-transparent"
              imageClassName="opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            />
          )}
        </Link>

        <ProductBadges product={product} className="absolute top-3 right-14 left-3" />

        <WishlistButton
          productId={product.id}
          productName={product.name}
          className="absolute top-3 right-3"
        />

        <div className="absolute inset-x-3 bottom-3 translate-y-1 opacity-100 transition-all duration-300 sm:opacity-0 sm:group-focus-within/card:translate-y-0 sm:group-focus-within/card:opacity-100 sm:group-hover/card:translate-y-0 sm:group-hover/card:opacity-100">
          <QuickAdd product={product} />
        </div>
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium">
            <Link
              href={href}
              className="underline-offset-4 outline-none hover:underline focus-visible:underline"
            >
              {product.name}
            </Link>
          </h3>
          <Price
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="sm"
            className="shrink-0 justify-end"
          />
        </div>
        <p className="line-clamp-1 text-sm text-muted-foreground">{product.tagline}</p>
        <div className="flex items-center justify-between gap-3">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          {product.colors.length > 1 && (
            <div className="flex items-center -space-x-1">
              <span className="sr-only">
                Available in {product.colors.map((color) => color.name).join(", ")}
              </span>
              {product.colors.map((color) => (
                <span
                  key={color.name}
                  aria-hidden
                  title={color.name}
                  className="size-3.5 rounded-full border-2 border-background ring-1 ring-border"
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
