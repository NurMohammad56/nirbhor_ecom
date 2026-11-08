"use client";
import {useId,useState} from 'react';
import {productPageContent} from '@/lib/product-page-content';
import type {Product} from '@/data/catalog';
export default function FragranceNotes({product}:{product:Product}){
 const page=productPageContent(product),[active,setActive]=useState(0),id=useId();
 if(!page.showFragrance)return null;
 const layers=[['টপ নোট','প্রথম পরিচয়',page.fragranceTopNotes,'fresh'],['হার্ট নোট','সুগন্ধের মূল চরিত্র',page.fragranceHeartNotes,'floral'],['বেস নোট','শেষের অনুভব',page.fragranceBaseNotes,'woody']];
 return <section className="fragrance-notes" aria-label="সুগন্ধের নোট"><div className="fragrance-notes-heading"><span>সুগন্ধকে একটু চিনে নিন</span><h2>এক ঘ্রাণে, তিন অধ্যায়।</h2></div><div className="scent-layer-tabs" role="tablist" aria-label="সুগন্ধের স্তর">{layers.map(([label,,notes],i)=><button key={label} type="button" id={id+'-tab-'+i} role="tab" aria-selected={active===i} aria-controls={id+'-panel'} onClick={()=>setActive(i)} disabled={!notes.trim()}>{label}</button>)}</div><div id={id+'-panel'} role="tabpanel" aria-labelledby={id+'-tab-'+active} className={'scent-layer-panel '+layers[active][3]}><div className="scent-note-photo" aria-hidden="true"/><small>{layers[active][1]}</small><h3>{layers[active][2]||'তথ্য যোগ হবে'}</h3></div><div className="fragrance-facts"><span>ঘ্রাণের ধরন<b>{page.fragranceFamily||product.subcategory}</b></span>{page.fragranceConcentration&&<span>ঘনত্ব<b>{page.fragranceConcentration}</b></span>}</div>{page.fragranceContext&&<p className="fragrance-context">{page.fragranceSample&&<b>নমুনা প্রোফাইল · </b>}{page.fragranceContext}</p>}<small className="scent-fact-note">ঘ্রাণের নোট উপাদান বা অ্যালার্জেনের সম্পূর্ণ তালিকা নয়।</small></section>;
}
