# NIRBHOR Commerce — Frontend

A complete, responsive ecommerce frontend built around the supplied green-and-cream NIRBHOR design references. React 19, TypeScript, Vite, React Router, and Lucide icons.

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
