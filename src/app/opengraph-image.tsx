import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card for every page (pages can add their own
 * `opengraph-image` next to their `page.tsx`). Uses the built-in font, so no
 * font file has to be bundled. To use the brand typefaces, load a .ttf with
 * `readFile` and pass it to the `fonts` option.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundColor: "#fafafa",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: -0.5,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 32 32">
              <path d="M8 8h16v5h-6v11h-5V13H8zM21 16h3v8h-3z" fill="#0a0a0a" />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#a3a3a3",
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 120,
              lineHeight: 1,
              letterSpacing: -4,
              fontWeight: 600,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              fontSize: 34,
              lineHeight: 1.35,
              color: "#a3a3a3",
            }}
          >
            {siteConfig.description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
