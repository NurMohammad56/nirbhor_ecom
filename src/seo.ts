import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "./store";

export function useSeo() {
  const { pathname, search } = useLocation();
  const { products, settings } = useStore();
  useEffect(() => {
    const product = /^\/(product|campaign)\//.test(pathname)
      ? products.find(
          (p) => p.id === pathname.split("/").pop() && p.status === "Published",
        )
      : undefined;
    const params = new URLSearchParams(search);
    const category = params.get("subcategory") || params.get("category");
    const title = product
      ? product.seoTitle || `${product.name} | ${settings.name}`
      : pathname.startsWith("/admin")
        ? `Commerce Admin | ${settings.name}`
        : category
          ? `${category} | ${settings.name}`
          : settings.seoTitle;
    const description =
      product?.seoDescription ||
      product?.description ||
      settings.seoDescription;
    document.title = title;
    function meta(name: string, content: string, property = false) {
      let el = document.querySelector<HTMLMetaElement>(
        `meta[${property ? "property" : "name"}="${name}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(property ? "property" : "name", name);
        document.head.appendChild(el);
      }
      el.content = content;
    }
    meta("description", description);
    meta("og:title", title, true);
    meta("og:description", description, true);
    meta("og:type", product ? "product" : "website", true);
    meta("og:site_name", settings.name, true);
    meta(
      "og:image",
      new URL(product?.image || "/assets/hero.webp", location.origin).href,
      true,
    );
    const canonicalParams = new URLSearchParams();
    for (const key of ["category", "subcategory"])
      if (params.get(key)) canonicalParams.set(key, params.get(key)!);
    const canonical =
      location.origin +
      pathname +
      (canonicalParams.size ? "?" + canonicalParams.toString() : "");
    meta("og:url", canonical, true);
    meta(
      "robots",
      /^\/(admin|account|checkout|cart|login|register|forgot-password|order-success|track)(\/|$)/.test(
        pathname,
      )
        ? "noindex, nofollow"
        : "index, follow",
    );
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    document.getElementById("nirbhor-product-data")?.remove();
    if (product) {
      const script = document.createElement("script");
      script.id = "nirbhor-product-data";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description,
        image: new URL(product.image, location.origin).href,
        sku: product.sku,
        brand: { "@type": "Brand", name: product.brand },
        offers: {
          "@type": "Offer",
          url: canonical,
          priceCurrency: "BDT",
          price: product.price,
          availability: product.stock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      });
      document.head.appendChild(script);
    }
  }, [pathname, search, products, settings]);
}
