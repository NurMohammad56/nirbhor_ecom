import {departmentOffers} from '@/lib/offer-merchandising';
import {departments} from '@/lib/departments';
import type {useStore} from '@/providers/store-provider';
import type {OfferSlide} from '@/lib/offer-merchandising';

export const popupConfigKey='welcome-offer-popup';
export type OfferPopupConfig={id:string;enabled:boolean;revision:string;offerId:string;title:string;text:string;image:string;button:string;link:string;delay:number;frequency:'visit'|'session'|'day'|'week';scope:'home'|'browse'|'department';departments:string[];devices:'all'|'mobile'|'desktop';start:string;end:string};
export const defaultPopup:OfferPopupConfig={id:'welcome',enabled:true,revision:'welcome-v1',offerId:'auto',title:'পছন্দের কেনাকাটায়\nসাশ্রয় থাকুক সঙ্গে',text:'চলতি অফারটি দেখে নিন। পছন্দ হলে শর্ত মিলিয়ে বেছে নিন আপনার প্রয়োজনের পণ্য।',image:'',button:'অফারটি দেখুন',link:'',delay:3,frequency:'visit',scope:'browse',departments:[],devices:'all',start:'',end:''};
function normalizePopup(value:unknown,index=0):OfferPopupConfig{
 const c=value&&typeof value==='object'?value as Partial<OfferPopupConfig>:{};
 return {...defaultPopup,...c,id:typeof c.id==='string'&&c.id?c.id:'popup-'+index,enabled:typeof c.enabled==='boolean'?c.enabled:defaultPopup.enabled,delay:Math.min(4,Math.max(0,Number(c.delay??defaultPopup.delay)||0)),departments:Array.isArray(c.departments)?c.departments.filter((s:unknown)=>typeof s==='string'):[],frequency:c.frequency&&['visit','session','day','week'].includes(c.frequency)?c.frequency:defaultPopup.frequency,scope:c.scope&&['home','browse','department'].includes(c.scope)?c.scope:defaultPopup.scope,devices:c.devices&&['all','mobile','desktop'].includes(c.devices)?c.devices:defaultPopup.devices};
}
export function readPopups(content:Record<string,string>):OfferPopupConfig[]{
 try{
  if(!content[popupConfigKey])return [{...defaultPopup}];
  const value=JSON.parse(content[popupConfigKey]);
  if(value?.version===2&&Array.isArray(value.items)){
   const seen=new Set<string>();
   return value.items.map((item:unknown,index:number)=>{const next=normalizePopup(item,index);if(seen.has(next.id))next.id='popup-'+index+'-'+next.id;seen.add(next.id);return next;});
  }
  // Retain the old creative while applying the newly requested visit behavior.
  const next=normalizePopup(value);return [{...next,delay:Math.min(next.delay,3),frequency:'visit',scope:next.scope==='home'?'browse':next.scope}];
 }catch{return [{...defaultPopup}];}
}
export function serializePopups(items:OfferPopupConfig[]){return JSON.stringify({version:2,items});}
export function readPopup(content:Record<string,string>):OfferPopupConfig{
 return readPopups(content)[0]||{...defaultPopup,enabled:false};
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
export function safePopupLink(link:string){
 if(/[\\\s\u0000-\u001f]/.test(link))return '';
 if(/^\/(?!\/)/.test(link))return link;
 try{const url=new URL(link);return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password?url.href:'';}catch{return '';}
}
const seenKey=(config:OfferPopupConfig)=>'nirbhor-popup-seen-'+config.revision;
export function popupSeen(config:OfferPopupConfig,now=Date.now()){
 if(config.frequency==='visit')return false;
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
