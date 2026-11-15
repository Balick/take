import { ArrowRightIcon, SearchXIcon } from "lucide-react";
import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { getFeaturedProducts } from "@/lib/queries";

export default async function ProductNotFound() {
  const featured = await getFeaturedProducts(4);

  return (
    <>
      <div className="container-page py-16 sm:py-24">
        <Empty className="gap-6 rounded-2xl border bg-muted/40 px-6 py-16 sm:py-20">
          <EmptyHeader className="max-w-md gap-3">
            <EmptyMedia variant="icon" className="size-12 rounded-full bg-background">
              <SearchXIcon className="size-5" />
            </EmptyMedia>
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Error 404
            </p>
            <h1 className="font-display text-4xl tracking-tight text-balance sm:text-5xl">
              Product not found
            </h1>
            <EmptyDescription className="text-base">
              This piece may have sold out for good or moved to a new address. The rest
              of the collection is just a click away.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row flex-wrap justify-center">
            <Button asChild size="lg" className="h-11 rounded-full px-5">
              <Link href="/products">
                Browse the shop
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 rounded-full px-5">
              <Link href="/">Back to home</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>

      {featured.length > 0 && (
        <section aria-labelledby="featured-heading" className="container-page pb-16 sm:pb-24">
          <SectionHeading
            eyebrow="Popular right now"
            title={<span id="featured-heading">You might like these instead</span>}
            link={{ href: "/products", label: "Shop all" }}
          />
          <ProductGrid products={featured} />
        </section>
      )}
    </>
  );
}
