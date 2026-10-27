import type { Order, Product } from "./data";
import { variantUnits } from "./data";

const saleStatuses = new Set(["Confirmed", "Processing", "Packed", "Shipped", "Out for delivery", "Delivered"]);
export function productSales(orders: Order[]) {
  const counts = new Map<string, number>();
  for (const order of orders) {
    if (!saleStatuses.has(order.status)) continue;
    for (const item of order.items) counts.set(item.id, (counts.get(item.id) || 0) + item.quantity * variantUnits(item.variant));
  }
  return counts;
}
export function bestSelling(products: Product[], orders: Order[], limit = 8) {
  const sales = productSales(orders);
  return products.filter(p => p.status === "Published")
    .sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || (sales.get(b.id) || 0) - (sales.get(a.id) || 0))
    .slice(0, limit);
}
