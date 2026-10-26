import type { Banner, Category, Product, Review } from "./data";

// Only supplied asset URLs are migrated. Merchant uploads and catalogue edits survive.
const replacements: Record<string, string> = {
  "/assets/honey.webp": "/assets/product-p1-v5.webp",
  "/assets/nuts.webp": "/assets/product-p2-v5.webp",
  "/assets/dates.webp": "/assets/product-p3-v5.webp",
  "/assets/tea.webp": "/assets/product-p4-v5.webp",
  "/assets/ghee.webp": "/assets/product-p5-v5.webp",
  "/assets/seeds.webp": "/assets/product-p6-v5.webp",
  "/assets/granola.webp": "/assets/product-p7-v5.webp",
  "/assets/spices.webp": "/assets/product-p16-v5.webp",
  "/assets/bundle.webp": "/assets/bundle-v5.webp",
  "/assets/linen.webp": "/assets/linen-v5.webp",
  "/assets/serum-float-v3.webp": "/assets/serum-bare-v5.webp",
};
for (const kind of ["brand", "organic", "beauty"]) {
  for (const version of [3, 4]) replacements[`/assets/${kind}-world-v${version}.webp`] = `/assets/${kind}-world-v5.webp`;
}
replacements["/assets/brand-story-v3.webp"] = "/assets/brand-story-v5.webp";
const image = (url: string) => replacements[url] || url;
const clean = (value: string) => value.replace(/[\u2013\u2014]/g, "-");
const copyFields = (value: object) => Object.fromEntries(Object.entries(value).map(([key, content]) => [key, typeof content === "string" ? clean(content) : content]));

export function migrateBrandState<T>(key: string, value: T): T {
  const marker = `nirbhor-brand-v5-${key}`;
  if (localStorage.getItem(marker)) return value;
  let next: unknown = value;
  if (key === "products" && Array.isArray(value)) next = (value as Product[]).map(product => {
    const productImage = (url: string) => {
      if (product.id === "p8" && ["/assets/honey.webp", "/assets/product-p1-v5.webp"].includes(url)) return "/assets/product-p8-v5.webp";
      if (product.id === "p9" && ["/assets/dates.webp", "/assets/product-p3-v5.webp"].includes(url)) return "/assets/product-p9-v5.webp";
      return image(url);
    };
    return { ...product, name: clean(product.name), description: clean(product.description), image: productImage(product.image), images: product.images.map(productImage), variants: product.variants?.map(variant => ({ ...variant, image: variant.image ? productImage(variant.image) : variant.image })) };
  });
  if (key === "categories" && Array.isArray(value)) next = (value as Category[]).map(category => ({ ...category, description: clean(category.description), image: image(category.image), experience: category.experience ? { ...category.experience, ...copyFields(category.experience), heroImage: image(category.experience.heroImage) } : category.experience }));
  if (key === "banners" && Array.isArray(value)) next = (value as Banner[]).map(banner => ({ ...banner, ...copyFields(banner), image: image(banner.image) }));
  if (key === "reviews" && Array.isArray(value)) next = (value as Review[]).map(review => ({ ...review, title: clean(review.title), text: clean(review.text), demo: ["r1", "r2", "r3", "r4"].includes(review.id) ? true : review.demo }));
  if (["settings", "content"].includes(key) && value && typeof value === "object") next = copyFields(value);
  if (key === "campaigns" && Array.isArray(value)) next = value.map(copyFields);
  localStorage.setItem(marker, "done");
  return next as T;
}
