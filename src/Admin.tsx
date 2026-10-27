import BrandLogo from "./BrandLogo";
import { bestSelling, productSales } from "./best-selling";
import OffersAdmin from "./OffersAdmin";
import ProductPageAdmin from "./ProductPageAdmin";
import { bnNode, latinDigits, searchText } from "./bn";
import DepartmentExperiencesAdmin from "./DepartmentExperiencesAdmin";
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
  Palette,
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
      ["প্রোডাক্ট পেজ", "/admin/product-pages", FileText],
      ["Categories", "/admin/categories", FolderTree],
      ["Category experiences", "/admin/experiences", Palette],
      ["Inventory", "/admin/inventory", Box],
      ["Customers", "/admin/customers", Users],
    ],
  },
  {
    label: "GROW YOUR STORE",
    items: [
      ["Campaigns", "/admin/campaigns", Sparkles],
      ["কম্বো ও অফার", "/admin/offers", Layers],
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
        <b>{bnNode(label)}</b>
        {bnNode(description && <small>{bnNode(description)}</small>)}
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
        <span>{bnNode(label)}</span>
        <Icon size={17} />
      </div>
      <strong>{bnNode(value)}</strong>
      <p>
        {bnNode(change && (
          <span>
            <ArrowUpRight size={13} />
            {bnNode(change)}
          </span>
        ))}
        {bnNode(caption || "vs. previous period")}
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
        {bnNode(eyebrow && <span className="eyebrow">{bnNode(eyebrow)}</span>)}
        <h1>{bnNode(title)}</h1>
        <p>{bnNode(text)}</p>
      </div>
      <div className="admin-title-actions">{bnNode(children)}</div>
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
          <h3>{bnNode(title)}</h3>
          {bnNode(subtitle && <p>{bnNode(subtitle)}</p>)}
        </div>
        {bnNode(action)}
      </div>
      {bnNode(children)}
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
        <Link to="/" className="wordmark"><BrandLogo />
        </Link>
        <div className="workspace-picker">
          <span className="workspace-avatar">
            <Leaf size={18} />
          </span>
          <div>
            <b>{bnNode("Nirbhor Commerce")}</b>
            <span>{bnNode("Preview workspace")}</span>
          </div>
          <ChevronDown size={14} />
        </div>
        <nav>
          {bnNode(navGroups.map((g) => (
            <div className="admin-nav-group" key={g.label}>
              <span>{bnNode(g.label)}</span>
              {bnNode(g.items.map(([label, url, Icon]) => (
                <NavLink to={url} key={url} end={url === "/admin"}>
                  <Icon size={17} />
                  <span>{bnNode(label)}</span>
                  {bnNode(label === "Orders" && (
                    <small>
                      {bnNode(orders.filter((o) => o.status === "Placed").length || 4)}
                    </small>
                  ))}
                  {bnNode(label === "Reviews" &&
                    reviews.some((r) => r.status === "Pending") && <i />)}
                </NavLink>
              )))}
            </div>
          )))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/" className="visit-store">
            <Globe size={17} />{bnNode("Visit your store")}<ArrowUpRight size={15} />
          </Link>
          <div className="admin-profile">
            <span>{bnNode("NR")}</span>
            <div>
              <b>{bnNode("Nur Rahman")}</b>
              <small>{bnNode("Store owner")}</small>
            </div>
            <Link to="/admin/settings" aria-label={bnNode("Store settings")}>
              <SettingsIcon size={16} />
            </Link>
          </div>
        </div>
      </aside>
      {bnNode(mobile && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobile(false)}
        />
      ))}
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <button
              className="icon-btn mobile-only"
              aria-label={bnNode("Open admin menu")}
              onClick={() => setMobile(!mobile)}
            >
              <Menu size={21} />
            </button>
            <span>{bnNode("Workspace")}</span>
            <ChevronRight size={13} />
            <b>{bnNode(pageTitle)}</b>
          </div>
          <div>
            <Badge>{bnNode("Frontend preview")}</Badge>
            <Link className="text-link" to="/" target="_blank">{bnNode("View store ")}<ExternalLink size={13} />
            </Link>
            <div className="admin-notifications">
              <button
                className="icon-btn notification-bell"
                aria-label={bnNode("Admin notifications")}
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={19} />
                <i />
              </button>
              {bnNode(notifications && (
                <div className="admin-notification-popover">
                  <h3>{bnNode("A little store update.")}</h3>
                  <Link
                    to="/admin/orders"
                    onClick={() => setNotifications(false)}
                  >
                    <ShoppingBag size={17} />
                    <span>
                      {bnNode(orders.filter((o) => o.status === "Placed").length)}{bnNode(" ")}{bnNode("orders waiting for a little care.")}</span>
                  </Link>
                  <Link
                    to="/admin/inventory"
                    onClick={() => setNotifications(false)}
                  >
                    <Box size={17} />
                    <span>{bnNode(low.length)}{bnNode(" products running a little low.")}</span>
                  </Link>
                  <Link
                    to="/admin/reviews"
                    onClick={() => setNotifications(false)}
                  >
                    <Star size={17} />
                    <span>
                      {bnNode(reviews.filter((r) => r.status === "Pending").length)}{bnNode(" ")}{bnNode("reviews ready for moderation.")}</span>
                  </Link>
                </div>
              ))}
            </div>
            <span className="topbar-avatar">{bnNode("NR")}</span>
          </div>
        </header>
        <main className="admin-content">
          {bnNode(section === "overview" ? (
            <Overview />
          ) : section === "experiences" ? (
            <DepartmentExperiencesAdmin />
          ) : section === "products" ? (
            <ProductsAdmin />
          ) : section === "product-pages" ? (
            <ProductPageAdmin />
          ) : section === "categories" ? (
            <CategoriesAdmin />
          ) : section === "inventory" ? (
            <InventoryAdmin />
          ) : section === "orders" ? (
            <OrdersAdmin />
          ) : section === "customers" ? (
            <CustomersAdmin />
          ) : section === "discounts" ? (
            <OffersAdmin key="discounts" initialTab="discounts" />
          ) : section === "offers" ? (
            <OffersAdmin key="offers" />
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
          ))}
          <div className="admin-footer">
            <span>{bnNode("NIRBHOR Commerce ")}<span>{bnNode("·")}</span>{bnNode(" A little care, behind the scenes.")}</span>
            <span>{bnNode("All changes saved to this browser ")}<span className="saved-dot" />
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
        <span>{bnNode("৳150k")}</span>
        <span>{bnNode("৳100k")}</span>
        <span>{bnNode("৳50k")}</span>
        <span>{bnNode("৳0")}</span>
      </div>
      <div className="chart-plot">
        <div className="chart-gridlines">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="chart-bars">
          {bnNode(values.map((v, i) => (
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
                {bnNode(hover === i && (
                  <span className="chart-tooltip">{bnNode(money(v * 1500))}</span>
                ))}
              </div>
              <span>
                {bnNode(period === "7"
                  ? ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"][i]
                  : period === "30"
                    ? `${i * 2 + 1} Oct`
                    : `W${i + 1}`)}
              </span>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}
function Overview() {
  const s = useStore(), { orders, products } = s;
  const [period, setPeriod] = useState("7");
  const days = Number(period), now = new Date(), since = new Date(now);
  since.setHours(0, 0, 0, 0); since.setDate(since.getDate() - days + 1);
  const records = orders.filter(o => { const date = new Date(o.date).getTime(); return date >= since.getTime() && date <= now.getTime(); });
  const active = records.filter(o => o.status !== "Cancelled" && o.status !== "Returned");
  const total = active.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter(o => o.status === "Placed").length;
  const sales = productSales(records), top = bestSelling(products, records, 4).filter(p => (sales.get(p.id) || 0) > 0);
  const buckets = Array.from({ length: 7 }, (_, i) => {
    const start = new Date(since); start.setDate(start.getDate() + Math.floor(i * days / 7));
    const finish = new Date(since); finish.setDate(finish.getDate() + Math.floor((i + 1) * days / 7));
    return { date: start, total: active.filter(o => new Date(o.date) >= start && new Date(o.date) < finish).reduce((sum, o) => sum + o.total, 0) };
  });
  const peak = Math.max(1, ...buckets.map(b => b.total));
  return <div className="admin-overview">
    <AdminTitle title="আপনার স্টোর, এক নজরে" text="অর্ডার, পণ্য ও আজকের করণীয়।">
      <select aria-label={bnNode("Dashboard period")} value={period} onChange={e => setPeriod(e.target.value)}>
        <option value="7">গত ৭ দিন</option><option value="30">গত ৩০ দিন</option><option value="90">গত ৯০ দিন</option>
      </select>
      <Button to="/admin/products?new=1"><Plus size={16}/>{bnNode("Add product")}</Button>
    </AdminTitle>
    <div className="dashboard-context"><span>এই ব্রাউজারে সংরক্ষিত রেকর্ড। প্রাথমিক নমুনা অর্ডার অন্তর্ভুক্ত।</span><Link to="/" target="_blank">স্টোর দেখুন <ArrowUpRight size={14}/></Link></div>
    <div className="stats-grid">
      <Stat label="অর্ডারের মূল্য" value={money(total)} icon={TrendingUp} caption="বাতিল ও ফেরত বাদে"/>
      <Stat label="মোট অর্ডার" value={String(records.length)} icon={ShoppingBag} caption="নির্বাচিত সময়ের মধ্যে"/>
      <Stat label="নিশ্চিত করার অপেক্ষায়" value={String(pending)} icon={ClipboardList} caption="সব চলমান অর্ডার"/>
      <Stat label="গড় অর্ডারের মূল্য" value={money(total / Math.max(1, active.length))} icon={BarChart3} caption="বাতিল ও ফেরত বাদে"/>
    </div>
    <div className="dashboard-main-grid">
      <Panel title="অর্ডারের চিত্র" subtitle="নির্বাচিত সময়ের অর্ডারের মূল্য" className="sales-panel">
        <div className="dashboard-chart-summary"><strong>{bnNode(money(total))}</strong><span>{bnNode(active.length)}টি অর্ডার</span></div>
        {active.length ? <div className="dashboard-bars" role="img" aria-label={"অর্ডারের মূল্য: " + buckets.map(b => b.date.toLocaleDateString("bn-BD", { day: "numeric", month: "short" }) + " " + money(b.total)).join(", ")}>
          {buckets.map((b, i) => <div className="dashboard-bar" key={i} title={b.date.toLocaleDateString("bn-BD") + ": " + money(b.total)}><div><i style={{ height: (b.total / peak * 100) + "%" }}/></div><span>{b.date.toLocaleDateString("bn-BD", { day: "numeric", month: "short" })}</span></div>)}
        </div> : <p className="dashboard-chart-empty">এই সময়ে কোনো অর্ডার পাওয়া যায়নি।</p>}
      </Panel>
      <Panel title="এখন যা করা দরকার" subtitle="প্রয়োজনীয় কাজগুলো এক জায়গায়">
        <div className="dashboard-task-list">
          <Link to="/admin/orders"><ShoppingBag size={19}/><span>অর্ডার নিশ্চিত করুন</span><b>{bnNode(pending)}</b><ChevronRight size={15}/></Link>
          <Link to="/admin/inventory"><Package size={19}/><span>কম স্টকের পণ্য</span><b>{bnNode(products.filter(p => p.stock < 10 && p.status === "Published").length)}</b><ChevronRight size={15}/></Link>
          <Link to="/admin/reviews"><MessageSquare size={19}/><span>রিভিউ দেখুন</span><b>{bnNode(s.reviews.filter(r => r.status === "Pending").length)}</b><ChevronRight size={15}/></Link>
          <Link to="/admin/offers"><Tag size={19}/><span>কম্বো ও ডিসকাউন্ট</span><ChevronRight size={15}/></Link>
        </div>
      </Panel>
    </div>
    <div className="dashboard-bottom-grid">
      <Panel title="সাম্প্রতিক অর্ডার" subtitle="সর্বশেষ পাঁচটি অর্ডার" action={<Link className="text-link" to="/admin/orders">সব অর্ডার <ArrowUpRight size={14}/></Link>}>
        <RecentOrders orders={[...orders].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,5)}/>
      </Panel>
      <Panel title="বেশি অর্ডার হওয়া পণ্য" subtitle="নিশ্চিত অর্ডার অনুযায়ী" action={<Link className="icon-btn" to="/admin/products" aria-label="পণ্য দেখুন"><ArrowUpRight size={17}/></Link>}>
        {top.length ? <div className="top-products">{top.map((p, i) => <div key={p.id}><span className="rank">{bnNode(i + 1)}</span><img src={p.image} alt=""/><div><strong>{bnNode(p.name)}</strong><span>{bnNode(sales.get(p.id))}টি পণ্য অর্ডার হয়েছে</span></div><Link className="icon-btn" to={"/admin/product-pages?product=" + p.id} aria-label={bnNode(p.name) + " সম্পাদনা"}><ArrowUpRight size={16}/></Link></div>)}</div> : <p className="dashboard-ranked-empty">অর্ডার নিশ্চিত হলে এখানে জনপ্রিয় পণ্য দেখা যাবে।</p>}
      </Panel>
    </div>
    <div className="admin-quick-links">{[
      [Package, "পণ্য যোগ করুন", "ক্যাটালগ সাজিয়ে নিন", "/admin/products?new=1"],
      [Palette, "প্রোডাক্ট পেজ সাজান", "লেখা, ছবি ও রিভিউ", "/admin/product-pages"],
      [Tag, "অফার তৈরি করুন", "কম্বো ও ছাড় নির্ধারণ", "/admin/offers"],
    ].map(([Icon, title, text, url]) => { const I = Icon as typeof Package; return <Link to={String(url)} key={String(url)}><span><I size={21}/></span><div><h4>{String(title)}</h4><p>{String(text)}</p></div><ArrowUpRight size={17}/></Link>; })}</div>
  </div>;
}
function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="table-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th>{bnNode("Order")}</th>
            <th>{bnNode("Customer")}</th>
            <th>{bnNode("Status")}</th>
            <th>{bnNode("Total")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {bnNode(orders.map((o) => (
            <tr key={o.id}>
              <td>
                <Link to={`/admin/orders?order=${o.id}`} className="order-id">{bnNode("#")}{bnNode(o.id)}
                </Link>
                <small>
                  {bnNode(new Date(o.date).toLocaleDateString("bn-BD", {
                    day: "numeric",
                    month: "short",
                  }))}
                </small>
              </td>
              <td>{bnNode(o.customer)}</td>
              <td>
                <Status value={o.status} />
              </td>
              <td>
                <b>{bnNode(money(o.total))}</b>
              </td>
              <td>
                <Link
                  to={`/admin/orders?order=${o.id}`}
                  aria-label={bnNode(`Open ${o.id}`)}
                >
                  <ArrowUpRight size={15} />
                </Link>
              </td>
            </tr>
          )))}
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
      {bnNode(value)}
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
      searchText(p.name + " " + p.sku).includes(latinDigits(query).toLowerCase()) &&
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
        title={bnNode("Good things on your shelves.")}
        text="A little care for your products, variants, and all the details."
      >
        <Button variant="outline" onClick={() => setImportOpen(true)}>
          <Upload size={16} />{bnNode("Import")}</Button>
        <Button onClick={() => setEdit("new")}>
          <Plus size={16} />{bnNode("Add product")}</Button>
      </AdminTitle>
      <div className="catalog-admin-tabs">
        {bnNode([
          ["Products", "/admin/products"],
          ["Categories", "/admin/categories"],
          ["Inventory", "/admin/inventory"],
          ["Discounts", "/admin/discounts"],
          ["Page experiences", "/admin/campaigns"],
        ].map(([t, u]) => (
          <NavLink key={u} to={u}>
            {bnNode(t)}
          </NavLink>
        )))}
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
          {bnNode(["All products", "Published", "Draft", "Archived"].map((t) => (
            <button
              key={t}
              className={status === t ? "active" : ""}
              onClick={() => {
                setStatus(t);
                setPage(1);
              }}
            >
              {bnNode(t)}
              <span>
                {bnNode(t === "All products"
                  ? products.length
                  : products.filter((p) => p.status === t).length)}
              </span>
            </button>
          )))}
        </div>
        <div className="table-toolbar">
          <div className="search-field">
            <Search size={16} />
            <input
              placeholder={bnNode("Search by name or SKU…")}
              aria-label={bnNode("Search admin products")}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            aria-label={bnNode("Product category")}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">{bnNode("All categories")}</option>
            {bnNode(categories
              .filter((c) => !c.parent)
              .map((c) => (
                <option key={c.id} value={c.name}>{bnNode(c.name)}</option>
              )))}
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
            <Download size={15} />{bnNode("Export")}</Button>
        </div>
        {bnNode(selected.length > 0 && (
          <div className="bulk-toolbar">
            <b>{bnNode(selected.length)}{bnNode(" selected")}</b>
            <button onClick={() => bulk("Published")}>{bnNode("Publish")}</button>
            <button onClick={() => bulk("Draft")}>{bnNode("Set to draft")}</button>
            <button onClick={() => bulk("Archived")}>{bnNode("Archive")}</button>
            <button onClick={() => setSelected([])}>{bnNode("Clear")}</button>
          </div>
        ))}
        <div className="table-scroll">
          <table className="admin-table product-admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    aria-label={bnNode("Select all products")}
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
                <th>{bnNode("Product")}</th>
                <th>{bnNode("Status")}</th>
                <th>{bnNode("Inventory")}</th>
                <th>{bnNode("Category")}</th>
                <th>{bnNode("Price")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bnNode(filtered.slice((page - 1) * 10, page * 10).map((p) => (
                <tr key={p.id}>
                  <td>
                    <input
                      aria-label={bnNode(`Select ${p.name}`)}
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
                      <img src={p.image} alt={bnNode("")} />
                      <span>
                        <b>{bnNode(p.name)}</b>
                        <small>{bnNode(p.sku)}</small>
                      </span>
                    </button>
                  </td>
                  <td>
                    <Status value={p.status} />
                  </td>
                  <td>
                    <span className={p.stock < 10 ? "low-stock" : ""}>
                      {bnNode(p.stock)}{bnNode(" in stock")}</span>
                    <small>{bnNode(productVariants(p).length)}{bnNode(" variants")}</small>
                  </td>
                  <td>
                    {bnNode(p.category)}
                    <small>{bnNode(p.subcategory)}</small>
                  </td>
                  <td>
                    <b>{bnNode(money(p.price))}</b>
                    {bnNode(p.oldPrice > 0 && (
                      <small>
                        <del>{bnNode(money(p.oldPrice))}</del>
                      </small>
                    ))}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-btn"
                        aria-label={bnNode(`Edit ${p.name}`)}
                        onClick={() => setEdit(p)}
                      >
                        <Edit3 size={15} />
                      </button>
                      <Link className="icon-btn" aria-label={`${bnNode(p.name)} পেজ সাজান`} to={`/admin/product-pages?product=${p.id}`}><FileText size={15} /></Link>
                      <button
                        className="icon-btn"
                        aria-label={bnNode(`Duplicate ${p.name}`)}
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
                        aria-label={bnNode(`Archive ${p.name}`)}
                        onClick={() => setRemove(p)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        {bnNode(!filtered.length && (
          <Empty
            icon={Package}
            title={bnNode("No good finds here yet.")}
            text="Try another search or add a product."
          />
        ))}
        <div className="admin-pagination">
          <span>
            {bnNode(filtered.length)}{bnNode(" products · Page ")}{bnNode(page)}{bnNode(" of")}{bnNode(" ")}
            {bnNode(Math.max(1, Math.ceil(filtered.length / 10)))}
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
      {bnNode(edit && (
        <ProductEditor
          product={edit === "new" ? undefined : edit}
          onClose={() => setEdit(undefined)}
        />
      ))}{bnNode(" ")}
      {bnNode(remove && (
        <Modal
          title={bnNode("A little pause for this product?")}
          onClose={() => setRemove(undefined)}
        >
          <p className="muted">{bnNode("Archive ")}{bnNode(remove.name)}{bnNode("? It will leave the storefront while its details stay safe in your catalogue.")}</p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setRemove(undefined)}>{bnNode("Keep on the shelf")}</Button>
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
            >{bnNode("Archive product")}</Button>
          </div>
        </Modal>
      ))}
      {bnNode(importOpen && (
        <Modal
          title={bnNode("Bring a few good products along.")}
          onClose={() => setImportOpen(false)}
        >
          <p className="muted">{bnNode("Upload a CSV exported from this catalogue. Columns: name, category, subcategory, price, sku, stock, weight, image. New imports start as drafts.")}</p>
          <label className="upload-zone">
            <Upload size={27} />
            <strong>{bnNode("Choose a product CSV")}</strong>
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
                      image: r.image || "/assets/organic-world-v5.webp",
                      images: [r.image || "/assets/organic-world-v5.webp"],
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
      ))}
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
        image: "/assets/organic-world-v5.webp",
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
        bnNode(product
          ? "A little care for your product."
          : "Something good for the shelves.")
      }
      onClose={onClose}
      wide
    >
      <div className="editor-tabs">
        {bnNode(["The basics", "Media & details", "Variants", "SEO & experience"].map(
          (t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {bnNode(t)}
            </button>
          ),
        ))}
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
        {bnNode(tab === "The basics" ? (
          <div className="editor-columns">
            <div className="form-stack">
              <label className="field">{bnNode("Product name")}<input
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={bnNode("Something worth choosing")}
                  required
                />
              </label>
              <label className="field">{bnNode("Description")}<textarea
                  rows={5}
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </label>
              <div className="form-grid">
                <label className="field">{bnNode("Price (BDT)")}<input
                    type="number"
                    min="1"
                    value={draft.price}
                    onChange={(e) => set("price", Number(e.target.value))}
                    required
                  />
                </label>
                <label className="field">{bnNode("Compare-at price")}<input
                    type="number"
                    min="0"
                    value={draft.oldPrice}
                    onChange={(e) => set("oldPrice", Number(e.target.value))}
                  />
                </label>
                <label className="field">{bnNode("Cost price")}<input
                    type="number"
                    min="0"
                    value={draft.cost || 0}
                    onChange={(e) => set("cost", Number(e.target.value))}
                  />
                </label>
                <label className="field">{bnNode("Stock quantity")}<input
                    type="number"
                    min="0"
                    step="1"
                    value={draft.stock}
                    onChange={(e) => set("stock", Number(e.target.value))}
                  />
                </label>
                <label className="field">{bnNode("SKU")}<input
                    value={draft.sku}
                    onChange={(e) => set("sku", e.target.value)}
                  />
                </label>
                <label className="field">{bnNode("Barcode")}<input
                    value={draft.barcode || ""}
                    onChange={(e) => set("barcode", e.target.value)}
                  />
                </label>
              </div>
            </div>
            <div className="form-stack">
              <label className="field">{bnNode("Visibility")}<select
                  value={draft.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  <option value={"Published"}>{bnNode("Published")}</option>
                  <option value={"Draft"}>{bnNode("Draft")}</option>
                  <option value={"Archived"}>{bnNode("Archived")}</option>
                </select>
              </label>
              <label className="field">{bnNode("Parent category")}<select
                  value={draft.category}
                  onChange={(e) => {
                    set("category", e.target.value);
                    set("subcategory", "");
                  }}
                >
                  {bnNode(s.categories
                    .filter((c) => !c.parent)
                    .map((c) => (
                      <option key={c.id} value={c.name}>{bnNode(c.name)}</option>
                    )))}
                </select>
              </label>
              <label className="field">{bnNode("Subcategory")}<select
                  value={draft.subcategory}
                  onChange={(e) => set("subcategory", e.target.value)}
                >
                  <option value="">{bnNode("Choose a subcategory")}</option>
                  {bnNode(s.categories
                    .filter((c) =>
                      descendants(s.categories, draft.category).has(c.name),
                    )
                    .map((c) => (
                      <option key={c.id} value={c.name}>{bnNode(c.name)}</option>
                    )))}
                  {bnNode(draft.subcategory &&
                    !s.categories.some((c) => c.name === draft.subcategory) && (
                      <option value={draft.subcategory}>{bnNode(draft.subcategory)}</option>
                    ))}
                </select>
              </label>
              {bnNode((["brand", "weight", "source", "badge", "tags"] as const).map(
                (k) => (
                  <label className="field" key={k}>
                    {
                      bnNode({
                        brand: "Brand",
                        weight: "Default size / weight",
                        source: "Source / origin",
                        badge: "Product badge",
                        tags: "Tags (comma separated)",
                      }[k])
                    }
                    <input
                      value={draft[k]}
                      onChange={(e) => set(k, e.target.value)}
                    />
                  </label>
                ),
              ))}
            </div>
          </div>
        ) : tab === "Media & details" ? (
          <div className="editor-columns">
            <div className="form-stack">
              <label className="field">{bnNode("Main image URL")}<input
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
                  alt={bnNode("Main product preview")}
                />
                <span>
                  <Upload size={16} />{bnNode(" Upload a product image")}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => upload(e.target.files?.[0])}
                />
              </label>
              <label className="field">{bnNode("Product video URL")}<input
                  value={draft.video || ""}
                  onChange={(e) => set("video", e.target.value)}
                  placeholder={bnNode("https://…/product-story.mp4")}
                />
              </label>
            </div>
            <div className="form-stack">
              <label className="upload-zone">
                <Image size={24} />
                <span>{bnNode("Add gallery image")}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => upload(e.target.files?.[0], true)}
                />
              </label>
              <div className="gallery-editor">
                {bnNode(draft.images.map((img, i) => (
                  <div key={i}>
                    <img src={img} alt={bnNode(`Gallery ${i + 1}`)} />
                    <button
                      type="button"
                      aria-label={bnNode("Remove gallery image")}
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
                )))}
              </div>
              {bnNode((["type", "dietary", "color"] as const).map((k) => (
                <label className="field" key={k}>
                  {bnNode(k === "type"
                    ? "Product type"
                    : k === "dietary"
                      ? "Dietary / material attribute"
                      : "Colour")}
                  <input
                    value={draft[k]}
                    onChange={(e) => set(k, e.target.value)}
                  />
                </label>
              )))}
            </div>
          </div>
        ) : tab === "Variants" ? (
          <div className="form-stack">
            <p className="muted">{bnNode("Add option-specific prices, SKU, stock and images. With no custom variants, size options use the product’s default details.")}</p>
            {bnNode(variants.map((v, i) => (
              <div className="variant-editor-row" key={i}>
                {bnNode((["label", "price", "stock", "sku", "image"] as const).map(
                  (k) => (
                    <label className="field" key={k}>
                      {bnNode(k)}
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
                ))}
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={bnNode("Remove variant")}
                  onClick={() =>
                    setVariants((x) => x.filter((_, j) => i !== j))
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )))}
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
              <Plus size={15} />{bnNode("Add a variant")}</Button>
          </div>
        ) : (
          <div className="form-stack">
            <label className="field">{bnNode("SEO title")}<input
                maxLength={70}
                value={draft.seoTitle || ""}
                onChange={(e) => set("seoTitle", e.target.value)}
                placeholder={bnNode(draft.name + " | NIRBHOR")}
              />
            </label>
            <label className="field">{bnNode("Meta description")}<textarea
                rows={3}
                maxLength={180}
                value={draft.seoDescription || ""}
                onChange={(e) => set("seoDescription", e.target.value)}
              />
            </label>
            <label className="field">{bnNode("Product slug")}<input
                value={draft.slug || ""}
                onChange={(e) => set("slug", e.target.value)}
                placeholder={bnNode(draft.name.toLowerCase().replace(/\s+/g, "-"))}
              />
            </label>
            <Toggle
              checked={draft.campaign}
              onChange={(v) => set("campaign", v)}
              label="Campaign product experience"
              description="Use a campaign page for this product. Configure the blocks in Campaigns."
            />
            <Link className="text-link" to="/admin/campaigns">{bnNode("Manage landing-page experiences ")}<ArrowUpRight size={14} />
            </Link>
            {product && <Link className="text-link" to={`/admin/product-pages?product=${product.id}`}>প্রোডাক্ট পেজের লেখা ও রিভিউ<ArrowUpRight size={14} /></Link>}
            <div className="seo-preview">
              <span>{bnNode("nirbhor.com › product › ")}{bnNode(draft.slug || draft.id)}</span>
              <h3>{bnNode(draft.seoTitle || draft.name + " | NIRBHOR")}</h3>
              <p>{bnNode(draft.seoDescription || draft.description)}</p>
            </div>
          </div>
        ))}
        <div className="editor-footer">
          <Button type="button" variant="outline" onClick={onClose}>{bnNode("Close")}</Button>
          <span className="small muted">{bnNode("Changes are saved when you click save.")}</span>
          <Button type="submit">
            <Check size={16} />{bnNode("Save product")}</Button>
        </div>
      </form>
    </Modal>
  );
}
