/**
 * Returns the href that best matches the current URL, or `null`.
 *
 * Navigation items can point to the same page with different search params
 * (e.g. `/products`, `/products?sale=1`, `/products?sort=newest`), so a plain
 * pathname comparison is not enough: the item whose params all match the
 * current URL, with the most params, wins. Nested routes (e.g. a product page
 * under `/products`) fall back to their parent item.
 */
export function getActiveHref(
  hrefs: readonly string[],
  pathname: string | null,
  searchParams: URLSearchParams | { get(name: string): string | null } | null,
): string | null {
  if (!pathname) return null;

  let best: { href: string; score: number } | null = null;

  for (const href of hrefs) {
    const url = new URL(href, "http://localhost");
    const path = url.pathname;
    const exactPath = pathname === path;
    const nestedPath = path !== "/" && pathname.startsWith(`${path}/`);
    if (!exactPath && !nestedPath) continue;

    const params = [...url.searchParams.entries()];
    if (nestedPath && params.length > 0) continue;
    if (params.some(([key, value]) => searchParams?.get(key) !== value)) continue;

    const score = params.length * 10 + (exactPath ? 1 : 0);
    if (!best || score > best.score) best = { href, score };
  }

  return best?.href ?? null;
}

/** Badge label for counters: caps at 9+ to keep the badge compact. */
export function formatCount(count: number) {
  return count > 9 ? "9+" : String(count);
}
