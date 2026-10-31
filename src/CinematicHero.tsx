import { bnNode } from "./bn";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "./data";
import { Button } from "./ui";
import { useReducedMotion, useSceneMotion } from "./SceneMotion";

export default function CinematicHero({ slides }: { slides: Banner[] }) {
  const [slide, setSlide] = useState(0);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [inView, setInView] = useState(true);
  const reduced = useReducedMotion();
  const ref = useSceneMotion();
  const remaining = useRef(3000);
  const index = slide % slides.length;
  const current = slides[index];
  const paused = reduced || focused || hidden || !inView;
  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => { document.removeEventListener("visibilitychange", visibility); observer.disconnect(); };
  }, [ref]);
  useEffect(() => { remaining.current = 3000; }, [slide]);
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const started = performance.now();
    const timer = window.setTimeout(() => setSlide(s => (s + 1) % slides.length), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [paused, slide, slides.length]);
  return (
    <section ref={ref} className={`brand-hero-wrap cinematic-shell ${paused ? "motion-paused" : ""}`} aria-label={bnNode("Welcome to Nirbhor")} aria-roledescription="স্লাইডার"
      onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
      <div className="brand-hero cinematic-hero">
        <div className="cinema-scene-stack" aria-hidden="true">
          {bnNode(slides.map((item, i) => <div key={item.id} className={`cinema-scene ${i === index ? "is-active" : ""}`}><img src={item.image} alt={bnNode("")} fetchPriority={i === 0 ? "high" : "auto"} loading={i === 0 ? "eager" : "lazy"} /></div>))}
        </div>
        <div className="cinema-shade" />
        <div className="brand-hero-copy container" key={current.id}>
          <h1>{bnNode(current.title.split("\n").map((line, i) => <span key={i}>{bnNode(line)}</span>))}</h1>
          <p>{bnNode(current.subtitle)}</p>
          <div className="brand-hero-actions"><Button to={current.link}>{bnNode(current.cta)}<ArrowUpRight size={19} /></Button><Link to="/offers" className="brand-underlined">{bnNode("Discover the offers ")}<ArrowUpRight size={17} /></Link></div>
        </div>
        <div className="cinema-arrows container">
          <button className="icon-btn" aria-label={bnNode("Previous slide")} disabled={slides.length < 2} onClick={() => setSlide(s => (s - 1 + slides.length) % slides.length)}><ChevronLeft size={19}/></button>
          <button className="icon-btn" aria-label={bnNode("Next slide")} disabled={slides.length < 2} onClick={() => setSlide(s => (s + 1) % slides.length)}><ChevronRight size={19}/></button>
        </div>
        {['/sneakers','/watches'].includes(current.link)&&<div className="cinema-showcase container"><span>ডিজিটাল শোকেস</span></div>}
      </div>
    </section>
  );
}
