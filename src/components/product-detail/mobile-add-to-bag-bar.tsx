import { useEffect, useRef } from "react";

import { Price } from "@/components/product/price";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileAddToBagBarProps {
  visible: boolean;
  name: string;
  price: number;
  compareAtPrice?: number;
  /** Selected variant summary, e.g. "Black · M". */
  variant?: string;
  soldOut: boolean;
  onAdd: () => void;
}

/**
 * Compact "Add to bag" bar pinned to the bottom of small screens. Shown once
 * the main purchase button has scrolled out of view. Rendered by
 * AddToCartForm (a Client Component), so it takes a callback prop.
 *
 * While visible, it publishes its height as `--sticky-bar-height` on <html>
 * so focus scrolling and toasts stay clear of it.
 */
export function MobileAddToBagBar({
  visible,
  name,
  price,
  compareAtPrice,
  variant,
  soldOut,
  onAdd,
}: MobileAddToBagBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!visible || !bar) return;

    const root = document.documentElement;
    // Hidden with `lg:hidden` on large screens, where it measures 0.
    const sync = () => {
      const height = bar.offsetHeight;
      if (height > 0) root.style.setProperty("--sticky-bar-height", `${height}px`);
      else root.style.removeProperty("--sticky-bar-height");
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(bar);

    return () => {
      observer.disconnect();
      root.style.removeProperty("--sticky-bar-height");
    };
  }, [visible]);

  return (
    <div
      ref={barRef}
      role="region"
      aria-label="Quick add to bag"
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.15)] backdrop-blur-xl lg:hidden",
        "motion-safe:transition-[translate,opacity] motion-safe:duration-300 motion-safe:ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
      )}
    >
      <div className="container-page flex items-center gap-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          <div className="flex items-baseline gap-2">
            <Price price={price} compareAtPrice={compareAtPrice} size="sm" />
            {variant && (
              <span className="truncate text-xs text-muted-foreground">{variant}</span>
            )}
          </div>
        </div>
        <Button
          type="button"
          size="lg"
          className="h-10 shrink-0 rounded-full px-5"
          disabled={soldOut}
          onClick={onAdd}
        >
          {soldOut ? "Sold out" : "Add to bag"}
        </Button>
      </div>
    </div>
  );
}
