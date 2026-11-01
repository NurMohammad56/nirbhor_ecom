import type { Banner, Category, Product } from "./data";
import { styleCategories } from "./style-state";
import { techDepartment } from "./tech-department";

const previousHero="/assets/tech-hero-v1.webp";
const previousTitle="কাজে মন দিন।\nগানে হারিয়ে যান।";
const previousDescription="হেডফোন, ইয়ারবাডস আর ডেস্কের প্রয়োজনীয় অ্যাকসেসরিজ। আপনার কাজ ও অবসরের জন্য খুঁজে নিন নিজের পছন্দ।";
const watchAssignments: Record<string,{previous:string;next:string;tags:string}> = {
  "watch-midnight":{previous:"ব্রেসলেট স্টাইল",next:"পুরুষদের ঘড়ি",tags:"men, male"},
  "watch-heritage":{previous:"স্ট্র্যাপ স্টাইল",next:"পুরুষদের ঘড়ি",tags:"men, male"},
  "watch-square":{previous:"ব্রেসলেট স্টাইল",next:"নারীদের ঘড়ি",tags:"women, female"},
  "watch-rose":{previous:"মেশ স্টাইল",next:"নারীদের ঘড়ি",tags:"women, female"},
};

/** Upgrade only known defaults; keep merchant overrides and never re-add deleted products. */
export function migrateCollectionRefresh<T>(key:string,value:T):T {
  if(!["products","categories","banners"].includes(key)||!Array.isArray(value))return value;
  const marker=`nirbhor-collection-refresh-v2-${key}`;
  if(localStorage.getItem(marker))return value;
  let next:unknown[];
  if(key==="products") {
    next=(value as Product[]).map(product=>{
      const assignment=watchAssignments[product.id];
      return assignment&&product.category==="Watches"&&product.subcategory===assignment.previous
        ? {...product,subcategory:assignment.next,tags:`${product.tags}, ${assignment.previous}, ${assignment.tags}`} : product;
    });
  } else if(key==="categories") {
    const categories=value as Category[];
    const watchParent=categories.find(c=>c.id==="c-watches"||(!c.parent&&c.name==="Watches"));
    const watchName=watchParent?.name||"Watches";
    let products:Product[]=[];
    try { products=JSON.parse(localStorage.getItem("nirbhor-v1-products")||"[]"); } catch { /* Keep the catalogue usable if no product cache exists yet. */ }
    const legacy=[
      {id:"c-watches-0",name:"ব্রেসলেট স্টাইল",image:"/assets/style-watch-midnight-v1.webp"},
      {id:"c-watches-1",name:"স্ট্র্যাপ স্টাইল",image:"/assets/style-watch-heritage-v1.webp"},
      {id:"c-watches-2",name:"মেশ স্টাইল",image:"/assets/style-watch-rose-v1.webp"},
    ];
    const oldTagline="ডায়াল থেকে স্ট্র্যাপ, পছন্দের প্রতিটি খুঁটিনাটি।";
    const kept=categories.filter(category=>!legacy.some(old=>old.id===category.id&&old.name===category.name&&old.image===category.image&&category.parent===watchName&&category.description===oldTagline&&category.active&&!products.some(p=>p.category===watchName&&p.subcategory===old.name)));
    const updated=kept.map(category=>category.id!=="c-tech"?category:{...category,
      image:category.image===previousHero?techDepartment.image:category.image,
      experience:category.experience?{...category.experience,
        heroImage:category.experience.heroImage===previousHero?techDepartment.image:category.experience.heroImage,
        heroTitle:category.experience.heroTitle===previousTitle?techDepartment.experience.heroTitle:category.experience.heroTitle,
        description:category.experience.description===previousDescription?techDepartment.experience.description:category.experience.description,
      }:category.experience,
    });
    const additions=watchParent?styleCategories.filter(c=>c.parent==="Watches").map(c=>({...c,parent:watchName})):[];
    next=[...updated,...additions.filter(c=>!updated.some(old=>old.id===c.id||(old.parent===c.parent&&old.name===c.name)))];
  } else {
    next=(value as Banner[]).map(banner=>banner.id!=="tech-v1"?banner:{...banner,
      image:banner.image===previousHero?techDepartment.image:banner.image,
      title:banner.title===previousTitle?techDepartment.experience.heroTitle:banner.title,
      subtitle:banner.subtitle===previousDescription?techDepartment.experience.description:banner.subtitle,
    });
  }
  localStorage.setItem(`nirbhor-v1-${key}`,JSON.stringify(next));localStorage.setItem(marker,"done");
  return next as T;
}
