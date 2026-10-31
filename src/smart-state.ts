import type { Banner, Category, Product } from "./data";
import { smartDepartment } from "./smart-department";

type SmartSeed = { key: string; name: string; english: string; group: number; price: number; description: string; pack?: string };
const seeds: SmartSeed[] = [
  { key: "lint-remover", name: "রিচার্জেবল ফ্যাব্রিক লিন্ট রিমুভার", english: "Rechargeable Fabric Lint Remover", group: 4, price: 1490, description: "প্রিয় সোয়েটার বা কাপড়ের যত্নে ছোট্ট একটি সঙ্গী। কাপড়ের ধরন ও ব্যবহারবিধি মিলিয়ে লিন্ট রিমুভার বেছে নিন।" },
  { key: "heated-lunch-box", name: "ইলেকট্রিক হিটেড লাঞ্চ বক্স", english: "Electric Heated Lunch Box", group: 1, price: 2890, description: "ব্যস্ত দিনের খাবারের আয়োজনেও নিজের পছন্দ থাকুক। গরম করার সুবিধাসহ লাঞ্চ বক্সের মাপ ও পাওয়ারের তথ্য দেখে নিন।" },
  { key: "spin-scrubber", name: "কর্ডলেস ইলেকট্রিক স্পিন স্ক্রাবার", english: "Cordless Electric Spin Scrubber", group: 0, price: 3290, description: "ঘরের কোণা, টাইলস কিংবা পরিষ্কারের ছোট্ট প্রস্তুতি - উপযুক্ত ব্রাশ ও ব্যবহারের জায়গা মিলিয়ে নিজের সহায়কটি খুঁজে নিন।" },
  { key: "sensor-lights", name: "রিচার্জেবল মোশন সেন্সর এলইডি লাইট", english: "Rechargeable Motion Sensor LED Lights", group: 2, price: 1290, pack: "২টির সেট", description: "শেলফের নিচে কিংবা আলমারির পাশে প্রয়োজনের আলো। কোথায় বসাবেন, সেটি ভেবেই সেন্সর লাইটের মাপ ও মোড দেখে নিন।" },
  { key: "soap-dispenser", name: "অটোমেটিক টাচলেস সোপ ডিসপেন্সার", english: "Automatic Touchless Soap Dispenser", group: 3, price: 1790, description: "বেসিনের পাশে পরিচ্ছন্ন ও পরিপাটি আয়োজন। টাচলেস ডিসপেন্সার বেছে নেওয়ার আগে কোন ধরনের সাবান ব্যবহার করা যায়, দেখে নিন।" },
  { key: "toothpaste-set", name: "অটোমেটিক টুথপেস্ট ডিসপেন্সার সেট", english: "Automatic Toothpaste Dispenser Set", group: 3, price: 890, pack: "১ সেট", description: "ব্রাশ আর টুথপেস্ট এক জায়গায়, সকালের প্রস্তুতিও একটু গুছিয়ে। দেয়ালে বসানোর জায়গা ও টিউবের ফিটমেন্ট মিলিয়ে নিন।" },
  { key: "desktop-vacuum", name: "মিনি ডেস্কটপ ভ্যাকুয়াম ক্লিনার", english: "Mini Desktop Vacuum Cleaner", group: 0, price: 1190, description: "কাজের টেবিলটাও থাকুক নিজের মতো পরিপাটি। ডেস্ক ও কিবোর্ডের আশপাশের ছোটখাটো পরিষ্কারের জন্য কমপ্যাক্ট একটি সহায়ক।" },
  { key: "ultrasonic-cleaner", name: "আল্ট্রাসনিক ক্লিনিং মেশিন", english: "Ultrasonic Cleaning Machine", group: 0, price: 3490, description: "ছোট জিনিসের যত্নে আলাদা একটি আয়োজন। কোন উপকরণ পরিষ্কার করা যায়, তা নির্মাতার নির্দেশনা দেখে নিশ্চিত হয়ে ব্যবহার করুন।" },
  { key: "heat-sealer", name: "কাটারসহ মিনি হিট সিলার", english: "Mini Heat Sealer with Cutter", group: 1, price: 590, description: "রান্নাঘরের ছোট প্যাকেট গুছিয়ে রাখার সহায়ক। কোন ধরনের প্যাকেটে ব্যবহার করা যায় এবং কাটার কীভাবে চলে, আগে জেনে নিন।" },
  { key: "water-dispenser", name: "স্মার্ট অটোমেটিক ওয়াটার ডিসপেন্সার", english: "Smart Automatic Water Dispenser", group: 1, price: 890, description: "জগ বা বোতলের পাশে পানি নেওয়ার সহজ আয়োজন। আপনার বোতলের মুখ ও ডিসপেন্সারের ফিটমেন্ট মিলিয়েই পছন্দ করুন।" },
  { key: "mug-warmer", name: "স্মার্ট ইলেকট্রিক মগ ওয়ার্মার", english: "Smart Electric Mug Warmer", group: 1, price: 1290, description: "কাজের টেবিলে প্রিয় মগের জন্য একটি জায়গা। মগের উপাদান, তলার ধরন ও পাওয়ারের নির্দেশনা দেখে ওয়ার্মার বেছে নিন।" },
  { key: "dish-dispenser", name: "অটোমেটিক ডিশওয়াশিং লিকুইড ডিসপেন্সার", english: "Automatic Dishwashing Liquid Dispenser", group: 1, price: 1890, description: "সিঙ্কের পাশে লিকুইড আর স্পঞ্জ এক জায়গায়। রান্নাঘরের জায়গা ও উপযুক্ত লিকুইডের ধরন মিলিয়ে সাজান নিজের ওয়াশিং কর্নার।" },
];
export const smartProducts: Product[] = seeds.map((s, i) => {
  const id = `smart-${s.key}`, image = `/assets/smart-life-${s.key}-v1.webp`, pack = s.pack || "১টি";
  return {
    id, name: s.name, category: "Smart Life", subcategory: smartDepartment.subcategories[s.group],
    price: s.price, oldPrice: 0, image, images: [image], stock: 20, rating: 0, reviews: 0,
    badge: "নমুনা পণ্য", weight: pack, source: "Imported collection", brand: "Imported collection",
    status: "Published", sku: `DEMO-SMART-${s.key.toUpperCase()}`, type: "দৈনন্দিন সহায়ক", dietary: "", color: "ছবির নমুনা", created: 28 + i, campaign: false,
    description: s.description, tags: `${s.english}, smart, gadget, trending, smart life, দৈনন্দিন, স্মার্ট`,
    variants: [{ label: pack, price: s.price, stock: 20, sku: `DEMO-SMART-${s.key.toUpperCase()}`, image }],
    details: { "ক্যাটালগ": "নমুনা পণ্য ও নমুনা মূল্য", "প্যাক": pack, "মডেলের তথ্য": "মাপ, পাওয়ার, চার্জিং ও অন্তর্ভুক্ত সরঞ্জামের জন্য চূড়ান্ত মডেলের তথ্য দেখুন।" },
    page: {
      kicker: "প্রতিদিনের স্মার্ট সহায়ক", shortDescription: s.description, showProof: false,
      detailsTitle: "আপনার কাজে কীভাবে মানায়", detailsBody: s.description,
      materialsTitle: "মডেল ও ব্যবহারের তথ্য", materialsBody: "ছবিটি পণ্যের ধারণা বোঝানোর নমুনা। মাপ, উপাদান, পাওয়ার ও প্যাকের সরঞ্জাম চূড়ান্ত মডেল অনুযায়ী দেখুন।",
      storage: "চার্জিং, পরিষ্কার ও সংরক্ষণের ক্ষেত্রে নির্মাতার ব্যবহারবিধি মেনে চলুন।", ingredients: "", batch: "",
      faqTitle: "বেছে নেওয়ার আগে",
      faqs: [
        { question: "মডেলের বিস্তারিত কোথায় পাব?", answer: "পণ্যের বিস্তারিত অংশে মাপ, পাওয়ার এবং প্যাকের তথ্য দেখুন। প্রয়োজনীয় কোনো তথ্য না থাকলে অর্ডারের আগে আমাদের সঙ্গে যোগাযোগ করুন।" },
        { question: "ওয়ারেন্টি ও রিটার্নের তথ্য কীভাবে জানব?", answer: "নির্বাচিত মডেলের ওয়ারেন্টি ও রিটার্নের শর্ত দেখে নিন। নিশ্চিত তথ্য ছাড়া কোনো নির্দিষ্ট মেয়াদ ধরে নেবেন না।" },
      ],
      sections: [{ id: "details", enabled: true }, { id: "benefits", enabled: false }, { id: "source", enabled: false }, { id: "faq", enabled: true }, { id: "reviews", enabled: true }, { id: "bundle", enabled: false }, { id: "related", enabled: true }],
    },
  };
});
export const smartCategories: Category[] = [
  { id: smartDepartment.categoryId, name: "Smart Life", parent: "", description: smartDepartment.tagline, active: true, image: smartDepartment.image, sort: 4, departmentSlug: smartDepartment.slug, experience: { ...smartDepartment.experience } },
  ...smartDepartment.subcategories.map((name, index) => ({ id: `c-smart-life-${index}`, name, parent: "Smart Life", description: "প্রয়োজনের সঙ্গে মিলিয়ে আপনার সহায়কটি খুঁজুন।", active: true, image: smartProducts.find(p => p.subcategory === name)!.image, sort: index })),
];
export const smartBanner: Banner = { id: "smart-life-v1", title: "ছোট্ট উদ্ভাবনে,\nপ্রতিদিন একটু সহজ।", subtitle: smartDepartment.experience.description, cta: "স্মার্ট লাইফ দেখুন", link: "/smart-life", active: true, image: smartDepartment.image, order: 5, start: "", end: "" };

/** Append once; preserve merchant edits, uploads and subsequent removals. */
export function migrateSmartState<T>(key: string, value: T): T {
  if (!["products", "categories", "banners"].includes(key) || !Array.isArray(value)) return value;
  const marker = `nirbhor-smart-life-v1-${key}`;
  if (localStorage.getItem(marker)) return value;
  const list = value as { id: string; name?: string; parent?: string; departmentSlug?: string; order?: number }[];
  const parentExists = key === "categories" && list.some(c => c.id === smartDepartment.categoryId || c.departmentSlug === smartDepartment.slug || (c.name === "Smart Life" && !c.parent));
  const additions = key === "products" ? smartProducts : key === "categories" ? smartCategories.filter(c => c.parent || !parentExists) : [{ ...smartBanner, order: Math.max(-1, ...list.map(b => b.order || 0)) + 1 }];
  const next = [...list, ...additions.filter(item => !list.some(old => old.id === item.id || (key === "categories" && old.name === (item as Category).name && old.parent === (item as Category).parent)))];
  localStorage.setItem(`nirbhor-v1-${key}`, JSON.stringify(next));
  localStorage.setItem(marker, "done");
  return next as T;
}
