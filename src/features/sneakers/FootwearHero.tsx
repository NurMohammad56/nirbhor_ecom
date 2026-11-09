"use client";
import type {DepartmentExperience,Product} from '@/data/catalog';
import {money,itemPrice} from '@/data/catalog';
import {Link} from '@/lib/navigation';
import {useStore} from '@/providers/store-provider';
import {productHref} from '@/lib/departments';
import {bnNode} from '@/lib/bn';
import {ArrowUpRight} from 'lucide-react';
import {offerSlides,rememberOffer} from '@/lib/offer-merchandising';
const cutouts:Record<string,string>={'/assets/style-sneaker-court-v1.webp':'/assets/sneaker-campaign/court-v2.webp','/assets/style-sneaker-terra-v1.webp':'/assets/sneaker-campaign/terra-v2.webp','/assets/style-sneaker-urban-v1.webp':'/assets/sneaker-campaign/urban-v2.webp'};
const art=(p:Product)=>cutouts[p.image]||p.image;
export default function FootwearHero({experience:exp,shopHref,categoryName}:{experience:DepartmentExperience;shopHref:string;categoryName:string}){
 const s=useStore();
 const custom=exp.heroImage!=='/assets/style-sneakers-hero-v1.webp',offers=offerSlides(s,'sneakers');
 return <section className="footwear-hero footwear-showroom" aria-label="স্নিকার্স কালেকশন">
  <div className="footwear-showroom-stage">
   <div className="footwear-merchant-photo"><img src={custom?exp.heroImage:'/assets/sneakers-studio/showroom-ivory-v1.webp'} alt="সাদা আলোকিত র‍্যাকে গোছানো স্নিকার্সের কালেকশন ভিজ্যুয়াল" width={1536} height={1024} fetchPriority="high"/></div>
   <div className="footwear-headline"><span className="footwear-eyebrow">নির্ভর / স্নিকার্স</span><h1>{bnNode(exp.heroTitle)}</h1><p>{bnNode(exp.description)}</p><Link to={shopHref}>কালেকশন দেখুন<ArrowUpRight size={18}/></Link></div>
  </div>
  {offers.length>0&&<nav className="footwear-offer-strip" aria-label="স্নিকার্সের চলতি আয়োজন">{offers.map(offer=><Link key={offer.id} to={offer.link} onClick={()=>rememberOffer(offer.code)}><small>{bnNode(offer.badge)}</small><span>{bnNode(offer.title.replaceAll('\n',' '))}</span><ArrowUpRight size={17}/></Link>)}</nav>}
 </section>;
}

export function SneakerEditorial({categoryName,experience}:{categoryName:string;experience:DepartmentExperience}){const s=useStore(),items=s.products.filter(p=>p.category===categoryName&&p.status==='Published');return <section className="container footwear-editorial"><div className="footwear-editorial-heading"><span>THE EVERYDAY ROTATION</span><h2>{bnNode(experience.storyTitle)}</h2><p>{bnNode(experience.storyText)}</p></div><div className="footwear-story-grid">{[...items.filter(p=>['sneaker-terra','sneaker-urban'].includes(p.id)),...items.filter(p=>!['sneaker-terra','sneaker-urban'].includes(p.id))].slice(0,2).map((p,i)=><Link key={p.id} to={productHref(p,s.categories)} className={'footwear-story-card tone-'+i}><span>{i===0?'আলাদা সিলুয়েট।':'নিজের ছন্দ।'}</span><img src={art(p)} alt={bnNode(p.name)} loading="lazy"/><div><h3>{bnNode(p.name)}</h3><b>{bnNode(money(itemPrice(p,p.weight)))}</b><ArrowUpRight size={22}/></div></Link>)}</div></section>;}
