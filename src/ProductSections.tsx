import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Leaf, MapPin, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "./store";
import { bnNode } from "./bn";
import { money } from "./data";
import type { Product, Campaign } from "./data";
import { productPageContent } from "./product-page-content";
import type { ProductBlockId } from "./product-page-content";
import { Reviews } from "./Product";
import { Button, ProductCard, SectionTitle } from "./ui";

export function ProductBenefits({ product }: { product: Product }) {
  const page = productPageContent(product), icons = [Leaf, MapPin, ShieldCheck, Truck];
  if (!page.benefits.length) return null;
  return <section className="container section campaign-benefits product-content-block" data-product-section="benefits"><SectionTitle title={bnNode(page.benefitsTitle)} /><div className="benefit-grid">{page.benefits.map((b, i) => { const Icon = icons[i % icons.length]; return <div key={i}><Icon size={24} strokeWidth={1.4} /><h3>{bnNode(b.title)}</h3><p>{bnNode(b.text)}</p></div>; })}</div></section>;
}
export function ProductSource({ product }: { product: Product }) {
  const page = productPageContent(product);
  return <section className="source-story product-content-block" data-product-section="source"><div className="container source-story-grid"><div><h2>{bnNode(page.sourceTitle)}</h2><p className="preserve-lines">{bnNode(page.sourceText || product.description)}</p><div className="batch-info">{[{ label: "উৎস", value: product.source }, { label: "ব্যাচ", value: page.batch }, { label: "উপাদান", value: page.ingredients }].filter(i => i.value).map(i => <div key={i.label}><span>{i.label}</span><b>{bnNode(i.value)}</b></div>)}</div></div>{page.sourceImage && <div className="source-photo"><img src={page.sourceImage} alt={bnNode(page.sourceCaption || page.sourceTitle)} loading="lazy" />{page.sourceCaption && <span><MapPin size={14} />{bnNode(page.sourceCaption)}</span>}</div>}</div></section>;
}
export function ProductFaq({ product }: { product: Product }) {
  const page = productPageContent(product);
  if (!page.faqs.length) return null;
  return <section className="container section campaign-faq product-content-block" data-product-section="faq"><div><h2>{bnNode(page.faqTitle)}</h2><Link to="/contact" className="text-link">আরও জানতে যোগাযোগ করুন<ArrowUpRight size={14} /></Link></div><div className="faq-list">{page.faqs.map((faq, i) => <details key={i}><summary>{bnNode(faq.question)}<Plus size={17} /></summary><p className="preserve-lines">{bnNode(faq.answer)}</p></details>)}</div></section>;
}
function ProductDetails({ product: p }: { product: Product }) {
  const s = useStore(), page = productPageContent(p), [tab, setTab] = useState("details");
  return <section className="container section product-information product-content-block" data-product-section="details"><div className="detail-tabs" role="tablist" aria-label="পণ্যের তথ্য">{[["details", "বিস্তারিত"], ["materials", p.category === "Clothing & Style" ? "কাপড় ও যত্ন" : p.category === "Home & Living" ? "উপকরণ ও যত্ন" : "উপাদান ও উৎস"], ["delivery", "ডেলিভারি ও রিটার্ন"]].map(([id, title]) => <button role="tab" aria-selected={tab === id} className={tab === id ? "active" : ""} onClick={() => setTab(id)} key={id}>{title}</button>)}</div><div className="detail-tab-content" role="tabpanel">
    {tab === "details" ? <><div><h2>{bnNode(page.detailsTitle)}</h2><p className="preserve-lines">{bnNode(page.detailsBody || p.description)}</p></div><dl>{page.specifications.map((row, i) => <div key={i}><dt>{bnNode(row.label)}</dt><dd>{bnNode(row.value)}</dd></div>)}</dl></> : tab === "materials" ? <><div><h2>{bnNode(page.materialsTitle)}</h2><p className="preserve-lines">{bnNode(page.materialsBody)}</p>{page.ingredients && <p className="preserve-lines">{bnNode(page.ingredients)}</p>}</div><dl>{[{ label: "উৎস", value: p.source }, { label: "ব্যাচ", value: page.batch }, { label: "সংরক্ষণ / যত্ন", value: page.storage }].filter(i => i.value).map(i => <div key={i.label}><dt>{i.label}</dt><dd>{bnNode(i.value)}</dd></div>)}</dl></> : <><div><h2>ডেলিভারি</h2><p className="preserve-lines">{bnNode(page.deliveryText || `ঢাকায় সাধারণত ১-২ কর্মদিবস - ${money(s.settings.dhaka)}।\nঢাকার বাইরে ৩-৫ কর্মদিবস - ${money(s.settings.outside)}।\n${money(s.settings.freeShipping)} বা বেশি কেনাকাটায় ফ্রি ডেলিভারি।`)}</p><Link to="/page/shipping" className="text-link">ডেলিভারির নিয়ম<ArrowUpRight size={14} /></Link></div><div><h3>রিটার্ন ও সহায়তা</h3><p className="preserve-lines">{bnNode(page.returnsText || "ক্ষতিগ্রস্ত বা ভুল পণ্য পেলে অর্ডার নম্বর ও ছবি নিয়ে আমাদের সঙ্গে যোগাযোগ করুন। রিটার্নের বিস্তারিত নিয়ম দেখে নিন।")}</p><Link to="/page/returns" className="text-link">রিটার্নের নিয়ম<ArrowUpRight size={14} /></Link></div></>}
  </div></section>;
}
function Together({ product: p }: { product: Product }) {
  const s = useStore(), page = productPageContent(p), [included, setIncluded] = useState<string[]>([p.id]);
  const items = [p, ...s.products.filter(i => i.id !== p.id && i.category === p.category && i.status === "Published" && i.stock > 0).slice(0, 2)];
  return <section className="container section product-content-block" data-product-section="bundle"><SectionTitle title={bnNode(page.bundleTitle)} /><div className="together-row">{items.map((item, i) => <div key={item.id}>{i > 0 && <Plus size={20} />}<img src={item.image} alt={bnNode(item.name)} /><span><b>{bnNode(item.name)}</b><small>{bnNode(money(item.price))}</small></span><label><input type="checkbox" aria-label={`${bnNode(item.name)} একসঙ্গে কিনুন`} checked={included.includes(item.id)} onChange={e => setIncluded(old => e.target.checked ? [...old, item.id] : old.filter(id => id !== item.id))} /></label></div>)}<Button disabled={!included.length} onClick={() => { included.forEach(id => s.addToCart(id)); s.setDrawer(true); }}>নির্বাচিত পণ্য ব্যাগে নিন<ShoppingBag size={16} /></Button></div></section>;
}
export function ProductRelated({ product: p }: { product: Product }) {
  const { products } = useStore(), page = productPageContent(p);
  const items = products.filter(i => i.id !== p.id && i.category === p.category && i.status === "Published").slice(0, 4);
  if (!items.length) return null;
  return <section className="container section product-content-block" data-product-section="related"><SectionTitle title={bnNode(page.relatedTitle)} link={`/shop?category=${encodeURIComponent(p.category)}`} label="সব পণ্য" /><div className="product-grid four">{items.map(item => <ProductCard product={item} key={item.id} />)}</div></section>;
}
export default function ProductSections({ product, campaign, config }: { product: Product; campaign?: boolean; config?: Campaign }) {
  const page = productPageContent(product);
  const blocks = { details: <ProductDetails product={product} />, benefits: <ProductBenefits product={product} />, source: <ProductSource product={product} />, faq: <ProductFaq product={product} />, reviews: <div data-product-section="reviews"><Reviews product={product} /></div>, bundle: <Together product={product} />, related: <ProductRelated product={product} /> };
  const ids: ProductBlockId[] = campaign && config ? config.blockOrder.filter(key => (config as unknown as Record<string, unknown>)[key]).map(key => key === "trust" ? "benefits" : key).filter((key): key is ProductBlockId => key in blocks) : page.sections.filter(s => s.enabled).map(s => s.id);
  return <>{ids.map(id => <div className="product-block-wrap" key={id}>{blocks[id]}</div>)}</>;
}
