"use client";
import {useRef} from 'react';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
import {Link} from '@/lib/navigation';
import {useStore} from '@/providers/store-provider';
import {departments,categoryForDepartment,experienceForDepartment,productHref} from '@/lib/departments';
import {useAmbientMotion} from '@/hooks/useAmbientMotion';
import {money,itemPrice} from '@/data/catalog';
import {bnNode} from '@/lib/bn';
import {fragranceNotes,matchesFragranceNote,perfumeCollectionHero} from '@/lib/fragrance-discovery';
import {productPageContent} from '@/lib/product-page-content';
import {BotanicalSprite} from '@/components/BotanicalSprite';

export function PerfumeHero(){
 const s=useStore(),d=departments.find(d=>d.slug==='perfume')!,category=categoryForDepartment(d,s.categories),exp=experienceForDepartment(d,s.categories),p=s.products.find(p=>p.id==='perfume-amber'&&p.status==='Published'&&p.category===category?.name)||s.products.find(p=>p.category===category?.name&&p.status==='Published'),ref=useRef<HTMLElement>(null),moving=useAmbientMotion(ref),custom=exp.heroImage!=='/assets/perfume-hero-v1.webp',notes=p?productPageContent(p):null;
 return <section ref={ref} className={'perfume-hero fragrance-store-hero '+(custom?'has-custom-scene':'')} data-ambient={moving?'playing':'paused'} aria-label="পারফিউম কালেকশন">
  <div className="fragrance-hero-body">
   <div className="fragrance-hero-heading"><span>পারফিউম কালেকশন</span><h1>{exp.heroTitle.split('\n').map((line,i)=><span key={i}>{line}</span>)}</h1><p>{exp.description}</p><div className="perfume-hero-actions"><Link className="perfume-primary" to="/perfume/shop">সুগন্ধ খুঁজুন<ArrowUpRight size={18}/></Link><a href="#department-collections" className="perfume-text-link">ঘ্রাণ বেছে নিন<ArrowDown size={16}/></a></div>
   {p&&<Link className="fragrance-hero-product" to={productHref(p,s.categories)}><small>{notes?.fragranceSample?'নমুনা পণ্য':p.subcategory}</small><h2>{p.name}</h2><b>{bnNode(money(itemPrice(p,p.weight)))}</b><span>বিস্তারিত দেখুন<ArrowUpRight size={15}/></span></Link>}</div>
   <div className="perfume-hero-art"><img src={custom?exp.heroImage:perfumeCollectionHero} alt={custom?'আপনার পারফিউম কালেকশন':'জলের আলোর আবহে সাতটি পারফিউম, গোলাপ, জুঁই, সিট্রাস ও শুকনো ডাল দিয়ে সাজানো কালেকশন'} width={1536} height={1024} fetchPriority="high"/><span className="fragrance-scene-light" aria-hidden="true"/></div>
  </div>
 </section>;
}

export function PerfumeFamilies(){
 const s=useStore(),d=departments.find(d=>d.slug==='perfume')!,category=categoryForDepartment(d,s.categories),children=s.categories.filter(c=>c.parent===category?.name&&c.active),availableNotes=fragranceNotes.filter(n=>s.products.some(p=>p.category===category?.name&&p.status==='Published'&&matchesFragranceNote(p,n.id)));
 return <section className="container fragrance-families" id="department-collections"><div className="fragrance-section-heading"><h2>ঘ্রাণ অনুযায়ী খুঁজুন</h2></div>
 <div className="fragrance-family-grid">{children.map((c,i)=>{const position=/ফ্লোরাল|floral/i.test(c.name)?0:/ফ্রেশ|citrus|fresh/i.test(c.name)?2:3,custom=c.image&&!/^\/assets\/perfume-(amber|rose|noir)-v1\.webp$/.test(c.image);return <Link key={c.id} to={'/perfume/shop?subcategory='+encodeURIComponent(c.name)} className="fragrance-family-card"><small>{bnNode(String(i+1).padStart(2,'0'))}</small>{custom?<img src={c.image} alt={c.name} loading="lazy"/>:<BotanicalSprite position={position} label={c.name}/>}<h3>{bnNode(c.name)}</h3><span>কালেকশন দেখুন<ArrowUpRight size={14}/></span></Link>;})}
 <div className="fragrance-ingredient-links" aria-label="নোট দিয়ে পারফিউম খুঁজুন">{availableNotes.map((n,i)=><Link className="fragrance-family-card fragrance-note-collection" key={n.id} to={'/perfume/shop?note='+n.id}><small>{bnNode(String(children.length+i+1).padStart(2,'0'))}</small><BotanicalSprite position={n.position} label={n.name}/><h3>{n.name}</h3><span>ঘ্রাণটি খুঁজুন<ArrowUpRight size={14}/></span></Link>)}</div></div></section>;
}

