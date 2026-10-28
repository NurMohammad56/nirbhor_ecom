import type { Product } from "./data";
import type { ComboOffer } from "./promotions";
import type { ComboPurpose } from "./combo-purpose";

const spice = (id: string, name: string, price: number, image: string, description: string): Product => ({
  id, name, category: "Organic Food", subcategory: "Spices & Oils", price, oldPrice: 0, image, images: [image], stock: 30,
  rating: 0, reviews: 0, badge: "নমুনা পণ্য", weight: "200g", source: "নমুনা সংগ্রহ", brand: "নির্ভর", status: "Published",
  sku: `NBR-${id.toUpperCase()}-200`, type: "রান্নার মসলা", dietary: "", color: "Natural", created: Number(id.slice(1)), campaign: false,
  description, tags: "মসলা, spice, রান্না, kitchen",
  details: { "পণ্যের ধরন": "নমুনা মসলা", "পরিমাণ": "২০০ গ্রাম", "সংরক্ষণ": "শুকনো চামচ ব্যবহার করুন। প্যাকেটের নির্দেশনা মেনে রাখুন।" },
  variants: [{ label: "200g", price, stock: 30, sku: `NBR-${id.toUpperCase()}-200`, image }],
  page: { kicker: "রান্নাঘরের প্রতিদিনের সঙ্গী", shortDescription: description, showProof: false, ingredients: "এটি ক্যাটালগের নমুনা পণ্য। চূড়ান্ত উপাদান ও উৎসের তথ্য বিক্রির আগে নিশ্চিত করতে হবে।" },
});
export const dailyProducts: Product[] = [
  spice("p25", "জিরা গুঁড়া", 320, "/assets/spice-cumin-v1.webp", "ডাল, সবজি কিংবা পছন্দের ঝোল - নিজের রেসিপির মসলা রাখুন হাতের কাছে। পরিমাণ ও পণ্যের তথ্য দেখে বেছে নিন।"),
  spice("p26", "ধনে গুঁড়া", 190, "/assets/spice-coriander-v1.webp", "পরিচিত রান্নার ছোট্ট প্রস্তুতিতে ধনে গুঁড়া রাখুন হাতের কাছে। নিজের রেসিপি অনুযায়ী ব্যবহার করুন।"),
  spice("p27", "মরিচ গুঁড়া", 240, "/assets/spice-chilli-v1.webp", "ঝালের পছন্দ সবার আলাদা। আপনার রেসিপিতে নিজের স্বাদ অনুযায়ী মসলা মেলান; প্যাকের পরিমাণ দেখে বেছে নিন।"),
];
function combo(id: string, name: string, purpose: ComboPurpose, description: string, items: [string, string][], percent: number, headline: string, featured = false): ComboOffer {
  return { id, name, purpose, description, items: items.map(([productId, variant]) => ({ productId, variant, quantity: 1 })), type: "Percentage", value: percent,
    active: true, featured, freeShipping: false, allowCoupon: false, limitPerOrder: 5, start: "", end: "",
    landing: { headline, introduction: description, story: "একই আয়োজনে কাজে লাগে এমন পণ্যগুলো একসঙ্গে বেছে নিন। নিচে প্রতিটি আইটেমের নাম, প্যাকের পরিমাণ আর আলাদা ও কম্বোর দামের হিসাব দেওয়া আছে। নিজের প্রয়োজনের সঙ্গে মিলিয়েই সিদ্ধান্ত নিন।" } };
}
export const dailyCombos: ComboOffer[] = [
  combo("combo-spices", "রান্নার চার মসলা", "kitchen", "হলুদ, জিরা, ধনে ও মরিচের গুঁড়া - প্রতিটি ২০০ গ্রামের প্যাকে রান্নার প্রস্তুতি একসঙ্গে।", [["p16", "200g"], ["p25", "200g"], ["p26", "200g"], ["p27", "200g"]], 10, "পরিচিত রান্নার শুরু,\nচার মসলার আয়োজনে।", true),
  combo("combo-table", "টেবিলের ছোট্ট সাজ", "home", "একটি স্টোনওয়্যার বাটি ও দুইটি লিনেন ন্যাপকিনের সেট - প্রতিদিনের টেবিলে নিজের পছন্দের ছোঁয়া।", [["p10", "1 piece"], ["p11", "Set of 2"]], 10, "প্রতিদিনের টেবিলেও,\nনিজের পছন্দের ছোঁয়া।", true),
  combo("combo-daily-care", "নিজের যত্নের সময়", "care", "৩০ মি.লি. ফেস অয়েল ও ১০০ গ্রামের অলিভ সাবান। উপাদান ও ব্যবহারবিধি দেখে নিজের যত্নের জন্য বেছে নিন।", [["p13", "30ml"], ["p14", "100g"]], 8, "ব্যস্ত দিনের মাঝেও,\nনিজের জন্য একটু সময়।", true),
  combo("combo-cooking", "ঘি-মসলার আয়োজন", "kitchen", "৫০০ মি.লি. ঘি, ২০০ গ্রাম হলুদের গুঁড়া ও ২০০ গ্রাম জিরা গুঁড়া - পছন্দের রান্নার তিন সঙ্গী।", [["p5", "500ml"], ["p16", "200g"], ["p25", "200g"]], 8, "নিজের হাতের রান্নায়,\nপছন্দের তিন সঙ্গী।", true),
  combo("combo-snack", "বিরতির তিন সঙ্গী", "snacks", "২৫০ গ্রাম মিক্সড নাটস, ৫০০ গ্রাম খেজুর ও ৩৫০ গ্রাম গ্রানোলা - নাশতার টেবিলে ভাগ করে নেওয়ার আয়োজন।", [["p2", "250g"], ["p3", "500g"], ["p7", "350g"]], 10, "কাজের ফাঁকে, আড্ডার মাঝে,\nএকটু নিজের মতো বিরতি।"),
  combo("combo-pickles", "তিন স্বাদের আচার", "pickles", "আম, জলপাই ও মিক্সড আচার - প্রতিটি ২৫০ গ্রামের জারে টক-ঝালের তিন রকম পছন্দ।", [["p22", "250g"], ["p23", "250g"], ["p24", "250g"]], 12, "এক টেবিলে,\nটক-ঝালের তিন পছন্দ।"),
  combo("combo-tea-break", "চায়ের বিরতির সঙ্গী", "snacks", "১২ স্যাশের হারবাল চা ও ৩৫০ গ্রাম গ্রানোলা - নিজের মতো করে একটি ছোট্ট বিরতি সাজান।", [["p4", "12 sachets"], ["p7", "350g"]], 8, "এক কাপ সময়,\nএকটু নিজের মতো বিরতি।"),
];
export function migrateDailyState<T>(key: string, value: T): T {
  if (!["products", "combos"].includes(key) || !Array.isArray(value)) return value;
  const marker = `nirbhor-daily-v1-${key}`;
  if (localStorage.getItem(marker)) return value;
  const list = value as { id: string }[], additions = key === "products" ? dailyProducts : dailyCombos;
  const next = [...list, ...additions.filter(item => !list.some(old => old.id === item.id))];
  localStorage.setItem("nirbhor-v1-" + key, JSON.stringify(next)); localStorage.setItem(marker, "done");
  return next as T;
}
