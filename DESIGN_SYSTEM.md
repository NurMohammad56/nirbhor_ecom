# Nirbhor commerce design system

## Direction
One parent identity with nine editorial destinations. Ivory paper, restrained evergreen, honest product photography, clear Bengali typography and purchasing actions. No new UI framework or animation dependency.

## Foundations
`src/styles/design-system.css` owns shared presentation tokens: paper #f7f6f2, white panels, ink #24342c, secondary #626c63, evergreen #174d40, line #dce0d7, ochre focus #bd813a. Spacing: 4/8/12/16/24/32/48/64px. Panel radius 8px, transactional controls 5px. One restrained elevation, one 240ms interaction duration, cubic-bezier(.22,1,.36,1).

Existing local Noto Sans Bengali / Noto Serif Bengali / DM Sans fonts are preserved. Responsive display sizes use clamp; functional labels stay readable without expressive italics. Buttons/inputs are at least 44px in the new foundations. Visible focus uses an ochre outline.

## Category configuration
`src/lib/design-system.ts` provides presentation-only category tokens and composition metadata. ApplicationShell sets `data-department`, `data-page`, `--world-accent`, `--world-surface`, `--world-ink`. Explicit custom merchant accents survive; historical defaults receive the new palette. Stored category names, IDs, pricing, URLs and contracts are unchanged.

| Destination | Accent | Composition |
| --- | --- | --- |
| Organic | Olive #405b3c | Origin scene and three actual pantry products |
| Beauty | Plum #85445a | Care editorial with actual products |
| Fashion | Graphite #443b37 | Selectable photographic lookbook |
| Home & living | Timber #826247 | Room scene and actual catalogue links |
| Smart life | Mineral #286967 | Workbench product selector |
| Sneakers | Terra #b34726 | Product lookbook, sizes stay in purchase flow |
| Watches | Bronze #745a35 | Dial/strap product selector |
| Tech | Violet #4944a4 | Dark workbench and actual product/price selector |
| Perfume | Brass #84603b | Fragrance family discovery and note layers |

## Components and ownership
WorldEditorial is one data-backed component with origin/atelier/workbench variants, reused by DepartmentGallery and the existing merchant-controlled category story slot. The home gallery supports roving focus, arrow/Home/End keys and actual product links. Existing category hero campaign slides remain intact and use category surfaces. The perfume destination retains its specialist hero, family filters and note explorer.

`commerce-pages.css` owns supporting-page surfaces and typography: catalogue, PDP, cart, checkout, auth/account, public content, offers, footer and admin. `fragrance-boutique.css` contains specialist perfume presentation extracted from the former signature stylesheet. The old mixed global `signature-commerce.css` is removed. Existing feature styles still own established layout and behavior; no data-layer rewrite.

## Motion and imagery
Home offers crossfade on the existing timer with manual arrows. Category and product rails preserve hover/focus pause, touch and pointer dragging. New editorial photography uses the existing shared, visibility-aware scroll-depth hook (12px maximum); text and purchase controls do not move. Mobile/coarse pointers and reduced-motion disable depth. Image selection transitions between actual catalogue photographs. No new WebGL load, invented 360 viewer or simulated product rotation.

Existing generated WebP scenes are reused; product imagery stays editable through existing admin fields. No competitor assets copied. Fragrance profiles in the existing sample catalogue remain explicitly labelled samples. Real brand product specifications must replace sample profiles before commercial use.

Responsive stock photography uses `image-variants.ts` and a generated width manifest. `node scripts/prepare-image-variants.mjs` creates 320/640/960px variants when smaller than the original, at WebP quality 82. Category thumbnails, product cards, budget art, compact promotions and editorial photographs declare their display sizes. Original `src` values remain intact; unknown/custom URLs receive no generated srcset. Product-detail zoom and main campaign backgrounds retain original resolution. Inactive campaign photos are not laid out; autoplay warms only its next image after 1.5 seconds, without fetching every offer at entry.

## Preserved behavior
URLs, Next route groups, store provider/storage keys, products, variants, prices, stock, coupons, combos, authentication preview, checkout preview, orders, merchant controls, popup controls and section ordering remain intact. The merchant can still disable the story slot and edit imagery. Neither production payment processing nor a backend is introduced by a visual redesign.

## Independent footwear and fragrance worlds

The footwear destination now uses `FootwearHero.tsx` with centred display typography, actual cutout products, product-specific stage colours, manual selection, an editable photo mode and a compact strip of the existing active campaigns. `footwear-world.css` owns this destination's hero, editorial rotation and collection treatment. No product, price or stock records were added or reset.

The perfume destination uses `FragranceBoutique.tsx` and `fragrance-boutique.css`, replacing the former perfume-experience stylesheet. Its aquatic campaign uses deep petrol `#064554`, white and champagne accents, seven bottles in a triangular still life, water reflections and botanicals; the rest retains warm paper and serif typography. Footwear uses forest `#073b33`, petrol/slate alternatives and vivid amber `#ffaf49` or mint, without circular hero scenery. The compact category index shows seven botanical collections; note collections use real saved top/heart/base notes through `fragrance-discovery.ts`. The anatomy/studio landing block has been removed; `FragranceDiagram.tsx` remains on product details. Sparse dried stems frame the perfume page edges without covering shopping controls. Hidden profiles remain hidden, custom product/category images survive and existing admin hero fields still control copy and imagery. Images and generation prompts are recorded in `design-assets/fragrance-studio/PROMPTS.md` and `AQUA-HERO.md`.
