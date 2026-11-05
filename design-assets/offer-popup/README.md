# Welcome offer popup

Admin: `/admin/offer-popup` under the marketing menu.

The default popup appears on the homepage after eight seconds, at most once in 24 hours per browser. It uses a current coupon (then an available combo or catalog discount if needed). A selected inactive, sold-out or expired offer is never displayed. Automatic mode can choose another currently valid offer. No discount amount or urgency is invented by the popup.

Controls: enable/disable, choose a live offer or a general banner, title, supporting text, uploaded image or image URL, button text and internal destination, delay (0-60 seconds), per-visit/24-hour/7-day frequency, homepage/all shopping/category targeting, mobile/desktop/all devices and optional Bangladesh-time schedule. A new campaign revision lets previously exposed visitors see the next campaign. Draft preview does not consume a visitor impression or follow the CTA.

Visitor behavior: close, Escape, outside click, decline and seven-day suppression; copy a real coupon; CTA remembers its code and opens the offer. The popup waits while a form field, dialog, hidden tab or bag is active, and excludes cart, checkout, order tracking, authentication and account pages. Focus is trapped and restored; scroll is locked only while open. Short mobile screens scroll within the popup. Reduced-motion preferences disable the entrance animation.

Configuration is saved using the existing browser-local `content` store (`welcome-offer-popup`). Impression timestamps are local to the visitor browser. This remains the frontend prototype: admin edits do not yet become shared server configuration across customer devices. Existing offer and order data behavior is unchanged.

Validation: admin save/reload/preview, live coupon copy and routing, repeat suppression and campaign revision, category exclusions, future/expired/missing offers, device layout, keyboard/focus/scroll restoration, busy search/bag deferral and form validation. Regression checks cover checkout and product-page interactions.
