"use client";

import { useRouter } from "next/navigation";
import { createContext, use, useOptimistic, useTransition } from "react";

import { cn } from "@/lib/utils";

import { clearShopFilters, createShopHref, type ShopFilters } from "./search-params";

interface ShopContextValue {
  /** Current filters, updated optimistically while the next page renders. */
  filters: ShopFilters;
  /** True while a filter change is being rendered on the server. */
  isPending: boolean;
  setFilters: (patch: Partial<ShopFilters>) => void;
  clearFilters: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function useShop() {
  const context = use(ShopContext);
  if (!context) throw new Error("useShop must be used within <ShopProvider>.");
  return context;
}

/**
 * Owns URL navigation for the listing. The Server Component above parses the
 * search params and passes them in; every control reads `filters` from here
 * and writes through `setFilters`, which:
 *
 * 1. updates the UI immediately with `useOptimistic` (the checkbox ticks, the
 *    category highlights) so rapid successive changes build on each other;
 * 2. navigates to the new URL inside a transition, so the current results stay
 *    on screen (dimmed through `data-pending`) instead of falling back to a
 *    skeleton while the server renders the next page.
 */
export function ShopProvider({
  filters,
  className,
  children,
}: {
  filters: ShopFilters;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticFilters, setOptimisticFilters] = useOptimistic(filters);

  function navigate(next: ShopFilters) {
    const href = createShopHref(next);
    if (href === createShopHref(optimisticFilters)) return;
    startTransition(() => {
      setOptimisticFilters(next);
      router.push(href, { scroll: false });
    });
  }

  const value: ShopContextValue = {
    filters: optimisticFilters,
    isPending,
    setFilters: (patch) => navigate({ ...optimisticFilters, ...patch }),
    clearFilters: () => navigate(clearShopFilters(optimisticFilters)),
  };

  return (
    <ShopContext value={value}>
      <div data-pending={isPending ? "" : undefined} className={cn("group/shop", className)}>
        {children}
      </div>
    </ShopContext>
  );
}

/** Wraps the results: dims them and marks them busy while new ones load. */
export function ShopResultsRegion({ className, children, ...props }: React.ComponentProps<"div">) {
  const { isPending } = useShop();
  return (
    <div
      aria-busy={isPending}
      className={cn(
        "transition-opacity duration-200 group-data-pending/shop:pointer-events-none group-data-pending/shop:opacity-50 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
