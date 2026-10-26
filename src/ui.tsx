import { descendants } from "./category-tree";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Leaf,
  Truck,
  ShieldCheck,
  PackageCheck,
  Plus,
  Minus,
  Check,
  Mail,
  Instagram,
  Facebook,
  MoveUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { useStore, cartTotals } from "./store";
import { money, itemPrice } from "./data";
import type { Product } from "./data";
export function Button({
  children,
  to,
  onClick,
  variant = "",
  className = "",
  ...props
}: {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: string;
  className?: string;
  [key: string]: any;
}) {
  return to ? (
    <Link className={`btn ${variant} ${className}`} to={to} {...props}>
      {children}
    </Link>
  ) : (
    <button
      className={`btn ${variant} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  link,
  label = "Explore all",
}: {
  eyebrow?: string;
  title: string;
  link?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {link && (
        <Link className="text-link" to={link}>
          {label}
          <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
export function Badge({
  children,
  tone = "",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function Empty({
  icon: Icon = ShoppingBag,
  title,
  text,
  action,
}: {
  icon?: any;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon size={30} strokeWidth={1.3} />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const nodes = Array.from(
          ref.current.querySelectorAll<HTMLElement>(
            'button,input,select,textarea,a[href],[tabindex="0"]',
          ),
        ).filter((x) => !x.hasAttribute("disabled"));
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button
            className="icon-btn"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function Quantity({
  value,
  onChange,
  max = 99,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div className="quantity">
      <button
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </button>
      <span>{value}</span>
      <button
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
export function ProductCard({
  product: p,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { wishlist, toggleWish, addToCart, notes } = useStore();
  const location = useLocation();
  const savedView = location.pathname.endsWith("/wishlist");
  const variant = savedView
    ? notes["wish-variant-" + p.id] || p.weight
    : p.weight;
  const displayPrice = savedView ? itemPrice(p, variant) : p.price;
  return (
    <article className={`product-card ${compact ? "compact" : ""}`}>
      <div className="product-photo">
        <Link
          to={p.campaign ? `/campaign/${p.id}` : `/product/${p.id}`}
          aria-label={`View ${p.name}`}
        >
          <img src={p.image} alt={p.name} loading="lazy" />
        </Link>
        {p.badge && <Badge tone={p.oldPrice ? "warm" : ""}>{p.badge}</Badge>}
        <button
          className={`wish-btn ${wishlist.includes(p.id) ? "saved" : ""}`}
          aria-label={`${wishlist.includes(p.id) ? "Remove" : "Save"} ${p.name} ${wishlist.includes(p.id) ? "from" : "to"} wishlist`}
          onClick={() => toggleWish(p.id)}
        >
          <Heart
            size={17}
            fill={wishlist.includes(p.id) ? "currentColor" : "none"}
          />
        </button>
        <button
          className="quick-add"
          disabled={p.stock === 0}
          onClick={() => addToCart(p.id, 1, variant)}
        >
          <Plus size={16} />
          {p.stock ? "Quick add" : "Out of stock"}
        </button>
      </div>
      <div className="product-info">
        <div className="product-meta">
          <span>{p.subcategory}</span>
          <span className="rating">
            ★ <b>{p.rating.toFixed(1)}</b>
          </span>
        </div>
        <Link
          className="product-name"
          to={p.campaign ? `/campaign/${p.id}` : `/product/${p.id}`}
        >
          {p.name}
        </Link>
        {savedView && (
          <div className="wishlist-variant">
            <span>{variant}</span>
            {Number(notes["wish-price-" + p.id]) > displayPrice && (
              <span>
                Price dropped{" "}
                {money(Number(notes["wish-price-" + p.id]) - displayPrice)}
              </span>
            )}
            {!p.stock && <span>Awaiting a refill</span>}
          </div>
        )}
        <div className="product-bottom">
          <span className="price">
            {money(displayPrice)}{" "}
            {p.oldPrice > displayPrice && <del>{money(p.oldPrice)}</del>}
          </span>
          <span className="muted small">{variant}</span>
          <button
            className="mobile-add icon-btn"
            aria-label={`Add ${p.name} to bag`}
            disabled={!p.stock}
            onClick={() => addToCart(p.id)}
          >
            <Plus size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
export function Header() {
  const { cart, wishlist, setDrawer, categories, products, settings, track } =
    useStore();
  const [menu, setMenu] = useState(false),
    [mega, setMega] = useState(false),
    [search, setSearch] = useState(""),
    [focused, setFocused] = useState(false);
  const location = useLocation(),
    navigate = useNavigate();
  const searchBox = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMenu(false);
    setMega(false);
    setFocused(false);
    setSearch("");
  }, [location.pathname, location.search]);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (searchBox.current && !searchBox.current.contains(e.target as Node))
        setFocused(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const matches = products
    .filter(
      (p) =>
        p.status === "Published" &&
        (p.name + " " + p.subcategory)
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .slice(0, 4);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    track("Search", search);
    navigate(`/shop?q=${encodeURIComponent(search)}`);
    setFocused(false);
  };
  return (
    <>
      <div className="announcement">
        <div className="container">
          <span>
            <Leaf size={12} /> Thoughtfully sourced. Naturally better.
          </span>
          <span className="announcement-center">
            Free delivery on orders over {money(settings.freeShipping)}{" "}
            <span className="tiny-dot" /> Cash on delivery available
          </span>
          <div>
            <Link to="/track">Track your order</Link>
            <Link to="/help">Help</Link>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-main">
          <button
            className="icon-btn mobile-menu"
            aria-label="Open menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <Link to="/" className="wordmark" aria-label="Nirbhor home">
            {settings.name}
            <span className="brand-leaf">
              <Leaf size={15} />
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <div onMouseEnter={() => setMega(true)}>
              <button
                className={mega ? "nav-active" : ""}
                onClick={() => setMega(!mega)}
                aria-expanded={mega}
              >
                Shop <ChevronDown size={12} />
              </button>
            </div>
            <NavLink to="/shop?category=Organic+Food">Organic food</NavLink>
            <NavLink to="/shop?category=Home+%26+Living">Home & living</NavLink>
            <Link to="/offers" className="offers-link">
              Offers
              <span />
            </Link>
          </nav>
          <div className="header-search" ref={searchBox}>
            <form onSubmit={submit}>
              <Search size={17} />
              <input
                aria-label="Search products"
                placeholder="Search for a little goodness…"
                value={search}
                onFocus={() => setFocused(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setFocused(true);
                }}
              />
              <kbd>⌘ K</kbd>
            </form>
            {focused && (
              <div className="search-popover">
                <div className="popover-label">
                  {search ? "A few good finds" : "Popular searches"}
                </div>
                {!search ? (
                  <div className="search-chips">
                    {["Raw honey", "Mixed nuts", "Tea", "Home"].map((x) => (
                      <Link key={x} to={`/shop?q=${x}`}>
                        <Search size={12} />
                        {x}
                      </Link>
                    ))}
                  </div>
                ) : matches.length ? (
                  matches.map((p) => (
                    <Link
                      className="search-item"
                      key={p.id}
                      to={p.campaign ? `/campaign/${p.id}` : `/product/${p.id}`}
                    >
                      <img src={p.image} alt="" />
                      <div>
                        {p.name}
                        <small>{p.weight}</small>
                      </div>
                      <b>{money(p.price)}</b>
                    </Link>
                  ))
                ) : (
                  <p className="small muted">
                    No exact matches. Try a category or view suggestions.
                  </p>
                )}
                <Link
                  className="text-link"
                  to={`/shop?q=${encodeURIComponent(search)}`}
                >
                  See all results <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
          <div className="header-actions">
            <Link
              className="icon-btn account-icon"
              to="/account"
              aria-label="My account"
            >
              <UserRound size={20} />
            </Link>
            <Link className="icon-btn" to="/wishlist" aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="count">{wishlist.length}</span>
              )}
            </Link>
            <button
              className="icon-btn bag-icon"
              aria-label="Open shopping bag"
              onClick={() => setDrawer(true)}
            >
              <ShoppingBag size={20} />
              <span className="count">
                {cart.reduce((s, x) => s + x.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
        {mega && (
          <div className="mega-menu" onMouseLeave={() => setMega(false)}>
            <div className="container mega-content">
              {categories
                .filter((c) => !c.parent && c.active)
                .slice(0, 4)
                .map((c) => (
                  <div key={c.id}>
                    <Link
                      className="mega-title"
                      to={`/shop?category=${encodeURIComponent(c.name)}`}
                    >
                      {c.name}
                      <ArrowUpRight size={14} />
                    </Link>
                    {categories
                      .filter(
                        (x) =>
                          descendants(categories, c.name).has(x.name) &&
                          x.active,
                      )
                      .map((x) => (
                        <Link
                          key={x.id}
                          to={`/shop?category=${encodeURIComponent(c.name)}&subcategory=${encodeURIComponent(x.name)}`}
                        >
                          {x.name}
                        </Link>
                      ))}
                    {!categories.some((x) => x.parent === c.name) &&
                      [
                        "Explore collection",
                        "New arrivals",
                        "Thoughtful favourites",
                      ].map((x, i) => (
                        <Link
                          key={x}
                          to={`/shop?category=${encodeURIComponent(c.name)}${i === 1 ? "&collection=new" : ""}`}
                        >
                          {x}
                        </Link>
                      ))}
                  </div>
                ))}
              <Link className="mega-feature" to="/campaign/p1">
                <Leaf size={24} />
                <strong>The harvest edit</strong>
                <span>Good things, in season.</span>
                <span className="text-link">
                  Discover the story <ArrowRight size={15} />
                </span>
              </Link>
            </div>
          </div>
        )}
      </header>
      {menu && (
        <div className="mobile-nav">
          <form onSubmit={submit} className="search-field">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              aria-label="Mobile search"
            />
          </form>
          {[
            { name: "Shop all", path: "/shop" },
            ...categories
              .filter((c) => !c.parent && c.active)
              .map((c) => ({
                name: c.name,
                path: `/shop?category=${encodeURIComponent(c.name)}`,
              })),
            { name: "Offers & collections", path: "/offers" },
            { name: "My account", path: "/account" },
            { name: "Track order", path: "/track" },
            { name: "Store admin", path: "/admin" },
          ].map((x) => (
            <Link key={x.path} to={x.path}>
              {x.name}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
export function TrustStrip() {
  const { content } = useStore();
  return (
    <div className="trust-strip container">
      {[
        {
          icon: Leaf,
          title: "Honest ingredients",
          text: "Nothing to hide. Nothing extra.",
        },
        {
          icon: PackageCheck,
          title: "Thoughtfully sourced",
          text: "Good origins. Better everyday.",
        },
        {
          icon: Truck,
          title: "Delivered with care",
          text: "All across Bangladesh.",
        },
        {
          icon: ShieldCheck,
          title: "Shop with confidence",
          text: "Cash on delivery available.",
        },
      ].map((x, i) => (
        <div key={x.title}>
          <x.icon size={25} strokeWidth={1.4} />
          <div>
            <strong>{content[`trust-heading-${i}`] || x.title}</strong>
            <span>{content[`trust-text-${i}`] || x.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
export function Newsletter() {
  const { toast, settings, content } = useStore();
  const [email, setEmail] = useState("");
  if (!settings.newsletter) return null;
  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <div className="newsletter-icon">
          <Mail size={29} strokeWidth={1.3} />
        </div>
        <div>
          <span className="eyebrow">A GOOD THING IN YOUR INBOX</span>
          <h2>{content.newsletter || "Stay close to the good stuff."}</h2>
          <p>
            Fresh arrivals, thoughtful stories, and a little something just for
            you.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const saved = JSON.parse(
              localStorage.getItem("nirbhor-subscribers") || "[]",
            );
            localStorage.setItem(
              "nirbhor-subscribers",
              JSON.stringify([...new Set([...saved, email])]),
            );
            toast("You’re on the list. Welcome to the good stuff!");
            setEmail("");
          }}
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button aria-label="Subscribe to newsletter">
            <ArrowRight size={21} />
          </button>
        </form>
      </div>
    </section>
  );
}
export function Footer() {
  const { settings } = useStore();
  return (
    <>
      <Newsletter />
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/" className="wordmark">
              {settings.name}
              <Leaf size={15} />
            </Link>
            <p>
              A little goodness, every day.
              <br />
              For your pantry, your home,
              <br />
              and the life in between.
            </p>
            <div className="socials">
              <a
                href={settings.social}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <Facebook size={17} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            {[
              ["Shop all", "/shop"],
              ["Organic food", "/shop?category=Organic+Food"],
              ["Home & living", "/shop?category=Home+%26+Living"],
              ["Beauty & care", "/shop?category=Beauty+%26+Care"],
              ["Offers & bundles", "/offers"],
            ].map(([t, u]) => (
              <Link to={u} key={t}>
                {t}
              </Link>
            ))}
          </div>
          <div>
            <h4>Here to help</h4>
            {[
              ["Track your order", "/track"],
              ["Delivery & shipping", "/page/shipping"],
              ["Returns & refunds", "/page/returns"],
              ["Frequently asked questions", "/help"],
              ["Contact us", "/contact"],
            ].map(([t, u]) => (
              <Link to={u} key={t}>
                {t}
              </Link>
            ))}
          </div>
          <div>
            <h4>A little about us</h4>
            {[
              ["Our story", "/about"],
              ["Our sourcing promise", "/page/sourcing"],
              ["Privacy policy", "/page/privacy"],
              ["Terms & conditions", "/page/terms"],
              ["Store admin ↗", "/admin"],
            ].map(([t, u]) => (
              <Link to={u} key={t}>
                {t}
              </Link>
            ))}
          </div>
          <div className="footer-contact">
            <h4>Let’s talk goodness.</h4>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
            <a href={`tel:${settings.phone}`}>{settings.phone}</a>
            <p>
              Saturday–Thursday, 9am–6pm
              <br />
              {settings.address}
            </p>
            <Badge>Made for everyday Bangladesh</Badge>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} {settings.name}. Thoughtfully, always.
          </span>
          <span className="payment-marks">
            <span>CASH ON DELIVERY</span>
            <b>bKash</b>
            <b>VISA</b>
            <span>◉ Mastercard</span>
          </span>
          <span>Good choices. Good living.</span>
        </div>
      </footer>
    </>
  );
}
export function CartDrawer() {
  const s = useStore(),
    { drawer, setDrawer, cart, setCart, products, settings } = s;
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!drawer) return;
    const previous = document.activeElement as HTMLElement,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
      if (e.key === "Tab" && drawerRef.current) {
        const nodes = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            "button:not(:disabled),a[href],input,select",
          ),
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [drawer]);
  if (!drawer) return null;
  const total = cartTotals(cart, products, settings);
  return (
    <div
      className="drawer-backdrop"
      onClick={(e) => e.target === e.currentTarget && setDrawer(false)}
    >
      <aside
        ref={drawerRef}
        className="cart-drawer"
        role="dialog"
        aria-label="Shopping bag"
        aria-modal="true"
        onKeyDown={(e) => e.key === "Escape" && setDrawer(false)}
      >
        <div className="drawer-head">
          <h2>
            Your bag <span>({cart.reduce((n, x) => n + x.quantity, 0)})</span>
          </h2>
          <button
            className="icon-btn"
            autoFocus
            aria-label="Close bag"
            onClick={() => setDrawer(false)}
          >
            <X />
          </button>
        </div>
        {cart.length ? (
          <>
            <div className="shipping-progress">
              <Truck size={18} />
              <span>
                {total.subtotal >= settings.freeShipping ? (
                  "Your order qualifies for free delivery!"
                ) : (
                  <>
                    You’re{" "}
                    <b>{money(settings.freeShipping - total.subtotal)}</b> away
                    from free delivery.
                  </>
                )}
              </span>
              <progress
                value={Math.min(total.subtotal, settings.freeShipping)}
                max={settings.freeShipping}
              />
            </div>
            <div className="drawer-items">
              {cart.map((item, i) => {
                const p = products.find((p) => p.id === item.id);
                if (!p) return null;
                return (
                  <div className="bag-item" key={p.id + item.variant}>
                    <Link
                      to={`/product/${p.id}`}
                      onClick={() => setDrawer(false)}
                    >
                      <img src={p.image} alt={p.name} />
                    </Link>
                    <div>
                      <strong>{p.name}</strong>
                      <span className="small muted">{item.variant}</span>
                      <Quantity
                        value={item.quantity}
                        max={p.stock}
                        onChange={(n) =>
                          setCart((x) =>
                            x.map((y, j) =>
                              i === j ? { ...y, quantity: n } : y,
                            ),
                          )
                        }
                      />
                    </div>
                    <div>
                      <b>{money(itemPrice(p, item.variant) * item.quantity)}</b>
                      <button
                        className="text-button small muted"
                        onClick={() =>
                          setCart((x) => x.filter((_, j) => j !== i))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="drawer-bottom">
              <div className="summary-line">
                <b>Subtotal</b>
                <b>{money(total.subtotal)}</b>
              </div>
              <p className="small muted">
                Delivery and discounts calculated at checkout.
              </p>
              <Button
                className="full"
                onClick={() => {
                  setDrawer(false);
                  navigate("/checkout");
                }}
              >
                Continue to checkout <ArrowRight size={17} />
              </Button>
              <Button
                className="full"
                variant="outline"
                onClick={() => {
                  setDrawer(false);
                  navigate("/cart");
                }}
              >
                View your bag
              </Button>
              <span className="secure-note">
                <ShieldCheck size={14} /> A little care, from checkout to
                doorstep.
              </span>
            </div>
          </>
        ) : (
          <Empty
            title="A little empty, for now."
            text="Good things are waiting to be discovered."
            action={
              <Button
                onClick={() => {
                  setDrawer(false);
                  navigate("/shop");
                }}
              >
                Explore the shop <ArrowRight size={16} />
              </Button>
            }
          />
        )}
      </aside>
    </div>
  );
}
export function Breadcrumb({
  items,
}: {
  items: { label: string; to?: string }[];
}) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((x, i) => (
        <span key={i}>
          <ChevronRight size={12} />
          {x.to ? <Link to={x.to}>{x.label}</Link> : x.label}
        </span>
      ))}
    </nav>
  );
}
