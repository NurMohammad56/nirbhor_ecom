import { bnNode, latinDigits, searchText } from "./bn";
import { ComboCartGroups } from "./OfferCards";
import { offerActive } from "./promotions";
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
function couponError(c: Coupon | undefined, subtotal: number, eligible = true) {
  if (!c || !c.active) return "That code isn’t available. Try NIRBHOR10.";
  if (
    !offerActive(c)
  )
    return "This little offer is outside its valid dates.";
  if (c.uses >= c.limit) return "This offer has reached its usage limit.";
  if (subtotal < c.minimum)
    return `Add a little more - this code needs an order of ${money(c.minimum)}.`;
  if (!eligible) return "এই পণ্য বা কম্বোর সঙ্গে কুপনটি ব্যবহার করা যাবে না।";
  return "";
}
function useCoupon(subtotal: number) {
  const s = useStore(), { coupons, cart, products, settings } = s;
  const [code, setCode] = useState(
    () => sessionStorage.getItem("nirbhor-coupon") || "",
  );
  const c = coupons.find((c) => c.code === code);
  const coupon = code && !couponError(c, subtotal, !!c && cartTotals(cart, products, settings, "Dhaka", c, s).couponEligibleSubtotal > 0) ? c : undefined;
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
  const s = useStore(), { coupons, toast, cart, products, settings } = s;
  const errorFor = (c: Coupon | undefined) => couponError(c, subtotal, !!c && cartTotals(cart, products, settings, "Dhaka", c, s).couponEligibleSubtotal > 0);
  const [input, setInput] = useState(code),
    [error, setError] = useState("");
  return (
    <div className="coupon-field">
      {bnNode(code ? (
        <div className="coupon-applied">
          <Check size={15} />
          <span>
            {bnNode(code)}{bnNode(" ")}
            {bnNode(errorFor(coupons.find((c) => c.code === code))
              ? "· Not eligible yet"
              : "applied")}
          </span>
          <button
            aria-label={bnNode("Remove coupon")}
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
              aria-label={bnNode("Discount code")}
              placeholder={bnNode("A little code for a little extra")}
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
                const error = errorFor(c);
                if (error) {
                  setError(error);
                  return;
                }
                setCode(value);
                setError("");
                toast("A little extra goodness - code applied.");
              }}
            >{bnNode("Apply")}</button>
          </div>
          {bnNode(error && (
            <span className="field-error" role="alert">
              {bnNode(error)}
            </span>
          ))}
        </>
      ))}
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
  const s = useStore(), { products, settings } = s;
  const t = order
    ? {
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        tax: order.tax || 0,
        total: order.total,
        savings: order.offerSavings || [],
      }
    : cartTotals(items, products, settings, zone, coupon, s);
  return (
    <div className="order-summary">
      <h3>{bnNode("A little look at your order.")}</h3>
      <div className="summary-products">
        {bnNode(items.map((item, i) => {
          const p = products.find((p) => p.id === item.id);
          return (
            p && (
              <div key={i}>
                <div className="summary-product-img">
                  <img src={p.image} alt={bnNode(p.name)} />
                  <span>{bnNode(item.quantity)}</span>
                </div>
                <div>
                  <b>{bnNode(p.name)}</b>
                  <small>{bnNode(item.variant)}</small>
                  {item.comboId && <small className="combo-line-label">কম্বোতে অন্তর্ভুক্ত</small>}
                </div>
                <strong>
                  {bnNode(money(
                    (item.unitPrice ?? itemPrice(p, item.variant)) *
                      item.quantity,
                  ))}
                </strong>
              </div>
            )
          );
        }))}
      </div>
      {bnNode(children)}
      <div className="summary-breakdown">
        <div className="summary-line">
          <span>{bnNode("Subtotal")}</span>
          <b>{bnNode(money(t.subtotal))}</b>
        </div>
        {bnNode(t.discount > 0 && !t.savings.length && (
          <div className="summary-line green">
            <span>{bnNode("A little saving")}</span>
            <b>{bnNode("− ")}{bnNode(money(t.discount))}</b>
          </div>
        ))}
        {t.savings.map((saving, index) => <div className="summary-line green offer-saving-line" key={index}><span>{bnNode(saving.name)}</span><b>- {bnNode(money(saving.amount))}</b></div>)}
        <div className="summary-line">
          <span>{bnNode("Delivery")}</span>
          <b>
            {bnNode(t.shipping ? (
              money(t.shipping)
            ) : (
              <span className="green">{bnNode("On us")}</span>
            ))}
          </b>
        </div>
        {bnNode(t.tax > 0 && (
          <div className="summary-line">
            <span>{bnNode("Tax (")}{bnNode(settings.tax)}{bnNode("%)")}</span>
            <b>{bnNode(money(t.tax))}</b>
          </div>
        ))}
        <div className="summary-total">
          <span>{bnNode("Total ")}<small>{bnNode("BDT")}</small>
          </span>
          <b data-testid="order-total">{bnNode(money(t.total))}</b>
        </div>
      </div>
      <span className="secure-note">
        <ShieldCheck size={15} />{bnNode(" Thoughtfully packed. Securely checked out.")}</span>
    </div>
  );
}
export function Cart() {
  const s = useStore(),
    { cart, setCart, products, settings } = s;
  const [zone, setZone] = useState("Dhaka");
  const subtotal = cartTotals(cart, products, settings, zone, undefined, s).subtotal;
  const { code, coupon, setCode } = useCoupon(subtotal);
  const t = cartTotals(cart, products, settings, zone, coupon, s);
  return (
    <main className="container page-space cart-page">
      <Breadcrumb items={[{ label: "Your bag" }]} />
      <SectionTitle
        eyebrow="A FEW GOOD CHOICES"
        title={bnNode("Your little bag of goodness.")}
        link="/shop"
        label="Keep exploring"
      />
      {bnNode(cart.length ? (
        <div className="cart-layout">
          <div>
            <div className="shipping-progress cart-shipping">
              <Truck size={20} />
              <span>
                {bnNode(t.shipping === 0 ? (
                  "A little extra: your delivery is on us."
                ) : (
                  <>{bnNode("You’re ")}<b>{bnNode(money(settings.freeShipping - subtotal))}</b>{bnNode(" away from free delivery.")}</>
                ))}
              </span>
              <progress
                max={settings.freeShipping}
                value={t.shipping === 0 ? settings.freeShipping : Math.min(subtotal, settings.freeShipping)}
              />
            </div>
            <ComboCartGroups />
            {cart.some(item => !item.comboId) && <div className="cart-table-header">
              <span>{bnNode("Your good finds")}</span>
              <span>{bnNode("Quantity")}</span>
              <span>{bnNode("Total")}</span>
            </div>}
            {bnNode(cart.map((item, i) => {
              if (item.comboId) return null;
              const p = products.find((p) => p.id === item.id);
              return (
                p && (
                  <article className="cart-row" key={p.id + item.variant}>
                    <Link className="cart-image" to={`/product/${p.id}`}>
                      <img src={p.image} alt={bnNode(p.name)} />
                    </Link>
                    <div className="cart-item-details">
                      <Link to={`/product/${p.id}`}>
                        <h3>{bnNode(p.name)}</h3>
                      </Link>
                      <select
                        aria-label={bnNode(`Variant for ${p.name}`)}
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
                        {bnNode(productVariants(p).map((v) => (
                          <option
                            key={v.label}
                            value={v.label}
                            disabled={!v.stock}
                          >
                            {bnNode(v.label)}{bnNode(" · ")}{bnNode(money(v.price))}
                          </option>
                        )))}
                      </select>
                      <span>{bnNode(money(itemPrice(p, item.variant)))}</span>
                      <div className="cart-item-actions">
                        <button
                          onClick={() => {
                            if (!s.wishlist.includes(p.id)) s.toggleWish(p.id);
                            setCart((x) => x.filter((_, j) => j !== i));
                            s.toast("Saved for a little later");
                          }}
                        >{bnNode("Save for later")}</button>
                        <button
                          onClick={() =>
                            setCart((x) => x.filter((_, j) => j !== i))
                          }
                        >{bnNode("Remove")}</button>
                      </div>
                      {bnNode(item.quantity * variantUnits(item.variant) > p.stock && (
                        <span className="field-error">{bnNode("Only ")}{bnNode(p.stock)}{bnNode(" units are currently available.")}</span>
                      ))}
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
                      {bnNode(money(
                        (item.unitPrice ?? itemPrice(p, item.variant)) *
                          item.quantity,
                      ))}
                    </strong>
                  </article>
                )
              );
            }))}
            <Link to="/shop" className="text-link cart-continue">
              <ArrowLeft size={16} />{bnNode(" A little more exploring")}</Link>
            <div className="cart-delivery">
              <h3>{bnNode("Where is the goodness going?")}</h3>
              <label className="field">{bnNode("Estimate your delivery")}<select value={zone} onChange={(e) => setZone(e.target.value)}>
                  <option value={"Dhaka"}>{bnNode("Dhaka")}</option>
                  <option value={"Outside Dhaka"}>{bnNode("Outside Dhaka")}</option>
                </select>
              </label>
              <p className="small muted">
                {bnNode(zone === "Dhaka" ? "1-2" : "3-5")}{bnNode(" working days ·")}{bnNode(" ")}
                {bnNode(t.shipping ? money(t.shipping) : "Free delivery")}
              </p>
            </div>
          </div>
          <div className="cart-sidebar">
            <OrderSummary items={cart} zone={zone} coupon={coupon}>
              <CouponField subtotal={subtotal} code={code} setCode={setCode} />
            </OrderSummary>
            <Button className="full" to="/checkout">{bnNode("Continue to checkout ")}<ArrowRight size={17} />
            </Button>
            <span className="secure-note">
              <LockKeyhole size={14} />{bnNode(" Cash on delivery available")}</span>
          </div>
        </div>
      ) : (
        <Empty
          title={bnNode("A little empty, for now.")}
          text="There’s something good waiting for your pantry, home, or everyday."
          action={
            <Button to="/shop">{bnNode("Explore the shop ")}<ArrowRight size={17} />
            </Button>
          }
        />
      ))}
      <section className="section">
        <SectionTitle
          eyebrow="A LITTLE SOMETHING ELSE?"
          title={bnNode("Good company for your good finds.")}
        />
        <div className="product-grid four">
          {bnNode(products
            .filter(
              (p) =>
                p.stock > 0 &&
                p.status === "Published" &&
                !cart.some((c) => c.id === p.id),
            )
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            )))}
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
  const subtotal = cartTotals(cart, products, settings, "Dhaka", undefined, s).subtotal;
  const { code, coupon, setCode } = useCoupon(subtotal);
  const t = cartTotals(cart, products, settings, zone, coupon, s);
  useEffect(() => {
    s.track("InitiateCheckout", String(subtotal));
  }, []);
  const selectedAddress = addresses.find((a) => a.id === saved);
  if (!cart.length)
    return (
      <main className="container page-space">
        <Empty
          title={bnNode("Your checkout is waiting for a little goodness.")}
          text="Add something to your bag to begin."
          action={
            <Button to="/shop">{bnNode("Explore the shop ")}<ArrowRight size={16} />
            </Button>
          }
        />
      </main>
    );
  return (
    <main className="container page-space checkout-page">
      <div className="checkout-top">
        <Link to="/cart" className="text-link">
          <ArrowLeft size={15} />{bnNode(" Back to your bag")}</Link>
        <span>
          <LockKeyhole size={14} />{bnNode(" SECURE CHECKOUT")}</span>
      </div>
      <div className="checkout-layout">
        <div>
          <span className="eyebrow">{bnNode("ALMOST AT YOUR DOORSTEP")}</span>
          <h1>{bnNode("A few details.")}<br />{bnNode("A little goodness on its way.")}</h1>
          <div className="checkout-steps">
            <span className="active">
              <b>{bnNode("1")}</b>{bnNode("Your details")}</span>
            <ChevronRight size={14} />
            <span>
              <b>{bnNode("2")}</b>{bnNode("Order confirmation")}</span>
          </div>
          {bnNode(!profile.loggedIn && (
            <div className="checkout-login">
              <UserRound size={19} />
              <span>{bnNode("Already part of the family?")}{bnNode(" ")}
                <Link to="/login?next=/checkout">{bnNode("Sign in")}</Link>{bnNode(" for saved details.")}</span>
            </div>
          ))}
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
              const phone = latinDigits(String(f.get("phone"))).replace(/\s/g, "");
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
                <span>{bnNode("01")}</span>{bnNode(" How can we reach you?")}</h3>
              <div className="form-grid">
                <label className="field">{bnNode("Full name")}<input
                    required
                    name="name"
                    autoComplete="name"
                    placeholder={bnNode("Your full name")}
                    defaultValue={profile.name}
                  />
                </label>
                <label className="field">{bnNode("Mobile number")}<input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    pattern="(?:\+?88)?01[3-9][0-9]{8}"
                    title={bnNode("Enter a valid Bangladesh mobile number")}
                    placeholder={bnNode("01XXXXXXXXX")}
                    defaultValue={profile.phone}
                  />
                </label>
              </div>
              <label className="field">{bnNode("Email address ")}<span className="muted">{bnNode("(optional)")}</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={bnNode("For a little order update")}
                  defaultValue={profile.email}
                />
              </label>
            </section>
            <section className="checkout-block">
              <h3>
                <span>{bnNode("02")}</span>{bnNode(" Where should we bring the goodness?")}</h3>
              {bnNode(profile.loggedIn && addresses.length > 0 && (
                <label className="field">{bnNode("Use a saved address")}<select
                    value={saved}
                    onChange={(e) => {
                      setSaved(e.target.value);
                      const a = addresses.find((a) => a.id === e.target.value);
                      if (a) setZone(a.zone);
                    }}
                  >
                    <option value="">{bnNode("Enter a new address")}</option>
                    {bnNode(addresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {bnNode(a.label)}{bnNode(" - ")}{bnNode(a.address)}
                      </option>
                    )))}
                  </select>
                </label>
              ))}
              <label className="field">{bnNode("Full delivery address")}<textarea
                  key={saved}
                  name="address"
                  autoComplete="street-address"
                  required
                  minLength={10}
                  rows={3}
                  defaultValue={selectedAddress?.address}
                  placeholder={bnNode("House / flat, road, area, district and postal code")}
                />
              </label>
              <label className="field">{bnNode("Delivery zone")}<select value={zone} onChange={(e) => setZone(e.target.value)}>
                  <option value={"Dhaka"}>{bnNode("Dhaka")}</option>
                  <option value={"Outside Dhaka"}>{bnNode("Outside Dhaka")}</option>
                </select>
              </label>
              <div className="delivery-option">
                <Truck size={21} />
                <span>
                  <b>{bnNode("Standard delivery")}</b>
                  <small>
                    {bnNode(zone === "Dhaka" ? "1-2" : "3-5")}{bnNode(" working days · Carefully packed")}</small>
                </span>
                <b>{bnNode(t.shipping ? money(t.shipping) : "Free")}</b>
              </div>
              {bnNode(profile.loggedIn && !saved && (
                <label className="check-label">
                  <input name="save-address" type="checkbox" />{bnNode("Save this address for next time")}</label>
              ))}
            </section>
            <section className="checkout-block">
              <h3>
                <span>{bnNode("03")}</span>{bnNode(" A simple way to pay.")}</h3>
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
                  <b>{bnNode("Cash on delivery")}</b>
                  <small>{bnNode("Pay when your little goodness arrives.")}</small>
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
                  <b>{bnNode("Card / mobile banking")}</b>
                  <small>
                    {bnNode(settings.online
                      ? "Payment preview - saved as unpaid, no charge is made."
                      : "Available when the payment gateway is connected.")}
                  </small>
                </span>
                <CreditCard size={22} />
              </label>
            </section>
            <label className="field">{bnNode("A note for us ")}<span className="muted">{bnNode("(optional)")}</span>
              <textarea
                name="note"
                rows={2}
                placeholder={bnNode("Anything that would make your delivery a little easier?")}
              />
            </label>
            <label className="check-label terms-label">
              <input type="checkbox" required />
              <span>{bnNode("I agree to the ")}<Link to="/page/terms">{bnNode("terms & conditions")}</Link>{bnNode(" ")}{bnNode("and ")}<Link to="/page/privacy">{bnNode("privacy policy")}</Link>{bnNode(".")}</span>
            </label>
            {bnNode(error && (
              <p className="field-error" role="alert">
                {bnNode(error)}
              </p>
            ))}
            <Button type="submit" className="full" disabled={submitting}>
              {bnNode(submitting
                ? "Placing your order…"
                : `Place order · ${money(t.total)}`)}
              <ArrowRight size={17} />
            </Button>
            <p className="preview-note">
              <Leaf size={14} />{bnNode(" Frontend preview: your order stays in this browser. No charge or real delivery is made.")}</p>
          </form>
        </div>
        <aside className="checkout-sidebar">
          <OrderSummary items={cart} zone={zone} coupon={coupon}>
            <CouponField subtotal={subtotal} code={code} setCode={setCode} />
          </OrderSummary>
          <div className="checkout-promise">
            <Leaf size={21} />
            <div>
              <b>{bnNode("A little care, all the way.")}</b>
              <p>{bnNode("Honest products. Thoughtful packing.")}<br />{bnNode("Real people, here to help.")}</p>
            </div>
          </div>
          <Link to="/contact" className="text-link">{bnNode("Need a little help? ")}<ArrowUpRight size={14} />
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
          title={bnNode("We couldn’t find that order.")}
          text="Please check your order number."
          action={<Button to="/track">{bnNode("Track an order")}</Button>}
        />
      </main>
    );
  return (
    <main className="container success-page">
      <span className="success-icon">
        <Check size={33} strokeWidth={1.5} />
      </span>
      <span className="eyebrow">{bnNode("A LITTLE GOODNESS IS ON ITS WAY")}</span>
      <h1>{bnNode("Good choice, ")}{bnNode(order.customer.split(" ")[0])}{bnNode(".")}</h1>
      <p>{bnNode("Your order ")}<b>{bnNode("#")}{bnNode(order.id)}</b>{bnNode(" has been received in this frontend preview.")}<br />{bnNode("You can explore its details and delivery timeline below.")}</p>
      <div className="success-details">
        <div>
          <span>{bnNode("ORDER NUMBER")}</span>
          <b>{bnNode("#")}{bnNode(order.id)}</b>
        </div>
        <div>
          <span>{bnNode("ORDER TOTAL")}</span>
          <b>{bnNode(money(order.total))}</b>
        </div>
        <div>
          <span>{bnNode("PAYMENT METHOD")}</span>
          <b>{bnNode(order.payment)}</b>
        </div>
        <div>
          <span>{bnNode("ESTIMATED DELIVERY")}</span>
          <b>{bnNode(order.zone === "Dhaka" ? "1-2" : "3-5")}{bnNode(" working days")}</b>
        </div>
      </div>
      <div className="success-actions">
        <Button
          to={`/track?order=${order.id}&phone=${encodeURIComponent(order.phone)}`}
        >{bnNode("Follow your little delivery ")}<Truck size={17} />
        </Button>
        <Button variant="outline" to="/shop">{bnNode("A little more exploring ")}<ArrowRight size={17} />
        </Button>
      </div>
      <div className="success-order">
        <OrderSummary items={order.items} zone={order.zone} order={order} />
      </div>
      <p className="small muted">{bnNode("Your order is saved locally. Confirmation calls and delivery notifications will be connected with the backend.")}</p>
    </main>
  );
}
export function OrderTimeline({ order }: { order: Order }) {
  const current = statusSteps.indexOf(order.status);
  return (
    <div className="order-timeline">
      {bnNode(["Cancelled", "Returned", "Return requested", "Refunded"].includes(
        order.status,
      ) ? (
        <div className="timeline-special">
          <Badge tone="warm">{bnNode(order.status)}</Badge>
          <p>
            {bnNode(order.status === "Return requested"
              ? "We have received your return request. Our team will review the details."
              : "This order has been closed. Contact us if you need a little help.")}
          </p>
        </div>
      ) : (
        statusSteps.map((step, i) => (
          <div
            key={step}
            className={`${i <= current ? "done" : ""} ${i === current ? "current" : ""}`}
          >
            <span>
              {bnNode(i < current ? (
                <Check size={14} />
              ) : i === current ? (
                <span className="timeline-dot" />
              ) : (
                i + 1
              ))}
            </span>
            <div>
              <b>{bnNode(step === "Placed" ? "Order placed" : step)}</b>
              <small>
                {bnNode(i === 0
                  ? new Date(order.date).toLocaleDateString("bn-BD", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : i === current
                    ? "Your order is here right now"
                    : i < current
                      ? "Completed"
                      : "Up next")}
              </small>
            </div>
          </div>
        ))
      ))}
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
        <span className="eyebrow">{bnNode("FROM OUR HANDS TO YOUR HOME")}</span>
        <h1>{bnNode("Follow your little delivery.")}</h1>
        <p>{bnNode("A little update on the goodness you’re waiting for.")}</p>
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
                latinDigits(phone).replace(/\D/g, "").slice(-11),
          );
          setFound(result);
          setError(
            result
              ? ""
              : "We couldn’t find that combination. Please check the order number and delivery phone.",
          );
        }}
      >
        <label className="field">{bnNode("Order number")}<input
            placeholder={bnNode("e.g. NBR-4821")}
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </label>
        <label className="field">{bnNode("Delivery mobile number")}<input
            placeholder={bnNode("01XXXXXXXXX")}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <Button type="submit">{bnNode("Find my order ")}<ArrowRight size={16} />
        </Button>
      </form>
      {bnNode(error && (
        <p className="field-error center" role="alert">
          {bnNode(error)}
        </p>
      ))}
      <button
        className="demo-track text-button"
        onClick={() => {
          setOrderId("NBR-4819");
          setPhone(orders.find((o) => o.id === "NBR-4819")?.phone || "");
          setFound(orders.find((o) => o.id === "NBR-4819"));
          setError("");
        }}
      >{bnNode("Explore a sample delivery")}</button>
      {bnNode(order && (
        <div className="tracking-result">
          <div className="tracking-result-head">
            <div>
              <span className="eyebrow">{bnNode("YOUR LITTLE GOODNESS")}</span>
              <h2>{bnNode("Order #")}{bnNode(order.id)}</h2>
            </div>
            <Badge>{bnNode(order.status)}</Badge>
          </div>
          <div className="tracking-result-grid">
            <div>
              <OrderTimeline order={order} />
            </div>
            <div className="tracking-info">
              <h3>{bnNode("Delivered with a little care.")}</h3>
              <p>
                {bnNode(order.customer)}
                <br />
                {bnNode(order.address)}
              </p>
              <dl>
                <div>
                  <dt>{bnNode("Courier")}</dt>
                  <dd>{bnNode(order.courier)}</dd>
                </div>
                <div>
                  <dt>{bnNode("Tracking ID")}</dt>
                  <dd>{bnNode(order.tracking || "Assigned after dispatch")}</dd>
                </div>
                <div>
                  <dt>{bnNode("Estimated delivery")}</dt>
                  <dd>{bnNode(order.zone === "Dhaka" ? "1-2" : "3-5")}{bnNode(" working days")}</dd>
                </div>
                <div>
                  <dt>{bnNode("Payment")}</dt>
                  <dd>{bnNode(order.payment)}</dd>
                </div>
                <div>
                  <dt>{bnNode("Order total")}</dt>
                  <dd>{bnNode(money(order.total))}</dd>
                </div>
              </dl>
              <Link className="text-link" to="/contact">{bnNode("Need a little help? ")}<ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      ))}
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
        <img src="/assets/organic-world-v5.webp" alt={bnNode("Nirbhor raw honey, nuts and dates")} />
        <div>
          <Leaf size={28} />
          <h2>{bnNode("A little goodness.")}<br />{bnNode("A place to call yours.")}</h2>
          <p>{bnNode("Your favourites, thoughtful updates, and all your good choices in one place.")}</p>
        </div>
      </div>
      <div className="auth-form-container">
        <Link to="/" className="text-link">
          <ArrowLeft size={15} />{bnNode(" Back to the good stuff")}</Link>
        <span className="eyebrow">{bnNode("YOUR LITTLE CORNER OF NIRBHOR")}</span>
        <h1>
          {bnNode(mode === "register"
            ? "Good to have you here."
            : mode === "forgot"
              ? "A little fresh start."
              : "Welcome back.")}
        </h1>
        <p>
          {bnNode(mode === "register"
            ? "Make room for a little more goodness."
            : mode === "forgot"
              ? "Enter your email to preview the password reset flow."
              : "Your everyday good is right where you left it.")}
        </p>
        {bnNode(sent ? (
          <div className="auth-sent">
            <Mail size={35} />
            <h2>
              {bnNode(mode === "forgot"
                ? "A fresh start, in your inbox."
                : "A little code, just for you.")}
            </h2>
            <p>
              {bnNode(mode === "forgot"
                ? "Reset requests will be sent when email delivery is connected. This frontend preview does not change a real password."
                : "For this preview, use the code 961204. SMS delivery will be connected with the backend.")}
            </p>
            {bnNode(mode === "login" && (
              <form
                className="form-stack"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  if (latinDigits(String(f.get("code"))) !== "961204") {
                    setError("Please use the preview code 961204.");
                    return;
                  }
                  enter();
                }}
              >
                <label className="field">{bnNode("6-digit code")}<input
                    name="code"
                    required
                    pattern="[0-9]{6}"
                    inputMode="numeric"
                    placeholder={bnNode("961204")}
                  />
                </label>
                {bnNode(error && <p className="field-error">{bnNode(error)}</p>)}
                <Button type="submit">{bnNode("Continue ")}<ArrowRight size={16} />
                </Button>
              </form>
            ))}
            <Button variant="outline" to="/login">{bnNode("Back to sign in")}</Button>
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
              {bnNode(mode === "register" && (
                <label className="field">{bnNode("Full name")}<input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder={bnNode("Your name")}
                  />
                </label>
              ))}
              {bnNode(!otp && (
                <label className="field">{bnNode("Email address")}<input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder={bnNode("you@example.com")}
                  />
                </label>
              ))}
              {bnNode((mode === "register" || otp) && (
                <label className="field">{bnNode("Mobile number")}<input
                    name="phone"
                    type="tel"
                    placeholder={bnNode("01XXXXXXXXX")}
                    pattern="(?:\+?88)?01[3-9][0-9]{8}"
                    required
                  />
                </label>
              ))}
              {bnNode(mode !== "forgot" && !otp && (
                <label className="field">{bnNode("Password")}<div className="password-field">
                    <input
                      type={show ? "text" : "password"}
                      name="password"
                      required
                      minLength={8}
                      placeholder={bnNode("At least 8 characters")}
                      autoComplete={
                        mode === "register"
                          ? "new-password"
                          : "current-password"
                      }
                    />
                    <button
                      type="button"
                      aria-label={bnNode(show ? "Hide password" : "Show password")}
                      onClick={() => setShow(!show)}
                    >
                      {bnNode(show ? <EyeOff size={17} /> : <Eye size={17} />)}
                    </button>
                  </div>
                </label>
              ))}
              {bnNode(mode === "login" && !otp && (
                <Link className="forgot-link" to="/forgot-password">{bnNode("Forgot your password?")}</Link>
              ))}
              {bnNode(mode === "register" && (
                <label className="check-label">
                  <input type="checkbox" required />
                  <span>{bnNode("I agree to the ")}<Link to="/page/terms">{bnNode("terms")}</Link>{bnNode(" and")}{bnNode(" ")}
                    <Link to="/page/privacy">{bnNode("privacy policy")}</Link>{bnNode(".")}</span>
                </label>
              ))}
              <Button className="full" type="submit">
                {bnNode(mode === "register"
                  ? "Create your account"
                  : mode === "forgot"
                    ? "Send reset link"
                    : otp
                      ? "Send a little code"
                      : "Sign in")}
                <ArrowRight size={16} />
              </Button>
            </form>
            {bnNode(mode === "login" && (
              <>
                <div className="auth-divider">
                  <span>{bnNode("or keep it simple")}</span>
                </div>
                <Button
                  variant="outline"
                  className="full"
                  onClick={() => setOtp(!otp)}
                >
                  {bnNode(otp ? "Sign in with email" : "Continue with mobile OTP")}{bnNode(" ")}
                  <UserRound size={16} />
                </Button>
                <button className="demo-button" onClick={() => enter()}>{bnNode("Explore a demo customer account ")}<ArrowUpRight size={14} />
                </button>
              </>
            ))}
            <div className="auth-switch">
              {bnNode(mode === "register"
                ? "Already part of the family?"
                : "New to our little community?")}{bnNode(" ")}
              <Link to={mode === "register" ? "/login" : "/register"}>
                {bnNode(mode === "register" ? "Sign in" : "Join us")}{bnNode(" ")}
                <ArrowUpRight size={13} />
              </Link>
            </div>
            <p className="preview-note">
              <LockKeyhole size={14} />{bnNode(" Frontend preview. Sign-in is simulated on this browser; no passwords are stored.")}</p>
          </>
        ))}
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
      title={bnNode(address ? "Edit your address" : "A new little delivery spot")}
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
        <label className="field">{bnNode("Address label")}<input
            name="label"
            defaultValue={address?.label || "Home"}
            required
          />
        </label>
        <label className="field">{bnNode("Recipient name")}<input name="name" defaultValue={address?.name} required />
        </label>
        <label className="field">{bnNode("Mobile number")}<input
            name="phone"
            type="tel"
            pattern="(?:\+?88)?01[3-9][0-9]{8}"
            defaultValue={address?.phone}
            required
          />
        </label>
        <label className="field">{bnNode("Full address")}<textarea
            aria-label={bnNode("Full address")}
            name="address"
            rows={3}
            minLength={10}
            defaultValue={address?.address}
            required
          />
        </label>
        <label className="field">{bnNode("Delivery zone")}<select name="zone" defaultValue={address?.zone || "Dhaka"}>
            <option value={"Dhaka"}>{bnNode("Dhaka")}</option>
            <option value={"Outside Dhaka"}>{bnNode("Outside Dhaka")}</option>
          </select>
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            name="default"
            defaultChecked={address?.default}
          />{bnNode("Make this my default address")}</label>
        <Button type="submit">{bnNode("Save this little spot ")}<Check size={16} />
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
          title={bnNode("Your own little corner of goodness.")}
          text="Sign in to see your orders, saved addresses and everyday favourites."
          action={
            <Button to="/login">{bnNode("Make yourself at home ")}<ArrowRight size={16} />
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
              {bnNode(profile.name
                .split(" ")
                .map((x) => x[0])
                .join("")
                .slice(0, 2))}
            </span>
            <h3>{bnNode(profile.name)}</h3>
            <small>{bnNode(profile.email)}</small>
            <Badge>{bnNode("A part of the good stuff")}</Badge>
          </div>
          <nav>
            {bnNode(accountNav.map(([label, url, Icon]) => (
              <NavLink key={url} to={url} end={url === "/account"}>
                <Icon size={17} />
                {bnNode(label)}
                {bnNode(label === "Notifications" && notifications.length > 0 && (
                  <small>{bnNode(notifications.length)}</small>
                ))}
              </NavLink>
            )))}
            <button
              onClick={() => {
                s.setProfile((x) => ({ ...x, loggedIn: false }));
                s.toast("Until next time. Take a little goodness with you.");
                navigate("/");
              }}
            >
              <LogOut size={17} />{bnNode("Sign out")}</button>
          </nav>
        </aside>
        <div className="account-content">
          {bnNode(section === "overview" ? (
            <>
              <span className="eyebrow">{bnNode("YOUR EVERYDAY GOOD, ALL TOGETHER")}</span>
              <h1>{bnNode("Hello, ")}{bnNode(profile.name.split(" ")[0])}{bnNode(".")}</h1>
              <p className="muted">{bnNode("A little look at your latest good choices.")}</p>
              <div className="account-stats">
                {bnNode([
                  [String(myOrders.length), "Good orders", Package],
                  [String(wishlist.length), "Saved favourites", Heart],
                  [String(addresses.length), "Delivery spots", MapPin],
                ].map(([n, t, I]) => {
                  const Icon = I as typeof Package;
                  return (
                    <div key={String(t)}>
                      <Icon size={20} />
                      <b>{bnNode(String(n))}</b>
                      <span>{bnNode(String(t))}</span>
                    </div>
                  );
                }))}
              </div>
              <SectionTitle
                title={bnNode("Your latest goodness.")}
                link="/account/orders"
                label="All orders"
              />
              <OrderList orders={myOrders.slice(0, 3)} />
              <div className="account-welcome">
                <Leaf size={25} />
                <div>
                  <h3>{bnNode("A little something for your next visit.")}</h3>
                  <p>{bnNode("Use NIRBHOR10 for 10% off your next good find over ৳500.")}</p>
                </div>
                <Link to="/shop" className="text-link">{bnNode("Find your good ")}<ArrowUpRight size={15} />
                </Link>
              </div>
            </>
          ) : section === "orders" ? (
            <>
              <SectionTitle eyebrow="YOUR GOOD CHOICES" title={bnNode("My orders.")} />
              <OrderList orders={myOrders} />
            </>
          ) : section === "addresses" ? (
            <>
              <SectionTitle
                eyebrow="FROM OUR HANDS TO YOUR HOME"
                title={bnNode("Your little delivery spots.")}
              />
              <Button variant="outline" onClick={() => setEditAddress("new")}>
                <Plus size={16} />{bnNode("Add a new address")}</Button>
              <div className="address-grid">
                {bnNode(addresses.map((a) => (
                  <article key={a.id}>
                    <div>
                      <h3>{bnNode(a.label)}</h3>
                      {bnNode(a.default && <Badge>{bnNode("Default")}</Badge>)}
                    </div>
                    <b>{bnNode(a.name)}</b>
                    <p>
                      {bnNode(a.address)}
                      <br />
                      {bnNode(a.zone)}
                      <br />
                      {bnNode(a.phone)}
                    </p>
                    <div className="address-actions">
                      <button onClick={() => setEditAddress(a)}>{bnNode("Edit address")}</button>
                      <button onClick={() => setDeleting(a.id)}>{bnNode("Remove")}</button>
                      {bnNode(!a.default && (
                        <button
                          onClick={() => {
                            s.setAddresses((x) =>
                              x.map((y) => ({ ...y, default: y.id === a.id })),
                            );
                            s.toast("Default address updated.");
                          }}
                        >{bnNode("Make default")}</button>
                      ))}
                    </div>
                  </article>
                )))}
              </div>
              {bnNode(!addresses.length && (
                <Empty
                  icon={MapPin}
                  title={bnNode("Where should the goodness go?")}
                  text="Add a delivery address for a little easier checkout next time."
                />
              ))}
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
                  bnNode(section === "wishlist"
                    ? "Saved little favourites."
                    : "A second look at something good.")
                }
                link="/shop"
                label="Keep exploring"
              />
              {bnNode((section === "wishlist" ? wishlist : recent).length ? (
                <div className="product-grid three">
                  {bnNode((section === "wishlist" ? wishlist : recent)
                    .map((id) => products.find((p) => p.id === id))
                    .filter((p): p is NonNullable<typeof p> => !!p)
                    .map((p) => (
                      <ProductCard key={p.id} product={p} />
                    )))}
                </div>
              ) : (
                <Empty
                  icon={Heart}
                  title={bnNode("A few good finds will make themselves at home.")}
                  text="Explore the shop and save your favourites."
                  action={<Button to="/shop">{bnNode("Explore the shop")}</Button>}
                />
              ))}
            </>
          ) : section === "reviews" ? (
            <>
              <SectionTitle
                eyebrow="YOUR WORDS MAKE A DIFFERENCE"
                title={bnNode("A little feedback, from you.")}
              />
              {bnNode(reviews
                .filter((r) => r.name === profile.name)
                .map((r) => (
                  <article className="account-review" key={r.id}>
                    <div>
                      <b>{bnNode(products.find((p) => p.id === r.productId)?.name)}</b>
                      <Badge>{bnNode(r.status)}</Badge>
                    </div>
                    <span className="stars">{bnNode("★".repeat(r.rating))}</span>
                    <h3>{bnNode(r.title)}</h3>
                    <p>{bnNode(r.text)}</p>
                    {bnNode(r.media && (
                      <a
                        href={r.media}
                        target="_blank"
                        rel="noreferrer"
                        className="text-link"
                      >{bnNode("View your uploaded media ")}<ArrowUpRight size={13} />
                      </a>
                    ))}
                  </article>
                )))}
              {bnNode(!reviews.some((r) => r.name === profile.name) && (
                <Empty
                  icon={Star}
                  title={bnNode("Your story belongs here.")}
                  text="Review a product you’ve tried and help someone find their good."
                  action={<Button to="/account/orders">{bnNode("See your orders")}</Button>}
                />
              ))}
            </>
          ) : section === "notifications" ? (
            <>
              <SectionTitle
                eyebrow="A LITTLE UPDATE FOR YOU"
                title={bnNode("Your good-news corner.")}
              />
              {bnNode(notifications.map((n, i) => (
                <div className="notification-row" key={i}>
                  <Bell size={19} />
                  <div>
                    <b>
                      {bnNode(n.includes("order")
                        ? "Your order, with a little update"
                        : "A little note from NIRBHOR")}
                    </b>
                    <p>{bnNode(n)}</p>
                  </div>
                  <button
                    className="icon-btn"
                    aria-label={bnNode("Dismiss account notification")}
                    onClick={() =>
                      s.setNotifications((x) => x.filter((_, j) => j !== i))
                    }
                  >
                    <X size={15} />
                  </button>
                </div>
              )))}
              {bnNode(!notifications.length && (
                <Empty
                  icon={Bell}
                  title={bnNode("All caught up.")}
                  text="Your next little update will appear here."
                />
              ))}
            </>
          ) : (
            <>
              <SectionTitle
                eyebrow="MAKE YOURSELF AT HOME"
                title={bnNode("Your account, your way.")}
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
                  <label className="field">{bnNode("Full name")}<input name="name" defaultValue={profile.name} required />
                  </label>
                  <label className="field">{bnNode("Email address")}<input
                      type="email"
                      name="email"
                      defaultValue={profile.email}
                      required
                    />
                  </label>
                </div>
                <label className="field">{bnNode("Mobile number")}<input
                    type="tel"
                    name="phone"
                    defaultValue={profile.phone}
                    pattern="(?:\+?88)?01[3-9][0-9]{8}"
                    required
                  />
                </label>
                <h3>{bnNode("A little update, your way.")}</h3>
                <label className="check-label">
                  <input type="checkbox" defaultChecked />{bnNode("Order and delivery updates")}</label>
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
                  />{bnNode("New arrivals, offers, and occasional good news")}</label>
                <Button type="submit">{bnNode("Save my details ")}<Check size={16} />
                </Button>
              </form>
              <div className="account-security">
                <LockKeyhole size={21} />
                <div>
                  <h3>{bnNode("Payment & account security")}</h3>
                  <p>{bnNode("Saved payment methods and password management will be available with the secure backend. This preview does not store card details or passwords.")}</p>
                  <Link className="text-link" to="/forgot-password">{bnNode("Preview password reset ")}<ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      {bnNode(editAddress && (
        <AddressForm
          address={editAddress === "new" ? undefined : editAddress}
          onClose={() => setEditAddress(undefined)}
        />
      ))}{bnNode(" ")}
      {bnNode(deleting && (
        <Modal
          title={bnNode("Remove this delivery spot?")}
          onClose={() => setDeleting("")}
        >
          <p className="muted">{bnNode("You can always add it again when your goodness needs a new destination.")}</p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setDeleting("")}>{bnNode("Keep address")}</Button>
            <Button
              onClick={() => {
                s.setAddresses((x) => x.filter((a) => a.id !== deleting));
                setDeleting("");
                s.toast("Address removed.");
              }}
            >{bnNode("Remove address")}</Button>
          </div>
        </Modal>
      ))}
    </main>
  );
}
export function OrderList({ orders }: { orders: Order[] }) {
  return orders.length ? (
    <div className="customer-order-list">
      {bnNode(orders.map((o) => (
        <Link to={`/account/order/${o.id}`} key={o.id}>
          <span className="order-list-icon">
            <Package size={22} />
          </span>
          <div>
            <b>{bnNode("#")}{bnNode(o.id)}</b>
            <span>
              {bnNode(new Date(o.date).toLocaleDateString("bn-BD", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }))}{bnNode(" ")}{bnNode("· ")}{bnNode(o.items.reduce((n, i) => n + i.quantity, 0))}{bnNode(" good finds")}</span>
          </div>
          <Badge tone={o.status === "Cancelled" ? "warm" : ""}>
            {bnNode(o.status)}
          </Badge>
          <strong>{bnNode(money(o.total))}</strong>
          <ArrowRight size={17} />
        </Link>
      )))}
    </div>
  ) : (
    <Empty
      icon={Package}
      title={bnNode("Your first good choice is waiting.")}
      text="When you place an order, its story will appear here."
      action={
        <Button to="/shop">{bnNode("Discover something good ")}<ArrowRight size={16} />
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
          title={bnNode("Let’s find your order.")}
          text="Sign in with the account used for this order."
          action={<Button to="/login">{bnNode("Sign in")}</Button>}
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
          <span className="eyebrow">{bnNode("YOUR GOOD CHOICES, UP CLOSE")}</span>
          <h1>{bnNode("Order #")}{bnNode(order.id)}</h1>
          <p className="muted">{bnNode("Placed")}{bnNode(" ")}
            {bnNode(new Date(order.date).toLocaleDateString("bn-BD", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }))}
          </p>
        </div>
        <Badge>{bnNode(order.status)}</Badge>
      </div>
      <div className="order-detail-grid">
        <div>
          <h3>{bnNode("A little update.")}</h3>
          <OrderTimeline order={order} />
        </div>
        <div>
          <OrderSummary items={order.items} zone={order.zone} order={order} />
          <div className="order-placed-total">
            <b>{bnNode("Recorded order total")}</b>
            <b>{bnNode(money(order.total))}</b>
          </div>
          <div className="delivery-address">
            <h3>{bnNode("Your delivery spot")}</h3>
            <p>
              {bnNode(order.customer)}
              <br />
              {bnNode(order.address)}
              <br />
              {bnNode(order.phone)}
            </p>
            <Badge>
              {bnNode(order.payment)}{bnNode(" · ")}{bnNode(order.paymentStatus)}
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
          <RotateCcw size={16} />{bnNode("Reorder your good finds")}</Button>
        <Button
          to={`/track?order=${order.id}&phone=${encodeURIComponent(order.phone)}`}
          variant="outline"
        >{bnNode("Track delivery ")}<Truck size={16} />
        </Button>
        {bnNode(["Placed", "Confirmed"].includes(order.status) && (
          <button
            className="text-button danger"
            onClick={() => setAction("cancel")}
          >{bnNode("Cancel order")}</button>
        ))}
        {bnNode(order.status === "Delivered" && (
          <button className="text-button" onClick={() => setAction("return")}>{bnNode("Request a return / refund")}</button>
        ))}
        <button className="text-link" onClick={() => window.print()}>
          <Printer size={16} />{bnNode("Print order")}</button>
      </div>
      {bnNode(order.status === "Delivered" && (
        <div className="order-review-prompt">
          <Star size={22} />
          <div>
            <h3>{bnNode("How was your little goodness?")}</h3>
            <p>{bnNode("Your experience helps the next person choose.")}</p>
          </div>
          <Link
            to={`/product/${order.items[0].id}#reviews`}
            className="text-link"
          >{bnNode("Write a review ")}<ArrowUpRight size={14} />
          </Link>
        </div>
      ))}
      {bnNode(action && (
        <Modal
          title={
            bnNode(action === "cancel"
              ? "Cancel this little delivery?"
              : "A little help with your order.")
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
              {bnNode(action === "cancel"
                ? "We’ll return these items to the shelf."
                : "Tell us a little about what happened so our team can help.")}
            </p>
            <label className="field">{bnNode("Reason")}<textarea name="reason" rows={3} required minLength={5} />
            </label>
            <Button type="submit">
              {bnNode(action === "cancel"
                ? "Confirm cancellation"
                : "Submit return request")}
              <ArrowRight size={16} />
            </Button>
          </form>
        </Modal>
      ))}
    </main>
  );
}
