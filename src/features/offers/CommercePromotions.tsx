"use client";
import {imageVariants} from "@/lib/image-variants";
import { Link } from "@/lib/navigation";
import { ArrowRight, ArrowUpRight, Gift, TicketPercent, Zap } from "lucide-react";
import { useStore } from "@/providers/store-provider";
import { bnNode } from "@/lib/bn";
import { money } from "@/data/catalog";
import { availableCoupon, couponConditions, rememberOffer } from "@/lib/offer-merchandising";
import { comboAvailable, comboPricing } from "@/lib/promotions";
import ProductCarousel from "@/features/products/ProductCarousel";
import {useRef} from "react";
import {useAmbientMotion} from "@/hooks/useAmbientMotion";

export function HomePromotionTiles(){
  const s=useStore(),combo=s.combos.find(c=>c.featured&&comboAvailable(c,s.products)&&comboPricing(c,s.products).saving>0),coupon=s.coupons.find(c=>availableCoupon(c)&&c.type==="Free shipping"),p=combo&&s.products.find(p=>p.id===combo.items[0]?.productId);
  return <aside className="home-promo-tiles" aria-label="আরও সাশ্রয়ের আয়োজন"><Link className="promo-tile combo-promo-tile" to={combo?"/combo/"+combo.id:"/offers"}><div><span><Gift size={14}/>কম্বো অফার</span><h2>একসঙ্গে কিনুন,<br/>একটু বেশি বাঁচান।</h2><b>{combo?bnNode(money(comboPricing(combo,s.products).saving))+" সাশ্রয়":"চলতি কম্বো দেখুন"}</b><small>বিস্তারিত দেখুন<ArrowUpRight size={14}/></small></div>{p&&<img {...imageVariants(p.image,'200px')} src={p.image} alt=""/>}</Link><Link className="promo-tile delivery-promo-tile" to={coupon?"/shop?coupon="+encodeURIComponent(coupon.code):"/offers"} onClick={()=>rememberOffer(coupon?.code)}><div><span><TicketPercent size={14}/>বাড়তি সুবিধা</span><h2>{coupon?"ডেলিভারি খরচে\nসাশ্রয়ের সুযোগ":"আপনার পছন্দের\nচলতি অফার"}</h2>{coupon?<><code>{coupon.code}</code><p>{bnNode(couponConditions(coupon))}</p></>:<p>কুপন ও কম্বোর শর্ত দেখে বেছে নিন।</p>}<small>দেখে নিন<ArrowRight size={14}/></small></div><img {...imageVariants('/assets/brand-story-v5.webp','200px')} src="/assets/brand-story-v5.webp" alt="" loading="lazy"/></Link></aside>;
}
export function FlashSale(){
  const s=useStore(),products=s.products.filter(p=>p.status==="Published"&&p.stock>0&&p.oldPrice>p.price);
  const ref=useRef<HTMLElement>(null),enabled=!!products.length&&s.content["flash-sale-hidden"]!=="yes",moving=useAmbientMotion(ref,enabled);
  if(!products.length||s.content["flash-sale-hidden"]==="yes")return null;
  return <section ref={ref} className="container flash-sale-section" data-ambient={moving?"playing":"paused"} aria-labelledby="flash-title"><div className="flash-sale-heading"><div><span><Zap size={17}/>চলছে সাশ্রয়ের আয়োজন</span><h2 id="flash-title">{s.content["flash-sale-title"]||"আজকের অফার, আপনার পছন্দে"}</h2><p className="flash-sale-summary">{bnNode(products.length+"টি পণ্যে বর্তমান ছাড়")}<span>পছন্দ মিলিয়ে বেছে নিন</span></p></div><Link to="/shop?collection=offers">সব ছাড়ের পণ্য<ArrowUpRight size={16}/></Link></div><ProductCarousel items={products.slice(0,12)} bare label="চলতি ছাড়ের পণ্য" className="flash-sale-products"/></section>;
}
