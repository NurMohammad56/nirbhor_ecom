import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useStore, usePlaceOrder, cartTotals } from "./store";
import { bnNode, latinDigits } from "./bn";
import { money, productVariants, variantUnits } from "./data";
import type { Product } from "./data";
import { productPageContent } from "./product-page-content";
import { productHref } from "./departments";
import { Button, Modal, Quantity } from "./ui";

export default function QuickOrderButton({ product, variant, quantity = 1, className = "" }: { product: Product; variant?: string; quantity?: number; className?: string }) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" className={`quick-order-trigger ${className}`} aria-haspopup="dialog" disabled={!product.stock || product.status !== "Published"} onClick={() => setOpen(true)}><Zap size={15}/><span>দ্রুত অর্ডার</span><ArrowRight size={15}/></button>
    {open && createPortal(<QuickOrderDialog productId={product.id} initialVariant={variant} initialQuantity={quantity} onClose={() => setOpen(false)}/>, document.body)}
  </>;
}

function QuickOrderDialog({ productId, initialVariant, initialQuantity, onClose }: { productId: string; initialVariant?: string; initialQuantity: number; onClose: () => void }) {
  const s = useStore(), placeOrder = usePlaceOrder(), navigate = useNavigate(), submitting = useRef(false);
  const [selected, setSelected] = useState(initialVariant || ""), [quantity, setQuantity] = useState(initialQuantity), [zone, setZone] = useState("Dhaka");
  const p = s.products.find(p => p.id === productId);
  if (!p || p.status !== "Published") return <Modal title="দ্রুত অর্ডার" onClose={onClose}><p>পণ্যটি এখন পাওয়া যাচ্ছে না। অন্য একটি পণ্য বেছে নিন।</p></Modal>;
  const variants = productVariants(p), variant = variants.find(v => v.label === selected) || variants.find(v => v.stock > 0) || variants[0];
  const max = Math.max(0, Math.min(variant.stock, Math.floor(p.stock / variantUnits(variant.label))));
  const count = Math.max(1, Math.min(quantity, max || 1));
  const items = [{ id: p.id, variant: variant.label, quantity: count }];
  const totals = cartTotals(items, s.products, s.settings, zone, undefined, s);
  const page = productPageContent(p);
  return <Modal title="দ্রুত অর্ডার" onClose={onClose}>
    <form className="express-order" onSubmit={e => {
      e.preventDefault();
      if (submitting.current || !max || !s.settings.cod) return;
      submitting.current = true;
      const data = new FormData(e.currentTarget);
      const order = placeOrder({ customer: String(data.get("name")).trim(), phone: latinDigits(String(data.get("phone"))).trim(), email: s.profile.email || "", address: String(data.get("address")).trim(), zone, payment: "Cash on delivery", note: "Product quick order", items });
      if (order) { onClose(); navigate(`/order-success/${order.id}`); }
      else submitting.current = false;
    }}>
      <div className="express-product"><img src={variant.image || p.image} alt=""/><div><h3>{bnNode(p.name)}</h3><span>{bnNode(variant.label)}</span><b>{bnNode(money(variant.price))}</b></div></div>
      <div className="express-options"><label className="field">সাইজ / প্যাক<select value={variant.label} onChange={e => { setSelected(e.target.value); setQuantity(1); }}>{variants.map(v => <option key={v.label} value={v.label} disabled={!v.stock || p.stock < variantUnits(v.label)}>{bnNode(v.label)} - {bnNode(money(v.price))}{!v.stock ? " (স্টক নেই)" : ""}</option>)}</select></label><div><span className="express-quantity-label">পরিমাণ</span><Quantity value={count} max={max} onChange={setQuantity}/></div></div>
      <div className="form-grid">
        <label className="field">আপনার নাম<input name="name" autoComplete="name" defaultValue={s.profile.name} required minLength={2} placeholder="পুরো নাম লিখুন"/></label>
        <label className="field">মোবাইল নম্বর<input name="phone" type="tel" autoComplete="tel" inputMode="tel" defaultValue={s.profile.phone} required pattern="(?:\+?88)?01[3-9][0-9]{8}" onChange={e => { e.currentTarget.value = latinDigits(e.currentTarget.value); }} placeholder="01XXXXXXXXX" title="সঠিক বাংলাদেশি মোবাইল নম্বর দিন"/></label>
      </div>
      <label className="field">ডেলিভারির ঠিকানা<textarea name="address" autoComplete="street-address" rows={2} required minLength={10} placeholder="বাসা, রোড, এলাকা ও জেলার নাম"/></label>
      <label className="field">ডেলিভারি এলাকা<select value={zone} onChange={e => setZone(e.target.value)}><option value="Dhaka">ঢাকার ভেতরে</option><option value="Outside Dhaka">ঢাকার বাইরে</option></select></label>
      <div className="express-total">
        <div><span>পণ্যের দাম</span><b>{bnNode(money(totals.subtotal))}</b></div>
        {totals.savings.map((saving,i) => <div className="green" key={i}><span>{bnNode(saving.name)}</span><b>- {bnNode(money(saving.amount))}</b></div>)}
        <div><span>ডেলিভারি</span><b>{totals.shipping ? bnNode(money(totals.shipping)) : "ফ্রি"}</b></div>
        {totals.tax > 0 && <div><span>কর</span><b>{bnNode(money(totals.tax))}</b></div>}
        <div className="express-grand-total"><span>সর্বমোট</span><strong data-testid="express-order-total">{bnNode(money(totals.total))}</strong></div>
      </div>
      <label className="check-label"><input type="checkbox" required/><span><Link to="/page/terms">শর্তাবলি</Link> ও <Link to="/page/privacy">গোপনীয়তা নীতিতে</Link> সম্মত আছি</span></label>
      <Button type="submit" className="full" disabled={!max || !s.settings.cod}>{bnNode(page.quickOrderButtonText || "অর্ডার নিশ্চিত করুন")}<ArrowRight size={16}/></Button>
      {!s.settings.cod && <p className="field-error">ক্যাশ অন ডেলিভারি এখন বন্ধ আছে। <Link to={productHref(p, s.categories)} onClick={onClose}>পণ্যের বিস্তারিত দেখুন</Link></p>}
      {!max && <p className="field-error">এই প্যাকটি এখন স্টকে নেই। অন্য প্যাক বেছে নিন।</p>}
      <span className="express-security"><ShieldCheck size={15}/>পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন</span>
      <p className="express-preview-note">প্রোটোটাইপ: অর্ডার এই ব্রাউজারে সংরক্ষিত হবে।</p>
    </form>
  </Modal>;
}
