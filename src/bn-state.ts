import type { Banner, Category, Product, Settings } from "./data";
import { bn } from "./bn";
import { bnCopy } from "./bn-copy";

const known = (value: string) => {
  const lines = value.split("\n");
  if (lines.length > 1 && lines.every(line => Object.hasOwn(bnCopy, line.trim()))) return lines.map(bn).join("\n");
  return Object.hasOwn(bnCopy, value.replace(/\s+/g, " ").trim()) ? bn(value) : value;
};
const upgradedImage = (url: string) => /^\/assets\/(brand|organic|beauty|fashion|home)-world-v3\.webp$/.test(url) ? url.replace("-v3.webp", "-v4.webp") : url;

export function migrateBengaliState<T>(key: string, value: T): T {
  const marker = `nirbhor-bengali-v4-${key}`;
  if (localStorage.getItem(marker)) return value;
  let next: unknown = value;
  if (key === "products" && Array.isArray(value)) next = (value as Product[]).map(p => ({
    ...p, name: known(p.name),
    description: p.description.startsWith("Thoughtfully selected ") && p.description.includes("nothing unnecessary")
      ? `${bn(p.name)}। ${p.category === "Organic Food" ? "উৎস ও উপাদানের তথ্য দেখে আপনার প্রয়োজন অনুযায়ী বেছে নিন। যত্নে প্যাকিং করে পাঠানো হয়।" : "পণ্যের পরিমাণ, উপাদান ও ব্যবহারবিধি দেখে বেছে নিন।"}` : known(p.description),
    image: upgradedImage(p.image), images: p.images.map(upgradedImage),
  }));
  if (key === "categories" && Array.isArray(value)) next = (value as Category[]).map(c => ({ ...c, description: known(c.description), image: upgradedImage(c.image), experience: c.experience ? { ...c.experience, heroImage: upgradedImage(c.experience.heroImage), heroTitle: known(c.experience.heroTitle), description: known(c.experience.description), announcement: known(c.experience.announcement), storyTitle: known(c.experience.storyTitle), storyText: known(c.experience.storyText) } : c.experience }));
  if (key === "banners" && Array.isArray(value)) {
    const list = (value as Banner[]).map(b => ({ ...b, image: upgradedImage(b.image), title: known(b.title), subtitle: known(b.subtitle), cta: known(b.cta) }));
    const nextOrder = Math.max(-1, ...list.map(b => b.order)) + 1;
    next = [...list, ...[
      { id: "organic-v4", title: "প্রকৃতির ভালোবাসা।\nআপনার প্রতিদিনে।", subtitle: "মধু, বাদাম, খেজুর ও নিত্যদিনের অর্গানিক খাবার।", cta: "অর্গানিক পণ্য দেখুন", link: "/organic", image: "/assets/organic-world-v4.webp" },
      { id: "home-v4", title: "ঘর সাজুক\nভালো লাগায়।", subtitle: "সিরামিক, লিনেন ও প্রয়োজনীয় জিনিসে নিজের মতো ঘর।", cta: "ঘরের পণ্য দেখুন", link: "/home-living", image: "/assets/home-world-v4.webp" },
    ].filter(b => !list.some(x => x.id === b.id || x.link === b.link)).map((b, i) => ({ ...b, active: true, order: nextOrder + i, start: "", end: "" }))];
  }
  if (key === "settings") {
    const settings = value as Settings;
    next = { ...settings, tagline: known(settings.tagline), seoTitle: known(settings.seoTitle), seoDescription: known(settings.seoDescription) };
  }
  if ((key === "reviews" || key === "campaigns") && Array.isArray(value)) next = value.map(item => Object.fromEntries(Object.entries(item).map(([field, content]) => [field, ["name", "title", "text", "body", "reply", "headline", "bar", "discountLabel"].includes(field) && typeof content === "string" ? known(content) : content])));
  if (key === "content" && value && typeof value === "object") next = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, typeof v === "string" ? known(v) : v]));
  localStorage.setItem(marker, "done");
  return next as T;
}
