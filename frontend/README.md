# Taza Cup — Next.js migration

Migrated from TanStack Start (Vite) to Next.js 15 App Router.

## Before running

1. **Add your real logo**: place your logo PNG at `public/logo.png`.
   The original repo's logo reference pointed at Lovable's own hosted
   CDN (`.lovable`'s asset JSON), which won't resolve outside Lovable —
   every reference to it has been swapped to `/logo.png`.

2. Install dependencies (npm shown; yarn/pnpm work too):
   ```
   npm install
   ```

3. Run locally:
   ```
   npm run dev
   ```

## What changed structurally

- `src/routes/*.tsx` → `app/*/page.tsx` (Next.js file-based routing)
- `src/routes/__root.tsx` → `app/layout.tsx` (+ `app/not-found.tsx` and
  `app/error.tsx` for the custom 404/error UI that used to live in root)
- `src/router.tsx`, `src/routeTree.gen.ts`, `src/server.ts`,
  `src/start.ts` — deleted; Next.js handles routing/server concerns
  itself, no equivalent files needed
- `@tanstack/react-router`'s `<Link>` → `next/link`'s `<Link>`
- Order panel's checkout used TanStack Router's typed `search` params
  on `<Link>` — replaced with `useRouter().push()` and plain query
  string, since that pattern is TanStack-specific
- `usePathname` (next/navigation) replaces TanStack's `activeProps`
  for nav link highlighting
- `useSearchParams` (next/navigation) replaces TanStack's
  `Route.useSearch()` on the Orders page — wrapped in `<Suspense>`
  since the App Router requires that
- Product images: the original imported JPGs directly
  (`import x from "./x.jpg"`), which gives a URL string in Vite. In
  Next.js, image imports return a `{src, width, height}` object
  instead, which would break the plain `<img src={...}>` tags this
  code uses throughout. Fixed by moving images into `public/products/`
  and referencing them as plain string paths.
- Tailwind v4's `@source` directive in `globals.css` updated to scan
  `app/` and `components/` instead of the old `src/` folder
- `vite.config.ts` → `next.config.js` (minimal, no custom config
  needed yet)
- Added `postcss.config.mjs` — Next.js needs Tailwind v4 wired in via
  PostCSS, not Vite's plugin
- `package.json`: removed `@tanstack/react-router`,
  `@tanstack/react-start`, `@tanstack/router-plugin`, `vite`,
  `@vitejs/plugin-react`, `vite-tsconfig-paths`, `nitro`,
  `@lovable.dev/vite-tanstack-config`; added `next`, `eslint-config-next`,
  `@tailwindcss/postcss`
- Switched from Bun back to a standard npm-based `package.json` (no
  `bun.lock`/`bunfig.toml`) — swap back to Bun commands if you prefer,
  the dependencies themselves are unaffected

## What did NOT need to change

- All `components/ui/*` (shadcn/ui) — no router dependency, ported as-is
- `lib/utils.ts` — untouched
- All Tailwind classes and page markup/copy — untouched
- `components/order-panel.tsx` and `product-card.tsx` — logic
  unchanged, only the router import swapped

## Known placeholders carried over from the Lovable build

- Product names ("Fresh Cup No. 01/02"), descriptions, and prices are
  still placeholders per the original site content
- Contact info (`hello@tazacup.example`, phone, hours) is placeholder
- The Orders page's payment step is a demo only — no real payment
  processing is wired up
- The homepage's animation section is still a reserved placeholder —
  the actual cup-drop/fruit-fall/lid-close animation hasn't been built
