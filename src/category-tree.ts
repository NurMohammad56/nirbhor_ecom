import type { Category } from "./data";
export function descendants(categories: Category[], parent: string) {
  const names = new Set<string>();
  function visit(name: string) {
    for (const c of categories.filter((c) => c.parent === name)) {
      if (names.has(c.name) || c.name === parent) continue;
      names.add(c.name);
      visit(c.name);
    }
  }
  visit(parent);
  return names;
}
