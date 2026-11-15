import { ArrowRightIcon, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface EmptyBagStateProps {
  title?: string;
  description?: React.ReactNode;
  /** Lets the parent move focus to the call to action (e.g. after clearing the bag). */
  ctaRef?: React.Ref<HTMLAnchorElement>;
  /** Called when the call to action is followed (e.g. to close the cart sheet). */
  onNavigate?: () => void;
  /** `sm` is the compact variant used inside the cart sheet. */
  size?: "sm" | "default";
  className?: string;
}

/** Shown in the cart sheet and on the cart and checkout pages when the bag has no items. */
export function EmptyBagState({
  title = "Your bag is empty",
  description = `Heavyweight tees, ribbed dresses and everyday essentials are waiting. Orders of ${formatPrice(siteConfig.freeShippingThreshold)} or more ship free.`,
  ctaRef,
  onNavigate,
  size = "default",
  className,
}: EmptyBagStateProps) {
  const compact = size === "sm";

  return (
    <Empty
      className={cn(
        compact ? "px-6 py-10" : "rounded-2xl border border-dashed px-6 py-16 sm:py-24",
        className,
      )}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon" className={cn("rounded-full", compact ? "size-10" : "size-12")}>
          <ShoppingBagIcon className={compact ? "size-4" : "size-5"} aria-hidden />
        </EmptyMedia>
        <EmptyTitle
          className={cn("font-display font-normal", compact ? "text-2xl" : "text-3xl")}
        >
          {title}
        </EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild size="lg" className="px-4">
          <Link ref={ctaRef} href="/products" onClick={onNavigate}>
            Start shopping
            <ArrowRightIcon data-icon="inline-end" aria-hidden />
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
