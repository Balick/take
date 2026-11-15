import type { FaqSection } from "@/components/pages/faq/faq-data";

/**
 * schema.org `FAQPage` structured data. `<` is escaped so an answer can never
 * close the script tag.
 */
export function FaqJsonLd({ sections }: { sections: FaqSection[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sections.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer.join(" ") },
      })),
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
