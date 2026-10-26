import { useStore } from "./store";
import { statusSteps, variantUnits } from "./data";
import type { Order } from "./data";
export function useUpdateOrder() {
  const s = useStore();
  return (id: string, updates: Partial<Order>) => {
    const order = s.orders.find((o) => o.id === id);
    if (!order) return false;
    const nextStatus = updates.status || order.status;
    const released =
      order.stockReleased || ["Cancelled", "Returned"].includes(order.status);
    const release = !released && ["Cancelled", "Returned"].includes(nextStatus);
    const reserve = released && statusSteps.includes(nextStatus);
    if (release || reserve) {
      const counts: Record<string, number> = {};
      order.items.forEach(
        (i) =>
          (counts[i.id] =
            (counts[i.id] || 0) + i.quantity * variantUnits(i.variant)),
      );
      if (reserve) {
        for (const [id, n] of Object.entries(counts)) {
          const p = s.products.find((p) => p.id === id);
          if (!p || p.stock < n) {
            s.toast("There isn’t enough stock to reopen this order.");
            return false;
          }
        }
      }
      s.setProducts((x) =>
        x.map((p) => {
          const n = counts[p.id];
          if (!n) return p;
          return {
            ...p,
            stock: p.stock + (release ? n : -n),
            variants: p.variants?.map((v) => {
              const qty = order.items
                .filter((i) => i.id === p.id && i.variant === v.label)
                .reduce((n, i) => n + i.quantity, 0);
              return {
                ...v,
                stock: Math.max(0, v.stock + (release ? qty : -qty)),
              };
            }),
          };
        }),
      );
    }
    s.setOrders((x) =>
      x.map((o) =>
        o.id === id
          ? {
              ...o,
              ...updates,
              stockReleased: release ? true : reserve ? false : released,
            }
          : o,
      ),
    );
    if (s.settings.notifications && nextStatus !== order.status)
      s.setNotifications((x) => [
        `Your order #${id} is now ${nextStatus.toLowerCase()}.`,
        ...x,
      ]);
    return true;
  };
}
