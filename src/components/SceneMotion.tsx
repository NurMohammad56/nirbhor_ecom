"use client";
import { bnNode } from "@/lib/bn";
import { useEffect, useState } from "react";

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

export function Botanical({ kind = "leaf", className = "" }: { kind?: "leaf" | "dry"; className?: string }) {
  return <img className={`botanical botanical-${kind} ${className}`} src={`/assets/${kind === "leaf" ? "botanical-branch" : "dried-stem"}-v3.webp`} alt={bnNode("")} aria-hidden="true" loading="lazy" />;
}
