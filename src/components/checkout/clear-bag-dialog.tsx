"use client";

import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { selectCartCount, useCartStore } from "@/lib/store/cart";

/** "Clear bag" button, guarded by a confirmation dialog. */
export function ClearBagDialog() {
  const count = useCartStore(selectCartCount);
  const clear = useCartStore((state) => state.clear);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Trash2Icon data-icon="inline-start" aria-hidden />
          Clear bag
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="rounded-full bg-destructive/10 text-destructive">
            <Trash2Icon aria-hidden />
          </AlertDialogMedia>
          <AlertDialogTitle>Clear your bag?</AlertDialogTitle>
          <AlertDialogDescription>
            {count === 1 ? "The item" : `All ${count} items`} in your bag will be removed.
            This can’t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep items</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              clear();
              toast.success("Your bag is now empty");
            }}
          >
            Clear bag
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
