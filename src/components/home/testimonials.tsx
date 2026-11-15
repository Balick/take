import { QuoteIcon } from "lucide-react";
import Link from "next/link";

import { getStoreStats } from "@/lib/store-stats";
import { ProductImage } from "@/components/product/product-image";
import { RatingStars } from "@/components/product/rating-stars";
import { SectionHeading } from "@/components/shared/section-heading";
import { getProductBySlug } from "@/lib/queries";

/** Edit these to feature your own customers. `productSlug` links the quote to a product. */
const testimonials = [
  {
    quote:
      "The heaviest tee I own, and it still looks new after months of weekly washes. The back print hasn't cracked or faded at all.",
    author: "Jordan P.",
    location: "Portland, OR",
    rating: 5,
    productSlug: "emblem-back-print-tee",
  },
  {
    quote:
      "Flattering without trying too hard. I've worn it to the office with a blazer and to dinner with sandals, and got compliments both times.",
    author: "Camille D.",
    location: "Brooklyn, NY",
    rating: 5,
    productSlug: "ribbed-midi-dress",
  },
  {
    quote:
      "Warm, soft and not itchy, which is rare for a beanie. Ordered on Monday, wore it on Wednesday. Already eyeing a second one.",
    author: "Ethan W.",
    location: "Denver, CO",
    rating: 4,
    productSlug: "classic-knit-beanie",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function Testimonials() {
  const [stats, products] = await Promise.all([
    getStoreStats(),
    Promise.all(testimonials.map((testimonial) => getProductBySlug(testimonial.productSlug))),
  ]);

  return (
    <section className="bg-muted/40 py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Reviews"
          title={
            <>
              Worn, washed and <em className="italic">loved</em>
            </>
          }
          description={
            stats.reviewCount > 0
              ? `Rated ${stats.rating.toFixed(1)} out of 5 across ${stats.reviewCountLabel} customer reviews.`
              : undefined
          }
        />

        <ul className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const product = products[index];

            return (
              <li key={testimonial.author}>
                <figure className="flex h-full flex-col gap-6 rounded-2xl border bg-background p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <RatingStars rating={testimonial.rating} />
                    <QuoteIcon className="size-6 text-muted-foreground/40" aria-hidden />
                  </div>

                  <blockquote className="flex-1 text-base leading-relaxed text-pretty">
                    <p>&ldquo;{testimonial.quote}&rdquo;</p>
                  </blockquote>

                  <figcaption className="flex flex-col gap-4 border-t pt-6">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                        aria-hidden
                      >
                        {initials(testimonial.author)}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-sm font-medium">{testimonial.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {testimonial.location}
                        </span>
                      </span>
                    </div>

                    {product && (
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex items-center gap-3 rounded-xl bg-muted/60 p-2 pr-3 transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <ProductImage
                          src={product.images[0]}
                          alt=""
                          sizes="48px"
                          className="size-12 shrink-0 rounded-lg"
                          imageClassName="p-1.5"
                        />
                        <span className="flex min-w-0 flex-col">
                          <span className="text-xs text-muted-foreground">Purchased</span>
                          <span className="truncate text-sm font-medium">{product.name}</span>
                        </span>
                      </Link>
                    )}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
