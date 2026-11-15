import type { Metadata } from "next";

import { WishlistView } from "@/components/pages/wishlist/wishlist-view";
import { PageHeader } from "@/components/shared/page-header";
import { getFeaturedProducts, getProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The pieces you saved for later.",
  robots: { index: false, follow: true },
};

export default async function WishlistPage() {
  // Saved ids live in the browser: send the catalog and resolve them client-side.
  // With a large catalog, fetch the saved products by id from an API instead.
  const [products, suggestions] = await Promise.all([getProducts(), getFeaturedProducts(4)]);

  return (
    <div className="container-page pb-16 sm:pb-24">
      <PageHeader
        eyebrow="Saved for later"
        title="Wishlist"
        description="Keep an eye on the pieces you love and add them to your bag whenever you’re ready."
      />
      <WishlistView products={products} suggestions={suggestions} />
    </div>
  );
}
