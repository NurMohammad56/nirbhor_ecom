# Nirbhor commerce refresh - 2026-11-02

Approved direction: palette 01, teal `#0F766E`, orange `#F97316`, pale background `#F7FAF9`, text `#142D2A`. Existing custom merchant category colors and content survive migration. The approved Bengali wordmark and leaf shape are retained; a native SVG color filter adapts the existing raster mark to the approved palette.

## Storefront

- Home has a three-second offer carousel, two manual arrows, combo/delivery tiles and a discounted-product rail. Existing product, category, story and combo sections remain.
- Each enabled parent category has up to three live offer slides. Advertised percentages come from published, in-stock sale products; coupon and automatic-rule claims come from active promotion records. Combo savings use the existing pricing engine.
- No new discounts, countdown deadlines, customer counts or stock urgency were invented. When an offer ends, the page removes its claim while open. With no live discount, the category shows a collection message without a discount promise.
- Coupon links carry their code into the catalogue and product page. A conditional coupon price appears only when a single item meets the actual eligibility/minimum. Quick order applies the same promotion engine and validates the order again on submission.
- Reduced-motion, focus, hover, tab visibility and offscreen policies pause automatic movement. Touch-friendly arrows remain available.

## Admin

`/admin/banners` controls generated offer banner images (URL/upload), headline, description, order, visibility and placement. Discount amount, code and conditions remain controlled by the source coupon, combo or automatic rule. It also controls the home sale-section headline and visibility. Existing category experience image/headline controls still work; explicit offer-banner edits take priority. Legacy manual banner records and editor remain at `/admin/manual-banners`.

## Assets and data

Reused the existing approved high-resolution photographs with editable native UI compositions. No external image downloads or new generated photos were added for this refresh. Imported-product branding rules and existing prices, promotions, stock, orders and customer data were retained. This remains the existing browser-local frontend prototype: admin edits are local to the browser until backend integration. Existing owner-private Site audience and SPA deep-link fallback are preserved.

## Verification

Playwright covers scoped offer links, coupon price preview and order totals, offer expiry, banner editing/hiding, three-second autoplay/focus pause, exhausted coupons, unavailable sale products and narrow mobile layouts. Existing checkout, inventory, cart, catalogue, admin and navigation regression tests remain applicable. Older category-introduction and static-only hero assertions were updated for the newly requested offer carousel.
