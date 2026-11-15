import { LockIcon } from "lucide-react";
import Link from "next/link";

import { CartLineItem } from "@/components/cart/cart-line-item";
import {
  deliveryMethods,
  getCheckoutTotals,
  type DeliveryMethod,
} from "@/components/checkout/checkout-schema";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/types";

interface CheckoutSummaryProps {
  items: CartItem[];
  delivery: DeliveryMethod;
  /** Id of the checkout <form>, so the pay button can live in the summary. */
  formId: string;
  isSubmitting: boolean;
}

/**
 * Read-only order summary with the pay button. Rendered by the (client)
 * checkout form, so it needs no "use client" of its own.
 */
export function CheckoutSummary({ items, delivery, formId, isSubmitting }: CheckoutSummaryProps) {
  const { subtotal, shipping, tax, total } = getCheckoutTotals(items, delivery);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryLabel = deliveryMethods.find((method) => method.value === delivery)?.label;

  return (
    <section
      aria-labelledby="checkout-summary-heading"
      className="flex flex-col gap-6 rounded-2xl border bg-muted/40 p-6 sm:p-8 lg:sticky lg:top-24 lg:self-start"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="checkout-summary-heading" className="text-lg font-medium tracking-tight">
          Order summary
        </h2>
        <Link
          href="/cart"
          className="rounded-sm text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Edit bag
        </Link>
      </div>

      <ul
        aria-label={`${count} ${count === 1 ? "item" : "items"} in your order`}
        className="flex flex-col gap-5"
      >
        {items.map((item) => (
          <CartLineItem key={item.id} item={item} readOnly />
        ))}
      </ul>

      <Separator />

      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Shipping ({deliveryLabel})</dt>
          <dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">
            Estimated tax ({Math.round(siteConfig.taxRate * 100)}%)
          </dt>
          <dd className="tabular-nums">{formatPrice(tax)}</dd>
        </div>
        {/* A <dl> may only contain dt/dd groups, so the rule is a border. */}
        <div className="mt-1 flex items-baseline justify-between gap-4 border-t pt-4">
          <dt className="text-base font-medium">Total</dt>
          <dd className="text-xl font-medium tabular-nums" aria-live="polite" aria-atomic="true">
            <span className="mr-1.5 text-xs font-normal text-muted-foreground">
              {siteConfig.currency}
            </span>
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          form={formId}
          size="lg"
          className="h-11 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner data-icon="inline-start" aria-hidden role={undefined} />
              Processing payment…
            </>
          ) : (
            <>
              <LockIcon data-icon="inline-start" aria-hidden />
              Pay {formatPrice(total)}
            </>
          )}
        </Button>
        <p className="text-center text-xs/relaxed text-muted-foreground">
          Demo checkout: your card will not be charged. By placing your order you agree to our{" "}
          <Link href="/faq#returns" className="underline underline-offset-4 hover:text-foreground">
            returns policy
          </Link>
          .
        </p>
        <p className="sr-only" aria-live="polite">
          {isSubmitting ? "Processing your payment, please wait." : ""}
        </p>
      </div>
    </section>
  );
}
