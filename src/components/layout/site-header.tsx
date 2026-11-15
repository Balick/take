import { Suspense } from "react";

import { CartSheet } from "@/components/layout/cart-sheet";
import { ActiveDesktopNav, DesktopNav } from "@/components/layout/desktop-nav";
import { AccountLink, CartButton, WishlistLink } from "@/components/layout/header-actions";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ModeToggle } from "@/components/layout/mode-toggle";
import {
  SearchCommand,
  type SearchCategory,
  type SearchProduct,
} from "@/components/layout/search-command";
import { SearchTrigger } from "@/components/layout/search-trigger";
import { getCategories, getProducts } from "@/lib/queries";

/**
 * Global sticky header. A Server Component: it loads the catalog data once and
 * hands the small client islands (navigation, search, cart) what they need.
 */
export async function SiteHeader() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const categoryNames = new Map(categories.map((category) => [category.slug, category.name]));
  const searchProducts: SearchProduct[] = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    image: product.images[0],
    categoryName: categoryNames.get(product.category) ?? product.category,
  }));
  const searchCategories: SearchCategory[] = categories.map(({ slug, name, image }) => ({
    slug,
    name,
    image,
  }));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <div className="container-page flex h-16 items-center gap-2 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        <div className="flex min-w-0 items-center gap-1">
          <MobileNav categories={categories} className="-ml-2" />
          <Logo />
        </div>

        {/* Highlighting the current page reads the URL, which streams in on the client. */}
        <Suspense fallback={<DesktopNav categories={categories} />}>
          <ActiveDesktopNav categories={categories} />
        </Suspense>

        <div className="ml-auto flex items-center justify-end gap-0.5 lg:ml-0">
          <SearchTrigger className="xl:mr-2" />
          <WishlistLink className="hidden lg:inline-flex" />
          <AccountLink className="hidden lg:inline-flex" />
          <ModeToggle className="hidden lg:inline-flex" />
          <CartButton className="-mr-2 lg:mr-0" />
        </div>
      </div>

      <SearchCommand products={searchProducts} categories={searchCategories} />
      <CartSheet />
    </header>
  );
}
