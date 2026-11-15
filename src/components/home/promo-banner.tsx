import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { heroButtonClassName } from "@/components/home/styles";
import { Price } from "@/components/product/price";
import { Button } from "@/components/ui/button";
import { discountPercent } from "@/lib/format";
import { getProducts } from "@/lib/queries";
import { cn } from "@/lib/utils";

export async function PromoBanner() {
  const saleProducts = await getProducts({ onSale: true });

  const ranked = saleProducts
    .map((product) => ({ product, discount: discountPercent(product.price, product.compareAtPrice) }))
    .sort((a, b) => b.discount - a.discount);
  const top = ranked[0];

  if (!top) return null;

  // Editorial rounding ("up to 40%") that never overstates the real discount.
  const headlineDiscount = top.discount >= 10 ? Math.floor(top.discount / 5) * 5 : top.discount;
  const { product } = top;

  return (
    <section className="container-page">
      <div className="grid overflow-hidden rounded-2xl bg-primary text-primary-foreground md:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-5 p-8 sm:p-12 lg:p-16">
          <p className="text-xs font-medium tracking-widest text-primary-foreground/70 uppercase">
            The sale edit
          </p>
          <h2 className="font-display text-4xl leading-none tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Up to {headlineDiscount}% off <em className="italic">selected</em> styles
          </h2>
          <p className="max-w-md text-pretty text-primary-foreground/75">
            {saleProducts.length} {saleProducts.length === 1 ? "piece" : "pieces"} marked down for a
            limited time, while stock lasts in the sizes and colors we have left.
          </p>
          <Button asChild size="lg" variant="secondary" className={cn("mt-2", heroButtonClassName)}>
            <Link href="/products?sale=1">
              Shop the sale
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>

        <div className="relative min-h-80 bg-neutral-100 sm:min-h-96 md:min-h-[30rem] dark:bg-neutral-200">
          <Image
            src={product.images[0]}
            alt=""
            fill
            sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
            className="object-contain p-10 pb-24 mix-blend-multiply sm:p-14 sm:pb-24"
          />
          <span className="absolute top-4 right-4 rounded-full bg-sale px-3 py-1 text-sm font-medium text-sale-foreground tabular-nums">
            <span aria-hidden>-{top.discount}%</span>
            <span className="sr-only">{top.discount}% off</span>
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="absolute inset-x-4 bottom-4 flex flex-col gap-0.5 rounded-xl bg-background/90 px-4 py-3 text-foreground backdrop-blur transition-colors outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50 sm:right-auto sm:min-w-64"
          >
            <span className="text-sm font-medium">{product.name}</span>
            <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
