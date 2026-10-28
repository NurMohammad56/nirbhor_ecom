import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useStore } from "./store";
import { bnNode, latinDigits, searchText } from "./bn";
import { comboAvailable, comboPricing, offerActive } from "./promotions";
import { comboPurpose, comboPurposes, comboHasProducts } from "./combo-purpose";
import { ComboCard } from "./OfferCards";

export default function ComboExplorer() {
  const s = useStore(), [urlParams, setParams] = useSearchParams();
  const [params, setLocalParams] = useState(urlParams);
  const currentParams = useRef(urlParams);
  useEffect(() => { currentParams.current = urlParams; setLocalParams(urlParams); }, [urlParams]);
  const purpose = params.get("purpose") || "all", query = params.get("q") || "", budget = params.get("budget") || "", sort = params.get("sort") || "recommended", stocked = params.get("stock") === "1";
  const offers = s.combos.filter(c => offerActive(c) && comboHasProducts(c, s.products));
  const update = (next: URLSearchParams) => { currentParams.current = next; setLocalParams(next); setParams(next, { replace: true, preventScrollReset: true }); };
  const reset = () => update(new URLSearchParams());
  const patch = (key: string, value: string) => { const next = new URLSearchParams(currentParams.current); value ? next.set(key, value) : next.delete(key); update(next); };
  const rows = offers.map(offer => ({ offer, purpose: comboPurpose(offer, s.products), price: comboPricing(offer, s.products), available: comboAvailable(offer, s.products) }));
  const list = rows.filter(row => (purpose === "all" || row.purpose === purpose) && (!query.trim() || searchText(row.offer.name + " " + row.offer.description + " " + row.offer.items.map(i => s.products.find(p => p.id === i.productId)?.name || "").join(" ")).includes(latinDigits(query).trim().toLocaleLowerCase("bn-BD"))) && (!budget || row.price.price <= Number(budget)) && (!stocked || row.available));
  if (sort === "price-low") list.sort((a,b) => a.price.price - b.price.price);
  if (sort === "saving-high") list.sort((a,b) => b.price.saving - a.price.saving);
  const active = purpose !== "all" || !!query || !!budget || stocked || sort !== "recommended";
  return <section className="container brand-section combo-showcase combo-explorer" id="combo-offers">
    <div className="brand-section-heading"><div><span className="section-kicker"><SlidersHorizontal size={15}/>আপনার প্রয়োজনের সঙ্গে মিলিয়ে</span><h2>একসঙ্গে ভালো লাগে</h2><p>রান্নাঘর থেকে নিজের যত্ন - কাজে লাগে এমন পণ্য, পরিষ্কার দামের হিসাবে।</p></div><span className="combo-result-count" role="status">{bnNode(list.length)}টি কম্বো</span></div>
    <div className="combo-purpose-tabs" role="group" aria-label="কম্বোর প্রয়োজন"><button aria-pressed={purpose === "all"} onClick={() => patch("purpose", "")}>সব কম্বো<span>{bnNode(offers.length)}</span></button>{Object.entries(comboPurposes).map(([id,name]) => { const count = rows.filter(row => row.purpose === id).length; return count > 0 && <button key={id} aria-pressed={purpose === id} onClick={() => patch("purpose", id)}>{name}<span>{bnNode(count)}</span></button>; })}</div>
    <div className="combo-filter-bar">
      <label className="combo-filter-field combo-search-field"><span>কম্বো খুঁজুন</span><div className="combo-search"><Search size={17}/><input aria-label="কম্বো খুঁজুন" value={query} onChange={e => patch("q", e.target.value)} placeholder="মসলা, আচার, চা..."/></div></label>
      <label className="combo-filter-field"><span>আপনার বাজেট</span><select aria-label="কম্বোর বাজেট" value={budget} onChange={e => patch("budget", e.target.value)}><option value="">সব বাজেট</option><option value="1000">৳১,০০০-এর মধ্যে</option><option value="1500">৳১,৫০০-এর মধ্যে</option><option value="2000">৳২,০০০-এর মধ্যে</option></select></label>
      <label className="combo-filter-field"><span>সাজিয়ে দেখুন</span><select aria-label="কম্বো সাজান" value={sort} onChange={e => patch("sort", e.target.value)}><option value="recommended">বাছাই করা ক্রম</option><option value="price-low">কম দাম আগে</option><option value="saving-high">বেশি সাশ্রয় আগে</option></select></label>
      <label className="combo-stock-filter"><input type="checkbox" checked={stocked} onChange={e => patch("stock", e.target.checked ? "1" : "")}/>স্টকে আছে</label>
    </div>
    {active && <div className="combo-active-filters"><span>আপনার বাছাই অনুযায়ী কম্বো দেখাচ্ছে</span><button onClick={reset}><X size={13}/>সব ফিল্টার মুছুন</button></div>}
    {list.length ? <div className="combo-grid">{list.map(({ offer }) => <ComboCard key={offer.id} offer={offer}/>)}</div> : <div className="combo-filter-empty"><Search size={28}/><h3>এই বাছাইয়ে কোনো কম্বো পাওয়া যায়নি</h3><p>বাজেট বা প্রয়োজনের ফিল্টার বদলে দেখতে পারেন।</p><button className="btn outline" onClick={reset}>সব কম্বো দেখুন</button></div>}
  </section>;
}
