import type { Banner, Category, Coupon, Product } from "./data";
import type { ComboOffer, DiscountRule } from "./promotions";
import { comboAvailable, comboPricing, offerActive } from "./promotions";
import { couponApplies } from "./order-logic";
import { categoryForDepartment, departments, departmentShopHref, experienceForDepartment, productHref } from "./departments";
import { money } from "./data";
import { bn } from "./bn";
import { campaignPhoto, categoryCampaigns } from "./category-campaigns";

export type CampaignProduct = Pick<Product,"id"|"name"|"image"|"price"|"oldPrice"> & {href:string};
export type OfferSlide = Banner & { badge: string; kicker: string; conditions: string; code?: string; departmentSlug?: string; source: "sale" | "coupon" | "combo" | "automatic" | "collection" | "manual" | "arrival" | "feature"; reference?: string; end: string; creative?:"campaign"|"spotlight"; products?:CampaignProduct[]; };
type OfferState = { products: Product[]; categories: Category[]; coupons: Coupon[]; combos: ComboOffer[]; discounts: DiscountRule[]; content: Record<string,string>; };
function customize(s:OfferState,slide:OfferSlide,index:number){const key="offer-banner-"+slide.id;return {...slide,order:Number(s.content[key+"-order"]??index),title:s.content[key+"-title"]||slide.title,subtitle:s.content[key+"-text"]||slide.subtitle,image:s.content[key+"-image"]||slide.image,active:s.content[key+"-hidden"]!=="yes"};}
export const availableCoupon = (coupon: Coupon) => offerActive(coupon) && coupon.uses < coupon.limit && coupon.perUser > 0 && (coupon.type==="Free shipping"||coupon.type==="Buy 2 get 1"||coupon.value>0);
export const couponConditions = (coupon: Coupon) => [`ন্যূনতম ${money(coupon.minimum)}`, coupon.maxDiscount ? `সর্বোচ্চ ছাড় ${money(coupon.maxDiscount)}` : "", `প্রতিজন ${coupon.perUser} বার`, coupon.excludeSale ? "ছাড়ের পণ্যে নয়" : ""].filter(Boolean).join(" · ");
export function rememberOffer(code?: string) { if(code) sessionStorage.setItem("nirbhor-coupon",code); }

