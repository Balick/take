import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "default";
  className?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  size = "default",
  className,
}: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => {
          const fill = Math.max(0, Math.min(1, rating - index));
          return (
            <span key={index} className="relative inline-flex">
              <StarIcon
                className={cn(
                  "fill-muted text-muted",
                  size === "sm" ? "size-3.5" : "size-4",
                )}
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <StarIcon
                  className={cn(
                    "fill-amber-400 text-amber-400",
                    size === "sm" ? "size-3.5" : "size-4",
                  )}
                />
              </span>
            </span>
          );
        })}
      </div>
      <span className="sr-only">Rated {rating.toFixed(1)} out of 5</span>
      {reviewCount !== undefined && (
        <span
          className={cn(
            "text-muted-foreground tabular-nums",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          {rating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  );
}
