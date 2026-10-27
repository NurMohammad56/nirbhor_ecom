import { itemPrice, productVariants, variantUnits } from "./data";
import type { CartItem, Product } from "./data";

export type PriceType = "Percentage" | "Fixed amount" | "Set price";
export type ComboOffer = {
  id: string; name: string; description: string;
  items: { productId: string; variant: string; quantity: number }[];
  type: PriceType; value: number; start: string; end: string;
  active: boolean; featured: boolean; allowCoupon: boolean; freeShipping: boolean;
  limitPerOrder: number;
};
export type DiscountRule = {
  id: string; name: string; type: "Percentage" | "Fixed amount"; value: number;
  scope: string; minimum: number; maxDiscount: number;
  start: string; end: string; active: boolean; allowCoupon: boolean; excludeSale: boolean;
};
export type Promotions = { combos: ComboOffer[]; discounts: DiscountRule[] };
export const seedCombos: ComboOffer[] = [
  { id: "combo-morning", name: "সকালের সঙ্গী", description: "মধু, মিক্সড নাটস ও হারবাল চা - একসঙ্গে একটু সাশ্রয়।", items: [{ productId: "p1", variant: "500g", quantity: 1 }, { productId: "p2", variant: "250g", quantity: 1 }, { productId: "p4", variant: "12 sachets", quantity: 1 }], type: "Set price", value: 1790, start: "", end: "", active: true, featured: true, allowCoupon: false, freeShipping: false, limitPerOrder: 5 },
  { id: "combo-pantry", name: "রান্নাঘরের ভালো পছন্দ", description: "গাওয়া ঘি, হলুদের গুঁড়া ও চিয়া সিডের কম্বো।", items: [{ productId: "p5", variant: "500ml", quantity: 1 }, { productId: "p16", variant: "200g", quantity: 1 }, { productId: "p6", variant: "250g", quantity: 1 }], type: "Percentage", value: 10, start: "", end: "", active: true, featured: true, allowCoupon: false, freeShipping: false, limitPerOrder: 5 },
];
export const seedDiscounts: DiscountRule[] = [{ id: "discount-weekend", name: "অর্গানিক পণ্যে বাড়তি সাশ্রয়", type: "Percentage", value: 10, scope: "Organic Food", minimum: 1000, maxDiscount: 200, start: "", end: "", active: false, allowCoupon: false, excludeSale: false }];

