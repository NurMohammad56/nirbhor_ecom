import type { Category } from "@/data/catalog";

/** Upgrade only the rejected studio's defaults; retain merchant copy, photos and colors. */
export function migrateSneakerStudio<T>(key: string, value: T): T {
  if (key !== "categories" || !Array.isArray(value)) return value;
  const palettePending = !localStorage.getItem("nirbhor-sneaker-campaign-v2"), staticPending = !localStorage.getItem("nirbhor-sneaker-static-v3");
  if (!palettePending && !staticPending) return value;
  const palette = { accent: [["#4b514c", "#455c20"], "#193f30"], background: [["#f0f1ed", "#edf1e5"], "#f3f0e9"], ink: [["#2d3431", "#232d1c"], "#20382b"] } as const;
  const next = (value as Category[]).map(category => {
    if (category.id !== "c-sneakers" || !category.experience) return category;
    const experience = { ...category.experience };
    for (const [key, [previous, replacement]] of palettePending ? Object.entries(palette) : []) {
      const field = key as keyof typeof palette;
      if ((previous as readonly string[]).includes(experience[field].toLowerCase())) experience[field] = replacement;
    }
    if (staticPending && experience.heroTitle === "নিজের\nছন্দে।") experience.heroTitle = "নিজের ছন্দে,\nনিজের স্নিকার্সে।";
    return { ...category, experience };
  });
  localStorage.setItem("nirbhor-v1-categories", JSON.stringify(next));
  localStorage.setItem("nirbhor-sneaker-campaign-v2", "done");
  localStorage.setItem("nirbhor-sneaker-static-v3", "done");
  return next as T;
}
