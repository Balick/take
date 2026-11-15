"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createSafeStorage } from "@/lib/store/storage";

interface WishlistState {
  /** Product ids */
  items: string[];
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      /** Returns `true` when the product was added, `false` when removed. */
      toggle: (productId) => {
        const exists = get().items.includes(productId);
        set((state) => ({
          items: exists
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));
        return !exists;
      },
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((id) => id !== productId) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "store-wishlist",
      storage: createSafeStorage<Pick<WishlistState, "items">>(),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);
