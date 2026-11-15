"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createSafeStorage } from "@/lib/store/storage";
import type { CartItem, Product } from "@/types";

/** Maximum units of a single product per order. */
export const MAX_QUANTITY = 10;

interface AddItemInput {
  product: Pick<Product, "id" | "slug" | "name" | "price" | "images" | "stock">;
  color?: string;
  size?: string;
  quantity?: number;
}

interface CartState {
  items: CartItem[];
  /** Controls the cart sheet from anywhere (e.g. after "Add to bag"). */
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  /** Returns the number of units actually added (0 when the limit is reached). */
  addItem: (input: AddItemInput) => number;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export function getCartItemId(productId: string, color?: string, size?: string) {
  return [productId, color, size].filter(Boolean).join("__");
}

/** Units of a product the customer may have in the bag, all variants combined. */
export function getProductLimit(stock: number) {
  return Math.max(0, Math.min(MAX_QUANTITY, stock));
}

function unitsOfProduct(items: CartItem[], productId: string, exceptId?: string) {
  return items
    .filter((item) => item.productId === productId && item.id !== exceptId)
    .reduce((total, item) => total + item.quantity, 0);
}

/** Highest quantity a given line can be set to, given the other lines. */
export function getLineMax(items: CartItem[], line: CartItem) {
  return getProductLimit(line.stock) - unitsOfProduct(items, line.productId, line.id);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (isOpen) => set({ isOpen }),
      addItem: ({ product, color, size, quantity = 1 }) => {
        const { items } = get();
        const id = getCartItemId(product.id, color, size);
        const available =
          getProductLimit(product.stock) - unitsOfProduct(items, product.id);
        const added = Math.max(0, Math.min(quantity, available));
        if (added === 0) return 0;

        const existing = items.find((item) => item.id === id);
        set({
          items: existing
            ? items.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity + added, stock: product.stock }
                  : item,
              )
            : [
                ...items,
                {
                  id,
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.images[0],
                  price: product.price,
                  color,
                  size,
                  quantity: added,
                  stock: product.stock,
                },
              ],
        });
        return added;
      },
      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }
          return {
            items: state.items.map((item) =>
              item.id === id
                ? { ...item, quantity: Math.min(quantity, getLineMax(state.items, item)) }
                : item,
            ),
          };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "store-cart",
      version: 1,
      storage: createSafeStorage<Pick<CartState, "items">>(),
      partialize: (state) => ({ items: state.items }),
      // v0 lines had no stock information: assume the per-order maximum.
      migrate: (persisted) => {
        const items = (persisted as { items?: unknown })?.items;
        return {
          items: Array.isArray(items)
            ? (items as CartItem[]).map((item) => ({ ...item, stock: item.stock ?? MAX_QUANTITY }))
            : [],
        };
      },
      // Hydrated on the client by <StoreHydration /> to avoid SSR mismatches.
      skipHydration: true,
    },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);
