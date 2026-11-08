# UI audit and preservation inventory

Audit: 8 November 2026. Next.js 16.4.5 App Router, React 19, TypeScript, existing CSS and Lucide; Three.js installed, but no real production 3D models supplied. 183 source/style files inventoried.

## Protected behavior

- Native route URLs, query filters, scroll behavior and browser history.
- Department/category IDs and hierarchical filters, variants, inventory and pricing.
- Shared bag, wishlist, coupons, bundles, totals, COD/online preview and shipping rules.
- Existing customer registration/login/reset preview, demo account, addresses, orders and tracking.
- Merchant product/section/banner/experience/popup/review controls.
- Existing content, merchant edits, local storage keys and migrations.
- Review provenance labels, sample-product labels, no invented scarcity or claims.

## Data boundary

The existing frontend stores state in localStorage. Authentication, payments and notifications are previews, not production services. No backend endpoints or real payment integrations are changed or introduced.

## Problems observed

1. Repeated late CSS layers and scattered hardcoded values. Consolidate signature styling into a token-backed design system instead of adding another unrelated override layer.
2. Main hero shares space with two tall promo cards, diluting hierarchy. Give campaigns a complete stage and make secondary promotions compact.
3. Most category experiences share the same banner-plus-grid composition. Add structurally different, data-backed editorial modules.
4. Forms, accounts, empty/error states and policy pages need consistent surfaces, readable type and stronger hierarchy.
5. Footer omits Perfume and displays generic payment marks regardless of configured payment availability.
6. Organic child-filter chips overflow 4px at 375px.
7. Fragrance tabs lack arrow-key navigation.

## Inspected route inventory

Browser inspected 118 route/viewport states before redesign. 0 page errors recorded. Screenshots in artifacts/master-audit. Empty cart/checkout and guest account states reviewed; populated purchase/account states also covered by existing Playwright suites.

- `/`
- `/organic`
- `/beauty`
- `/fashion`
- `/home-living`
- `/smart-life`
- `/sneakers`
- `/watches`
- `/tech`
- `/perfume`
- `/shop`
- `/shop?q=honey`
- `/organic/shop?subcategory=%E0%A6%86%E0%A6%9A%E0%A6%BE%E0%A6%B0`
- `/offers`
- `/combo/combo-morning`
- `/product/p1`
- `/perfume/product/perfume-amber`
- `/tech/product/tech-headphones`
- `/sneakers/product/sneaker-court`
- `/cart`
- `/checkout`
- `/order-success/NBR-4821`
- `/track`
- `/login`
- `/register`
- `/forgot-password`
- `/wishlist`
- `/categories`
- `/about`
- `/help`
- `/contact`
- `/page/shipping`
- `/page/returns`
- `/page/privacy`
- `/page/terms`
- `/page/sourcing`
- `/missing/audit`
- `/account`
- `/account/orders`
- `/account/addresses`
- `/account/wishlist`
- `/account/settings`
- `/account/security`
- `/account/order/NBR-4821`

## Native route files

- `src/app/(admin)/admin/analytics/page.tsx`
- `src/app/(admin)/admin/banners/page.tsx`
- `src/app/(admin)/admin/campaigns/page.tsx`
- `src/app/(admin)/admin/categories/page.tsx`
- `src/app/(admin)/admin/content/page.tsx`
- `src/app/(admin)/admin/coupons/page.tsx`
- `src/app/(admin)/admin/customers/page.tsx`
- `src/app/(admin)/admin/discounts/page.tsx`
- `src/app/(admin)/admin/experiences/page.tsx`
- `src/app/(admin)/admin/inventory/page.tsx`
- `src/app/(admin)/admin/manual-banners/page.tsx`
- `src/app/(admin)/admin/offer-banners/page.tsx`
- `src/app/(admin)/admin/offer-popup/page.tsx`
- `src/app/(admin)/admin/offers/page.tsx`
- `src/app/(admin)/admin/orders/page.tsx`
- `src/app/(admin)/admin/page.tsx`
- `src/app/(admin)/admin/pixel/page.tsx`
- `src/app/(admin)/admin/product-pages/page.tsx`
- `src/app/(admin)/admin/products/page.tsx`
- `src/app/(admin)/admin/reviews/page.tsx`
- `src/app/(admin)/admin/sections/page.tsx`
- `src/app/(admin)/admin/settings/page.tsx`
- `src/app/(admin)/admin/team/page.tsx`
- `src/app/(storefront)/about/page.tsx`
- `src/app/(storefront)/account/order/[id]/page.tsx`
- `src/app/(storefront)/account/[[...section]]/page.tsx`
- `src/app/(storefront)/campaign/[id]/page.tsx`
- `src/app/(storefront)/cart/page.tsx`
- `src/app/(storefront)/categories/page.tsx`
- `src/app/(storefront)/checkout/page.tsx`
- `src/app/(storefront)/combo/[id]/page.tsx`
- `src/app/(storefront)/contact/page.tsx`
- `src/app/(storefront)/forgot-password/page.tsx`
- `src/app/(storefront)/help/page.tsx`
- `src/app/(storefront)/login/page.tsx`
- `src/app/(storefront)/offers/page.tsx`
- `src/app/(storefront)/order-success/[id]/page.tsx`
- `src/app/(storefront)/page/[slug]/page.tsx`
- `src/app/(storefront)/page.tsx`
- `src/app/(storefront)/product/[id]/page.tsx`
- `src/app/(storefront)/register/page.tsx`
- `src/app/(storefront)/shop/page.tsx`
- `src/app/(storefront)/track/page.tsx`
- `src/app/(storefront)/wishlist/page.tsx`
- `src/app/(storefront)/[department]/campaign/[id]/page.tsx`
- `src/app/(storefront)/[department]/page.tsx`
- `src/app/(storefront)/[department]/product/[id]/page.tsx`
- `src/app/(storefront)/[department]/shop/page.tsx`
