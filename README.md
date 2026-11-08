# নির্ভর - Next.js Commerce

A complete, responsive ecommerce frontend built around the supplied green-and-cream NIRBHOR design references. Next.js 16 App Router, React 19, TypeScript and shared feature modules.

## Run the project

Node.js 22 LTS is recommended. From this folder:

```sh
npm ci
npm run dev
# production Node server
npm run build
npm start
# checks
npm run typecheck
npm run test:e2e
```

Development uses port 3000 by default. Playwright can target another server with `PLAYWRIGHT_BASE_URL`.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the App Router, feature, component, provider and data structure. `src/main.tsx`, `src/App.tsx`, Vite and React Router were removed. Existing URLs, assets, browser storage keys and Bengali presentation are retained.

`npm run build:sites` packages native Next output for the existing Cloudflare-based Sites host through OpenNext. Keep the registered Site identity in its own checkout; the workspace root is a local IDE copy, not a second publication target. No environment variables are required for this browser-local frontend. Database-backed accounts, payments and shared merchant persistence are still a later backend phase.

## Category experience prototype

The main homepage now presents NIRBHOR as a multi-category brand. It includes a newly generated cross-category hero, four department entrances, a curated product edit, and the brand's selection and packing story.

| Department | Landing        | Catalogue           | Design direction                                   |
| ---------- | -------------- | ------------------- | -------------------------------------------------- |
| Organic    | `/organic`     | `/organic/shop`     | Forest green, sage, honest pantry photography      |
| Beauty     | `/beauty`      | `/beauty/shop`      | Blush, dusty plum, skincare still life             |
| Fashion    | `/fashion`     | `/fashion/shop`     | Charcoal, warm neutrals, fashion editorial imagery |
| Home       | `/home-living` | `/home-living/shop` | Sand, clay, tactile home photography               |

Department colours and navigation continue into product and campaign pages. Old product and campaign URLs remain usable. Fashion samples include size selection, a size guide and fabric details. Different departments share one bag, customer account and neutral checkout.

**`/admin/experiences`** edits each department's headline, description, hero image, palette, announcement and story. Its preview is local until saved. Category edits preserve this configuration.

The browser upgrade adds the new department samples without resetting previous products, prices, cart, addresses or orders. Existing custom banners are retained. New samples and generated packaging are illustrative prototype content to replace with real catalogue details before launch.

Nine additional assets were generated with built-in image generation and optimised to WebP. Their exact prompts and local paths are documented in [design-assets/V2-PROMPTS.md](design-assets/V2-PROMPTS.md).

## Run locally

```sh
npm install
npm run dev
```

Open **http://localhost:5173**. The admin workspace is **/admin**. Customer sign-in includes an **Explore a demo customer account** button. The mobile OTP demonstration uses **961204**.

```sh
npm run build       # TypeScript verification and production bundle
npm run preview     # Preview the production bundle
npm run test:e2e    # Browser workflow tests; run the dev server first
```

## Review the experience

| Area             | Routes / behaviour                                                                                                                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Storefront       | `/`, `/categories`, `/offers` — timed and manually controlled hero carousel, pause control, mega menu, nested category links, category tabs, product collections, newsletter                                                                            |
| Discovery        | `/shop` — search suggestions, typo matching, category / price / availability / rating / discount / origin / size / brand / type / dietary / colour / delivery / custom-tag filters, URL-backed filter chips, sorting, pagination, grid and list layouts |
| Product          | `/product/p2` — gallery, zoom, optional product video, variant pricing and SKU, quantity, wishlist, stock, add to bag, buy now, specifications, ingredients / origin, delivery, reviews, bought-together suggestions                                    |
| Campaign         | `/campaign/p1` — configurable announcement, offer, countdown, stock urgency, bundle pricing, source and batch story, trust blocks, reviews, FAQs, sticky order control, guest COD form                                                                  |
| Bag and checkout | `/cart`, `/checkout` — drawer and page, variant and quantity edits, save for later, coupons, delivery estimates, free-delivery progress, guest / saved-address checkout, validation, recorded order confirmation                                        |
| Customer         | `/login`, `/register`, `/forgot-password`, `/account` — demo email and OTP flows, profile, address CRUD, order history / detail, reorder, eligible cancellation, returns, wishlist, recently viewed, review media and notifications                     |
| Tracking         | `/track` — order number and phone lookup, fulfilment timeline, courier and tracking details                                                                                                                                                             |
| Information      | `/about`, `/contact`, `/help`, `/page/shipping`, `/page/returns`, `/page/sourcing`, `/page/privacy`, `/page/terms`                                                                                                                                      |
| Admin            | `/admin` plus `products`, `categories`, `inventory`, `orders`, `customers`, `campaigns`, `discounts`, `reviews`, `banners`, `content`, `analytics`, `pixel`, `settings`, `team`                                                                         |

## What the admin can do

