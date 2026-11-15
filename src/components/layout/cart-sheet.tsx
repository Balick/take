"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { FreeShippingProgress } from "@/components/cart/order-summary";
import { EmptyBagState } from "@/components/checkout/empty-bag-state";
import { useReturnFocus } from "@/components/layout/use-return-focus";
import { useStoresHydrated } from "@/components/providers/store-hydration";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";
import { selectCartCount, selectCartSubtotal, useCartStore } from "@/lib/store/cart";

function CartSheetSkeleton() {
  return (
    <div role="status" className="flex flex-1 flex-col gap-6 px-6 py-5">
      <span className="sr-only">Loading your bag…</span>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-1.5 w-full" />
      </div>
      {Array.from({ length: 2 }, (_, index) => (
        <div key={index} className="flex gap-4">
          <Skeleton className="aspect-[4/5] w-20 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="mt-auto h-7 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Slide-over bag. Its open state lives in the cart store so any component can
 * open it, e.g. `useCartStore.getState().setOpen(true)` after "Add to bag".
 */
export function CartSheet() {
  const hydrated = useStoresHydrated();
  const isOpen = useCartStore((state) => state.isOpen);
  const setOpen = useCartStore((state) => state.setOpen);
  const items = useCartStore((state) => state.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  // The sheet has no `SheetTrigger` (it opens from the store), so focus is
  // handed back to whatever opened it: the bag button, an "Add to bag"...
  const returnFocus = useReturnFocus();

  const close = () => setOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md"
        {...returnFocus}
      >
        <SheetHeader className="border-b px-6 py-4 pr-14">
          <SheetTitle className="text-lg">
            Your bag
            {hydrated && (
              <span className="ml-1.5 font-normal text-muted-foreground tabular-nums">
                ({count})
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Review the items in your bag, then continue to checkout.
          </SheetDescription>
        </SheetHeader>

        {!hydrated ? (
          <CartSheetSkeleton />
        ) : items.length === 0 ? (
          <EmptyBagState size="sm" onNavigate={close} />
        ) : (
          <>
            <div className="border-b px-6 py-4">
              <FreeShippingProgress />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6">
              <ul aria-label="Items in your bag" className="divide-y">
                {items.map((item) => (
                  <CartLineItem key={item.id} item={item} onNavigate={close} className="py-5" />
                ))}
              </ul>
            </div>

            <SheetFooter className="mt-0 gap-3 border-t bg-muted/40 px-6 py-5">
              <div className="flex flex-col gap-1">
                <p className="flex items-baseline justify-between text-base font-medium">
                  <span>Subtotal</span>
                  <span className="tabular-nums" aria-live="polite">
                    {formatPrice(subtotal)}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout" onClick={close}>
                    Checkout
                    <ArrowRightIcon data-icon="inline-end" aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link href="/cart" onClick={close}>
                    View bag
                  </Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
