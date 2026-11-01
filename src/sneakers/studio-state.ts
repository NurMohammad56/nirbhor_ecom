import type { Category } from "../data";

/** Replace the old palette only, retaining merchant copy, photos and custom colors. */
export function migrateSneakerStudio<T>(key: string, value: T): T {
  if (key !== "categories" || !Array.isArray(value) || localStorage.getItem("nirbhor-sneaker-studio-v1")) return value;
  const palette = { accent: ["#4b514c", "#455c20"], background: ["#f0f1ed", "#edf1e5"], ink: ["#2d3431", "#232d1c"] } as const;
  const next = (value as Category[]).map(category => {
    if (category.id !== "c-sneakers" || !category.experience) return category;
    const experience = { ...category.experience };
    for (const [key, [previous, replacement]] of Object.entries(palette)) {
      const field = key as keyof typeof palette;
      if (experience[field].toLowerCase() === previous) experience[field] = replacement;
    }
    return { ...category, experience };
  });
  localStorage.setItem("nirbhor-v1-categories", JSON.stringify(next));
  localStorage.setItem("nirbhor-sneaker-studio-v1", "done");
  return next as T;
}
