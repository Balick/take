import { BadgeCheckIcon, MessageSquareTextIcon, StarIcon } from "lucide-react";

import { getRatingDistribution } from "@/components/product-detail/rating-distribution";
import { WriteReviewDialog } from "@/components/product-detail/write-review-dialog";
import { RatingStars } from "@/components/product/rating-stars";
import { SectionHeading } from "@/components/shared/section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/format";
import { getProductReviews } from "@/lib/queries";
import type { Product, Review } from "@/types";

const numberFormatter = new Intl.NumberFormat(siteConfig.locale);

function pluralizeReviews(count: number) {
  return `${numberFormatter.format(count)} ${count === 1 ? "review" : "reviews"}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function ProductReviews({
  product,
}: {
  product: Pick<Product, "id" | "name" | "rating" | "reviewCount">;
}) {
  const reviews = await getProductReviews(product.id);
  const hasRatings = product.reviewCount > 0;
  const distribution = getRatingDistribution(product.rating, product.reviewCount);

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-20 border-t">
      <div className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16 xl:gap-24">
        <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            eyebrow="Reviews"
            title={<span id="reviews-heading">What customers say</span>}
            className="mb-0 sm:mb-0"
          />

          <div className="flex flex-col gap-6 rounded-2xl border p-6">
            {hasRatings ? (
              <>
                <div className="flex items-end gap-4">
                  <p className="font-display text-7xl leading-none tracking-tight tabular-nums">
                    {product.rating.toFixed(1)}
                    <span className="sr-only"> out of 5</span>
                  </p>
                  <div className="flex flex-col gap-1.5 pb-1">
                    <RatingStars rating={product.rating} />
                    <p className="text-sm text-muted-foreground">
                      Based on {pluralizeReviews(product.reviewCount)}
                    </p>
                  </div>
                </div>

                <ul aria-label="Rating breakdown" className="flex flex-col gap-2.5">
                  {distribution.map((bucket) => (
                    <li key={bucket.stars} className="flex items-center gap-3 text-sm">
                      <span
                        aria-hidden
                        className="flex w-7 shrink-0 items-center gap-1 tabular-nums"
                      >
                        {bucket.stars}
                        <StarIcon className="size-3 fill-current text-muted-foreground" />
                      </span>
                      <Progress
                        value={bucket.percent}
                        aria-label={`${bucket.stars}-star reviews`}
                        aria-valuetext={`${bucket.percent}% (${pluralizeReviews(bucket.count)})`}
                        className="h-1.5"
                      />
                      <span
                        aria-hidden
                        className="w-9 shrink-0 text-right text-muted-foreground tabular-nums"
                      >
                        {bucket.percent}%
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="flex flex-col gap-1.5">
                <p className="font-medium">No ratings yet</p>
                <p className="text-sm text-pretty text-muted-foreground">
                  The rating summary appears here once customers start sharing their thoughts.
                </p>
              </div>
            )}

            <WriteReviewDialog productName={product.name} />
          </div>
        </div>

        <div>
          {reviews.length > 0 ? (
            <>
              <p className="mb-2 text-sm text-muted-foreground">
                {reviews.length < product.reviewCount
                  ? `Showing the ${reviews.length} most recent of ${pluralizeReviews(product.reviewCount)}`
                  : `${pluralizeReviews(reviews.length)}, most recent first`}
              </p>
              <ul className="divide-y">
                {reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </ul>
            </>
          ) : (
            <Empty className="border py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageSquareTextIcon />
                </EmptyMedia>
                <EmptyTitle>No reviews yet</EmptyTitle>
                <EmptyDescription>
                  Own the {product.name}? Be the first to share what you think.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const titleId = `review-${review.id}`;

  return (
    <li className="py-8 first:pt-6">
      <article aria-labelledby={titleId} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback className="font-medium">{initials(review.author)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <p className="truncate text-sm font-medium">{review.author}</p>
            {review.verified && (
              <Badge variant="secondary" className="font-normal">
                <BadgeCheckIcon data-icon="inline-start" aria-hidden />
                Verified buyer
              </Badge>
            )}
          </div>
          <time dateTime={review.date} className="shrink-0 self-start text-xs text-muted-foreground">
            {formatDate(review.date)}
          </time>
        </div>

        <div className="flex flex-col gap-2">
          <RatingStars rating={review.rating} size="sm" />
          <h3 id={titleId} className="font-medium text-pretty">
            {review.title}
          </h3>
          <p className="text-sm/relaxed text-pretty text-muted-foreground">{review.body}</p>
        </div>
      </article>
    </li>
  );
}

export function ProductReviewsSkeleton() {
  return (
    <div className="border-t" aria-busy="true">
      <span className="sr-only">Loading reviews…</span>
      <div className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16 xl:gap-24">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-9 w-3/4" />
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <div className="flex flex-col gap-10 pt-6">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
