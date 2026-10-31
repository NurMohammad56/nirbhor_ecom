import { useEffect, useRef } from "react";
import type { ReactNode, PointerEvent } from "react";

export default function ProductPhoto({src,alt,children}:{src:string;alt:string;children:ReactNode}) {
  const ref=useRef<HTMLDivElement>(null);
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
  return <div ref={ref} className="main-product-photo pointer-product-photo" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}><img src={src} alt={alt} draggable={false}/>{children}</div>;
}
