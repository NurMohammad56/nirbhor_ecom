# Editorial collections and motion

2026-11-01: added an editorial homepage collection grid. Clothing is the large photographic panel; Tech and Home & Living are the two complementary panels. Links go to the actual department pages. The selection follows active categories, enabled experiences and published inventory; other available departments fill empty slots. Saved category hero images also appear in these panels. Existing photography and the approved Nirbhor logo are retained; no new image generation was needed.

A shared `useDepthMotion` hook now controls the homepage hero, department heroes, collection panels, brand/department story images, offer hero and About photograph. The previous per-hero scroll hook was removed. Only photographs move; headings, shopping controls and layout stay in the normal document flow. Positions are bounded to 18 px, written as CSS properties from one scheduled animation frame, using passive scroll events and intersection tracking. It does not hijack scrolling or run a continuous rendering loop. Hidden tabs pause updates; route changes, resize policy changes and reduced-motion changes clean up observers, listeners, transforms and animation frames. Images have enough crop allowance to avoid exposed edges.

Additional parallax runs only with a fine pointer and a viewport of at least 900 px. Phones, coarse pointers and reduced-motion users get still imagery; the existing three-second home carousel and its two manual arrows retain their established reduced-motion behavior. Product zoom, product rails, menus and ordering controls remain independent of the new motion. Admin pages use no parallax.

The visual pass also refines the department story/FAQ panels, public About photo, offer presentation, checkout surfaces and admin form typography. No catalogue, pricing, reviews, stock or persistence schema changed. The homepage remains free of ambient background artwork.

Verification covers actual scroll-driven image movement, stable caption positioning, reduced-motion changes at runtime, touch behavior, valid collection links, saved hero overrides and disabled departments. Browser evidence and screenshots remain locally under `artifacts/depth-*`.

Final verification: all 87 Playwright tests passed. All 60 page/viewport browser checks at 320, 390, 768, 1366 and 1440 px passed without broken images, client errors or horizontal page overflow. The original shared checkout, admin controls, three-second carousel and compact category menu are included in that regression suite.
