import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "./SceneMotion";

export function usePageReveal() {
  const location = useLocation(), reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) { document.documentElement.classList.remove("reveal-ready"); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-revealed"); observer.unobserve(entry.target); }
    }), { rootMargin: "0px 0px 30px", threshold: .04 });
    const watch = () => document.querySelectorAll<HTMLElement>(".brand-section,.brand-story,.offers-section,.studio-offer-card,.product-reviews").forEach(el => {
      if (!el.hasAttribute("data-reveal")) { el.dataset.reveal = ""; if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-revealed"); else observer.observe(el); }
    });
    document.documentElement.classList.add("reveal-ready"); watch();
    const changes = new MutationObserver(watch); changes.observe(document.getElementById("main-content")!, { childList: true, subtree: true });
    return () => { observer.disconnect(); changes.disconnect(); document.querySelectorAll("[data-reveal]").forEach(el => { el.removeAttribute("data-reveal"); el.classList.remove("is-revealed"); }); };
  }, [location.pathname, location.search, reduced]);
}
