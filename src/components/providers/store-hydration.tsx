"use client";

import { useEffect, useSyncExternalStore } from "react";

import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";

/**
 * Persisted stores skip automatic hydration so the server HTML and the first
 * client render match. This component restores them from localStorage once
 * the app is mounted. Rendered once, in the root providers.
 */
export function StoreHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();
  }, []);

  return null;
}

function subscribeToHydration(callback: () => void) {
  const unsubscribeCart = useCartStore.persist.onFinishHydration(callback);
  const unsubscribeWishlist = useWishlistStore.persist.onFinishHydration(callback);
  return () => {
    unsubscribeCart();
    unsubscribeWishlist();
  };
}

/**
 * `true` once the cart and wishlist have been restored from localStorage.
 * Use it to show skeletons instead of a misleading "empty" state.
 */
export function useStoresHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    () =>
      useCartStore.persist.hasHydrated() && useWishlistStore.persist.hasHydrated(),
    () => false,
  );
}
