# Next.js project structure

```
src/
  app/                        Next.js App Router entry points
    layout.tsx                HTML, metadata, global CSS and persistent providers
    loading.tsx               Route loading UI
    error.tsx                 Recoverable route error boundary
    not-found.tsx             Real 404 page
    robots.ts                 Search engine policy
    (storefront)/             Public shopping route group
      page.tsx                Home
      [department]/           Department, catalog, product and campaign URLs
      shop/, offers/, combo/  Discovery and promotions
      product/, campaign/     Existing product URL compatibility
      cart/, checkout/        Purchase flow
      account/                Customer views
    (admin)/admin/            Explicit dashboard routes
  features/                   Domain screens and components
    admin/, catalog/, commerce/, content/
    departments/, home/, offers/, products/, sneakers/
  components/                 Shared UI, brand and motion components
    layout/ApplicationShell.tsx
  hooks/                      Reusable browser and motion hooks
  providers/                  Persistent cart, merchant and customer UI state
  data/catalog.ts             Seed catalog and shared domain types
  lib/                        Pricing, categories, state migrations and helpers
    navigation.tsx            Native Next Link/router/URL helpers
  styles/                     Global styles, kept in their proven cascade order
public/                       Images, fonts, branding and static resources
tests/                        Playwright behavior and regression tests
scripts/                      Build and hosting helpers
```

Routes are real `page.tsx` files. There is no React Router, BrowserRouter or Vite application. Pages import feature entry points and Next controls routing, dynamic parameters and code splitting. The small navigation helper uses `next/link`, `next/navigation` and Next-integrated native history for query-only updates, preserving the existing filter scroll behavior.

The root provider persists across route transitions. The existing cart, admin settings and orders are browser-local; that interactive subtree intentionally hydrates on the client to preserve its current browser API usage. This migration does not introduce shared database persistence, authentication, API credentials or server-side business operations. Server route/layout boundaries, metadata and errors are in place for that later backend phase.

`next.config.ts` uses standalone output. Standard Node hosting uses `npm run build` followed by `npm start`. Cloudflare compatibility is built separately through OpenNext; it is not the Next development router. Existing public URLs and storage keys remain stable.

Browser-local migrations persist their transformed value before returning from initialization. This keeps migration markers and data consistent when a streamed route suspends and React retries rendering. Tests wait for hydrated route content before reading local storage; the welcome promotion is isolated from unrelated journeys.

Perfume uses the same department routing and commerce state. Its optional fragrance fields live in `ProductPageContent`, are editable in ProductPageAdmin and render through FragranceNotes. All motion respects reduced-motion preferences and ambient work pauses outside the viewport.
