import { useEffect, useRef } from "react";
import type { ReactNode, PointerEvent } from "react";

export default function ProductPhoto({src,alt,children,onSwipe}:{src:string;alt:string;children:ReactNode;onSwipe?:(direction:-1|1)=>void}) {
  const ref=useRef<HTMLDivElement>(null);
  const touch=useRef<{x:number;y:number}|null>(null);
  const reset=()=>{if(ref.current){delete ref.current.dataset.zoomed;ref.current.style.removeProperty('--zoom-x');ref.current.style.removeProperty('--zoom-y');}};
  useEffect(reset,[src]);
  const move=(event:PointerEvent<HTMLDivElement>)=>{
    if(event.pointerType!=="mouse"||!matchMedia('(hover: hover) and (pointer: fine)').matches)return;
    if((event.target as HTMLElement).closest('button')){reset();return;}
    const node=event.currentTarget,bounds=node.getBoundingClientRect();
    node.style.setProperty('--zoom-x',`${Math.max(0,Math.min(100,(event.clientX-bounds.left)/bounds.width*100))}%`);
    node.style.setProperty('--zoom-y',`${Math.max(0,Math.min(100,(event.clientY-bounds.top)/bounds.height*100))}%`);
    node.dataset.zoomed='true';
  };
  return <div ref={ref} className="main-product-photo pointer-product-photo" style={onSwipe?{touchAction:'pan-y pinch-zoom'}:undefined} onPointerDown={e=>{if(e.pointerType==='touch'&&!(e.target as HTMLElement).closest('button'))touch.current={x:e.clientX,y:e.clientY};}} onPointerUp={e=>{const start=touch.current;touch.current=null;if(!start||!onSwipe)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)onSwipe(dx<0?1:-1);}} onPointerMove={move} onPointerLeave={reset} onPointerCancel={()=>{touch.current=null;reset();}}><img src={src} alt={alt} draggable={false}/>{children}</div>;
}
