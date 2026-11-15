import {
  ArrowRightIcon,
  CheckIcon,
  MailCheckIcon,
  PackageIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { OrderNumber, OrderNumberSkeleton } from "@/components/checkout/order-number";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Thank you for your order.",
  robots: { index: false, follow: false },
};

const nextSteps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: MailCheckIcon,
    title: "Confirmation email",
    description:
      "A receipt with your order details is on its way to your inbox. It can take a few minutes to arrive.",
  },
  {
    icon: PackageIcon,
    title: "Preparation",
    description:
      "Our studio team picks, inspects and carefully packs your pieces within one business day.",
  },
  {
    icon: TruckIcon,
    title: "Shipping",
    description:
      "You’ll get a tracking link as soon as your parcel leaves the studio. Standard orders arrive in 3–5 business days.",
  },
];

/**
 * The page shell (heading, next steps, links) is static and prerendered; only
 * the order number reads the URL, so it streams in behind <Suspense>.
 */
export default function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <div
          aria-hidden
          className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-muted motion-safe:animate-in motion-safe:duration-500 motion-safe:fade-in motion-safe:zoom-in-50"
        >
          <CheckIcon className="size-7" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl tracking-tight text-balance sm:text-6xl">
            Thank you for your order!
          </h1>
          <p className="text-base text-pretty text-muted-foreground">
            Your order is confirmed and our studio is getting it ready. We’ll take it from here.
          </p>
        </div>
        <Suspense fallback={<OrderNumberSkeleton />}>
          <OrderNumber searchParams={searchParams} />
        </Suspense>
      </div>

      <section
        aria-labelledby="next-steps-heading"
        className="mx-auto mt-12 max-w-2xl rounded-2xl border p-6 sm:mt-16 sm:p-8"
      >
        <h2 id="next-steps-heading" className="text-lg font-medium tracking-tight">
          What happens next
        </h2>
        <ol className="mt-6 flex flex-col">
          {nextSteps.map((step) => (
            <li
              key={step.title}
              className="relative flex gap-4 pb-8 last:pb-0 before:absolute before:top-11 before:bottom-1 before:left-5 before:w-px before:bg-border last:before:hidden"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-background">
                <step.icon className="size-4.5" aria-hidden />
              </span>
              <div className="flex flex-col gap-1 pt-2">
                <h3 className="text-sm font-medium">{step.title}</h3>
                <p className="text-sm/relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg" className="h-11 px-5">
          <Link href="/products">
            Continue shopping
            <ArrowRightIcon data-icon="inline-end" aria-hidden />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11 px-5">
          <Link href="/">Back home</Link>
        </Button>
      </div>

      <p className="mx-auto mt-10 max-w-md text-center text-sm text-pretty text-muted-foreground">
        Questions about your order? Read our{" "}
        <Link href="/faq#shipping" className="text-foreground underline underline-offset-4">
          shipping FAQ
        </Link>{" "}
        or{" "}
        <Link href="/contact" className="text-foreground underline underline-offset-4">
          get in touch
        </Link>
        . This is a demo store: no payment was taken and nothing will ship.
      </p>
    </div>
  );
}
