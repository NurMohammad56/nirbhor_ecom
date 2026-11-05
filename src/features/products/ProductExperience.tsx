"use client";
import {useEffect,useRef,useState} from "react";
import type {RefObject} from "react";
import {Link, useLocation} from "@/lib/navigation";
import {ArrowRight,Check,MapPin,Share2,ShoppingBag,Truck} from "lucide-react";
import {useStore,cartTotals} from "@/providers/store-provider";
import {bnNode} from "@/lib/bn";
import {money} from "@/data/catalog";
import type {Product} from "@/data/catalog";
import {availableCoupon} from "@/lib/offer-merchandising";

export function ProductShare(){
 const s=useStore(),location=useLocation(),[copied,setCopied]=useState(false);
 useEffect(()=>setCopied(false),[location.pathname]);
 return <button type="button" className="icon-btn product-share" aria-label={copied?"পণ্যের লিংক কপি হয়েছে":"পণ্যের লিংক কপি করুন"} title={copied?"লিংক কপি হয়েছে":"পণ্যের লিংক কপি করুন"} onClick={async()=>{try{await navigator.clipboard.writeText(window.location.origin+location.pathname+location.search);setCopied(true);s.toast("পণ্যের লিংক কপি হয়েছে।");}catch{s.toast("ব্রাউজারের ঠিকানার লিংকটি কপি করুন।");}}}>{copied?<Check size={19}/>:<Share2 size={19}/>}</button>;
}

export function DeliveryPreview({product,variant,quantity}:{product:Product;variant:string;quantity:number}){
 const s=useStore(),[zone,setZone]=useState('Dhaka');
 const items=[{id:product.id,variant,quantity}],base=cartTotals(items,s.products,s.settings,zone,undefined,s);
 const candidate=s.coupons.find(c=>c.code===sessionStorage.getItem('nirbhor-coupon')&&availableCoupon(c));
 const eligible=candidate&&base.subtotal>=candidate.minimum&&cartTotals(items,s.products,s.settings,zone,candidate,s).couponEligibleSubtotal>0?candidate:undefined;
 const total=eligible?cartTotals(items,s.products,s.settings,zone,eligible,s):base;
 const gap=Math.max(0,s.settings.freeShipping-total.subtotal);
 if(!product.stock)return null;
 return <section className="delivery-preview" aria-labelledby="delivery-preview-title"><div className="delivery-preview-heading"><span className="delivery-preview-icon"><Truck size={20}/></span><div><h2 id="delivery-preview-title">ডেলিভারিসহ কত পড়বে?</h2><p>এই পণ্যের নির্বাচিত প্যাক ও পরিমাণের হিসাব</p></div></div><label className="delivery-zone-label"><span><MapPin size={15}/>ডেলিভারির অঞ্চল</span><select aria-label="সম্ভাব্য ডেলিভারির অঞ্চল" value={zone} onChange={e=>setZone(e.target.value)}><option value="Dhaka">ঢাকার ভেতরে</option><option value="Outside Dhaka">ঢাকার বাইরে</option></select></label><dl className="delivery-preview-totals" aria-live="polite"><div><dt>পণ্য · {bnNode(quantity)}টি</dt><dd>{bnNode(money(total.subtotal))}</dd></div>{total.discount>0&&<div className="delivery-saving"><dt>প্রযোজ্য ছাড়</dt><dd>-{bnNode(money(total.discount))}</dd></div>}<div><dt>ডেলিভারি</dt><dd data-testid="delivery-preview-shipping">{total.shipping?bnNode(money(total.shipping)):"ফ্রি"}</dd></div>{total.tax>0&&<div><dt>প্রযোজ্য কর</dt><dd>{bnNode(money(total.tax))}</dd></div>}<div className="delivery-preview-total"><dt>সম্ভাব্য মোট</dt><dd data-testid="delivery-preview-total">{bnNode(money(total.total))}</dd></div></dl>{s.settings.freeShipping>0&&<div className="delivery-preview-progress"><div><span>{total.shipping===0?"এই হিসাবে ডেলিভারি ফ্রি":<>আর {bnNode(money(gap))} পণ্য যোগ করলে ডেলিভারি ফ্রি</>}</span><Link to="/page/shipping">নিয়ম দেখুন<ArrowRight size={12}/></Link></div><progress aria-label="ফ্রি ডেলিভারির হিসাব" max={s.settings.freeShipping} value={total.shipping===0?s.settings.freeShipping:Math.min(total.subtotal,s.settings.freeShipping)}/></div>}<small className="delivery-preview-note">চূড়ান্ত মোট ও কুপনের যোগ্যতা চেকআউটে মিলিয়ে নিন।</small></section>;
}

export function ProductStickyPurchase({product,variant,quantity,price,target,canBuy,onAdd}:{product:Product;variant:string;quantity:number;price:number;target:RefObject<HTMLDivElement|null>;canBuy:boolean;onAdd:()=>void}){
 const s=useStore(),ref=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(false);
 useEffect(()=>{
  setVisible(false);const node=target.current;if(!node)return;
  let observer:IntersectionObserver|undefined;
  const header=document.querySelector('.brand-site-header');
  const connect=()=>{observer?.disconnect();const offset=Math.ceil(header?.getBoundingClientRect().height||0);observer=new IntersectionObserver(([entry])=>setVisible(!entry.isIntersecting&&entry.boundingClientRect.bottom<=offset),{rootMargin:`-${offset}px 0px 0px 0px`});observer.observe(node);};
  connect();const resize=new ResizeObserver(connect);if(header)resize.observe(header);
  return()=>{observer?.disconnect();resize.disconnect();};
 },[product.id,target]);
 if(!visible||s.drawer)return null;
 return <div ref={ref} className="pdp-sticky-purchase" role="region" aria-label="নির্বাচিত পণ্য অর্ডার করুন"><div className="container pdp-sticky-inner"><img src={product.image} alt="" width="48" height="48"/><div className="pdp-sticky-copy"><b>{bnNode(product.name)}</b><span>{bnNode(variant)} · {bnNode(quantity)}টি <strong>{bnNode(money(price*quantity))}</strong></span></div><button type="button" className="btn" disabled={!canBuy} onClick={onAdd}><ShoppingBag size={17}/><span>{canBuy?"ব্যাগে নিন":"স্টক নেই"}</span><ArrowRight size={16}/></button></div></div>;
}
