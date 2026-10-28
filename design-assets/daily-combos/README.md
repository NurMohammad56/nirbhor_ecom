# Daily combos and spice assets

Three new sample spice product photographs were generated with the built-in image_gen tool: cumin, coriander and chilli powder. They use the approved Nirbhor logo and the existing turmeric jar as packaging references. The cream label, orange-green border and 200 g pack layout stay consistent; the product name and contents change.

Final native-resolution WebP files are in `public/assets/spice-cumin-v1.webp`, `spice-coriander-v1.webp` and `spice-chilli-v1.webp`. Source PNGs remain locally in `design-assets/originals/daily-combos`. Encoding only, with no visual edits or resizing. Exact prompts and reference roles are recorded in `prompts.json`.

Seven additional demo combos cover everyday spices, a cooking selection, tableware, daily care, snacks, pickles and a tea break. Discounts are calculated from current catalogue variant prices. Existing merchant edits and later deletions are preserved by a one-time migration. Products remain explicitly marked as samples; no reviews or sales counts were created.

The offers explorer supports URL-backed purpose, search, budget, sorting and stock filters. Homepage and department showcases keep a maximum of four featured combos. Recently viewed products appear only after two actual product visits and can be cleared. Admin combo editing includes purpose grouping.

Validation: 56 Playwright tests passed, including migration preservation, URL filters, component stock reservation and cancellation, recently viewed history and admin grouping. Desktop and mobile browser checks found no broken images, client errors or horizontal overflow at 320 px.
