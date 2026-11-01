import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, MoveHorizontal, Pause, Play, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import type { DepartmentExperience } from "../data";
import type { ShoeScene } from "./shoe-scene";
import { bn } from "../bn";

export default function SneakerHero({ experience: exp, shopHref }: { experience: DepartmentExperience; shopHref: string }) {
  const host = useRef<HTMLDivElement>(null), controller = useRef<ShoeScene | null>(null);
  const [mode, setMode] = useState<"studio" | "photo">("studio"), [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading"), [variant, setVariant] = useState(0), [paused, setPaused] = useState(false), [attempt, setAttempt] = useState(0);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; controller.current?.setPaused(paused); }, [paused]);
  useEffect(() => {
    if (mode !== "studio" || !host.current) return;
    const node = host.current, abort = new AbortController(); let scene: ShoeScene | undefined, timeout = 0;
    setStatus("loading");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return; observer.disconnect();
      timeout = window.setTimeout(() => { setStatus("fallback"); abort.abort(); }, 15000);
      import("./shoe-scene").then(module => { if (abort.signal.aborted) return; return module.createShoeScene(node, abort.signal, () => { clearTimeout(timeout); if (!abort.signal.aborted) setStatus("ready"); }, () => { clearTimeout(timeout); if (!abort.signal.aborted) setStatus("fallback"); }); }).then(result => {
        if (!result) return; if (abort.signal.aborted) { result.dispose(); return; } scene = result; controller.current = result; result.setPaused(pausedRef.current); result.variant(0); setVariant(0);
      }).catch(() => { clearTimeout(timeout); if (!abort.signal.aborted) setStatus("fallback"); });
    }, { rootMargin: "100px" }); observer.observe(node);
    return () => { clearTimeout(timeout); observer.disconnect(); abort.abort(); scene?.dispose(); controller.current = null; };
  }, [mode, attempt]);
  function handlePreviewKey(event: KeyboardEvent<HTMLDivElement>) {
    if (status !== "ready") return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault(); controller.current?.rotate(event.key === "ArrowLeft" ? -.5 : .5);
    } else if (event.key === "Home") { event.preventDefault(); controller.current?.reset(); }
  }
  return <section className="sneaker-studio-hero" aria-labelledby="sneaker-hero-title">
    <div className="container sneaker-studio-top"><nav aria-label="পথ নির্দেশনা"><Link to="/">নির্ভর</Link><ChevronRight size={12}/><span>স্নিকার্স</span></nav><span className="sneaker-studio-edition">আপনার পরের জোড়া</span></div>
    <div className="container sneaker-studio-layout">
      <div className="sneaker-studio-copy"><span className="sneaker-studio-eyebrow"><i/> স্নিকার্স স্টুডিও</span><h1 id="sneaker-hero-title">{exp.heroTitle.split("\n").map((line, index) => <span key={index}>{bn(line)}</span>)}</h1><p>{bn(exp.description)}</p><div className="sneaker-studio-links"><Link className="sneaker-shop-button" to={shopHref}>জোড়া বেছে নিন<ArrowUpRight size={20}/></Link><a href="#department-collections">স্টাইলগুলো দেখুন<ChevronRight size={16}/></a></div><div className="sneaker-studio-note"><span>০১ /</span><p>দেখুন। পছন্দ করুন।<br/>সাইজ মিলিয়ে নিজেরটি বেছে নিন।</p></div></div>
      <div className="sneaker-studio-visual" data-view={mode} data-render-state={status}>
        <div className="sneaker-studio-toolbar"><div className="sneaker-view-tabs" role="group" aria-label="হিরো ভিউ"><button type="button" aria-pressed={mode === "studio"} onClick={() => setMode("studio")}>৩ডি ভিউ</button><button type="button" aria-pressed={mode === "photo"} onClick={() => setMode("photo")}>কালেকশনের ছবি</button></div>{mode === "studio" && status === "ready" && <button className="sneaker-motion-toggle" type="button" aria-label={paused ? "অ্যানিমেশন চালু করুন" : "অ্যানিমেশন থামান"} title={paused ? "অ্যানিমেশন চালু করুন" : "অ্যানিমেশন থামান"} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>}</div>
        <div className="sneaker-stage">
          <div className="sneaker-stage-orbit" aria-hidden="true"/>
          <span className="sneaker-stage-type" aria-hidden="true">স্নিকার্স</span>
          <div className="department-immersive-media sneaker-studio-poster"><img src={exp.heroImage} alt="স্নিকার্স কালেকশনের ডিজিটাল শোকেস" fetchPriority="high"/></div>
          {mode === "studio" && <div ref={host} className="sneaker-canvas" role="img" tabIndex={status === "ready" ? 0 : -1} aria-label="স্নিকার্সের থ্রিডি ডিজাইন প্রিভিউ। টেনে অথবা বাম ও ডান অ্যারো কী দিয়ে ঘোরান। Home কী দিয়ে শুরুতে ফিরুন।" onKeyDown={handlePreviewKey}/>}
          {mode === "studio" && status !== "ready" && <div className="sneaker-load-status"><span role="status">{status === "loading" ? "৩ডি ভিউ তৈরি হচ্ছে…" : "এখন কালেকশনের ছবি দেখছেন"}</span>{status === "fallback" && <button type="button" onClick={() => setAttempt(value => value + 1)}>আবার চেষ্টা করুন<RotateCcw size={13}/></button>}</div>}
        </div>
        <div className="sneaker-studio-controls">
          {mode === "studio" && status === "ready" ? <><div className="sneaker-swatches" role="group" aria-label="প্রিভিউর রং">{["মিডনাইট", "বিচ", "স্ট্রিট"].map((name, i) => <button key={name} type="button" className={`sneaker-swatch swatch-${i}`} aria-label={name} title={name} aria-pressed={variant === i} onClick={() => { controller.current?.variant(i); setVariant(i); }}/>)}</div><span className="sneaker-drag-hint"><MoveHorizontal size={16}/>টেনে ঘুরিয়ে দেখুন</span><div className="sneaker-rotate-controls" role="group" aria-label="প্রিভিউ ঘোরান"><button type="button" aria-label="স্নিকার্স বামে ঘোরান" onClick={() => controller.current?.rotate(-.5)}><ChevronLeft size={18}/></button><button type="button" aria-label="প্রিভিউ শুরুতে নিন" onClick={() => controller.current?.reset()}><RotateCcw size={16}/></button><button type="button" aria-label="স্নিকার্স ডানে ঘোরান" onClick={() => controller.current?.rotate(.5)}><ChevronRight size={18}/></button></div></> : <span className="digital-showcase-label">নির্ভর অনলাইন সংগ্রহের ডিজিটাল শোকেস</span>}
        </div>
        <div className="sneaker-studio-caption">{mode === "studio" && status === "ready" ? <><span className="digital-showcase-label">ডিজিটাল শোকেস - ৩ডি ডিজাইন কনসেপ্ট</span><a href="/assets/sneakers-studio/credits.html" target="_blank" rel="noreferrer">মডেল ক্রেডিট ↗</a></> : <span>পণ্যের সঠিক ছবি ও তথ্য নিচের কালেকশনে দেখুন।</span>}</div>
      </div>
    </div>
    <div className="sneaker-studio-baseline" aria-hidden="true"><span>কোর্ট / স্ট্রিট / এভরিডে</span><span>নিজের ছন্দ। নিজের স্টাইল।</span><ArrowUpRight size={22}/></div>
  </section>;
}
