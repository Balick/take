import type { Metadata } from "next";

import { ContactForm } from "@/components/pages/contact/contact-form";
import { ContactInfo } from "@/components/pages/contact/contact-info";
import { socialMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site";

const description = `Questions about an order, sizing or returns? Send us a message and a real person will get back to you. ${siteConfig.contact.responseTime}`;

export const metadata: Metadata = {
  title: "Contact us",
  description,
  alternates: { canonical: "/contact" },
  ...socialMetadata({ title: `Contact us · ${siteConfig.name}`, description, path: "/contact" }),
};

export default function ContactPage() {
  return (
    <div className="container-page pb-16 sm:pb-24">
      <PageHeader
        eyebrow="Customer care"
        title="We’re here to help"
        description={description}
      />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <section
          aria-labelledby="contact-form-heading"
          className="flex flex-col gap-6 rounded-2xl border p-5 sm:p-8"
        >
          <div className="flex flex-col gap-1.5">
            <h2 id="contact-form-heading" className="font-display text-3xl tracking-tight">
              Send us a message
            </h2>
            <p className="text-sm text-muted-foreground">
              All fields are required unless marked optional.
            </p>
          </div>
          <ContactForm />
        </section>
        <ContactInfo />
      </div>
    </div>
  );
}
