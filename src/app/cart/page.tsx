import type { Metadata } from "next";
import { Suspense } from "react";

import {
  CartRecommendations,
  CartRecommendationsSkeleton,
} from "@/components/checkout/cart-recommendations";
import { CartView } from "@/components/checkout/cart-view";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review the items in your bag before checking out.",
  robots: { index: false, follow: true },
};

/**
 * The bag lives in localStorage, so the list and summary are rendered by a
 * Client Component (skeleton on the server, real content after hydration).
 * The recommendations below are server-rendered from the catalog.
 */
export default function CartPage() {
  return (
    <>
      <div className="container-page pb-16 sm:pb-24">
        <CartView />
      </div>

      <Suspense fallback={<CartRecommendationsSkeleton />}>
        <CartRecommendations />
      </Suspense>
    </>
  );
}
