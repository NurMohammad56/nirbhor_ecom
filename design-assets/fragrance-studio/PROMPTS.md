# Fragrance studio assets - 8 November 2026

Mode: built-in `image_gen` image generation/editing. Reference images supplied in the conversation guided art direction only; competitor logos, marketing claims and branded banner artwork were not used in the site.

Final project assets:
- `public/assets/fragrance/botanicals-v2.webp`: generated botanical atlas, with real alpha, showing rose, jasmine, bergamot and sandalwood.
- `public/assets/fragrance/amber-v2.webp`: edited cutout of the existing unbranded amber sample bottle.
- `public/assets/fragrance/rose-v2.webp`: edited cutout of the existing unbranded rose sample bottle.
- `public/assets/fragrance/noir-v2.webp`: edited emerald sample bottle. The returned image includes a dark green background; it is presented on a matching dark panel, not represented as a transparent cutout.

Original generated PNGs remain under the image tool's generated_images directory. Final images were converted to WebP (quality 86, alphaQuality 100); botanical width 2172px, bottle widths up to 1000px. Existing original product photos and merchant-upload URLs remain intact. Sneaker hero photographs reuse the existing original unbranded court/terra/urban cutouts in `public/assets/sneaker-campaign/`.

## Botanical atlas prompt

Create one premium botanical ingredient atlas for a luxury fragrance ecommerce website. Extremely wide horizontal 4:1 image with FOUR EQUAL INVISIBLE CELLS in one row. Cell 1: a single fresh velvety deep pink-red rose blossom with two restrained green leaves. Cell 2: a delicate small cluster of white jasmine blossoms, clearly jasmine. Cell 3: a whole green-yellow bergamot citrus and one juicy cut half with a leaf. Cell 4: a small elegant arrangement of genuine pale sandalwood chips and one piece of warm textured wood. Each subject isolated inside its own cell, centered, generous empty transparent margin around every subject, NEVER touching neighboring cells. Photorealistic high-end macro product photography, natural warm daylight, crisp detail, botanical realism. Consistent scale and illumination across cells, designed to be shown as four independent cropped category pictures. Actual transparent alpha background. No text, no bottles, no logos, no UI, no frames or drawn dividers, no ground, no heavy cast shadows.

## Amber bottle edit prompt

Reference: `public/assets/perfume-amber-v1.webp`.

Extract and refine ONLY the exact perfume bottle from this reference for a premium interactive fragrance website. Preserve its identity: square thick clear glass, rounded shoulder corners, warm rich amber liquid, polished gold neck and spherical gold cap, small blank cream rectangular label. Remove the entire stone room, pedestal, vanilla pods, wood and background. One complete bottle centered, upright, front three-quarter angle nearly front-on, entire cap and glass base comfortably inside canvas with generous transparent margins. Photorealistic studio catalogue quality, premium crisp glass edge reflections, transmitted amber light, clean physically credible refraction; retain slight three-dimensional volume. Genuine transparent alpha background, with no environmental rectangle or opaque background behind the glass. No lettering, no added branding, no floating objects, no UI. This is the same sample bottle, not a new branded product.

## Rose and noir bottle edit prompts

References: `public/assets/perfume-rose-v1.webp` and `public/assets/perfume-noir-v1.webp`, respectively.

Extract the exact perfume bottle from the reference as a premium realistic catalogue cutout. Preserve identity: **[identity below]**. Remove every background element, flowers, fruit, pedestal, fabric and wood. Entire bottle upright, centered, near-front three-quarter view, cap and base fully visible, generous transparent margins. Crisp luxury glass reflections and physically plausible liquid, no new brand, no words or lettering. True transparent alpha background with no opaque rectangular backdrop. Same bottle and shape as reference, not a different product.

- Rose identity: oval faceted blush-pink glass, pale pink dome cap and gold collar, blank cream label.
- Noir identity: deep emerald green vertically ribbed rectangular glass, black faceted cap, gold collar and blank gold plate.

These are presentation assets for existing labelled sample products. Fragrance note matching always reads the saved product profile, never image contents or speculative ingredient claims.
