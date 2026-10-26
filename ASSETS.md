# Visual assets

The current immersive design uses thirteen V3 assets: five panoramic scenes, three transparent botanical/serum cutouts, four unbranded product photos, and a corrected packing photograph. See [V3-PROMPTS.md](design-assets/V3-PROMPTS.md) for every exact prompt and final filename. These supersede V2 beauty/clothing branding. Own-brand organic food and shipping packaging retain NIRBHOR; imported beauty and clothing do not.

The multi-category prototype adds nine generated assets for the main hero, Beauty, Fashion, Home, brand packing story and sample products. Their exact prompts, filenames and generation mode are in [V2-PROMPTS.md](design-assets/V2-PROMPTS.md). Final images are served from `public/assets/*-v2.webp`; the selected originals remain in `design-assets/originals/`.

Final website assets are stored in **public/assets/** as WebP images. The selected generated originals are also retained locally in **design-assets/originals/**. Built-in **image_gen** was used; no API key or fallback CLI was used.

The hero and eight product photographs were created for this frontend. Treat them as brand presentation concepts rather than photographs of actual commercial stock.

## Hero prompt

Use case: product-mockup. Asset type: editorial ecommerce hero photograph for NIRBHOR organic pantry, landscape 1536x1024. An art-directed realistic still life of raw amber honey in a tall clear cylindrical jar with a dark forest green lid and a minimal cream label reading NIRBHOR, RAW HONEY, 500g. Jar at right foreground on a pale limestone pedestal. A handmade cream bowl of almonds and walnuts in front-left, a bowl of glossy dates behind right, a wooden honey dipper with a small drip, delicate botanical branches and soft leaf shadows. Seamless pale sage background and empty upper-left space. Warm side sunlight, tactile materials, translucent amber, muted cream and evergreen. No people, overlay text, watermark or UI.

Saved assets: `hero.webp`, `honey.webp`, `bundle.webp`.

## Catalogue prompt set

Shared direction: “Use case: product-mockup. Asset type: square ecommerce product photograph for organic lifestyle brand NIRBHOR. Photorealistic, editorial premium organic brand photography. Warm pale ivory beige seamless background #eeeae0. Soft natural sunlight from upper left and subtle long shadows. Fully visible, centrally composed subject with breathing room around the edges. Honest natural materials, cream and dark evergreen branding. No people, watermark, UI or extra text outside packaging.”

| File           | Subject added to the shared prompt                                                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nuts.webp`    | Premium kraft pouch labelled NIRBHOR, PREMIUM MIXED NUTS, 250g, a clear window of almonds, cashews, walnuts and pistachios, and a shallow stoneware bowl of the same nuts. |
| `dates.webp`   | Clear jar of authentic glossy, dark, wrinkled Ajwa dates, forest green lid, cream NIRBHOR / AJWA DATES / 500g label, and several dates on a pale ceramic plate.            |
| `soap.webp`    | Three pale sage handmade olive soap bars, one with a cream NIRBHOR / OLIVE SOAP band, a small olive branch, rounded corners and natural texture.                           |
| `ceramic.webp` | Two finished ivory speckled stoneware breakfast bowls, one nested in the other, with a small linen cloth. No hands or pottery making.                                      |
| `linen.webp`   | Folded ivory and oatmeal flax linen napkins, stacked with a forest green ribbon, a tiny NIRBHOR tag and a dried botanical sprig; tactile weave detail.                     |
| `ghee.webp`    | Wide clear jar of golden pure cow ghee, forest green lid and cream NIRBHOR / ORGANIC GHEE / 500ml label, with a wooden spoon of ghee.                                      |
| `jars.webp`    | Three empty clear cylindrical pantry jars of different sizes, flat bamboo lids and a small cream NIRBHOR tag.                                                              |
| `seeds.webp`   | Kraft pouch with cream NIRBHOR / CHIA SEEDS / 250g label and a shallow bowl of accurately tiny grey-black chia seeds.                                                      |

## Supporting photography

Supporting photographs were downloaded from Unsplash and served locally. Source image identifiers:

- `home-hero.webp`: `photo-1600210492486-724fe5c67fb0`
- `tea.webp`: `photo-1544787219-7f47ccb76574`
- `oil.webp`: `photo-1608571423902-eed4a5ad8108`
- `granola.webp`: `photo-1517673400267-0251440c45dc`
- `spices.webp`: `photo-1596040033229-a9821ebd058d`
- `source.webp`: `photo-1441974231531-c6227db76b6e`

Source URLs use `https://images.unsplash.com/<identifier>`. Replace concept imagery with approved real product photography when preparing the live store.

## Typography

DM Sans and DM Serif Display are served locally from `public/fonts`. Original source: Google Fonts. Font licences are included alongside the font files. UI icons use the Lucide React package.
