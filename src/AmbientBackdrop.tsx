import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./SceneMotion";

type Mood = "organic" | "beauty" | "fashion" | "home-living" | "main";
const pictures: Record<Mood, [string, string]> = {
  organic: ["organic", "organic"],
  beauty: ["beauty", "beauty"],
  fashion: ["fashion", "fashion"],
  "home-living": ["home", "home"],
  main: ["organic", "home"],
};

/** Decorations stay behind the content and never intercept shopping gestures. */
export default function AmbientBackdrop({ kind = "main" }: { kind?: string }) {
  const ref = useRef<HTMLDivElement>(null), reduced = useReducedMotion();
  const [hidden, setHidden] = useState(document.hidden);
  const mood = Object.hasOwn(pictures, kind) ? kind as Mood : "main";
  useEffect(() => {
    const node = ref.current; if (!node) return;
    const observer = new IntersectionObserver(entries => { for (const entry of entries) (entry.target as HTMLElement).dataset.visible = String(entry.isIntersecting); }, { rootMargin: "120px" });
    node.querySelectorAll("img").forEach(image => observer.observe(image));
    const visibility = () => setHidden(document.hidden); document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return <div ref={ref} className={`ambient-backdrop ambient-${mood}`} aria-hidden="true" data-active={!hidden && !reduced}>
    {pictures[mood].map((picture, i) => <img key={i} className={`ambient-art ambient-art-${i + 1}`} src={`/assets/ambient-${picture}-v1.webp`} alt="" loading="lazy" decoding="async" draggable={false}/>)}
  </div>;
}
