import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {Star,ArrowUpRight,ChevronLeft,ChevronRight} from 'lucide-react';
import {useStore} from './store';
import {bnNode} from './bn';
import {productHref} from './departments';
import {reviewSourceLabel} from './product-page-content';
import {useAmbientMotion} from './useAmbientMotion';
import {useDragScroll} from './useDragScroll';
import {useReducedMotion} from './SceneMotion';

export default function CustomerVoices({category}:{category?:string}){
 const {reviews,products,categories}=useStore();
 const selected=reviews.filter(r=>r.status==='Approved'&&products.some(p=>p.id===r.productId&&p.status==='Published'&&(!category||p.category===category))).sort((a,b)=>Number(!!b.featured)-Number(!!a.featured)).slice(0,12);
 const ref=useRef<HTMLDivElement>(null),group=useRef<HTMLDivElement>(null),distance=useRef(0),[hover,setHover]=useState(false),[focus,setFocus]=useState(false),reduced=useReducedMotion(),drag=useDragScroll(ref);
 const active=useAmbientMotion(ref,selected.length>1),moving=active&&!hover&&!focus&&!drag.interacting;
 useEffect(()=>{if(!ref.current||!group.current)return;const measure=()=>{distance.current=group.current!.getBoundingClientRect().width+20;};measure();const resize=new ResizeObserver(measure);resize.observe(ref.current);resize.observe(group.current);return()=>resize.disconnect();},[selected.length]);
 useEffect(()=>{if(!moving||!ref.current)return;const node=ref.current;let frame=0,last=0,position=node.scrollLeft;const step=(time:number)=>{if(last){position+=Math.min(time-last,50)*.025;if(distance.current&&position>=distance.current)position-=distance.current;node.scrollLeft=position;}last=time;frame=requestAnimationFrame(step);};frame=requestAnimationFrame(step);return()=>cancelAnimationFrame(frame);},[moving,selected.map(r=>r.id).join(',')]);
 if(!selected.length)return null;
 const step=(direction:number)=>{const node=ref.current;if(!node)return;if(direction<0&&node.scrollLeft<5&&!reduced)node.scrollLeft=distance.current;node.scrollBy({left:direction*((node.querySelector('article') as HTMLElement)?.offsetWidth||400),behavior:reduced?'instant':'smooth'});};
 return <section className="container brand-section customer-voices" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setFocus(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocus(false);}}><div className="brand-section-heading"><h2>ক্রেতাদের অভিজ্ঞতা</h2>{selected.length>1&&<div className="voice-controls"><button type="button" className="icon-btn" aria-label="আগের রিভিউ" onClick={()=>step(-1)}><ChevronLeft size={19}/></button><button type="button" className="icon-btn" aria-label="পরের রিভিউ" onClick={()=>step(1)}><ChevronRight size={19}/></button></div>}</div>
 <div className="customer-voice-window drag-scroll" ref={ref} role="region" aria-label="ক্রেতাদের রিভিউ - টেনে দেখুন" tabIndex={0} data-motion={moving?'playing':'paused'} data-dragging={drag.dragging} {...drag.handlers}><div className="customer-voice-track">{Array.from({length:reduced||selected.length<2?1:2},(_,copy)=><div className="customer-voice-group" ref={copy===0?group:undefined} key={copy} aria-hidden={copy?true:undefined} style={{'--voice-count':Math.min(selected.length,3)} as React.CSSProperties}>{selected.map(review=>{const product=products.find(p=>p.id===review.productId)!;return <article className="customer-voice" key={review.id}><div className="voice-rating" aria-label={`${bnNode(review.rating)} / ৫ রেটিং`}>{Array.from({length:5},(_,i)=><Star key={i} size={14} fill={i<review.rating?'currentColor':'none'}/>)}<span>{reviewSourceLabel(review)}</span></div><h3>{bnNode(review.title)}</h3><p>{bnNode(review.text)}</p><footer><strong>{bnNode(review.name)}</strong><Link to={productHref(product,categories)} tabIndex={copy?-1:undefined}>{bnNode(product.name)}<ArrowUpRight size={14}/></Link></footer></article>;})}</div>)}</div></div></section>;
}
