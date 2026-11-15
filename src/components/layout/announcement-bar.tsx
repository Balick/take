import { siteConfig } from "@/config/site";

/** Slim promotional bar rendered above the site header. */
export function AnnouncementBar() {
  if (!siteConfig.announcement) return null;

  return (
    <div className="bg-primary text-primary-foreground">
      <p className="container-page py-2 text-center text-xs tracking-wide text-balance">
        {siteConfig.announcement}
      </p>
    </div>
  );
}
