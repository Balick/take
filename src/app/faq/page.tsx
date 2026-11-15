import type { Metadata } from "next";

import { faqSections } from "@/components/pages/faq/faq-data";
import { FaqGroup } from "@/components/pages/faq/faq-group";
import { FaqJsonLd } from "@/components/pages/faq/faq-json-ld";
import { FaqNav } from "@/components/pages/faq/faq-nav";
import { HelpCard } from "@/components/pages/faq/help-card";
import { socialMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";

const description = `Answers about orders, shipping, returns, payment and sizing. Free shipping on orders of ${formatPrice(siteConfig.freeShippingThreshold)} or more, and free returns within ${siteConfig.returnWindowDays} days.`;

export const metadata: Metadata = {
  title: "FAQ",
  description,
  alternates: { canonical: "/faq" },
  ...socialMetadata({
    title: `Frequently asked questions · ${siteConfig.name}`,
    description,
    path: "/faq",
  }),
};

export default function FaqPage() {
  return (
    <div className="container-page pb-16 sm:pb-24">
      <FaqJsonLd sections={faqSections} />
      <PageHeader
        eyebrow="Help center"
        title="Frequently asked questions"
        description="Everything you need to know about ordering, delivery and returns. Can’t find your answer? We’re one message away."
      />

      <div className="grid items-start gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
        <FaqNav sections={faqSections} />
        <div className="flex min-w-0 flex-col gap-14 sm:gap-16">
          {faqSections.map((section) => (
            <FaqGroup key={section.id} section={section} />
          ))}
          <HelpCard />
        </div>
      </div>
    </div>
  );
}
