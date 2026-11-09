# Perfume hero - aquatic collection artwork

The requested seven-bottle image already exists at `public/assets/fragrance/aqua-collection-v3.webp` (1536 x 1024). Reused that exact asset rather than regenerating it. The perfume landing hero now uses a deep aquatic surface, warm ivory action, white Bengali headline, and the full collection image. The rest of the neutral perfume storefront and product details remain unchanged.

The artwork keeps its 3:2 aspect ratio without cropping the bottles. On mobile it follows the text in a separate full-width image area. Explicit image dimensions reserve space before loading. A restrained light sweep runs only while the section is visible, the document is active and reduced motion is off. It does not zoom or move the product image.

The existing admin category hero image, headline and description controls still work; custom images override this default. The actual featured product, variant price and destination are preserved. The collection artwork is illustrative and does not add inventory or claims about the pictured bottles.

Changed files: `FragranceBoutique.tsx`, `fragrance-discovery.ts`, `fragrance-boutique.css`, and the two existing test expectations for the hero image/background. Both root IDE source and `sites/nirbhor-updated` were synchronized.

Validation: root `npm run typecheck` passed; the 14 tests in `boutique-worlds.spec.ts` and `fragrance-accords.spec.ts` passed. Additional browser inspection at 320, 375, 768, 1024 and 1440 px verified no horizontal overflow or client errors, correct image proportions and stable hero height. Custom admin image/headline, collection anchor and reduced motion were checked. Desktop and mobile screenshots were inspected. Results are in root `artifacts/aqua-hero-qa.json`.

This change is local; no deployment was requested or performed for this update.

Production validation: npm run build passed in sites/nirbhor-updated (Next.js webpack production build, all 40 static pages generated).
