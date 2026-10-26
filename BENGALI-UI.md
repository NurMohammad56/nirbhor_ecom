# Bengali storefront and admin

The default document language is `bn-BD`. Noto Sans Bengali and Noto Serif Bengali are served locally with their OFL licenses. All rendered JSX copy, interpolated labels, image descriptions and accessible names pass through the Bengali presentation helpers in `src/bn.ts`; editable translations live in `src/bn-copy.ts`. This happens while React renders, with no DOM text replacement or external translation service.

Canonical category/status/variant values, routes, IDs, SKU values, coupon codes and calculations retain their original values. Select options explicitly preserve their canonical `value` while showing Bengali labels. Emails, URLs and codes remain intact. Dates and visible numbers use Bengali formatting. Search supports Bengali and original English product names; telephone and OTP inputs accept Bengali digits and normalise them before validation.

`src/bn-state.ts` performs a one-time migration of known demo product names/descriptions, hero copy, default content and image references. It preserves custom copy, supplier brands, prices, stock, cart, addresses and orders. Existing custom banners are retained. Organic and Home slides are added when those destinations are absent, so the main carousel introduces all four departments. It advances every 3 seconds, pauses on deliberate pause/focus, hidden tabs or leaving the viewport, and respects reduced-motion preferences.

Repeated home promotional strips, closing copy, hero captions and category eyebrows were removed. The current hero framing remains unchanged. Image generation details and actual master dimensions are recorded in `design-assets/V4-QUALITY.md`.
