import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, Layers, ShoppingBag, Trash2, Plus, Minus, TicketPercent } from "lucide-react";
import { useStore } from "./store";
import { bnNode } from "./bn";
import { money } from "./data";
import { comboAvailable, comboPacks, comboPricing, comboIssues, offerActive } from "./promotions";
import type { ComboOffer } from "./promotions";
import type { Product } from "./data";

export function DiscountHint({ product }: { product: Product }) {
  const { discounts } = useStore();
  const rules = discounts.filter(r => offerActive(r) && (!r.excludeSale || product.oldPrice <= product.price) && (r.scope === "All products" || r.scope === product.category || r.scope === "Product: " + product.id));
  if (!rules.length) return null;
  return <div className="discount-hint"><TicketPercent size={16} /><span>এই পণ্যে চেকআউটে বাড়তি ছাড় আছে। <Link to="/offers">অফারের শর্ত দেখুন</Link></span></div>;
}

export function ComboCard({ offer }: { offer: ComboOffer }) {
  const s = useStore(), pricing = comboPricing(offer, s.products);
  const available = comboAvailable(offer, s.products);
  const inBag = comboPacks(offer, s.cart);
  return <article className="combo-card" data-offer={offer.id}>
    <div className="combo-card-visual"><div className="combo-card-orbit" />
      <span className="combo-saving">{bnNode(money(pricing.saving))} সাশ্রয়</span>
      <div className="combo-product-collage">{offer.items.slice(0, 3).map((item, index) => { const p = s.products.find(p => p.id === item.productId); return p && <img key={p.id + item.variant} src={p.image} alt={bnNode(p.name)} loading="lazy" style={{ "--order": index } as CSSProperties} />; })}</div>
      <span className="combo-product-count"><Layers size={13} />{bnNode(offer.items.reduce((n, i) => n + i.quantity, 0))}টি পণ্য</span>
    </div>
    <div className="combo-card-copy"><h3>{bnNode(offer.name)}</h3><p>{bnNode(offer.description)}</p>
      <details className="combo-includes"><summary>কম্বোতে যা থাকছে <Plus size={13} /></summary><div>{offer.items.map(item => { const p = s.products.find(p => p.id === item.productId); return p && <span key={p.id + item.variant}>{bnNode(item.quantity)} × {bnNode(p.name)} · {bnNode(item.variant)}</span>; })}</div></details>
      <div className="combo-card-bottom"><div><strong>{bnNode(money(pricing.price))}</strong>{pricing.saving > 0 && <del>{bnNode(money(pricing.subtotal))}</del>}</div>
        <button className="btn" disabled={!available} onClick={() => { if (s.addCombo(offer.id)) s.setDrawer(true); }} aria-label={`${bnNode(offer.name)} কম্বো ব্যাগে যোগ করুন`}>{inBag ? <Check size={16} /> : <Plus size={16} />}{!available ? "স্টক নেই" : inBag ? "আরও যোগ করুন" : "কম্বো নিন"}</button>
      </div>{offer.freeShipping && <span className="combo-delivery">ডেলিভারি ফ্রি</span>}
    </div>
  </article>;
}
export function ComboShowcase({ category, all = false }: { category?: string; all?: boolean }) {
  const { combos, products } = useStore();
  const offers = combos.filter(c => offerActive(c) && (all || c.featured) && (!category || c.items.some(i => products.find(p => p.id === i.productId)?.category === category)));
  if (!offers.length) return null;
  return <section className="container brand-section combo-showcase" id="combo-offers">
    <div className="brand-section-heading"><div><span className="section-kicker"><Layers size={14} />একসঙ্গে আরও ভালো</span><h2>পছন্দের পণ্য, কম্বোতে সাশ্রয়</h2></div>{!all && <Link className="brand-underlined" to="/offers">সব অফার<ArrowUpRight size={16} /></Link>}</div>
    <div className="combo-grid">{offers.map(offer => <ComboCard offer={offer} key={offer.id} />)}</div>
  </section>;
}
export function ComboCartGroups({ compact = false }: { compact?: boolean }) {
  const s = useStore();
  const ids = [...new Set(s.cart.filter(i => i.comboId).map(i => i.comboId!))];
  return <div className={`combo-cart-groups ${compact ? "compact" : ""}`}>{ids.map(id => {
    const offer = s.combos.find(c => c.id === id), items = s.cart.filter(i => i.comboId === id);
    const packs = offer ? comboPacks(offer, s.cart) : 0;
    const invalid = comboIssues(items, s.products, s.combos).length > 0;
    const pricing = offer && comboPricing(offer, s.products);
    return <article className="combo-cart-group" key={id}>
      <header><span><Layers size={15} />কম্বো অফার</span><button className="icon-btn" aria-label={`${offer?.name || "কম্বো"} সরান`} onClick={() => s.updateCombo(id, 0)}><Trash2 size={15} /></button></header>
      <h3>{bnNode(offer?.name || "কম্বো অফার")}</h3>
      <div className="combo-cart-items">{items.map(i => { const p = s.products.find(p => p.id === i.id); return <div key={i.id + i.variant}>{p && <img src={p.image} alt="" />}<span>{bnNode(p?.name || i.productName || "পণ্য")}<small>{bnNode(i.variant)} · {bnNode(i.quantity)}টি</small></span></div>; })}</div>
      {invalid ? <p className="field-error" role="alert">অফারটি বদলেছে অথবা শেষ হয়েছে। এই কম্বোটি সরিয়ে আবার যোগ করুন।</p> : <footer><div className="quantity-control"><button aria-label={`${offer!.name} কমান`} disabled={packs <= 1} onClick={() => s.updateCombo(id, packs - 1)}><Minus size={13} /></button><span>{bnNode(packs)}</span><button aria-label={`${offer!.name} বাড়ান`} disabled={!comboAvailable(offer!, s.products, s.cart.filter(i => i.comboId !== id), packs + 1)} onClick={() => s.updateCombo(id, packs + 1)}><Plus size={13} /></button></div><strong>{bnNode(money(pricing!.price * packs))}<small>{bnNode(money(pricing!.saving * packs))} সাশ্রয়</small></strong></footer>}
    </article>;
  })}</div>;
}
