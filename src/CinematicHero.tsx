import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, TicketPercent } from "lucide-react";
import { bnNode } from "./bn";
import { useReducedMotion } from "./SceneMotion";
import { rememberOffer } from "./offer-merchandising";
import { offerDate } from "./promotions";
import type { OfferSlide } from "./offer-merchandising";
import { money } from "./data";
import { useStableHero } from "./useStableHero";

export default function CinematicHero({slides,department=false}:{slides:OfferSlide[];department?:boolean}){
  const [slide,setSlide]=useState(0),[focused,setFocused]=useState(false),[hovered,setHovered]=useState(false),[hidden,setHidden]=useState(document.hidden),[visible,setVisible]=useState(true);
  const ref=useRef<HTMLElement>(null),remaining=useRef(3000),reduced=useReducedMotion(),index=slides.length?slide%slides.length:0,current=slides[index],paused=reduced||focused||hovered||hidden||!visible;
  useStableHero(ref,slides);
  useEffect(()=>{const visibility=()=>setHidden(document.hidden);document.addEventListener("visibilitychange",visibility);const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));if(ref.current)observer.observe(ref.current);return()=>{observer.disconnect();document.removeEventListener("visibilitychange",visibility);};},[]);
  useEffect(()=>{remaining.current=3000;},[slide]);
  useEffect(()=>{if(paused||slides.length<2)return;const started=performance.now(),timer=setTimeout(()=>setSlide(n=>(n+1)%slides.length),remaining.current);return()=>{clearTimeout(timer);remaining.current=Math.max(0,remaining.current-(performance.now()-started));};},[paused,slide,slides.length]);
  if(!current)return <section className="offer-slider no-live-offers"><div className="offer-slide-copy"><span className="offer-slide-kicker">নির্ভর</span><h1>আপনার পছন্দের<br/>নতুন খোঁজ</h1><p>নতুন অফার চালু হলে এখানে দেখা যাবে। আপাতত কালেকশন ঘুরে দেখুন।</p><Link className="btn" to="/shop">পণ্য দেখুন<ArrowUpRight size={17}/></Link></div></section>;
  return <section ref={ref} className={`cinematic-shell offer-slider ${department?"department-offer-slider category-campaign-hero":"home-offer-slider"} creative-${current.creative||"campaign"} campaign-${current.departmentSlug||"main"} ${paused?"motion-paused":""}`} data-source={current.source} data-motion={paused?"paused":"playing"} data-interval="3000" aria-roledescription="স্লাইডার" aria-label={department?"ক্যাটাগরির অফার":"নির্ভরের চলতি অফার"} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false);}}>
    <div className="offer-slider-backdrop" aria-hidden="true"><i/><i/><i/></div>
    <div className="offer-slider-art cinema-scene-stack" aria-hidden="true">{slides.map((item,i)=><div key={item.id} className={`cinema-scene ${i===index?"is-active":""}`}><img src={item.image} alt="" fetchPriority={i===0?"high":"auto"} loading={i===0?"eager":"lazy"}/></div>)}</div>
    <div className="offer-slide-copy brand-hero-copy" key={current.id}><span className="offer-slide-kicker"><TicketPercent size={15}/>{bnNode(current.kicker)}</span><div className="offer-slide-saving">{bnNode(current.badge)}</div><h1>{current.title.split("\n").map((line,i)=><span key={i}>{bnNode(line)}</span>)}</h1><p>{bnNode(current.subtitle)}</p>{current.creative==="spotlight"&&current.products?.[0]&&<div className="hero-feature-price"><b>{bnNode(money(current.products[0].price))}</b>{current.products[0].oldPrice>current.products[0].price&&<del>{bnNode(money(current.products[0].oldPrice))}</del>}</div>}<div className="offer-slide-code">{current.code&&<><span>কুপন কোড</span><code>{current.code}</code></>}</div><div className="brand-hero-actions"><Link className="btn offer-slide-cta" to={current.link} onClick={()=>rememberOffer(current.code)}>{current.cta}<ArrowUpRight size={17}/></Link></div><small className="offer-slide-conditions">{bnNode(current.conditions)}{current.end && <> · মেয়াদ {new Date(offerDate(current.end,true)).toLocaleDateString("bn-BD",{day:"numeric",month:"short",year:"numeric"})}</>}</small></div>
    {department&&current.creative!=="spotlight"&&!!current.products?.length&&<div className="hero-product-picks" aria-label="ব্যানারের কালেকশন থেকে পণ্য">{current.products.slice(0,2).map(p=><Link key={p.id} className="hero-product-pick" to={p.href+(current.code?"?coupon="+encodeURIComponent(current.code):"")} onClick={()=>rememberOffer(current.code)}><img src={p.image} alt=""/><span><small>{bnNode(p.name)}</small><b>{bnNode(money(p.price))}</b></span><ArrowUpRight size={14}/></Link>)}</div>}
    <div className="offer-slider-bottom"><span>{bnNode(String(index+1).padStart(2,"0"))}<i/> {bnNode(String(slides.length).padStart(2,"0"))}</span><div className="cinema-arrows"><button type="button" aria-label={bnNode("Previous slide")} disabled={slides.length<2} onClick={()=>setSlide(n=>(n-1+slides.length)%slides.length)}><ChevronLeft size={18}/></button><button type="button" aria-label={bnNode("Next slide")} disabled={slides.length<2} onClick={()=>setSlide(n=>(n+1)%slides.length)}><ChevronRight size={18}/></button></div></div>
  </section>;
}