// Date-only offers use Bangladesh business time, including the full end date.
export const offerDate = (date: string, end = false) => date ? Date.parse(date.length === 10 ? `${date}T${end ? "23:59:59.999" : "00:00:00"}+06:00` : date) : end ? Infinity : -Infinity;
export const offerActive = (offer: { active: boolean; start: string; end: string }, now = Date.now()) => offer.active && now >= offerDate(offer.start) && now <= offerDate(offer.end, true);
export const offerStatus = (offer: { active: boolean; start: string; end: string }) => !offer.active ? "খসড়া" : Date.now() < offerDate(offer.start) ? "নির্ধারিত" : Date.now() > offerDate(offer.end, true) ? "মেয়াদ শেষ" : "চলমান";
export const discountAmount = (subtotal: number, type: PriceType, value: number, cap = 0) => Math.min(subtotal, Math.max(0, Math.round(Math.min(cap || Infinity, type === "Percentage" ? subtotal * Math.min(100, value) / 100 : type === "Set price" ? subtotal - value : value))));
export function comboPricing(offer: ComboOffer, products: Product[]) {
  const subtotal = offer.items.reduce((sum, item) => { const p = products.find(p => p.id === item.productId); return sum + (p ? itemPrice(p, item.variant) * item.quantity : 0); }, 0);
  const saving = discountAmount(subtotal, offer.type, offer.value);
  return { subtotal, saving, price: subtotal - saving };
}
export function comboAvailable(offer: ComboOffer, products: Product[], cart: CartItem[] = [], packs = 1) {
  if (!offerActive(offer) || !offer.items.length || !Number.isInteger(packs) || packs < 1 || packs > offer.limitPerOrder) return false;
  const all = [...cart, ...offer.items.map(i => ({ id: i.productId, quantity: i.quantity * packs, variant: i.variant }))];
  return offer.items.every(item => {
    const p = products.find(p => p.id === item.productId), variant = p && productVariants(p).find(v => v.label === item.variant);
    return p?.status === "Published" && !!variant && all.filter(i => i.id === p.id).reduce((n, i) => n + i.quantity * variantUnits(i.variant), 0) <= p.stock && all.filter(i => i.id === p.id && i.variant === item.variant).reduce((n, i) => n + i.quantity, 0) <= variant.stock;
  });
}
export function comboPacks(offer: ComboOffer, items: CartItem[]) {
  const group = items.filter(i => i.comboId === offer.id);
  if (group.length !== offer.items.length) return 0;
  const packs = group[0]?.quantity / (offer.items.find(i => i.productId === group[0].id && i.variant === group[0].variant)?.quantity || NaN);
  return Number.isInteger(packs) && packs > 0 && packs <= offer.limitPerOrder && offer.items.every(i => group.some(g => g.id === i.productId && g.variant === i.variant && g.quantity === i.quantity * packs)) ? packs : 0;
}
export function comboIssues(items: CartItem[], products: Product[], combos: ComboOffer[]) {
  return [...new Set(items.filter(i => i.comboId).map(i => i.comboId!))].filter(id => { const offer = combos.find(c => c.id === id); return !offer || !offerActive(offer) || !comboPacks(offer, items) || !offer.items.every(i => { const p = products.find(p => p.id === i.productId); return p?.status === "Published" && productVariants(p).some(v => v.label === i.variant); }); });
}
export function promotionSavings(items: CartItem[], products: Product[], promotions?: Promotions) {
  const savings: { name: string; amount: number }[] = [], blocked = new Set<CartItem>();
  const remaining = new Map(items.map(i => [i, (i.unitPrice ?? itemPrice(products.find(p => p.id === i.id)!, i.variant)) * i.quantity]));
  const deduct = (eligible: CartItem[], amount: number) => {
    const total = eligible.reduce((n, i) => n + (remaining.get(i) || 0), 0);
    if (total) eligible.forEach(i => remaining.set(i, (remaining.get(i) || 0) * (1 - amount / total)));
  };
  let comboDiscount = 0, automaticDiscount = 0, freeShipping = false;
  for (const offer of promotions?.combos || []) {
    const packs = comboPacks(offer, items);
    if (!packs || comboIssues(items.filter(i => i.comboId === offer.id), products, [offer]).length) continue;
    const amount = comboPricing(offer, products).saving * packs;
    comboDiscount += amount; freeShipping ||= offer.freeShipping;
    savings.push({ name: offer.name, amount });
    deduct(items.filter(i => i.comboId === offer.id), amount);
    if (!offer.allowCoupon) items.filter(i => i.comboId === offer.id).forEach(i => blocked.add(i));
  }
  let best: { rule: DiscountRule; amount: number; eligible: CartItem[] } | undefined;
  for (const rule of promotions?.discounts || []) {
    if (!offerActive(rule)) continue;
    const eligible = items.filter(i => { const p = products.find(p => p.id === i.id); return !i.comboId && p && (!rule.excludeSale || p.oldPrice <= p.price) && (rule.scope === "All products" || rule.scope === p.category || rule.scope === "Product: " + p.id); });
    const subtotal = eligible.reduce((sum, i) => { const p = products.find(p => p.id === i.id)!; return sum + itemPrice(p, i.variant) * i.quantity; }, 0);
    if (!eligible.length || subtotal < rule.minimum) continue;
    const amount = discountAmount(subtotal, rule.type, rule.value, rule.maxDiscount);
    if (!best || amount > best.amount) best = { rule, amount, eligible };
  }
  if (best && best.amount > 0) { automaticDiscount = best.amount; savings.push({ name: best.rule.name, amount: best.amount }); deduct(best.eligible, best.amount); if (!best.rule.allowCoupon) best.eligible.forEach(i => blocked.add(i)); }
  return { comboDiscount, automaticDiscount, freeShipping, savings, blocked, remaining };
}
