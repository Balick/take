import { ArrowRightIcon, SearchIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { StatusMessage } from "@/components/pages/status/status-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for doesn’t exist or has moved.",
};

/**
 * Root 404, shown for `notFound()` calls and every unmatched URL. Next.js
 * ships this file with every route, so it stays a Server Component without
 * client-side JavaScript: the search box is a plain GET form.
 */
export default async function NotFound() {
  const categories = await getCategories();

  return (
    <StatusMessage
      display="404"
      eyebrow="Page not found"
      title="This page took a different path"
      description={
        <p>
          The link may be broken, or the page may have moved. Search the shop or head back to
          familiar ground.
        </p>
      }
      footer={
        categories.length > 0 && (
          <nav aria-labelledby="not-found-categories" className="flex flex-col gap-4">
            <h2
              id="not-found-categories"
              className="text-xs font-medium tracking-widest text-muted-foreground uppercase"
            >
              Popular categories
            </h2>
            <ul className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors outline-none hover:border-foreground/30 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )
      }
    >
      <form action="/products" method="get" role="search" className="flex w-full gap-2">
        <label htmlFor="not-found-search" className="sr-only">
          Search products
        </label>
        <div className="relative flex-1">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="not-found-search"
            name="q"
            type="search"
            placeholder="Search tees, dresses, bottles…"
            autoComplete="off"
            className="h-11 rounded-full pr-4 pl-10"
          />
        </div>
        <Button type="submit" size="lg" variant="outline" className="h-11 rounded-full px-5">
          Search
        </Button>
      </form>
      <div className="flex flex-wrap justify-center gap-2">
        <Button asChild size="lg" className="h-11 rounded-full px-5">
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild size="lg" variant="ghost" className="h-11 rounded-full px-5">
          <Link href="/products">
            Shop all
            <ArrowRightIcon data-icon="inline-end" aria-hidden />
          </Link>
        </Button>
      </div>
    </StatusMessage>
  );
}
