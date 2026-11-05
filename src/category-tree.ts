import type { Category } from "./data";
export function rootCategoryFor(categories:Category[],name:string){
  let node=categories.find(c=>c.name===name&&c.active);const visited=new Set<string>();
  while(node?.parent){if(visited.has(node.name))return undefined;visited.add(node.name);node=categories.find(c=>c.name===node!.parent&&c.active);}
  return node;
}
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
