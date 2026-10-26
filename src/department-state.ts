import type { Banner, Category, Product, Settings } from "./data";
import { departments } from "./departments";

const clothing = (
  id: string,
  name: string,
  subcategory: string,
  price: number,
  image: string,
  description: string,
  color: string,
): Product => ({
  id,
  name,
  category: "Clothing & Style",
  subcategory,
  price,
  oldPrice: 0,
  image,
  images: [image],
  stock: 28,
  rating: 0,
  reviews: 0,
  badge: "New collection",
  weight: subcategory === "Accessories" ? "One size" : "M",
  source: "Imported collection",
  description,
  brand: "Imported collection",
  status: "Published",
  sku: `NBR-${id.toUpperCase()}`,
  type: subcategory === "Accessories" ? "Accessories" : "Clothing",
  dietary: "Cotton",
  color,
  created: Number(id.slice(1)),
  campaign: false,
  tags: "everyday, considered, clothing",
  details:
    subcategory === "Accessories"
      ? {
          Material: "Heavy cotton canvas",
          Colour: color,
          Dimensions: "38 × 40 cm",
          Care: "Spot clean. Dry in the shade.",
        }
      : {
          Material: "Cotton",
          Fit: "Relaxed everyday fit",
          Colour: color,
          Care: "Gentle cold wash. Dry in the shade.",
        },
  variants: (subcategory === "Accessories"
    ? ["One size"]
    : ["S", "M", "L", "XL"]
  ).map((label) => ({
    label,
    price,
    stock: 7,
    sku: `NBR-${id.toUpperCase()}-${label}`,
    image,
  })),
  sizeGuide:
    subcategory === "Accessories"
      ? undefined
      : [
          { size: "S", chest: "38 in", length: "40 in" },
          { size: "M", chest: "40 in", length: "41 in" },
          { size: "L", chest: "42 in", length: "42 in" },
          { size: "XL", chest: "44 in", length: "43 in" },
        ],
});
export const departmentProducts: Product[] = [
  clothing(
    "p17",
    "The Everyday Cotton Kurta",
    "Women",
    1690,
    "/assets/kurta-unbranded-v3.webp",
    "An easy ivory silhouette in soft cotton, with a clean collar and considered everyday details. Wear it your way, from slow mornings to days out.",
    "Ivory",
  ),
  clothing(
    "p18",
    "The Sage Cotton Overshirt",
    "Men",
    1890,
    "/assets/overshirt-unbranded-v3.webp",
    "A relaxed cotton overshirt in muted sage. Layer over your favourite tee for an everyday wardrobe with a little character.",
    "Sage",
  ),
  clothing(
    "p19",
    "The Everyday Canvas Tote",
    "Accessories",
    790,
    "/assets/tote-unbranded-v3.webp",
    "A roomy cotton canvas tote with olive handles, made for your everyday essentials. Simple lines, thoughtful construction and a little room for more.",
    "Oatmeal / Olive",
  ),
  {
    id: "p20",
    name: "Daily Glow Serum",
    category: "Beauty & Care",
    subcategory: "Skin Care",
    price: 1190,
    oldPrice: 1390,
    image: "/assets/serum-float-v3.webp",
    images: ["/assets/serum-float-v3.webp", "/assets/beauty-world-v3.webp"],
    stock: 24,
    rating: 0,
    reviews: 0,
    badge: "The daily ritual",
    weight: "30ml",
    source: "Imported collection",
    description:
      "A considered addition to your daily care ritual. Review the complete ingredient list and use instructions on the product packaging before adding to your routine.",
    brand: "Imported collection",
    status: "Published",
    sku: "NBR-SERUM-30",
    type: "Skincare",
    dietary: "See product label",
    color: "Dusty plum",
    created: 20,
    campaign: false,
    tags: "skincare, serum, beauty",
    details: {
      Size: "30ml",
      Routine: "Daily care",
      Ingredients: "See full ingredient list on product packaging",
      Usage: "Follow the directions on the product label",
      Storage: "Keep away from heat and direct sunlight",
    },
  },
  {
    id: "p21",
    name: "The Daily Care Trio",
    category: "Beauty & Care",
    subcategory: "Beauty Sets",
    price: 2190,
    oldPrice: 2490,
    image: "/assets/beauty-world-v3.webp",
    images: ["/assets/beauty-world-v3.webp"],
    stock: 16,
    rating: 0,
    reviews: 0,
    badge: "The care edit",
    weight: "3 pieces",
    source: "Brand collection",
    description:
      "A considered three-piece edit for your daily care ritual. Explore the sizes, ingredients and directions included with each product before use.",
    brand: "Imported collection",
    status: "Published",
    sku: "NBR-CARE-TRIO",
    type: "Skincare set",
    dietary: "See individual product labels",
    color: "Blush / Plum",
    created: 21,
    campaign: false,
    tags: "beauty, care, gift, set",
    details: {
      "In the set": "Serum, moisturiser and care mist",
      "Product details": "See individual packaging for sizes and ingredients",
      Usage: "Follow the individual product directions",
      Storage: "Cool, dry place",
    },
  },
];
departmentProducts[0].images.push("/assets/fashion-world-v3.webp");
departmentProducts[1].images.push("/assets/fashion-world-v3.webp");
departmentProducts[1].sizeGuide = [
  { size: "S", chest: "40 in", length: "28 in" },
  { size: "M", chest: "42 in", length: "29 in" },
  { size: "L", chest: "44 in", length: "30 in" },
  { size: "XL", chest: "46 in", length: "31 in" },
];
export const departmentCategories: Category[] = [
  {
    id: "c-fashion",
    name: "Clothing & Style",
    parent: "",
    description: "Considered pieces. Personal style.",
    active: true,
    image: "/assets/fashion-world-v3.webp",
    sort: 2,
    departmentSlug: "fashion",
  },
  ...["Women", "Men", "Accessories"].map((name, i) => ({
    id: `c-fashion-${i}`,
    name,
    parent: "Clothing & Style",
    description: "Everyday, in your own way.",
    active: true,
    image: departmentProducts[i].image,
    sort: i,
  })),
  ...["Skin Care", "Bath & Body", "Beauty Sets"].map((name, i) => ({
    id: `c-beauty-${i}`,
    name,
    parent: "Beauty & Care",
    description: "Care that feels like you.",
    active: true,
    image: [
      "/assets/serum-float-v3.webp",
      "/assets/soap-unbranded-v3.webp",
      "/assets/beauty-world-v3.webp",
    ][i],
    sort: i,
  })),
  ...["Kitchen & Dining", "Home Textiles", "Storage"].map((name, i) => ({
    id: `c-home-${i}`,
    name,
    parent: "Home & Living",
    description: "Useful objects. Beautiful living.",
    active: true,
    image: ["/assets/ceramic.webp", "/assets/linen.webp", "/assets/jars.webp"][
      i
    ],
    sort: i,
  })),
];
export const brandBanners: Banner[] = [
  {
    id: "brand-v2",
    title: "Good choices.\nA trusted place.",
    subtitle:
      "For your pantry, your wardrobe, yourself, and the place you call home. Discover everyday things, thoughtfully chosen.",
    cta: "Find your everyday",
    link: "/#departments",
    active: true,
    image: "/assets/brand-world-v3.webp",
    order: 0,
    start: "",
    end: "",
  },
  {
    id: "beauty-v2",
    title: "A little care.\nAll for you.",
    subtitle:
      "A considered moment in your everyday. Meet the skincare and self-care edit curated by Nirbhor.",
    cta: "Explore beauty",
    link: "/beauty",
    active: true,
    image: "/assets/beauty-world-v3.webp",
    order: 1,
    start: "",
    end: "",
  },
  {
    id: "fashion-v2",
    title: "Your everyday.\nYour own way.",
    subtitle:
      "Natural textures, easy silhouettes and thoughtful details. Meet the pieces you can make your own.",
    cta: "Explore fashion",
    link: "/fashion",
    active: true,
    image: "/assets/fashion-world-v3.webp",
    order: 2,
    start: "",
    end: "",
  },
];

