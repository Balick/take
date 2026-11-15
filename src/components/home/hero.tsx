import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

import { getStoreStats } from "@/lib/store-stats";
import { heroButtonClassName } from "@/components/home/styles";
import { Price } from "@/components/product/price";
import { ProductImage } from "@/components/product/product-image";
import { RatingStars } from "@/components/product/rating-stars";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/queries";
import { cn } from "@/lib/utils";

/** Entrance animation, only for visitors who haven't asked for reduced motion. */
const enter =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:ease-out motion-safe:fill-mode-both";

const reviewerInitials = ["AK", "LM", "SR", "JP"];

export async function Hero() {
  const [featured, stats] = await Promise.all([getFeaturedProducts(3), getStoreStats()]);

  // Lead with the most-reviewed garment (products with sizes); accessories and
  // drinkware make better supporting shots.
  const [main, ...secondary] = [...featured].sort(
    (a, b) =>
      Number(b.sizes.length > 0) - Number(a.sizes.length > 0) || b.reviewCount - a.reviewCount,
  );

  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid items-center gap-12 pt-10 pb-16 sm:pt-16 sm:pb-24 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col items-start gap-6 lg:col-span-6 xl:col-span-5">
          <p
            className={cn(
              "inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground",
              enter,
            )}
          >
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            New essentials just landed
          </p>

          <h1
            className={cn(
              "font-display text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl",
              enter,
              "motion-safe:delay-100",
            )}
          >
            Everyday essentials, made to <em className="italic">last.</em>
          </h1>

          <p
            className={cn(
              "max-w-md text-lg text-pretty text-muted-foreground",
              enter,
              "motion-safe:delay-150",
            )}
          >
            Heavyweight cotton, considered details and a monochrome palette that never goes out of
            style. Designed in small batches, built for daily wear.
          </p>

          <div className={cn("flex flex-wrap gap-3", enter, "motion-safe:delay-200")}>
            <Button asChild size="lg" className={heroButtonClassName}>
              <Link href="/products">
                Shop the collection
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className={heroButtonClassName}>
              <Link href="/products?sort=newest">New arrivals</Link>
            </Button>
          </div>

          {stats.reviewCount > 0 && (
            <div className={cn("flex items-center gap-3 pt-2", enter, "motion-safe:delay-300")}>
              <div className="flex -space-x-2" aria-hidden>
                {reviewerInitials.map((initials) => (
                  <span
                    key={initials}
                    className="grid size-9 place-items-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background"
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-0.5">
                {/* The sentence below already states the rating for screen readers. */}
                <div aria-hidden>
                  <RatingStars rating={stats.rating} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{stats.rating.toFixed(1)}/5</span>{" "}
                  from {stats.reviewCountLabel} reviews
                </p>
              </div>
            </div>
          )}
        </div>

        {main && (
          <div
            className={cn("relative lg:col-span-6 xl:col-span-7", enter, "motion-safe:delay-150")}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <ProductImage
                src={main.images[0]}
                alt={main.name}
                preload
                sizes="(min-width: 1280px) 420px, (min-width: 1024px) 30vw, 58vw"
                className="aspect-[3/4] w-7/12 rounded-2xl"
                imageClassName="p-6 sm:p-10"
              />
              {secondary.length > 0 && (
                <div className="flex w-5/12 flex-col gap-3 pt-10 sm:gap-4 sm:pt-16">
                  {secondary.map((product) => (
                    <ProductImage
                      key={product.id}
                      src={product.images[0]}
                      alt=""
                      sizes="(min-width: 1280px) 300px, (min-width: 1024px) 21vw, 42vw"
                      className="aspect-square rounded-2xl"
                      imageClassName="p-5 sm:p-8"
                    />
                  ))}
                </div>
              )}
            </div>

            <div
              className={cn(
                "absolute bottom-4 left-3 max-w-[calc(100%-1.5rem)] sm:bottom-8 sm:left-6",
                enter,
                "motion-safe:delay-500",
              )}
            >
              <Link
                href={`/products/${main.slug}`}
                className="group/featured flex items-center gap-4 rounded-2xl border bg-background/90 p-3 pl-4 shadow-lg backdrop-blur-md transition-transform duration-300 outline-none motion-safe:hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[0.7rem] font-medium tracking-widest text-muted-foreground uppercase">
                    Featured
                  </span>
                  <span className="truncate text-sm font-medium">{main.name}</span>
                  <Price price={main.price} compareAtPrice={main.compareAtPrice} size="sm" />
                </div>
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 motion-safe:group-hover/featured:rotate-45"
                  aria-hidden
                >
                  <ArrowUpRightIcon className="size-4" />
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
