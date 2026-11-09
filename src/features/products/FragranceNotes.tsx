"use client";
import {useId,useState} from 'react';
import {BotanicalSprite} from '@/components/BotanicalSprite';
import {productPageContent} from '@/lib/product-page-content';
import {fragranceLayers} from '@/lib/fragrance-profile';
import {fragranceNotes} from '@/lib/fragrance-discovery';
import {bnNode} from '@/lib/bn';
import type {Product} from '@/data/catalog';
import FragranceAccords from '@/features/products/FragranceAccords';

export default function FragranceNotes({product}:{product:Product}){
 const profile=productPageContent(product),[active,setActive]=useState(0),id=useId();
 const available=fragranceLayers.flatMap((layer,i)=>profile[layer.notes].trim()?[i]:[]);
 if(!profile.showFragrance||!available.length)return null;
 const selected=available.includes(active)?active:available[0],layer=fragranceLayers[selected];
 const notes=profile[layer.notes],description=profile[layer.description],image=profile[layer.image];
 const botanical=fragranceNotes.find(note=>note.pattern.test(notes));
 const hasPicture=profile.fragranceShowNoteImages&&!!(image||botanical);
 return <section className="fragrance-notes" aria-label="সুগন্ধের নোট">
  <header className="fragrance-notes-heading">
   {profile.fragranceKicker&&<span>{profile.fragranceKicker}</span>}
   {profile.fragranceTitle&&<h2>{profile.fragranceTitle}</h2>}
   {profile.fragranceIntro&&<p>{profile.fragranceIntro}</p>}
  </header>
  <div className="fragrance-facts">
   {(profile.fragranceFamily||product.subcategory)&&<span>ঘ্রাণের ধরন<b>{profile.fragranceFamily||product.subcategory}</b></span>}
   {profile.fragranceConcentration&&<span>ঘনত্ব<b>{profile.fragranceConcentration}</b></span>}
  </div>
  <FragranceAccords profile={profile}/>
  <h3 className="fragrance-pyramid-title">ঘ্রাণের নোট</h3>
  <div className="scent-layer-tabs" role="tablist" aria-label="সুগন্ধের স্তর" onKeyDown={e=>{
   const i=available.indexOf(selected);let next=i;
   if(e.key==='ArrowRight')next=(i+1)%available.length;
   else if(e.key==='ArrowLeft')next=(i-1+available.length)%available.length;
   else if(e.key==='Home')next=0;else if(e.key==='End')next=available.length-1;else return;
   e.preventDefault();setActive(available[next]);document.getElementById(id+'-tab-'+available[next])?.focus();
  }}>
   {fragranceLayers.map((item,i)=><button key={item.id} type="button" id={id+'-tab-'+i} role="tab" aria-label={item.label} tabIndex={selected===i?0:-1} aria-selected={selected===i} aria-controls={id+'-panel'} disabled={!profile[item.notes].trim()} onClick={()=>setActive(i)}><span aria-hidden="true">{bnNode(String(i+1).padStart(2,'0'))}</span><b>{item.label}</b><small>{profile[item.notes]||'তথ্য নেই'}</small></button>)}
  </div>
  <div id={id+'-panel'} role="tabpanel" aria-labelledby={id+'-tab-'+selected} tabIndex={0} className={'scent-layer-panel layer-'+layer.id+(hasPicture?' has-note-art':'')}>
   {hasPicture&&<div className="scent-note-art">{image?<img src={image} alt={layer.label+' - '+notes} loading="lazy"/>:botanical&&<BotanicalSprite position={botanical.position} label={botanical.name}/>}</div>}
   <div className="scent-note-copy"><small>{layer.phase}</small><h3>{notes}</h3>{description&&<p>{description}</p>}</div>
  </div>
  {(profile.fragranceOccasion||profile.fragranceUsage)&&<dl className="fragrance-practical">
   {profile.fragranceOccasion&&<div><dt>কখন মানিয়ে যায়</dt><dd>{profile.fragranceOccasion}</dd></div>}
   {profile.fragranceUsage&&<div><dt>ব্যবহারের পরামর্শ</dt><dd>{profile.fragranceUsage}</dd></div>}
  </dl>}
  {profile.fragranceContext&&<div className="fragrance-context"><small>{profile.fragranceSample?'নমুনা প্রোফাইল':'প্রোফাইলের তথ্য'}</small><p>{profile.fragranceContext}</p></div>}
  <small className="scent-fact-note">ঘ্রাণের নোট উপাদান বা অ্যালার্জেনের সম্পূর্ণ তালিকা নয়।</small>
 </section>;
}
