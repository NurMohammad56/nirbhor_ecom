# Product shopping experience

- Added inline padding to delivery assurances so the truck has room on its leading side.
- The delivery estimator uses `cartTotals`, current admin shipping settings, selected variant, quantity, eligible collected coupon and automatic promotions. Region changes update totals without navigation. Free-delivery progress uses the configured threshold. This is an estimate for this selection; the full bag, address, coupon limits and final eligibility are checked during checkout.
- A sticky purchase bar appears only after the original purchase row passes above the header. It retains the current variant and quantity, respects stock, opens the existing bag and hides while dialogs or the bag are open. Campaign pages retain their separate existing controls.
- Product links can be copied with confirmation. Touch devices can swipe between existing gallery pictures; vertical page scrolling and tap-to-enlarge remain available.
- Deep teal, warm cream and sage keep the existing identity. Native selects, keyboard buttons, live price announcements and reduced-motion handling support accessible use.
- Product content and settings remain in the existing browser-local frontend prototype. No new central order or persistence backend is implied.

Validation: delivery region/quantity/free-shipping math, sticky purchase and bag state, clipboard, mobile swipe/overflow, product admin controls, checkout and image magnification.
