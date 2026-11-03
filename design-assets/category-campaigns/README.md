# Category campaign photography - 3 November 2026

Twenty-four original campaign photographs created with the built-in `image_gen` tool: three for each of Organic, Beauty, Fashion, Home & Living, Smart Life, Sneakers, Watches and Tech. The latest eight replace the single-product hero artwork with full multi-product campaign scenes. Original generation/edit prompts are in [prompts.json](./prompts.json); the eight replacement prompts are in [feature-prompts.json](./feature-prompts.json). Final project assets are `public/assets/campaign-{slug}-{offer|feature|edit}-v1.webp`, full landscape images optimized as WebP. Original generated PNGs remain in the Codex generated-images library.

Each category's default carousel presents three distinct full campaign scenes: actual active offer, new-arrival/collection feature, and another active offer or editorial collection. All three photographs depict several relevant products in a clean mint, teal and warm accent direction, using the same full-width art layout. Product links and small price tiles still use actual catalogue data. Existing category photos remain available for static placements; merchant image/headline overrides and independent banner image uploads remain supported.

New-arrival language appears only for an available published product whose merchant badge says New/নতুন. Other departments use a truthful collection-feature label. No products, discount values, urgency, capabilities, reviews or stock counts were invented. Promotional amounts still derive from the existing offer engine. Campaign photos are illustrative styling; product tiles use the catalogue's existing product photos and prices.

Organic packaging uses the approved Bengali Nirbhor wordmark with orange leaf and a consistent cream rectangular label system; imported beauty, fashion, shoe, watch and technology objects have no Nirbhor manufacturing branding. Text, codes and prices are editable HTML rather than baked into the campaign photographs.

Desktop adds two direct product links over the campaign art. Mobile stacks text and photography without overlapping copy. The middle slide now matches the other two campaign layouts, without a standalone catalogue-photo panel or large single-product price. Existing three-second autoplay, two manual arrows, focus/hover pause and reduced-motion behavior remain.

Admin: `/admin/banners`. Each slide image, title, supporting copy, placement, ordering and visibility is editable independently. This remains the existing browser-local frontend prototype until backend integration.
