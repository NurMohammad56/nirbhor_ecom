import {useEffect,useState} from "react";
import type {RefObject} from "react";
import {useReducedMotion} from "@/components/SceneMotion";

export function useAmbientMotion(ref:RefObject<HTMLElement|null>,enabled=true){
 const reduced=useReducedMotion(),[visible,setVisible]=useState(false),[hidden,setHidden]=useState(document.hidden);
 useEffect(()=>{
  if(!enabled)return;
  const node=ref.current;if(!node)return;
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));observer.observe(node);
  const visibility=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',visibility);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);};
 },[ref,enabled]);
 return enabled&&visible&&!hidden&&!reduced;
}
