# Independent sneaker and perfume stores

## Scope and direction

The sneaker and perfume destinations now have separate visual identities instead of sharing the marketplace campaign hero. The supplied references informed composition, color and product presentation; competitor logos, claims and low-resolution reference photographs were not copied into the storefront.

- Sneakers: deep forest, petrol and slate-green hero stages with bright amber/mint accents, a large angled shoe, product selection, selected-size pricing, quick order and an editorial product pair. The circular hero outline and round photo crop are removed. Existing published products and configured coupon destinations remain connected. A merchant-uploaded hero image is preserved and can be shown as the collection photograph.
- Perfume: a rich aquatic-blue hero with seven unbranded bottles in a triangular campaign composition, flowers, dry branches, wood and water reflections. The lower sections retain their warm paper surfaces. Seven compact collection cards combine three merchant categories with four live note-based collections. The anatomy/studio landing section was removed at the user's request. Product details now use detailed merchant-editable note cards instead of the floating-bottle diagram. Sparse dried botanicals frame the page margins, with smaller, softer decorations on mobile.
- Admin controls remain authoritative: hero text/images, section order/visibility, custom collection sections, category photographs and product fragrance fields. Custom images are never replaced by generated defaults. Hidden fragrance profiles remain hidden.
- The new `note` catalog query filters perfume products by their saved visible fragrance notes. Other category filtering contracts are unchanged.

## Assets and honest presentation

Five WebP assets total 1,127,920 bytes. Generation prompts and reference paths are recorded in [PROMPTS.md](design-assets/fragrance-studio/PROMPTS.md) and [AQUA-HERO.md](design-assets/fragrance-studio/AQUA-HERO.md). The latest 1536 x 1024 campaign image is 348,658 bytes. Existing original photographs are retained. The noir image has an opaque dark backdrop and is rendered on a matching dark panel.

The floating product treatments use photography and CSS depth, not a fabricated 360-degree product model. Existing sample products remain labelled as samples. No stock, prices, reviews, longevity, certification or physical shop claims were invented. No new products were added in this refinement.

## Implementation

- New: `FootwearHero.tsx`, `FragranceBoutique.tsx`, `FragranceDiagram.tsx`, `fragrance-discovery.ts`, `footwear-world.css`, `fragrance-boutique.css` and `boutique-worlds.spec.ts`.
- Updated: department routing/composition, perfume experience exports, fragrance details tabs, perfume catalog note filtering, stylesheet imports and affected existing browser tests.
- Removed: the superseded `perfume-experience.css`; its required interaction and responsive rules are represented in the new category stylesheet.
- Documentation: README, design system and design research reflect the final category direction.

No API, authentication, payment, storage key or checkout contract was changed. The app retains its existing browser-local frontend boundary; this work does not add a production commerce backend.

## Initial boutique redesign verification

- Native Next.js production build: passed (`build-site.mjs`, webpack).
- Full native production browser suite: 167 passed, zero skipped, failed or flaky cases (201 seconds). This includes the existing commerce, admin, catalog and routing workflows as well as eleven boutique cases.
- Exact OpenNext/Cloudflare deployment bundle: built successfully with `node scripts/build-sites.mjs --skip-next-build`.
- Bundled Worker browser suite: 27 passed, zero skipped, failed or flaky cases (33 seconds), covering boutique worlds, perfume, commerce refresh and Next routing.
- Responsive visual script: 20 page/viewport states across 320, 375, 768, 1024 and 1440px. No horizontal overflow, broken images or client exceptions. Desktop/mobile hero and scent-diagram screenshots were visually inspected.
- IDE root mirror: `npm run typecheck` passed. Its legacy hosting identity and AGENTS instructions remain unchanged; publication uses the nested checkout only.

During the first full run, two existing offer-search scroll assertions failed under concurrent build load and one test still targeted the superseded sneaker slider. The upload test now targets the merchant-photo control; offer-search checks passed both in isolation and in the complete final run without changing offer behavior.

OpenNext reports its existing Windows compatibility warning. The exact Worker bundle was therefore exercised locally, rather than relying solely on the native Next build. Lint was not requested and was not run.

Motion respects reduced-motion preferences and pauses while inactive. Product selectors use real buttons, the existing keyboard-operated fragrance tabs remain available, and small text colors were darkened following contrast checks. Hero selection reserves stable layout space on narrow screens.

## Requested hero refinement

