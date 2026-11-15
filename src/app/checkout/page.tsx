import { ArrowLeftIcon, LockIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutView } from "@/components/checkout/checkout-view";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your shipping and payment details to place your order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-page pb-16 sm:pb-24">
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <LockIcon className="size-3.5" aria-hidden />
            Secure checkout
          </span>
        }
        title="Checkout"
        actions={
          <Button asChild variant="ghost" className="-ml-2.5 sm:ml-0">
            <Link href="/cart">
              <ArrowLeftIcon data-icon="inline-start" aria-hidden />
              Back to bag
            </Link>
          </Button>
        }
      />
      <CheckoutView />
    </div>
  );
}
