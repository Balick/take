import { LockIcon, RotateCcwIcon, TruckIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const perks = [
  {
    icon: TruckIcon,
    title: "Free shipping",
    description: `On orders of ${formatPrice(siteConfig.freeShippingThreshold)} or more`,
  },
  {
    icon: RotateCcwIcon,
    title: `${siteConfig.returnWindowDays}-day returns`,
    description: "Free returns on unworn pieces",
  },
  {
    icon: LockIcon,
    title: "Secure checkout",
    description: "Encrypted payments, always",
  },
];

export function ProductPerks({ className }: { className?: string }) {
  return (
    <ul
      aria-label="Why shop with us"
      className={cn(
        "grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3",
        className,
      )}
    >
      {perks.map(({ icon: Icon, title, description }) => (
        <li
          key={title}
          className="flex items-start gap-3 bg-background p-4 sm:flex-col sm:gap-2 lg:flex-row lg:gap-3 xl:flex-col xl:gap-2"
        >
          <Icon
            className="mt-0.5 size-4 shrink-0 text-muted-foreground sm:mt-0 lg:mt-0.5 xl:mt-0"
            aria-hidden
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{title}</span>
            <span className="text-xs text-pretty text-muted-foreground">{description}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
