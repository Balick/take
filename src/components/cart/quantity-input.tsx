"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "default";
  label?: string;
  className?: string;
}

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "default",
  label = "Quantity",
  className,
}: QuantityInputProps) {
  const buttonSize = size === "sm" ? "icon-xs" : "icon-sm";
  const atMin = value <= min;
  const atMax = value >= max;

  // `aria-disabled` instead of `disabled`: a disabled button loses keyboard
  // focus the moment the limit is reached, dropping focus to <body>.
  const stepperClassName =
    "rounded-full aria-disabled:pointer-events-none aria-disabled:opacity-50";

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-full border bg-background p-0.5",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size={buttonSize}
        className={stepperClassName}
        aria-label="Decrease quantity"
        aria-disabled={atMin}
        onClick={() => !atMin && onChange(value - 1)}
      >
        <MinusIcon aria-hidden />
      </Button>
      <output
        aria-live="polite"
        className={cn(
          "min-w-7 text-center font-medium tabular-nums",
          size === "sm" ? "text-xs" : "text-sm",
        )}
      >
        {value}
      </output>
      <Button
        type="button"
        variant="ghost"
        size={buttonSize}
        className={stepperClassName}
        aria-label={atMax ? "Increase quantity (maximum reached)" : "Increase quantity"}
        aria-disabled={atMax}
        onClick={() => !atMax && onChange(value + 1)}
      >
        <PlusIcon aria-hidden />
      </Button>
    </div>
  );
}
