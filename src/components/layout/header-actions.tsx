"use client";

import { HeartIcon, ShoppingBagIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { formatCount } from "@/components/layout/nav-utils";
import { useStoresHydrated } from "@/components/providers/store-hydration";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { selectCartCount, useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { cn } from "@/lib/utils";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] leading-none font-semibold text-primary-foreground tabular-nums ring-2 ring-background motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:fade-in-0"
    >
      {formatCount(count)}
    </span>
  );
}

function pluralize(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function IconTooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="hidden lg:inline-flex">{label}</TooltipContent>
    </Tooltip>
  );
}

export function WishlistLink({ className }: { className?: string }) {
  const hydrated = useStoresHydrated();
  const count = useWishlistStore((state) => state.items.length);
  const visibleCount = hydrated ? count : 0;

  return (
    <IconTooltip label="Wishlist">
      <Button asChild variant="ghost" size="icon-lg" className={cn("relative", className)}>
        <Link
          href="/wishlist"
          aria-label={
            visibleCount > 0
              ? `Wishlist, ${pluralize(visibleCount, "saved item")}`
              : "Wishlist"
          }
        >
          <HeartIcon />
          <CountBadge count={visibleCount} />
        </Link>
      </Button>
    </IconTooltip>
  );
}

export function AccountLink({ className }: { className?: string }) {
  return (
    <IconTooltip label="Account">
      <Button asChild variant="ghost" size="icon-lg" className={className}>
        <Link href="/account" aria-label="Account">
          <UserRoundIcon />
        </Link>
      </Button>
    </IconTooltip>
  );
}

/** Opens the cart sheet. The item count only appears once the cart is restored. */
export function CartButton({ className }: { className?: string }) {
  const hydrated = useStoresHydrated();
  const count = useCartStore(selectCartCount);
  const setOpen = useCartStore((state) => state.setOpen);
  const visibleCount = hydrated ? count : 0;

  return (
    <IconTooltip label="Bag">
      <Button
        variant="ghost"
        size="icon-lg"
        aria-haspopup="dialog"
        aria-label={
          visibleCount > 0 ? `Open bag, ${pluralize(visibleCount, "item")}` : "Open bag"
        }
        className={cn("relative", className)}
        onClick={() => setOpen(true)}
      >
        <ShoppingBagIcon />
        <CountBadge count={visibleCount} />
      </Button>
    </IconTooltip>
  );
}
