import { cacheLife } from "next/cache";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { GitHubIcon, InstagramIcon, XIcon } from "@/components/layout/social-icons";
import { siteConfig } from "@/config/site";

const socialLinks = [
  { label: "Instagram", href: siteConfig.links.instagram, icon: InstagramIcon },
  { label: "X (Twitter)", href: siteConfig.links.x, icon: XIcon },
  { label: "GitHub", href: siteConfig.links.github, icon: GitHubIcon },
];

/**
 * The current year. Reading the clock during prerender is not allowed with
 * Cache Components, so the value is cached and refreshed daily.
 */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Logo className="self-start" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Modern essentials in heavyweight cotton and soft ribbed knits, designed to be
              worn on repeat. Made in small batches, shipped in plastic-free packaging.
            </p>
          </div>

          <section aria-labelledby="footer-newsletter" className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 id="footer-newsletter" className="font-display text-2xl leading-tight">
                Join the list
              </h2>
              <p className="text-sm text-muted-foreground">
                Early access to new drops, restocks and members-only sales.
              </p>
            </div>
            <NewsletterForm />
          </section>

          <ul aria-label="Follow us" className="flex items-center gap-1">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:transition-colors"
                >
                  <Icon className="size-4" />
                  <span className="sr-only">{label} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {siteConfig.footerNav.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h2 className="text-sm font-medium">{group.title}</h2>
              <ul className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline motion-safe:transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col gap-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <p>
              © <CurrentYear /> {siteConfig.name}. All rights reserved.
            </p>
            <span aria-hidden className="hidden text-border sm:inline">
              /
            </span>
            <p>
              Built with{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline focus-visible:underline"
              >
                Next.js
                <span className="sr-only"> (opens in a new tab)</span>
              </a>{" "}
              &amp;{" "}
              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline focus-visible:underline"
              >
                shadcn/ui
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <ul aria-label="Accepted payment methods" className="flex flex-wrap items-center gap-1.5">
              {siteConfig.paymentMethods.map((method) => (
                <li
                  key={method}
                  className="rounded-md border bg-background px-1.5 py-0.5 text-[0.6875rem] leading-4 font-medium text-foreground/80"
                >
                  {method}
                </li>
              ))}
            </ul>
            <ModeToggle side="top" size="icon" />
          </div>
        </div>
      </div>
    </footer>
  );
}
