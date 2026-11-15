"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { hasActiveFilters } from "./search-params";
import { useShop } from "./shop-provider";

/**
 * Resets every filter (category, price, sale, stock, search) and keeps the sort order.
 *
 * It uses `aria-disabled` rather than `disabled` when there is nothing to
 * clear: a disabled button drops keyboard focus to <body> the moment it is
 * pressed, so focus would be lost right after clearing.
 */
export function ClearFiltersButton({
  children = "Clear all",
  focusTargetId,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick" | "disabled"> & {
  /** Element to focus after clearing, for buttons that unmount once the results change. */
  focusTargetId?: string;
}) {
  const { filters, clearFilters } = useShop();
  const isActive = hasActiveFilters(filters);

  return (
    <Button
      type="button"
      aria-disabled={!isActive}
      onClick={() => {
        if (!isActive) return;
        clearFilters();
        if (focusTargetId) document.getElementById(focusTargetId)?.focus();
      }}
      className={cn("aria-disabled:pointer-events-none aria-disabled:opacity-50", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