The subsequent request replaces the muted sneaker hero colors, removes its circular scenery, adds the aquatic seven-bottle perfume campaign and reduces collection pictures from 220px to 100px (78px on mobile). Rose, jasmine, bergamot and wood collections link to the existing saved-note filters. These are discovery collections, not invented inventory or duplicated product records. Merchant-supplied category and hero photographs remain authoritative.

- `npm run typecheck`: passed.
- Native Next production build: passed.
- Focused production browser suite: 34 passed, zero skipped/failed/flaky, covering both boutiques, perfume, commerce refresh, style collections and Next routing.
- Responsive visual script: 20 page/viewport states from 320px to 1440px; no overflow, missing images or client errors. Desktop/mobile hero and collection screenshots inspected.
- Exact deployment Worker build and the same 34 browser tests: passed, zero skipped/failed/flaky. The broader 167-test run above belongs to the initial boutique release; it was not repeated for this bounded hero refinement.

## Anatomy-section removal and edge botanicals

Removed the department landing's anatomy/studio block and its unused component, export and styles. The hero's secondary link now targets the remaining collection index. Product-detail fragrance tabs/diagrams and merchant-saved profiles remain intact. Other departments and custom collection sections retain their configured section ordering.

Reused `public/assets/dried-stem-v3.webp` for two decorative, non-interactive page-edge plantings; no new generated image was needed. Their wrapper is hidden from assistive technology, does not intercept pointers, clips outside the page and reserves no layout space. Mobile decoration uses smaller dimensions and lower opacity.

Production build passed. All 29 native browser checks and the same 29 exact Worker-bundle checks passed, with no skipped, failed or flaky cases. They cover boutique removal/link behavior, perfume purchase/profile editing, department pages and landing-section ordering. The responsive script checked 20 page/viewport states without horizontal overflow, missing images or client exceptions; desktop and mobile collection screenshots were inspected.

## Detailed product fragrance profile

The product-detail profile was subsequently redesigned around readable information cards. It has an editable kicker, title and introduction, saved fragrance family/concentration, three keyboard-operated note tabs and an active note card with an optional botanical/custom image, actual note names and a detailed description. Optional occasion and usage information appears only when supplied by the merchant. Existing sample/source context remains visible. Blank notes disable their tabs; an entirely empty or hidden profile renders no card. Unknown notes receive no unrelated default illustration.

Admin path: `/admin/product-pages?product=perfume-amber` (choose any perfume) > **তথ্য ও FAQ** > **পারফিউমের সুগন্ধের প্রোফাইল**. The existing page save action persists all settings. The merchant can edit all profile copy, each note's names/description/image URL, upload and remove images, hide artwork, mark a sample profile, and hide the complete section. Uploads reuse the existing image picker with an optional 640px image bound; other hero image callers retain their existing size defaults.

Protected behavior: existing product/page edits, storage keys, product IDs, prices, variants, purchasing, source fields and profile visibility remain intact. Added page fields have defaults, so previously saved partial profiles continue working. No fragrance duration or commercial performance claims were invented. No new dependency, product or generated image was added.

Changed files: `FragranceNotes.tsx`, `FragranceEditor.tsx`, `HeroImagePicker.tsx`, `product-page-content.ts`, `fragrance-boutique.css`, shared `fragrance-profile.ts` descriptors and `BotanicalSprite.tsx`. The retired `FragranceDiagram.tsx` was removed; department collection art now imports the extracted sprite. Regression tests cover real admin saves/uploads, reload persistence, visibility and empty/unknown note states as well as responsive screens and keyboard behavior.

Validation for this profile update:

- Next.js production build and TypeScript passed.
- Full native suite: 167 passed initially; eight assertions used an ambiguous, unscoped `tabpanel` selector. These test selectors were scoped to the fragrance section, with no application change required. Both affected files were rerun: all 19 tests passed, including all eight previously failed cases. All 175 unique native cases are therefore validated across those runs; a second full run was not performed.
- Exact OpenNext Worker bundle built successfully. All 40 focused Worker tests passed with no skipped, failed or flaky cases. This includes existing hero image upload behavior, product purchasing, keyboard tabs and the new profile editor.
- Responsive visual script: 20 states across the three perfume PDPs and profile editor at 320/375/768/1024/1440px. No horizontal overflow, missing images or client exceptions. Desktop/mobile note cards and editor screenshots were visually inspected.
- Existing Windows OpenNext warning remains; the deployment bundle was tested directly. Lint was not requested and was not run.
