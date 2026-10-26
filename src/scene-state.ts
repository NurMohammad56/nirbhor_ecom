import type { Banner, Category, Product } from "./data";

// Only replace the supplied demo assets. Uploaded/custom catalogue images survive.
const replacements: Record<string, string> = {
  "/assets/brand-hero-v2.webp": "/assets/brand-world-v3.webp",
  "/assets/brand-story-v2.webp": "/assets/brand-story-v3.webp",
  "/assets/hero.webp": "/assets/organic-world-v3.webp",
  "/assets/beauty-hero-v2.webp": "/assets/beauty-world-v3.webp",
  "/assets/beauty-serum-v2.webp": "/assets/serum-float-v3.webp",
  "/assets/soap.webp": "/assets/soap-unbranded-v3.webp",
  "/assets/fashion-hero-v2.webp": "/assets/fashion-world-v3.webp",
  "/assets/fashion-kurta-v2.webp": "/assets/kurta-unbranded-v3.webp",
  "/assets/fashion-overshirt-v2.webp": "/assets/overshirt-unbranded-v3.webp",
  "/assets/fashion-tote-v2.webp": "/assets/tote-unbranded-v3.webp",
  "/assets/home-hero-v2.webp": "/assets/home-world-v3.webp",
};
const image = (value: string) => replacements[value] || value;

export function migrateSceneState<T>(key: string, value: T): T {
  const marker = `nirbhor-scenes-v3-${key}`;
  if (localStorage.getItem(marker)) return value;
  let next: unknown = value;
  if (key === "products" && Array.isArray(value)) {
    next = (value as Product[]).map(p => {
      const imported = p.category === "Beauty & Care" || p.category === "Clothing & Style";
      return {
        ...p,
        image: image(p.image),
        images: p.images.map(image),
        variants: p.variants?.map(v => ({ ...v, image: v.image ? image(v.image) : v.image })),
        brand: imported && p.brand.toLowerCase() === "nirbhor" ? "Imported collection" : p.brand,
        source: imported && ["Brand collection", "Bangladesh"].includes(p.source) ? "Imported collection" : p.source,
      };
    });
  }
  if (key === "categories" && Array.isArray(value)) {
    next = (value as Category[]).map(c => ({ ...c, image: image(c.image), experience: c.experience ? { ...c.experience, heroImage: image(c.experience.heroImage) } : c.experience }));
  }
  if (key === "banners" && Array.isArray(value)) {
    next = (value as Banner[]).map(b => ({ ...b, image: image(b.image), subtitle: b.subtitle.replace("from Nirbhor Beauty", "curated by Nirbhor") }));
  }
  localStorage.setItem(marker, "done");
  return next as T;
}
