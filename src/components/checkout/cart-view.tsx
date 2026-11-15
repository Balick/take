"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/checkout/cart-summary";
import { CartPageSkeleton } from "@/components/checkout/checkout-skeletons";
import { ClearBagDialog } from "@/components/checkout/clear-bag-dialog";
import { EmptyBagState } from "@/components/checkout/empty-bag-state";
import { useStoresHydrated } from "@/components/providers/store-hydration";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { selectCartCount, selectCartSubtotal, useCartStore } from "@/lib/store/cart";

const pluralizeItems = (count: number) => `${count} ${count === 1 ? "item" : "items"}`;

/** Matches the Remove button rendered by each `CartLineItem`. */
const removeButtonSelector = 'button[aria-label^="Remove "]';

/**
 * Announces quantity changes and removals to screen readers. Stays silent for
 * the initial render so restoring the bag from storage is not announced.
 */
function CartAnnouncer({ summary }: { summary: string }) {
  const [baseline] = useState(summary);
  const [dirty, setDirty] = useState(false);

  // Adjusting state while rendering: https://react.dev/learn/you-might-not-need-an-effect
  if (!dirty && summary !== baseline) setDirty(true);

  return (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {dirty ? `Bag updated. ${summary}.` : ""}
    </p>
  );
}

/** Client part of the /cart page: header, editable lines and summary. */
export function CartView() {
  const hydrated = useStoresHydrated();
  const items = useCartStore((state) => state.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const isEmpty = items.length === 0;

  // When the last line is removed (or the bag is cleared), the focused control
  // disappears with it. Move focus to the empty state's call to action instead
  // of dropping it on <body>. Skipped when the change came from the cart sheet,
  // which keeps its own focus.
  const emptyCtaRef = useRef<HTMLAnchorElement>(null);
  const wasEmpty = useRef<boolean | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (wasEmpty.current === false && isEmpty && !useCartStore.getState().isOpen) {
      emptyCtaRef.current?.focus();
    }
    wasEmpty.current = isEmpty;
  }, [hydrated, isEmpty]);

  // Removing a line while others remain would also drop focus on <body>: move
  // it to the next line's Remove button, else the previous one, else the
  // heading. The click bubbles here after the line has updated the store.
  const listRef = useRef<HTMLUListElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  function handleListClick(event: React.MouseEvent<HTMLUListElement>) {
    const button = (event.target as Element).closest(removeButtonSelector);
    if (!button || !listRef.current) return;
    const index = Array.from(listRef.current.querySelectorAll(removeButtonSelector)).indexOf(
      button,
    );

    requestAnimationFrame(() => {
      // An emptied bag unmounts the list; the effect above handles that case.
      const list = listRef.current;
      if (!list) return;
      const buttons = list.querySelectorAll<HTMLButtonElement>(removeButtonSelector);
      const target = buttons[index] ?? buttons[index - 1] ?? headingRef.current;
      target?.focus();
    });
  }

  const description = !hydrated ? (
    // Keeps the header height stable until the bag is restored.
    <span aria-hidden className="invisible">
      Loading your bag
    </span>
  ) : isEmpty ? (
    "Nothing in here yet. Let’s fix that."
  ) : (
    `${pluralizeItems(count)} · ${formatPrice(subtotal)} subtotal`
  );

  return (
    <>
      <PageHeader title="Your bag" description={description} />

      {!hydrated ? (
        <CartPageSkeleton />
      ) : isEmpty ? (
        <EmptyBagState ctaRef={emptyCtaRef} />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <section aria-labelledby="cart-items-heading" className="min-w-0">
            <h2 ref={headingRef} id="cart-items-heading" tabIndex={-1} className="sr-only">
              Items in your bag
            </h2>
            <ul ref={listRef} onClick={handleListClick} className="divide-y border-y">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} className="py-6" />
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Button
                asChild
                variant="link"
                className="px-0 text-foreground has-data-[icon=inline-start]:pl-0"
              >
                <Link href="/products">
                  <ArrowLeftIcon data-icon="inline-start" aria-hidden />
                  Continue shopping
                </Link>
              </Button>
              <ClearBagDialog />
            </div>
          </section>

          <CartSummary />
        </div>
      )}

      {hydrated && (
        <CartAnnouncer
          summary={`${pluralizeItems(count)} in your bag, subtotal ${formatPrice(subtotal)}`}
        />
      )}
    </>
  );
}
