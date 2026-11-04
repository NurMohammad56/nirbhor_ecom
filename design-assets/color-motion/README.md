# Colour and motion refinement

The approved teal/orange identity now has warmer amber gradients, mint coupon surfaces and restrained lilac accents. Changes are native CSS/React and reuse the existing approved photographs; no new raster assets or dependencies were introduced.

- A slim, continuous benefits ribbon derives its messages from active coupons, available combos, actual free-shipping settings and COD availability. It has a deliberate pause/resume control and pauses on hover, keyboard focus, reduced-motion preferences, document visibility and when offscreen. The duplicated visual group is inert and hidden from assistive technology. Reduced motion shows a static, horizontally accessible group.
- Hero offer badges have a restrained glimmer controlled by the existing hero playback state. The stable hero geometry is preserved.
- The real-sale section has a richer teal campaign panel, gold CTA, an actual published/available product count and a slow decorative light sweep. The light pauses offscreen, on hover/focus, while the document is hidden and for reduced motion.
- Promo cards, shortcut icons, coupon tickets, product actions and budget artwork react to hover with restrained shadows, colours and small transforms. Reduced-motion overrides retain stable artwork and disable decorative movement.
- Budget-card artwork now varies by budget tier using actual available products within each price cap; counts, prices and destinations still use the same catalogue filters.
- `/admin/banners` controls visibility of the benefits ribbon alongside the existing home-section controls. Existing prices, discount rules, stock, orders and customer state are untouched. This remains the existing browser-local frontend prototype.

Validation covers ribbon movement and reading/pause controls, keyboard access, reduced motion, offscreen/hidden-page pausing, real message sources, admin visibility, shopping links, hero geometry at five viewport widths, catalogue/quick-order overlays and touch rails. Desktop and mobile previews were inspected.
