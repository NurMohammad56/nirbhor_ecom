import { descendants } from "./category-tree";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Bell,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Copy,
  CreditCard,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  FolderTree,
  Globe,
  HelpCircle,
  Image,
  Layers,
  Leaf,
  Link2,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Package,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  Shield,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  CategoriesAdmin,
  InventoryAdmin,
  OrdersAdmin,
  CustomersAdmin,
  DiscountsAdmin,
  CampaignsAdmin,
  BannersAdmin,
  ReviewsAdmin,
  ContentAdmin,
  AnalyticsAdmin,
  PixelAdmin,
  SettingsAdmin,
  TeamAdmin,
} from "./AdminMore";
import { useStore } from "./store";
import { Badge, Button, Empty, Modal } from "./ui";
import {
  itemPrice,
  money,
  productVariants,
  statusSteps,
  uid,
  variantUnits,
  seedProducts,
} from "./data";
import type {
  Banner,
  Campaign,
  Category,
  Coupon,
  Order,
  Product,
  Review,
  Settings,
} from "./data";
const navGroups: {
  label: string;
  items: [string, string, typeof Package][];
}[] = [
  {
    label: "WORKSPACE",
    items: [
      ["Overview", "/admin", Layers],
      ["Orders", "/admin/orders", ShoppingBag],
      ["Products", "/admin/products", Package],
      ["Categories", "/admin/categories", FolderTree],
      ["Inventory", "/admin/inventory", Box],
      ["Customers", "/admin/customers", Users],
    ],
  },
  {
    label: "GROW YOUR STORE",
    items: [
      ["Campaigns", "/admin/campaigns", Sparkles],
      ["Discounts", "/admin/discounts", Tag],
      ["Reviews", "/admin/reviews", Star],
      ["Banners & sliders", "/admin/banners", Image],
      ["Content", "/admin/content", FileText],
      ["Analytics", "/admin/analytics", BarChart3],
      ["Meta Pixel", "/admin/pixel", Activity],
    ],
  },
  {
    label: "PREFERENCES",
    items: [
      ["Settings", "/admin/settings", SettingsIcon],
      ["Roles & permissions", "/admin/team", Shield],
    ],
  },
];
export function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    let text = String(v ?? "");
    if (/^[=+@\-]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  const data =
    "\uFEFF" +
    [
      keys.map(escape).join(","),
      ...rows.map((r) => keys.map((k) => escape(r[k])).join(",")),
    ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([data], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="toggle-row">
      <span>
        <b>{label}</b>
        {description && <small>{description}</small>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-track" />
    </label>
  );
}
export function Stat({
  label,
  value,
  change,
  icon: Icon = TrendingUp,
  caption,
}: {
  label: string;
  value: string;
  change?: string;
  icon?: any;
  caption?: string;
}) {
  return (
    <div className="stat-card">
      <div>
        <span>{label}</span>
        <Icon size={17} />
      </div>
      <strong>{value}</strong>
      <p>
        {change && (
          <span>
            <ArrowUpRight size={13} />
            {change}
          </span>
        )}
        {caption || "vs. previous period"}
      </p>
    </div>
  );
}
export function AdminTitle({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow?: string;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="admin-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <div className="admin-title-actions">{children}</div>
    </div>
  );
}
export function Panel({
  title,
  subtitle,
  children,
  action,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`admin-panel ${className}`}>
      <div className="panel-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
export default function Admin() {
  const { profile, orders, products, reviews } = useStore(),
    location = useLocation();
  const [mobile, setMobile] = useState(false),
    [notifications, setNotifications] = useState(false);
  useEffect(() => setMobile(false), [location.pathname]);
  const section = location.pathname.split("/")[2] || "overview";
  const pageTitle =
    navGroups
      .flatMap((g) => g.items)
      .find((x) => x[1] === location.pathname)?.[0] || "Overview";
  const low = products.filter((p) => p.stock < 10);
  return (
    <div className="admin-app">
      <aside className={`admin-sidebar ${mobile ? "open" : ""}`}>
        <Link to="/" className="wordmark">
          NIRBHOR
          <Leaf size={14} />
        </Link>
        <div className="workspace-picker">
          <span className="workspace-avatar">
            <Leaf size={18} />
          </span>
          <div>
            <b>Nirbhor Commerce</b>
            <span>Preview workspace</span>
          </div>
          <ChevronDown size={14} />
        </div>
        <nav>
          {navGroups.map((g) => (
            <div className="admin-nav-group" key={g.label}>
              <span>{g.label}</span>
              {g.items.map(([label, url, Icon]) => (
                <NavLink to={url} key={url} end={url === "/admin"}>
                  <Icon size={17} />
                  <span>{label}</span>
                  {label === "Orders" && (
                    <small>
                      {orders.filter((o) => o.status === "Placed").length || 4}
                    </small>
                  )}
                  {label === "Reviews" &&
                    reviews.some((r) => r.status === "Pending") && <i />}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/" className="visit-store">
            <Globe size={17} />
            Visit your store
            <ArrowUpRight size={15} />
          </Link>
          <div className="admin-profile">
            <span>NR</span>
            <div>
              <b>Nur Rahman</b>
              <small>Store owner</small>
            </div>
            <Link to="/admin/settings" aria-label="Store settings">
              <SettingsIcon size={16} />
            </Link>
          </div>
        </div>
      </aside>
      {mobile && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobile(false)}
        />
      )}
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <button
              className="icon-btn mobile-only"
              aria-label="Open admin menu"
              onClick={() => setMobile(!mobile)}
            >
              <Menu size={21} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={13} />
            <b>{pageTitle}</b>
          </div>
          <div>
            <Badge>Frontend preview</Badge>
            <Link className="text-link" to="/" target="_blank">
              View store <ExternalLink size={13} />
            </Link>
            <div className="admin-notifications">
              <button
                className="icon-btn notification-bell"
                aria-label="Admin notifications"
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={19} />
                <i />
              </button>
              {notifications && (
                <div className="admin-notification-popover">
                  <h3>A little store update.</h3>
                  <Link
                    to="/admin/orders"
                    onClick={() => setNotifications(false)}
                  >
                    <ShoppingBag size={17} />
                    <span>
                      {orders.filter((o) => o.status === "Placed").length}{" "}
                      orders waiting for a little care.
                    </span>
                  </Link>
                  <Link
                    to="/admin/inventory"
                    onClick={() => setNotifications(false)}
                  >
                    <Box size={17} />
                    <span>{low.length} products running a little low.</span>
                  </Link>
                  <Link
                    to="/admin/reviews"
                    onClick={() => setNotifications(false)}
                  >
                    <Star size={17} />
                    <span>
                      {reviews.filter((r) => r.status === "Pending").length}{" "}
                      reviews ready for moderation.
                    </span>
                  </Link>
                </div>
              )}
            </div>
            <span className="topbar-avatar">NR</span>
          </div>
        </header>
        <main className="admin-content">
          {section === "overview" ? (
            <Overview />
          ) : section === "products" ? (
            <ProductsAdmin />
          ) : section === "categories" ? (
            <CategoriesAdmin />
          ) : section === "inventory" ? (
            <InventoryAdmin />
          ) : section === "orders" ? (
            <OrdersAdmin />
          ) : section === "customers" ? (
            <CustomersAdmin />
          ) : section === "discounts" ? (
            <DiscountsAdmin />
          ) : section === "campaigns" ? (
            <CampaignsAdmin />
          ) : section === "banners" ? (
            <BannersAdmin />
          ) : section === "reviews" ? (
            <ReviewsAdmin />
          ) : section === "content" ? (
            <ContentAdmin />
          ) : section === "analytics" ? (
            <AnalyticsAdmin />
          ) : section === "pixel" ? (
            <PixelAdmin />
          ) : section === "team" ? (
            <TeamAdmin />
          ) : (
            <SettingsAdmin />
          )}
          <div className="admin-footer">
            <span>
              NIRBHOR Commerce <span>·</span> A little care, behind the scenes.
            </span>
            <span>
              All changes saved to this browser <span className="saved-dot" />
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}
export function SalesChart({ period = "7" }: { period?: string }) {
  const [hover, setHover] = useState(-1);
  const values =
    period === "7"
      ? [37, 46, 40, 68, 55, 91, 76]
      : period === "30"
        ? [25, 40, 31, 54, 47, 67, 51, 78, 65, 86, 73, 95]
        : [22, 31, 45, 37, 50, 44, 62, 59, 73, 69, 89, 98];
  return (
    <div className="sales-chart">
      <div className="chart-y">
        <span>৳150k</span>
        <span>৳100k</span>
        <span>৳50k</span>
        <span>৳0</span>
      </div>
      <div className="chart-plot">
        <div className="chart-gridlines">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="chart-bars">
          {values.map((v, i) => (
            <div
              className="chart-bar-column"
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
            >
              <div
                style={{ height: v + "%" }}
                className={i === values.length - 2 ? "highlight" : ""}
              >
                {hover === i && (
                  <span className="chart-tooltip">{money(v * 1500)}</span>
                )}
              </div>
              <span>
                {period === "7"
                  ? ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"][i]
                  : period === "30"
                    ? `${i * 2 + 1} Oct`
                    : `W${i + 1}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Overview() {
  const s = useStore(),
    { orders, products } = s;
  const [period, setPeriod] = useState("7");
  const total = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((n, o) => n + o.total, 0);
  return (
    <>
      <AdminTitle
        eyebrow="MONDAY, OCTOBER 26, 2026"
        title="A good day to grow, Nur."
        text="Here’s a little look at what’s happening in your store."
      >
        <select
          aria-label="Dashboard period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <Button to="/admin/products?new=1">
          <Plus size={16} />
          Add product
        </Button>
      </AdminTitle>
      <div className="admin-overview-notice">
        <span>
          <Sparkles size={16} />
          <b>Your store, at a glance.</b> Live local records meet sample
          performance data.
        </span>
        <Link to="/" target="_blank">
          Preview storefront <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="stats-grid">
        <Stat
          label="Total revenue"
          value={money(total)}
          change="12.8%"
          icon={TrendingUp}
          caption="local order records"
        />
        <Stat
          label="Total orders"
          value={String(orders.length)}
          change="8.4%"
          icon={ShoppingBag}
          caption="in your preview store"
        />
        <Stat
          label="Conversion rate"
          value={period === "7" ? "3.84%" : period === "30" ? "3.62%" : "3.41%"}
          change="0.6%"
          icon={MousePointerIcon}
          caption="sample performance"
        />
        <Stat
          label="Average order value"
          value={money(total / Math.max(1, orders.length))}
          change="4.2%"
          icon={Users}
          caption="local order records"
        />
      </div>
      <div className="dashboard-main-grid">
        <Panel
          title="A little growth, every day."
          subtitle="Sales performance · sample chart"
          action={
            <div className="chart-legend">
              <span />
              Revenue <span />
              Previous period
            </div>
          }
          className="sales-panel"
        >
          <div className="sales-chart-total">
            <strong>
              {money(
                period === "7" ? 128420 : period === "30" ? 542180 : 1684200,
              )}
            </strong>
            <Badge>↗ 12.8% this period</Badge>
          </div>
          <SalesChart period={period} />
        </Panel>
        <Panel
          title="Your store’s pulse."
          subtitle="A few things to keep an eye on."
          className="store-pulse"
        >
          <div className="pulse-score">
            <span>
              <Activity size={27} />
            </span>
            <div>
              <b>Looking good.</b>
              <small>Everything in its little place.</small>
            </div>
          </div>
          {[
            [
              "Orders to confirm",
              orders.filter((o) => o.status === "Placed").length,
              "/admin/orders",
            ],
            [
              "Running a little low",
              products.filter((p) => p.stock > 0 && p.stock < 10).length,
              "/admin/inventory",
            ],
            [
              "Reviews to read",
              s.reviews.filter((r) => r.status === "Pending").length,
              "/admin/reviews",
            ],
          ].map(([t, n, u]) => (
            <Link key={String(t)} to={String(u)}>
              <span>{t}</span>
              <b>{n}</b>
              <ChevronRight size={14} />
            </Link>
          ))}
          <div className="pulse-pixel">
            <span className="small">META PIXEL</span>
            <Badge tone="neutral">Local preview</Badge>
            <p>
              Events are collected locally.
              <br />
              Connect tracking in the backend phase.
            </p>
            <Link className="text-link" to="/admin/pixel">
              View event activity <ArrowUpRight size={13} />
            </Link>
          </div>
        </Panel>
      </div>
      <div className="dashboard-bottom-grid">
        <Panel
          title="Fresh from the checkout."
          subtitle="Your most recent orders."
          action={
            <Link className="text-link" to="/admin/orders">
              All orders <ArrowUpRight size={14} />
            </Link>
          }
        >
          <RecentOrders orders={orders.slice(0, 5)} />
        </Panel>
        <Panel
          title="A few crowd favourites."
          subtitle="Sample product performance"
          action={
            <Link
              className="icon-btn"
              to="/admin/analytics"
              aria-label="Product performance"
            >
              <ArrowUpRight size={17} />
            </Link>
          }
        >
          <div className="top-products">
            {products.slice(0, 4).map((p, i) => (
              <div key={p.id}>
                <span className="rank">0{i + 1}</span>
                <img src={p.image} alt="" />
                <div>
                  <strong>{p.name}</strong>
                  <span>{p.reviews} sample sales</span>
                </div>
                <b>{money(p.price * p.reviews)}</b>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="admin-quick-links">
        {[
          [
            Package,
            "Grow your catalogue",
            "Add something good to the shelves.",
            "/admin/products",
          ],
          [
            Sparkles,
            "Plan a little campaign",
            "Give your good finds a moment.",
            "/admin/campaigns",
          ],
          [
            FileText,
            "Make it your story",
            "Fine-tune the words on your storefront.",
            "/admin/content",
          ],
        ].map(([I, t, d, u]) => {
          const Icon = I as typeof Package;
          return (
            <Link to={String(u)} key={String(t)}>
              <span>
                <Icon size={22} />
              </span>
              <div>
                <h4>{String(t)}</h4>
                <p>{String(d)}</p>
              </div>
              <ArrowUpRight size={17} />
            </Link>
          );
        })}
      </div>
    </>
  );
}
const MousePointerIcon = TrendingUp;
function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="table-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <Link to={`/admin/orders?order=${o.id}`} className="order-id">
                  #{o.id}
                </Link>
                <small>
                  {new Date(o.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </small>
              </td>
              <td>{o.customer}</td>
              <td>
                <Status value={o.status} />
              </td>
              <td>
                <b>{money(o.total)}</b>
              </td>
              <td>
                <Link
                  to={`/admin/orders?order=${o.id}`}
                  aria-label={`Open ${o.id}`}
                >
                  <ArrowUpRight size={15} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function Status({ value }: { value: string }) {
  return (
    <span
      className={`status-pill ${["Cancelled", "Out of stock", "Rejected", "Archived"].includes(value) ? "red" : ["Placed", "Pending", "Low stock", "Draft", "Return requested"].includes(value) ? "amber" : ["Shipped", "Processing", "Packed"].includes(value) ? "blue" : ""}`}
    >
      <i />
      {value}
    </span>
  );
}

function ProductsAdmin() {
  const s = useStore(),
    { products, categories } = s,
    location = useLocation();
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("All products"),
    [category, setCategory] = useState(""),
    [edit, setEdit] = useState<Product | "new" | undefined>(
      new URLSearchParams(location.search).get("new") ? "new" : undefined,
    ),
    [remove, setRemove] = useState<Product>(),
    [selected, setSelected] = useState<string[]>([]),
    [importOpen, setImportOpen] = useState(false),
    [page, setPage] = useState(1);
  const filtered = products.filter(
    (p) =>
      (p.name + " " + p.sku).toLowerCase().includes(query.toLowerCase()) &&
      (status === "All products" || p.status === status) &&
      (!category || p.category === category),
  );
  const bulk = (value: string) => {
    s.setProducts((x) =>
      x.map((p) => (selected.includes(p.id) ? { ...p, status: value } : p)),
    );
    setSelected([]);
    s.toast(`Selected products ${value.toLowerCase()}.`);
  };
  return (
    <>
      <AdminTitle
        title="Good things on your shelves."
        text="A little care for your products, variants, and all the details."
      >
        <Button variant="outline" onClick={() => setImportOpen(true)}>
          <Upload size={16} />
          Import
        </Button>
        <Button onClick={() => setEdit("new")}>
          <Plus size={16} />
          Add product
        </Button>
      </AdminTitle>
      <div className="catalog-admin-tabs">
        {[
          ["Products", "/admin/products"],
          ["Categories", "/admin/categories"],
          ["Inventory", "/admin/inventory"],
          ["Discounts", "/admin/discounts"],
          ["Page experiences", "/admin/campaigns"],
        ].map(([t, u]) => (
          <NavLink key={u} to={u}>
            {t}
          </NavLink>
        ))}
      </div>
      <div className="stats-grid three">
        <Stat
          label="Total products"
          value={String(products.length)}
          icon={Package}
          caption={`${products.filter((p) => p.status === "Published").length} published in your store`}
        />
        <Stat
          label="A little low on stock"
          value={String(products.filter((p) => p.stock < 10).length)}
          icon={Box}
          caption="products need your attention"
        />
        <Stat
          label="Product categories"
          value={String(categories.length)}
          icon={FolderTree}
          caption="thoughtfully organised"
        />
      </div>
      <section className="admin-panel">
        <div className="admin-table-tabs">
          {["All products", "Published", "Draft", "Archived"].map((t) => (
            <button
              key={t}
              className={status === t ? "active" : ""}
              onClick={() => {
                setStatus(t);
                setPage(1);
              }}
            >
              {t}
              <span>
                {t === "All products"
                  ? products.length
                  : products.filter((p) => p.status === t).length}
              </span>
            </button>
          ))}
        </div>
        <div className="table-toolbar">
          <div className="search-field">
            <Search size={16} />
            <input
              placeholder="Search by name or SKU…"
              aria-label="Search admin products"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            aria-label="Product category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All categories</option>
            {categories
              .filter((c) => !c.parent)
              .map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
          </select>
          <Button
            variant="outline"
            onClick={() =>
              exportCSV(
                "nirbhor-products",
                filtered.map(
                  ({
                    id,
                    name,
                    category,
                    subcategory,
                    price,
                    oldPrice,
                    sku,
                    stock,
                    status,
                    weight,
                    image,
                  }) => ({
                    id,
                    name,
                    category,
                    subcategory,
                    price,
                    oldPrice,
                    sku,
                    stock,
                    status,
                    weight,
                    image,
                  }),
                ),
              )
            }
          >
            <Download size={15} />
            Export
          </Button>
        </div>
        {selected.length > 0 && (
          <div className="bulk-toolbar">
            <b>{selected.length} selected</b>
            <button onClick={() => bulk("Published")}>Publish</button>
            <button onClick={() => bulk("Draft")}>Set to draft</button>
            <button onClick={() => bulk("Archived")}>Archive</button>
            <button onClick={() => setSelected([])}>Clear</button>
          </div>
        )}
        <div className="table-scroll">
          <table className="admin-table product-admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    aria-label="Select all products"
                    checked={
                      filtered.length > 0 &&
                      filtered.every((p) => selected.includes(p.id))
                    }
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? filtered.map((p) => p.id) : [],
                      )
                    }
                  />
                </th>
                <th>Product</th>
                <th>Status</th>
                <th>Inventory</th>
                <th>Category</th>
                <th>Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.slice((page - 1) * 10, page * 10).map((p) => (
                <tr key={p.id}>
                  <td>
                    <input
                      aria-label={`Select ${p.name}`}
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={(e) =>
                        setSelected((x) =>
                          e.target.checked
                            ? [...x, p.id]
                            : x.filter((id) => id !== p.id),
                        )
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="table-product"
                      onClick={() => setEdit(p)}
                    >
                      <img src={p.image} alt="" />
                      <span>
                        <b>{p.name}</b>
                        <small>{p.sku}</small>
                      </span>
                    </button>
                  </td>
                  <td>
                    <Status value={p.status} />
                  </td>
                  <td>
                    <span className={p.stock < 10 ? "low-stock" : ""}>
                      {p.stock} in stock
                    </span>
                    <small>{productVariants(p).length} variants</small>
                  </td>
                  <td>
                    {p.category}
                    <small>{p.subcategory}</small>
                  </td>
                  <td>
                    <b>{money(p.price)}</b>
                    {p.oldPrice > 0 && (
                      <small>
                        <del>{money(p.oldPrice)}</del>
                      </small>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-btn"
                        aria-label={`Edit ${p.name}`}
                        onClick={() => setEdit(p)}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="icon-btn"
                        aria-label={`Duplicate ${p.name}`}
                        onClick={() => {
                          const copy = {
                            ...p,
                            id: uid("p"),
                            name: p.name + " (copy)",
                            sku: p.sku + "-COPY",
                            status: "Draft",
                            campaign: false,
                          };
                          s.setProducts((x) => [copy, ...x]);
                          s.toast("A draft copy is ready to edit.");
                        }}
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        className="icon-btn"
                        aria-label={`Archive ${p.name}`}
                        onClick={() => setRemove(p)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <Empty
            icon={Package}
            title="No good finds here yet."
            text="Try another search or add a product."
          />
        )}
        <div className="admin-pagination">
          <span>
            {filtered.length} products · Page {page} of{" "}
            {Math.max(1, Math.ceil(filtered.length / 10))}
          </span>
          <div>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft size={15} />
            </button>
            <button
              disabled={page * 10 >= filtered.length}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>
      {edit && (
        <ProductEditor
          product={edit === "new" ? undefined : edit}
          onClose={() => setEdit(undefined)}
        />
      )}{" "}
      {remove && (
        <Modal
          title="A little pause for this product?"
          onClose={() => setRemove(undefined)}
        >
          <p className="muted">
            Archive {remove.name}? It will leave the storefront while its
            details stay safe in your catalogue.
          </p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setRemove(undefined)}>
              Keep on the shelf
            </Button>
            <Button
              onClick={() => {
                s.setProducts((x) =>
                  x.map((p) =>
                    p.id === remove.id ? { ...p, status: "Archived" } : p,
                  ),
                );
                setRemove(undefined);
                s.toast("Product archived.");
              }}
            >
              Archive product
            </Button>
          </div>
        </Modal>
      )}
      {importOpen && (
        <Modal
          title="Bring a few good products along."
          onClose={() => setImportOpen(false)}
        >
          <p className="muted">
            Upload a CSV exported from this catalogue. Columns: name, category,
            subcategory, price, sku, stock, weight, image. New imports start as
            drafts.
          </p>
          <label className="upload-zone">
            <Upload size={27} />
            <strong>Choose a product CSV</strong>
            <input
              type="file"
              accept=".csv"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const csv = await file.text();
                const lines = csv
                  .replace(/^\uFEFF/, "")
                  .trim()
                  .split(/\r?\n/);
                const parse = (line: string) => {
                  const cells: string[] = [];
                  let cell = "",
                    quoted = false;
                  for (let i = 0; i < line.length; i++) {
                    const ch = line[i];
                    if (ch === '"') {
                      if (quoted && line[i + 1] === '"') {
                        cell += '"';
                        i++;
                      } else quoted = !quoted;
                    } else if (ch === "," && !quoted) {
                      cells.push(cell);
                      cell = "";
                    } else cell += ch;
                  }
                  cells.push(cell);
                  return cells;
                };
                const headers = parse(lines[0]);
                const imported = lines
                  .slice(1)
                  .map((line) => {
                    const cells = parse(line),
                      r = Object.fromEntries(
                        headers.map((h, i) => [h, cells[i] || ""]),
                      );
                    return {
                      ...seedProducts[0],
                      id: uid("p"),
                      name: r.name || "",
                      category: r.category || "Organic Food",
                      subcategory: r.subcategory || "",
                      price: Number(r.price),
                      oldPrice: Number(r.oldPrice) || 0,
                      sku: r.sku || uid("NBR-"),
                      stock: Number(r.stock) || 0,
                      weight: r.weight || "500g",
                      image: r.image || "/assets/hero.webp",
                      images: [r.image || "/assets/hero.webp"],
                      status: "Draft",
                      campaign: false,
                    };
                  })
                  .filter(
                    (p) =>
                      p.name &&
                      Number.isFinite(p.price) &&
                      p.price >= 0 &&
                      p.stock >= 0,
                  );
                if (!imported.length) {
                  s.toast("No valid product rows were found.");
                  return;
                }
                s.setProducts((x) => [...imported, ...x]);
                s.toast(`${imported.length} draft products imported.`);
                setImportOpen(false);
              }}
            />
          </label>
        </Modal>
      )}
    </>
  );
}
function ProductEditor({
  product,
  onClose,
}: {
  product?: Product;
  onClose: () => void;
}) {
  const s = useStore();
  const [tab, setTab] = useState("The basics"),
    [draft, setDraft] = useState<Product>(
      product || {
        ...seedProducts[0],
        id: uid("p"),
        name: "",
        price: 0,
        oldPrice: 0,
        stock: 0,
        status: "Draft",
        sku: uid("NBR-").toUpperCase(),
        campaign: false,
        image: "/assets/hero.webp",
        images: [],
        badge: "",
        description: "",
        variants: [],
      },
    );
  const [variants, setVariants] = useState(product?.variants || []);
  const set = (key: keyof Product, value: any) =>
    setDraft((x) => ({ ...x, [key]: value }));
  const upload = (file: File | undefined, gallery = false) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      s.toast("Please use an image under 3 MB for the local preview.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      gallery
        ? set("images", [...draft.images, String(reader.result)])
        : set("image", String(reader.result));
    reader.readAsDataURL(file);
  };
  return (
    <Modal
      title={
        product
          ? "A little care for your product."
          : "Something good for the shelves."
      }
      onClose={onClose}
      wide
    >
      <div className="editor-tabs">
        {["The basics", "Media & details", "Variants", "SEO & experience"].map(
          (t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ),
        )}
      </div>
      <form
        className="product-editor"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.name.trim() || draft.price <= 0 || draft.stock < 0) {
            s.toast(
              "Add a name, a positive price, and valid stock before saving.",
            );
            setTab("The basics");
            return;
          }
          const record = { ...draft, variants };
          s.setProducts((x) =>
            product
              ? x.map((p) => (p.id === record.id ? record : p))
              : [record, ...x],
          );
          s.toast(
            product
              ? "Your product is a little more up to date."
              : "A new good find is on the shelves.",
          );
          onClose();
        }}
      >
        {tab === "The basics" ? (
          <div className="editor-columns">
            <div className="form-stack">
              <label className="field">
                Product name
                <input
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Something worth choosing"
                  required
                />
              </label>
              <label className="field">
                Description
                <textarea
                  rows={5}
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </label>
              <div className="form-grid">
                <label className="field">
                  Price (BDT)
                  <input
                    type="number"
                    min="1"
                    value={draft.price}
                    onChange={(e) => set("price", Number(e.target.value))}
                    required
                  />
                </label>
                <label className="field">
                  Compare-at price
                  <input
                    type="number"
                    min="0"
                    value={draft.oldPrice}
                    onChange={(e) => set("oldPrice", Number(e.target.value))}
                  />
                </label>
                <label className="field">
                  Cost price
                  <input
                    type="number"
                    min="0"
                    value={draft.cost || 0}
                    onChange={(e) => set("cost", Number(e.target.value))}
                  />
                </label>
                <label className="field">
                  Stock quantity
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={draft.stock}
                    onChange={(e) => set("stock", Number(e.target.value))}
                  />
                </label>
                <label className="field">
                  SKU
                  <input
                    value={draft.sku}
                    onChange={(e) => set("sku", e.target.value)}
                  />
                </label>
                <label className="field">
                  Barcode
                  <input
                    value={draft.barcode || ""}
                    onChange={(e) => set("barcode", e.target.value)}
                  />
                </label>
              </div>
            </div>
            <div className="form-stack">
              <label className="field">
                Visibility
                <select
                  value={draft.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
              </label>
              <label className="field">
                Parent category
                <select
                  value={draft.category}
                  onChange={(e) => {
                    set("category", e.target.value);
                    set("subcategory", "");
                  }}
                >
                  {s.categories
                    .filter((c) => !c.parent)
                    .map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                </select>
              </label>
              <label className="field">
                Subcategory
                <select
                  value={draft.subcategory}
                  onChange={(e) => set("subcategory", e.target.value)}
                >
                  <option value="">Choose a subcategory</option>
                  {s.categories
                    .filter((c) =>
                      descendants(s.categories, draft.category).has(c.name),
                    )
                    .map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  {draft.subcategory &&
                    !s.categories.some((c) => c.name === draft.subcategory) && (
                      <option>{draft.subcategory}</option>
                    )}
                </select>
              </label>
              {(["brand", "weight", "source", "badge", "tags"] as const).map(
                (k) => (
                  <label className="field" key={k}>
                    {
                      {
                        brand: "Brand",
                        weight: "Default size / weight",
                        source: "Source / origin",
                        badge: "Product badge",
                        tags: "Tags (comma separated)",
                      }[k]
                    }
                    <input
                      value={draft[k]}
                      onChange={(e) => set(k, e.target.value)}
                    />
                  </label>
                ),
              )}
            </div>
          </div>
        ) : tab === "Media & details" ? (
          <div className="editor-columns">
            <div className="form-stack">
              <label className="field">
                Main image URL
                <input
                  value={
                    draft.image.startsWith("data:")
                      ? "Uploaded image"
                      : draft.image
                  }
                  onChange={(e) => set("image", e.target.value)}
                />
              </label>
              <label className="upload-zone">
                <img
                  className="editor-product-preview"
                  src={draft.image}
                  alt="Main product preview"
                />
                <span>
                  <Upload size={16} /> Upload a product image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => upload(e.target.files?.[0])}
                />
              </label>
              <label className="field">
                Product video URL
                <input
                  value={draft.video || ""}
                  onChange={(e) => set("video", e.target.value)}
                  placeholder="https://…/product-story.mp4"
                />
              </label>
            </div>
            <div className="form-stack">
              <label className="upload-zone">
                <Image size={24} />
                <span>Add gallery image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => upload(e.target.files?.[0], true)}
                />
              </label>
              <div className="gallery-editor">
                {draft.images.map((img, i) => (
                  <div key={i}>
                    <img src={img} alt={`Gallery ${i + 1}`} />
                    <button
                      type="button"
                      aria-label="Remove gallery image"
                      onClick={() =>
                        set(
                          "images",
                          draft.images.filter((_, j) => i !== j),
                        )
                      }
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              {(["type", "dietary", "color"] as const).map((k) => (
                <label className="field" key={k}>
                  {k === "type"
                    ? "Product type"
                    : k === "dietary"
                      ? "Dietary / material attribute"
                      : "Colour"}
                  <input
                    value={draft[k]}
                    onChange={(e) => set(k, e.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>
        ) : tab === "Variants" ? (
          <div className="form-stack">
            <p className="muted">
              Add option-specific prices, SKU, stock and images. With no custom
              variants, size options use the product’s default details.
            </p>
            {variants.map((v, i) => (
              <div className="variant-editor-row" key={i}>
                {(["label", "price", "stock", "sku", "image"] as const).map(
                  (k) => (
                    <label className="field" key={k}>
                      {k}
                      <input
                        type={
                          ["price", "stock"].includes(k) ? "number" : "text"
                        }
                        min="0"
                        value={v[k]}
                        onChange={(e) =>
                          setVariants((x) =>
                            x.map((y, j) =>
                              j === i
                                ? {
                                    ...y,
                                    [k]: ["price", "stock"].includes(k)
                                      ? Number(e.target.value)
                                      : e.target.value,
                                  }
                                : y,
                            ),
                          )
                        }
                      />
                    </label>
                  ),
                )}
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Remove variant"
                  onClick={() =>
                    setVariants((x) => x.filter((_, j) => i !== j))
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setVariants((x) => [
                  ...x,
                  {
                    label: "New size",
                    price: draft.price,
                    stock: draft.stock,
                    sku: draft.sku + "-" + (x.length + 1),
                    image: draft.image,
                  },
                ])
              }
            >
              <Plus size={15} />
              Add a variant
            </Button>
          </div>
        ) : (
          <div className="form-stack">
            <label className="field">
              SEO title
              <input
                maxLength={70}
                value={draft.seoTitle || ""}
                onChange={(e) => set("seoTitle", e.target.value)}
                placeholder={draft.name + " | NIRBHOR"}
              />
            </label>
            <label className="field">
              Meta description
              <textarea
                rows={3}
                maxLength={180}
                value={draft.seoDescription || ""}
                onChange={(e) => set("seoDescription", e.target.value)}
              />
            </label>
            <label className="field">
              Product slug
              <input
                value={draft.slug || ""}
                onChange={(e) => set("slug", e.target.value)}
                placeholder={draft.name.toLowerCase().replace(/\s+/g, "-")}
              />
            </label>
            <Toggle
              checked={draft.campaign}
              onChange={(v) => set("campaign", v)}
              label="Campaign product experience"
              description="Use a campaign page for this product. Configure the blocks in Campaigns."
            />
            <Link className="text-link" to="/admin/campaigns">
              Manage landing-page experiences <ArrowUpRight size={14} />
            </Link>
            <div className="seo-preview">
              <span>nirbhor.com › product › {draft.slug || draft.id}</span>
              <h3>{draft.seoTitle || draft.name + " | NIRBHOR"}</h3>
              <p>{draft.seoDescription || draft.description}</p>
            </div>
          </div>
        )}
        <div className="editor-footer">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <span className="small muted">
            Changes are saved when you click save.
          </span>
          <Button type="submit">
            <Check size={16} />
            Save product
          </Button>
        </div>
      </form>
    </Modal>
  );
}
