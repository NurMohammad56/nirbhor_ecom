import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { bnNode } from "./bn";
import { useReducedMotion } from "./SceneMotion";

export type CategoryRailItem = { id: string; name: string; image: string; to: string; department?: boolean };

export default function CategoryRail({ items, label = "ক্যাটাগরি" }: { items: CategoryRailItem[]; label?: string }) {
  const windowRef = useRef<HTMLDivElement>(null), groupRef = useRef<HTMLDivElement>(null), distance = useRef(0);
  const [copies, setCopies] = useState(2), [hovered, setHovered] = useState(false), [focused, setFocused] = useState(false), [stopped, setStopped] = useState(false), [inView, setInView] = useState(false), [hidden, setHidden] = useState(document.hidden);
  const reduced = useReducedMotion();
  const paused = reduced || hovered || focused || stopped || !inView || hidden;
  useEffect(() => {
    const viewport = windowRef.current, group = groupRef.current;
    if (!viewport || !group) return;
    const measure = () => {
      distance.current = group.getBoundingClientRect().width + 18;
      setCopies(Math.max(2, Math.ceil(viewport.clientWidth / Math.max(1, distance.current)) + 1));
    };
    measure();
    const resize = new ResizeObserver(measure); resize.observe(viewport); resize.observe(group);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting)); observer.observe(viewport);
    const visibility = () => setHidden(document.hidden); document.addEventListener("visibilitychange", visibility);
    return () => { resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, [items.length]);
  useEffect(() => {
    const viewport = windowRef.current;
    if (!viewport || paused || !items.length) return;
    let frame = 0, last = 0, position = viewport.scrollLeft;
    const move = (time: number) => {
      if (last) {
        position += Math.min(time - last, 50) * .032;
        if (distance.current && position >= distance.current) position -= distance.current;
        viewport.scrollLeft = position;
      }
      last = time; frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [paused, items.length]);
  if (!items.length) return null;
  const step = (direction: number) => {
    const viewport = windowRef.current;
    if (!viewport) return;
    if (direction < 0 && viewport.scrollLeft < 10 && !reduced) viewport.scrollLeft = distance.current;
    viewport.scrollBy({ left: direction * 230, behavior: reduced ? "instant" : "smooth" });
  };
  return <div className="category-rail" aria-label={label} onTouchStart={() => setStopped(true)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="category-rail-window" ref={windowRef} data-motion={paused ? "paused" : "playing"}>
      <div className="category-rail-track">
        {Array.from({ length: reduced ? 1 : copies }, (_, copy) => <div className="category-rail-group" ref={copy === 0 ? groupRef : undefined} key={copy} aria-hidden={copy ? true : undefined}>
          {items.map(item => <Link className={`category-rail-card ${item.department && copy === 0 ? "brand-department-card" : ""}`} to={item.to} key={item.id} tabIndex={copy ? -1 : undefined}>
            <div className="category-rail-image"><img src={item.image} alt="" loading="lazy" /><span><ArrowUpRight size={17} /></span></div>
            <strong>{bnNode(item.name)}</strong>
          </Link>)}
        </div>)}
      </div>
    </div>
    <div className="category-rail-controls"><span>ক্যাটাগরি বেছে নিন</span><div>
      <button className="icon-btn" aria-label="আগের ক্যাটাগরি" onClick={() => step(-1)}><ChevronLeft size={18} /></button>
      <button className="icon-btn rail-pause" aria-label={stopped || reduced ? "ক্যাটাগরি স্লাইড চালু করুন" : "ক্যাটাগরি স্লাইড থামান"} aria-pressed={stopped || reduced} disabled={reduced} onClick={() => setStopped(!stopped)}>{stopped || reduced ? <Play size={14} /> : <Pause size={14} />}</button>
      <button className="icon-btn" aria-label="পরের ক্যাটাগরি" onClick={() => step(1)}><ChevronRight size={18} /></button>
    </div></div>
  </div>;
}
