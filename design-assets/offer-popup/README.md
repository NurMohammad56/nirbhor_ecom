# Welcome offer popup

Admin: `/admin/offer-popup` under the marketing menu.

The default popup opens after three seconds on shopping pages. Every fresh site entry, reload or new tab can show it again; internal navigation does not reopen it after dismissal. The delay can be set from zero to four seconds. A restored back/forward-cache document starts a new entry. Busy forms, an open dialog, a bag or a hidden tab can defer opening until they are clear. Checkout, cart, account and tracking remain excluded.

Multiple campaigns can be added, duplicated, edited, enabled/disabled, reordered and removed from the admin. Eligible campaigns appear as pages in one popup, with previous/next buttons and direct page selectors. Closing the popup dismisses the whole group for the current document visit. Each campaign has its own creative, destination, targeting and schedule. The first eligible campaign determines the opening delay.

Offers use current coupons, available combos or catalog discounts. A selected inactive, sold-out or expired offer is never displayed. Automatic mode can choose another currently valid offer. No discount amount or urgency is invented by the popup.

Controls per campaign: enable/disable, live offer or general banner, title, text, uploaded image or image URL, button text and internal or HTTP(S) destination, delay (0-4 seconds), fresh-entry/tab-session/24-hour/7-day frequency, homepage/all shopping/category targeting, mobile/desktop/all devices and optional Bangladesh-time schedule. Draft preview does not consume a visitor impression or follow the CTA. Unsafe executable and protocol-relative destinations are rejected.

Visitor behavior: close, Escape, outside click and decline; copy a real coupon; CTA remembers its code and opens its own destination. Fresh-entry frequency ignores old local/session suppression timestamps and has no week-long suppression button. Optional day/week/session policies remain available to the admin. Focus is trapped and restored; scroll is locked only while open. Short mobile screens scroll within the popup; navigation remains accessible. Reduced-motion preferences disable the entrance animation.

Configuration is saved as `{version:2,items:[...]}` in the existing browser-local `content` store (`welcome-offer-popup`). An intentionally empty list stays empty. Legacy single-banner configurations retain their creative, enabled state and links while adopting fresh-entry frequency, a maximum three-second opening delay, and shopping-page scope for the former homepage default. Impression timestamps are local to the visitor browser. This remains the frontend prototype: admin edits do not yet become shared server configuration across customer devices. Existing offer and order data behavior is unchanged.

Validation: admin multi-campaign save/reload/order/delete, individual internal/external destinations, legacy migration, fresh entry/reload/new tab versus internal navigation, preview, live coupon copy, optional daily suppression, category exclusions, future/expired/missing offers, mobile layout, keyboard/focus/scroll restoration, busy search/bag deferral and form validation. Regression checks cover checkout and product-page interactions.
