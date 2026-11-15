"use client";

import { useId } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/types";

import { useShop } from "./shop-provider";

export function SortSelect({
  options,
  className,
}: {
  /** `sortOptions` from the data layer, passed in to keep it out of the client bundle. */
  options: { value: SortOption; label: string }[];
  className?: string;
}) {
  const id = useId();
  const { filters, setFilters } = useShop();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Label
        htmlFor={id}
        className="sr-only font-normal whitespace-nowrap text-muted-foreground sm:not-sr-only"
      >
        Sort by
      </Label>
      <Select
        value={filters.sort}
        onValueChange={(value) => {
          const option = options.find((item) => item.value === value);
          if (option) setFilters({ sort: option.value });
        }}
      >
        <SelectTrigger id={id} className="w-44 bg-background data-[size=default]:h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="end">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
