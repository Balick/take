"use client";

import { HeartIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/lib/store/wishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  productName: string;
  variant?: "overlay" | "outline";
  className?: string;
}

export function WishlistButton({
  productId,
  productName,
  variant = "overlay",
  className,
}: WishlistButtonProps) {
  const isSaved = useWishlistStore((state) => state.items.includes(productId));
  const toggle = useWishlistStore((state) => state.toggle);

  function handleClick(event: React.MouseEvent) {
    // The button lives inside clickable cards: don't trigger the card link.
    event.preventDefault();
    event.stopPropagation();
    const added = toggle(productId);
    toast.success(added ? "Saved to wishlist" : "Removed from wishlist", {
      description: productName,
    });
  }

  return (
    <Button
      type="button"
      size={variant === "overlay" ? "icon-sm" : "icon-lg"}
      variant={variant === "overlay" ? "secondary" : "outline"}
      aria-pressed={isSaved}
      aria-label={`Save ${productName} to wishlist`}
      onClick={handleClick}
      className={cn(
        variant === "overlay" &&
          "rounded-full bg-background/90 shadow-sm backdrop-blur hover:bg-background",
        className,
      )}
    >
      <HeartIcon
        className={cn("transition-colors", isSaved && "fill-sale text-sale")}
      />
    </Button>
  );
}
