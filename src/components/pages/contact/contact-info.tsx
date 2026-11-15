import { ArrowRightIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

import { contactDetails } from "@/components/pages/contact/contact-details";

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4 rounded-2xl border p-5">
      <span
        aria-hidden
        className="grid size-10 shrink-0 place-items-center rounded-full border bg-muted/50"
      >
        <Icon className="size-4.5" strokeWidth={1.75} />
      </span>
      <div className="flex min-w-0 flex-col gap-1 text-sm">
        <h3 className="font-medium">{title}</h3>
        <div className="text-pretty text-muted-foreground">{children}</div>
      </div>
    </li>
  );
}

const linkClassName =
  "font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:underline break-all";

/** Ways to reach customer service, plus a shortcut to the FAQ. */
export function ContactInfo() {
  const { email, phone, hours, address } = contactDetails;

  return (
    <aside aria-labelledby="contact-info-heading" className="flex flex-col gap-4">
      <h2 id="contact-info-heading" className="sr-only">
        Other ways to reach us
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <InfoCard icon={MailIcon} title="Email">
          <a href={`mailto:${email}`} className={linkClassName}>
            {email}
          </a>
          <p>Best for order questions. Include your order number.</p>
        </InfoCard>
        <InfoCard icon={PhoneIcon} title="Phone">
          <a href={phone.href} className={linkClassName}>
            {phone.display}
          </a>
          <p>Standard call rates apply.</p>
        </InfoCard>
        <InfoCard icon={ClockIcon} title="Opening hours">
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
            {hours.map((slot) => (
              <div key={slot.days} className="contents">
                <dt>{slot.days}</dt>
                <dd className="text-foreground tabular-nums">{slot.time}</dd>
              </div>
            ))}
          </dl>
        </InfoCard>
        <InfoCard icon={MapPinIcon} title="Studio">
          <address className="not-italic">
            {address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p className="mt-1">{address.note}</p>
        </InfoCard>
      </ul>

      <Link
        href="/faq"
        className="group/faq flex items-center justify-between gap-4 rounded-2xl bg-primary p-5 text-primary-foreground transition-colors outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">Looking for a quick answer?</span>
          <span className="text-sm text-primary-foreground/70">
            Shipping, returns and sizing are covered in our FAQ.
          </span>
        </span>
        <ArrowRightIcon
          aria-hidden
          className="size-4 shrink-0 motion-safe:transition-transform group-hover/faq:translate-x-0.5"
        />
      </Link>
    </aside>
  );
}
