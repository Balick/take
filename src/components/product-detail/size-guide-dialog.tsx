"use client";

import { RulerIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Unit = "cm" | "in";

/** Garment measurements, laid flat, in centimeters. */
const measurements = [
  { size: "XS", chest: 96, length: 68 },
  { size: "S", chest: 102, length: 70 },
  { size: "M", chest: 108, length: 72 },
  { size: "L", chest: 114, length: 74 },
  { size: "XL", chest: 120, length: 76 },
];

function convert(cm: number, unit: Unit) {
  if (unit === "cm") return `${cm}`;
  // Round to the nearest half inch, like most printed size charts.
  return `${Math.round((cm / 2.54) * 2) / 2}`;
}

export function SizeGuideDialog({ productName }: { productName: string }) {
  const [unit, setUnit] = useState<Unit>("cm");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto px-0 text-muted-foreground hover:text-foreground"
        >
          <RulerIcon data-icon="inline-start" />
          Size guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] gap-6 overflow-y-auto p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-normal tracking-tight">
            Size guide
          </DialogTitle>
          <DialogDescription>
            Garment measurements for the {productName}, taken flat. Our cuts are
            relaxed: if you are between sizes, size down for a closer fit.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-4">
          <p id="size-guide-unit" className="text-sm font-medium">
            Units
          </p>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={0}
            value={unit}
            onValueChange={(value) => value && setUnit(value as Unit)}
            aria-labelledby="size-guide-unit"
          >
            <ToggleGroupItem value="cm" className="px-3">
              cm
            </ToggleGroupItem>
            <ToggleGroupItem value="in" className="px-3">
              in
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="rounded-xl border">
          <Table>
            <TableCaption className="sr-only">
              Chest width and body length per size, in {unit === "cm" ? "centimeters" : "inches"}
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4">Size</TableHead>
                <TableHead className="px-4 text-right">Chest ({unit})</TableHead>
                <TableHead className="px-4 text-right">Length ({unit})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {measurements.map((row) => (
                <TableRow key={row.size}>
                  <TableHead scope="row" className="px-4 font-medium">
                    {row.size}
                  </TableHead>
                  <TableCell className="px-4 text-right tabular-nums">
                    {convert(row.chest, unit)}
                  </TableCell>
                  <TableCell className="px-4 text-right tabular-nums">
                    {convert(row.length, unit)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-muted/60 p-4">
            <dt className="font-medium">Chest</dt>
            <dd className="mt-1 text-muted-foreground">
              Measure straight across, 2.5 cm below the armholes.
            </dd>
          </div>
          <div className="rounded-xl bg-muted/60 p-4">
            <dt className="font-medium">Length</dt>
            <dd className="mt-1 text-muted-foreground">
              From the highest point of the shoulder down to the hem.
            </dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
