import { useEffect, useState } from "react";
import { useLocation } from "@/lib/navigation";
import { useReducedMotion } from "@/components/SceneMotion";

const capableQuery="(min-width: 900px) and (hover: hover) and (pointer: fine)";

/** One shared, event-driven frame updates visible photographs, never React state on scroll. */
export function useDepthMotion() {
  const {pathname}=useLocation(),reduced=useReducedMotion();
  const [capable,setCapable]=useState(()=>matchMedia(capableQuery).matches);
  useEffect(()=>{const query=matchMedia(capableQuery),change=()=>setCapable(query.matches);query.addEventListener("change",change);return()=>query.removeEventListener("change",change);},[]);
  useEffect(()=>{
    const scope=document.getElementById("main-content");
    if(!scope||reduced||!capable||pathname.startsWith("/admin"))return;
    const nodes=new Set<HTMLElement>(),visible=new Set<HTMLElement>();
    let frame=0;
    const update=()=>{
      frame=0;if(document.hidden)return;
      const height=innerHeight;
      for(const node of visible){
        const box=node.getBoundingClientRect();
        const speed=Number(node.dataset.depthSpeed)||.075,max=Number(node.dataset.depthMax)||20;
        const shift=Math.max(-max,Math.min(max,(height*.5-box.top-box.height*.5)*speed));
        node.style.setProperty("--depth-y",`${shift.toFixed(2)}px`);
        node.dataset.depthActive="true";
      }
    };
    const schedule=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(update);};
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){const node=entry.target as HTMLElement;if(entry.isIntersecting)visible.add(node);else{visible.delete(node);delete node.dataset.depthActive;}}
      schedule();
    },{rootMargin:"80px 0px"});
    const discover=()=>{
      for(const node of nodes)if(!node.isConnected){observer.unobserve(node);nodes.delete(node);visible.delete(node);}
      scope.querySelectorAll<HTMLElement>("[data-depth]").forEach(node=>{if(!nodes.has(node)){nodes.add(node);observer.observe(node);}});
      schedule();
    };
    const visibility=()=>{
      if(document.hidden){cancelAnimationFrame(frame);frame=0;for(const node of nodes)delete node.dataset.depthActive;}
      else schedule();
    };
    const changes=new MutationObserver(discover);changes.observe(scope,{childList:true,subtree:true});
    window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);
    document.addEventListener("visibilitychange",visibility);scope.addEventListener("load",schedule,true);
    discover();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();changes.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);document.removeEventListener("visibilitychange",visibility);scope.removeEventListener("load",schedule,true);for(const node of nodes){node.style.removeProperty("--depth-y");delete node.dataset.depthActive;}};
  },[pathname,reduced,capable]);
}
