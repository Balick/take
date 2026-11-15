import { HeadsetIcon, RotateCcwIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";

const acceptedCards = new Intl.ListFormat(siteConfig.locale, { type: "conjunction" }).format(
  siteConfig.paymentMethods,
);

const valueProps = [
  {
    icon: TruckIcon,
    title: `Free shipping on orders of ${formatPrice(siteConfig.freeShippingThreshold)} or more`,
    description: `Flat ${formatPrice(siteConfig.shippingCost)} rate on smaller orders.`,
    href: "/faq#shipping",
  },
  {
    icon: RotateCcwIcon,
    title: `${siteConfig.returnWindowDays}-day returns`,
    description: "Changed your mind? Send it back for free.",
    href: "/faq#returns",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure checkout",
    description: `Encrypted card payments with ${acceptedCards}.`,
    href: "/faq#payment",
  },
  {
    icon: HeadsetIcon,
    title: "Responsive support",
    description: "Real people, replies within one business day.",
    href: "/contact",
  },
];

export function ValueProps() {
  return (
    <section aria-label="Why shop with us" className="border-y bg-muted/40">
      <ul className="container-page grid grid-cols-1 gap-2 py-6 min-[480px]:grid-cols-2 sm:py-8 lg:grid-cols-4">
        {valueProps.map(({ icon: Icon, title, description, href }) => (
          <li key={title}>
            <Link
              href={href}
              className="group/prop flex h-full items-start gap-4 rounded-xl p-3 transition-colors outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50 sm:p-4"
            >
              <span
                className="grid size-10 shrink-0 place-items-center rounded-full border bg-background transition-colors group-hover/prop:border-foreground/20"
                aria-hidden
              >
                <Icon className="size-4.5" strokeWidth={1.75} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{title}</span>
                <span className="text-sm text-pretty text-muted-foreground">{description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
