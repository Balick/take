"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

import { DEFAULT_SORT, MAX_QUERY_LENGTH, SHOP_PATH } from "./search-params";
import { useShop } from "./shop-provider";

/**
 * Sets `?q=` on submit. Without JavaScript it is a plain GET form that keeps
 * the other filters through hidden inputs.
 */
export function SearchForm({ className }: { className?: string }) {
  const { filters, setFilters } = useShop();
  const inputRef = useRef<HTMLInputElement>(null);
  const currentQuery = filters.query ?? "";
  const [value, setValue] = useState(currentQuery);

  // Keep the field in sync when the query changes elsewhere (chip removed,
  // "Clear all", browser back), without an effect.
  const [syncedQuery, setSyncedQuery] = useState(currentQuery);
  if (syncedQuery !== currentQuery) {
    setSyncedQuery(currentQuery);
    setValue(currentQuery);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim().replace(/\s+/g, " ");
    setValue(query);
    setFilters({ query: query || undefined });
  }

  function handleClear() {
    setValue("");
    inputRef.current?.focus();
    if (filters.query) setFilters({ query: undefined });
  }

  return (
    <form
      role="search"
      action={SHOP_PATH}
      method="get"
      onSubmit={handleSubmit}
      className={cn("w-full", className)}
    >
      {filters.category && <input type="hidden" name="category" value={filters.category} />}
      {filters.onSale && <input type="hidden" name="sale" value="1" />}
      {filters.inStock && <input type="hidden" name="stock" value="1" />}
      {filters.minPrice !== undefined && (
        <input type="hidden" name="min" value={filters.minPrice} />
      )}
      {filters.maxPrice !== undefined && (
        <input type="hidden" name="max" value={filters.maxPrice} />
      )}
      {filters.sort !== DEFAULT_SORT && <input type="hidden" name="sort" value={filters.sort} />}

      <InputGroup className="h-9 bg-background">
        <InputGroupAddon>
          <SearchIcon aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          type="search"
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && value) {
              event.preventDefault();
              handleClear();
            }
          }}
          placeholder="Search products"
          aria-label="Search products"
          autoComplete="off"
          enterKeyHint="search"
          maxLength={MAX_QUERY_LENGTH}
          className="[&::-webkit-search-cancel-button]:appearance-none"
        />
        {value && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={handleClear}>
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </form>
  );
}
