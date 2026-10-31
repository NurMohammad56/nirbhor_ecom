# Smart Life department

Customer name: স্মার্ট লাইফ. Parent category: `Smart Life` (`c-smart-life`). Landing: `/smart-life`; scoped catalogue: `/smart-life/shop`.

The category covers practical everyday gadgets across cleaning, kitchen helpers, sensors and lighting, bathroom organisation and garment care. All twelve requested product ideas have individual Bengali sample records, factual use-oriented descriptions, editable detail pages and English search aliases. Prices, inventory and product images are prototype samples, not confirmed supplier listings. No reviews, market popularity counts, warranty periods, electrical ratings or battery capacities were invented. Imported gadgets carry no Nirbhor product branding.

Thirteen assets (one hero and twelve product photographs) were generated with the built-in image_gen tool. The user's attachments informed the product types, rather than serving as specific supplier or model claims. Native outputs are encoded as WebP quality 90 without visual editing or enlargement. Files are `public/assets/smart-life-*-v1.webp`; original PNGs remain locally at `design-assets/originals/smart-life/`. Exact prompts and file paths are recorded in `prompts.json`.

Integration includes the main navigation, mobile menu and category menu, homepage category rail, six-slide homepage hero, selected-product tab, footer, category crosslinks, scoped product routes, search, SEO/Open Graph imagery, shared cart/checkout/quick-order flows and the existing category, page, inventory, banner and section editors. The new blue-grey/teal identity uses restrained background rings rather than botanical decorations.

An atomic one-time migration appends missing products, categories and the homepage banner without replacing merchant edits or customer data. Later edits, deletions and disabled category experiences remain respected.

Validation: all 63 Playwright scenarios verified (62 in the full run; the remaining mobile resize check passed after waiting for responsive relayout). New coverage checks navigation/search, scoped collections, stock reservation, migration preservation/deletion, editable identity/sections and disabling the department. Browser checks at 320, 390, 768, 1100 and 1440 px covered home, landing, catalogue, product and admin pages with no client errors, broken images or horizontal page overflow.
