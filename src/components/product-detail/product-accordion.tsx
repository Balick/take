import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { deliveryMethods } from "@/components/checkout/checkout-schema";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CategorySlug, Product } from "@/types";

const careInstructions: Record<CategorySlug, string[]> = {
  "t-shirts": [
    "Machine wash cold, inside out, with similar colors",
    "Tumble dry low or hang to dry to limit shrinkage",
    "Do not iron directly on the print",
    "Do not bleach or dry clean",
  ],
  "long-sleeves": [
    "Machine wash cold, inside out, with similar colors",
    "Tumble dry low or hang to dry to limit shrinkage",
    "Do not iron directly on the print",
    "Do not bleach or dry clean",
  ],
  dresses: [
    "Machine wash cold on a gentle cycle",
    "Lay flat to dry to keep the rib knit in shape",
    "Cool iron if needed, avoid the piping",
    "Do not bleach or tumble dry",
  ],
  accessories: [
    "Hand wash cold with a mild detergent",
    "Reshape and lay flat to dry",
    "Do not tumble dry, bleach or iron the badge",
  ],
  drinkware: [
    "Hand wash with warm, soapy water before first use",
    "Top rack dishwasher safe for the lid only",
    "Not suitable for the microwave or freezer",
    "Avoid carbonated drinks in sealed bottles",
  ],
};

const standardEstimate = deliveryMethods.find((method) => method.value === "standard")?.estimate;

export function ProductAccordion({
  product,
  className,
}: {
  product: Pick<Product, "details" | "category">;
  className?: string;
}) {
  const hasDetails = product.details.length > 0;

  return (
    <section aria-labelledby="product-information" className={className}>
      <h2 id="product-information" className="sr-only">
        Product information
      </h2>
      <Accordion
        type="multiple"
        defaultValue={hasDetails ? ["details"] : []}
        className="border-y"
      >
        {hasDetails && (
          <AccordionItem value="details">
            <AccordionTrigger className="py-4 text-sm">Details</AccordionTrigger>
            <AccordionContent className="pb-5">
              <BulletList items={product.details} />
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="shipping">
          <AccordionTrigger className="py-4 text-sm">Shipping &amp; returns</AccordionTrigger>
          <AccordionContent className="pb-5 text-muted-foreground">
            <p>
              Free standard shipping on orders of {formatPrice(siteConfig.freeShippingThreshold)}{" "}
              or more, otherwise {formatPrice(siteConfig.shippingCost)}. Orders placed before 2 pm
              ET ship the same business day{standardEstimate && ` and arrive in ${standardEstimate}`}.
            </p>
            <p>
              Not quite right? Return unworn items within {siteConfig.returnWindowDays} days for a
              full refund. Read our{" "}
              <Link href="/faq#shipping">shipping</Link> and{" "}
              <Link href="/faq#returns">returns</Link> policies.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="care">
          <AccordionTrigger className="py-4 text-sm">Care instructions</AccordionTrigger>
          <AccordionContent className="pb-5">
            <BulletList items={careInstructions[product.category]} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

function BulletList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-2 text-muted-foreground", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-foreground/40" />
          {item}
        </li>
      ))}
    </ul>
  );
}
