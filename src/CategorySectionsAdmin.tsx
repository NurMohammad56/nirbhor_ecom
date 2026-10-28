import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowUp, Check, Eye, Plus, Trash2 } from "lucide-react";
import { AdminTitle } from "./Admin";
import { Button, Modal } from "./ui";
import { useStore } from "./store";
import { uid } from "./data";
import { bnNode, searchText, latinDigits } from "./bn";
import { departments } from "./departments";
import { descendants } from "./category-tree";
import { builtInNames, categorySections, safeSectionLink } from "./department-sections";
import type { BuiltInSectionId, CategorySection } from "./department-sections";

export default function CategorySectionsAdmin() {
  const s = useStore(), [params, setParams] = useSearchParams();
  const roots = s.categories.filter(c => !c.parent);
  const first = roots.find(c => c.id === params.get("category")) || roots[0];
  const [categoryId, setCategoryId] = useState(first?.id || ""), [blocks, setBlocks] = useState<CategorySection[]>(first ? categorySections(first) : []), [selected, setSelected] = useState("");
  const [changed, setChanged] = useState(false), [pending, setPending] = useState(""), [after, setAfter] = useState("bestsellers"), [search, setSearch] = useState(""), [scope, setScope] = useState("category");
  const category = roots.find(c => c.id === categoryId), draft = blocks.find(b => b.id === selected);
  if (!category) return <p>আগে একটি মূল ক্যাটাগরি তৈরি করুন। <Link to="/admin/categories">ক্যাটাগরি দেখুন</Link></p>;
  const department = departments.find(d => d.categoryId === category.id), preview = department ? "/" + department.slug : "/shop?category=" + encodeURIComponent(category.name);
  const names = descendants(s.categories, category.name); names.add(category.name);
  const candidates = s.products.filter(p => p.status === "Published" && (scope === "all" || names.has(p.category)) && searchText(p.name + " " + p.category).includes(latinDigits(search).trim().toLocaleLowerCase("bn-BD")));
  const name = (block: CategorySection) => block.kind === "builtin" ? builtInNames[block.id as BuiltInSectionId] : block.title || "নতুন সেকশন";
  const update = (next: CategorySection[]) => { setBlocks(next); setChanged(true); };
  const patch = (changes: Partial<CategorySection>) => update(blocks.map(b => b.id === selected ? { ...b, ...changes } : b));
  function choose(id: string) {
    const c = roots.find(c => c.id === id)!;
    setCategoryId(id); setBlocks(categorySections(c)); setSelected(""); setChanged(false); setParams({ category: id }); setSearch(""); setScope("category");
  }
  function move(index: number, direction: number) {
    const next = [...blocks], target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]]; update(next);
  }
  function save() {
    const invalid = blocks.find(b => b.kind === "collection" && (!b.title?.trim() || (b.enabled && !b.productIds?.length) || (b.href && !safeSectionLink(b.href))));
    if (invalid) { setSelected(invalid.id); s.toast("সেকশনের শিরোনাম, পণ্য ও সঠিক লিংক দিন।"); return; }
    s.setCategories(list => list.map(c => c.id === categoryId ? { ...c, landingSections: blocks } : c)); setChanged(false); s.toast("ক্যাটাগরির সেকশন সেভ হয়েছে।");
  }
  return <div className="category-section-studio">
    <AdminTitle title="ক্যাটাগরি পেজ সাজান" text="সেকশন যোগ করুন, পণ্য বেছে নিন এবং আপনার মতো ক্রম সাজান।"><Button variant="outline" to={preview} target="_blank"><Eye size={16}/>সেভ করা পেজ দেখুন</Button><Button onClick={save}><Check size={16}/>সেকশন সেভ করুন</Button></AdminTitle>
    <div className="section-studio-toolbar"><label className="field">মূল ক্যাটাগরি<select aria-label="মূল ক্যাটাগরি" value={categoryId} onChange={e => changed ? setPending(e.target.value) : choose(e.target.value)}>{roots.map(c => <option key={c.id} value={c.id}>{bnNode(c.name)}</option>)}</select></label><label className="field">নতুন সেকশন কোথায় বসবে<select aria-label="নতুন সেকশন কোথায় বসবে" value={after} onChange={e => setAfter(e.target.value)}><option value="">সবার শুরুতে</option>{blocks.map(b => <option key={b.id} value={b.id}>{bnNode(name(b))} - এর পরে</option>)}</select></label><Button onClick={() => { const id = uid("section"), next = [...blocks], position = after ? next.findIndex(b => b.id === after) + 1 : 0; next.splice(Math.max(0, position), 0, { id, kind: "collection", enabled: true, title: "আপনার জন্য বাছাই", productIds: [], href: department ? `/${department.slug}/shop` : preview, linkLabel: "সব পণ্য", layout: "slider" }); update(next); setSelected(id); }}><Plus size={16}/>সেকশন যোগ করুন</Button></div>
    <div className="section-studio-layout"><aside className="section-order-panel"><h2>পেজের ক্রম</h2><p>তীর দিয়ে আগে-পরে সরান। বন্ধ করলে পেজে দেখাবে না।</p><ol>{blocks.map((b, index) => <li key={b.id} className={`${selected === b.id ? "selected" : ""} ${!b.enabled ? "disabled" : ""}`} data-section-order={b.id}><button className="section-select" onClick={() => setSelected(b.id)}><span>{bnNode(index + 1)}</span><div><strong>{bnNode(name(b))}</strong><small>{b.kind === "collection" ? `${bnNode(b.productIds?.length || 0)}টি পণ্য` : "মূল সেকশন"}</small></div></button><div className="section-row-actions"><label><input type="checkbox" aria-label={`${name(b)} দেখান`} checked={b.enabled} onChange={e => update(blocks.map(old => old.id === b.id ? { ...old, enabled: e.target.checked } : old))}/><span>দেখান</span></label><button className="icon-btn" aria-label={`${name(b)} উপরে নিন`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={15}/></button><button className="icon-btn" aria-label={`${name(b)} নিচে নিন`} disabled={index === blocks.length - 1} onClick={() => move(index, 1)}><ArrowDown size={15}/></button>{b.kind === "collection" && <button className="icon-btn" aria-label={`${name(b)} সেকশন সরান`} onClick={() => { update(blocks.filter(old => old.id !== b.id)); if (selected === b.id) setSelected(""); }}><Trash2 size={15}/></button>}</div></li>)}</ol></aside>
    <div className="section-edit-panel">{draft?.kind === "collection" ? <>
      <h2>সেকশনের বিষয়বস্তু</h2><div className="form-stack"><label className="field">সেকশনের শিরোনাম<input maxLength={100} value={draft.title || ""} onChange={e => patch({ title: e.target.value })}/></label><div className="form-grid"><label className="field">ছোট শিরোনাম<input maxLength={80} value={draft.kicker || ""} onChange={e => patch({ kicker: e.target.value })}/></label><label className="field">পণ্য দেখানোর ধরন<select aria-label="পণ্য দেখানোর ধরন" value={draft.layout || "slider"} onChange={e => patch({ layout: e.target.value as "slider" | "grid" })}><option value="slider">অটো স্লাইডার</option><option value="grid">গ্রিড</option></select></label></div><label className="field">সংক্ষিপ্ত বিবরণ<textarea rows={2} maxLength={240} value={draft.description || ""} onChange={e => patch({ description: e.target.value })}/></label><div className="form-grid"><label className="field">লিংকের লেখা<input value={draft.linkLabel || ""} placeholder="সব পণ্য" onChange={e => patch({ linkLabel: e.target.value })}/></label><label className="field">গন্তব্য লিংক<input aria-label="গন্তব্য লিংক" value={draft.href || ""} placeholder="/organic/shop?subcategory=আচার" onChange={e => patch({ href: e.target.value })}/><small>নিজের সাইটের পাথ অথবা https লিংক দিন।</small></label></div></div>
      <h3>নির্বাচিত পণ্যের ক্রম</h3><div className="selected-section-products">{(draft.productIds || []).map((id, i, ids) => { const p = s.products.find(p => p.id === id); return <div key={id}><span>{bnNode(p?.name || "পণ্যটি পাওয়া যাচ্ছে না")}</span><button className="icon-btn" aria-label={`${p?.name || id} আগে নিন`} disabled={!i} onClick={() => { const next = [...ids]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; patch({ productIds: next }); }}><ArrowUp size={14}/></button><button className="icon-btn" aria-label={`${p?.name || id} নির্বাচন বাদ দিন`} onClick={() => patch({ productIds: ids.filter(p => p !== id) })}><Trash2 size={14}/></button></div>; })}</div>
      <div className="section-product-search"><label className="field">পণ্য খুঁজুন<input value={search} onChange={e => setSearch(e.target.value)} placeholder="পণ্যের নাম"/></label><label className="field">পণ্যের সংগ্রহ<select aria-label="পণ্যের সংগ্রহ" value={scope} onChange={e => setScope(e.target.value)}><option value="category">এই ক্যাটাগরি</option><option value="all">সব ক্যাটাগরি</option></select></label></div><div className="section-product-picker">{candidates.map(p => <label key={p.id}><input type="checkbox" aria-label={`${p.name} সেকশনে রাখুন`} checked={draft.productIds?.includes(p.id) || false} onChange={e => patch({ productIds: e.target.checked ? [...(draft.productIds || []), p.id] : draft.productIds?.filter(id => id !== p.id) })}/><img src={p.image} alt="" loading="lazy"/><span>{bnNode(p.name)}<small>{bnNode(p.category)}</small></span></label>)}</div>
    </> : <div className="section-editor-empty"><h2>{draft ? bnNode(name(draft)) : "নিজের মতো পণ্য সাজান"}</h2><p>{draft ? "এই মূল সেকশনের অবস্থান ও দৃশ্যমানতা বাম পাশ থেকে নিয়ন্ত্রণ করুন।" : "নতুন সেকশন যোগ করে শিরোনাম, পণ্য এবং সব পণ্যের লিংক দিন।"}</p><p>লেখায় পণ্যের যাচাই করা তথ্য ও বাস্তব সুবিধা তুলে ধরুন।</p></div>}</div></div>
    {pending && <Modal title="পরিবর্তন সেভ হয়নি" onClose={() => setPending("")}><p>ক্যাটাগরি বদলালে সেভ না করা পরিবর্তন থাকবে না।</p><div className="modal-actions"><Button variant="outline" onClick={() => setPending("")}>সম্পাদনায় ফিরুন</Button><Button onClick={() => { choose(pending); setPending(""); }}>পরিবর্তন বাদ দিয়ে যান</Button></div></Modal>}
  </div>;
}
