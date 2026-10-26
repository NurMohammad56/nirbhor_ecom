import { useUpdateOrder } from "./inventory-actions";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Heart,
  Leaf,
  LockKeyhole,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  UserRound,
  X,
  Mail,
  Bell,
  LogOut,
  RotateCcw,
  Star,
  Clock,
  Download,
  Printer,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { useStore, usePlaceOrder, cartTotals } from "./store";
import {
  itemPrice,
  money,
  productVariants,
  statusSteps,
  uid,
  variantUnits,
} from "./data";
import type { Address, CartItem, Coupon, Order } from "./data";
import {
  Badge,
  Breadcrumb,
  Button,
  Empty,
  Modal,
  ProductCard,
  Quantity,
  SectionTitle,
} from "./ui";
function couponError(c: Coupon | undefined, subtotal: number) {
  if (!c || !c.active) return "That code isn’t available. Try NIRBHOR10.";
  if (
    new Date(c.start) > new Date() ||
    new Date(c.end + "T23:59:59") < new Date()
  )
    return "This little offer is outside its valid dates.";
  if (c.uses >= c.limit) return "This offer has reached its usage limit.";
  if (subtotal < c.minimum)
    return `Add a little more — this code needs an order of ${money(c.minimum)}.`;
  return "";
}
function useCoupon(subtotal: number) {
  const { coupons } = useStore();
  const [code, setCode] = useState(
    () => sessionStorage.getItem("nirbhor-coupon") || "",
  );
  const c = coupons.find((c) => c.code === code);
  const coupon = code && !couponError(c, subtotal) ? c : undefined;
  return {
    code,
    coupon,
    setCode: (c: string) => {
      setCode(c);
      if (c) sessionStorage.setItem("nirbhor-coupon", c);
      else sessionStorage.removeItem("nirbhor-coupon");
    },
  };
}
function CouponField({
  subtotal,
  code,
  setCode,
}: {
  subtotal: number;
  code: string;
  setCode: (s: string) => void;
}) {
  const { coupons, toast } = useStore();
  const [input, setInput] = useState(code),
    [error, setError] = useState("");
  return (
    <div className="coupon-field">
      {code ? (
        <div className="coupon-applied">
          <Check size={15} />
          <span>
            {code}{" "}
            {couponError(
              coupons.find((c) => c.code === code),
              subtotal,
            )
              ? "· Not eligible yet"
              : "applied"}
          </span>
          <button
            aria-label="Remove coupon"
            onClick={() => {
              setCode("");
              setInput("");
            }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <div className="coupon-input">
            <input
              aria-label="Discount code"
              placeholder="A little code for a little extra"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
            />
            <button
              type="button"
              onClick={() => {
                const value = input.trim().toUpperCase();
                const c = coupons.find((c) => c.code === value);
                const error = couponError(c, subtotal);
                if (error) {
                  setError(error);
                  return;
                }
                setCode(value);
                setError("");
                toast("A little extra goodness — code applied.");
              }}
            >
              Apply
            </button>
          </div>
          {error && (
            <span className="field-error" role="alert">
              {error}
            </span>
          )}
        </>
      )}
    </div>
  );
}
function OrderSummary({
  items,
  zone = "Dhaka",
  coupon,
  children,
  order,
}: {
  items: CartItem[];
  zone?: string;
  coupon?: Coupon;
  children?: ReactNode;
  order?: Order;
}) {
  const { products, settings } = useStore();
  const t = order
    ? {
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        tax: order.tax || 0,
        total: order.total,
      }
    : cartTotals(items, products, settings, zone, coupon);
  return (
    <div className="order-summary">
      <h3>A little look at your order.</h3>
      <div className="summary-products">
        {items.map((item, i) => {
          const p = products.find((p) => p.id === item.id);
          return (
            p && (
              <div key={i}>
                <div className="summary-product-img">
                  <img src={p.image} alt={p.name} />
                  <span>{item.quantity}</span>
                </div>
                <div>
                  <b>{p.name}</b>
                  <small>{item.variant}</small>
                </div>
                <strong>
                  {money(
                    (item.unitPrice ?? itemPrice(p, item.variant)) *
                      item.quantity,
                  )}
                </strong>
              </div>
            )
          );
        })}
      </div>
      {children}
      <div className="summary-breakdown">
        <div className="summary-line">
          <span>Subtotal</span>
          <b>{money(t.subtotal)}</b>
        </div>
        {t.discount > 0 && (
          <div className="summary-line green">
            <span>A little saving</span>
            <b>− {money(t.discount)}</b>
          </div>
        )}
        <div className="summary-line">
          <span>Delivery</span>
          <b>
            {t.shipping ? (
              money(t.shipping)
            ) : (
              <span className="green">On us</span>
            )}
          </b>
        </div>
        {t.tax > 0 && (
          <div className="summary-line">
            <span>Tax ({settings.tax}%)</span>
            <b>{money(t.tax)}</b>
          </div>
        )}
        <div className="summary-total">
          <span>
            Total <small>BDT</small>
          </span>
          <b data-testid="order-total">{money(t.total)}</b>
        </div>
      </div>
      <span className="secure-note">
        <ShieldCheck size={15} /> Thoughtfully packed. Securely checked out.
      </span>
    </div>
  );
}
export function Cart() {
  const s = useStore(),
    { cart, setCart, products, settings } = s;
  const [zone, setZone] = useState("Dhaka");
  const subtotal = cartTotals(cart, products, settings, zone).subtotal;
  const { code, coupon, setCode } = useCoupon(subtotal);
  const t = cartTotals(cart, products, settings, zone, coupon);
  return (
    <main className="container page-space cart-page">
      <Breadcrumb items={[{ label: "Your bag" }]} />
      <SectionTitle
        eyebrow="A FEW GOOD CHOICES"
        title="Your little bag of goodness."
        link="/shop"
        label="Keep exploring"
      />
      {cart.length ? (
        <div className="cart-layout">
          <div>
            <div className="shipping-progress cart-shipping">
              <Truck size={20} />
              <span>
                {subtotal >= settings.freeShipping ? (
                  "A little extra: your delivery is on us."
                ) : (
                  <>
                    You’re <b>{money(settings.freeShipping - subtotal)}</b> away
                    from free delivery.
                  </>
                )}
              </span>
              <progress
                max={settings.freeShipping}
                value={Math.min(subtotal, settings.freeShipping)}
              />
            </div>
            <div className="cart-table-header">
              <span>Your good finds</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            {cart.map((item, i) => {
              const p = products.find((p) => p.id === item.id);
              return (
                p && (
                  <article className="cart-row" key={p.id + item.variant}>
                    <Link className="cart-image" to={`/product/${p.id}`}>
                      <img src={p.image} alt={p.name} />
                    </Link>
                    <div className="cart-item-details">
                      <Link to={`/product/${p.id}`}>
                        <h3>{p.name}</h3>
                      </Link>
                      <select
                        aria-label={`Variant for ${p.name}`}
                        value={item.variant}
                        onChange={(e) =>
                          setCart((x) =>
                            x.map((y, j) =>
                              j === i
                                ? { ...y, variant: e.target.value, quantity: 1 }
                                : y,
                            ),
                          )
                        }
                      >
                        {productVariants(p).map((v) => (
                          <option
                            key={v.label}
                            value={v.label}
                            disabled={!v.stock}
                          >
                            {v.label} · {money(v.price)}
                          </option>
                        ))}
                      </select>
                      <span>{money(itemPrice(p, item.variant))}</span>
                      <div className="cart-item-actions">
                        <button
                          onClick={() => {
                            if (!s.wishlist.includes(p.id)) s.toggleWish(p.id);
                            setCart((x) => x.filter((_, j) => j !== i));
                            s.toast("Saved for a little later");
                          }}
                        >
                          Save for later
                        </button>
                        <button
                          onClick={() =>
                            setCart((x) => x.filter((_, j) => j !== i))
                          }
                        >
                          Remove
                        </button>
                      </div>
                      {item.quantity * variantUnits(item.variant) > p.stock && (
                        <span className="field-error">
                          Only {p.stock} units are currently available.
                        </span>
                      )}
                    </div>
                    <Quantity
                      value={item.quantity}
                      max={Math.min(
                        productVariants(p).find((v) => v.label === item.variant)
                          ?.stock || p.stock,
                        Math.floor(p.stock / variantUnits(item.variant)),
                      )}
                      onChange={(n) =>
                        setCart((x) =>
                          x.map((y, j) =>
                            j === i ? { ...y, quantity: n } : y,
                          ),
                        )
                      }
                    />
                    <strong>
                      {money(
                        (item.unitPrice ?? itemPrice(p, item.variant)) *
                          item.quantity,
                      )}
                    </strong>
                  </article>
                )
              );
            })}
            <Link to="/shop" className="text-link cart-continue">
              <ArrowLeft size={16} /> A little more exploring
            </Link>
            <div className="cart-delivery">
              <h3>Where is the goodness going?</h3>
              <label className="field">
                Estimate your delivery
                <select value={zone} onChange={(e) => setZone(e.target.value)}>
                  <option>Dhaka</option>
                  <option>Outside Dhaka</option>
                </select>
              </label>
              <p className="small muted">
                {zone === "Dhaka" ? "1–2" : "3–5"} working days ·{" "}
                {t.shipping ? money(t.shipping) : "Free delivery"}
              </p>
            </div>
          </div>
          <div className="cart-sidebar">
            <OrderSummary items={cart} zone={zone} coupon={coupon}>
              <CouponField subtotal={subtotal} code={code} setCode={setCode} />
            </OrderSummary>
            <Button className="full" to="/checkout">
              Continue to checkout <ArrowRight size={17} />
            </Button>
            <span className="secure-note">
              <LockKeyhole size={14} /> Cash on delivery available
            </span>
          </div>
        </div>
      ) : (
        <Empty
          title="A little empty, for now."
          text="There’s something good waiting for your pantry, home, or everyday."
          action={
            <Button to="/shop">
              Explore the shop <ArrowRight size={17} />
            </Button>
          }
        />
      )}
      <section className="section">
        <SectionTitle
          eyebrow="A LITTLE SOMETHING ELSE?"
          title="Good company for your good finds."
        />
        <div className="product-grid four">
          {products
            .filter(
              (p) =>
                p.stock > 0 &&
                p.status === "Published" &&
                !cart.some((c) => c.id === p.id),
            )
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </main>
  );
}
export function Checkout() {
  const s = useStore(),
    { cart, products, settings, profile, addresses } = s,
    placeOrder = usePlaceOrder(),
    navigate = useNavigate();
  const [zone, setZone] = useState("Dhaka"),
    [payment, setPayment] = useState("Cash on delivery"),
    [saved, setSaved] = useState(""),
    [error, setError] = useState(""),
    [submitting, setSubmitting] = useState(false);
  const subtotal = cartTotals(cart, products, settings).subtotal;
  const { code, coupon, setCode } = useCoupon(subtotal);
  const t = cartTotals(cart, products, settings, zone, coupon);
  useEffect(() => {
    s.track("InitiateCheckout", String(subtotal));
  }, []);
  const selectedAddress = addresses.find((a) => a.id === saved);
  if (!cart.length)
    return (
      <main className="container page-space">
        <Empty
          title="Your checkout is waiting for a little goodness."
          text="Add something to your bag to begin."
          action={
            <Button to="/shop">
              Explore the shop <ArrowRight size={16} />
            </Button>
          }
        />
      </main>
    );
  return (
    <main className="container page-space checkout-page">
      <div className="checkout-top">
        <Link to="/cart" className="text-link">
          <ArrowLeft size={15} /> Back to your bag
        </Link>
        <span>
          <LockKeyhole size={14} /> SECURE CHECKOUT
        </span>
      </div>
      <div className="checkout-layout">
        <div>
          <span className="eyebrow">ALMOST AT YOUR DOORSTEP</span>
          <h1>
            A few details.
            <br />A little goodness on its way.
          </h1>
          <div className="checkout-steps">
            <span className="active">
              <b>1</b>Your details
            </span>
            <ChevronRight size={14} />
            <span>
              <b>2</b>Order confirmation
            </span>
          </div>
          {!profile.loggedIn && (
            <div className="checkout-login">
              <UserRound size={19} />
              <span>
                Already part of the family?{" "}
                <Link to="/login?next=/checkout">Sign in</Link> for saved
                details.
              </span>
            </div>
          )}
          <form
            id="checkout-form"
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              if (!settings.cod && payment === "Cash on delivery") {
                setError(
                  "Cash on delivery is currently unavailable. Please choose another method.",
                );
                return;
              }
              const f = new FormData(e.currentTarget);
              const phone = String(f.get("phone")).replace(/\s/g, "");
              if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(phone)) {
                setError("Please enter a valid Bangladesh mobile number.");
                return;
              }
              setSubmitting(true);
              const order = placeOrder({
                customer: String(f.get("name")),
                phone,
                email: String(f.get("email")),
                address: String(f.get("address")),
                zone,
                payment,
                note: String(f.get("note") || ""),
                items: cart,
                coupon,
              });
              if (order) {
                if (f.get("save-address"))
                  s.setAddresses((x) => [
                    ...x,
                    {
                      id: uid("a"),
                      label: "Home",
                      name: order.customer,
                      phone: order.phone,
                      address: order.address,
                      zone,
                      default: !x.length,
                    },
                  ]);
                s.setCart([]);
                sessionStorage.removeItem("nirbhor-coupon");
                navigate(`/order-success/${order.id}`);
              } else setSubmitting(false);
            }}
          >
            <section className="checkout-block">
              <h3>
                <span>01</span> How can we reach you?
              </h3>
              <div className="form-grid">
                <label className="field">
                  Full name
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    placeholder="Your full name"
                    defaultValue={profile.name}
                  />
                </label>
                <label className="field">
                  Mobile number
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    pattern="(?:\+?88)?01[3-9][0-9]{8}"
                    title="Enter a valid Bangladesh mobile number"
                    placeholder="01XXXXXXXXX"
                    defaultValue={profile.phone}
                  />
                </label>
              </div>
              <label className="field">
                Email address <span className="muted">(optional)</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="For a little order update"
                  defaultValue={profile.email}
                />
              </label>
            </section>
            <section className="checkout-block">
              <h3>
                <span>02</span> Where should we bring the goodness?
              </h3>
              {profile.loggedIn && addresses.length > 0 && (
                <label className="field">
                  Use a saved address
                  <select
                    value={saved}
                    onChange={(e) => {
                      setSaved(e.target.value);
                      const a = addresses.find((a) => a.id === e.target.value);
                      if (a) setZone(a.zone);
                    }}
                  >
                    <option value="">Enter a new address</option>
                    {addresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label} — {a.address}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="field">
                Full delivery address
                <textarea
                  key={saved}
                  name="address"
                  autoComplete="street-address"
                  required
                  minLength={10}
                  rows={3}
                  defaultValue={selectedAddress?.address}
                  placeholder="House / flat, road, area, district and postal code"
                />
              </label>
              <label className="field">
                Delivery zone
                <select value={zone} onChange={(e) => setZone(e.target.value)}>
                  <option>Dhaka</option>
                  <option>Outside Dhaka</option>
                </select>
              </label>
              <div className="delivery-option">
                <Truck size={21} />
                <span>
                  <b>Standard delivery</b>
                  <small>
                    {zone === "Dhaka" ? "1–2" : "3–5"} working days · Carefully
                    packed
                  </small>
                </span>
                <b>{t.shipping ? money(t.shipping) : "Free"}</b>
              </div>
              {profile.loggedIn && !saved && (
                <label className="check-label">
                  <input name="save-address" type="checkbox" />
                  Save this address for next time
                </label>
              )}
            </section>
            <section className="checkout-block">
              <h3>
                <span>03</span> A simple way to pay.
              </h3>
              <label
                className={`payment-option ${payment === "Cash on delivery" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "Cash on delivery"}
                  onChange={() => setPayment("Cash on delivery")}
                  disabled={!settings.cod}
                />
                <span>
                  <b>Cash on delivery</b>
                  <small>Pay when your little goodness arrives.</small>
                </span>
                <ShoppingBag size={22} />
              </label>
              <label
                className={`payment-option ${payment === "Online payment" ? "selected" : ""} ${!settings.online ? "disabled" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "Online payment"}
                  onChange={() => setPayment("Online payment")}
                  disabled={!settings.online}
                />
                <span>
                  <b>Card / mobile banking</b>
                  <small>
                    {settings.online
                      ? "Payment preview — saved as unpaid, no charge is made."
                      : "Available when the payment gateway is connected."}
                  </small>
                </span>
                <CreditCard size={22} />
              </label>
            </section>
            <label className="field">
              A note for us <span className="muted">(optional)</span>
              <textarea
                name="note"
                rows={2}
                placeholder="Anything that would make your delivery a little easier?"
              />
            </label>
            <label className="check-label terms-label">
              <input type="checkbox" required />
              <span>
                I agree to the <Link to="/page/terms">terms & conditions</Link>{" "}
                and <Link to="/page/privacy">privacy policy</Link>.
              </span>
            </label>
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="full" disabled={submitting}>
              {submitting
                ? "Placing your order…"
                : `Place order · ${money(t.total)}`}
              <ArrowRight size={17} />
            </Button>
            <p className="preview-note">
              <Leaf size={14} /> Frontend preview: your order stays in this
              browser. No charge or real delivery is made.
            </p>
          </form>
        </div>
        <aside className="checkout-sidebar">
          <OrderSummary items={cart} zone={zone} coupon={coupon}>
            <CouponField subtotal={subtotal} code={code} setCode={setCode} />
          </OrderSummary>
          <div className="checkout-promise">
            <Leaf size={21} />
            <div>
              <b>A little care, all the way.</b>
              <p>
                Honest products. Thoughtful packing.
                <br />
                Real people, here to help.
              </p>
            </div>
          </div>
          <Link to="/contact" className="text-link">
            Need a little help? <ArrowUpRight size={14} />
          </Link>
        </aside>
      </div>
    </main>
  );
}
export function OrderSuccess() {
  const { id } = useParams(),
    { orders } = useStore();
  const order = orders.find((o) => o.id === id);
  if (!order)
    return (
      <main className="container page-space">
        <Empty
          title="We couldn’t find that order."
          text="Please check your order number."
          action={<Button to="/track">Track an order</Button>}
        />
      </main>
    );
  return (
    <main className="container success-page">
      <span className="success-icon">
        <Check size={33} strokeWidth={1.5} />
      </span>
      <span className="eyebrow">A LITTLE GOODNESS IS ON ITS WAY</span>
      <h1>Good choice, {order.customer.split(" ")[0]}.</h1>
      <p>
        Your order <b>#{order.id}</b> has been received in this frontend
        preview.
        <br />
        You can explore its details and delivery timeline below.
      </p>
      <div className="success-details">
        <div>
          <span>ORDER NUMBER</span>
          <b>#{order.id}</b>
        </div>
        <div>
          <span>ORDER TOTAL</span>
          <b>{money(order.total)}</b>
        </div>
        <div>
          <span>PAYMENT METHOD</span>
          <b>{order.payment}</b>
        </div>
        <div>
          <span>ESTIMATED DELIVERY</span>
          <b>{order.zone === "Dhaka" ? "1–2" : "3–5"} working days</b>
        </div>
      </div>
      <div className="success-actions">
        <Button
          to={`/track?order=${order.id}&phone=${encodeURIComponent(order.phone)}`}
        >
          Follow your little delivery <Truck size={17} />
        </Button>
        <Button variant="outline" to="/shop">
          A little more exploring <ArrowRight size={17} />
        </Button>
      </div>
      <div className="success-order">
        <OrderSummary items={order.items} zone={order.zone} order={order} />
      </div>
      <p className="small muted">
        Your order is saved locally. Confirmation calls and delivery
        notifications will be connected with the backend.
      </p>
    </main>
  );
}
export function OrderTimeline({ order }: { order: Order }) {
  const current = statusSteps.indexOf(order.status);
  return (
    <div className="order-timeline">
      {["Cancelled", "Returned", "Return requested", "Refunded"].includes(
        order.status,
      ) ? (
        <div className="timeline-special">
          <Badge tone="warm">{order.status}</Badge>
          <p>
            {order.status === "Return requested"
              ? "We have received your return request. Our team will review the details."
              : "This order has been closed. Contact us if you need a little help."}
          </p>
        </div>
      ) : (
        statusSteps.map((step, i) => (
          <div
            key={step}
            className={`${i <= current ? "done" : ""} ${i === current ? "current" : ""}`}
          >
            <span>
              {i < current ? (
                <Check size={14} />
              ) : i === current ? (
                <span className="timeline-dot" />
              ) : (
                i + 1
              )}
            </span>
            <div>
              <b>{step === "Placed" ? "Order placed" : step}</b>
              <small>
                {i === 0
                  ? new Date(order.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : i === current
                    ? "Your order is here right now"
                    : i < current
                      ? "Completed"
                      : "Up next"}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
export function TrackOrder() {
  const location = useLocation(),
    p = new URLSearchParams(location.search),
    { orders, settings } = useStore();
  const [orderId, setOrderId] = useState(p.get("order") || ""),
    [phone, setPhone] = useState(p.get("phone") || ""),
    [found, setFound] = useState<Order | undefined>(() =>
      orders.find((o) => o.id === p.get("order") && o.phone === p.get("phone")),
    ),
    [error, setError] = useState("");
  const order = found ? orders.find((o) => o.id === found.id) : undefined;
  return (
    <main className="container page-space tracking-page">
      <Breadcrumb items={[{ label: "Track your order" }]} />
      <div className="tracking-intro">
        <span className="eyebrow">FROM OUR HANDS TO YOUR HOME</span>
        <h1>Follow your little delivery.</h1>
        <p>A little update on the goodness you’re waiting for.</p>
      </div>
      <form
        className="tracking-form"
        onSubmit={(e) => {
          e.preventDefault();
          const result = orders.find(
            (o) =>
              o.id.toLowerCase() ===
                orderId.trim().replace("#", "").toLowerCase() &&
              o.phone.replace(/\D/g, "").slice(-11) ===
                phone.replace(/\D/g, "").slice(-11),
          );
          setFound(result);
          setError(
            result
              ? ""
              : "We couldn’t find that combination. Please check the order number and delivery phone.",
          );
        }}
      >
        <label className="field">
          Order number
          <input
            placeholder="e.g. NBR-4821"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </label>
        <label className="field">
          Delivery mobile number
          <input
            placeholder="01XXXXXXXXX"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <Button type="submit">
          Find my order <ArrowRight size={16} />
        </Button>
      </form>
      {error && (
        <p className="field-error center" role="alert">
          {error}
        </p>
      )}
      <button
        className="demo-track text-button"
        onClick={() => {
          setOrderId("NBR-4819");
          setPhone(orders.find((o) => o.id === "NBR-4819")?.phone || "");
          setFound(orders.find((o) => o.id === "NBR-4819"));
          setError("");
        }}
      >
        Explore a sample delivery
      </button>
      {order && (
        <div className="tracking-result">
          <div className="tracking-result-head">
            <div>
              <span className="eyebrow">YOUR LITTLE GOODNESS</span>
              <h2>Order #{order.id}</h2>
            </div>
            <Badge>{order.status}</Badge>
          </div>
          <div className="tracking-result-grid">
            <div>
              <OrderTimeline order={order} />
            </div>
            <div className="tracking-info">
              <h3>Delivered with a little care.</h3>
              <p>
                {order.customer}
                <br />
                {order.address}
              </p>
              <dl>
                <div>
                  <dt>Courier</dt>
                  <dd>{order.courier}</dd>
                </div>
                <div>
                  <dt>Tracking ID</dt>
                  <dd>{order.tracking || "Assigned after dispatch"}</dd>
                </div>
                <div>
                  <dt>Estimated delivery</dt>
                  <dd>{order.zone === "Dhaka" ? "1–2" : "3–5"} working days</dd>
                </div>
                <div>
                  <dt>Payment</dt>
                  <dd>{order.payment}</dd>
                </div>
                <div>
                  <dt>Order total</dt>
                  <dd>{money(order.total)}</dd>
                </div>
              </dl>
              <Link className="text-link" to="/contact">
                Need a little help? <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
export function Auth() {
  const location = useLocation(),
    navigate = useNavigate(),
    s = useStore();
  const mode =
    location.pathname === "/register"
      ? "register"
      : location.pathname === "/forgot-password"
        ? "forgot"
        : "login";
  const [show, setShow] = useState(false),
    [sent, setSent] = useState(false),
    [otp, setOtp] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    setSent(false);
    setError("");
    setOtp(false);
  }, [mode]);
  const next = new URLSearchParams(location.search).get("next") || "/account";
  const enter = (
    name = "Samia Rahman",
    email = "samia@example.com",
    phone = "01712345678",
  ) => {
    s.setProfile({ name, email, phone, loggedIn: true });
    s.toast("Welcome to your little corner of goodness.");
    navigate(
      next.startsWith("/") && !next.startsWith("//") ? next : "/account",
    );
  };
  return (
    <main className="auth-layout">
      <div className="auth-image">
        <img src="/assets/hero.webp" alt="Nirbhor raw honey, nuts and dates" />
        <div>
          <Leaf size={28} />
          <h2>
            A little goodness.
            <br />A place to call yours.
          </h2>
          <p>
            Your favourites, thoughtful updates, and all your good choices in
            one place.
          </p>
        </div>
      </div>
      <div className="auth-form-container">
        <Link to="/" className="text-link">
          <ArrowLeft size={15} /> Back to the good stuff
        </Link>
        <span className="eyebrow">YOUR LITTLE CORNER OF NIRBHOR</span>
        <h1>
          {mode === "register"
            ? "Good to have you here."
            : mode === "forgot"
              ? "A little fresh start."
              : "Welcome back."}
        </h1>
        <p>
          {mode === "register"
            ? "Make room for a little more goodness."
            : mode === "forgot"
              ? "Enter your email to preview the password reset flow."
              : "Your everyday good is right where you left it."}
        </p>
        {sent ? (
          <div className="auth-sent">
            <Mail size={35} />
            <h2>
              {mode === "forgot"
                ? "A fresh start, in your inbox."
                : "A little code, just for you."}
            </h2>
            <p>
              {mode === "forgot"
                ? "Reset requests will be sent when email delivery is connected. This frontend preview does not change a real password."
                : "For this preview, use the code 961204. SMS delivery will be connected with the backend."}
            </p>
            {mode === "login" && (
              <form
                className="form-stack"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  if (f.get("code") !== "961204") {
                    setError("Please use the preview code 961204.");
                    return;
                  }
                  enter();
                }}
              >
                <label className="field">
                  6-digit code
                  <input
                    name="code"
                    required
                    pattern="[0-9]{6}"
                    inputMode="numeric"
                    placeholder="961204"
                  />
                </label>
                {error && <p className="field-error">{error}</p>}
                <Button type="submit">
                  Continue <ArrowRight size={16} />
                </Button>
              </form>
            )}
            <Button variant="outline" to="/login">
              Back to sign in
            </Button>
          </div>
        ) : (
          <>
            <form
              className="form-stack"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                if (mode === "forgot" || otp) {
                  setSent(true);
                  return;
                }
                enter(
                  String(f.get("name") || s.profile.name || "Samia Rahman"),
                  String(f.get("email")),
                  String(f.get("phone") || s.profile.phone || "01712345678"),
                );
              }}
            >
              {mode === "register" && (
                <label className="field">
                  Full name
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                  />
                </label>
              )}
              {!otp && (
                <label className="field">
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                  />
                </label>
              )}
              {(mode === "register" || otp) && (
                <label className="field">
                  Mobile number
                  <input
                    name="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    pattern="(?:\+?88)?01[3-9][0-9]{8}"
                    required
                  />
                </label>
              )}
              {mode !== "forgot" && !otp && (
                <label className="field">
                  Password
                  <div className="password-field">
                    <input
                      type={show ? "text" : "password"}
                      name="password"
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      autoComplete={
                        mode === "register"
                          ? "new-password"
                          : "current-password"
                      }
                    />
                    <button
                      type="button"
                      aria-label={show ? "Hide password" : "Show password"}
                      onClick={() => setShow(!show)}
                    >
                      {show ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </label>
              )}
              {mode === "login" && !otp && (
                <Link className="forgot-link" to="/forgot-password">
                  Forgot your password?
                </Link>
              )}
              {mode === "register" && (
                <label className="check-label">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <Link to="/page/terms">terms</Link> and{" "}
                    <Link to="/page/privacy">privacy policy</Link>.
                  </span>
                </label>
              )}
              <Button className="full" type="submit">
                {mode === "register"
                  ? "Create your account"
                  : mode === "forgot"
                    ? "Send reset link"
                    : otp
                      ? "Send a little code"
                      : "Sign in"}
                <ArrowRight size={16} />
              </Button>
            </form>
            {mode === "login" && (
              <>
                <div className="auth-divider">
                  <span>or keep it simple</span>
                </div>
                <Button
                  variant="outline"
                  className="full"
                  onClick={() => setOtp(!otp)}
                >
                  {otp ? "Sign in with email" : "Continue with mobile OTP"}{" "}
                  <UserRound size={16} />
                </Button>
                <button className="demo-button" onClick={() => enter()}>
                  Explore a demo customer account <ArrowUpRight size={14} />
                </button>
              </>
            )}
            <div className="auth-switch">
              {mode === "register"
                ? "Already part of the family?"
                : "New to our little community?"}{" "}
              <Link to={mode === "register" ? "/login" : "/register"}>
                {mode === "register" ? "Sign in" : "Join us"}{" "}
                <ArrowUpRight size={13} />
              </Link>
            </div>
            <p className="preview-note">
              <LockKeyhole size={14} /> Frontend preview. Sign-in is simulated
              on this browser; no passwords are stored.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
export function AddressForm({
  address,
  onClose,
}: {
  address?: Address;
  onClose: () => void;
}) {
  const { setAddresses, toast } = useStore();
  return (
    <Modal
      title={address ? "Edit your address" : "A new little delivery spot"}
      onClose={onClose}
    >
      <form
        className="form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const a: Address = {
            id: address?.id || uid("a"),
            label: String(f.get("label")),
            name: String(f.get("name")),
            phone: String(f.get("phone")),
            address: String(f.get("address")),
            zone: String(f.get("zone")),
            default: !!f.get("default"),
          };
          setAddresses((x) => {
            const list = a.default
              ? x.map((v) => ({ ...v, default: false }))
              : x;
            return address
              ? list.map((v) => (v.id === a.id ? a : v))
              : [...list, a];
          });
          toast("Your address is saved for next time.");
          onClose();
        }}
      >
        <label className="field">
          Address label
          <input
            name="label"
            defaultValue={address?.label || "Home"}
            required
          />
        </label>
        <label className="field">
          Recipient name
          <input name="name" defaultValue={address?.name} required />
        </label>
        <label className="field">
          Mobile number
          <input
            name="phone"
            type="tel"
            pattern="(?:\+?88)?01[3-9][0-9]{8}"
            defaultValue={address?.phone}
            required
          />
        </label>
        <label className="field">
          Full address
          <textarea
            aria-label="Full address"
            name="address"
            rows={3}
            minLength={10}
            defaultValue={address?.address}
            required
          />
        </label>
        <label className="field">
          Delivery zone
          <select name="zone" defaultValue={address?.zone || "Dhaka"}>
            <option>Dhaka</option>
            <option>Outside Dhaka</option>
          </select>
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            name="default"
            defaultChecked={address?.default}
          />
          Make this my default address
        </label>
        <Button type="submit">
          Save this little spot <Check size={16} />
        </Button>
      </form>
    </Modal>
  );
}
const accountNav = [
  ["Overview", "/account", UserRound],
  ["My orders", "/account/orders", Package],
  ["Address book", "/account/addresses", MapPin],
  ["Wishlist", "/account/wishlist", Heart],
  ["Recently viewed", "/account/recent", Clock],
  ["My reviews", "/account/reviews", Star],
  ["Notifications", "/account/notifications", Bell],
  ["Account settings", "/account/settings", SettingsIcon],
] as const;
export function Account() {
  const s = useStore(),
    {
      profile,
      orders,
      products,
      addresses,
      wishlist,
      recent,
      reviews,
      notifications,
    } = s,
    location = useLocation(),
    navigate = useNavigate();
  const [editAddress, setEditAddress] = useState<Address | "new" | undefined>(),
    [deleting, setDeleting] = useState("");
  const section = location.pathname.split("/")[2] || "overview";
  const myOrders = orders.filter(
    (o) =>
      o.email.toLowerCase() === profile.email.toLowerCase() ||
      o.phone === profile.phone,
  );
  if (!profile.loggedIn)
    return (
      <main className="container page-space">
        <Empty
          icon={UserRound}
          title="Your own little corner of goodness."
          text="Sign in to see your orders, saved addresses and everyday favourites."
          action={
            <Button to="/login">
              Make yourself at home <ArrowRight size={16} />
            </Button>
          }
        />
      </main>
    );
  const title =
    accountNav.find((x) => x[1] === location.pathname)?.[0] || "Your account";
  return (
    <main className="container page-space account-page">
      <Breadcrumb
        items={[{ label: "Your account", to: "/account" }, { label: title }]}
      />
      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-user">
            <span>
              {profile.name
                .split(" ")
                .map((x) => x[0])
                .join("")
                .slice(0, 2)}
            </span>
            <h3>{profile.name}</h3>
            <small>{profile.email}</small>
            <Badge>A part of the good stuff</Badge>
          </div>
          <nav>
            {accountNav.map(([label, url, Icon]) => (
              <NavLink key={url} to={url} end={url === "/account"}>
                <Icon size={17} />
                {label}
                {label === "Notifications" && notifications.length > 0 && (
                  <small>{notifications.length}</small>
                )}
              </NavLink>
            ))}
            <button
              onClick={() => {
                s.setProfile((x) => ({ ...x, loggedIn: false }));
                s.toast("Until next time. Take a little goodness with you.");
                navigate("/");
              }}
            >
              <LogOut size={17} />
              Sign out
            </button>
          </nav>
        </aside>
        <div className="account-content">
          {section === "overview" ? (
            <>
              <span className="eyebrow">YOUR EVERYDAY GOOD, ALL TOGETHER</span>
              <h1>Hello, {profile.name.split(" ")[0]}.</h1>
              <p className="muted">
                A little look at your latest good choices.
              </p>
              <div className="account-stats">
                {[
                  [String(myOrders.length), "Good orders", Package],
                  [String(wishlist.length), "Saved favourites", Heart],
                  [String(addresses.length), "Delivery spots", MapPin],
                ].map(([n, t, I]) => {
                  const Icon = I as typeof Package;
                  return (
                    <div key={String(t)}>
                      <Icon size={20} />
                      <b>{String(n)}</b>
                      <span>{String(t)}</span>
                    </div>
                  );
                })}
              </div>
              <SectionTitle
                title="Your latest goodness."
                link="/account/orders"
                label="All orders"
              />
              <OrderList orders={myOrders.slice(0, 3)} />
              <div className="account-welcome">
                <Leaf size={25} />
                <div>
                  <h3>A little something for your next visit.</h3>
                  <p>
                    Use NIRBHOR10 for 10% off your next good find over ৳500.
                  </p>
                </div>
                <Link to="/shop" className="text-link">
                  Find your good <ArrowUpRight size={15} />
                </Link>
              </div>
            </>
          ) : section === "orders" ? (
            <>
              <SectionTitle eyebrow="YOUR GOOD CHOICES" title="My orders." />
              <OrderList orders={myOrders} />
            </>
          ) : section === "addresses" ? (
            <>
              <SectionTitle
                eyebrow="FROM OUR HANDS TO YOUR HOME"
                title="Your little delivery spots."
              />
              <Button variant="outline" onClick={() => setEditAddress("new")}>
                <Plus size={16} />
                Add a new address
              </Button>
              <div className="address-grid">
                {addresses.map((a) => (
                  <article key={a.id}>
                    <div>
                      <h3>{a.label}</h3>
                      {a.default && <Badge>Default</Badge>}
                    </div>
                    <b>{a.name}</b>
                    <p>
                      {a.address}
                      <br />
                      {a.zone}
                      <br />
                      {a.phone}
                    </p>
                    <div className="address-actions">
                      <button onClick={() => setEditAddress(a)}>
                        Edit address
                      </button>
                      <button onClick={() => setDeleting(a.id)}>Remove</button>
                      {!a.default && (
                        <button
                          onClick={() => {
                            s.setAddresses((x) =>
                              x.map((y) => ({ ...y, default: y.id === a.id })),
                            );
                            s.toast("Default address updated.");
                          }}
                        >
                          Make default
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              {!addresses.length && (
                <Empty
                  icon={MapPin}
                  title="Where should the goodness go?"
                  text="Add a delivery address for a little easier checkout next time."
                />
              )}
            </>
          ) : section === "wishlist" || section === "recent" ? (
            <>
              <SectionTitle
                eyebrow={
                  section === "wishlist"
                    ? "A LITTLE SOMETHING FOR LATER"
                    : "GOOD TO SEE YOU AGAIN"
                }
                title={
                  section === "wishlist"
                    ? "Saved little favourites."
                    : "A second look at something good."
                }
                link="/shop"
                label="Keep exploring"
              />
              {(section === "wishlist" ? wishlist : recent).length ? (
                <div className="product-grid three">
                  {(section === "wishlist" ? wishlist : recent)
                    .map((id) => products.find((p) => p.id === id))
                    .filter((p): p is NonNullable<typeof p> => !!p)
                    .map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                </div>
              ) : (
                <Empty
                  icon={Heart}
                  title="A few good finds will make themselves at home."
                  text="Explore the shop and save your favourites."
                  action={<Button to="/shop">Explore the shop</Button>}
                />
              )}
            </>
          ) : section === "reviews" ? (
            <>
              <SectionTitle
                eyebrow="YOUR WORDS MAKE A DIFFERENCE"
                title="A little feedback, from you."
              />
              {reviews
                .filter((r) => r.name === profile.name)
                .map((r) => (
                  <article className="account-review" key={r.id}>
                    <div>
                      <b>{products.find((p) => p.id === r.productId)?.name}</b>
                      <Badge>{r.status}</Badge>
                    </div>
                    <span className="stars">{"★".repeat(r.rating)}</span>
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                    {r.media && (
                      <a
                        href={r.media}
                        target="_blank"
                        rel="noreferrer"
                        className="text-link"
                      >
                        View your uploaded media <ArrowUpRight size={13} />
                      </a>
                    )}
                  </article>
                ))}
              {!reviews.some((r) => r.name === profile.name) && (
                <Empty
                  icon={Star}
                  title="Your story belongs here."
                  text="Review a product you’ve tried and help someone find their good."
                  action={<Button to="/account/orders">See your orders</Button>}
                />
              )}
            </>
          ) : section === "notifications" ? (
            <>
              <SectionTitle
                eyebrow="A LITTLE UPDATE FOR YOU"
                title="Your good-news corner."
              />
              {notifications.map((n, i) => (
                <div className="notification-row" key={i}>
                  <Bell size={19} />
                  <div>
                    <b>
                      {n.includes("order")
                        ? "Your order, with a little update"
                        : "A little note from NIRBHOR"}
                    </b>
                    <p>{n}</p>
                  </div>
                  <button
                    className="icon-btn"
                    aria-label="Dismiss account notification"
                    onClick={() =>
                      s.setNotifications((x) => x.filter((_, j) => j !== i))
                    }
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
              {!notifications.length && (
                <Empty
                  icon={Bell}
                  title="All caught up."
                  text="Your next little update will appear here."
                />
              )}
            </>
          ) : (
            <>
              <SectionTitle
                eyebrow="MAKE YOURSELF AT HOME"
                title="Your account, your way."
              />
              <form
                className="form-stack account-settings-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  s.setProfile((x) => ({
                    ...x,
                    name: String(f.get("name")),
                    email: String(f.get("email")),
                    phone: String(f.get("phone")),
                  }));
                  s.toast("Your details are a little more up to date.");
                }}
              >
                <div className="form-grid">
                  <label className="field">
                    Full name
                    <input name="name" defaultValue={profile.name} required />
                  </label>
                  <label className="field">
                    Email address
                    <input
                      type="email"
                      name="email"
                      defaultValue={profile.email}
                      required
                    />
                  </label>
                </div>
                <label className="field">
                  Mobile number
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={profile.phone}
                    pattern="(?:\+?88)?01[3-9][0-9]{8}"
                    required
                  />
                </label>
                <h3>A little update, your way.</h3>
                <label className="check-label">
                  <input type="checkbox" defaultChecked />
                  Order and delivery updates
                </label>
                <label className="check-label">
                  <input
                    type="checkbox"
                    defaultChecked={
                      localStorage.getItem("nirbhor-marketing") === "yes"
                    }
                    onChange={(e) =>
                      localStorage.setItem(
                        "nirbhor-marketing",
                        e.target.checked ? "yes" : "no",
                      )
                    }
                  />
                  New arrivals, offers, and occasional good news
                </label>
                <Button type="submit">
                  Save my details <Check size={16} />
                </Button>
              </form>
              <div className="account-security">
                <LockKeyhole size={21} />
                <div>
                  <h3>Payment & account security</h3>
                  <p>
                    Saved payment methods and password management will be
                    available with the secure backend. This preview does not
                    store card details or passwords.
                  </p>
                  <Link className="text-link" to="/forgot-password">
                    Preview password reset <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {editAddress && (
        <AddressForm
          address={editAddress === "new" ? undefined : editAddress}
          onClose={() => setEditAddress(undefined)}
        />
      )}{" "}
      {deleting && (
        <Modal
          title="Remove this delivery spot?"
          onClose={() => setDeleting("")}
        >
          <p className="muted">
            You can always add it again when your goodness needs a new
            destination.
          </p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setDeleting("")}>
              Keep address
            </Button>
            <Button
              onClick={() => {
                s.setAddresses((x) => x.filter((a) => a.id !== deleting));
                setDeleting("");
                s.toast("Address removed.");
              }}
            >
              Remove address
            </Button>
          </div>
        </Modal>
      )}
    </main>
  );
}
export function OrderList({ orders }: { orders: Order[] }) {
  return orders.length ? (
    <div className="customer-order-list">
      {orders.map((o) => (
        <Link to={`/account/order/${o.id}`} key={o.id}>
          <span className="order-list-icon">
            <Package size={22} />
          </span>
          <div>
            <b>#{o.id}</b>
            <span>
              {new Date(o.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              · {o.items.reduce((n, i) => n + i.quantity, 0)} good finds
            </span>
          </div>
          <Badge tone={o.status === "Cancelled" ? "warm" : ""}>
            {o.status}
          </Badge>
          <strong>{money(o.total)}</strong>
          <ArrowRight size={17} />
        </Link>
      ))}
    </div>
  ) : (
    <Empty
      icon={Package}
      title="Your first good choice is waiting."
      text="When you place an order, its story will appear here."
      action={
        <Button to="/shop">
          Discover something good <ArrowRight size={16} />
        </Button>
      }
    />
  );
}
export function OrderDetail() {
  const updateOrder = useUpdateOrder();
  const { id } = useParams(),
    s = useStore(),
    { orders, products, profile } = s;
  const [action, setAction] = useState("");
  const order = orders.find(
    (o) =>
      o.id === id && (o.email === profile.email || o.phone === profile.phone),
  );
  if (!profile.loggedIn || !order)
    return (
      <main className="container page-space">
        <Empty
          icon={Package}
          title="Let’s find your order."
          text="Sign in with the account used for this order."
          action={<Button to="/login">Sign in</Button>}
        />
      </main>
    );
  return (
    <main className="container page-space order-detail-page">
      <Breadcrumb
        items={[
          { label: "Your account", to: "/account" },
          { label: "Orders", to: "/account/orders" },
          { label: order.id },
        ]}
      />
      <div className="order-detail-heading">
        <div>
          <span className="eyebrow">YOUR GOOD CHOICES, UP CLOSE</span>
          <h1>Order #{order.id}</h1>
          <p className="muted">
            Placed{" "}
            {new Date(order.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Badge>{order.status}</Badge>
      </div>
      <div className="order-detail-grid">
        <div>
          <h3>A little update.</h3>
          <OrderTimeline order={order} />
        </div>
        <div>
          <OrderSummary items={order.items} zone={order.zone} order={order} />
          <div className="order-placed-total">
            <b>Recorded order total</b>
            <b>{money(order.total)}</b>
          </div>
          <div className="delivery-address">
            <h3>Your delivery spot</h3>
            <p>
              {order.customer}
              <br />
              {order.address}
              <br />
              {order.phone}
            </p>
            <Badge>
              {order.payment} · {order.paymentStatus}
            </Badge>
          </div>
        </div>
      </div>
      <div className="order-actions">
        <Button
          onClick={() => {
            order.items.forEach((i) =>
              s.addToCart(i.id, i.quantity, i.variant),
            );
            s.setDrawer(true);
          }}
        >
          <RotateCcw size={16} />
          Reorder your good finds
        </Button>
        <Button
          to={`/track?order=${order.id}&phone=${encodeURIComponent(order.phone)}`}
          variant="outline"
        >
          Track delivery <Truck size={16} />
        </Button>
        {["Placed", "Confirmed"].includes(order.status) && (
          <button
            className="text-button danger"
            onClick={() => setAction("cancel")}
          >
            Cancel order
          </button>
        )}
        {order.status === "Delivered" && (
          <button className="text-button" onClick={() => setAction("return")}>
            Request a return / refund
          </button>
        )}
        <button className="text-link" onClick={() => window.print()}>
          <Printer size={16} />
          Print order
        </button>
      </div>
      {order.status === "Delivered" && (
        <div className="order-review-prompt">
          <Star size={22} />
          <div>
            <h3>How was your little goodness?</h3>
            <p>Your experience helps the next person choose.</p>
          </div>
          <Link
            to={`/product/${order.items[0].id}#reviews`}
            className="text-link"
          >
            Write a review <ArrowUpRight size={14} />
          </Link>
        </div>
      )}
      {action && (
        <Modal
          title={
            action === "cancel"
              ? "Cancel this little delivery?"
              : "A little help with your order."
          }
          onClose={() => setAction("")}
        >
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const reason = String(
                new FormData(e.currentTarget).get("reason"),
              );
              updateOrder(order.id, {
                status: action === "cancel" ? "Cancelled" : "Return requested",
                internalNote: action + ": " + reason,
              });
              s.toast(
                action === "cancel"
                  ? "Your order has been cancelled."
                  : "Your return request has been saved for review.",
              );
              setAction("");
            }}
          >
            <p className="muted">
              {action === "cancel"
                ? "We’ll return these items to the shelf."
                : "Tell us a little about what happened so our team can help."}
            </p>
            <label className="field">
              Reason
              <textarea name="reason" rows={3} required minLength={5} />
            </label>
            <Button type="submit">
              {action === "cancel"
                ? "Confirm cancellation"
                : "Submit return request"}
              <ArrowRight size={16} />
            </Button>
          </form>
        </Modal>
      )}
    </main>
  );
}
