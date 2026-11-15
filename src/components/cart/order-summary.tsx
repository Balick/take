"use client";

import { TruckIcon } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { siteConfig } from "@/config/site";
import { formatPrice, getOrderTotals } from "@/lib/format";
import { selectCartSubtotal, useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

/** Progress towards the free shipping threshold. */
export function FreeShippingProgress({ className }: { className?: string }) {
  const subtotal = useCartStore(selectCartSubtotal);
  const threshold = siteConfig.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="flex items-center gap-2 text-sm">
        <TruckIcon className="size-4 text-muted-foreground" aria-hidden />
        {remaining > 0 ? (
          <span>
            You are <strong className="font-medium">{formatPrice(remaining)}</strong> away
            from free shipping.
          </span>
        ) : (
          <span>Your order ships for free.</span>
        )}
      </p>
      <Progress
        value={Math.min(100, (subtotal / threshold) * 100)}
        aria-label="Progress towards free shipping"
        className="h-1.5"
      />
    </div>
  );
}

/** Subtotal, shipping, taxes and total for the current cart. */
export function OrderSummary({ className }: { className?: string }) {
  const subtotal = useCartStore(selectCartSubtotal);
  const { shipping, tax, total } = getOrderTotals(subtotal);

  return (
    <dl className={cn("flex flex-col gap-3 text-sm", className)}>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Shipping</dt>
        <dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">
          Estimated tax ({Math.round(siteConfig.taxRate * 100)}%)
        </dt>
        <dd className="tabular-nums">{formatPrice(tax)}</dd>
      </div>
      <div className="flex justify-between border-t pt-3 text-base font-medium">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}
