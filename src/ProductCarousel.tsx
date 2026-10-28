import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, TrendingUp } from "lucide-react";
import { ProductCard } from "./ui";
import type { Product } from "./data";
import { useDragScroll } from "./useDragScroll";
import { useReducedMotion } from "./SceneMotion";

export default function ProductCarousel({ items, title, kicker, label = "পণ্যের স্লাইডার", footnote, className = "", id, bare = false }: { items: Product[]; title?: string; kicker?: string; label?: string; footnote?: string; className?: string; id?: string; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null), reduced = useReducedMotion(), drag = useDragScroll(ref);
  const [hover, setHover] = useState(false), [focus, setFocus] = useState(false), [stopped, setStopped] = useState(false), [visible, setVisible] = useState(false), [hidden, setHidden] = useState(document.hidden);
  const [edges, setEdges] = useState({ start: true, end: true });
  const paused = reduced || hover || focus || stopped || drag.interacting || !visible || hidden;
  const measure = () => { const el = ref.current; if (el) setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 }); };
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const resize = new ResizeObserver(measure); resize.observe(el);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting)); observer.observe(el);
    const visibility = () => setHidden(document.hidden); document.addEventListener("visibilitychange", visibility);
    measure();
    return () => { resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, [items.length]);
  const selection = items.map(p => p.id).join(",");
  useEffect(() => { if (ref.current) ref.current.scrollLeft = 0; measure(); }, [selection]);
  const step = (direction: number, auto = false) => {
    const el = ref.current; if (!el) return;
    const amount = (el.querySelector<HTMLElement>(".product-card")?.offsetWidth || 270) + parseFloat(getComputedStyle(el).columnGap || "20");
    if (auto && el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: amount * direction, behavior: reduced ? "instant" : "smooth" });
  };
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => step(1, true), 3000);
    return () => clearInterval(timer);
  }, [paused, selection]);
  if (!items.length) return null;
  const events = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), onFocusCapture: () => setFocus(true), onBlurCapture: (e: React.FocusEvent<HTMLElement>) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); } };
  const controls = <div className="product-rail-controls"><button className="icon-btn" aria-label="আগের পণ্য" disabled={edges.start} onClick={() => step(-1)}><ChevronLeft size={19}/></button><button className="icon-btn" aria-label={stopped || reduced ? "পণ্যের স্লাইড চালু করুন" : "পণ্যের স্লাইড থামান"} aria-pressed={stopped || reduced} disabled={reduced || (edges.start && edges.end)} onClick={() => setStopped(!stopped)}>{stopped || reduced ? <Play size={14}/> : <Pause size={14}/>}</button><button className="icon-btn" aria-label="পরের পণ্য" disabled={edges.end} onClick={() => step(1)}><ChevronRight size={19}/></button></div>;
  const body = <><div className={bare ? "inline-carousel-controls" : "brand-section-heading"}>{!bare && <div>{kicker && <span className="section-kicker"><TrendingUp size={15}/>{kicker}</span>}<h2>{title}</h2></div>}{controls}</div><div ref={ref} className="product-rail-window drag-scroll" role="region" aria-label={label} tabIndex={0} data-count={Math.min(4, items.length)} data-interval="3000" data-dragging={drag.dragging} data-motion={paused ? "paused" : "playing"} onScroll={measure} {...drag.handlers}>{items.map(p => <ProductCard key={p.id} product={p}/>)}</div><div className="product-rail-footnote"><span>টেনে আরও দেখুন</span>{footnote && <span>{footnote}</span>}</div></>;
  return bare ? <div className={`product-carousel-inline ${className}`} {...events}>{body}</div> : <section id={id} className={`container brand-section product-carousel ${className}`} aria-label={label} {...events}>{body}</section>;
}
