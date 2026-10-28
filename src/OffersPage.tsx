import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Copy, Gift, TicketPercent, Sparkles } from "lucide-react";
import { useStore } from "./store";
import { bnNode } from "./bn";
import { money } from "./data";
import { offerActive } from "./promotions";
import ComboExplorer from "./ComboExplorer";
import { Breadcrumb, ProductCard } from "./ui";

export default function OffersPage() {
  const s = useStore(), [tab, setTab] = useState("all"), [copied, setCopied] = useState("");
  const coupons = s.coupons.filter(c => offerActive(c) && c.uses < c.limit);
  const rules = s.discounts.filter(offerActive);
  const tabs = [["all", "সব অফার"], ["combo", "কম্বো"], ["code", "কুপন"], ["sale", "ছাড়ের পণ্য"]];
  return <main className="offers-page">
    <section className="offers-page-intro offers-visual-intro"><div className="container"><Breadcrumb items={[{ label: "অফার" }]} />
      <div className="offer-hero">
        <img className="offer-hero-photo" src="/assets/offers-combo-hero-v1.webp" width="1672" height="940" alt="নির্ভরের একই লেবেলে মধু, মসলার জার ও মিক্সড নাটসের আয়োজন" fetchPriority="high"/>
        <div className="offer-hero-copy"><span className="section-kicker"><Gift size={16}/>প্রতিদিনের পছন্দ, এক আয়োজনে</span><h1>পছন্দগুলো একসঙ্গে,<br/><span>সাশ্রয়ও সঙ্গে।</span></h1><p>মসলা, নাশতা আর দৈনন্দিন প্রয়োজনের কম্বো।<br/>কী থাকছে, কতটা সাশ্রয় - দেখে বেছে নিন।</p><a className="offer-hero-cta" href="#offer-collection">কম্বো ও অফার দেখুন<ArrowUpRight size={18}/></a></div>
      </div>
      <div className="offer-tabs" role="tablist" aria-label="অফারের ধরন">{tabs.map(([id, name]) => <button role="tab" aria-selected={tab === id} key={id} onClick={() => setTab(id)}>{name}</button>)}</div></div></section>
    <div id="offer-collection" role="tabpanel" aria-label={tabs.find(([id]) => id === tab)![1]}>
      {["all", "combo"].includes(tab) && <ComboExplorer/>}
      {["all", "code"].includes(tab) && <section className="container brand-section offers-section"><div className="brand-section-heading"><h2>কুপন ও বাড়তি ছাড়</h2><span>শর্ত দেখে বেছে নিন</span></div><div className="offer-code-grid">
        {rules.map(rule => <article className="offer-code-card automatic" key={rule.id}><span className="section-kicker"><Sparkles size={14} />কোড ছাড়াই</span><h3>{bnNode(rule.name)}</h3><strong>{rule.type === "Percentage" ? bnNode(rule.value) + "%" : bnNode(money(rule.value))} ছাড়</strong><p>{bnNode(rule.scope)} · ন্যূনতম {bnNode(money(rule.minimum))}{rule.maxDiscount > 0 && <> · সর্বোচ্চ {bnNode(money(rule.maxDiscount))}</>}</p><Link to={rule.scope === "All products" ? "/shop" : rule.scope.startsWith("Product: ") ? "/product/" + rule.scope.slice(9) : "/shop?category=" + encodeURIComponent(rule.scope)}>পণ্য দেখুন<ArrowUpRight size={16} /></Link></article>)}
        {coupons.map(c => <article className="offer-code-card" key={c.id}><span className="section-kicker"><TicketPercent size={14} />চেকআউটে ব্যবহার করুন</span><h3>{c.type === "Free shipping" ? "ডেলিভারি ফ্রি" : c.type === "Buy 2 get 1" ? "৩টি কিনলে ১টির দাম ফ্রি" : (c.type === "Percentage" ? bnNode(c.value) + "%" : bnNode(money(c.value))) + " ছাড়"}</h3><p>ন্যূনতম {bnNode(money(c.minimum))}{!!c.maxDiscount && <> · সর্বোচ্চ ছাড় {bnNode(money(c.maxDiscount))}</>}<br />{bnNode(c.scope)}{c.end && <> · মেয়াদ {new Date(c.end).toLocaleDateString("bn-BD", { day: "numeric", month: "short" })}</>}</p><div className="copy-offer-code"><code>{c.code}</code><button onClick={async () => { try { await navigator.clipboard.writeText(c.code); setCopied(c.id); s.toast("কুপন কোড কপি হয়েছে।"); } catch { s.toast(`চেকআউটে ${c.code} ব্যবহার করুন।`); } }} aria-label={`${c.code} কোড কপি করুন`}>{copied === c.id ? <Check size={15} /> : <Copy size={15} />}{copied === c.id ? "কপি হয়েছে" : "কপি করুন"}</button></div></article>)}
      </div>{!coupons.length && !rules.length && <p className="offer-empty">এখন কোনো কুপন চালু নেই। অন্য অফারগুলো দেখতে পারেন।</p>}</section>}
      {["all", "sale"].includes(tab) && <section className="container brand-section offers-section"><div className="brand-section-heading"><h2>ছাড়ে পছন্দের পণ্য</h2><Link className="brand-underlined" to="/shop">সব পণ্য<ArrowUpRight size={16} /></Link></div><div className="product-grid four">{s.products.filter(p => p.oldPrice > p.price && p.status === "Published").slice(0, 8).map(p => <ProductCard product={p} key={p.id} />)}</div></section>}
    </div>
  </main>;
}
