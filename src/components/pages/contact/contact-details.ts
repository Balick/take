import { siteConfig } from "@/config/site";

/** Customer service details: edit them in `src/config/site.ts`. */
export const contactDetails = siteConfig.contact;

export const contactTopics = [
  { value: "order", label: "An existing order" },
  { value: "shipping", label: "Shipping & delivery" },
  { value: "returns", label: "Returns & exchanges" },
  { value: "product", label: "Sizing & product questions" },
  { value: "wholesale", label: "Wholesale & press" },
  { value: "other", label: "Something else" },
] as const;

export type ContactTopic = (typeof contactTopics)[number]["value"];
