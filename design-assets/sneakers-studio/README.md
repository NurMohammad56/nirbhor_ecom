# Nirbhor Sneaker Studio

Graphite and electric-lime sneaker experience with an actual, lazily loaded Three.js scene. The hero retains the merchant-editable collection photograph as its second view and as the no-WebGL / failed-network fallback.

The model is a clearly labelled **design concept**, not an exact representation of a stocked SKU. Existing product photos, EU sizes, variant stock and order behavior remain authoritative.

## Asset provenance

- Materials Variants Shoe, © 2021 Shopify, via [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/MaterialsVariantsShoe).
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Original notice retained at `public/assets/sneakers-studio/LICENSE.md`; customer-accessible attribution at `credits.html`, linked next to the viewer.
- Original GLB: 7,833,592 bytes. Web edition: 2,198,932 bytes. Embedded 2048px JPEG textures resized to 1536px and encoded at quality 88; original mesh, UVs and three material variants retained. No third-party runtime model/image requests.

## Interaction and performance

- Drag horizontally or use rotate/reset buttons; three preview colorways. Touch canvas allows vertical page scrolling.
- Three.js and GLTFLoader import only when the studio enters view. No 3D fetch on other departments.
- Pixel ratio capped at 1.5 (1 on coarse pointers). Gentle movement only on fine pointers without reduced-motion preference; other devices render on demand. Animation pauses offscreen and in hidden tabs.
- Canvas, observers, pointer handlers, RAF, materials, geometry, bitmaps, textures, environment and renderer disposed on exit or context loss; pending model fetch aborted on view changes.
- Old default palette migrates once; merchant copy, images and custom colors remain intact.
- Studio touch controls have 44px targets, including on a 320px phone; color dots remain visually restrained inside the larger buttons. Arrow keys rotate the focused preview and Home resets it.
- Customers can pause the desktop animation, preserving their choice across photo/3D view switches. System reduced-motion and coarse-pointer policies continue to take precedence.
- A model that stalls for 15 seconds falls back to the merchant photograph, releases its canvas and offers a retry. The photograph and shopping links remain available while loading.
