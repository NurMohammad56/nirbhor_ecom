import { bnNode } from "./bn";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Banner } from "./data";
import { Button } from "./ui";
import { useReducedMotion, useSceneMotion } from "./SceneMotion";

export default function CinematicHero({ slides }: { slides: Banner[] }) {
  const [slide, setSlide] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [inView, setInView] = useState(true);
  const reduced = useReducedMotion();
  const ref = useSceneMotion();
  const remaining = useRef(3000);
  const index = slide % slides.length;
  const current = slides[index];
  const paused = stopped || reduced || focused || hidden || !inView;
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
        <div className="cinema-bottom container">
          <a className="cinema-scroll" href="#departments" aria-label="ক্যাটাগরি দেখুন"><ArrowDown size={17} /></a>
          <div className="brand-carousel-controls">
            <button className="icon-btn" aria-label={bnNode(stopped || reduced ? "Play hero carousel" : "Pause hero carousel")} aria-pressed={stopped || reduced} disabled={reduced} onClick={() => setStopped(!stopped)}>{bnNode(stopped || reduced ? <Play size={15} /> : <Pause size={15} />)}</button>
            <div className="brand-slide-dots">{bnNode(slides.map((item, i) => <button key={item.id} className={i === index ? "active" : ""} aria-label={bnNode(`Go to slide ${i + 1}`)} aria-current={i === index} onClick={() => setSlide(i)}><span key={`${slide}-${i}`} /></button>))}</div>
            <span>{bnNode(String(index + 1).padStart(2, "0"))} <i>{bnNode("/ ")}{bnNode(String(slides.length).padStart(2, "0"))}</i></span>
            <div><button className="icon-btn" aria-label={bnNode("Previous slide")} disabled={slides.length < 2} onClick={() => setSlide(s => (s - 1 + slides.length) % slides.length)}><ChevronLeft size={18} /></button><button className="icon-btn" aria-label={bnNode("Next slide")} disabled={slides.length < 2} onClick={() => setSlide(s => (s + 1) % slides.length)}><ChevronRight size={18} /></button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
