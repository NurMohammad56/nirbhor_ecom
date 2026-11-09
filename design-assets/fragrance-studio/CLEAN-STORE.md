# Clean perfume store and accord reference study

## Reference access and observed patterns

- [Perfume Bangladesh](https://perfume-bd.com/): direct web fetch and a normal local Chromium visit both returned HTTP 403/security verification. No full visual inspection or exact color match is claimed. Search-indexed homepage content showed newest arrivals, best sellers, product names, categories, prices and add-to-cart actions. Indexed product pages show volume, price, stock, purchase action, descriptions and note breakdowns.
- [Fragrantica Crimson](https://www.fragrantica.com/perfume/Rayhaan/Crimson-112761.html): direct fetch and Chromium also returned HTTP 403. The indexed page exposed main accords and top/middle/base note organization. The implementation borrows that information hierarchy; it does not copy ratings, reviews, claims, product data or a proprietary interface.

The user explicitly rejected the earlier colored/decorative presentation. The resulting direction is white/neutral surfaces, charcoal text and ordering controls, normal isolated product pictures, compact collection navigation, and color confined to editable accord bars. The watery campaign, edge botanicals and duplicate hero navigation have been removed from perfume pages. Other departments retain their identities. Existing custom merchant hero photographs and colors remain supported; known old seed defaults receive the new neutral defaults without rewriting stored records.

Accord bar lengths mean relative scent character, not ingredient percentages, concentration, longevity or user ratings. Automatic demonstration profiles are limited to the three existing explicitly labelled sample products. Real products receive no invented default accords; saved empty lists remain empty. Merchants control labels, relative levels, tone, order, removal and visibility in the product page editor.

## Product cutout

Built-in image_gen was used for background extraction of the existing noir sample photograph. No CLI/API fallback or competitor product imagery was used. Existing amber/rose cutouts were reused. Custom merchant photos remain untouched; only known sample image paths use isolated display assets.

Input: `public/assets/perfume-noir-v1.webp`.
Output: `public/assets/fragrance/noir-cutout-v3.webp`, within 1000 x 1200, WebP quality 88 with alpha preserved.
Original generated PNG: `C:/Users/bdcalling/.codex/generated_images/01a1769e-dd5c-7583-9d6e-5750846c30ec/exec-6ca52600-7867-4eff-ad04-4e0e7403ed39.png`.

The generated bottle/cap/plaque and transparent background were visually inspected. The prior scene remains in the project, and product IDs, original media fields, stock and prices are retained.

Exact prompt:

Edit target: the attached existing sample perfume product photo. Precise background extraction only. Preserve this EXACT emerald-green vertically ribbed glass perfume bottle, faceted wide glossy BLACK cap, gold neck and blank rectangular gold plaque, their proportions, green color and realistic glass details. Isolate the single bottle standing upright, straight front view, fully visible from cap to base. Remove ALL scenery, water, reflections of the table, leaves, citrus, wood, gold circle, background and props. True transparent alpha background, no white rectangle, no dark backdrop, no floor plane, no text or logo, no extra bottles. Clean sharp product cutout for a white ecommerce catalogue, even neutral studio illumination without changing the bottle identity. Leave breathing room around the entire bottle. This is an edit of the supplied sample, not a new bottle design.
