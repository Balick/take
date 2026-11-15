import { ArrowRightIcon, LockIcon } from "lucide-react";
import Link from "next/link";

import { FreeShippingProgress, OrderSummary } from "@/components/cart/order-summary";
import { PromoCodeForm } from "@/components/checkout/promo-code-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

const acceptedPayments = new Intl.ListFormat(siteConfig.locale, {
  style: "long",
  type: "conjunction",
}).format(siteConfig.paymentMethods);

/** Sticky summary card of the cart page, rendered by the client `CartView`. */
export function CartSummary() {
  return (
    <section aria-labelledby="cart-summary-heading" className="lg:sticky lg:top-24 lg:self-start">
      <Card className="gap-6 rounded-2xl pt-6 shadow-none">
        <CardHeader className="px-6">
          <CardTitle>
            <h2 id="cart-summary-heading" className="text-lg font-medium">
              Order summary
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 px-6">
          <FreeShippingProgress />
          <Separator />
          <OrderSummary />
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="h-11 w-full">
              <Link href="/checkout">
                Checkout
                <ArrowRightIcon data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
            <p className="flex items-start gap-2 text-xs/relaxed text-muted-foreground">
              <LockIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                Secure checkout. We accept {acceptedPayments}. Taxes are estimated and
                finalized at checkout.
              </span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <PromoCodeForm />
        </CardFooter>
      </Card>
    </section>
  );
}