/** Every numeric promise comes from current catalogue and promotion records. */
export function departmentOffers(s: OfferState, slug: string): OfferSlide[] {
  const d=departments.find(d=>d.slug===slug); if(!d)return [];
  const category=categoryForDepartment(d,s.categories), experience=experienceForDepartment(d,s.categories);
  if(!category?.active||!experience.enabled)return [];
  const products=s.products.filter(p=>p.category===category.name&&p.status==="Published"&&p.stock>0), shop=departmentShopHref(d), name=d.name==="Home"?"Home & living":d.name;
  const base={active:true,order:0,start:"",end:"",image:experience.heroImage,departmentSlug:slug,kicker:name,cta:"অফারের পণ্য দেখুন"};
  const slides:OfferSlide[]=[];
  const sale=products.filter(p=>p.oldPrice>p.price&&p.price>=0);
  if(sale.length){const max=Math.max(...sale.map(p=>Math.floor((p.oldPrice-p.price)/p.oldPrice*100)));if(max>0)slides.push({...base,id:`${slug}-sale`,title:`${name}\nসাশ্রয়ে পছন্দ`,subtitle:"পছন্দের পণ্য, এখন আরও ভালো দামে।",badge:`সর্বোচ্চ ${max}% ছাড়`,conditions:"শুধু নির্বাচিত ছাড়ের পণ্যে",link:shop+"?collection=offers",source:"sale"});}
  const coupons=s.coupons.filter(c=>availableCoupon(c)&&products.some(p=>couponApplies(c,p)&&(!c.excludeSale||p.oldPrice<=p.price)));
  for(const coupon of [...coupons].sort((a,b)=>(a.type==="Percentage"?-1:0)-(b.type==="Percentage"?-1:0))){
    const badge=coupon.type==="Free shipping"?"ডেলিভারি ফ্রি":coupon.type==="Buy 2 get 1"?"৩টির মধ্যে ১টির দাম ফ্রি":`${coupon.type==="Percentage"?`${Math.min(100,coupon.value)}%`:money(coupon.value)} ছাড়`;
    slides.push({...base,id:`${slug}-coupon-${coupon.id}`,title:coupon.type==="Free shipping"?`${name}\nডেলিভারি আমাদের`:`${name}\nকুপনে বাড়তি সাশ্রয়`,subtitle:coupon.type==="Free shipping"?"পছন্দের পণ্য পৌঁছে যাক আপনার ঠিকানায়।":"অর্ডারের আগে কোড ও শর্তগুলো মিলিয়ে নিন।",badge,conditions:couponConditions(coupon),code:coupon.code,link:shop+"?coupon="+encodeURIComponent(coupon.code),source:"coupon",reference:coupon.id,end:coupon.end});
  }
  const combos=s.combos.filter(c=>comboAvailable(c,s.products)&&c.items.some(i=>products.some(p=>p.id===i.productId))&&comboPricing(c,s.products).saving>0);
  for(const combo of combos.slice(0,2)){const pricing=comboPricing(combo,s.products);slides.push({...base,id:`${slug}-combo-${combo.id}`,title:combo.name,subtitle:combo.description,badge:`${money(pricing.saving)} সাশ্রয়`,conditions:`কম্বোর মূল্য ${money(pricing.price)} · ${combo.items.length} ধরনের পণ্য`,link:"/combo/"+combo.id,source:"combo",reference:combo.id,end:combo.end});}
  for(const rule of s.discounts.filter(r=>offerActive(r)&&r.value>0&&products.some(p=>(r.scope==="All products"||r.scope===p.category||r.scope==="Product: "+p.id)&&(!r.excludeSale||p.oldPrice<=p.price)))){
    slides.push({...base,id:`${slug}-automatic-${rule.id}`,title:rule.name,subtitle:"কোড ছাড়াই প্রযোজ্য ছাড় চেকআউটে যোগ হবে।",badge:`${rule.type==="Percentage"?Math.min(100,rule.value)+"%":money(rule.value)} ছাড়`,conditions:`ন্যূনতম ${money(rule.minimum)}${rule.maxDiscount?` · সর্বোচ্চ ${money(rule.maxDiscount)}`:""}`,link:shop,source:"automatic",reference:rule.id,end:rule.end});
  }
  const ranked=[...slides.filter(x=>x.source==="sale"),...slides.filter(x=>x.source==="automatic"),...slides.filter(x=>x.source==="coupon"&&x.badge.includes("%")),...slides.filter(x=>x.source==="combo"),...slides.filter(x=>x.source==="coupon"&&!x.badge.includes("%"))];
  if(!ranked.length)ranked.push({...base,id:`${slug}-collection`,title:`${name}\nপছন্দের নতুন খোঁজ`,subtitle:experience.description,badge:"কালেকশন দেখুন",conditions:"এই মুহূর্তে এই বিভাগে কোনো সক্রিয় ছাড় নেই।",link:shop,source:"collection"});
  const defaultTitles=[d.experience.heroTitle,bn(d.experience.heroTitle)];
  if(experience.heroTitle&&!defaultTitles.includes(experience.heroTitle)&&ranked[0])ranked[0]={...ranked[0],title:experience.heroTitle};
  const campaign=categoryCampaigns[slug];
  if(campaign&&products.length){
    const tile=(p:Product):CampaignProduct=>({id:p.id,name:p.name,image:p.image,price:p.price,oldPrice:p.oldPrice,href:productHref(p,s.categories)});
    const customImage=experience.heroImage!==d.experience.heroImage&&experience.heroImage!==d.image;
    const byNewest=[...products].sort((a,b)=>b.created-a.created);
    const arrival=byNewest.find(p=>/\bnew\b|নতুন/i.test(p.badge));
    const featured=arrival||byNewest[0];
    for(let i=0;i<ranked.length;i++){
      const promo=ranked[i],eligible=promo.source==="sale"?sale:promo.source==="coupon"?products.filter(p=>{const c=s.coupons.find(c=>c.id===promo.reference);return c&&couponApplies(c,p)&&(!c.excludeSale||p.oldPrice<=p.price);}):products;
      ranked[i]={...promo,image:i===0&&customImage?experience.heroImage:campaignPhoto(slug,i>0),creative:"campaign",products:eligible.slice(0,3).map(tile)};
      if(i===0&&defaultTitles.includes(experience.heroTitle))ranked[i]={...ranked[i],title:campaign.title,subtitle:campaign.text};
    }
    const feature:OfferSlide={...base,id:`${slug}-spotlight`,title:featured.name,subtitle:arrival?"নতুন কালেকশনের এই পণ্যটি কাছ থেকে দেখুন। দাম, সাইজ ও বিস্তারিত মিলিয়ে বেছে নিন।":"এই কালেকশন থেকে একটি পছন্দ। কেনার আগে পণ্যের ছবি, দাম ও বিস্তারিত দেখে নিন।",badge:arrival?"নতুন এসেছে":"কালেকশন ফিচার",conditions:"দাম ও স্টক ক্যাটালগ অনুযায়ী",image:`/assets/campaign-${slug}-feature-v1.webp`,cta:"পণ্যটি দেখুন",link:productHref(featured,s.categories),source:arrival?"arrival":"feature",creative:"campaign",products:[featured,...byNewest.filter(p=>p.id!==featured.id)].slice(0,2).map(tile)};
    ranked.splice(1,0,feature);
    if(ranked.length<3)ranked.push({...base,id:`${slug}-edit`,title:campaign.secondary,subtitle:campaign.text,badge:"আপনার জন্য বাছাই",conditions:"পণ্যের তথ্য ও বর্তমান দাম দেখে অর্ডার করুন।",image:campaignPhoto(slug,true),cta:"কালেকশন দেখুন",link:shop+"?sort=newest",source:"collection",creative:"campaign",products:byNewest.slice(0,3).map(tile)});
  }
  return ranked.map((slide,index)=>customize(s,slide,index)).sort((a,b)=>a.order-b.order);
}
export function offerSlides(s:OfferState,slug?:string,includeHidden=false){let slides=slug?departmentOffers(s,slug):departments.flatMap(d=>departmentOffers(s,d.slug).filter(x=>includeHidden||(x.active&&s.content[`offer-banner-${x.id}-home`]!=="no")).slice(0,1));if(!slug){const universal=slides.find(x=>x.source==="coupon"&&s.coupons.some(c=>c.id===x.reference&&c.scope==="All products"));if(universal)slides=[customize(s,{...universal,id:"home-welcome",title:"পছন্দের কেনাকাটায়\nসাশ্রয় থাকুক সঙ্গে",kicker:"নির্ভরের চলতি অফার",image:"/assets/brand-world-v5.webp",link:"/shop?coupon="+encodeURIComponent(universal.code||""),departmentSlug:undefined},-1),...slides];slides=slides.map((slide,index)=>({...slide,order:Number(s.content[`offer-banner-${slide.id}-home-order`]??index)})).sort((a,b)=>a.order-b.order);}return slides.filter(x=>includeHidden||(x.active&&s.content[`offer-banner-${x.id}-${slug?"department":"home"}`]!=="no")).slice(0,slug?3:12);}

export function migrateCommerceTheme<T>(key:string,value:T):T{
  if(!["settings","categories"].includes(key)||localStorage.getItem("nirbhor-teal-commerce-v1-"+key))return value;
  let next=value;
  if(key==="settings"&&value&&typeof value==="object"&&(value as {color?:string}).color==="#193f30")next={...value,color:"#0F766E"};
  if(key==="categories"&&Array.isArray(value))next=(value as Category[]).map(category=>{const d=departments.find(d=>d.categoryId===category.id);if(!d||!category.experience)return category;const exp={...category.experience};if([d.experience.accent,"#193f30","#455c20"].includes(exp.accent))exp.accent="#0F766E";if(exp.ink===d.experience.ink)exp.ink="#142D2A";if(exp.background===d.experience.background)exp.background="#E5F1EC";return {...category,experience:exp};}) as T;
  localStorage.setItem("nirbhor-v1-"+key,JSON.stringify(next));localStorage.setItem("nirbhor-teal-commerce-v1-"+key,"done");return next;
}
