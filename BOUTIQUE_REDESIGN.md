# Independent sneaker and perfume stores

## Scope and direction

The sneaker and perfume destinations now have separate visual identities instead of sharing the marketplace campaign hero. The supplied references informed composition, color and product presentation; competitor logos, claims and low-resolution reference photographs were not copied into the storefront.

- Sneakers: deep forest, petrol and slate-green hero stages with bright amber/mint accents, a large angled shoe, product selection, selected-size pricing, quick order and an editorial product pair. The circular hero outline and round photo crop are removed. Existing published products and configured coupon destinations remain connected. A merchant-uploaded hero image is preserved and can be shown as the collection photograph.
- Perfume: a white/charcoal commerce storefront, restrained collection navigation, isolated sample product images and clear purchase controls. The previously requested aquatic campaign and decorative edge planting have been retired following the user's latest feedback. Product details display editable accord bars, note names, descriptions and supporting information. Other departments retain their visual identities.
- Admin controls remain authoritative: hero text/images, section order/visibility, custom collection sections, category photographs and product fragrance fields. Custom images are never replaced by generated defaults. Hidden fragrance profiles remain hidden.
- The new `note` catalog query filters perfume products by their saved visible fragrance notes. Other category filtering contracts are unchanged.

## Assets and honest presentation

Prior WebP assets and original photographs are retained. The white storefront reuses amber/rose cutouts and a new transparent noir sample cutout. Generation prompts and reference-access limitations are recorded in [CLEAN-STORE.md](design-assets/fragrance-studio/CLEAN-STORE.md); earlier records remain in [PROMPTS.md](design-assets/fragrance-studio/PROMPTS.md) and [AQUA-HERO.md](design-assets/fragrance-studio/AQUA-HERO.md). Only known sample image paths receive isolated display imagery; custom merchant images remain untouched.

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

## Clean commerce perfume redesign

The latest brief rejects the previous palette and requests a simpler perfume shop and an accord-based detail view. The perfume landing, catalogue and PDPs now use white surfaces, charcoal text/buttons and restrained gray borders. Decorative edge branches, aquatic campaign, duplicated hero navigation and colored profile panels are removed. The default hero is a normal isolated product photograph, and known sample product cards/PDPs use cutouts on white. Custom merchant imagery remains untouched. Full product pictures fit inside the hero after correcting a CSS grid intrinsic-size issue found during visual QA.

References: [Perfume Bangladesh](https://perfume-bd.com/) and [Fragrantica Crimson](https://www.fragrantica.com/perfume/Rayhaan/Crimson-112761.html). Both blocked direct browser and fetch access with HTTP 403. Indexed page content was reviewed for commerce and accord/note information hierarchy; no pixel-perfect reference review or exact imitation is claimed. Details and original cutout prompt: [CLEAN-STORE.md](design-assets/fragrance-studio/CLEAN-STORE.md).

New `FragranceAccords.tsx`, `fragrance-accords.ts` and `FragranceAccordEditor.tsx` support merchant-defined accord names, relative 0-100 widths, color tones, order, removal and visibility. Bars explain scent character, not ingredient percentages or longevity. Only the three existing explicitly marked sample products get demonstration bars; real profiles get none without merchant input, and empty saved lists remain empty. Note tabs show all saved note names at once while retaining the full active description, keyboard support and custom note art.

Theme defaults are normalized for perfume presentation when they still equal known seed values, without rewriting saved records or replacing explicit custom colors/headlines. Product cards display default-variant prices consistently with the selected size. Existing routes, product IDs, source media, merchant fields, wishlist, purchasing and other department styling are preserved.

Checks: the full native production suite passed **178/178**, with no skipped, failed or flaky cases. A final CSS-only polish fixed the hero photo fit and white catalog background; the final Next production build passed and the 30-state visual script was rerun at 320/375/768/1024/1440px. No overflow, missing images or client exceptions. Screenshots of the landing, catalogue and note cards were visually inspected. The first screenshot script could capture pre-hydration skeletons; its readiness checks were corrected before the reported final screenshots.

The final deployment Worker build and **43/43 focused Worker tests** passed, with zero skipped, failed or flaky cases, covering accord editing/persistence/visibility, the full profile editor, keyboard behavior, perfume purchase flow, saved theme/image controls and other department interactions. No broader test repeat was needed after the final CSS correction.
