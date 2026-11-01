# Nirbhor sneaker campaign, revision 2

The customer's supplied Jumpman reference establishes the composition: a large diagonal shoe at the center, oversized type behind it, a restrained line pattern, small style thumbnails at lower left, price beside the shoe, and purchase controls below. Nirbhor's forest green (`#193f30`), warm ivory (`#f7f3e8`) and orange (`#f18a31`) replace the previous lime palette.

The hero uses three photographic cutouts of the existing sample catalogue designs. Selection changes the image, product name, variant price, detail link and quick-order product together. No invented brand logos, sales claims, ratings or specifications are added. Existing sample labels remain visible.

## Saved project assets

- `public/assets/sneaker-campaign/terra-v2.webp` - cream/terracotta high-top, 1254 × 1254, alpha, 406,944 bytes.
- `public/assets/sneaker-campaign/court-v2.webp` - ivory/sage court sneaker, 1254 × 1254, alpha, 284,864 bytes.
- `public/assets/sneaker-campaign/urban-v2.webp` - charcoal/slate runner, 1254 × 1254, alpha, 345,126 bytes.

Generated using the **built-in image_gen tool**, one call per asset, with `transparent_background: true`. Source references were the matching `public/assets/style-sneaker-{terra,court,urban}-v1.webp` product photographs. All outputs were inspected and encoded as WebP at quality 94 with alpha quality 100. Original generated PNGs remain in the generation Library; the Site consumes only the project-local WebPs.

## Final prompts

Shared prompt, followed by the corresponding product-specific paragraph below:

> Create ONE premium photorealistic sneaker campaign cutout, transparent alpha background, 2048px square. Reference image is the product identity reference. Extract/reconstruct ONE shoe from the pair, retaining its exact panel design, silhouette, material texture, lace design, and color palette. Repose the single shoe as a dramatic floating diagonal campaign product shot: toe toward lower LEFT, heel toward upper RIGHT, shoe long axis approximately 38 degrees to horizontal, outer side facing viewer in a three-quarter view with visible laces/top and some sole. Full shoe visible, 8% clear margin all edges. Fill the frame generously. Premium realistic studio lighting, warm soft key and restrained edge highlights suited to a deep forest-green background. Finely resolved seams and material grain, physically plausible shoe proportions. NO background, NO ground plane, NO text, NO logos, NO brand marks, NO hands, NO extra shoes, NO props, NO shadows painted into background. This is a product cutout asset for an ecommerce hero; do not generate a webpage.

Terra:

> Preserve the cream and terracotta high-top sneaker from the reference. Keep it a high-top, suede-like terracotta overlays, cream leather-look panels, cream laces and cream sole.

Court:

> Preserve the ivory and muted sage low-top court sneaker from the reference. Cream leather-look panels, sage suede-like collar and tongue accents, ivory laces and sole.

Urban:

> Preserve the charcoal and slate running-style sneaker from the reference. Black mesh, slate/charcoal overlays, charcoal laces and sculpted grey sole.

## Behavior

- Subtle photographic depth uses CSS transforms and a slow float, pausing outside the viewport, in hidden tabs, with reduced motion, or through the pause button. Coarse-pointer devices keep the image still and native vertical scrolling.
- No Three.js chunk or GLB is fetched by the new hero. This is photographic motion, not an interactive 360-degree model.
- Merchant-edited product photos take precedence over supplied cutouts. Merchant-edited hero photos open in the collection-photo view by default. Merchant copy, custom colors, prices, inventory, variants and deleted products are preserved.
- The category palette/headline upgrade affects only known previous defaults. The homepage's approved carousel text remains unchanged.
- The existing single-page-application hosting fallback is retained so direct links and reloads continue to work.
