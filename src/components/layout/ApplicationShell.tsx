"use client";
import type {ReactNode} from 'react';
import {useEffect,useRef,Suspense} from 'react';
import {bnNode,latinDigits} from '@/lib/bn';
import {useLocation} from '@/lib/navigation';
import {useStore} from '@/providers/store-provider';
import {useDepartment} from '@/hooks/useDepartment';
import {useSeo} from '@/hooks/seo';
import {usePageReveal} from '@/hooks/usePageReveal';
import {useDepthMotion} from '@/hooks/useDepthMotion';
import StoreHeader from '@/components/StoreHeader';
import OfferPopup from '@/features/offers/OfferPopup';
import {Footer,CartDrawer} from '@/components/ui';
export default function ApplicationShell({children}:{children:ReactNode}) {
  usePageReveal();
  useDepthMotion();
  useSeo();
  const { department, experience } = useDepartment();
  const location = useLocation(),
    s = useStore();
  const isAdmin = location.pathname.startsWith("/admin");
  const scrollPath = useRef<string | undefined>(undefined);
  useEffect(() => {
    const changedPage = scrollPath.current !== location.pathname;
    scrollPath.current = location.pathname;
    if (location.hash) {
      const timer = setTimeout(
        () =>
          document
            .getElementById(location.hash.slice(1))
            ?.scrollIntoView({ behavior: "smooth" }),
        150,
      );
      return () => clearTimeout(timer);
    } else if (changedPage) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    s.setDrawer(false);
    s.track("PageView", location.pathname + location.search);
  }, [location.pathname, location.search, location.hash]);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.department = department?.slug || "main";
    root.style.setProperty("--green", experience?.accent || s.settings.color);
    root.style.setProperty("--ink", experience?.ink || "#142D2A");
    root.style.setProperty("--paper", "#F7FAF9");
    root.style.setProperty(
      "--department-bg",
      experience?.background || "#f0ede5",
    );
    root.style.setProperty(
      "--department-accent",
      experience?.accent || s.settings.color,
    );
    root.style.setProperty("--department-ink", experience?.ink || "#2d332e");
  }, [
    s.settings.color,
    department?.slug,
    experience?.accent,
    experience?.background,
    experience?.ink,
  ]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document
          .querySelector<HTMLInputElement>(
            '.brand-header-search input',
          )
          ?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return (
    <>
      {bnNode(!isAdmin && (
        <>
          <a className="skip-link" href="#main-content">{bnNode("Skip to content")}</a>
          <StoreHeader />
        </>
      ))}
      <div id="main-content" onInputCapture={event => {
        const input = event.target;
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) input.setCustomValidity("");
        if (input instanceof HTMLInputElement && (input.type === "tel" || input.name === "code")) input.value = latinDigits(input.value);
      }} onInvalidCapture={event => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement)) return;
        input.setCustomValidity(input.validity.valueMissing ? "এই তথ্যটি পূরণ করুন।" : input instanceof HTMLInputElement && input.type === "email" ? "সঠিক ইমেইল ঠিকানা দিন।" : "সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।");
      }}>
        <Suspense
          fallback={
            <div className="route-loading">
              <span />
              <span />
              <span />
              <p>{bnNode("Getting a little goodness ready…")}</p>
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
      {bnNode(!isAdmin && (
        <>
          <Footer />
          <CartDrawer />
          <OfferPopup />
        </>
      ))}
    </>
  );
}
