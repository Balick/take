"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutPageSkeleton } from "@/components/checkout/checkout-skeletons";
import { EmptyBagState } from "@/components/checkout/empty-bag-state";
import { useStoresHydrated } from "@/components/providers/store-hydration";
import { Spinner } from "@/components/ui/spinner";
import { useCartStore } from "@/lib/store/cart";

/** Client part of the /checkout page. */
export function CheckoutView() {
  const router = useRouter();
  const hydrated = useStoresHydrated();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  // Set once the order is placed, so clearing the bag doesn't flash the
  // empty state while navigating to the confirmation page.
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  if (placedOrderId) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border px-6 py-24 text-center"
      >
        <Spinner className="size-6" aria-hidden role={undefined} />
        <p className="font-medium">Payment approved</p>
        <p className="text-sm text-muted-foreground">
          Taking you to your order confirmation…
        </p>
      </div>
    );
  }

  if (!hydrated) return <CheckoutPageSkeleton />;

  if (items.length === 0) {
    return (
      <EmptyBagState
        title="There’s nothing to check out"
        description="Your bag is empty. Add a few pieces you love, then come back here to place your order."
      />
    );
  }

  return (
    <CheckoutForm
      items={items}
      onOrderPlaced={(orderId) => {
        // Hand the order to your backend here before clearing the bag.
        setPlacedOrderId(orderId);
        clear();
        router.push(`/checkout/success?order=${encodeURIComponent(orderId)}`);
      }}
    />
  );
}
