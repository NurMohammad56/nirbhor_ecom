import { bnNode } from "./bn";
import { eligibleCouponItems } from "./order-logic";
import { seedCombos, seedDiscounts, comboAvailable, comboPacks, comboIssues, promotionSavings, offerActive } from "./promotions";
import type { ComboOffer, DiscountRule, Promotions } from "./promotions";
import { migrateDepartmentState } from "./department-state";
import { migrateSceneState } from "./scene-state";
import { migrateBengaliState } from "./bn-state";
import { migrateBrandState } from "./brand-state";
import { migratePantryState } from "./pantry-expansion";
import { migrateDailyState } from "./daily-expansion";
import { migrateSmartState } from "./smart-state";
import { migrateStyleState } from "./style-state";
import { migrateTechState } from "./tech-state";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import {
  seedProducts,
  seedCategories,
  seedCampaigns,
  seedCoupons,
  seedOrders,
  seedReviews,
  seedSettings,
  seedBanners,
  uid,
  itemPrice,
  variantUnits,
  productVariants,
} from "./data";
import type {
  Product,
  Category,
  Campaign,
  Coupon,
  Order,
  Review,
  Settings,
  Banner,
  CartItem,
  Profile,
  Address,
} from "./data";
function usePersist<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem("nirbhor-v1-" + key);
      return migrateTechState(key, migrateStyleState(key, migrateSmartState(key, migrateDailyState(key, migratePantryState(key, migrateBrandState(key, migrateBengaliState(key, migrateSceneState(key, migrateDepartmentState(key, saved ? JSON.parse(saved) : initial)))))))));
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("nirbhor-v1-" + key, JSON.stringify(value));
    } catch {
      window.dispatchEvent(new Event("nirbhor-storage-full"));
    }
  }, [key, value]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === "nirbhor-v1-" + key && event.newValue) {
        try {
          setValue(JSON.parse(event.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [key]);
  return [value, setValue];
}
type Event = { id: string; name: string; detail: string; date: string };
type State = {
  combos: ComboOffer[];
  setCombos: Dispatch<SetStateAction<ComboOffer[]>>;
  discounts: DiscountRule[];
  setDiscounts: Dispatch<SetStateAction<DiscountRule[]>>;
  addCombo: (id: string, quantity?: number) => boolean;
  updateCombo: (id: string, packs: number) => void;
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  campaigns: Campaign[];
  setCampaigns: Dispatch<SetStateAction<Campaign[]>>;
  coupons: Coupon[];
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  reviews: Review[];
  setReviews: Dispatch<SetStateAction<Review[]>>;
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  banners: Banner[];
  setBanners: Dispatch<SetStateAction<Banner[]>>;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  wishlist: string[];
  setWishlist: Dispatch<SetStateAction<string[]>>;
  recent: string[];
  setRecent: Dispatch<SetStateAction<string[]>>;
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  addresses: Address[];
  setAddresses: Dispatch<SetStateAction<Address[]>>;
  events: Event[];
  track: (name: string, detail?: string) => void;
  toast: (message: string) => void;
  addToCart: (id: string, quantity?: number, variant?: string) => void;
  toggleWish: (id: string, variant?: string) => void;
  drawer: boolean;
  setDrawer: Dispatch<SetStateAction<boolean>>;
  notes: Record<string, string>;
  setNotes: Dispatch<SetStateAction<Record<string, string>>>;
  notifications: string[];
  setNotifications: Dispatch<SetStateAction<string[]>>;
  content: Record<string, string>;
  setContent: Dispatch<SetStateAction<Record<string, string>>>;
  inventoryLog: {
    date: string;
    product: string;
    change: number;
    reason: string;
  }[];
  setInventoryLog: Dispatch<
    SetStateAction<
      { date: string; product: string; change: number; reason: string }[]
    >
  >;
};
const Context = createContext<State>(null!);
export const useStore = () => useContext(Context);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [combos, setCombos] = usePersist("combos", seedCombos), [discounts, setDiscounts] = usePersist("discounts", seedDiscounts);
  const [products, setProducts] = usePersist("products", seedProducts),
    [categories, setCategories] = usePersist("categories", seedCategories),
    [campaigns, setCampaigns] = usePersist("campaigns", seedCampaigns),
    [coupons, setCoupons] = usePersist("coupons", seedCoupons),
    [orders, setOrders] = usePersist("orders", seedOrders),
    [reviews, setReviews] = usePersist("reviews", seedReviews),
    [settings, setSettings] = usePersist("settings", seedSettings),
    [banners, setBanners] = usePersist("banners", seedBanners),
    [cart, setCart] = usePersist<CartItem[]>("cart", []),
    [wishlist, setWishlist] = usePersist<string[]>("wishlist", []),
    [recent, setRecent] = usePersist<string[]>("recent", []),
    [profile, setProfile] = usePersist<Profile>("profile", {
      name: "",
      email: "",
      phone: "",
      loggedIn: false,
    }),
    [addresses, setAddresses] = usePersist<Address[]>("addresses", []),
    [events, setEvents] = usePersist<Event[]>("events", []),
    [notes, setNotes] = usePersist<Record<string, string>>("notes", {}),
    [notifications, setNotifications] = usePersist<string[]>("notifications", [
      "Welcome to a little more goodness. Your account is ready to explore.",
    ]),
    [content, setContent] = usePersist<Record<string, string>>("content", {}),
    [inventoryLog, setInventoryLog] = usePersist<
      { date: string; product: string; change: number; reason: string }[]
    >("inventoryLog", []);
  const [drawer, setDrawer] = useState(false),
    [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);
  const toast = (message: string) => {
    const id = uid("t");
    setToasts((x) => [...x.slice(-2), { id, message }]);
    setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), 4000);
  };
  const track = (name: string, detail = "") =>
    setEvents((x) =>
      [
        { id: uid("e"), name, detail, date: new Date().toISOString() },
        ...x,
      ].slice(0, 500),
    );
  const addToCart = (id: string, quantity = 1, variant?: string) => {
    const p = products.find((x) => x.id === id);
    if (!p || p.stock < 1) {
      toast("This item is currently out of stock.");
      return;
    }
    const selected = variant || p.weight;
    const exists = cart.find((x) => !x.comboId && x.id === id && x.variant === selected);
    const inCart = cart
      .filter((x) => x.id === id)
      .reduce((n, x) => n + x.quantity * variantUnits(x.variant), 0);
    const option = productVariants(p).find((v) => v.label === selected);
    if (
      inCart + quantity * variantUnits(selected) > p.stock ||
      cart.filter(i => i.id === id && i.variant === selected).reduce((n, i) => n + i.quantity, 0) + quantity > (option?.stock ?? p.stock)
    ) {
      toast(`Only ${p.stock} available in this batch.`);
      return;
    }
    setCart((x) =>
      exists
        ? x.map((y) =>
              !y.comboId && y.id === id && y.variant === selected
              ? { ...y, quantity: y.quantity + quantity }
              : y,
          )
        : [...x, { id, quantity, variant: selected }],
    );
    track("AddToCart", p.name);
    toast(`${p.name} added to your bag`);
  };
  const updateCombo = (id: string, packs: number) => {
    const offer = combos.find(c => c.id === id);
    if (packs <= 0) { setCart(x => x.filter(i => i.comboId !== id)); return; }
    if (!offer || !comboAvailable(offer, products, cart.filter(i => i.comboId !== id), packs)) { toast("এই পরিমাণ কম্বোর জন্য পর্যাপ্ত স্টক নেই অথবা অফারটি শেষ হয়েছে।"); return; }
    setCart(x => [...x.filter(i => i.comboId !== id), ...offer.items.map(i => ({ id: i.productId, variant: i.variant, quantity: i.quantity * packs, comboId: id }))]);
  };
  const addCombo = (id: string, quantity = 1) => {
    const offer = combos.find(c => c.id === id);
    const packs = offer ? comboPacks(offer, cart) + quantity : quantity;
    if (!Number.isInteger(quantity) || quantity < 1) return false;
    if (!offer || !comboAvailable(offer, products, cart.filter(i => i.comboId !== id), packs)) { toast("এই কম্বোটি এখন পাওয়া যাচ্ছে না। স্টক ও মেয়াদ দেখে আবার চেষ্টা করুন।"); return false; }
    updateCombo(id, packs); track("AddToCart", `Combo: ${offer.name}`); toast("কম্বোটি ব্যাগে যোগ হয়েছে।"); return true;
  };
  useEffect(() => {
    const onFull = () =>
      toast(
        "Your browser storage is full. Remove a few uploaded files before saving more.",
      );
    window.addEventListener("nirbhor-storage-full", onFull);
    return () => window.removeEventListener("nirbhor-storage-full", onFull);
  }, []);
  const toggleWish = (id: string, variant?: string) => {
    const p = products.find((p) => p.id === id);
    const exists = wishlist.includes(id);
    if (!exists && p)
      setNotes((x) => ({
        ...x,
        ["wish-variant-" + id]: variant || p.weight,
        ["wish-price-" + id]: String(itemPrice(p, variant || p.weight)),
      }));
    setWishlist((x) => (exists ? x.filter((y) => y !== id) : [...x, id]));
    toast(exists ? "Removed from your wishlist" : "Saved to your wishlist");
  };
  return (
    <Context.Provider
      value={{
        combos, setCombos, discounts, setDiscounts, addCombo, updateCombo,
        products,
        setProducts,
        categories,
        setCategories,
        campaigns,
        setCampaigns,
        coupons,
        setCoupons,
        orders,
        setOrders,
        reviews,
        setReviews,
        settings,
        setSettings,
        banners,
        setBanners,
        cart,
        setCart,
        wishlist,
        setWishlist,
        recent,
        setRecent,
        profile,
        setProfile,
        addresses,
        setAddresses,
        events,
        track,
        toast,
        addToCart,
        toggleWish,
        drawer,
        setDrawer,
        notes,
        setNotes,
        notifications,
        setNotifications,
        content,
        setContent,
        inventoryLog,
        setInventoryLog,
      }}
    >
      {bnNode(children)}
      <div className="toast-stack" role="status" aria-live="polite">
        {bnNode(toasts.map((t) => (
          <div className="toast" key={t.id}>
            <span className="toast-check">{bnNode("✓")}</span>
            {bnNode(t.message)}
            <button
              aria-label={bnNode("Dismiss notification")}
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
            >{bnNode("×")}</button>
          </div>
        )))}
      </div>
    </Context.Provider>
  );
}
export function cartTotals(
  cart: CartItem[],
  products: Product[],
  settings: Settings,
  zone = "Dhaka",
  coupon?: Coupon,
  promotions?: Promotions,
) {
  const price = (i: CartItem) => {
    const p = products.find((p) => p.id === i.id);
    return i.unitPrice ?? (p ? itemPrice(p, i.variant) : 0);
  };
  const subtotal = cart.reduce((n, i) => n + price(i) * i.quantity, 0);
  const promo = promotionSavings(cart.filter(i => products.some(p => p.id === i.id)), products, promotions);
  const eligible = coupon ? eligibleCouponItems(coupon, cart, products).filter(i => !promo.blocked.has(i) && (!coupon.excludeSale || products.find(p => p.id === i.id)!.oldPrice <= products.find(p => p.id === i.id)!.price)) : [];
  const eligibleSubtotal = eligible.reduce(
    (n, i) => n + (promo.remaining.get(i) ?? price(i) * i.quantity),
    0,
  );
  let discount = 0;
  if (coupon?.type === "Percentage")
    discount = Math.round(
      (eligibleSubtotal * Math.min(100, coupon.value)) / 100,
    );
  if (coupon?.type === "Fixed amount")
    discount = Math.min(eligibleSubtotal, coupon.value);
  if (coupon?.type === "Buy 2 get 1") {
    const units = eligible
      .flatMap((i) => Array(Math.min(i.quantity, 1000)).fill((promo.remaining.get(i) ?? price(i) * i.quantity) / i.quantity))
      .sort((a, b) => a - b);
    discount = units
      .slice(0, Math.floor(units.length / 3))
      .reduce((n, p) => n + p, 0);
  }
  if (coupon?.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.round(Math.min(eligibleSubtotal, discount));
  const couponDiscount = discount;
  discount += promo.comboDiscount + promo.automaticDiscount;
  const shipping =
    subtotal === 0 ||
    subtotal >= settings.freeShipping ||
    promo.freeShipping ||
    (coupon?.type === "Free shipping" && eligibleSubtotal > 0)
      ? 0
      : zone === "Dhaka"
        ? settings.dhaka
        : settings.outside;
  const tax = Math.round(((subtotal - discount) * settings.tax) / 100);
  return {
    subtotal,
    discount,
    shipping,
    tax,
    total: subtotal - discount + shipping + tax,
    couponDiscount,
    couponEligibleSubtotal: eligibleSubtotal,
    savings: [...promo.savings, ...(couponDiscount > 0 ? [{ name: `কুপন ${coupon!.code}`, amount: couponDiscount }] : [])],
  };
}
export function usePlaceOrder() {
  const s = useStore();
  return (input: {
    customer: string;
    phone: string;
    email: string;
    address: string;
    zone: string;
    payment: string;
    note: string;
    items: CartItem[];
    coupon?: Coupon;
  }) => {
    if (comboIssues(input.items, s.products, s.combos).length) { s.toast("কম্বো অফারটি বদলেছে অথবা শেষ হয়েছে। ব্যাগে ফিরে কম্বোটি সরিয়ে আবার যোগ করুন।"); return; }
    const counts: Record<string, number> = {};
    const variantCounts: Record<string, number> = {};
    for (const item of input.items) {
      const p = s.products.find((p) => p.id === item.id);
      if (
        !p ||
        p.status !== "Published" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        s.toast("An item is no longer available. Please check your bag.");
        return;
      }
      counts[item.id] =
        (counts[item.id] || 0) + item.quantity * variantUnits(item.variant);
      const v = productVariants(p).find((v) => v.label === item.variant);
      const key = item.id + ":" + item.variant;
      variantCounts[key] = (variantCounts[key] || 0) + item.quantity;
      if (!v || variantCounts[key] > v.stock) {
        s.toast(`${p.name}: this option no longer has enough stock.`);
        return;
      }
    }
    for (const [id, n] of Object.entries(counts)) {
      const p = s.products.find((p) => p.id === id)!;
      if (n > p.stock) {
        s.toast(`Only ${p.stock} ${p.name} available. Please update your bag.`);
        return;
      }
    }
    if (!input.items.length) return;
    if (input.coupon) {
      const c = s.coupons.find((c) => c.id === input.coupon!.id);
      const sub = cartTotals(
        input.items,
        s.products,
        s.settings,
        input.zone,
      ).subtotal;
      const used = s.orders.filter(
        (o) =>
          o.couponCode === c?.code &&
          o.status !== "Cancelled" &&
          ((input.email &&
            o.email.toLowerCase() === input.email.toLowerCase()) ||
            o.phone.replace(/\D/g, "").slice(-11) ===
              input.phone.replace(/\D/g, "").slice(-11)),
      ).length;
      if (
        !c ||
        !c.active ||
        c.uses >= c.limit ||
        !offerActive(c) ||
        sub < c.minimum ||
        used >= c.perUser ||
        cartTotals(input.items, s.products, s.settings, input.zone, c, s).couponEligibleSubtotal <= 0
      ) {
        s.toast(
          "This offer is no longer eligible for your order. Please remove it or choose another code.",
        );
        return;
      }
    }
    const totals = cartTotals(
      input.items,
      s.products,
      s.settings,
      input.zone,
      input.coupon,
      s,
    );
    const order: Order = {
      id: `NBR-${Math.max(4821, ...s.orders.map((o) => Number(o.id.split("-")[1]) || 0)) + 1}`,
      customer: input.customer,
      phone: input.phone,
      email: input.email,
      address: input.address,
      zone: input.zone,
      items: input.items.map((i) => {
        const p = s.products.find((p) => p.id === i.id)!;
        return {
          ...i,
          unitPrice: itemPrice(p, i.variant),
          productName: p.name,
          image: p.image,
        };
      }),
      tax: totals.tax,
      couponCode: input.coupon?.code,
      subtotal: totals.subtotal,
      discount: totals.discount,
      offerSavings: totals.savings,
      shipping: totals.shipping,
      total: totals.total,
      status: "Placed",
      payment: input.payment,
      paymentStatus: "Unpaid",
      date: new Date().toISOString(),
      note: input.note,
      tracking: "",
      courier: "Unassigned",
      callStatus: "Pending",
      internalNote: "",
    };
    s.setOrders((x) => [order, ...x]);
    s.setProducts((x) =>
      x.map((p) =>
        counts[p.id]
          ? {
              ...p,
              stock: p.stock - counts[p.id],
              variants: p.variants?.map((v) => {
                const sold = input.items
                  .filter((i) => i.id === p.id && i.variant === v.label)
                  .reduce((n, i) => n + i.quantity, 0);
                return { ...v, stock: Math.max(0, v.stock - sold) };
              }),
            }
          : p,
      ),
    );
    if (input.coupon)
      s.setCoupons((x) =>
        x.map((c) =>
          c.id === input.coupon!.id ? { ...c, uses: c.uses + 1 } : c,
        ),
      );
    s.track("Purchase", `${order.id} · ${order.total} BDT · local preview`);
    if (s.settings.notifications)
      s.setNotifications((x) => [
        `Your order #${order.id} has been placed. We’ll confirm the details before dispatch.`,
        ...x,
      ]);
    s.toast("Your order preview has been placed. Thank you!");
    return order;
  };
}
