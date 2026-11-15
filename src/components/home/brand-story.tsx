import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { getStoreStats } from "@/lib/store-stats";
import { heroButtonClassName } from "@/components/home/styles";
import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getProducts } from "@/lib/queries";
import { cn } from "@/lib/utils";

export async function BrandStory() {
  const [stats, tees] = await Promise.all([
    getStoreStats(),
    getProducts({ category: "t-shirts", sort: "rating" }),
  ]);
  const product = tees[0] ?? (await getProducts({ sort: "rating" }))[0];

  const figures = [
    { value: "100%", label: "Cotton in every tee and long sleeve" },
    { value: `${siteConfig.returnWindowDays} days`, label: "To return anything, free of charge" },
    ...(stats.reviewCount > 0
      ? [
          {
            value: stats.rating.toFixed(1),
            label: `Average rating from ${stats.reviewCountLabel} reviews`,
          },
        ]
      : []),
  ];

  return (
    <section className="container-page py-16 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {product && (
          <div className="relative">
            <ProductImage
              // The back view tells more of the story when there is one.
              src={product.images[1] ?? product.images[0]}
              alt=""
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
              className="rounded-2xl"
              imageClassName="p-10 sm:p-16"
            />
            <p className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
              Designed in-house, made in small batches
            </p>
          </div>
        )}

        <div className="flex flex-col items-start gap-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Our approach
          </p>
          <h2 className="font-display text-4xl leading-none tracking-tight text-balance sm:text-5xl">
            Made with <em className="italic">intention</em>
          </h2>
          <div className="flex max-w-xl flex-col gap-4 text-pretty text-muted-foreground">
            <p>
              {siteConfig.name} started with a simple idea: own fewer, better things. Every piece is
              designed in-house, produced in small batches and worn for months before it ever
              reaches the shop.
            </p>
            <p>
              No trend-chasing and no throwaway fast fashion. Just honest fabrics, fair pricing and
              a monochrome palette that works with everything already in your wardrobe.
            </p>
          </div>

          <dl
            className={cn(
              "grid w-full gap-4 border-t pt-8 sm:gap-8",
              figures.length === 3 ? "grid-cols-3" : "grid-cols-2",
            )}
          >
            {figures.map((figure) => (
              <div key={figure.value} className="flex flex-col-reverse gap-1">
                <dt className="text-xs text-pretty text-muted-foreground sm:text-sm">
                  {figure.label}
                </dt>
                <dd className="font-display text-2xl tracking-tight tabular-nums min-[400px]:text-3xl sm:text-4xl">
                  {figure.value}
                </dd>
              </div>
            ))}
          </dl>

          <Button asChild size="lg" variant="outline" className={cn("mt-2", heroButtonClassName)}>
            <Link href="/about">
              Read our story
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
