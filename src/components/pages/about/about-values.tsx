import { HandshakeIcon, LeafIcon, ScissorsIcon, UsersIcon } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";

const values = [
  {
    icon: LeafIcon,
    title: "Honest materials",
    description:
      "Cotton jersey and 18/8 stainless steel, chosen to age well. Every product page lists exactly what it’s made of.",
  },
  {
    icon: ScissorsIcon,
    title: "Considered craft",
    description:
      "Each piece goes through months of wear tests before release. Seams are reinforced, prints are cured to last.",
  },
  {
    icon: HandshakeIcon,
    title: "Fair production",
    description:
      "We work with a handful of family-run workshops, pay fair wages and visit every partner in person.",
  },
  {
    icon: UsersIcon,
    title: "Community first",
    description:
      "Your reviews shape what we make next. The most requested fits and colors go straight to the studio.",
  },
];

export function AboutValues() {
  return (
    <section aria-labelledby="values-heading" className="border-y bg-muted/40">
      <div className="container-page py-16 sm:py-24">
        <SectionHeading
          eyebrow="What we stand for"
          title={<span id="values-heading">Four promises, every piece</span>}
          description="The principles behind every decision, from the first sketch to the box on your doorstep."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="group/value flex flex-col gap-5 rounded-2xl border bg-background p-6 transition-colors hover:border-foreground/20"
            >
              <span
                aria-hidden
                className="grid size-11 place-items-center rounded-full border motion-safe:transition-transform motion-safe:duration-300 group-hover/value:-rotate-6"
              >
                <Icon className="size-5" strokeWidth={1.5} />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-pretty text-muted-foreground">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
