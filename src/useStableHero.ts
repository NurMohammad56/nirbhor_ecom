import {useLayoutEffect} from "react";
import type {RefObject} from "react";
import {bn} from "./bn";
import {offerDate} from "./promotions";
import type {OfferSlide} from "./offer-merchandising";

/** Reserve the tallest copy before painting; images never determine carousel height. */
export function useStableHero(ref:RefObject<HTMLElement|null>,slides:OfferSlide[]){
  const signature=JSON.stringify(slides.map(s=>[s.id,s.title,s.subtitle,s.badge,s.kicker,s.cta,s.conditions,s.code,s.end]));
  useLayoutEffect(()=>{
    const root=ref.current;if(!root)return;
    let cancelled=false,lastWidth=-1;
    const measure=(force=false)=>{
      if(cancelled)return;
      const copy=root.querySelector<HTMLElement>(".offer-slide-copy"),width=root.getBoundingClientRect().width;
      if(!copy||!width||(!force&&width===lastWidth))return;
      lastWidth=width;
      const clone=copy.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden","true");clone.inert=true;
      Object.assign(clone.style,{position:"absolute",visibility:"hidden",pointerEvents:"none",width:copy.getBoundingClientRect().width+"px",maxWidth:"none",top:"0",left:"0",margin:"0",height:"auto"});
      clone.style.setProperty("min-height","0","important");
      root.appendChild(clone);
      let tallest=0;
      for(const s of slides){
        const heading=clone.querySelector("h1")!;
        heading.replaceChildren(...s.title.split("\n").map(line=>{const span=document.createElement("span");span.textContent=bn(line);return span;}));
        clone.querySelector("p")!.textContent=bn(s.subtitle);
        clone.querySelector(".offer-slide-saving")!.textContent=bn(s.badge);
        clone.querySelector(".offer-slide-kicker")!.textContent=bn(s.kicker);
        const code=clone.querySelector(".offer-slide-code")!;code.replaceChildren();
        if(s.code){const label=document.createElement("span"),value=document.createElement("code");label.textContent="কুপন কোড";value.textContent=s.code;code.append(label,value);}
        const cta=clone.querySelector(".offer-slide-cta")!,arrow=cta.querySelector("svg")?.cloneNode(true);cta.textContent=s.cta;if(arrow)cta.appendChild(arrow);
        clone.querySelector(".offer-slide-conditions")!.textContent=bn(s.conditions)+(s.end?" · মেয়াদ "+new Date(offerDate(s.end,true)).toLocaleDateString("bn-BD",{day:"numeric",month:"short",year:"numeric"}):"");
        tallest=Math.max(tallest,clone.getBoundingClientRect().height);
      }
      clone.remove();
      root.style.setProperty("--hero-copy-height",Math.ceil(tallest)+"px");
      root.dataset.heroStable="true";
    };
    measure(true);
    const observer=new ResizeObserver(()=>measure());observer.observe(root);
    const fonts=()=>measure(true);document.fonts.ready.then(fonts);document.fonts.addEventListener("loadingdone",fonts);
    return()=>{cancelled=true;observer.disconnect();document.fonts.removeEventListener("loadingdone",fonts);};
  },[signature,ref]);
}
