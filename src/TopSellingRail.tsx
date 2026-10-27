import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, TrendingUp } from "lucide-react";
import { useStore } from "./store";
import { bnNode } from "./bn";
import { ProductCard } from "./ui";
import { bestSelling, productSales } from "./best-selling";
import { descendants } from "./category-tree";
import { useDragScroll } from "./useDragScroll";
import { useReducedMotion } from "./SceneMotion";

export default function TopSellingRail({ category }: { category: string }) {
  const { products, orders, categories } = useStore();
  const names = descendants(categories, category); names.add(category);
  const items = bestSelling(products.filter(p => names.has(p.category)), orders);
  const sales = productSales(orders), hasSales = items.some(p => (sales.get(p.id) || 0) > 0);
  const ref = useRef<HTMLDivElement>(null), reduced = useReducedMotion(), drag = useDragScroll(ref);
  const [hover, setHover] = useState(false), [focus, setFocus] = useState(false), [stopped, setStopped] = useState(false), [visible, setVisible] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: true });
  const paused = reduced || hover || focus || stopped || drag.interacting || !visible;
  const measure = () => { const el = ref.current; if (el) setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 }); };
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const resize = new ResizeObserver(measure); resize.observe(el);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting)); observer.observe(el);
    measure();
    return () => { resize.disconnect(); observer.disconnect(); };
  }, [category, items.length]);
  useEffect(() => { if (ref.current) ref.current.scrollLeft = 0; measure(); }, [category]);
  const step = (direction: number, auto = false) => {
    const el = ref.current; if (!el) return;
    const card = el.querySelector<HTMLElement>(".product-card");
    const amount = (card?.offsetWidth || 270) + 20;
    if (auto && el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: amount * direction, behavior: reduced ? "instant" : "smooth" });
  };
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => { if (!document.hidden) step(1, true); }, 5000);
    return () => clearInterval(timer);
  }, [paused, category, items.length]);
  if (!items.length) return null;
  return <section className="container brand-section top-selling-section" aria-label="জনপ্রিয় পণ্য" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocusCapture={() => setFocus(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); }}>
    <div className="brand-section-heading">
      <div><span className="section-kicker"><TrendingUp size={15}/>আপনার জন্য বাছাই</span><h2>{hasSales ? "বেশি অর্ডার হওয়া পণ্য" : "পছন্দের তালিকায় রাখুন"}</h2></div>
      <div className="product-rail-controls">
        <button className="icon-btn" aria-label="আগের পণ্য" disabled={edges.start} onClick={() => step(-1)}><ChevronLeft size={19}/></button>
        <button className="icon-btn" aria-label={stopped || reduced ? "পণ্যের স্লাইড চালু করুন" : "পণ্যের স্লাইড থামান"} aria-pressed={stopped || reduced} disabled={reduced || (edges.start && edges.end)} onClick={() => setStopped(!stopped)}>{stopped || reduced ? <Play size={14}/> : <Pause size={14}/>}</button>
        <button className="icon-btn" aria-label="পরের পণ্য" disabled={edges.end} onClick={() => step(1)}><ChevronRight size={19}/></button>
      </div>
    </div>
    <div ref={ref} className="product-rail-window drag-scroll" role="region" aria-label={bnNode(category) + " - জনপ্রিয় পণ্যের স্লাইডার"} tabIndex={0} data-dragging={drag.dragging} data-motion={paused ? "paused" : "playing"} onScroll={measure} {...drag.handlers}>
      {items.map(p => <ProductCard key={p.id} product={p}/>)}
    </div>
    <div className="product-rail-footnote"><span>টেনে আরও দেখুন</span>{hasSales && <span>এই ব্রাউজারে সংরক্ষিত অর্ডার অনুযায়ী</span>}</div>
  </section>;
}
