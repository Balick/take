# Next.js Storefront Template

A modern, open-source e-commerce template built with **Next.js 16**, **React 19**, **Tailwind CSS v4** and **shadcn/ui**. Free to use for your own store, client projects or as a learning resource.

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=fff)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-radix--nova-000)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

## Features

- **Complete storefront** — home page, catalog, product pages, cart, checkout, order confirmation, wishlist, account, about, contact, FAQ, 404 and error pages.
- **Catalog with URL-driven filters** — category, price range, on-sale, full-text search and sorting, all shareable through the URL.
- **Rich product pages** — image gallery, color and size selectors, size guide, stock messaging, reviews, related products, sticky mobile "Add to bag" bar.
- **Persistent cart & wishlist** — powered by [Zustand](https://zustand.docs.pmnd.rs), saved in `localStorage`, with a slide-over cart and free-shipping progress.
- **Demo checkout** — validated multi-section form (react-hook-form + zod), delivery options, live totals. No payment is processed.
- **Command palette search** — press <kbd>⌘</kbd> <kbd>K</kbd> / <kbd>Ctrl</kbd> <kbd>K</kbd> anywhere.
- **Light, dark & system themes** with `next-themes`.
- **SEO ready** — metadata per page, Open Graph image, JSON-LD for products, `sitemap.xml`, `robots.txt`, web manifest.
- **Accessible** — semantic markup, keyboard navigation, skip link, focus states, ARIA labels.
- **Next.js 16 best practices** — App Router, Server Components by default, Cache Components and Partial Prefetching enabled, statically generated product pages.

## Tech stack

| Area          | Tools                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack), React 19, TypeScript              |
| Styling       | Tailwind CSS v4, `tw-animate-css`                                     |
| UI components | shadcn/ui (radix-nova style, Radix primitives), lucide-react icons    |
| State         | Zustand (cart, wishlist)                                              |
| Forms         | react-hook-form, zod                                                  |
| Misc          | next-themes, sonner (toasts), embla-carousel, cmdk                     |

## Getting started

**Prerequisites:** Node.js 20.9+ and npm.

```bash
git clone https://github.com/Balick/tailus-ui-react-store.git my-store
cd my-store
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start the development server     |
| `npm run build`     | Create a production build        |
| `npm run start`     | Serve the production build       |
| `npm run lint`      | Lint the project with ESLint     |
| `npm run typecheck` | Type-check with TypeScript       |

## Project structure

```
src/
├── app/                    # Routes (App Router)
│   ├── page.tsx            # Home
│   ├── products/           # Catalog + product pages (/products/[slug])
│   ├── cart/  checkout/    # Cart, checkout and order confirmation
│   ├── wishlist/ account/  # Customer pages
│   ├── about/ contact/ faq/
│   └── sitemap.ts robots.ts manifest.ts opengraph-image.tsx
├── components/
│   ├── ui/                 # shadcn/ui components (generated, editable)
│   ├── layout/             # Header, navigation, search, cart sheet, footer
│   ├── product/            # Product card, grid, price, rating, wishlist...
│   ├── product-detail/     # Product page sections
│   ├── shop/               # Catalog filters and toolbar
│   ├── cart/ checkout/     # Cart lines, summaries, checkout form
│   ├── home/ pages/        # Page sections
│   ├── shared/             # Page and section headings
│   └── providers/          # Theme, tooltips, toasts, store hydration
├── config/site.ts          # ⭐ Store name, navigation, currency, shipping rules
├── lib/
│   ├── data/catalog.ts     # ⭐ Demo products, categories and reviews
│   ├── queries.ts          # Data access layer (swap for your backend)
│   ├── store/              # Zustand stores (cart, wishlist)
│   └── format.ts           # Price, date and order total helpers
└── types/                  # Shared TypeScript types
```

## Customization

1. **Brand & settings** — edit [`src/config/site.ts`](src/config/site.ts): store name, description, navigation, footer links, social links, currency, free-shipping threshold, shipping cost and tax rate.
2. **Products** — edit [`src/lib/data/catalog.ts`](src/lib/data/catalog.ts) and put your images in `public/images`.
3. **Connect a real backend** — every page reads data through [`src/lib/queries.ts`](src/lib/queries.ts). Rewrite those functions to call Shopify, Medusa, Stripe, a CMS or a database; the UI does not need to change.
4. **Theme** — colors, radius and fonts are CSS variables in [`src/app/globals.css`](src/app/globals.css). Generate a palette with the [shadcn theme editor](https://ui.shadcn.com/themes) and paste it there. Fonts are loaded in [`src/app/layout.tsx`](src/app/layout.tsx).
5. **Components** — add more shadcn/ui components with `npx shadcn@latest add <component>`.
6. **Payments & auth** — the checkout and account pages are UI only. Plug in Stripe Checkout / Payment Element and an auth provider such as Auth.js, Better Auth, Clerk or Supabase.

## Deployment

Deploy on [Vercel](https://vercel.com/new) or any platform that supports Next.js. Set `NEXT_PUBLIC_SITE_URL` to your production URL so metadata, the sitemap and Open Graph images use the right domain.

## Credits

- UI components by [shadcn/ui](https://ui.shadcn.com)
- Product photos by [Ryan Hoffman](https://unsplash.com/@ryanhoffman007) on Unsplash

## License

[MIT](LICENSE) — free for personal and commercial use.
