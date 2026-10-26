import { bnNode } from "./bn";
import { useEffect, useRef, useState } from "react";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return reduced;
}

// Update only a CSS property per animation frame; scrolling never re-renders the page.
export function useSceneMotion() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const scene = ref.current;
    if (!scene || reduced) {
      scene?.style.setProperty("--scene-shift", "0px");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = scene.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < window.innerHeight)
        scene.style.setProperty("--scene-shift", `${Math.min(100, Math.max(-60, -bounds.top * 0.16))}px`);
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
    };
  }, [reduced]);
  return ref;
}

export function Botanical({ kind = "leaf", className = "" }: { kind?: "leaf" | "dry"; className?: string }) {
  return <img className={`botanical botanical-${kind} ${className}`} src={`/assets/${kind === "leaf" ? "botanical-branch" : "dried-stem"}-v3.webp`} alt={bnNode("")} aria-hidden="true" loading="lazy" />;
}
