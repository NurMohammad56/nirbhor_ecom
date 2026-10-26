import type { Category, DepartmentExperience, Product } from "./data";

export type Department = {
  slug: string;
  categoryId: string;
  category: string;
  name: string;
  kicker: string;
  tagline: string;
  image: string;
  collectionLabel: string;
  storyImage: string;
  eyebrow: string;
  subcategories: string[];
  features: [string, string, string];
  experience: DepartmentExperience;
};
export const departments: Department[] = [
  {
    slug: "organic",
    categoryId: "c0",
    category: "Organic Food",
    name: "Organic",
    kicker: "GOODNESS, AT ITS ROOTS",
    tagline: "From honest origins to everyday rituals.",
    image: "/assets/organic-world-v4.webp",
    collectionLabel: "The pantry edit",
    storyImage: "/assets/source.webp",
    eyebrow: "PANTRY & EVERYDAY NOURISHMENT",
    subcategories: [
      "Honey & Molasses",
      "Nuts & Seeds",
      "Dates & Dry Fruits",
      "Tea & Herbal",
      "Spices & Oils",
    ],
    features: [
      "Clear ingredients",
      "Origin & batch details",
      "Small-batch selections",
    ],
    experience: {
      heroTitle: "Naturally good.\nHonestly chosen.",
      description:
        "Golden honey, nourishing nuts, and everyday pantry essentials. Discover the simple pleasure of knowing what goes into your home.",
      heroImage: "/assets/organic-world-v4.webp",
      accent: "#193f30",
      background: "#e9eedf",
      ink: "#263c2e",
      announcement:
        "A little closer to nature. A little more everyday goodness.",
      storyTitle: "Good food starts\nwith honest origins.",
      storyText:
        "Get to know the ingredients, the source and the story behind your pantry staples. We make room for clear details, natural character and everyday choices you can feel good about.",
      enabled: true,
    },
  },
  {
    slug: "beauty",
    categoryId: "c2",
    category: "Beauty & Care",
    name: "Beauty",
    kicker: "CARE THAT FEELS LIKE YOU",
    tagline: "A considered moment, just for yourself.",
    image: "/assets/beauty-world-v4.webp",
    collectionLabel: "The self-care edit",
    storyImage: "/assets/serum-float-v3.webp",
    eyebrow: "SKINCARE & PERSONAL RITUALS",
    subcategories: ["Skin Care", "Bath & Body", "Beauty Sets"],
    features: [
      "Ingredients made clear",
      "Care for your routine",
      "Thoughtful personal rituals",
    ],
    experience: {
      heroTitle: "Your moment.\nBeautifully considered.",
      description:
        "Everyday care with a little intention. Explore skincare, gentle essentials and rituals that make time for you.",
      heroImage: "/assets/beauty-world-v4.webp",
      accent: "#754e63",
      background: "#f3e7e5",
      ink: "#49333e",
      announcement:
        "The care edit — thoughtful essentials for your daily ritual.",
      storyTitle: "A little care.\nA ritual of your own.",
      storyText:
        "A good routine starts with understanding what you choose. Find ingredients, sizes and use instructions together, so you can build a ritual around your own needs.",
      enabled: true,
    },
  },
  {
    slug: "fashion",
    categoryId: "c-fashion",
    category: "Clothing & Style",
    name: "Fashion",
    kicker: "EVERYDAY, IN YOUR OWN WAY",
    tagline: "Considered pieces. Personal style.",
    image: "/assets/fashion-world-v4.webp",
    collectionLabel: "The everyday wardrobe",
    storyImage: "/assets/kurta-unbranded-v3.webp",
    eyebrow: "CLOTHING & EVERYDAY STYLE",
    subcategories: ["Women", "Men", "Accessories"],
    features: [
      "Fit & size details",
      "Fabrics with character",
      "Everyday versatility",
    ],
    experience: {
      heroTitle: "Wear your\nkind of everyday.",
      description:
        "Easy silhouettes. Thoughtful details. Discover pieces that feel at home in your wardrobe, and let you feel like yourself.",
      heroImage: "/assets/fashion-world-v4.webp",
      accent: "#303332",
      background: "#ede9e1",
      ink: "#292d2a",
      announcement:
        "The everyday wardrobe — natural textures, effortless silhouettes.",
      storyTitle: "Good style lives\nin the details.",
      storyText:
        "The feel of a fabric. The line of a sleeve. A fit that gives you room to move. Look closer at the materials, measurements and care behind each piece.",
      enabled: true,
    },
  },
  {
    slug: "home-living",
    categoryId: "c1",
    category: "Home & Living",
    name: "Home",
    kicker: "MAKE ROOM FOR THE EVERYDAY",
    tagline: "Objects to live with, beautifully.",
    image: "/assets/home-world-v4.webp",
    collectionLabel: "The considered home",
    storyImage: "/assets/linen.webp",
    eyebrow: "HOMEWARE & THOUGHTFUL LIVING",
    subcategories: ["Kitchen & Dining", "Home Textiles", "Storage"],
    features: [
      "Materials & dimensions",
      "Useful, beautiful objects",
      "Care for the long run",
    ],
    experience: {
      heroTitle: "Make room for\nwhat matters.",
      description:
        "Warm textures, useful objects and quiet little comforts. Thoughtfully chosen things for the place you call home.",
      heroImage: "/assets/home-world-v4.webp",
      accent: "#946547",
      background: "#eee5d8",
      ink: "#493d31",
      announcement: "Considered objects. A home that feels like you.",
      storyTitle: "A home, made\none good thing at a time.",
      storyText:
        "Choose things for how you live. Explore the materials, dimensions and care of everyday objects, from a favourite breakfast bowl to the linen on your table.",
      enabled: true,
    },
  },
];
export function categoryForDepartment(d: Department, categories: Category[]) {
  return (
    categories.find((c) => c.id === d.categoryId) ||
    categories.find((c) => c.departmentSlug === d.slug) ||
    categories.find((c) => c.name === d.category)
  );
}
export function experienceForDepartment(d: Department, categories: Category[]) {
  return {
    ...d.experience,
    ...categoryForDepartment(d, categories)?.experience,
  };
}
export function departmentForProduct(p: Product, categories: Category[] = []) {
  return departments.find(
    (d) =>
      p.category === (categoryForDepartment(d, categories)?.name || d.category),
  );
}
export function departmentForLocation(
  pathname: string,
  search: string,
  products: Product[],
  categories: Category[],
) {
  const first = pathname.split("/")[1];
  const byPath = departments.find((d) => d.slug === first);
  if (byPath) return byPath;
  const category = new URLSearchParams(search).get("category");
  if (pathname === "/shop" && category)
    return departments.find(
      (d) =>
        categoryForDepartment(d, categories)?.name === category ||
        d.category === category,
    );
  if (/^\/(product|campaign)\//.test(pathname)) {
    const p = products.find((p) => p.id === pathname.split("/").pop());
    if (p) return departmentForProduct(p, categories);
  }
  return undefined;
}
export function productHref(p: Product, categories: Category[] = []) {
  const d = departmentForProduct(p, categories);
  return `${d ? "/" + d.slug : ""}/${p.campaign ? "campaign" : "product"}/${p.id}`;
}
export function departmentShopHref(d: Department, subcategory?: string) {
  return `/${d.slug}/shop${subcategory ? "?subcategory=" + encodeURIComponent(subcategory) : ""}`;
}
