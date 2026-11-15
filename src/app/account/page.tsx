import { InfoIcon } from "lucide-react";
import type { Metadata } from "next";

import { AccountBenefits } from "@/components/pages/account/account-benefits";
import { AuthPanel } from "@/components/pages/account/auth-panel";
import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getNewArrivals } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in or create an account to track orders and check out faster.",
  robots: { index: false, follow: true },
};

export default async function AccountPage() {
  // The newest drop illustrates the side panel, so it follows your catalog.
  const [latest] = await getNewArrivals(1);

  return (
    <div className="container-page pb-16 sm:pb-24">
      <PageHeader
        eyebrow="Your account"
        title="Sign in or join us"
        description="One account for your orders, saved addresses and wishlist."
      />

      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <div className="flex w-full max-w-md flex-col gap-8 justify-self-center lg:justify-self-start">
          <Alert role="note">
            <InfoIcon aria-hidden />
            <AlertTitle>Demo authentication</AlertTitle>
            <AlertDescription>
              The forms validate like the real thing, but no account is created and nothing
              leaves your browser.
            </AlertDescription>
          </Alert>
          <AuthPanel />
        </div>
        <AccountBenefits image={latest?.images[0]} />
      </div>
    </div>
  );
}
