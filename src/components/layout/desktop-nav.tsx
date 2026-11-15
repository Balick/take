"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { getActiveHref } from "@/components/layout/nav-utils";
import { ProductImage } from "@/components/product/product-image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const featuredLinks = [
  {
    title: "New arrivals",
    href: "/products?sort=newest",
    description: "The latest drops, fresh off the press.",
  },
  {
    title: "Best sellers",
    href: "/products?sort=rating",
    description: "Top-rated pieces our customers reorder.",
  },
  {
    title: "Sale",
    href: "/products?sale=1",
    description: "Limited markdowns on past-season favorites.",
  },
];

const mainNavHrefs = siteConfig.mainNav.map((item) => item.href);

const linkStyle = cn(
  navigationMenuTriggerStyle(),
  "relative bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent focus-visible:text-foreground data-active:bg-transparent data-active:text-foreground data-active:hover:bg-transparent data-active:focus:bg-transparent",
  // Editorial underline for the active / hovered item.
  "after:absolute after:inset-x-2.5 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-foreground motion-safe:after:transition-transform motion-safe:after:duration-300 hover:after:scale-x-100 data-active:after:scale-x-100",
);

interface DesktopNavProps {
  categories: Category[];
  /** The `mainNav` href matching the current URL, if any. */
  activeHref?: string | null;
  className?: string;
}

/** Desktop navigation: "Shop" mega-menu followed by `siteConfig.mainNav`. */
export function DesktopNav({ categories, activeHref, className }: DesktopNavProps) {
  return (
    <NavigationMenu className={cn("hidden lg:flex", className)} aria-label="Main">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent data-open:bg-transparent data-open:text-foreground data-open:hover:bg-transparent data-open:focus:bg-transparent">
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[min(44rem,calc(100vw-4rem))] grid-cols-[minmax(0,1fr)_15rem] gap-2 p-2">
              <div className="p-2">
                <p className="px-2 pb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Shop by category
                </p>
                <ul className="grid grid-cols-2 gap-1">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <NavigationMenuLink
                        asChild
                        className="group/category items-start gap-3 p-2 in-data-[slot=navigation-menu-content]:rounded-xl"
                      >
                        <Link href={`/products?category=${category.slug}`}>
                          <ProductImage
                            src={category.image}
                            alt=""
                            sizes="48px"
                            className="w-12 shrink-0 rounded-lg"
                            imageClassName="p-1 motion-safe:transition-transform motion-safe:duration-300 group-hover/category:scale-105"
                          />
                          <span className="flex min-w-0 flex-col gap-0.5 pt-0.5">
                            <span className="font-medium">{category.name}</span>
                            <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                              {category.description}
                            </span>
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col rounded-xl bg-muted/60 p-4">
                <p className="pb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Featured
                </p>
                <ul className="flex flex-col gap-1">
                  {featuredLinks.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink
                        asChild
                        className="-mx-2 flex-col items-start gap-0.5 px-2 py-1.5 hover:bg-background/70 focus:bg-background/70"
                      >
                        <Link href={link.href}>
                          <span className="font-display text-xl leading-tight">
                            {link.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {link.description}
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
                {/* Links inside the menu content have no focus ring (see ui/navigation-menu), so focus is shown with a background, like the items above. */}
                <div className="mt-auto pt-3">
                  <NavigationMenuLink
                    asChild
                    className="group/all -mx-2 justify-between px-2 py-1.5 font-medium hover:bg-background/70 focus:bg-background/70"
                  >
                    <Link href="/products">
                      View all products
                      <ArrowRightIcon
                        aria-hidden
                        className="motion-safe:transition-transform group-hover/all:translate-x-0.5 group-focus-visible/all:translate-x-0.5"
                      />
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {siteConfig.mainNav.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild active={item.href === activeHref} className={linkStyle}>
              <Link href={item.href}>{item.title}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/**
 * Same navigation, with the item matching the current URL highlighted.
 * Reads the URL, so it must be rendered inside a `<Suspense>` boundary whose
 * fallback is a plain `<DesktopNav />`.
 */
export function ActiveDesktopNav(props: Omit<DesktopNavProps, "activeHref">) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeHref = getActiveHref(mainNavHrefs, pathname, searchParams);

  return <DesktopNav {...props} activeHref={activeHref} />;
}
