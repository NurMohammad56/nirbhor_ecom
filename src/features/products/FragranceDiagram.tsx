"use client";
import type {Product} from '@/data/catalog';
import {productPageContent} from '@/lib/product-page-content';
import {fragranceArt,fragranceNotes} from '@/lib/fragrance-discovery';
export function BotanicalSprite({position,label}:{position:number;label:string}){return <span className="botanical-sprite" role="img" aria-label={label} style={{backgroundPosition:`${position*100/3}% center`}}/>;}
export default function FragranceDiagram({product,active=0,onSelect}:{product:Product;active?:number;onSelect:(index:number)=>void}){
 const page=productPageContent(product),notes=[['টপ নোট',page.fragranceTopNotes],['হার্ট নোট',page.fragranceHeartNotes],['বেস নোট',page.fragranceBaseNotes]];
 return <div className={'fragrance-map-wrap '+(product.id==='perfume-noir'?'map-noir':'')}><div className="fragrance-map"><img className="fragrance-map-bottle" src={fragranceArt(product)} alt={product.name} loading="lazy"/>{notes.map(([label,text],i)=>{const picture=fragranceNotes.find(n=>n.pattern.test(text));return page.showFragrance&&text.trim()?<button key={label} type="button" className={'fragrance-callout note-'+i} aria-pressed={active===i} onClick={()=>onSelect(i)}>{picture&&<BotanicalSprite position={picture.position} label={picture.name}/>}<span><small>{label}</small><strong>{text}</strong></span><i aria-hidden="true"/></button>:null;})}</div></div>;
}
