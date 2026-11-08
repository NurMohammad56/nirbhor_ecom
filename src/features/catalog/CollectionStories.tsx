"use client";
import {imageVariants} from "@/lib/image-variants";
import { Link } from "@/lib/navigation";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "@/providers/store-provider";
import { departments,categoryForDepartment,experienceForDepartment } from "@/lib/departments";
import { bnNode } from "@/lib/bn";

const titles:Record<string,string>={fashion:"প্রতিদিনের পোশাকে,\nনিজের ছাপ।",tech:"আপনার সেটআপ,\nআপনার মতো।","home-living":"ঘর সাজুক\nভালো লাগায়।"};
export default function CollectionStories(){
  const {categories,products}=useStore();
  const active=departments.filter(d=>{const category=categoryForDepartment(d,categories);return category?.active&&experienceForDepartment(d,categories).enabled&&products.some(p=>p.category===category.name&&p.status==="Published");});
  const ordered=[...['fashion','tech','home-living'].map(slug=>active.find(d=>d.slug===slug)),...active].filter((d):d is NonNullable<typeof d>=>!!d);
  const items=ordered.filter((d,i)=>ordered.findIndex(item=>item.slug===d.slug)===i).slice(0,3);
  if(!items.length)return null;
  return <section className="container brand-section collection-stories" aria-label="পছন্দের কালেকশন">
    <div className="brand-section-heading"><div><span className="section-kicker">জীবনের প্রতিটি কোণে</span><h2>পছন্দ হোক নিজের মতো।</h2></div><Link className="brand-underlined" to="/categories">সব কালেকশন<ArrowUpRight size={16}/></Link></div>
    <div className="collection-story-grid" data-count={items.length}>{items.map(d=>{
      const exp=experienceForDepartment(d,categories);
      return <Link className={`collection-story collection-story-${d.slug}`} to={'/'+d.slug} key={d.slug} data-depth="collection" data-depth-max="18">
        <div className="collection-story-media" aria-hidden="true"><img {...imageVariants(exp.heroImage,'(max-width:700px) 100vw, 50vw')} src={exp.heroImage} alt="" loading="lazy" decoding="async"/></div>
        <div className="collection-story-copy"><span>{bnNode(d.name==='Home'?'Home & living':d.name)}</span><h3>{(titles[d.slug]||exp.heroTitle).split('\n').map((line,index)=><span key={index}>{bnNode(line)}</span>)}</h3><span className="collection-story-action">কালেকশন দেখুন<ArrowUpRight size={18}/></span></div>
      </Link>;
    })}</div>
  </section>;
}
