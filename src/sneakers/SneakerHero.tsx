import { useEffect, useRef, useState } from "react";
import type { PointerEvent, SyntheticEvent } from "react";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { DepartmentExperience, Product } from "../data";
import { itemPrice, money } from "../data";
import { bnNode } from "../bn";
import { useStore } from "../store";
import { productHref } from "../departments";
import { useReducedMotion } from "../SceneMotion";
import QuickOrderButton from "../QuickOrderButton";

const photographs: Record<string, string> = {
  "/assets/style-sneaker-terra-v1.webp": "/assets/sneaker-campaign/terra-v2.webp",
  "/assets/style-sneaker-court-v1.webp": "/assets/sneaker-campaign/court-v2.webp",
  "/assets/style-sneaker-urban-v1.webp": "/assets/sneaker-campaign/urban-v2.webp",
};
const priority = ["sneaker-terra", "sneaker-court", "sneaker-urban"];
const defaultHero = "/assets/style-sneakers-hero-v1.webp";
const campaignImage = (product: Product) => photographs[product.image] || product.image;
function photoFallback(event: SyntheticEvent<HTMLImageElement>, product: Product) {
  if (event.currentTarget.getAttribute("src") !== product.image) event.currentTarget.src = product.image;
}

export default function SneakerHero({ experience: exp, shopHref, categoryName }: { experience: DepartmentExperience; shopHref: string; categoryName: string }) {
  const { products, categories } = useStore();
  const options = products.filter(product => product.category === categoryName && product.status === "Published").sort((a, b) => {
    const rank = (id: string) => priority.includes(id) ? priority.indexOf(id) : priority.length;
    return rank(a.id) - rank(b.id);
  }).slice(0, 3);
  const [selectedId, setSelectedId] = useState("sneaker-terra"), [photoView, setPhotoView] = useState(exp.heroImage !== defaultHero), [paused, setPaused] = useState(false), [inView, setInView] = useState(false), [hidden, setHidden] = useState(document.hidden);
  const selected = options.find(product => product.id === selectedId) || options[0], index = selected ? options.indexOf(selected) : -1;
  const frame = useRef<HTMLElement>(null), art = useRef<HTMLAnchorElement>(null), reduced = useReducedMotion();
  useEffect(() => {
    const node = frame.current; if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting)); observer.observe(node);
    const visibility = () => setHidden(document.hidden); document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => { setPhotoView(exp.heroImage !== defaultHero); }, [exp.heroImage]);
  const moving = !paused && !reduced && !hidden && inView && !photoView;
  function resetTilt() {
    const node = art.current; if (!node) return;
    for (const name of ["--shoe-x", "--shoe-y", "--shoe-rx", "--shoe-ry"]) node.style.removeProperty(name);
  }
  useEffect(() => { if (!moving) resetTilt(); }, [moving]);
  function tilt(event: PointerEvent<HTMLAnchorElement>) {
    if (!moving || event.pointerType !== "mouse") return;
    const node = event.currentTarget, bounds = node.getBoundingClientRect(), x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2)), y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
    node.style.setProperty("--shoe-x", `${x * 9}px`); node.style.setProperty("--shoe-y", `${y * 6}px`); node.style.setProperty("--shoe-rx", `${-y * 4}deg`); node.style.setProperty("--shoe-ry", `${x * 6}deg`);
  }
  const lines = exp.heroTitle.split("\n").filter(Boolean), title = lines.length > 2 ? [lines[0], lines.slice(1).join(" ")] : lines;
  const choose = (direction: number) => { if (options.length) setSelectedId(options[(index + direction + options.length) % options.length].id); };
  return <section ref={frame} className="sneaker-campaign" aria-labelledby="sneaker-hero-title" data-view={photoView || !selected ? "photo" : "product"} data-motion={moving ? "playing" : "paused"}>
    <div className="campaign-frame">
      <svg className="campaign-contours" viewBox="0 0 1320 720" preserveAspectRatio="none" aria-hidden="true"><path d="M-120 265C260 238 234-117 539-91M1397 53C913 95 1055 464 731 747M-61 660C352 407 188 784 658 817M924-113C828 151 344 79 436 820"/></svg>
      <div className="campaign-topbar">
        <nav className="campaign-breadcrumb" aria-label="পথ নির্দেশনা"><Link to="/">নির্ভর</Link><span>/</span><Link to={shopHref}>স্নিকার্স</Link></nav>
        <Link className="campaign-all-link" to={shopHref}>সম্পূর্ণ কালেকশন<ArrowUpRight size={15}/></Link>
        <button className="campaign-photo-toggle" type="button" aria-pressed={photoView} onClick={() => setPhotoView(value => !value)}>{photoView ? "ফিচার্ড পণ্য" : "কালেকশনের ছবি"}<ArrowUpRight size={14}/></button>
      </div>
      <div className="campaign-scene">
        <span className="campaign-watermark" aria-hidden="true">স্নিকার্স</span>
        <h1 className={`campaign-title ${exp.heroTitle.length > 35 ? "long-title" : ""}`} id="sneaker-hero-title">{title.map((line, i) => <span key={i}>{bnNode(line)}</span>)}</h1>
        <div className="department-immersive-media campaign-collection-photo" aria-hidden={!photoView}><img src={exp.heroImage} alt="স্নিকার্স কালেকশনের ছবি" fetchPriority={photoView ? "high" : "low"}/></div>
        {selected && <>
          <Link ref={art} className={`campaign-art ${photographs[selected.image] ? "has-cutout" : "has-merchant-photo"}`} to={productHref(selected, categories)} aria-label={`${selected.name} - বিস্তারিত ও সাইজ দেখুন`} onPointerMove={tilt} onPointerLeave={resetTilt} onPointerCancel={resetTilt}>
            <div className="campaign-float"><img key={selected.id} className="campaign-shoe" src={campaignImage(selected)} alt={selected.name} width="1536" height="1536" fetchPriority="high" draggable={false} onError={event => photoFallback(event, selected)}/></div>
          </Link>
          <span className="campaign-design-label">{bnNode(selected.subcategory)}<i/></span>
          <div className="campaign-product-info" aria-live="polite" aria-atomic="true"><div>{selected.badge && <span>{bnNode(selected.badge)}</span>}<strong>{bnNode(money(itemPrice(selected, selected.weight)))}</strong>{selected.oldPrice > itemPrice(selected, selected.weight) && <del>{bnNode(money(selected.oldPrice))}</del>}</div><h2>{bnNode(selected.name)}</h2></div>
        </>}
        <div className="campaign-index" aria-hidden="true"><span>{bnNode(String(Math.max(0, index + 1)).padStart(2, "0"))}</span><i/><span>{bnNode(String(options.length).padStart(2, "0"))}</span></div>
      </div>
      <div className="campaign-bottom">
        <div className="campaign-style-picker"><span>পছন্দের স্টাইল</span><div className="campaign-thumbnails" role="group" aria-label="ফিচার্ড স্নিকার্স বেছে নিন">{options.map(product => <button key={product.id} type="button" aria-label={product.name} title={product.name} aria-pressed={selected?.id === product.id} onClick={() => { setSelectedId(product.id); setPhotoView(false); resetTilt(); }}><img src={campaignImage(product)} alt="" loading="eager" draggable={false} onError={event => photoFallback(event, product)}/></button>)}</div></div>
        <div className="campaign-actions">{selected ? <><Link className="campaign-details-button" to={productHref(selected, categories)}>সাইজ বেছে নিন<ArrowUpRight size={17}/></Link><QuickOrderButton key={selected.id} product={selected} variant={selected.weight}/></> : <Link className="campaign-details-button" to={shopHref}>কালেকশন দেখুন<ArrowUpRight size={17}/></Link>}</div>
        <div className="campaign-editorial"><span>আপনার পরের জোড়া</span><p>{bnNode(exp.description)}</p></div>
      </div>
      <div className="campaign-footline"><a href="#department-collections">স্টাইলগুলো দেখুন<ArrowDown size={13}/></a><div className="campaign-playback"><button type="button" aria-label={paused ? "অ্যানিমেশন চালু করুন" : "অ্যানিমেশন থামান"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={14}/> : <Pause size={14}/>}</button>{options.length > 1 && <><button type="button" aria-label="আগের স্নিকার্স" onClick={() => choose(-1)}><ChevronLeft size={18}/></button><button type="button" aria-label="পরের স্নিকার্স" onClick={() => choose(1)}><ChevronRight size={18}/></button></>}</div></div>
    </div>
  </section>;
}
