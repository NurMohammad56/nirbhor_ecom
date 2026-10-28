import type { Category } from "./data";
import { departments } from "./departments";
export const builtInNames = { categories: "ক্যাটাগরি", bestsellers: "জনপ্রিয় পণ্য", products: "সব পণ্য", combos: "কম্বো অফার", reviews: "ক্রেতাদের মতামত", story: "ক্যাটাগরির গল্প", faq: "প্রশ্ন ও উত্তর", explore: "অন্যান্য ক্যাটাগরি" };
export type BuiltInSectionId = keyof typeof builtInNames;
export type CategorySection = { id: string; kind: "builtin" | "collection"; enabled: boolean; title?: string; kicker?: string; description?: string; productIds?: string[]; href?: string; linkLabel?: string; layout?: "slider" | "grid" };
export function categorySections(category: Category): CategorySection[] {
  const keys = departments.some(d => d.categoryId === category.id) ? Object.keys(builtInNames) : ["bestsellers", "products"];
  const saved = category.landingSections || keys.map(id => ({ id, kind: "builtin" as const, enabled: true }));
  const ids = new Set<string>();
  return [...saved.filter(block => { if (ids.has(block.id) || (block.kind === "builtin" && !keys.includes(block.id))) return false; ids.add(block.id); return true; }), ...keys.filter(id => !ids.has(id)).map(id => ({ id, kind: "builtin" as const, enabled: true }))];
}
export function safeSectionLink(value: string) {
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") && !/[\u0000-\u0020]/.test(value)) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}
