# Commerce UX review - 4 November 2026

Reviewed public home, category/listing and representative product pages through a browser. These observations are a review of key shopping journeys, not an audit of every product, account or checkout on either marketplace. No orders or account actions were performed, and no reference-site assets were copied.

## Sources and adaptations

| Public reference | Observed pattern | Nirbhor adaptation |
| --- | --- | --- |
| [Daraz homepage](https://www.daraz.com.bd/) | Consistent banner slot, campaign emphasis, sale products, category discovery and recommendations. | Stabilized all hero frames, retained real campaign artwork, added four shopping shortcuts, kept discounted products ahead of the coupon shelf. |
| [Daraz category](https://www.daraz.com.bd/kitchen-fixtures/) | Prominent search, price/filter controls and comparable product cards. | Directly visible mobile search; budget links open real price/stock filters; common product cards show real percentage reductions and consistent two-line names. |
| [Daraz product example](https://www.daraz.com.bd/products/hoco-j154-victorious-10000mah-power-bank-225w-fast-charge-pd-20w-3-outputs-usb-a2-225w-type-c-20w-type-c-18w-input-led-digital-display-for-android-iphone-i1595415461-s12702691728.html) | Clear price, selected variant, purchase actions and delivery information. | Preserved the existing variant, delivery, quick-order and checkout flows; improved shared price presentation rather than adding unsupported services. |
| [Othoba homepage](https://othoba.com/) | Large main campaign beside secondary promotions; category imagery, deal and trending sections; customer-service links. | Kept the approved main/side-banner composition and teal/orange identity; improved shortcut grouping and promotion hierarchy. |
| [Othoba category](https://othoba.com/daily-bazar) and [product example](https://othoba.com/pureit-classic-blue-23l-water-purifier-4-stage-gravity-based-water-purifier-best-buy-1040779) | Category filtering, current/previous price and buying/delivery information. | Actual coupon conditions and copy/use actions; budget discovery based on published, available inventory; common pricing and purchasing UI. |

Budget groups and coupon tickets are original Nirbhor design choices inferred from the shopping patterns above. The established palette and photography remain in use. No new discount rates, fabricated sale deadlines, reviews, customer counts, payment services or marketplace claims were introduced.

## Hero stability

The earlier hero allowed the active text, headline wrapping and optional coupon row to determine its height. `useStableHero` measures all frames at the actual copy width before paint, reserves the tallest content slot and recalculates only when the content, available width or fonts change. Temporary measuring copies are hidden/inert and removed immediately. Banner imagery stays in its existing absolute, cropped frame. Mobile reserves the same copy area above the image on every slide. Long merchant edits and different photo aspect ratios remain supported without clipping the text.

Verified home plus all eight departments at 320, 390, 768, 1024 and 1440 pixels. Regression checks compare hero height and the document position of its lower edge across every frame, including resizing while a noninitial slide is selected.

## Shopping and admin

- Four home shortcuts: active sale products, combos, recent catalogue additions and order-ranked products.
- Coupon shelf derives active eligibility conditions from existing records; copy feedback does not move the page or silently select a coupon. The use link carries the actual code to the catalogue.
- Budget cards use current published, in-stock products and open matching maximum-price/stock/sort filters.
- Best-selling catalogue sorting now uses saved order quantities and excludes cancelled orders, matching the existing best-selling rails.
- Offers tabs are addressable with `?tab=combo`, `?tab=code` and `?tab=sale` and preserve filter state.
- `/admin/banners` can show/hide the coupon shelf and budget section alongside the existing sale-section control. This remains a browser-local frontend prototype until backend integration.
