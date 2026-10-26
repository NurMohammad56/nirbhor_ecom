import type { CartItem, Coupon, Product } from "./data";
export function couponApplies(coupon: Coupon, product: Product) {
  return (
    coupon.scope === "All products" ||
    coupon.scope === product.category ||
    coupon.scope === "Product: " + product.id ||
    coupon.scope === "Brand: " + product.brand
  );
}
export function eligibleCouponItems(
  coupon: Coupon,
  items: CartItem[],
  products: Product[],
) {
  return items.filter((i) => {
    const p = products.find((p) => p.id === i.id);
    return p && couponApplies(coupon, p);
  });
}
