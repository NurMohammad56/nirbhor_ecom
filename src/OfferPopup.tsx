import {useEffect,useMemo,useRef,useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {ArrowUpRight,Check,Copy,Gift,ShieldCheck} from 'lucide-react';
import {useStore} from './store';
import {useDepartment} from './useDepartment';
import {bnNode} from './bn';
import {Modal} from './ui';
import {rememberOffer} from './offer-merchandising';
import type {OfferSlide} from './offer-merchandising';
import {markPopupSeen,popupBrowsePath,popupDate,popupOffers,popupScheduled,popupSeen,readPopup,resolvePopupOffer,safePopupLink} from './offer-popup';
import type {OfferPopupConfig} from './offer-popup';

export function OfferPopupCard({config,offer,onClose,preview=false}:{config:OfferPopupConfig;offer?:OfferSlide;onClose:()=>void;preview?:boolean}){
 const s=useStore(),[copied,setCopied]=useState(false);
 const image=config.image||offer?.image||'/assets/brand-world-v5.webp';
 const href=safePopupLink(config.link)||(offer?.link||'/offers');
 return <div className="welcome-offer-shell"><Modal title={preview?'অফার পপআপ প্রিভিউ':'আপনার জন্য চলতি অফার'} onClose={onClose} wide>
  <div className="welcome-offer-card">
   <div className="welcome-offer-visual"><img src={image} alt="" onError={e=>{if(!e.currentTarget.dataset.fallback){e.currentTarget.dataset.fallback='yes';e.currentTarget.src='/assets/brand-world-v5.webp';}}}/><span><Gift size={15}/>নির্ভরের চলতি অফার</span></div>
   <div className="welcome-offer-copy"><span className="welcome-offer-kicker"><span/>আপনার পছন্দে, একটু সাশ্রয়</span>
    <h2>{bnNode(config.title||offer?.title||'চলতি অফার দেখে নিন')}</h2>
    {offer&&<b className="welcome-offer-badge">{bnNode(offer.badge)}</b>}
    {config.text&&<p>{bnNode(config.text)}</p>}
    {offer?.code&&<button type="button" className="welcome-offer-code" aria-label="পপআপের কুপন কোড কপি করুন" onClick={async()=>{try{await navigator.clipboard.writeText(offer.code!);rememberOffer(offer.code);setCopied(true);}catch{s.toast('অফারের পেজ থেকে কোডটি ব্যবহার করুন।');}}}><span><small>চেকআউটে ব্যবহার করুন</small><strong>{offer.code}</strong></span>{copied?<Check size={18}/>:<Copy size={18}/>}<span className="sr-only" aria-live="polite">{copied?'কোড কপি হয়েছে':''}</span></button>}
    {offer&&<p className="welcome-offer-conditions">{bnNode(offer.conditions)}</p>}
    {preview?<button type="button" className="btn welcome-offer-cta" onClick={()=>s.toast('প্রিভিউতে আছেন। সেভ করলে বাটনটি নির্বাচিত লিংকে যাবে।')}>{config.button||'অফারটি দেখুন'}<ArrowUpRight size={18}/></button>:<Link className="btn welcome-offer-cta" to={href} onClick={()=>{rememberOffer(offer?.code);onClose();}}>{config.button||'অফারটি দেখুন'}<ArrowUpRight size={18}/></Link>}
    <button type="button" className="welcome-offer-dismiss" onClick={onClose}>এখন নয়, কেনাকাটা চালিয়ে যাই</button>
    {!preview&&<button type="button" className="welcome-offer-week" onClick={()=>{markPopupSeen(config,true);onClose();}}>এই সপ্তাহে আর দেখাবেন না</button>}
    <small className="welcome-offer-trust"><ShieldCheck size={13}/>অর্ডারের আগে অফারের শর্ত মিলিয়ে নিন</small>
   </div>
  </div>
 </Modal></div>;
}

export default function OfferPopup(){
 const s=useStore(),{pathname}=useLocation(),{department}=useDepartment();
 const config=useMemo(()=>readPopup(s.content),[s.content]);
 const offers=useMemo(()=>popupOffers(s),[s.products,s.categories,s.coupons,s.combos,s.discounts,s.content,s.offerClock]);
 const offer=resolvePopupOffer(config,offers),[open,setOpen]=useState(false),[shown,setShown]=useState('');
 const [now,setNow]=useState(Date.now),[mobile,setMobile]=useState(()=>matchMedia('(max-width: 767px)').matches);
 const impressed=useRef(new Set<string>());
 const offerReady=config.offerId==='message'||!!offer;
 const pageMatches=config.scope==='home'?pathname==='/':config.scope==='department'?!!department&&config.departments.includes(department.slug):true;
 const deviceMatches=config.devices==='all'||(config.devices==='mobile'?mobile:!mobile);
 const eligible=config.enabled&&offerReady&&popupBrowsePath(pathname)&&pageMatches&&deviceMatches&&popupScheduled(config,now);
 useEffect(()=>{const media=matchMedia('(max-width: 767px)'),change=()=>setMobile(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
 useEffect(()=>{
  const dates=[popupDate(config.start),popupDate(config.end)].filter(t=>Number.isFinite(t)&&t>Date.now());
  const timer=setTimeout(()=>setNow(Date.now()),Math.max(25,Math.min(30000,...dates.map(t=>t-Date.now()))));
  return()=>clearTimeout(timer);
 },[config.start,config.end,now]);
 useEffect(()=>{
  setOpen(false);
  if(!eligible||impressed.current.has(config.revision)||popupSeen(config))return;
  let timer:ReturnType<typeof setTimeout>;
  const show=()=>{
   if(popupSeen(config)||impressed.current.has(config.revision)||!popupScheduled(config))return;
   const active=document.activeElement;
   const busy=document.hidden||!!document.querySelector('[role="dialog"],.modal-backdrop')||!!active?.matches('input,textarea,select,[contenteditable="true"]');
   if(busy){timer=setTimeout(show,1000);return;}
   impressed.current.add(config.revision);markPopupSeen(config);setShown(config.revision);setOpen(true);
  };
  timer=setTimeout(show,config.delay*1000);
  return()=>clearTimeout(timer);
 },[eligible,pathname,config.revision,config.delay,config.frequency]);
 useEffect(()=>{if(s.drawer)setOpen(false);},[s.drawer]);
 if(!open||!eligible||shown!==config.revision)return null;
 return <OfferPopupCard config={config} offer={offer} onClose={()=>setOpen(false)}/>;
}
