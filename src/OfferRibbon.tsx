import {useRef,useState} from "react";
import {Link} from "react-router-dom";
import {Pause,Play,Sparkles,ArrowUpRight} from "lucide-react";
import {useStore} from "./store";
import {bnNode} from "./bn";
import {money} from "./data";
import {availableCoupon,couponConditions,rememberOffer} from "./offer-merchandising";
import {comboAvailable} from "./promotions";
import {useAmbientMotion} from "./useAmbientMotion";

export default function OfferRibbon(){
 const s=useStore(),ref=useRef<HTMLElement>(null),[stopped,setStopped]=useState(false),[hover,setHover]=useState(false),[focused,setFocused]=useState(false);
 const enabled=s.content['offer-ribbon-hidden']!=='yes';
 const coupons=s.coupons.filter(availableCoupon),items:{label:string;to:string;code?:string;title?:string}[]=[];
 const coupon=coupons.find(c=>c.type==='Percentage');
 if(coupon)items.push({label:`${Math.min(100,coupon.value)}% কুপন ছাড় · ${coupon.code}${coupon.minimum>0?' · '+money(coupon.minimum)+' থেকে':''}`,to:'/shop?coupon='+encodeURIComponent(coupon.code),code:coupon.code,title:couponConditions(coupon)});
 const combos=s.combos.filter(c=>comboAvailable(c,s.products));if(combos.length)items.push({label:`${combos.length}টি কম্বো এক জায়গায়`,to:'/offers?tab=combo'});
 if(s.settings.freeShipping>0)items.push({label:`${money(s.settings.freeShipping)} থেকে ডেলিভারি ফ্রি`,to:'/page/shipping'});
 if(s.settings.cod)items.push({label:'হাতে পেয়ে দাম পরিশোধ',to:'/page/shipping'});
 const active=useAmbientMotion(ref,enabled&&!!items.length);
 if(!enabled||!items.length)return null;
 const moving=active&&!stopped&&!hover&&!focused;
 return <aside ref={ref} className="container offer-ribbon" data-motion={moving?'playing':'paused'} aria-label="চলতি কেনাকাটার সুবিধা" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}}>
  <span className="offer-ribbon-label"><Sparkles size={15}/>সঙ্গে একটু বাড়তি</span>
  <div className="offer-ribbon-window"><div className="offer-ribbon-track">{[0,1].map(copy=><div className="offer-ribbon-group" key={copy} aria-hidden={copy===1?true:undefined} inert={copy===1?true:undefined}>{items.map(item=><Link key={item.to+item.label} to={item.to} title={item.title} onClick={()=>rememberOffer(item.code)}><span aria-hidden="true">✦</span>{bnNode(item.label)}<ArrowUpRight size={13}/></Link>)}</div>)}</div></div>
  <button className="offer-ribbon-toggle" type="button" aria-label={stopped?'সুবিধার স্ট্রিপ চালু করুন':'সুবিধার স্ট্রিপ থামান'} aria-pressed={stopped} onClick={()=>setStopped(value=>!value)}>{stopped?<Play size={14}/>:<Pause size={14}/>}</button>
 </aside>;
}