export function migrateDepartmentState<T>(key: string, value: T): T {
  const marker = "nirbhor-department-v2-" + key;
  if (localStorage.getItem(marker)) return value;
  let next: any = value;
  if (key === "products" && Array.isArray(value)) {
    const list = value as Product[];
    next = [
      ...list,
      ...departmentProducts.filter((p) => !list.some((x) => x.id === p.id)),
    ];
  }
  if (key === "categories" && Array.isArray(value)) {
    const list = value as Category[];
    next = [
      ...list.map((c) => {
        const d = departments.find((d) => d.categoryId === c.id);
        return d
          ? {
              ...c,
              departmentSlug: d.slug,
              experience: { ...d.experience, ...c.experience },
              image:
                c.image === "/assets/oil.webp" && d.slug === "beauty"
                  ? d.image
                  : c.image,
            }
          : c;
      }),
      ...departmentCategories.filter(
        (c) =>
          !list.some(
            (x) =>
              x.id === c.id || (x.name === c.name && x.parent === c.parent),
          ),
      ),
    ];
  }
  if (key === "banners" && Array.isArray(value)) {
    const list = value as Banner[];
    const legacy = list.filter(
      (b) =>
        (b.id === "b1" && b.title === "A little goodness,\nevery day.") ||
        (b.id === "b2" && b.title === "Slow mornings.\nBetter beginnings.") ||
        (b.id === "b3" && b.title === "Naturally home.\nBeautifully yours."),
    );
    next =
      legacy.length === list.length
        ? brandBanners
        : [
            ...list,
            ...(list.some((b) => b.id === "brand-v2")
              ? []
              : [{ ...brandBanners[0], order: -1 }]),
          ];
  }
  if (key === "settings") {
    const settings = value as Settings;
    next = {
      ...settings,
      tagline:
        settings.tagline === "A little goodness, every day."
          ? "Everyday, well chosen."
          : settings.tagline,
      seoTitle:
        settings.seoTitle === "NIRBHOR — A little goodness, every day."
          ? "NIRBHOR — Good choices. A trusted place."
          : settings.seoTitle,
      seoDescription:
        settings.seoDescription ===
        "Organic pantry, thoughtful home and everyday essentials."
          ? "Thoughtfully chosen pantry, beauty, fashion and home essentials. Discover your everyday with NIRBHOR."
          : settings.seoDescription,
    };
  }
  localStorage.setItem(marker, "done");
  return next as T;
}
