"use client";

import {
  ChevronRightIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { formatCount, getActiveHref } from "@/components/layout/nav-utils";
import { useSearchStore } from "@/components/layout/search-store";
import { ProductImage } from "@/components/product/product-image";
import { useStoresHydrated } from "@/components/providers/store-hydration";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { useWishlistStore } from "@/lib/store/wishlist";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const sectionLabel = "px-2 text-xs font-medium tracking-widest text-muted-foreground uppercase";

/**
 * Menu contents. Only mounted while the sheet is open (client side), so it can
 * read the URL without a Suspense boundary.
 */
function MobileNavBody({
  categories,
  onNavigate,
  onSearch,
}: {
  categories: Category[];
  onNavigate: () => void;
  onSearch: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hydrated = useStoresHydrated();
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const activeMainHref = getActiveHref(
    siteConfig.mainNav.map((item) => item.href),
    pathname,
    searchParams,
  );
  const activeCategory = pathname === "/products" ? searchParams.get("category") : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
      <div className="px-4 pt-1 pb-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start rounded-full font-normal text-muted-foreground"
          aria-haspopup="dialog"
          onClick={onSearch}
        >
          <SearchIcon data-icon="inline-start" aria-hidden />
          Search products…
        </Button>
      </div>

      <nav aria-label="Mobile" className="flex flex-col gap-6 px-2 pb-6">
        <section aria-labelledby="mobile-nav-shop" className="flex flex-col gap-1">
          <h3 id="mobile-nav-shop" className={sectionLabel}>
            Shop by category
          </h3>
          <ul className="flex flex-col">
            {categories.map((category) => {
              const active = activeCategory === category.slug;
              return (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group/item flex items-center gap-3 rounded-xl p-2 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:transition-colors",
                      active && "bg-muted",
                    )}
                  >
                    <ProductImage
                      src={category.image}
                      alt=""
                      sizes="40px"
                      className="w-10 shrink-0 rounded-lg"
                      imageClassName="p-1"
                    />
                    <span className="flex-1 font-medium">{category.name}</span>
                    <ChevronRightIcon
                      aria-hidden
                      className="size-4 text-muted-foreground motion-safe:transition-transform group-hover/item:translate-x-0.5"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <Separator />

        <ul className="flex flex-col">
          {siteConfig.mainNav.map((item) => {
            const active = item.href === activeMainHref;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-2 py-1.5 font-display text-3xl leading-tight outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:transition-colors",
                    active ? "text-foreground" : "text-foreground/75",
                  )}
                >
                  {item.title}
                  {active && <span aria-hidden className="size-1.5 rounded-full bg-foreground" />}
                </Link>
              </li>
            );
          })}
        </ul>

        <Separator />

        <ul className="flex flex-col">
          <li>
            <Link
              href="/account"
              onClick={onNavigate}
              aria-current={pathname === "/account" ? "page" : undefined}
              className="flex items-center gap-3 rounded-xl p-2 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <UserRoundIcon className="size-4 text-muted-foreground" aria-hidden />
              Account
            </Link>
          </li>
          <li>
            <Link
              href="/wishlist"
              onClick={onNavigate}
              aria-current={pathname === "/wishlist" ? "page" : undefined}
              className="flex items-center gap-3 rounded-xl p-2 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <HeartIcon className="size-4 text-muted-foreground" aria-hidden />
              Wishlist
              {hydrated && wishlistCount > 0 && (
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                  {formatCount(wishlistCount)}
                  <span className="sr-only"> saved</span>
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto flex items-center justify-between border-t px-4 py-3">
        <span className="text-sm text-muted-foreground">Appearance</span>
        <ModeToggle side="top" />
      </div>
    </div>
  );
}

/** Hamburger menu for small screens (hidden from `lg`). */
export function MobileNav({ categories, className }: { categories: Category[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const openSearchOnClose = useRef(false);

  function handleSearch() {
    // Open the palette once the sheet has closed and released its focus trap.
    openSearchOnClose.current = true;
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Open menu" className={cn("lg:hidden", className)}>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="gap-0 data-[side=left]:w-[88%] data-[side=left]:sm:max-w-sm"
        onCloseAutoFocus={() => {
          if (!openSearchOnClose.current) return;
          openSearchOnClose.current = false;
          // Radix now returns focus to the menu button, then the palette opens
          // and moves focus into its input. Closing the palette later brings
          // focus back to the menu button.
          useSearchStore.getState().setOpen(true);
        }}
      >
        <SheetHeader className="px-4 py-3.5 pr-14">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Browse categories, pages and your account.
          </SheetDescription>
          <Logo onNavigate={() => setOpen(false)} className="self-start" />
        </SheetHeader>
        <MobileNavBody
          categories={categories}
          onNavigate={() => setOpen(false)}
          onSearch={handleSearch}
        />
      </SheetContent>
    </Sheet>
  );
}
