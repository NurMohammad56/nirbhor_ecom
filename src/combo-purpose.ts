import type { ComboOffer } from "./promotions";
import type { Product } from "./data";
import { productVariants } from "./data";
export const comboPurposes = { kitchen: "রান্নাঘর ও মসলা", breakfast: "সকালের আয়োজন", snacks: "নাশতার বিরতি", pickles: "আচার", home: "ঘর ও টেবিল", care: "দৈনন্দিন যত্ন" };
export type ComboPurpose = keyof typeof comboPurposes;
export function comboHasProducts(offer: ComboOffer, products: Product[]) {
  return offer.items.length > 0 && offer.items.every(item => { const p = products.find(p => p.id === item.productId && p.status === "Published"); return p && productVariants(p).some(v => v.label === item.variant); });
}
export function comboPurpose(offer: ComboOffer, products: Product[]): ComboPurpose | "other" {
  if (offer.purpose && Object.hasOwn(comboPurposes, offer.purpose)) return offer.purpose;
  if (offer.id === "combo-morning") return "breakfast";
  if (offer.id === "combo-pantry") return "kitchen";
  const items = offer.items.map(i => products.find(p => p.id === i.productId));
  if (items.length && items.every(p => p?.category === "Beauty & Care")) return "care";
  if (items.length && items.every(p => p?.category === "Home & Living")) return "home";
  if (items.length && items.every(p => p?.subcategory === "আচার")) return "pickles";
  if (items.some(p => p?.subcategory === "Spices & Oils")) return "kitchen";
  return "other";
}
