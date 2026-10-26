import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  Leaf,
  Package,
  Play,
  Plus,
  ShieldCheck,
  Star,
  ThumbsUp,
  Truck,
  X,
  ZoomIn,
  MapPin,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { useStore, usePlaceOrder, cartTotals } from "./store";
import { money, productVariants, uid } from "./data";
import type { Product, Review, Campaign } from "./data";
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
export function Countdown({ end }: { end: string }) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const update = () =>
      setRemaining(Math.max(0, new Date(end).getTime() - Date.now()));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [end]);
  const days = Math.floor(remaining / 86400000),
    hours = Math.floor(remaining / 3600000) % 24,
    minutes = Math.floor(remaining / 60000) % 60,
    seconds = Math.floor(remaining / 1000) % 60;
  return (
    <div className="countdown">
      <Clock size={17} />
      <span>
        {remaining
          ? "A little goodness won’t wait forever"
          : "This seasonal offer has ended"}
      </span>
      {remaining > 0 && (
        <strong>
          {days > 0 && `${days}d `}
          {String(hours).padStart(2, "0")} : {String(minutes).padStart(2, "0")}{" "}
          : {String(seconds).padStart(2, "0")}
        </strong>
      )}
    </div>
  );
}
export function Faq({ campaign = false }: { campaign?: boolean }) {
  const { settings, content } = useStore();
  const entries = campaign
    ? [
        [
          "Is the honey completely raw?",
          "Our Sundarban honey is raw and unfiltered. Its texture and colour vary naturally between seasonal batches. We show source and batch details so you can choose with confidence.",
        ],
        [
          "Why does the texture change?",
          "Natural honey may crystallise over time, especially in cooler temperatures. Place the sealed jar in warm (not boiling) water and stir gently if you prefer a runnier texture.",
        ],
        [
          "How should I store it?",
          "Keep the jar sealed in a cool, dry place, away from direct sunlight. Always use a clean, dry spoon.",
        ],
        [
          "Can I pay when my order arrives?",
          "Yes. Cash on delivery is available across our delivery areas in Bangladesh. The delivery charge is shown before you confirm.",
        ],
        [
          "When will my order arrive?",
          `Delivery typically takes 1–2 working days in Dhaka and 3–5 working days outside Dhaka. Delivery is free over ${money(settings.freeShipping)}.`,
        ],
      ]
    : [
        [
          "Where do you deliver?",
          "We deliver across Bangladesh. Dhaka orders usually arrive within 1–2 working days; other areas within 3–5 working days.",
        ],
        [
          "How much is delivery?",
          `Delivery within Dhaka is ${money(settings.dhaka)} and outside Dhaka ${money(settings.outside)}. Orders of ${money(settings.freeShipping)} or more ship free.`,
        ],
        [
          "Can I order without an account?",
          "Absolutely. Choose guest checkout or the quick order form on a campaign product. We only ask for what we need to deliver your order.",
        ],
        [
          "What if something arrives damaged?",
          "Please contact us within 48 hours with your order number and a photo. Keep the packaging, and our team will help arrange a replacement or return.",
        ],
        [
          "How do I track my order?",
          "Open “Track your order” and enter your order number and delivery mobile number. Your timeline will show the latest order status.",
        ],
      ];
  return (
    <div className="faq-list">
      {entries.map(([q, a], i) => (
        <details key={q}>
          <summary>
            {q}
            <Plus size={17} />
          </summary>
          <p>{content[`faq-${i}`] || a}</p>
        </details>
      ))}
    </div>
  );
}
export function Reviews({ product: p }: { product: Product }) {
  const { reviews, setReviews, profile, orders, toast, products } = useStore();
  const [modal, setModal] = useState(false),
    [sort, setSort] = useState("recent"),
    [filter, setFilter] = useState("all"),
    [rating, setRating] = useState(5),
    [media, setMedia] = useState("");
  const approved = reviews.filter(
    (r) => r.productId === p.id && r.status === "Approved",
  );
  const average = approved.length
    ? approved.reduce((a, r) => a + r.rating, 0) / approved.length
    : p.rating;
  const display = approved
    .filter(
      (r) =>
        filter === "all" ||
        (filter === "media" ? !!r.media : r.rating === Number(filter)),
    )
    .sort((a, b) =>
      sort === "helpful" ? b.helpful - a.helpful : b.date.localeCompare(a.date),
    );
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const verified = orders.some(
      (o) =>
        o.email === profile.email &&
        profile.loggedIn &&
        o.status === "Delivered" &&
        o.items.some((i) => i.id === p.id),
    );
    setReviews((x) => [
      {
        id: uid("r"),
        productId: p.id,
        name: String(f.get("name")),
        rating,
        title: String(f.get("title")),
        text: String(f.get("text")),
        media,
        date: new Date().toISOString(),
        status: "Pending",
        featured: false,
        helpful: 0,
        reply: "",
        verified,
      },
      ...x,
    ]);
    toast("Thank you. Your review is awaiting moderation.");
    setModal(false);
    setMedia("");
  };
  return (
    <section className="product-reviews container section" id="reviews">
      <SectionTitle
        eyebrow="HONEST WORDS. REAL GOODNESS."
        title="From our community."
      />
      <div className="reviews-overview">
        <div>
          <span className="review-score">{average.toFixed(1)}</span>
          <div>
            <span className="stars">★★★★★</span>
            <p>{approved.length || p.reviews} customer reviews</p>
          </div>
        </div>
        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map((n) => (
            <button key={n} onClick={() => setFilter(String(n))}>
              <span>{n} ★</span>
              <progress
                max={Math.max(approved.length, 1)}
                value={approved.filter((r) => r.rating === n).length}
              />
              <span>{approved.filter((r) => r.rating === n).length}</span>
            </button>
          ))}
        </div>
        <div>
          <h3>A little feedback goes a long way.</h3>
          <p>Share the good. Help someone choose.</p>
          <Button variant="outline" onClick={() => setModal(true)}>
            Write a review <Plus size={15} />
          </Button>
        </div>
      </div>
      <div className="reviews-toolbar">
        <div className="filter-chips">
          {[
            ["all", "All reviews"],
            ["media", "With photos / video"],
          ].map(([k, t]) => (
            <button
              className={filter === k ? "active" : ""}
              key={k}
              onClick={() => setFilter(k)}
            >
              {t}
            </button>
          ))}
          {!["all", "media"].includes(filter) && (
            <button onClick={() => setFilter("all")}>
              {filter} stars <X size={12} />
            </button>
          )}
        </div>
        <select
          aria-label="Sort reviews"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="recent">Most recent</option>
          <option value="helpful">Most helpful</option>
        </select>
      </div>
      {display.length ? (
        display.map((r) => (
          <article key={r.id} className="review-row">
            <div className="reviewer">
              <span className="review-avatar">
                {r.name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </span>
              <strong>{r.name}</strong>
              {r.verified && (
                <span>
                  <Check size={12} /> Verified purchase
                </span>
              )}
              <small>
                {new Date(r.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </small>
            </div>
            <div className="review-body">
              <span className="stars">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
              {r.media &&
                (r.media.startsWith("data:video") ? (
                  <video src={r.media} controls className="review-media" />
                ) : (
                  <img
                    src={r.media}
                    className="review-media"
                    alt={`Review from ${r.name}`}
                  />
                ))}
              {r.reply && (
                <div className="admin-reply">
                  <b>A note from NIRBHOR</b>
                  <p>{r.reply}</p>
                </div>
              )}
              <button
                className="text-button helpful"
                disabled={localStorage.getItem("helpful-" + r.id) === "yes"}
                onClick={() => {
                  localStorage.setItem("helpful-" + r.id, "yes");
                  setReviews((x) =>
                    x.map((y) =>
                      y.id === r.id ? { ...y, helpful: y.helpful + 1 } : y,
                    ),
                  );
                }}
              >
                <ThumbsUp size={14} /> Helpful ({r.helpful})
              </button>
            </div>
          </article>
        ))
      ) : (
        <p className="muted review-empty">
          {approved.length
            ? "No reviews match this filter."
            : "Be the first to share a little goodness."}
        </p>
      )}
      {modal && (
        <Modal title="Share your experience" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="form-stack">
            <p className="muted">How was your {p.name.toLowerCase()}?</p>
            <div className="review-star-picker">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  aria-label={`Rate ${n} stars`}
                  key={n}
                  onClick={() => setRating(n)}
                >
                  <Star fill={n <= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <label className="field">
              Your name
              <input name="name" required defaultValue={profile.name} />
            </label>
            <label className="field">
              Give your review a title
              <input name="title" required maxLength={100} />
            </label>
            <label className="field">
              Your experience
              <textarea name="text" required rows={4} minLength={10} />
            </label>
            <label className="field">
              Add a photo or short video (optional)
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 3 * 1024 * 1024) {
                    toast("Please choose a file under 3 MB for this preview.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => setMedia(String(reader.result));
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {media && <Badge>Media attached</Badge>}
            <p className="small muted">
              Reviews are checked before appearing publicly. Purchase
              verification is linked to delivered orders.
            </p>
            <Button type="submit" className="full">
              Submit your review <ArrowRight size={16} />
            </Button>
          </form>
        </Modal>
      )}
    </section>
  );
}
function QuickOrder({
  product: p,
  variant,
}: {
  product: Product;
  variant: string;
}) {
  const { settings, profile, products } = useStore(),
    placeOrder = usePlaceOrder(),
    navigate = useNavigate();
  const [zone, setZone] = useState("Dhaka");
  const totals = cartTotals(
    [{ id: p.id, quantity: 1, variant }],
    products,
    settings,
    zone,
  );
  return (
    <section className="quick-order-section" id="quick-order">
      <div className="container quick-order-inner">
        <div>
          <span className="eyebrow">GOODNESS IS JUST A FEW DETAILS AWAY</span>
          <h2>
            From our hands
            <br />
            to your home.
          </h2>
          <p>
            No account needed. A simple order,
            <br />a confirmation call, and a little care at every step.
          </p>
          <span className="secure-note">
            <ShieldCheck size={17} /> Cash on delivery · No advance payment
          </span>
          <div className="quick-order-selection">
            <img src={p.image} alt="" />
            <div>
              <b>{p.name}</b>
              <span>
                {variant} · {money(totals.subtotal)}
              </span>
            </div>
            <Check size={20} />
          </div>
        </div>
        <form
          className="quick-order-form"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const order = placeOrder({
              customer: String(f.get("name")),
              phone: String(f.get("phone")),
              email: String(f.get("email") || profile.email),
              address: String(f.get("address")),
              zone,
              payment: "Cash on delivery",
              note: "Campaign quick order",
              items: [{ id: p.id, quantity: 1, variant }],
            });
            if (order) navigate(`/order-success/${order.id}`);
          }}
        >
          <h3>Your delivery details</h3>
          <div className="form-grid">
            <label className="field">
              Full name
              <input
                name="name"
                placeholder="How should we address you?"
                defaultValue={profile.name}
                required
              />
            </label>
            <label className="field">
              Mobile number
              <input
                name="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                pattern="(?:\+?88)?01[3-9][0-9]{8}"
                title="Enter a valid Bangladesh mobile number"
                defaultValue={profile.phone}
                required
              />
            </label>
          </div>
          <label className="field">
            Email (optional)
            <input
              name="email"
              type="email"
              placeholder="For order updates"
              defaultValue={profile.email}
            />
          </label>
          <label className="field">
            Delivery address
            <textarea
              name="address"
              rows={2}
              placeholder="House, road, area and district"
              minLength={10}
              required
            />
          </label>
          <label className="field">
            Delivery zone
            <select value={zone} onChange={(e) => setZone(e.target.value)}>
              <option>Dhaka</option>
              <option>Outside Dhaka</option>
            </select>
          </label>
          <div className="summary-line">
            <span>Delivery</span>
            <b>{totals.shipping ? money(totals.shipping) : "On us"}</b>
          </div>
          <label className="check-label terms-label">
            <input type="checkbox" required />
            <span>
              I agree to the <Link to="/page/terms">terms</Link> and{" "}
              <Link to="/page/privacy">privacy policy</Link>.
            </span>
          </label>
          <Button
            type="submit"
            variant="gold"
            className="full"
            disabled={!p.stock || !settings.cod}
          >
            Confirm order · {money(totals.total)} <ArrowRight size={16} />
          </Button>
          {!settings.cod && (
            <p className="field-error">
              Cash on delivery is currently unavailable. Please use the standard
              checkout.
            </p>
          )}
          <p className="small muted center">
            Frontend preview. Orders are saved on this browser; no delivery is
            dispatched.
          </p>
        </form>
      </div>
    </section>
  );
}
export default function ProductPage({
  campaignMode = false,
}: {
  campaignMode?: boolean;
}) {
  const { id } = useParams(),
    s = useStore(),
    navigate = useNavigate();
  const p = s.products.find((p) => p.id === id && p.status === "Published");
  const config = s.campaigns.find((c) => c.productId === id && c.active);
  const campaign =
    campaignMode &&
    !!config &&
    (!config.start || new Date(config.start) <= new Date()) &&
    new Date(config.end) > new Date();
  const [selected, setSelected] = useState(""),
    [quantity, setQuantity] = useState(1),
    [imageIndex, setImageIndex] = useState(0),
    [zoom, setZoom] = useState(false),
    [video, setVideo] = useState(false),
    [tab, setTab] = useState("The details");
  useEffect(() => {
    if (p) {
      setSelected(p.weight);
      setQuantity(1);
      setImageIndex(0);
      s.setRecent((x) => [p.id, ...x.filter((y) => y !== p.id)].slice(0, 20));
      s.track("ViewContent", p.name);
    }
  }, [id]);
  if (!p)
    return (
      <main className="container page-space">
        <Empty
          icon={Leaf}
          title="This good find has moved on."
          text="Discover something else to love in our collection."
          action={
            <Button to="/shop">
              Back to the shop <ArrowRight size={16} />
            </Button>
          }
        />
      </main>
    );
  const variants = productVariants(p).filter((v) =>
    campaign && config?.bundles
      ? ["2 jars", "3 jars", p.weight].includes(v.label)
      : !v.label.includes("jars"),
  );
  const variant = variants.find((v) => v.label === selected) || variants[0],
    price = variant?.price || p.price;
  const gallery = [...new Set([p.image, ...p.images])].filter(Boolean);
  const buy = () => {
    s.addToCart(p.id, quantity, variant.label);
    if (p.stock >= quantity) navigate("/checkout");
  };
  const sections: Record<string, React.ReactNode> = {
    source: (
      <section className="source-story" key="source">
        <div className="container source-story-grid">
          <div>
            <span className="eyebrow">EVERY JAR HAS AN ORIGIN</span>
            <h2>
              From a wild place.
              <br />
              With a little care.
            </h2>
            <p>
              Deep in the Sundarbans, bees follow the rhythm of seasonal
              blossoms. Our honey keeps the character of that landscape: its
              floral aroma, golden colour, and beautiful natural variation.
            </p>
            <div className="batch-info">
              <div>
                <span>ORIGIN</span>
                <b>{p.source}, Bangladesh</b>
              </div>
              <div>
                <span>BATCH</span>
                <b>SH-26-10 · Autumn harvest</b>
              </div>
              <div>
                <span>INGREDIENTS</span>
                <b>100% raw honey. That’s all.</b>
              </div>
            </div>
          </div>
          <div className="source-photo">
            <img
              src="/assets/source.webp"
              alt="Sunlight filtering through a lush green forest"
              loading="lazy"
            />
            <span>
              <MapPin size={14} /> Rooted in nature. Traced to its source.
            </span>
          </div>
        </div>
      </section>
    ),
    trust: (
      <section className="container section campaign-benefits" key="trust">
        <SectionTitle
          eyebrow="SIMPLE REASONS. HONEST GOODNESS."
          title="Just what you want. Nothing you don’t."
        />
        <div className="benefit-grid">
          {[
            [
              Leaf,
              "Naturally full of character",
              "Raw, unfiltered, and beautifully different from batch to batch.",
            ],
            [
              MapPin,
              "A source you can see",
              "Origin and batch details, shared with every jar.",
            ],
            [
              ShieldCheck,
              "Packed with a little care",
              "A sealed glass jar and protective doorstep-ready packaging.",
            ],
            [
              Truck,
              "Easy from here",
              "Simple ordering. Cash on delivery. Across Bangladesh.",
            ],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Leaf;
            return (
              <div key={String(t)}>
                <I size={25} strokeWidth={1.4} />
                <h3>{String(t)}</h3>
                <p>{String(d)}</p>
              </div>
            );
          })}
        </div>
      </section>
    ),
    reviews: <Reviews product={p} key="reviews" />,
    faq: (
      <section className="container section campaign-faq" key="faq">
        <div>
          <span className="eyebrow">A LITTLE CLARITY</span>
          <h2>
            Good questions.
            <br />
            Honest answers.
          </h2>
          <p>
            Still curious?{" "}
            <Link to="/contact" className="text-link">
              We’re here to help <ArrowUpRight size={13} />
            </Link>
          </p>
        </div>
        <Faq campaign />
      </section>
    ),
  };
  return (
    <>
      {campaign &&
        config?.announcementEnabled !== false &&
        config?.announcement && (
          <div className="campaign-announcement">
            {config.announcement}
            <span>
              {" "}
              <Leaf size={13} />
            </span>
          </div>
        )}
      <main>
        <div className="container product-page">
          <Breadcrumb
            items={[
              {
                label: p.category,
                to: `/shop?category=${encodeURIComponent(p.category)}`,
              },
              {
                label: p.subcategory,
                to: `/shop?subcategory=${encodeURIComponent(p.subcategory)}`,
              },
              { label: p.name },
            ]}
          />
          <div
            className={`product-detail ${campaign ? "campaign-detail" : ""}`}
          >
            <div className="gallery">
              <div className="main-product-photo">
                <img
                  src={gallery[imageIndex] || p.image}
                  alt={`${p.name} — view ${imageIndex + 1}`}
                />
                <button
                  className="gallery-zoom icon-btn"
                  aria-label="Zoom product image"
                  onClick={() => setZoom(true)}
                >
                  <ZoomIn size={20} />
                </button>
                <span className="gallery-caption">
                  <Leaf size={13} /> GOODNESS, UP CLOSE.
                </span>
              </div>
              <div className="gallery-thumbnails">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    className={imageIndex === i ? "active" : ""}
                    aria-label={`Product image ${i + 1}`}
                    onClick={() => setImageIndex(i)}
                  >
                    <img src={img} alt={`${p.name} thumbnail ${i + 1}`} />
                  </button>
                ))}
                {p.video && (
                  <button
                    className="video-thumb"
                    aria-label="Play product video"
                    onClick={() => setVideo(true)}
                  >
                    <Play size={22} />
                    Watch the story
                  </button>
                )}
              </div>
            </div>
            <div className="product-purchase">
              <div className="pdp-topline">
                <span className="eyebrow">
                  {campaign
                    ? "THE SUNDARBAN HARVEST EDIT"
                    : p.brand + " · " + p.subcategory}
                </span>
                <button
                  className={`icon-btn ${s.wishlist.includes(p.id) ? "saved" : ""}`}
                  aria-label="Save product to wishlist"
                  onClick={() => s.toggleWish(p.id, variant.label)}
                >
                  <Heart
                    size={21}
                    fill={s.wishlist.includes(p.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>
              {campaign && config?.discount && (
                <Badge tone="warm">{config.label}</Badge>
              )}
              <h1>{campaign ? config?.headline : p.name}</h1>
              {campaign && (
                <h3 className="campaign-product-name">
                  {p.name} · {p.weight}
                </h3>
              )}
              <a className="pdp-rating" href="#reviews">
                <span className="stars">★★★★★</span>
                <b>{p.rating.toFixed(1)}</b>
                <span>({p.reviews} happy customers)</span>
                <span className="verified-inline">
                  <Check size={12} /> Verified goodness
                </span>
              </a>
              <p className="product-description">
                {campaign
                  ? "Raw, unfiltered honey from the wild blossoms of the Sundarbans. Rich in character, full of natural flavour, with absolutely nothing added."
                  : p.description}
              </p>
              <div className="pdp-price">
                <b>{money(price)}</b>
                {p.oldPrice > price && (!campaign || config?.discount) && (
                  <del>{money(p.oldPrice)}</del>
                )}
                {p.oldPrice > price && (!campaign || config?.discount) && (
                  <Badge tone="warm">
                    You save {money(p.oldPrice - price)}
                  </Badge>
                )}
              </div>
              <span className="small muted">
                All prices include applicable taxes.
              </span>
              {campaign && config?.countdown && <Countdown end={config.end} />}
              <div className="variant-section">
                <div className="variant-heading">
                  <strong>
                    {campaign && config?.bundles
                      ? "Choose your little bundle"
                      : "Choose your size"}
                  </strong>
                  <span>{variant.label}</span>
                </div>
                <div
                  className={`variant-options ${campaign ? "bundle-options" : ""}`}
                >
                  {variants.map((v) => (
                    <button
                      key={v.label}
                      className={variant.label === v.label ? "active" : ""}
                      onClick={() => {
                        setSelected(v.label);
                        setQuantity(1);
                      }}
                      disabled={!v.stock}
                    >
                      {v.label === "2 jars" && campaign && (
                        <span className="best-value">MOST LOVED</span>
                      )}
                      <strong>
                        {v.label === p.weight && campaign ? "1 jar" : v.label}
                      </strong>
                      <span>{money(v.price)}</span>
                      {v.label === "2 jars" && (
                        <small>Save {money(p.price * 2 - v.price)}</small>
                      )}
                      {variant.label === v.label && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
              {(!campaign || config?.stock || config?.urgency) && (
                <div className={`stock-message ${p.stock ? "" : "out"}`}>
                  <span />
                  {p.stock
                    ? campaign && config?.urgency
                      ? `Only ${p.stock} jars left in this harvest batch`
                      : `In stock · ${p.stock} available`
                    : "A little pause. Currently out of stock."}
                </div>
              )}
              <div className="pdp-add-row">
                {!campaign && (
                  <Quantity
                    value={quantity}
                    max={Math.min(p.stock, variant.stock)}
                    onChange={setQuantity}
                  />
                )}
                <Button
                  disabled={!p.stock || !variant.stock}
                  className="full"
                  onClick={() =>
                    campaign && config?.quickOrder
                      ? document
                          .getElementById("quick-order")
                          ?.scrollIntoView({ behavior: "smooth" })
                      : (s.addToCart(p.id, quantity, variant.label),
                        s.setDrawer(true))
                  }
                >
                  {campaign && config?.quickOrder
                    ? "Order now · Cash on delivery"
                    : "Add to your bag"}{" "}
                  <ArrowRight size={17} />
                </Button>
              </div>
              {!campaign && (
                <Button
                  variant="outline"
                  className="full buy-now"
                  disabled={!p.stock || !variant.stock}
                  onClick={buy}
                >
                  Buy it now
                </Button>
              )}
              <div className="pdp-assurances">
                <span>
                  <Truck size={17} />
                  <div>
                    <b>A little care, delivered.</b>
                    <small>Dhaka 1–2 days · Nationwide 3–5 days</small>
                  </div>
                </span>
                <span>
                  <ShieldCheck size={17} />
                  <div>
                    <b>Pay when it’s at your door.</b>
                    <small>Cash on delivery · Easy support</small>
                  </div>
                </span>
              </div>
              <div className="pdp-fineprint">
                <span>
                  <Check size={12} />{" "}
                  {campaign ? "No account needed" : "Secure checkout"}
                </span>
                <span>
                  <Check size={12} /> Transparent sourcing
                </span>
                <Link to="/page/returns">
                  Our return promise <ArrowUpRight size={11} />
                </Link>
              </div>
              {!campaign && (
                <p className="small muted">
                  SKU: {variant.sku} · Brand: {p.brand}
                </p>
              )}
            </div>
          </div>
        </div>
        {campaign ? (
          <>
            <div className="campaign-proof">
              <div className="container">
                {[
                  ["1,248+", "Happy orders"],
                  ["4.9 / 5", "A little love from our customers"],
                  ["100% raw", "Nothing added. Nothing hidden."],
                  ["Cash on delivery", "A simpler way to shop"],
                ].map(([v, t]) => (
                  <div key={v}>
                    <b>{v}</b>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {config?.blockOrder.map((key) =>
              (config as any)[key] ? sections[key] : null,
            )}
            {config?.quickOrder && (
              <QuickOrder product={p} variant={variant.label} />
            )}
          </>
        ) : (
          <>
            <section className="container section product-information">
              <div className="detail-tabs">
                {[
                  "The details",
                  "Ingredients & origin",
                  "Delivery & returns",
                ].map((t) => (
                  <button
                    key={t}
                    className={tab === t ? "active" : ""}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="detail-tab-content">
                {tab === "The details" ? (
                  <>
                    <div>
                      <h2>A little more about your good find.</h2>
                      <p>{p.description}</p>
                      <p>
                        Every item is checked and carefully packed by our team.
                        Good things deserve a little attention.
                      </p>
                    </div>
                    <dl>
                      <div>
                        <dt>Brand</dt>
                        <dd>{p.brand}</dd>
                      </div>
                      <div>
                        <dt>Size / weight</dt>
                        <dd>{p.weight}</dd>
                      </div>
                      <div>
                        <dt>Source</dt>
                        <dd>{p.source}</dd>
                      </div>
                      <div>
                        <dt>Product type</dt>
                        <dd>{p.type}</dd>
                      </div>
                      <div>
                        <dt>Good to know</dt>
                        <dd>{p.dietary}</dd>
                      </div>
                      <div>
                        <dt>Colour</dt>
                        <dd>{p.color}</dd>
                      </div>
                    </dl>
                  </>
                ) : tab === "Ingredients & origin" ? (
                  <>
                    <div>
                      <h2>Honest origins. Clear ingredients.</h2>
                      <p>
                        {p.category === "Organic Food"
                          ? `Made with ${p.name.toLowerCase()}. No unnecessary additives. Please check the packaging for allergen and batch information.`
                          : "Considered materials, carefully selected for everyday use. Follow the included care instructions to help your good find last longer."}
                      </p>
                      <Badge>{p.dietary}</Badge>
                    </div>
                    <dl>
                      <div>
                        <dt>Source</dt>
                        <dd>{p.source}</dd>
                      </div>
                      <div>
                        <dt>Batch</dt>
                        <dd>NBR-26-10</dd>
                      </div>
                      <div>
                        <dt>Storage / care</dt>
                        <dd>Cool, dry place. Away from direct sun.</dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <>
                    <div>
                      <h2>Goodness, delivered with care.</h2>
                      <p>
                        Dhaka: 1–2 working days · {money(s.settings.dhaka)}
                        <br />
                        Outside Dhaka: 3–5 working days ·{" "}
                        {money(s.settings.outside)}
                        <br />
                        Free delivery over {money(s.settings.freeShipping)}.
                      </p>
                      <Link to="/page/shipping" className="text-link">
                        Our delivery promise <ArrowUpRight size={14} />
                      </Link>
                    </div>
                    <div>
                      <h3>A little reassurance.</h3>
                      <p>
                        Received a damaged or incorrect item? Contact us within
                        48 hours with your order number and photos. Our team
                        will make it right.
                      </p>
                      <Link to="/page/returns" className="text-link">
                        Returns & refunds <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </section>
            <Reviews product={p} />
            <section className="container section">
              <SectionTitle
                eyebrow="A LITTLE BETTER TOGETHER"
                title="Make it a good little bundle."
              />
              <div className="together-row">
                {[
                  p,
                  ...s.products
                    .filter(
                      (x) =>
                        x.category === p.category &&
                        x.id !== p.id &&
                        x.stock > 0,
                    )
                    .slice(0, 2),
                ].map((x, i) => (
                  <div key={x.id}>
                    {i > 0 && <Plus size={20} />}
                    <img src={x.image} alt={x.name} />
                    <span>
                      <b>{x.name}</b>
                      <small>{money(x.price)}</small>
                    </span>
                    <label>
                      <input
                        type="checkbox"
                        aria-label={`Include ${x.name} in bundle`}
                        defaultChecked
                        data-bundle={x.id}
                      />
                    </label>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    document
                      .querySelectorAll<HTMLInputElement>(
                        "[data-bundle]:checked",
                      )
                      .forEach((el) => s.addToCart(el.dataset.bundle!));
                    s.setDrawer(true);
                  }}
                >
                  Add selected to bag <ShoppingBag size={16} />
                </Button>
              </div>
            </section>
          </>
        )}
        <section className="container section">
          <SectionTitle
            eyebrow="A FEW MORE GOOD FINDS"
            title="A little more your kind of good."
            link={`/shop?category=${encodeURIComponent(p.category)}`}
            label="Explore the collection"
          />
          <div className="product-grid four">
            {s.products
              .filter(
                (x) =>
                  x.id !== p.id &&
                  x.status === "Published" &&
                  (x.category === p.category || x.stock > 0),
              )
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      </main>
      {campaign && config?.sticky && (
        <div className="sticky-order">
          <div className="container">
            <img src={p.image} alt="" />
            <div>
              <b>{p.name}</b>
              <span>
                {variant.label} · {money(price)}
              </span>
            </div>
            <Button
              disabled={!p.stock}
              onClick={() =>
                config?.quickOrder
                  ? document
                      .getElementById("quick-order")
                      ?.scrollIntoView({ behavior: "smooth" })
                  : (s.addToCart(p.id, 1, variant.label), s.setDrawer(true))
              }
            >
              A little goodness, please <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}
      {zoom && (
        <Modal
          title={p.name + " — a closer look"}
          onClose={() => setZoom(false)}
          wide
        >
          <img
            className="zoomed-product"
            src={gallery[imageIndex]}
            alt={p.name}
          />
        </Modal>
      )}
      {video && p.video && (
        <Modal title="The product story" onClose={() => setVideo(false)} wide>
          <video className="product-video" controls autoPlay src={p.video} />
        </Modal>
      )}
    </>
  );
}
