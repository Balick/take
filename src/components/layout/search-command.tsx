"use client";

import {
  ArrowRightIcon,
  CircleHelpIcon,
  HeartIcon,
  LayoutGridIcon,
  MailIcon,
  SearchIcon,
  ShoppingBagIcon,
  TagIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { isApplePlatform } from "@/components/layout/apple-platform";
import { useSearchStore } from "@/components/layout/search-store";
import { useReturnFocus } from "@/components/layout/use-return-focus";
import { ProductImage } from "@/components/product/product-image";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { formatPrice, isOnSale } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types";

/** The subset of a product the search palette needs (keeps the payload small). */
export type SearchProduct = Pick<
  Product,
  "slug" | "name" | "tagline" | "price" | "compareAtPrice"
> & {
  image: string;
  categoryName: string;
};

export type SearchCategory = Pick<Category, "slug" | "name" | "image">;

const quickLinks = [
  { title: "Shop all", href: "/products", icon: LayoutGridIcon },
  { title: "Sale", href: "/products?sale=1", icon: TagIcon },
  { title: "Wishlist", href: "/wishlist", icon: HeartIcon },
  { title: "Bag", href: "/cart", icon: ShoppingBagIcon, keywords: ["cart", "basket"] },
  { title: "FAQ", href: "/faq", icon: CircleHelpIcon, keywords: ["help", "shipping", "returns"] },
  { title: "Contact", href: "/contact", icon: MailIcon, keywords: ["support", "email"] },
];

interface SearchCommandProps {
  products: SearchProduct[];
  categories: SearchCategory[];
}

/**
 * Global search palette, opened from the header or with ⌘K / Ctrl+K.
 *
 * Composed from `Dialog` + `Command` rather than `CommandDialog`: this keeps the
 * dialog title inside the dialog (instead of a hidden heading left in the page
 * header) and lets focus return to whatever opened the palette.
 */
export function SearchCommand({ products, categories }: SearchCommandProps) {
  const router = useRouter();
  const open = useSearchStore((state) => state.open);
  const setOpen = useSearchStore((state) => state.setOpen);
  const returnFocus = useReturnFocus();
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // `key` can be missing on synthetic keydown events (e.g. Chrome autofill).
      if (event.key !== "k" && event.key !== "K") return;
      // ⌘K on Apple platforms, Ctrl+K elsewhere. Ctrl+K is left alone on Apple:
      // it is the system "kill line" shortcut in text fields.
      const modifier = isApplePlatform() ? event.metaKey : event.ctrlKey;
      if (!modifier || event.altKey || event.repeat) return;
      event.preventDefault();
      const { open: isOpen, setOpen: setSearchOpen } = useSearchStore.getState();
      if (isOpen) setQuery("");
      setSearchOpen(!isOpen);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setQuery("");
  }

  function navigate(href: string) {
    handleOpenChange(false);
    router.push(href);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[10svh] translate-y-0 gap-0 overflow-hidden p-0 sm:top-[16svh] sm:max-w-xl"
        {...returnFocus}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search the store</DialogTitle>
          <DialogDescription>
            Search products and categories, or jump to a page.
          </DialogDescription>
        </DialogHeader>
        <Command loop className="rounded-none!">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search products, categories, pages…"
            aria-label="Search the store"
          />
          <CommandList className="max-h-[min(28rem,60svh)] px-1 pb-1">
            {trimmedQuery && (
              <CommandItem
                forceMount
                value={`search-for:${trimmedQuery}`}
                onSelect={() =>
                  navigate(`/products?q=${encodeURIComponent(trimmedQuery)}`)
                }
                className="mt-1"
              >
                <SearchIcon className="text-muted-foreground" aria-hidden />
                <span className="truncate">
                  Search for <span className="font-medium">“{trimmedQuery}”</span>
                </span>
                <CommandShortcut>
                  <ArrowRightIcon className="size-3.5" aria-hidden />
                </CommandShortcut>
              </CommandItem>
            )}

            <CommandEmpty className="px-4 py-8 text-muted-foreground">
              No quick matches. Press <Kbd>Enter</Kbd> to search the whole catalog.
            </CommandEmpty>

            <CommandGroup heading="Products">
              {products.map((product) => {
                const onSale = isOnSale(product);
                return (
                  <CommandItem
                    key={product.slug}
                    value={`product:${product.slug}`}
                    keywords={[product.name, product.tagline, product.categoryName]}
                    onSelect={() => navigate(`/products/${product.slug}`)}
                    className="gap-3 py-2"
                  >
                    <ProductImage
                      src={product.image}
                      alt=""
                      sizes="40px"
                      className="w-10 shrink-0 rounded-md"
                      imageClassName="p-1"
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{product.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {product.tagline}
                      </span>
                    </span>
                    <CommandShortcut
                      className={cn(
                        "pl-2 text-sm tracking-normal tabular-nums",
                        onSale && "text-sale group-data-selected/command-item:text-sale",
                      )}
                    >
                      {onSale && <span className="sr-only">Sale price: </span>}
                      {formatPrice(product.price)}
                    </CommandShortcut>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Categories">
              {categories.map((category) => (
                <CommandItem
                  key={category.slug}
                  value={`category:${category.slug}`}
                  keywords={[category.name, "category"]}
                  onSelect={() => navigate(`/products?category=${category.slug}`)}
                  className="gap-3"
                >
                  <ProductImage
                    src={category.image}
                    alt=""
                    sizes="28px"
                    className="aspect-square w-7 shrink-0 rounded-md"
                    imageClassName="p-0.5"
                  />
                  <span className="truncate">{category.name}</span>
                  <CommandShortcut className="tracking-normal">Category</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Quick links">
              {quickLinks.map((link) => (
                <CommandItem
                  key={link.href}
                  value={`page:${link.href}`}
                  keywords={[link.title, ...(link.keywords ?? [])]}
                  onSelect={() => navigate(link.href)}
                >
                  <link.icon className="text-muted-foreground" aria-hidden />
                  {link.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          <div
            aria-hidden
            className="hidden items-center gap-4 border-t px-3 py-2 text-xs text-muted-foreground sm:flex"
          >
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              to select
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Kbd>Esc</Kbd>
              to close
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
