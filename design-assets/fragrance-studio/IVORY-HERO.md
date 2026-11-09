# Ivory perfume hero and dark-surface readability

Supersedes the aquatic hero color direction in AQUA-HERO.md. The user requested the familiar cream/white theme while preserving glass and water reflections. The seven-bottle artwork was edited using the built-in image_gen tool; the original aquatic asset remains available.

Asset: `public/assets/fragrance/ivory-collection-v4.webp`, 1536 x 1024, 298328 bytes, WebP quality 90. Generated original: `C:/Users/bdcalling/.codex/generated_images/01a1769e-dd5c-7583-9d6e-5750846c30ec/exec-6126ca63-cde4-4112-8709-fc72b1d5d498.png`.

Exact edit prompt:

> Edit the supplied perfume collection photograph for a premium ecommerce hero. Preserve exactly seven perfume bottles in the same triangular arrangement, their shapes, glass, gold/silver caps, blank labels, flowers, lime, leaves, dry branch and sandalwood, overall composition and 3:2 framing. Replace the saturated turquoise/blue surroundings with a luminous warm ivory and soft cream water-and-glass studio environment. Water reflections and delicate refracted light remain realistic and glossy but the background and water are pale champagne/ivory, not blue, teal, black or brown. Airy bright cream-white lighting. Bottles retain their realistic liquid colors and natural contrast. No extra bottles, no text, no logo, no UI, no cropping of bottles. Photorealistic high-resolution luxury still life.

The hero uses an ivory #faf5eb surface and cream fade, dark readable type, a deep green action with white lettering and subtle white light motion. All seven bottles keep their full framing. Mobile layout, reduced motion, admin custom image/headline, links and product pricing remain intact.

Footer root cause: the old department footer heading/link rules assumed light surfaces and overrode the current dark footer colors. Removed those obsolete rules and set shared explicit footer foreground/muted tokens, including column link hover and keyboard focus. Tech and Smart Life dark campaign coupon text now uses light text and a contrasting code surface. Pale product chips retain dark text.

Changed source: `fragrance-boutique.css`, `departments.css`, `commerce-pages.css`, `world-editorial.css`, `fragrance-discovery.ts`, plus the new image and existing hero test expectations. Root IDE source and authoritative checkout were synchronized.

Validation: 14 existing browser tests passed; root npm run typecheck passed. Five hero viewport checks (320/375/768/1024/1440), stable image aspect/height, no horizontal overflow or client errors, reduced motion, custom admin image/headline and collection navigation passed. Inspected desktop/mobile hero and desktop footer screenshots; mobile footer has no horizontal overflow. An automated solid-background dark-text check covered home, Organic, Perfume, Tech, Sneakers, Offers, Beauty, Fashion, Home & Living, Smart Life and Watches. It found and resolved the footer and dark coupon text issues. This is a targeted check, not a full WCAG audit of text over photographs or every dynamic slider state.

No publication was performed. Local preview: http://localhost:3000/perfume.
