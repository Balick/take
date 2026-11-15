"use client";

import { SlidersHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";

import { ClearFiltersButton } from "./clear-filters-button";
import { ProductFilters, type ProductFiltersProps } from "./product-filters";
import { countPanelFilters } from "./search-params";
import { useShop } from "./shop-provider";

/** "Filters" button (below lg) that opens the filter panel in a sheet. */
export function MobileFilters({
  resultCount,
  className,
  ...panelProps
}: ProductFiltersProps & { resultCount: number }) {
  const { filters, isPending } = useShop();
  const activeCount = countPanelFilters(filters);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className={className}>
          <SlidersHorizontalIcon data-icon="inline-start" aria-hidden />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[0.6875rem] font-medium text-primary-foreground tabular-nums">
              {activeCount}
              <span className="sr-only"> active</span>
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="gap-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription className="sr-only">
            Narrow the collection by category, price and availability. Results update as you go.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1">
          <ProductFilters {...panelProps} className="px-5 py-6" />
        </ScrollArea>
        {/* The page behind the modal is hidden from assistive tech: announce here. */}
        <p role="status" className="sr-only">
          {isPending ? "" : `${resultCount} ${resultCount === 1 ? "product" : "products"} found`}
        </p>
        <SheetFooter className="flex-row border-t px-5 py-4">
          <ClearFiltersButton variant="outline" size="lg" className="flex-1">
            Clear all
          </ClearFiltersButton>
          <SheetClose asChild>
            <Button size="lg" className="flex-[2]">
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" aria-hidden />
                  Updating
                </>
              ) : (
                `Show ${resultCount} ${resultCount === 1 ? "product" : "products"}`
              )}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
