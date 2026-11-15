"use client";

import { HeartOffIcon, Trash2Icon } from "lucide-react";
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
import { useWishlistStore } from "@/lib/store/wishlist";

/** "Clear wishlist" button, guarded by a confirmation dialog, with an undo toast. */
export function ClearWishlistDialog({ count }: { count: number }) {
  const clear = useWishlistStore((state) => state.clear);

  function handleClear() {
    const previous = useWishlistStore.getState().items;
    clear();
    toast.success("Wishlist cleared", {
      description: `${count === 1 ? "1 item was" : `${count} items were`} removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          const { items, toggle } = useWishlistStore.getState();
          // Restore in the original order, skipping anything saved again since.
          previous.filter((id) => !items.includes(id)).forEach((id) => toggle(id));
        },
      },
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Trash2Icon data-icon="inline-start" aria-hidden />
          Clear wishlist
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="rounded-full bg-destructive/10 text-destructive">
            <HeartOffIcon aria-hidden />
          </AlertDialogMedia>
          <AlertDialogTitle>Clear your wishlist?</AlertDialogTitle>
          <AlertDialogDescription>
            {count === 1 ? "The saved item" : `All ${count} saved items`} will be removed from
            this device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep items</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleClear}>
            Clear wishlist
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
