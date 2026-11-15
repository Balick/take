import type { Metadata } from "next";

import { AboutCta } from "@/components/pages/about/about-cta";
import { getAboutData } from "@/components/pages/about/about-data";
import { AboutHero } from "@/components/pages/about/about-hero";
import { AboutNumbers } from "@/components/pages/about/about-numbers";
import { StoryBlock } from "@/components/pages/about/about-story";
import { AboutValues } from "@/components/pages/about/about-values";
import { socialMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

const description = `${siteConfig.name} designs monochrome everyday essentials, made in small batches with fair partners and built to be worn for years.`;

export const metadata: Metadata = {
  title: "About us",
  description,
  alternates: { canonical: "/about" },
  ...socialMetadata({ title: `About ${siteConfig.name}`, description, path: "/about" }),
};

export default async function AboutPage() {
  const { images, productCount, reviewCount, rating } = await getAboutData();

  return (
    <>
      <AboutHero images={[images.heroPrimary, images.heroSecondary, images.heroTertiary]} />
      <AboutValues />
      <StoryBlock
        eyebrow="The studio"
        title={
          <>
            Designed slowly, <em className="italic">on purpose</em>
          </>
        }
        paragraphs={[
          `${siteConfig.name} began in a small studio with a single heavyweight tee and a question: what if a wardrobe could be built from a few pieces that simply work together?`,
          "We still design everything in-house. Patterns are cut, worn, washed and adjusted for months until the fit feels right, and only then do we produce a first small batch.",
        ]}
        image={images.studio}
        caption="Every piece is wear-tested for months"
      />
      <StoryBlock
        reverse
        eyebrow="Built to last"
        title={
          <>
            Made to outlive <em className="italic">the trend cycle</em>
          </>
        }
        paragraphs={[
          "No seasonal collections, no endless drops. Our permanent collection is restocked rather than replaced, so you can come back for the same fit years from now.",
          "When something isn’t right, we fix it: a stronger seam, a denser fabric, a lid that seals better. Your reviews tell us where to look next.",
        ]}
        image={images.lasting}
        caption="Restocked, never replaced"
      />
      <AboutNumbers productCount={productCount} reviewCount={reviewCount} rating={rating} />
      <AboutCta />
    </>
  );
}
