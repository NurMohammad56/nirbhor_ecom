import {departmentOffers} from './offer-merchandising';
import {departments} from './departments';
import type {useStore} from './store';
import type {OfferSlide} from './offer-merchandising';

export const popupConfigKey='welcome-offer-popup';
export type OfferPopupConfig={enabled:boolean;revision:string;offerId:string;title:string;text:string;image:string;button:string;link:string;delay:number;frequency:'session'|'day'|'week';scope:'home'|'browse'|'department';departments:string[];devices:'all'|'mobile'|'desktop';start:string;end:string};
export const defaultPopup:OfferPopupConfig={enabled:true,revision:'welcome-v1',offerId:'auto',title:'পছন্দের কেনাকাটায়\nসাশ্রয় থাকুক সঙ্গে',text:'চলতি অফারটি দেখে নিন। পছন্দ হলে শর্ত মিলিয়ে বেছে নিন আপনার প্রয়োজনের পণ্য।',image:'',button:'অফারটি দেখুন',link:'',delay:8,frequency:'day',scope:'home',departments:[],devices:'all',start:'',end:''};
export function readPopup(content:Record<string,string>):OfferPopupConfig{
 try{
  const c=JSON.parse(content[popupConfigKey]||'{}');
  return {...defaultPopup,...c,enabled:typeof c.enabled==='boolean'?c.enabled:defaultPopup.enabled,delay:Math.min(60,Math.max(0,Number(c.delay??defaultPopup.delay)||0)),departments:Array.isArray(c.departments)?c.departments.filter((s:unknown)=>typeof s==='string'):[],frequency:['session','day','week'].includes(c.frequency)?c.frequency:defaultPopup.frequency,scope:['home','browse','department'].includes(c.scope)?c.scope:defaultPopup.scope,devices:['all','mobile','desktop'].includes(c.devices)?c.devices:defaultPopup.devices};
 }catch{return {...defaultPopup};}
}
export function popupOffers(s:ReturnType<typeof useStore>):OfferSlide[]{
 return departments.flatMap(d=>departmentOffers(s,d.slug)).filter(o=>o.active&&['sale','coupon','combo','automatic'].includes(o.source));
}
export function resolvePopupOffer(config:OfferPopupConfig,offers:OfferSlide[]){
 if(config.offerId==='message')return undefined;
 return config.offerId==='auto'?(offers.find(o=>o.source==='coupon')||offers.find(o=>o.source==='combo')||offers[0]):offers.find(o=>o.id===config.offerId);
}
export function popupDate(value:string){return value?new Date(value+'+06:00').getTime():NaN;}
export function popupScheduled(config:OfferPopupConfig,now=Date.now()){
 const start=popupDate(config.start),end=popupDate(config.end);
 return (!config.start||Number.isFinite(start)&&now>=start)&&(!config.end||Number.isFinite(end)&&now<end);
}
export function popupBrowsePath(path:string){return path==='/'||/^\/(shop|offers|categories|product|campaign|combo)(\/|$)/.test(path)||departments.some(d=>path==='/'+d.slug||path.startsWith('/'+d.slug+'/'));}
export function safePopupLink(link:string){return /^\/(?!\/)/.test(link)&&!/[\\\s]/.test(link)?link:'';}
const seenKey=(config:OfferPopupConfig)=>'nirbhor-popup-seen-'+config.revision;
export function popupSeen(config:OfferPopupConfig,now=Date.now()){
 try{
  const key=seenKey(config),blocked=Number(localStorage.getItem(key+'-blocked'));
  if(blocked>now)return true;
  if(config.frequency==='session')return sessionStorage.getItem(key)==='yes';
  const previous=Number(localStorage.getItem(key));
  return previous>0&&now-previous<(config.frequency==='week'?7:1)*86400000;
 }catch{return false;}
}
export function markPopupSeen(config:OfferPopupConfig,blockWeek=false){
 try{const key=seenKey(config);sessionStorage.setItem(key,'yes');localStorage.setItem(key,String(Date.now()));if(blockWeek)localStorage.setItem(key+'-blocked',String(Date.now()+7*86400000));}catch{/* The current React session still remembers the impression. */}
}
