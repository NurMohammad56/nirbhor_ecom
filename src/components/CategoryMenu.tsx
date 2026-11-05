"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link, useLocation } from "@/lib/navigation";
import { Armchair, ArrowUpRight, ChevronDown, Flower2, Footprints, Layers3, Leaf, Monitor, Shirt, Watch, X, Zap } from "lucide-react";
import type { Category, Product } from "@/data/catalog";
import type { Department } from "@/lib/departments";
import { categoryForDepartment, departmentShopHref, experienceForDepartment } from "@/lib/departments";
import { bnNode } from "@/lib/bn";

export function DepartmentSymbol({slug,size=20}:{slug:string;size?:number}) {
  const symbols:Record<string,typeof Leaf>={organic:Leaf,beauty:Flower2,fashion:Shirt,"home-living":Armchair,"smart-life":Zap,sneakers:Footprints,watches:Watch,tech:Monitor};
  const Icon=symbols[slug]||Layers3;
  return <Icon size={size} strokeWidth={1.6}/>;
}

export default function CategoryMenu({departments,categories,products}:{departments:Department[];categories:Category[];products:Product[]}) {
  const [open,setOpen]=useState(false);
  const root=useRef<HTMLDivElement>(null),button=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDivElement>(null);
  const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined),source=useRef<"hover"|"click">("hover");
  const {pathname,search}=useLocation();
  const cancel=()=>{clearTimeout(timer.current);timer.current=undefined;};
  const close=()=>{cancel();setOpen(false);source.current="hover";};
  const leave=()=>{cancel();timer.current=setTimeout(close,160);};
  useEffect(()=>{close();},[pathname,search]);
  useEffect(()=>()=>cancel(),[]);
  useEffect(()=>{
    if(!open)return;
    const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))close();};
    const key=(event:KeyboardEvent)=>{if(event.key==="Escape"){
      const restore=root.current?.contains(document.activeElement);close();if(restore){event.preventDefault();button.current?.focus();}
    }};
    document.addEventListener("pointerdown",outside);document.addEventListener("keydown",key);
    window.addEventListener("scroll",close,{passive:true});window.addEventListener("resize",close);
    return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key);window.removeEventListener("scroll",close);window.removeEventListener("resize",close);};
  },[open]);
  return <div ref={root} className="category-menu" onMouseEnter={cancel} onMouseLeave={leave} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))close();}}>
    <button ref={button} className={`category-menu-trigger ${open?"active":""}`} aria-expanded={open} aria-controls="category-directory"
      onMouseEnter={()=>{cancel();if(!open){source.current="hover";setOpen(true);}}}
      onClick={()=>{if(open&&source.current==="click")close();else{cancel();source.current="click";setOpen(true);}}}
      onKeyDown={event=>{if(event.key==="ArrowDown"){event.preventDefault();cancel();setOpen(true);requestAnimationFrame(()=>panel.current?.querySelector<HTMLAnchorElement>('a')?.focus());}}}>
      <span className="nav-label">{bnNode("Discover")}</span><ChevronDown size={13}/>
    </button>
    {open&&<div ref={panel} id="category-directory" className="category-directory" aria-label="ক্যাটাগরি বেছে নিন" onMouseEnter={cancel}>
      <div className="category-directory-heading"><div><span>আপনার পছন্দ, এক জায়গায়</span><strong>কী খুঁজছেন?</strong></div><button className="icon-btn" aria-label="ক্যাটাগরি মেনু বন্ধ করুন" onClick={()=>{close();button.current?.focus();}}><X size={18}/></button></div>
      <div className="category-directory-grid">
        {departments.map(d=>{
          const category=categoryForDepartment(d,categories),exp=experienceForDepartment(d,categories);
          return <section className="category-directory-group" key={d.slug} style={{"--menu-accent":exp.accent,"--menu-tint":exp.background} as CSSProperties}>
            <Link className="category-directory-parent" to={'/'+d.slug}><span className="department-symbol"><DepartmentSymbol slug={d.slug}/></span><span><strong>{bnNode(d.name==="Home"?"Home & living":d.name)}</strong><small>{bnNode(products.filter(p=>p.category===category?.name&&p.status==="Published").length)}টি পণ্য</small></span><ArrowUpRight size={15}/></Link>
            <div className="category-directory-links">{categories.filter(c=>c.parent===category?.name&&c.active).sort((a,b)=>a.sort-b.sort).map(c=><Link key={c.id} to={departmentShopHref(d,c.name)}>{bnNode(c.name)}</Link>)}</div>
          </section>;
        })}
      </div>
      <div className="category-directory-footer"><Link to="/shop">সব পণ্য দেখুন<ArrowUpRight size={15}/></Link><Link to="/offers">আজকের অফার<ArrowUpRight size={15}/></Link></div>
    </div>}
  </div>;
}
