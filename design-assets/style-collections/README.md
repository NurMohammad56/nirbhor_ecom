# Sneakers and watches

Added two parent departments: Sneakers (`c-sneakers`, `/sneakers`) and Watches (`c-watches`, `/watches`), each with its own palette, hero, three subcategories, product carousel, product listing, story, FAQ and editable sections. Navigation, mobile navigation, homepage category rail and carousel, footer, search, scoped product routes and SEO include both departments.

Ten assets were generated with the built-in image_gen tool: two digital showroom concepts and eight individual generic product photographs. No third-party logos or supplier-specific specifications are claimed. Showroom images are visibly labelled as digital showcases, not photographs of an existing physical Nirbhor shop. Exact prompts and final file paths are in `prompts.json`. Final native-resolution assets are `public/assets/style-*-v1.webp` (WebP quality 92, no visual edits or enlargement). Original PNGs remain locally in `design-assets/originals/style-collections/`.

Four sample sneakers have EU 38-43 variants and four sample watches have a standard variant. Prices, inventory, images and product details are clearly sample data. No unverified performance, materials, watch movements, waterproof ratings, warranties, reviews or sales figures were added. An atomic one-time migration preserves merchant changes, customer data and subsequent deletions.

Category hero controls accept an image URL or JPG/PNG/WebP upload. Uploaded images are prepared in the browser and saved with the existing browser-local prototype data; this does not provide shared backend storage. Category switching invalidates pending uploads. Existing category colour, copy and section controls remain available.

All product detail images now magnify around the mouse position on fine-pointer devices. Leaving the image or changing the photo resets the view; the full-image dialog and touch interaction remain available.

Validation: 70 Playwright tests passed, including migration, scoped discovery/search, size-specific stock reservation, URL/upload persistence, hover movement/reset and touch enlargement. Browser checks covered 320, 390, 768, 1100, 1366 and 1440 px across home, both landings, catalogue, product and admin pages with no client errors, broken images or horizontal page overflow.
