# Light showroom, Smart Life and perfume column balance

The sneaker hero now uses an illustrative, white/ivory sneaker showroom with racks on both sides and the rear wall. Desktop text is centered over a light readable surface; mobile shows the complete three-rack scene separately from the copy. No physical store/address claims were added. Existing product selector, variant prices, quick order, detail links and admin hero image/title overrides remain usable. Default sneaker campaign photography now uses the same showroom, including the homepage slide. Explicit saved merchant banner images remain intact.

Smart Life's category hero now has an ivory surface and light fade, readable dark copy/coupon text and matching slider controls. Tech retains its own dark design. Sneaker catalogue cards are more compact, four columns on wide screens and two on mobile; list view, filters and buying actions remain. No sample inventory was fabricated from the rack image.

Perfume's merchant-editable “কেনার আগে এক নজরে” summary moved from the gallery to the purchase column after the purchase/delivery content. Only perfume pages change; notes stay under the photograph. Existing admin fields, links and selected variant continue to populate the same component.

Research: inspected the accessible listing content of [Nike shoes](https://www.nike.com/w/shoes-y7ok) and [adidas shoes](https://www.adidas.com/us/men-shoes): direct product name/price presentation, filter/sort and wishlist controls. Did not claim video review or copy competitor assets.

Generated asset: `public/assets/sneakers-studio/showroom-ivory-v1.webp`, 1536 x 1024, WebP quality 90, 204428 bytes. Built-in image_gen tool used with the user's rack references. Original: `C:/Users/bdcalling/.codex/generated_images/01a1769e-dd5c-7583-9d6e-5750846c30ec/exec-ecdf7d9b-ea9d-4689-a90d-07bef5684f5d.png`.

Exact prompt is recorded in `SHOWROOM-PROMPT.txt` beside this document.

Validation: root TypeScript passed, nested production Next build passed. Browser QA checked 25 route/viewport combinations at 320, 375, 768, 1024 and 1440 px across sneaker landing/catalogue/PDP, Smart Life and perfume PDP without horizontal overflow or client errors. Checked custom hero image/headline, selected-product quick order, perfume summary placement and homepage showroom image. Inspected desktop/mobile screenshots. Browser suite results are recorded separately after completion. Both working copies synchronized. No deployment performed.

Browser regression suite: 28 of 29 cases passed initially. The perfume admin hero-edit case timed out waiting for its tab during concurrent dev-server QA; rerunning that exact case passed (6.7 seconds). No assertion or source change was needed for that retry. Updated two existing footwear expectations to the deliberately replaced showroom behavior. No full-suite or video inspection claimed.
