import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, Layers, Package, ShieldCheck, ShoppingBag } from "lucide-react";
import { useStore } from "./store";
import { money, itemPrice, productVariants } from "./data";
import { comboAvailable, comboPacks, comboPricing, offerActive, offerStatus } from "./promotions";
import { productHref } from "./departments";
import { sellingDescription } from "./merchandising-copy";
import { reviewSourceLabel } from "./product-page-content";
import { bnNode } from "./bn";
import { Badge, Breadcrumb, Button, Empty, Quantity } from "./ui";
import { ComboCard } from "./OfferCards";
import { comboPurpose, comboHasProducts } from "./combo-purpose";

export default function ComboLanding() {
  const { id } = useParams(), s = useStore(), navigate = useNavigate();
  const [requested, setRequested] = useState(1), [now, setNow] = useState(Date.now());
  useEffect(() => { setRequested(1); s.track("ViewContent", "Combo: " + id); }, [id]);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(timer); }, []);
  const offer = s.combos.find(c => c.id === id && c.active);
  if (!offer) return <main className="container page-space"><Empty title="কম্বোটি এখন পাওয়া যাচ্ছে না" text="অন্য পণ্য ও চলমান অফারগুলো দেখে নিতে পারেন।" action={<Button to="/offers">সব অফার দেখুন<ArrowRight size={16}/></Button>}/></main>;
  const rows = offer.items.map(item => ({ ...item, product: s.products.find(p => p.id === item.productId) }));
  const complete = rows.length > 0 && rows.every(row => row.product?.status === "Published" && productVariants(row.product).some(v => v.label === row.variant));
  const pricing = comboPricing(offer, s.products), inBag = comboPacks(offer, s.cart), base = s.cart.filter(i => i.comboId !== id);
  let capacity = 0;
  while (capacity < Math.min(100, offer.limitPerOrder - inBag) && comboAvailable(offer, s.products, base, inBag + capacity + 1)) capacity++;
  const packs = Math.min(requested, Math.max(1, capacity)), available = capacity > 0 && complete && offerActive(offer, now);
  const count = offer.items.reduce((n, item) => n + item.quantity, 0), landing = offer.landing;
  const headline = landing?.headline || (offer.id === "combo-morning" ? "সকালের ছোট্ট আয়োজন,\nএকসঙ্গে আরও ভালো।" : offer.id === "combo-pantry" ? "রান্নাঘরের পছন্দগুলো,\nএকসঙ্গে বেছে নিন।" : offer.name);
  const reviews = s.reviews.filter(r => r.status === "Approved" && offer.items.some(item => item.productId === r.productId)).slice(0, 3);
  const purpose = comboPurpose(offer, s.products);
  const other = s.combos.filter(c => c.id !== id && offerActive(c) && comboHasProducts(c, s.products)).sort((a,b) => Number(comboPurpose(b, s.products) === purpose) - Number(comboPurpose(a, s.products) === purpose)).slice(0, 2);
  const order = (checkout = false) => { if (s.addCombo(offer.id, packs)) checkout ? navigate("/checkout") : s.setDrawer(true); };
  const questions = [
    ["কম্বোতে কী কী পাব?", "নিচের পণ্যের তালিকায় প্রতিটি আইটেম, ভ্যারিয়েন্ট ও পরিমাণ দেওয়া আছে। অর্ডারেও একই নির্বাচন দেখানো হবে।"],
    ["আলাদা কেনার তুলনায় কতটা সাশ্রয়?", complete ? `আলাদা কিনলে ${money(pricing.subtotal)}। এই কম্বোর দাম ${money(pricing.price)}${pricing.saving ? `, অর্থাৎ ${money(pricing.saving)} সাশ্রয়` : ""}।` : "পণ্যের তথ্য বদলেছে। হালনাগাদ কম্বোর জন্য অন্য অফার দেখুন।"],
    ["কুপন ব্যবহার করা যাবে?", offer.allowCoupon ? "কম্বোর সঙ্গে যোগ্য কুপন ব্যবহার করা যাবে। কুপনের নিজস্ব শর্ত চেকআউটে যাচাই হবে।" : "এই কম্বোর পণ্যে অতিরিক্ত কুপন প্রযোজ্য নয়। অন্য পণ্যে কুপনের শর্ত অনুযায়ী ছাড় থাকতে পারে।"],
    ["ডেলিভারি ও পেমেন্ট কীভাবে হবে?", `${offer.freeShipping ? "এই কম্বোতে ফ্রি ডেলিভারি রয়েছে।" : "ঠিকানা ও অর্ডার অনুযায়ী ডেলিভারি চার্জ চেকআউটে দেখবেন।"}${s.settings.cod ? " ক্যাশ অন ডেলিভারি বেছে নেওয়া যাবে।" : " চালু পেমেন্ট পদ্ধতি চেকআউটে দেখুন।"}`],
  ];
  return <main className="combo-landing">
    <div className="container"><Breadcrumb items={[{ label: "অফার ও কম্বো", to: "/offers" }, { label: offer.name }]}/></div>
    <section className="container combo-landing-hero">
      <div className={`combo-landing-media ${landing?.coverImage ? "has-cover" : ""}`}>
        {landing?.coverImage ? <img className="combo-cover" src={landing.coverImage} alt={bnNode(offer.name)} fetchPriority="high"/> : <div className="combo-hero-products" data-count={Math.min(4, rows.length)}>{rows.slice(0, 4).map((row, index) => row.product && <Link key={row.productId + row.variant} to={productHref(row.product, s.categories)} className={`combo-hero-item combo-hero-item-${index}`}><img src={row.product.image} alt={bnNode(row.product.name)} fetchPriority={index === 0 ? "high" : "auto"}/><span>{bnNode(row.product.name)}</span></Link>)}</div>}
        <span className="combo-real-count"><Layers size={16}/>{bnNode(count)}টি আইটেম, এক কম্বোতে</span>
      </div>
      <div className="combo-landing-purchase"><span className="section-kicker"><Layers size={15}/>একসঙ্গে আপনার পছন্দের আয়োজন</span><h1>{bnNode(headline)}</h1>{headline !== offer.name && <p className="combo-original-name">{bnNode(offer.name)}</p>}<p className="combo-intro">{bnNode(landing?.introduction || offer.description || "পছন্দের কিছু জিনিস একসঙ্গে বেছে নিন। কী থাকছে, কতটা পরিমাণ আর মোট কত খরচ - সব দেখেই নিজের আয়োজন সাজান।")}</p>
        <div className="combo-live-facts"><Badge>{offerStatus(offer)}</Badge>{complete && pricing.saving > 0 && <Badge tone="warm">{bnNode(money(pricing.saving))} সাশ্রয়</Badge>}{offer.freeShipping && <Badge>ফ্রি ডেলিভারি</Badge>}</div>
        {complete ? <div className="combo-landing-price"><strong>{bnNode(money(pricing.price * packs))}</strong>{pricing.saving > 0 && <del>{bnNode(money(pricing.subtotal * packs))}</del>}<span>{bnNode(packs)} কম্বোর মূল্য</span></div> : <p className="field-error">পণ্যের তথ্য হালনাগাদ হচ্ছে। এই কম্বোটি এখন অর্ডার করা যাবে না।</p>}
        <div className="combo-pack-select"><span>কতটি কম্বো নেবেন?</span><Quantity value={packs} max={Math.max(1, capacity)} onChange={setRequested}/></div>
        <Button className="full" disabled={!available} onClick={() => order(true)}>এখনই অর্ডার করুন<ArrowRight size={17}/></Button><Button variant="outline" className="full" disabled={!available} onClick={() => order()}><ShoppingBag size={17}/>কম্বো ব্যাগে রাখুন</Button>
        {!available && <p className="field-error" role="status">{offerActive(offer, now) ? "বর্তমান ব্যাগ ও স্টক অনুযায়ী আরও কম্বো যোগ করা যাচ্ছে না।" : "অফারটি এই মুহূর্তে চালু নেই।"}</p>}
        <div className="combo-order-notes"><span><Check size={14}/>পণ্য, পরিমাণ ও দাম স্পষ্ট</span><span><ShieldCheck size={14}/>চূড়ান্ত খরচ নিশ্চিত করেই অর্ডার</span></div>
        {offer.end && <p className="small muted">অফারের শেষ তারিখ: {new Date(offer.end.length === 10 ? offer.end + "T23:59:59+06:00" : offer.end).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka" })}</p>}
        <a className="brand-underlined" href="#combo-contents">কম্বোতে যা থাকছে<ArrowRight size={14}/></a>
      </div>
    </section>
    <section className="combo-story-band"><div className="container"><div><span className="section-kicker">পছন্দগুলো থাকুক একসঙ্গে</span><h2>ছোট ছোট পছন্দে,<br/>আপনার নিজের আয়োজন।</h2></div><p>{bnNode(landing?.story || "নিজের প্রতিদিনের জন্য নিন, কিংবা কাছের কারও সঙ্গে ভাগ করে নিন। এক জায়গায় সব পণ্যের তথ্য আর পরিষ্কার দামের হিসাব থাকলে পছন্দ করা সহজ হয়। এই কম্বোর প্রতিটি আইটেমের পরিমাণ ও বিস্তারিত নিচে দেখে নিন।")}</p></div></section>
    <section className="container brand-section combo-contents" id="combo-contents"><div className="brand-section-heading"><div><span className="section-kicker"><Package size={15}/>প্যাকের ভেতরে</span><h2>যা পাবেন, এক নজরে</h2></div><span>{bnNode(count)}টি আইটেম</span></div><div className="combo-content-list">{rows.map(row => <article key={row.productId + row.variant}>{row.product ? <><Link to={productHref(row.product, s.categories)}><img src={row.product.image} alt={bnNode(row.product.name)} loading="lazy"/></Link><div><span className="section-kicker">{bnNode(row.quantity)} × {bnNode(row.variant)}</span><h3><Link to={productHref(row.product, s.categories)}>{bnNode(row.product.name)}</Link></h3><p>{bnNode(sellingDescription(row.product))}</p><Link className="brand-underlined" to={productHref(row.product, s.categories)}>পণ্যের বিস্তারিত<ArrowUpRight size={14}/></Link></div><b>{bnNode(money(itemPrice(row.product, row.variant) * row.quantity))}<small>আলাদা কিনলে</small></b></> : <p className="field-error">কম্বোর একটি পণ্য আর পাওয়া যাচ্ছে না।</p>}</article>)}</div>{complete && <div className="combo-price-comparison"><span>আলাদা কিনলে <b>{bnNode(money(pricing.subtotal))}</b></span><span>কম্বোতে <b>{bnNode(money(pricing.price))}</b></span>{pricing.saving > 0 && <span>আপনার সাশ্রয় <b>{bnNode(money(pricing.saving))}</b></span>}</div>}</section>
    {!!reviews.length && <section className="container brand-section combo-product-reviews"><div className="brand-section-heading"><h2>কম্বোর পণ্য নিয়ে মতামত</h2></div><div className="customer-voices-grid">{reviews.map(r => <article className="customer-voice" key={r.id}><span className="review-source">{reviewSourceLabel(r)}</span><span className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span><h3>{bnNode(r.title)}</h3><p>{bnNode(r.text)}</p><small>{bnNode(s.products.find(p => p.id === r.productId)?.name)} · {bnNode(r.name)}</small></article>)}</div></section>}
    <section className="container brand-section combo-faq"><div><span className="section-kicker">কেনার আগে</span><h2>কিছু প্রশ্নের উত্তর</h2><Link className="brand-underlined" to="/page/returns">ফেরত ও বদলের নীতি<ArrowUpRight size={15}/></Link></div><div className="faq-list">{questions.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    {!!other.length && <section className="container brand-section"><div className="brand-section-heading"><h2>আরও কিছু একসঙ্গে ভালো লাগে</h2><Link className="brand-underlined" to="/offers">সব অফার<ArrowUpRight size={16}/></Link></div><div className="combo-grid">{other.map(c => <ComboCard key={c.id} offer={c}/>)}</div></section>}
    <div className="combo-mobile-order"><div><small>{bnNode(packs)} কম্বো</small><b>{complete ? bnNode(money(pricing.price * packs)) : "এখন পাওয়া যাচ্ছে না"}</b></div><Button disabled={!available} onClick={() => order(true)}>অর্ডার করুন<ArrowRight size={16}/></Button></div>
  </main>;
}
