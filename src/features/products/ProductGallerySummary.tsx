"use client";
import {Link} from '@/lib/navigation';
import {ArrowDown,ArrowUpRight,ClipboardList,MessageCircle} from 'lucide-react';
import {bnNode} from '@/lib/bn';
import {productPageContent} from '@/lib/product-page-content';
import type {Product} from '@/data/catalog';

export default function ProductGallerySummary({product,variant}:{product:Product;variant:string}){
 const page=productPageContent(product),details=page.sections.some(s=>s.id==='details'&&s.enabled);
 const facts=[...(page.gallerySummaryShowPack?[{label:'বেছে নেওয়া প্যাক',value:variant}]:[]),...(page.gallerySummaryMode==='custom'?page.gallerySummaryFacts.filter(r=>r.label.trim()&&r.value.trim()):details?page.specifications.filter(row=>row.value.trim()&&!/weight|size|পরিমাণ|সাইজ|pack|প্যাক/i.test(row.label)).slice(0,3):[])];
 const links=page.sections.filter(s=>s.enabled&&['details','reviews','faq'].includes(s.id));
 const jump=(id:string)=>{
  const target=document.querySelector<HTMLElement>(`[data-product-section="${id}"]`);if(!target)return;
  const heading=target.querySelector<HTMLElement>('h2')||target;heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});
  const offset=Math.max(0,document.querySelector('.brand-site-header')?.getBoundingClientRect().bottom||0);
  window.scrollTo({top:Math.max(0,window.scrollY+target.getBoundingClientRect().top-offset-20),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 };
 if(!page.showGallerySummary)return null;
 return <section className="product-gallery-summary" aria-label="পণ্য এক নজরে"><div className="gallery-summary-heading"><span><ClipboardList size={19}/></span><div><small>{bnNode(product.subcategory||product.category)}</small><h2>{bnNode(page.gallerySummaryTitle)}</h2></div></div>
  {page.gallerySummaryText&&<p className="gallery-summary-description">{bnNode(page.gallerySummaryText)}</p>}
  <dl>{facts.map((fact,i)=><div key={i}><dt>{bnNode(fact.label)}</dt><dd>{bnNode(fact.value)}</dd></div>)}</dl>
  {!!links.length&&page.gallerySummaryShowLinks&&<div className="gallery-summary-links">{links.map(link=><button type="button" key={link.id} onClick={()=>jump(link.id)}>{link.id==='details'?'পণ্যের বিস্তারিত':link.id==='reviews'?'ক্রেতাদের রিভিউ':'প্রশ্ন ও উত্তর'}<ArrowDown size={13}/></button>)}</div>}
  {page.gallerySummaryShowSupport&&<Link to="/contact" className="gallery-summary-support"><MessageCircle size={16}/><span>পণ্য সম্পর্কে জানতে সহায়তা নিন</span><ArrowUpRight size={14}/></Link>}
 </section>;
}
