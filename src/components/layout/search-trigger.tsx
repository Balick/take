"use client";

import { SearchIcon } from "lucide-react";

import { useIsApplePlatform } from "@/components/layout/apple-platform";
import { useSearchStore } from "@/components/layout/search-store";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function SearchShortcut({ className }: { className?: string }) {
  const isApple = useIsApplePlatform();

  return (
    <KbdGroup className={className}>
      <Kbd>{isApple ? "⌘" : "Ctrl"}</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  );
}

/**
 * Opens the search palette. Icon-only below `xl`, a search-field lookalike
 * with the keyboard shortcut hint above.
 */
export function SearchTrigger({ className }: { className?: string }) {
  const setOpen = useSearchStore((state) => state.setOpen);
  const keyShortcut = useIsApplePlatform() ? "Meta+K" : "Control+K";

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Search products"
            aria-haspopup="dialog"
            aria-keyshortcuts={keyShortcut}
            className={cn("xl:hidden", className)}
            onClick={() => setOpen(true)}
          >
            <SearchIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="hidden lg:inline-flex">
          Search <SearchShortcut />
        </TooltipContent>
      </Tooltip>

      <Button
        variant="outline"
        aria-label="Search products"
        aria-haspopup="dialog"
        aria-keyshortcuts={keyShortcut}
        className={cn(
          "hidden w-60 justify-between rounded-full pr-1.5 font-normal text-muted-foreground xl:inline-flex",
          className,
        )}
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <SearchIcon aria-hidden />
          Search products…
        </span>
        <SearchShortcut className="[&_kbd]:rounded-full [&_kbd]:px-1.5" />
      </Button>
    </>
  );
}
