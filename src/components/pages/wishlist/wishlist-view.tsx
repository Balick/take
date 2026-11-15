"use client";

import { ArrowRightIcon, HeartIcon } from "lucide-react";
import Link from "next/link";
import { type RefObject, useEffect, useMemo, useRef } from "react";

import { ClearWishlistDialog } from "@/components/pages/wishlist/clear-wishlist-dialog";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/product-grid";
import { useStoresHydrated } from "@/components/providers/store-hydration";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlistStore } from "@/lib/store/wishlist";
import type { Product } from "@/types";

interface WishlistViewProps {
  /** The whole catalog: saved ids are resolved against it on the client. */
  products: Product[];
  /** Shown under the empty state. */
  suggestions: Product[];
}

function pluralize(count: number) {
  return `${count} saved ${count === 1 ? "item" : "items"}`;
}

/**
 * Saved products. The wishlist lives in localStorage, so the list renders a
 * skeleton until the store is restored instead of a misleading empty state.
 */
export function WishlistView({ products, suggestions }: WishlistViewProps) {
  const hydrated = useStoresHydrated();
  const ids = useWishlistStore((state) => state.items);

  const saved = useMemo(() => {
    const byId = new Map(products.map((product) => [product.id, product]));
    // Most recently saved first; ids of products that no longer exist are skipped.
    return [...ids]
      .reverse()
      .map((id) => byId.get(id))
      .filter((product): product is Product => product !== undefined);
  }, [ids, products]);

  const listRef = useRef<HTMLElement>(null);
  const emptyCtaRef = useRef<HTMLAnchorElement>(null);
  const previousIds = useRef<string[]>([]);

  // Removing a card (its heart, or "Clear wishlist") unmounts the focused
  // element and drops focus to <body>: move it to the next card's name link,
  // the previous one for the last card, or the empty state's call to action.
  useEffect(() => {
    const previous = previousIds.current;
    const current = saved.map((product) => product.id);
    previousIds.current = current;

    const active = document.activeElement;
    if (active && active !== document.body) return;
    const removedIndex = previous.findIndex((id) => !current.includes(id));
    if (removedIndex === -1) return;

    if (current.length === 0) {
      emptyCtaRef.current?.focus();
      return;
    }
    const nameLinks = listRef.current?.querySelectorAll<HTMLAnchorElement>("article h3 a");
    nameLinks?.[Math.min(removedIndex, current.length - 1)]?.focus();
  }, [saved]);

  let status = "";
  if (hydrated) status = saved.length > 0 ? pluralize(saved.length) : "Your wishlist is empty";

  return (
    <>
      {/* Announces changes, e.g. when an item is removed with its heart button. */}
      <p role="status" className="sr-only">
        {status}
      </p>

      {!hydrated ? (
        <div className="flex flex-col gap-6" aria-hidden>
          <div className="flex min-h-10 items-center justify-between border-y py-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-32" />
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      ) : saved.length === 0 ? (
        <EmptyWishlist suggestions={suggestions} ctaRef={emptyCtaRef} />
      ) : (
        <section
          ref={listRef}
          aria-labelledby="wishlist-items-heading"
          className="flex flex-col gap-6"
        >
          <div className="flex min-h-10 items-center justify-between gap-4 border-y py-1">
            <h2 id="wishlist-items-heading" className="text-sm text-muted-foreground">
              {pluralize(saved.length)}
            </h2>
            <ClearWishlistDialog count={saved.length} />
          </div>
          <ProductGrid products={saved} preloadCount={4} />
          <p className="pt-4 text-center text-sm text-pretty text-muted-foreground">
            Your wishlist is saved on this device.{" "}
            <Link
              href="/account"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign in
            </Link>{" "}
            to keep it in sync everywhere.
          </p>
        </section>
      )}
    </>
  );
}

function EmptyWishlist({
  suggestions,
  ctaRef,
}: {
  suggestions: Product[];
  ctaRef: RefObject<HTMLAnchorElement | null>;
}) {
  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      <Empty className="gap-6 rounded-2xl border bg-muted/40 px-6 py-16 sm:py-20">
        <EmptyHeader className="max-w-md gap-3">
          <EmptyMedia variant="icon" className="size-12 rounded-full bg-background">
            <HeartIcon className="size-5" aria-hidden />
          </EmptyMedia>
          <h2 className="font-display text-3xl tracking-tight text-balance">
            Your wishlist is empty
          </h2>
          <EmptyDescription className="text-base">
            Tap the heart on any product to save it for later. It will be waiting for you right
            here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild size="lg" className="h-11 rounded-full px-5">
            <Link ref={ctaRef} href="/products">
              Browse the shop
              <ArrowRightIcon data-icon="inline-end" aria-hidden />
            </Link>
          </Button>
        </EmptyContent>
      </Empty>

      {suggestions.length > 0 && (
        <section aria-labelledby="wishlist-suggestions-heading">
          <SectionHeading
            eyebrow="Need inspiration?"
            title={<span id="wishlist-suggestions-heading">Popular right now</span>}
            link={{ href: "/products?sort=rating", label: "See best sellers" }}
          />
          <ProductGrid products={suggestions} />
        </section>
      )}
    </div>
  );
}
