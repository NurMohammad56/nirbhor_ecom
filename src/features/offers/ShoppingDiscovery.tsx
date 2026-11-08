"use client";
import {imageVariants} from "@/lib/image-variants";
import {useState} from "react";
import {Link} from "@/lib/navigation";
import {ArrowUpRight,Check,Copy,Gift,Sparkles,TicketPercent,TrendingUp,Wallet} from "lucide-react";
import {useStore} from "@/providers/store-provider";
import {bnNode} from "@/lib/bn";
import {money} from "@/data/catalog";
import {availableCoupon,couponConditions,rememberOffer} from "@/lib/offer-merchandising";

export function ShoppingShortcuts(){
  const items=[{label:"চলতি ছাড়",text:"ছাড়ের পণ্য একসঙ্গে",to:"/shop?collection=offers",image:"sale"},{label:"কম্বো অফার",text:"একসঙ্গে কেনার সাশ্রয়",to:"/offers?tab=combo",image:"combo"},{label:"নতুন বাছাই",text:"কালেকশনের নতুন সংযোজন",to:"/shop?collection=new",image:"new"},{label:"বেশি অর্ডারের পণ্য",text:"অর্ডার অনুযায়ী সাজানো",to:"/shop?collection=bestsellers",image:"popular"}];
  return <nav className="container shopping-shortcuts" aria-label="কেনাকাটার শর্টকাট">{items.map(({label,text,to,image})=><Link key={to} to={to}><img {...imageVariants('/assets/shop-shortcut-'+image+'-v1.webp','70px')} className="shortcut-photo" src={"/assets/shop-shortcut-"+image+"-v1.webp"} alt="" width="64" height="64"/><span><b>{label}</b><small>{text}</small></span><ArrowUpRight size={16}/></Link>)}</nav>;
}

export function CouponShelf(){
  const s=useStore(),[copied,setCopied]=useState("");
  const coupons=s.coupons.filter(availableCoupon).slice(0,3);
  if(!coupons.length||s.content["coupon-shelf-hidden"]==="yes")return null;
  const copy=async(code:string)=>{try{if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(code);setCopied(code);s.toast("কুপন কোড কপি হয়েছে।");}catch{s.toast("কোডটি বেছে কপি করুন: "+code);}};
  return <section className="container coupon-shelf" aria-labelledby="coupon-shelf-heading"><div className="shopping-section-heading"><div><span><TicketPercent size={15}/>কেনাকাটায় বাড়তি সুবিধা</span><h2 id="coupon-shelf-heading">কুপন নিন, শর্ত মিলিয়ে বাঁচান</h2></div><Link to="/offers?tab=code">সব কুপন<ArrowUpRight size={16}/></Link></div><div className="coupon-shelf-grid">{coupons.map(c=><article key={c.id} className="coupon-ticket"><div><b>{c.type==="Percentage"?bnNode(Math.min(100,c.value)+"% ছাড়"):c.type==="Free shipping"?"ডেলিভারি ফ্রি":c.type==="Buy 2 get 1"?"৩টির মধ্যে ১টির দাম ফ্রি":bnNode(money(c.value))+" ছাড়"}</b><p>{bnNode(couponConditions(c))}{c.scope!=="All products"&&<> · {bnNode(c.scope)}</>}</p></div><div className="coupon-ticket-actions"><button type="button" aria-label={c.code+" কপি করুন"} onClick={()=>copy(c.code)}><code>{c.code}</code>{copied===c.code?<Check size={15}/>:<Copy size={15}/>}</button><Link to={"/shop?coupon="+encodeURIComponent(c.code)} onClick={()=>rememberOffer(c.code)}>ব্যবহার করুন<ArrowUpRight size={14}/></Link></div></article>)}</div></section>;
}

export function BudgetFinds(){
 const s=useStore();
 if(s.content["budget-finds-hidden"]==="yes")return null;
 const live=s.products.filter(p=>p.status==="Published"&&p.stock>0);
 const groups=[500,1000,2000].map(cap=>{const products=live.filter(p=>p.price<=cap).sort((a,b)=>a.price-b.price);const preferred=products.filter(p=>p.price>cap/2).sort((a,b)=>b.price-a.price);return {cap,products,art:[...preferred,...products].filter((p,i,list)=>list.findIndex(item=>item.id===p.id)===i).slice(0,3)};}).filter(g=>g.products.length);
 if(!groups.length)return null;
 return <section className="container budget-finds" aria-labelledby="budget-heading"><div className="shopping-section-heading"><div><span><Wallet size={15}/>বাজেট থাকুক আপনার হাতে</span><h2 id="budget-heading">ছোট বাজেটেও ভালো পছন্দ</h2></div><Link to="/shop?sort=price-low">সব পণ্য<ArrowUpRight size={16}/></Link></div><div className="budget-finds-grid">{groups.map(({cap,products,art})=><Link className="budget-find-card" key={cap} to={"/shop?budget="+cap+"&max="+cap+"&stock=true&sort=price-low"}><div className="budget-find-copy"><span>আপনার বাজেট</span><h3>{bnNode(money(cap))}<small>এর মধ্যে</small></h3><p>{bnNode(products.length+"টি পণ্য")} · {bnNode(money(products[0].price))} থেকে</p><b>পছন্দগুলো দেখুন<ArrowUpRight size={15}/></b></div><div className="budget-find-art" aria-hidden="true">{art.map(p=><img {...imageVariants(p.image,'180px')} key={p.id} src={p.image} alt="" width="140" height="160" loading="lazy" decoding="async"/>)}</div></Link>)}</div></section>;
}
