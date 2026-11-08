"use client";
import {imageVariants} from "@/lib/image-variants";
import {useId,useRef,useState} from 'react';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import {Link} from '@/lib/navigation';
import {useStore} from '@/providers/store-provider';
import {categoryForDepartment,departments,departmentShopHref,experienceForDepartment,productHref} from '@/lib/departments';
import {worldThemes} from '@/lib/design-system';
import {bn,bnNode} from '@/lib/bn';
import {money} from '@/data/catalog';
import {useAmbientMotion} from '@/hooks/useAmbientMotion';

export default function WorldEditorial({slug,compact=false}:{slug:string;compact?:boolean}){
 const s=useStore(),d=departments.find(d=>d.slug===slug)!,category=categoryForDepartment(d,s.categories),exp=experienceForDepartment(d,s.categories),theme=worldThemes[slug]||worldThemes.main;
 const [choice,setChoice]=useState(''),scene=useRef<HTMLElement>(null),moving=useAmbientMotion(scene);
 const items=s.products.filter(p=>p.category===category?.name&&p.status==='Published'),selected=items.find(p=>p.id===choice)||items[0];
 if(!category?.active||!exp.enabled||!selected)return null;
 const selectsProduct=theme.layout!=='origin';
 const storyTitle=bn(exp.storyTitle)!==bn(d.experience.storyTitle)?exp.storyTitle:theme.title;
 const storyText=bn(exp.storyText)!==bn(d.experience.storyText)?exp.storyText:theme.description;
 return <section ref={scene} className={`world-editorial world-${slug} world-layout-${theme.layout} ${compact?'world-compact':''}`} data-ambient={moving?'playing':'paused'} aria-label={bnNode(d.name)+' কালেকশন পরিচিতি'}>
  <div className="world-editorial-media" data-depth="collection" data-depth-max="12"><img key={selectsProduct?selected.id:exp.heroImage} {...imageVariants(selectsProduct?selected.image:exp.heroImage,'(max-width:700px) 100vw, 50vw')} src={selectsProduct?selected.image:exp.heroImage} alt={selectsProduct?bnNode(selected.name):bnNode(d.storyCaption||d.tagline)} loading="lazy" decoding="async"/></div>
  <div className="world-editorial-copy"><span className="world-eyebrow">{theme.label}</span><h2>{bnNode(storyTitle)}</h2><p>{bnNode(storyText)}</p>
   {selectsProduct?<><div className="world-product-picker" role="group" aria-label="পণ্যের ছবি বেছে নিন">{items.slice(0,4).map(p=><button key={p.id} aria-pressed={p.id===selected.id} onClick={()=>setChoice(p.id)} aria-label={bnNode(p.name)+' দেখুন'}><img {...imageVariants(p.image,'100px')} src={p.image} alt="" loading="lazy"/><span>{bnNode(p.name)}</span></button>)}</div><div className="world-featured-product"><span><small>{bnNode(selected.subcategory)}</small><h3>{bnNode(selected.name)}</h3></span><b>{bnNode(money(selected.price))}</b></div><Link className="world-action" to={productHref(selected,s.categories)}>পণ্যটি কাছ থেকে দেখুন<ArrowUpRight size={17}/></Link></>:
    <><div className="world-curated-links">{items.slice(0,3).map(p=><Link key={p.id} to={productHref(p,s.categories)}><img {...imageVariants(p.image,'100px')} src={p.image} alt="" loading="lazy"/><span>{bnNode(p.name)}<small>{bnNode(p.weight)} · {bnNode(money(p.price))}</small></span><ArrowUpRight size={15}/></Link>)}</div><Link className="world-action" to={departmentShopHref(d)}>কালেকশন দেখুন<ArrowRight size={17}/></Link></>}
  </div>
 </section>;
}

export function DepartmentGallery(){
 const s=useStore(),visible=departments.filter(d=>{const category=categoryForDepartment(d,s.categories);return category?.active&&experienceForDepartment(d,s.categories).enabled&&s.products.some(p=>p.category===category.name&&p.status==='Published');}),[chosen,setChosen]=useState('tech'),id=useId(),selected=visible.find(d=>d.slug===chosen)||visible[0];
 if(!selected)return null;
 return <section className="container department-gallery" aria-labelledby={id+'-title'}><div className="design-section-heading"><div><span className="world-eyebrow">এক নির্ভর, অনেক পছন্দ</span><h2 id={id+'-title'}>আপনার পছন্দের জগতে।</h2></div><Link to="/categories">সব ক্যাটাগরি<ArrowUpRight size={17}/></Link></div>
  <div role="tablist" className="world-tabs" aria-label="ক্যাটাগরির জগৎ" onKeyDown={e=>{const i=visible.findIndex(d=>d.slug===selected.slug);let n=i;if(e.key==='ArrowRight')n=(i+1)%visible.length;else if(e.key==='ArrowLeft')n=(i-1+visible.length)%visible.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=visible.length-1;else return;e.preventDefault();setChosen(visible[n].slug);document.getElementById(id+'-'+visible[n].slug)?.focus();}}>{visible.map(d=><button role="tab" type="button" id={id+'-'+d.slug} key={d.slug} tabIndex={selected.slug===d.slug?0:-1} aria-selected={selected.slug===d.slug} aria-controls={id+'-panel'} onClick={()=>setChosen(d.slug)}>{bnNode(d.name==='Home'?'Home & living':d.name)}</button>)}</div>
  <div id={id+'-panel'} role="tabpanel" aria-labelledby={id+'-'+selected.slug}><WorldEditorial key={selected.slug} slug={selected.slug} compact/></div>
 </section>;
}
