import type { Category, Product } from "./data";

const makePickle = (id: string, name: string, price: number, taste: string, image: string): Product => ({
  id, name, category: "Organic Food", subcategory: "আচার", price, oldPrice: 0,
  image, images: [image], stock: 30, rating: 0, reviews: 0,
  badge: "নমুনা পণ্য", weight: "250g", source: "নমুনা সংগ্রহ", brand: "নির্ভর",
  description: taste + " ভাত, খিচুড়ি বা নাশতার সঙ্গে অল্প একটু আচারেই বাড়তি স্বাদ।",
  status: "Published", sku: `NBR-${id.toUpperCase()}`, type: "আচার", dietary: "", color: "Natural",
  created: 22 + ["p22", "p23", "p24"].indexOf(id), campaign: false,
  tags: "আচার, achar, pickle, pantry", details: { "পণ্যের ধরন": "নমুনা আচার", "স্বাদ": taste, "পরিমাণ": "২৫০ গ্রাম / ৫০০ গ্রাম", "সংরক্ষণ": "প্যাকেটের নির্দেশনা মেনে সংরক্ষণ করুন। শুকনো চামচ ব্যবহার করুন।" },
  variants: [
    { label: "250g", price, stock: 15, sku: `NBR-${id.toUpperCase()}-250`, image },
    { label: "500g", price: Math.round(price * 1.85 / 10) * 10, stock: 15, sku: `NBR-${id.toUpperCase()}-500`, image },
  ],
  page: { kicker: "স্বাদের সঙ্গী", shortDescription: taste + " প্রতিদিনের খাবারে পরিচিত স্বাদের একটু বাড়তি আনন্দ।", ingredients: "এটি ক্যাটালগের নমুনা পণ্য। চূড়ান্ত উপাদান ও অ্যালার্জেনের তালিকা বিক্রির আগে যোগ করতে হবে।", storage: "প্যাকেটের সংরক্ষণবিধি অনুসরণ করুন। শুকনো চামচ ব্যবহার করুন।", showProof: false },
});
export const pickleProducts: Product[] = [
  makePickle("p22", "আমের আচার", 390, "টক-ঝাল আমের স্বাদ।", "/assets/pickle-mango-v1.webp"),
  makePickle("p23", "জলপাই আচার", 350, "টক আর মসলার মিশেলে জলপাই।", "/assets/pickle-olive-v1.webp"),
  makePickle("p24", "মিক্সড আচার", 420, "বিভিন্ন ফল-সবজির মিশ্র টক-ঝাল স্বাদ।", "/assets/pickle-mixed-v1.webp"),
];
export const pickleCategory: Category = { id: "sc-pickles", name: "আচার", parent: "Organic Food", description: "টক, ঝাল আর পরিচিত স্বাদের আচার।", active: true, image: "/assets/pickle-mango-v1.webp", sort: 7 };

/** One-time additions preserve saved edits and respect later merchant deletion. */
export function migratePantryState<T>(key: string, value: T): T {
  if (!["products", "categories"].includes(key) || !Array.isArray(value)) return value;
  const marker = `nirbhor-pickles-v1-${key}`;
  if (localStorage.getItem(marker)) return value;
  let next: unknown = value;
  if (key === "products") {
    const products = value as Product[];
    next = [...products, ...pickleProducts.filter(p => !products.some(item => item.id === p.id))];
  } else {
    const categories = value as Category[];
    next = categories.some(c => c.id === pickleCategory.id || (c.parent === pickleCategory.parent && c.name === pickleCategory.name)) ? categories : [...categories, pickleCategory];
  }
  // Persist together before marking complete, including when the user reloads immediately.
  localStorage.setItem("nirbhor-v1-" + key, JSON.stringify(next));
  localStorage.setItem(marker, "done");
  return next as T;
}