- Create, edit, duplicate, draft, publish and archive products; configure images, galleries, video, variant prices / stock / images / SKUs, SEO and campaign experience. CSV import and export are included.
- Manage parent and nested categories, visibility, descriptions, images and order.
- Adjust inventory with a reason and inspect adjustment history.
- Search and filter orders; update fulfilment and payment status, courier, tracking, confirmation-call status and internal notes; print invoices / packing slips. Cancellation and return transitions restore stock once.
- Inspect customers, orders, lifetime spend, addresses, notes and tags. Blocking and team permissions are configuration previews pending backend enforcement.
- Create percentage, fixed-value, free-delivery and buy-two-get-one offers with category / product / brand scopes, schedules, minimum order, global limits and per-customer limits.
- Control each campaign block, edit the copy and dates, reorder story sections and preview the saved campaign.
- Manage scheduled homepage hero slides, moderation and replies, featured reviews, homepage copy, trust text, FAQs and static pages.
- Configure brand colour, store and contact details, tax, shipping charges, free-delivery threshold, COD, payment preview, notifications, newsletter, SEO and Meta Pixel mappings.

## Frontend boundary

Everything is intentionally **frontend only**. Products, orders, accounts, media and configuration persist in this browser's local storage. Changes synchronise between tabs on the same origin. There is no secure authentication, API, database, live payment, courier dispatch, email / SMS delivery, actual refund or external Meta event delivery. Passwords and card data are never stored. Online payment preview records an **unpaid** order.

Order items keep price snapshots so later catalogue edits do not rewrite the recorded purchase total. Stock and offer conditions are checked again when an order is placed. Performance charts clearly identify sample data; local order and event tables use actual preview records.

The legal pages are preview drafts for the future operating store. Replace sample products, testimonials, pricing, policies and contact details before a real launch.

To reset the demo, clear this origin's site data in your browser. To preserve it, keep using the same browser and origin. Images uploaded for the preview must be small enough for browser storage (maximum 3 MB per upload); use image URLs for larger catalogues.

## Structure

- `src/data.ts` — typed models and fixtures
- `src/store.tsx` — persistent state, cart, promotion calculations and order placement
- `src/order-logic.ts`, `src/inventory-actions.ts`, `src/category-tree.ts` — shared rules
- `src/ui.tsx` — shared storefront components and accessible overlays
- `src/Home.tsx`, `src/Catalog.tsx`, `src/Product.tsx`, `src/Commerce.tsx`, `src/Public.tsx` — customer screens
- `src/Admin.tsx`, `src/AdminMore.tsx` — admin screens and editors
- `src/styles.css`, `src/commerce.css`, `src/admin.css` — responsive design system
- `public/assets`, `public/fonts` — locally served, optimised assets
- `tests/commerce.spec.ts` — browser workflow checks
- `tests/departments.spec.ts` — category navigation, palette continuity, mixed checkout, editor persistence, migration and mobile checks
- `src/BrandHome.tsx`, `src/DepartmentLanding.tsx`, `src/StoreHeader.tsx` — multi-category storefront prototype
- `src/departments.ts`, `src/department-state.ts`, `src/useDepartment.ts` — department configuration, migration and context
- `src/DepartmentExperiencesAdmin.tsx`, `src/departments.css` — category experience editing and design

See [ASSETS.md](ASSETS.md) for image creation prompts and image / font sources.

## Immersive visual update (V3)

The home hero now uses a full-width photographic carousel with crossfades, a pausable progress indicator and four direct department links. Each department has a full-width image hero with white copy and gentle scroll motion; Beauty includes a floating unbranded serum. Motion respects reduced-motion preferences and the carousel pauses when hovered, focused, offscreen or in a hidden tab. Header and admin typography, borders and contrast are stronger.

The V3 storage migration updates only known demo image references and the former Nirbhor brand on Beauty/Clothing products. Custom supplier brands, uploaded images, prices, category copy, cart and customer data are preserved. Beauty and clothing use ?Imported collection? until actual supplier information is added. Generated photography is presentation material for this frontend, not a representation of verified commercial stock. Exact prompts and files: `design-assets/V3-PROMPTS.md`.

## Signature commerce and perfume

The shared visual layer is `src/styles/signature-commerce.css`. It refines the home campaign, navigation, cards, actions and admin surfaces. Perfume is a ninth department at `/perfume` and `/perfume/shop`, with three clearly labeled conceptual products and generated imagery. All use the existing cart and checkout.

`src/lib/perfume-state.ts` appends seed data once, preserving merchant edits and later removals. `PerfumeExperience.tsx` supplies the category hero, scent-family finder and homepage feature. Existing category section controls decide whether the scent studio (`story`) and product/review blocks appear.

In `/admin/experiences`, choose পারফিউম to change the hero image, title and description or disable the world. In `/admin/product-pages`, choose a perfume and open তথ্য ও FAQ to edit/hide its fragrance profile, sample label, top/heart/base notes and source explanation. Prices, variants and inventory remain in `/admin/products`. Generated photos do not carry Nirbhor labels on imported products.

Fragrance notes describe an olfactory profile, not an ingredient/allergen list. No verified longevity, reviews or manufacturer claims are invented. Replace conceptual prices, photos and profiles with verified supplier data before using them as actual merchandise. Source review and exact built-in image-generation prompts: `design-assets/signature-perfume/`.
