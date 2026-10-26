import { bnNode, latinDigits, searchText } from "./bn";
import { descendants } from "./category-tree";
import { useUpdateOrder } from "./inventory-actions";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sparkles,
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bell,
  Box,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileText,
  FolderTree,
  Globe,
  Image,
  Layers,
  Leaf,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Printer,
  Search,
  Shield,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  Truck,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useStore } from "./store";
import { Badge, Button, Empty, Modal } from "./ui";
import {
  AdminTitle,
  Panel,
  Stat,
  Status,
  Toggle,
  SalesChart,
  exportCSV,
} from "./Admin";
import { money, uid, statusSteps, itemPrice, variantUnits } from "./data";
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

export function CategoriesAdmin() {
  const s = useStore();
  const [edit, setEdit] = useState<Category | "new">(),
    [remove, setRemove] = useState<Category>();
  return (
    <>
      <AdminTitle
        title={bnNode("A good place for everything.")}
        text="Organise your collections, from broad categories to the smallest good finds."
      >
        <Button onClick={() => setEdit("new")}>
          <Plus size={16} />{bnNode("Add category")}</Button>
      </AdminTitle>
      <div className="admin-category-grid">
        {bnNode(s.categories
          .filter((c) => !c.parent)
          .sort((a, b) => a.sort - b.sort)
          .map((c) => (
            <Panel
              key={c.id}
              title={bnNode(c.name)}
              subtitle={c.description}
              action={
                <button
                  className="icon-btn"
                  aria-label={bnNode(`Edit ${c.name}`)}
                  onClick={() => setEdit(c)}
                >
                  <Edit3 size={16} />
                </button>
              }
            >
              <div className="category-admin-preview">
                <img src={c.image} alt={bnNode("")} />
                <div>
                  <Status value={c.active ? "Active" : "Draft"} />
                  <p>
                    {bnNode(s.products.filter((p) => p.category === c.name).length)}{bnNode(" ")}{bnNode("products · Sort order ")}{bnNode(c.sort)}
                  </p>
                </div>
              </div>
              <div className="category-tree">
                {bnNode(s.categories
                  .filter((x) => x.parent === c.name)
                  .sort((a, b) => a.sort - b.sort)
                  .map((x) => (
                    <div key={x.id}>
                      <span className="tree-branch">{bnNode("↳")}</span>
                      <span>
                        {bnNode(x.name)}
                        <small>
                          {
                            bnNode(s.products.filter((p) => p.subcategory === x.name)
                              .length)
                          }{bnNode(" ")}{bnNode("products")}</small>
                      </span>
                      <button
                        className="icon-btn"
                        aria-label={bnNode(`Edit ${x.name}`)}
                        onClick={() => setEdit(x)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="icon-btn"
                        aria-label={bnNode(`Delete ${x.name}`)}
                        onClick={() => setRemove(x)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )))}
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  setEdit({
                    id: uid("c"),
                    name: "",
                    parent: c.name,
                    description: "",
                    active: true,
                    image: c.image,
                    sort: 0,
                  })
                }
              >
                <Plus size={14} />{bnNode("Add subcategory")}</Button>
            </Panel>
          )))}
      </div>
      {bnNode(edit && (
        <Modal
          title={
            bnNode(edit === "new" || !edit.name
              ? "A new corner of goodness."
              : "A little care for this category.")
          }
          onClose={() => setEdit(undefined)}
        >
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const item: Category = {
                id: edit === "new" ? uid("c") : edit.id,
                name: String(f.get("name")),
                parent: String(f.get("parent")),
                description: String(f.get("description")),
                image: String(f.get("image")),
                sort: Number(f.get("sort")),
                active: !!f.get("active"),
                departmentSlug:
                  edit === "new" ? undefined : edit.departmentSlug,
                experience: edit === "new" ? undefined : edit.experience,
              };
              const oldName = edit === "new" ? "" : edit.name;
              if (
                s.categories.some(
                  (c) => c.name === item.name && c.id !== item.id,
                )
              ) {
                s.toast("A category with that name already exists.");
                return;
              }
              s.setCategories((x) => {
                const exists = x.some((c) => c.id === item.id);
                return (
                  exists
                    ? x.map((c) => (c.id === item.id ? item : c))
                    : [...x, item]
                ).map((c) =>
                  oldName && c.parent === oldName
                    ? { ...c, parent: item.name }
                    : c,
                );
              });
              if (oldName)
                s.setProducts((x) =>
                  x.map((p) => ({
                    ...p,
                    category: p.category === oldName ? item.name : p.category,
                    subcategory:
                      p.subcategory === oldName ? item.name : p.subcategory,
                  })),
                );
              s.toast("Category saved. Everything in its good place.");
              setEdit(undefined);
            }}
          >
            <label className="field">{bnNode("Category name")}<input
                name="name"
                defaultValue={edit === "new" ? "" : edit.name}
                required
              />
            </label>
            <label className="field">{bnNode("Parent category")}<select
                name="parent"
                defaultValue={edit === "new" ? "" : edit.parent}
              >
                <option value="">{bnNode("None — top-level category")}</option>
                {bnNode(s.categories
                  .filter(
                    (c) =>
                      edit === "new" ||
                      (c.id !== edit.id &&
                        !descendants(s.categories, edit.name).has(c.name)),
                  )
                  .map((c) => (
                    <option value={c.name} key={c.id}>
                      {bnNode(c.parent ? c.parent + " › " : "")}
                      {bnNode(c.name)}
                    </option>
                  )))}
              </select>
            </label>
            <label className="field">{bnNode("Description")}<textarea
                name="description"
                defaultValue={edit === "new" ? "" : edit.description}
                rows={3}
              />
            </label>
            <label className="field">{bnNode("Image URL")}<input
                name="image"
                defaultValue={edit === "new" ? "/assets/hero.webp" : edit.image}
              />
            </label>
            <label className="field">{bnNode("Sort order")}<input
                name="sort"
                type="number"
                min="0"
                defaultValue={edit === "new" ? 0 : edit.sort}
              />
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                name="active"
                defaultChecked={edit === "new" || edit.active}
              />{bnNode("Visible in the storefront")}</label>
            <Button type="submit">{bnNode("Save category ")}<Check size={16} />
            </Button>
          </form>
        </Modal>
      ))}
      {bnNode(remove && (
        <Modal
          title={bnNode("Remove this category?")}
          onClose={() => setRemove(undefined)}
        >
          <p className="muted">{bnNode("Products will stay in your catalogue. Their category can be updated in the product editor.")}</p>
          <Button
            onClick={() => {
              s.setCategories((x) => x.filter((c) => c.id !== remove.id));
              setRemove(undefined);
              s.toast("Category removed.");
            }}
          >{bnNode("Remove category")}</Button>
        </Modal>
      ))}
    </>
  );
}

export function InventoryAdmin() {
  const s = useStore();
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All stock"),
    [edit, setEdit] = useState<Product>();
  const rows = s.products.filter(
    (p) =>
      searchText(p.name).includes(latinDigits(query).toLowerCase()) &&
      (filter === "All stock" ||
        (filter === "Low stock" && p.stock > 0 && p.stock < 10) ||
        (filter === "Out of stock" && p.stock === 0)),
  );
  return (
    <>
      <AdminTitle
        title={bnNode("Keep the good things in stock.")}
        text="A clear view of what’s ready, what’s running low, and what needs a little refill."
      >
        <Button
          variant="outline"
          onClick={() =>
            exportCSV(
              "nirbhor-inventory",
              s.products.map((p) => ({
                name: p.name,
                sku: p.sku,
                stock: p.stock,
                category: p.category,
              })),
            )
          }
        >
          <Download size={16} />{bnNode("Export stock")}</Button>
      </AdminTitle>
      <div className="stats-grid three">
        <Stat
          label="Units on your shelves"
          value={String(s.products.reduce((n, p) => n + p.stock, 0))}
          icon={Package}
          caption="across all products"
        />
        <Stat
          label="A little low"
          value={String(
            s.products.filter((p) => p.stock > 0 && p.stock < 10).length,
          )}
          icon={Box}
          caption="below 10 units"
        />
        <Stat
          label="Waiting for a refill"
          value={String(s.products.filter((p) => p.stock === 0).length)}
          icon={Truck}
          caption="out-of-stock products"
        />
      </div>
      <Panel
        title={bnNode("Your little stockroom.")}
        action={
          <select
            aria-label={bnNode("Stock filter")}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {bnNode(["All stock", "Low stock", "Out of stock"].map((x) => (
              <option key={x} value={x}>{bnNode(x)}</option>
            )))}
          </select>
        }
      >
        <div className="table-toolbar">
          <div className="search-field">
            <Search size={16} />
            <input
              placeholder={bnNode("Find a product…")}
              aria-label={bnNode("Search inventory")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <span className="muted small">{bnNode("Low-stock threshold: 10 units")}</span>
        </div>
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{bnNode("Product")}</th>
                <th>{bnNode("SKU")}</th>
                <th>{bnNode("Available")}</th>
                <th>{bnNode("Status")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bnNode(rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="table-product">
                      <img src={p.image} alt={bnNode("")} />
                      <b>{bnNode(p.name)}</b>
                    </div>
                  </td>
                  <td>{bnNode(p.sku)}</td>
                  <td>
                    <b>{bnNode(p.stock)}</b>{bnNode(" units")}</td>
                  <td>
                    <Status
                      value={
                        p.stock === 0
                          ? "Out of stock"
                          : p.stock < 10
                            ? "Low stock"
                            : "In stock"
                      }
                    />
                  </td>
                  <td>
                    <Button variant="outline" onClick={() => setEdit(p)}>{bnNode("Adjust stock")}</Button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel
        title={bnNode("A little stock history.")}
        subtitle="Adjustments made in this browser."
      >
        {bnNode(s.inventoryLog.length ? (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{bnNode("Date")}</th>
                  <th>{bnNode("Product")}</th>
                  <th>{bnNode("Adjustment")}</th>
                  <th>{bnNode("Reason")}</th>
                </tr>
              </thead>
              <tbody>
                {bnNode(s.inventoryLog.slice(0, 20).map((x, i) => (
                  <tr key={i}>
                    <td>{bnNode(new Date(x.date).toLocaleDateString("bn-BD"))}</td>
                    <td>{bnNode(x.product)}</td>
                    <td className={x.change > 0 ? "green" : "danger"}>
                      {bnNode(x.change > 0 ? "+" : "")}
                      {bnNode(x.change)}
                    </td>
                    <td>{bnNode(x.reason)}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="panel-empty muted">{bnNode("Your next stock adjustment will appear here.")}</p>
        ))}
      </Panel>
      {bnNode(edit && (
        <Modal
          title={bnNode("A little refill for " + edit.name)}
          onClose={() => setEdit(undefined)}
        >
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget),
                quantity = Number(f.get("quantity")),
                mode = String(f.get("mode"));
              const next =
                mode === "Set available"
                  ? quantity
                  : mode === "Add stock"
                    ? edit.stock + quantity
                    : edit.stock - quantity;
              if (next < 0) {
                s.toast("Stock cannot go below zero.");
                return;
              }
              s.setProducts((x) =>
                x.map((p) => (p.id === edit.id ? { ...p, stock: next } : p)),
              );
              s.setInventoryLog((x) => [
                {
                  date: new Date().toISOString(),
                  product: edit.name,
                  change: next - edit.stock,
                  reason: String(f.get("reason")),
                },
                ...x,
              ]);
              s.toast("Stock adjusted. Your shelves are up to date.");
              setEdit(undefined);
            }}
          >
            <Badge>{bnNode("Currently ")}{bnNode(edit.stock)}{bnNode(" available")}</Badge>
            <label className="field">{bnNode("Adjustment")}<select name="mode">
                <option value={"Add stock"}>{bnNode("Add stock")}</option>
                <option value={"Remove stock"}>{bnNode("Remove stock")}</option>
                <option value={"Set available"}>{bnNode("Set available")}</option>
              </select>
            </label>
            <label className="field">{bnNode("Quantity")}<input type="number" name="quantity" required min="0" step="1" />
            </label>
            <label className="field">{bnNode("A little note for the record")}<textarea
                name="reason"
                rows={3}
                required
                placeholder={bnNode("e.g. New harvest batch received")}
              />
            </label>
            <Button type="submit">{bnNode("Save adjustment ")}<Check size={16} />
            </Button>
          </form>
        </Modal>
      ))}
    </>
  );
}

export function OrdersAdmin() {
  const s = useStore(),
    location = useLocation();
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("All orders"),
    [paymentFilter, setPaymentFilter] = useState(""),
    [selected, setSelected] = useState(
      new URLSearchParams(location.search).get("order") || "",
    ),
    [selectedIds, setSelectedIds] = useState<string[]>([]);
  const order = s.orders.find((o) => o.id === selected);
  const rows = s.orders.filter(
    (o) =>
      (o.id + " " + o.customer + " " + o.phone)
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (status === "All orders" || o.status === status) &&
      (!paymentFilter || o.paymentStatus === paymentFilter),
  );
  return (
    <>
      <AdminTitle
        title={bnNode("Every order, a little promise.")}
        text="From a first good choice to a carefully delivered doorstep moment."
      >
        <Button
          variant="outline"
          onClick={() =>
            exportCSV(
              "nirbhor-orders",
              rows.map(
                ({
                  id,
                  customer,
                  phone,
                  date,
                  total,
                  status,
                  payment,
                  paymentStatus,
                  address,
                }) => ({
                  id,
                  customer,
                  phone,
                  date,
                  total,
                  status,
                  payment,
                  paymentStatus,
                  address,
                }),
              ),
            )
          }
        >
          <Download size={16} />{bnNode("Export orders")}</Button>
      </AdminTitle>
      <div className="stats-grid four">
        <Stat
          label="All orders"
          value={String(s.orders.length)}
          icon={ShoppingBag}
          caption="good choices made"
        />
        <Stat
          label="To confirm"
          value={String(s.orders.filter((o) => o.status === "Placed").length)}
          icon={Bell}
          caption="waiting for a little call"
        />
        <Stat
          label="On their way"
          value={String(
            s.orders.filter((o) =>
              ["Shipped", "Out for delivery"].includes(o.status),
            ).length,
          )}
          icon={Truck}
          caption="deliveries in motion"
        />
        <Stat
          label="Delivered"
          value={String(
            s.orders.filter((o) => o.status === "Delivered").length,
          )}
          icon={Check}
          caption="a little goodness received"
        />
      </div>
      <section className="admin-panel">
        <div className="admin-table-tabs">
          {bnNode([
            "All orders",
            "Placed",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Return requested",
          ].map((t) => (
            <button
              key={t}
              className={status === t ? "active" : ""}
              onClick={() => setStatus(t)}
            >
              {bnNode(t)}
            </button>
          )))}
        </div>
        <div className="table-toolbar">
          <div className="search-field">
            <Search size={16} />
            <input
              aria-label={bnNode("Search orders")}
              placeholder={bnNode("Order number, customer or phone…")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            aria-label={bnNode("Payment status filter")}
          >
            <option value="">{bnNode("All payments")}</option>
            <option value={"Paid"}>{bnNode("Paid")}</option>
            <option value={"Unpaid"}>{bnNode("Unpaid")}</option>
            <option value={"Refunded"}>{bnNode("Refunded")}</option>
          </select>
        </div>
        {bnNode(selectedIds.length > 0 && (
          <div className="bulk-toolbar">
            <b>{bnNode(selectedIds.length)}{bnNode(" selected")}</b>
            <button
              onClick={() => {
                s.setOrders((x) =>
                  x.map((o) =>
                    selectedIds.includes(o.id) && o.status === "Placed"
                      ? { ...o, status: "Confirmed" }
                      : o,
                  ),
                );
                setSelectedIds([]);
                s.toast("Eligible orders confirmed.");
              }}
            >{bnNode("Confirm eligible orders")}</button>
            <button
              onClick={() =>
                exportCSV(
                  "selected-orders",
                  s.orders
                    .filter((o) => selectedIds.includes(o.id))
                    .map((o) => ({
                      id: o.id,
                      customer: o.customer,
                      address: o.address,
                      total: o.total,
                    })),
                )
              }
            >{bnNode("Export selection")}</button>
          </div>
        ))}
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    aria-label={bnNode("Select all orders")}
                    checked={
                      rows.length > 0 &&
                      rows.every((o) => selectedIds.includes(o.id))
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? rows.map((o) => o.id) : [],
                      )
                    }
                  />
                </th>
                <th>{bnNode("Order")}</th>
                <th>{bnNode("Customer")}</th>
                <th>{bnNode("Payment")}</th>
                <th>{bnNode("Fulfilment")}</th>
                <th>{bnNode("Total")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bnNode(rows.map((o) => (
                <tr key={o.id}>
                  <td>
                    <input
                      aria-label={bnNode(`Select order ${o.id}`)}
                      type="checkbox"
                      checked={selectedIds.includes(o.id)}
                      onChange={(e) =>
                        setSelectedIds((x) =>
                          e.target.checked
                            ? [...x, o.id]
                            : x.filter((id) => id !== o.id),
                        )
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="text-button order-id"
                      onClick={() => setSelected(o.id)}
                    >{bnNode("#")}{bnNode(o.id)}
                    </button>
                    <small>
                      {bnNode(new Date(o.date).toLocaleDateString("bn-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }))}
                    </small>
                  </td>
                  <td>
                    {bnNode(o.customer)}
                    <small>{bnNode(o.phone)}</small>
                  </td>
                  <td>
                    <Status value={o.paymentStatus} />
                    <small>{bnNode(o.payment)}</small>
                  </td>
                  <td>
                    <Status value={o.status} />
                  </td>
                  <td>
                    <b>{bnNode(money(o.total))}</b>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      aria-label={bnNode(`View order ${o.id}`)}
                      onClick={() => setSelected(o.id)}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        {bnNode(!rows.length && (
          <Empty
            icon={ShoppingBag}
            title={bnNode("A little quiet here.")}
            text="No orders match these filters."
          />
        ))}
      </section>
      {bnNode(order && <OrderEditor order={order} onClose={() => setSelected("")} />)}
    </>
  );
}
function OrderEditor({
  order: o,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const s = useStore(),
    updateOrder = useUpdateOrder();
  return (
    <Modal title={bnNode(`A closer look at #${o.id}`)} onClose={onClose} wide>
      <div className="order-editor-print">
        <div className="invoice-brand">
          <h2>{bnNode("NIRBHOR")}</h2>
          <span>{bnNode("Invoice #")}{bnNode(o.id)}{bnNode(" · ")}{bnNode(new Date(o.date).toLocaleDateString("bn-BD"))}
          </span>
        </div>
        <div className="order-editor-grid">
          <div>
            <div className="order-editor-items">
              {bnNode(o.items.map((i, j) => {
                const p = s.products.find((p) => p.id === i.id);
                return (
                  <div key={j}>
                    {bnNode(p && <img src={p.image} alt={bnNode("")} />)}
                    <span>
                      <b>{bnNode(p?.name || "Archived product")}</b>
                      <small>
                        {bnNode(i.variant)}{bnNode(" × ")}{bnNode(i.quantity)}
                      </small>
                    </span>
                    <b>
                      {bnNode(money(
                        (i.unitPrice ?? (p ? itemPrice(p, i.variant) : 0)) *
                          i.quantity,
                      ))}
                    </b>
                  </div>
                );
              }))}
            </div>
            <div className="summary-breakdown">
              <div className="summary-line">
                <span>{bnNode("Subtotal")}</span>
                <b>{bnNode(money(o.subtotal))}</b>
              </div>
              <div className="summary-line">
                <span>{bnNode("Discount")}</span>
                <b>{bnNode("− ")}{bnNode(money(o.discount))}</b>
              </div>
              <div className="summary-line">
                <span>{bnNode("Delivery")}</span>
                <b>{bnNode(money(o.shipping))}</b>
              </div>
              <div className="summary-total">
                <span>{bnNode("Total")}</span>
                <b>{bnNode(money(o.total))}</b>
              </div>
            </div>
            <div className="delivery-address">
              <h3>{bnNode("Customer & delivery")}</h3>
              <p>
                <b>{bnNode(o.customer)}</b>
                <br />
                {bnNode(o.phone)}
                <br />
                {bnNode(o.email)}
                <br />
                {bnNode(o.address)}
              </p>
              <p>
                <b>{bnNode("Customer note:")}</b> {bnNode(o.note || "No notes added.")}
              </p>
            </div>
          </div>
          <form
            className="form-stack no-print"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              if (
                !updateOrder(o.id, {
                  status: String(f.get("status")),
                  paymentStatus: String(f.get("paymentStatus")),
                  courier: String(f.get("courier")),
                  tracking: String(f.get("tracking")),
                  callStatus: String(f.get("callStatus")),
                  internalNote: String(f.get("note")),
                })
              )
                return;
              s.toast("Order details updated.");
            }}
          >
            <label className="field">{bnNode("Order status")}<select
                name="status"
                aria-label={bnNode("Order status")}
                defaultValue={o.status}
              >
                {bnNode([
                  ...statusSteps,
                  "Cancelled",
                  "Return requested",
                  "Returned",
                  "Refunded",
                ].map((x) => (
                  <option key={x} value={x}>{bnNode(x)}</option>
                )))}
              </select>
            </label>
            <label className="field">{bnNode("Payment status")}<select name="paymentStatus" defaultValue={o.paymentStatus}>
                <option value={"Unpaid"}>{bnNode("Unpaid")}</option>
                <option value={"Paid"}>{bnNode("Paid")}</option>
                <option value={"Failed"}>{bnNode("Failed")}</option>
                <option value={"Refunded"}>{bnNode("Refunded")}</option>
              </select>
            </label>
            <label className="field">{bnNode("Confirmation call")}<select name="callStatus" defaultValue={o.callStatus}>
                <option value={"Pending"}>{bnNode("Pending")}</option>
                <option value={"Confirmed"}>{bnNode("Confirmed")}</option>
                <option value={"No answer"}>{bnNode("No answer")}</option>
                <option value={"Call back"}>{bnNode("Call back")}</option>
              </select>
            </label>
            <div className="form-grid">
              <label className="field">{bnNode("Courier")}<select name="courier" defaultValue={o.courier}>
                  {bnNode([
                    "Unassigned",
                    "Steadfast",
                    "Pathao",
                    "RedX",
                    "Sundarban Courier",
                  ].map((x) => (
                    <option key={x} value={x}>{bnNode(x)}</option>
                  )))}
                </select>
              </label>
              <label className="field">{bnNode("Tracking number")}<input name="tracking" defaultValue={o.tracking} />
              </label>
            </div>
            <label className="field">{bnNode("Internal notes")}<textarea name="note" rows={3} defaultValue={o.internalNote} />
            </label>
            <Button type="submit">{bnNode("Save order updates ")}<Check size={15} />
            </Button>
            <p className="small muted">{bnNode("Courier, refund and notification actions are local previews. No external service is called.")}</p>
          </form>
        </div>
      </div>
      <div className="editor-footer no-print">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer size={16} />{bnNode("Print invoice / packing slip")}</Button>
        <Button variant="outline" onClick={onClose}>{bnNode("Close")}</Button>
      </div>
    </Modal>
  );
}

export function CustomersAdmin() {
  const s = useStore();
  const [query, setQuery] = useState(""),
    [selected, setSelected] = useState(""),
    [segment, setSegment] = useState("All customers");
  const customers = Object.values(
    s.orders.reduce<
      Record<
        string,
        { name: string; email: string; phone: string; orders: Order[] }
      >
    >((a, o) => {
      const key = o.email || o.phone;
      if (!a[key])
        a[key] = {
          name: o.customer,
          email: o.email,
          phone: o.phone,
          orders: [],
        };
      a[key].orders.push(o);
      return a;
    }, {}),
  );
  const filtered = customers.filter(
    (c) =>
      (c.name + " " + c.email + " " + c.phone)
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (segment === "All customers" ||
        (segment === "Repeat customers" && c.orders.length > 1) ||
        (segment === "High value" &&
          c.orders.reduce((n, o) => n + o.total, 0) > 1500)),
  );
  const c = customers.find((c) => (c.email || c.phone) === selected);
  return (
    <>
      <AdminTitle
        title={bnNode("The people behind the good choices.")}
        text="A little more context to make every customer feel at home."
      >
        <Button
          variant="outline"
          onClick={() =>
            exportCSV(
              "nirbhor-customers",
              customers.map((c) => ({
                name: c.name,
                email: c.email,
                phone: c.phone,
                orders: c.orders.length,
                total: c.orders.reduce((n, o) => n + o.total, 0),
              })),
            )
          }
        >
          <Download size={15} />{bnNode("Export customers")}</Button>
      </AdminTitle>
      <div className="stats-grid three">
        <Stat
          label="Your little community"
          value={String(customers.length)}
          icon={Users}
          caption="customers in local records"
        />
        <Stat
          label="Coming back for more"
          value={String(customers.filter((c) => c.orders.length > 1).length)}
          icon={HeartIcon}
          caption="repeat customers"
        />
        <Stat
          label="A little more value"
          value={money(
            s.orders.reduce((n, o) => n + o.total, 0) /
              Math.max(1, customers.length),
          )}
          icon={TrendingIcon}
          caption="average customer value"
        />
      </div>
      <Panel
        title={bnNode("Your good company.")}
        action={
          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            aria-label={bnNode("Customer segment")}
          >
            {bnNode(["All customers", "Repeat customers", "High value"].map((x) => (
              <option key={x} value={x}>{bnNode(x)}</option>
            )))}
          </select>
        }
      >
        <div className="table-toolbar">
          <div className="search-field">
            <Search size={16} />
            <input
              aria-label={bnNode("Search customers")}
              placeholder={bnNode("Name, email or phone…")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{bnNode("Customer")}</th>
                <th>{bnNode("Contact")}</th>
                <th>{bnNode("Orders")}</th>
                <th>{bnNode("Total spent")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bnNode(filtered.map((c) => (
                <tr key={c.email || c.phone}>
                  <td>
                    <button
                      className="text-button"
                      onClick={() => setSelected(c.email || c.phone)}
                    >
                      <b>{bnNode(c.name)}</b>
                    </button>
                    {bnNode(s.notes["blocked-" + (c.email || c.phone)] === "yes" && (
                      <Status value="Blocked" />
                    ))}
                  </td>
                  <td>
                    {bnNode(c.email)}
                    <small>{bnNode(c.phone)}</small>
                  </td>
                  <td>{bnNode(c.orders.length)}</td>
                  <td>
                    <b>{bnNode(money(c.orders.reduce((n, o) => n + o.total, 0)))}</b>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      aria-label={bnNode(`View customer ${c.name}`)}
                      onClick={() => setSelected(c.email || c.phone)}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </Panel>
      {bnNode(c && (
        <Modal
          title={bnNode(c.name + " · A little customer story")}
          onClose={() => setSelected("")}
          wide
        >
          <div className="customer-detail-top">
            <Badge>
              {bnNode(c.orders.length > 1
                ? "Repeat customer"
                : "New to the good stuff")}
            </Badge>
            <strong>
              {bnNode(money(c.orders.reduce((n, o) => n + o.total, 0)))}{bnNode(" lifetime value")}</strong>
            <span>
              {bnNode(c.email)}{bnNode(" · ")}{bnNode(c.phone)}
            </span>
          </div>
          <p className="muted">{bnNode(c.orders[0]?.address)}</p>
          <div className="customer-detail-orders">
            {bnNode(c.orders.map((o) => (
              <Link key={o.id} to={`/admin/orders?order=${o.id}`}>{bnNode("#")}{bnNode(o.id)}
                <Status value={o.status} />
                <b>{bnNode(money(o.total))}</b>
                <ArrowUpRight size={14} />
              </Link>
            )))}
          </div>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              s.setNotes((x) => ({
                ...x,
                ["customer-" + selected]: String(f.get("notes")),
                ["tags-" + selected]: String(f.get("tags")),
                ["blocked-" + selected]: f.get("blocked") ? "yes" : "no",
              }));
              s.toast("Customer notes saved.");
            }}
          >
            <label className="field">{bnNode("Tags")}<input
                name="tags"
                defaultValue={s.notes["tags-" + selected] || ""}
                placeholder={bnNode("e.g. VIP, organic regular")}
              />
            </label>
            <label className="field">{bnNode("A little note for the team")}<textarea
                name="notes"
                rows={3}
                defaultValue={s.notes["customer-" + selected] || ""}
              />
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                name="blocked"
                defaultChecked={s.notes["blocked-" + selected] === "yes"}
              />{bnNode("Mark customer as blocked in this preview")}</label>
            <Button type="submit">{bnNode("Save customer notes ")}<Check size={16} />
            </Button>
          </form>
          <p className="small muted">{bnNode("Access restrictions will be enforced by the backend.")}</p>
        </Modal>
      ))}
    </>
  );
}
const HeartIcon = Users,
  TrendingIcon = Activity;

export function DiscountsAdmin() {
  const s = useStore();
  const [edit, setEdit] = useState<Coupon | "new">();
  return (
    <>
      <AdminTitle
        title={bnNode("A little extra goes a long way.")}
        text="Thoughtful offers, welcome codes, and good reasons to come back."
      >
        <Button onClick={() => setEdit("new")}>
          <Plus size={16} />{bnNode("Create an offer")}</Button>
      </AdminTitle>
      <div className="coupon-admin-grid">
        {bnNode(s.coupons.map((c) => (
          <Panel
            key={c.id}
            title={bnNode(c.code)}
            subtitle={
              c.type === "Percentage"
                ? `${c.value}% off`
                : c.type === "Fixed amount"
                  ? money(c.value) + " off"
                  : c.type
            }
            action={<Status value={c.active ? "Active" : "Draft"} />}
          >
            <div className="discount-details">
              <div>
                <span>{bnNode("Minimum order")}</span>
                <b>{bnNode(money(c.minimum))}</b>
              </div>
              <div>
                <span>{bnNode("Used / limit")}</span>
                <b>
                  {bnNode(c.uses)}{bnNode(" / ")}{bnNode(c.limit)}
                </b>
              </div>
              <div>
                <span>{bnNode("Applies to")}</span>
                <b>{bnNode(c.scope)}</b>
              </div>
              <div>
                <span>{bnNode("Valid until")}</span>
                <b>{bnNode(new Date(c.end).toLocaleDateString("bn-BD"))}</b>
              </div>
            </div>
            <Toggle
              label="Offer is active"
              checked={c.active}
              onChange={(v) =>
                s.setCoupons((x) =>
                  x.map((y) => (y.id === c.id ? { ...y, active: v } : y)),
                )
              }
            />
            <Button variant="outline" onClick={() => setEdit(c)}>{bnNode("Edit this little offer ")}<Edit3 size={14} />
            </Button>
          </Panel>
        )))}
      </div>
      {bnNode(edit && (
        <Modal
          title={
            bnNode(edit === "new"
              ? "A new little reason to shop."
              : "Fine-tune this offer.")
          }
          onClose={() => setEdit(undefined)}
        >
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const code = String(f.get("code")).trim().toUpperCase();
              if (
                String(f.get("type")) === "Percentage" &&
                Number(f.get("value")) > 100
              ) {
                s.toast("Percentage discounts must be between 0 and 100.");
                return;
              }
              if (
                s.coupons.some(
                  (c) =>
                    c.code === code && (edit === "new" || c.id !== edit.id),
                )
              ) {
                s.toast("This code already exists.");
                return;
              }
              const item: Coupon = {
                id: edit === "new" ? uid("d") : edit.id,
                code,
                type: String(f.get("type")),
                value: Number(f.get("value")),
                minimum: Number(f.get("minimum")),
                limit: Number(f.get("limit")),
                perUser: Number(f.get("perUser")),
                uses: edit === "new" ? 0 : edit.uses,
                active: !!f.get("active"),
                scope: String(f.get("scope")),
                start: String(f.get("start")),
                end: String(f.get("end")),
              };
              if (item.start > item.end) {
                s.toast("The end date should be after the start.");
                return;
              }
              s.setCoupons((x) =>
                edit === "new"
                  ? [...x, item]
                  : x.map((c) => (c.id === item.id ? item : c)),
              );
              s.toast("Your little offer is saved.");
              setEdit(undefined);
            }}
          >
            <label className="field">{bnNode("Offer code")}<input
                name="code"
                required
                defaultValue={edit === "new" ? "" : edit.code}
                placeholder={bnNode("e.g. A_LITTLE_GOOD")}
              />
            </label>
            <div className="form-grid">
              <label className="field">{bnNode("Type")}<select
                  name="type"
                  defaultValue={edit === "new" ? "Percentage" : edit.type}
                >
                  <option value={"Percentage"}>{bnNode("Percentage")}</option>
                  <option value={"Fixed amount"}>{bnNode("Fixed amount")}</option>
                  <option value={"Free shipping"}>{bnNode("Free shipping")}</option>
                  <option value={"Buy 2 get 1"}>{bnNode("Buy 2 get 1")}</option>
                </select>
              </label>
              <label className="field">{bnNode("Value")}<input
                  type="number"
                  min="0"
                  max="100000"
                  name="value"
                  defaultValue={edit === "new" ? 10 : edit.value}
                />
              </label>
              <label className="field">{bnNode("Minimum order (BDT)")}<input
                  type="number"
                  min="0"
                  name="minimum"
                  defaultValue={edit === "new" ? 500 : edit.minimum}
                />
              </label>
              <label className="field">{bnNode("Usage limit")}<input
                  type="number"
                  min="1"
                  name="limit"
                  defaultValue={edit === "new" ? 500 : edit.limit}
                />
              </label>
              <label className="field">{bnNode("Per-customer limit")}<input
                  type="number"
                  min="1"
                  name="perUser"
                  defaultValue={edit === "new" ? 1 : edit.perUser}
                />
              </label>
              <label className="field">{bnNode("Applies to")}<select
                  name="scope"
                  defaultValue={edit === "new" ? "All products" : edit.scope}
                >
                  <option value={"All products"}>{bnNode("All products")}</option>
                  {bnNode(s.categories
                    .filter((c) => !c.parent)
                    .map((c) => (
                      <option key={c.id} value={c.name}>{bnNode(c.name)}</option>
                    )))}
                  {bnNode(s.products.map((p) => (
                    <option key={p.id} value={"Product: " + p.id}>
                      {bnNode(p.name)}
                    </option>
                  )))}
                  <option value="Brand: Nirbhor">{bnNode("Brand: Nirbhor")}</option>
                </select>
              </label>
              <label className="field">{bnNode("Start date")}<input
                  type="date"
                  name="start"
                  required
                  defaultValue={edit === "new" ? "2026-10-26" : edit.start}
                />
              </label>
              <label className="field">{bnNode("End date")}<input
                  type="date"
                  name="end"
                  required
                  defaultValue={edit === "new" ? "2027-12-31" : edit.end}
                />
              </label>
            </div>
            <label className="check-label">
              <input
                name="active"
                type="checkbox"
                defaultChecked={edit === "new" || edit.active}
              />{bnNode("Active on the storefront")}</label>
            <p className="small muted">{bnNode("Buy 2 get 1 makes every third eligible item free, starting with the lowest-priced items.")}</p>
            <Button type="submit">{bnNode("Save offer ")}<Check size={16} />
            </Button>
          </form>
        </Modal>
      ))}
    </>
  );
}

const campaignToggles: [keyof Campaign, string, string][] = [
  [
    "announcementEnabled",
    "Announcement bar",
    "Introduce your offer with a little clarity.",
  ],
  ["discount", "Discount badge", "Give the offer a clear little label."],
  ["countdown", "Countdown timer", "Use the campaign’s real end date."],
  [
    "urgency",
    "Limited-stock message",
    "A little urgency, grounded in real stock.",
  ],
  ["stock", "Stock counter", "Show current available inventory."],
  ["bundles", "Bundle offers", "One jar, two jars, or a little extra."],
  ["quickOrder", "Quick COD order form", "A simple, no-account order flow."],
  ["sticky", "Sticky order button", "Keep the next step close on mobile."],
  ["source", "Source & batch story", "Make the origin beautifully clear."],
  ["trust", "Trust blocks", "Honest reasons to feel good choosing."],
  ["reviews", "Customer reviews", "Let your community share the good."],
  ["faq", "Frequently asked questions", "A little clarity at the right time."],
];
export function CampaignsAdmin() {
  const s = useStore();
  const [id, setId] = useState(s.campaigns[0]?.id || ""),
    [dirty, setDirty] = useState(false);
  const initial = s.campaigns.find((c) => c.id === id);
  const [draft, setDraft] = useState<Campaign | undefined>(initial);
  useEffect(() => {
    setDraft(s.campaigns.find((c) => c.id === id));
    setDirty(false);
  }, [id]);
  const set = (key: keyof Campaign, value: any) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
    setDirty(true);
  };
  return (
    <>
      <AdminTitle
        title={bnNode("Give your good finds a moment.")}
        text="A campaign experience with the right story, the right offer, and a little care."
      >
        <Button
          variant="outline"
          onClick={() => {
            const p = s.products[0];
            const c: Campaign = {
              ...s.campaigns[0],
              id: uid("camp"),
              name: "A new little campaign",
              headline: p.name,
              productId: p.id,
              active: false,
              blockOrder: ["source", "trust", "reviews", "faq"],
            };
            s.setCampaigns((x) => [...x, c]);
            setId(c.id);
            setDraft(c);
          }}
        >
          <Plus size={16} />{bnNode("New campaign")}</Button>
        {bnNode(draft && (
          <Button
            onClick={() => {
              if (!draft.name || !draft.headline || draft.start > draft.end) {
                s.toast("Add a campaign name, headline, and valid dates.");
                return;
              }
              s.setCampaigns((x) => x.map((c) => (c.id === id ? draft : c)));
              s.setProducts((x) =>
                x.map((p) =>
                  p.id === draft.productId
                    ? { ...p, campaign: draft.active }
                    : p,
                ),
              );
              setDirty(false);
              s.toast("Your campaign experience is saved.");
            }}
          >
            <Check size={16} />
            {bnNode(dirty ? "Save changes" : "Save campaign")}
          </Button>
        ))}
      </AdminTitle>
      <div className="campaign-selector">
        {bnNode(s.campaigns.map((c) => (
          <button
            key={c.id}
            className={id === c.id ? "active" : ""}
            onClick={() => setId(c.id)}
          >
            <Sparkles size={16} />
            {bnNode(c.name)}
            <Status value={c.active ? "Active" : "Draft"} />
          </button>
        )))}
      </div>
      {bnNode(draft && (
        <div className="campaign-admin-grid">
          <div>
            <Panel
              title={bnNode("The campaign story.")}
              subtitle="The words and details that make it yours."
            >
              <div className="form-stack">
                {bnNode((["name", "headline", "announcement", "label"] as const).map(
                  (k) => (
                    <label className="field" key={k}>
                      {
                        bnNode({
                          name: "Campaign name",
                          headline: "Offer headline",
                          announcement: "Announcement bar text",
                          label: "Discount label",
                        }[k])
                      }
                      <input
                        value={draft[k]}
                        onChange={(e) => set(k, e.target.value)}
                      />
                    </label>
                  ),
                ))}
                <label className="field">{bnNode("Campaign product")}<select
                    value={draft.productId}
                    onChange={(e) => set("productId", e.target.value)}
                  >
                    {bnNode(s.products.map((p) => (
                      <option value={p.id} key={p.id}>
                        {bnNode(p.name)}
                      </option>
                    )))}
                  </select>
                </label>
                <div className="form-grid">
                  <label className="field">{bnNode("Starts")}<input
                      type="date"
                      value={draft.start}
                      onChange={(e) => set("start", e.target.value)}
                    />
                  </label>
                  <label className="field">{bnNode("Ends")}<input
                      type="datetime-local"
                      value={draft.end}
                      onChange={(e) => set("end", e.target.value)}
                    />
                  </label>
                </div>
                <label className="field">{bnNode("Traffic source / UTM")}<input
                    value={draft.utm}
                    onChange={(e) => set("utm", e.target.value)}
                  />
                </label>
                <Toggle
                  label="Campaign is active"
                  checked={draft.active}
                  onChange={(v) => set("active", v)}
                  description="Published products use this campaign experience."
                />
              </div>
            </Panel>
            <Panel
              title={bnNode("A little control over every block.")}
              subtitle="Switch on what matters. Keep the rest beautifully simple."
            >
              {bnNode(campaignToggles.map(([k, t, d]) => (
                <Toggle
                  key={k}
                  label={t}
                  description={d}
                  checked={
                    k === "announcementEnabled"
                      ? draft[k] !== false
                      : !!draft[k]
                  }
                  onChange={(v) => set(k, v)}
                />
              )))}
            </Panel>
          </div>
          <aside>
            <Panel title={bnNode("Your campaign, at a glance.")}>
              <div className="campaign-mini-preview">
                <div>{bnNode(draft.announcement || "A little seasonal goodness")}</div>
                <img
                  src={s.products.find((p) => p.id === draft.productId)?.image}
                  alt={bnNode("Campaign preview")}
                />
                {bnNode(draft.discount && <Badge tone="warm">{bnNode(draft.label)}</Badge>)}
                <h2>{bnNode(draft.headline)}</h2>
                <p>
                  {bnNode(draft.bundles
                    ? "A little bundle. A little more goodness."
                    : "Just good things. Beautifully simple.")}
                </p>
                <Button to={`/campaign/${draft.productId}`} target="_blank">{bnNode("Preview saved campaign ")}<Eye size={15} />
                </Button>
              </div>
            </Panel>
            <Panel
              title={bnNode("Put the story in order.")}
              subtitle="Arrange the sections below the product."
            >
              <div className="block-order">
                {bnNode(draft.blockOrder.map((key, i) => (
                  <div key={key}>
                    <Layers size={15} />
                    <b>
                      {bnNode(key === "source"
                        ? "Source story"
                        : key === "trust"
                          ? "Trust blocks"
                          : key === "reviews"
                            ? "Customer reviews"
                            : "Questions & answers")}
                    </b>
                    <button
                      disabled={i === 0}
                      aria-label={bnNode(`Move ${key} up`)}
                      onClick={() => {
                        const list = [...draft.blockOrder];
                        [list[i - 1], list[i]] = [list[i], list[i - 1]];
                        set("blockOrder", list);
                      }}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      disabled={i === draft.blockOrder.length - 1}
                      aria-label={bnNode(`Move ${key} down`)}
                      onClick={() => {
                        const list = [...draft.blockOrder];
                        [list[i + 1], list[i]] = [list[i], list[i + 1]];
                        set("blockOrder", list);
                      }}
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                )))}
              </div>
            </Panel>
            <Panel title={bnNode("A little link to share.")}>
              <code className="campaign-url">{bnNode("/campaign/")}{bnNode(draft.productId)}{bnNode("?utm_source=facebook")}</code>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    location.origin +
                      `/campaign/${draft.productId}?utm_source=facebook`,
                  );
                  s.toast("Campaign URL copied.");
                }}
              >
                <Copy size={14} />{bnNode("Copy campaign link")}</Button>
            </Panel>
            <div className="preview-note">
              <Leaf size={15} />{bnNode(" Preview updates after saving your changes.")}</div>
          </aside>
        </div>
      ))}
    </>
  );
}

export function BannersAdmin() {
  const s = useStore();
  const [edit, setEdit] = useState<Banner | "new">();
  return (
    <>
      <AdminTitle
        title={bnNode("First impressions, thoughtfully made.")}
        text="A little story, a seasonal offer, or a new reason to explore."
      >
        <Button onClick={() => setEdit("new")}>
          <Plus size={16} />{bnNode("Add a slide")}</Button>
      </AdminTitle>
      <div className="banner-admin-list">
        {bnNode([...s.banners]
          .sort((a, b) => a.order - b.order)
          .map((b, i) => (
            <Panel
              key={b.id}
              title={bnNode(`0${i + 1} · ${b.title.replace("\n", " ")}`)}
              subtitle={b.subtitle}
              action={<Status value={b.active ? "Active" : "Draft"} />}
            >
              <div className="banner-admin-body">
                <img src={b.image} alt={bnNode(b.title)} />
                <div>
                  <span className="small muted">{bnNode("LINK DESTINATION")}</span>
                  <p>{bnNode(b.link)}</p>
                  <span className="small muted">{bnNode("BUTTON TEXT")}</span>
                  <p>{bnNode(b.cta)}</p>
                  <div className="row-actions">
                    <Button variant="outline" onClick={() => setEdit(b)}>
                      <Edit3 size={14} />{bnNode("Edit slide")}</Button>
                    <button
                      className="icon-btn"
                      aria-label={bnNode("Move slide up")}
                      disabled={i === 0}
                      onClick={() => {
                        const ordered = [...s.banners].sort(
                          (a, b) => a.order - b.order,
                        );
                        const prev = ordered[i - 1];
                        s.setBanners((x) =>
                          x.map((v) =>
                            v.id === b.id
                              ? { ...v, order: prev.order }
                              : v.id === prev.id
                                ? { ...v, order: b.order }
                                : v,
                          ),
                        );
                        s.toast("Slide order updated.");
                      }}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      className="icon-btn"
                      aria-label={bnNode("Delete slide")}
                      onClick={() => {
                        s.setBanners((x) => x.filter((v) => v.id !== b.id));
                        s.toast("Slide removed.");
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <Toggle
                    label="Visible on the homepage"
                    checked={b.active}
                    onChange={(v) =>
                      s.setBanners((x) =>
                        x.map((y) => (y.id === b.id ? { ...y, active: v } : y)),
                      )
                    }
                  />
                </div>
              </div>
            </Panel>
          )))}
      </div>
      {bnNode(edit && (
        <Modal
          title={bnNode("A little care for your first impression.")}
          onClose={() => setEdit(undefined)}
          wide
        >
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget),
                b: Banner = {
                  id: edit === "new" ? uid("b") : edit.id,
                  title: String(f.get("title")),
                  subtitle: String(f.get("subtitle")),
                  cta: String(f.get("cta")),
                  link: String(f.get("link")),
                  image: String(f.get("image")),
                  order: Number(f.get("order")),
                  active: !!f.get("active"),
                  start: String(f.get("start")),
                  end: String(f.get("end")),
                };
              if (b.start && b.end && b.start > b.end) {
                s.toast("The end date should follow the start date.");
                return;
              }
              s.setBanners((x) =>
                edit === "new"
                  ? [...x, b]
                  : x.map((y) => (y.id === b.id ? b : y)),
              );
              s.toast("Your homepage slide is saved.");
              setEdit(undefined);
            }}
          >
            <div className="form-grid">
              <label className="field">{bnNode("Headline (new line supported)")}<textarea
                  name="title"
                  rows={2}
                  required
                  defaultValue={edit === "new" ? "" : edit.title}
                />
              </label>
              <label className="field">{bnNode("Supporting text")}<textarea
                  name="subtitle"
                  rows={2}
                  required
                  defaultValue={edit === "new" ? "" : edit.subtitle}
                />
              </label>
              <label className="field">{bnNode("CTA text")}<input
                  name="cta"
                  required
                  defaultValue={
                    edit === "new" ? "Explore the goodness" : edit.cta
                  }
                />
              </label>
              <label className="field">{bnNode("Link destination")}<input
                  name="link"
                  required
                  defaultValue={edit === "new" ? "/shop" : edit.link}
                />
              </label>
              <label className="field">{bnNode("Desktop / responsive image URL")}<input
                  name="image"
                  required
                  defaultValue={
                    edit === "new" ? "/assets/hero.webp" : edit.image
                  }
                />
              </label>
              <label className="field">{bnNode("Slide order")}<input
                  name="order"
                  type="number"
                  min="0"
                  defaultValue={edit === "new" ? s.banners.length : edit.order}
                />
              </label>
              <label className="field">{bnNode("Scheduled start (optional)")}<input
                  name="start"
                  type="datetime-local"
                  defaultValue={edit === "new" ? "" : edit.start}
                />
              </label>
              <label className="field">{bnNode("Scheduled end (optional)")}<input
                  name="end"
                  type="datetime-local"
                  defaultValue={edit === "new" ? "" : edit.end}
                />
              </label>
            </div>
            <label className="check-label">
              <input
                name="active"
                type="checkbox"
                defaultChecked={edit === "new" || edit.active}
              />{bnNode("Show on the homepage")}</label>
            <Button type="submit">{bnNode("Save your slide ")}<Check size={16} />
            </Button>
          </form>
        </Modal>
      ))}
    </>
  );
}

export function ReviewsAdmin() {
  const s = useStore();
  const [filter, setFilter] = useState("All reviews"),
    [selected, setSelected] = useState<Review>();
  const rows = s.reviews.filter(
    (r) => filter === "All reviews" || r.status === filter,
  );
  return (
    <>
      <AdminTitle
        title={bnNode("Let the good words be heard.")}
        text="A little moderation to keep your community honest, helpful, and welcoming."
      />
      <div className="stats-grid three">
        <Stat
          label="Community stories"
          value={String(s.reviews.length)}
          icon={MessageSquare}
          caption="customer reviews"
        />
        <Stat
          label="Ready for a read"
          value={String(s.reviews.filter((r) => r.status === "Pending").length)}
          icon={Star}
          caption="awaiting moderation"
        />
        <Stat
          label="In the spotlight"
          value={String(s.reviews.filter((r) => r.featured).length)}
          icon={Eye}
          caption="featured customer stories"
        />
      </div>
      <section className="admin-panel">
        <div className="admin-table-tabs">
          {bnNode(["All reviews", "Pending", "Approved", "Rejected"].map((t) => (
            <button
              className={filter === t ? "active" : ""}
              key={t}
              onClick={() => setFilter(t)}
            >
              {bnNode(t)}
            </button>
          )))}
        </div>
        <div className="moderation-list">
          {bnNode(rows.map((r) => (
            <article key={r.id}>
              <div className="moderation-head">
                <div>
                  <b>{bnNode(r.name)}</b>
                  <span>
                    {bnNode(s.products.find((p) => p.id === r.productId)?.name)}{bnNode(" ·")}{bnNode(" ")}
                    {bnNode(r.date.slice(0, 10))}
                  </span>
                </div>
                <Status value={r.status} />
              </div>
              <span className="stars">
                {bnNode("★".repeat(r.rating))}
                {bnNode("☆".repeat(5 - r.rating))}
              </span>
              <h3>{bnNode(r.title)}</h3>
              <p>{bnNode(r.text)}</p>
              <div className="moderation-actions">
                {bnNode(r.verified && <Badge>{bnNode("Verified purchase")}</Badge>)}
                {bnNode(r.media && <Badge>{bnNode("Media attached")}</Badge>)}
                <button className="text-button" onClick={() => setSelected(r)}>{bnNode("Read & reply ")}<ArrowUpRight size={13} />
                </button>
                <Button
                  variant="outline"
                  onClick={() => {
                    s.setReviews((x) =>
                      x.map((y) =>
                        y.id === r.id ? { ...y, status: "Approved" } : y,
                      ),
                    );
                    s.toast("Review approved. A little goodness shared.");
                  }}
                >
                  <Check size={14} />{bnNode("Approve")}</Button>
                <button
                  className="icon-btn"
                  aria-label={bnNode("Reject review")}
                  onClick={() => {
                    s.setReviews((x) =>
                      x.map((y) =>
                        y.id === r.id ? { ...y, status: "Rejected" } : y,
                      ),
                    );
                    s.toast("Review moved to rejected.");
                  }}
                >
                  <X size={17} />
                </button>
              </div>
            </article>
          )))}
        </div>
      </section>
      {bnNode(selected && (
        <Modal
          title={bnNode("A little reply goes a long way.")}
          onClose={() => setSelected(undefined)}
        >
          <h3>{bnNode(selected.title)}</h3>
          <p className="muted">{bnNode(selected.text)}</p>
          {bnNode(selected.media &&
            (selected.media.startsWith("data:video") ? (
              <video controls src={selected.media} className="review-media" />
            ) : (
              <img
                src={selected.media}
                alt={bnNode("Customer uploaded review")}
                className="review-media"
              />
            )))}
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              s.setReviews((x) =>
                x.map((r) =>
                  r.id === selected.id
                    ? {
                        ...r,
                        reply: String(f.get("reply")),
                        featured: !!f.get("featured"),
                        status: String(f.get("status")),
                      }
                    : r,
                ),
              );
              s.toast("Review updated.");
              setSelected(undefined);
            }}
          >
            <label className="field">{bnNode("A reply from NIRBHOR")}<textarea name="reply" rows={3} defaultValue={selected.reply} />
            </label>
            <label className="field">{bnNode("Moderation status")}<select name="status" defaultValue={selected.status}>
                <option value={"Pending"}>{bnNode("Pending")}</option>
                <option value={"Approved"}>{bnNode("Approved")}</option>
                <option value={"Rejected"}>{bnNode("Rejected")}</option>
              </select>
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={selected.featured}
              />{bnNode("Feature on the homepage")}</label>
            <Button type="submit">{bnNode("Save review ")}<Check size={15} />
            </Button>
          </form>
        </Modal>
      ))}
    </>
  );
}

export function ContentAdmin() {
  const s = useStore();
  const [tab, setTab] = useState("Homepage"),
    [page, setPage] = useState("about");
  const homeFields = [
    [
      "categoryHeading",
      "Category section heading",
      "Good things, in every corner.",
    ],
    [
      "popularHeading",
      "Popular products heading",
      "The ones you keep coming back for.",
    ],
    ["newsletter", "Newsletter heading", "Stay close to the good stuff."],
  ];
  return (
    <>
      <AdminTitle
        title={bnNode("Make the good story yours.")}
        text="The little words and useful details that bring your storefront together."
      />
      <div className="settings-tabs">
        {bnNode(["Homepage", "FAQs", "Static pages", "Trust blocks"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {bnNode(t)}
          </button>
        )))}
      </div>
      <Panel
        title={
          bnNode(tab === "Homepage"
            ? "A little homepage personality."
            : tab === "FAQs"
              ? "A little clarity for your customers."
              : tab === "Trust blocks"
                ? "Good reasons to feel at home."
                : "Pages with a little purpose.")
        }
      >
        <form
          key={tab + page}
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const values = Object.fromEntries(
              [...f.entries()].map(([k, v]) => [k, String(v)]),
            );
            s.setContent((x) => ({ ...x, ...values }));
            s.toast("Your story is saved.");
          }}
        >
          {bnNode(tab === "Homepage" ? (
            homeFields.map(([k, t, d]) => (
              <label className="field" key={k}>
                {bnNode(t)}
                <input name={k} defaultValue={s.content[k] || d} />
              </label>
            ))
          ) : tab === "FAQs" ? (
            [0, 1, 2, 3, 4].map((i) => (
              <label className="field" key={i}>{bnNode("Answer ")}{bnNode(i + 1)}
                <textarea
                  rows={3}
                  name={`faq-${i}`}
                  defaultValue={s.content[`faq-${i}`] || ""}
                  placeholder={bnNode("Leave blank to use the default answer")}
                />
              </label>
            ))
          ) : tab === "Trust blocks" ? (
            [
              "Honest ingredients",
              "Thoughtfully sourced",
              "Delivered with care",
              "Shop with confidence",
            ].map((t, i) => (
              <div className="form-grid" key={t}>
                <label className="field">{bnNode("Trust heading ")}{bnNode(i + 1)}
                  <input
                    name={`trust-heading-${i}`}
                    defaultValue={s.content[`trust-heading-${i}`] || t}
                  />
                </label>
                <label className="field">{bnNode("Supporting line")}<input
                    name={`trust-text-${i}`}
                    defaultValue={s.content[`trust-text-${i}`] || ""}
                  />
                </label>
              </div>
            ))
          ) : (
            <>
              <label className="field">{bnNode("Page")}<select value={page} onChange={(e) => setPage(e.target.value)}>
                  {bnNode([
                    "about",
                    "contact",
                    "privacy",
                    "terms",
                    "returns",
                    "shipping",
                    "sourcing",
                  ].map((x) => (
                    <option key={x} value={x}>{bnNode(x)}</option>
                  )))}
                </select>
              </label>
              <label className="field">{bnNode("Page title")}<input
                  name={`page-title-${page}`}
                  defaultValue={s.content[`page-title-${page}`] || ""}
                  placeholder={bnNode("Leave blank for the default title")}
                />
              </label>
              <label className="field">{bnNode("Page body (paragraphs separated by blank lines)")}<textarea
                  name={`page-body-${page}`}
                  rows={12}
                  defaultValue={s.content[`page-body-${page}`] || ""}
                  placeholder={bnNode("Your carefully written page content…")}
                />
              </label>
              <Link
                className="text-link"
                to={
                  page === "about" || page === "contact"
                    ? "/" + page
                    : "/page/" + page
                }
                target="_blank"
              >{bnNode("Preview saved page ")}<ArrowUpRight size={14} />
              </Link>
            </>
          ))}
          <Button type="submit">{bnNode("Save your story ")}<Check size={16} />
          </Button>
        </form>
      </Panel>
    </>
  );
}

export function AnalyticsAdmin() {
  const s = useStore();
  const [period, setPeriod] = useState("30"),
    [tab, setTab] = useState("Products");
  const revenue = s.orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((n, o) => n + o.total, 0);
  return (
    <>
      <AdminTitle
        title={bnNode("A little insight. A lot of possibility.")}
        text="Understand the good choices your customers make, and what brings them back."
      >
        <select
          aria-label={bnNode("Analytics period")}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="7">{bnNode("Last 7 days")}</option>
          <option value="30">{bnNode("Last 30 days")}</option>
          <option value="90">{bnNode("Last 90 days")}</option>
        </select>
        <Button
          variant="outline"
          onClick={() =>
            exportCSV(
              "nirbhor-analytics",
              s.products.map((p) => ({
                product: p.name,
                category: p.category,
                localUnits: s.orders.reduce(
                  (n, o) =>
                    n +
                    o.items
                      .filter((i) => i.id === p.id)
                      .reduce((n, i) => n + i.quantity, 0),
                  0,
                ),
                price: p.price,
                stock: p.stock,
              })),
            )
          }
        >
          <Download size={15} />{bnNode("Export report")}</Button>
      </AdminTitle>
      <div className="stats-grid">
        <Stat
          label="Local revenue"
          value={money(revenue)}
          icon={Activity}
          caption="actual preview order records"
        />
        <Stat
          label="Orders"
          value={String(s.orders.length)}
          icon={ShoppingBag}
          caption="actual preview order records"
        />
        <Stat
          label="Repeat customer rate"
          value={period === "7" ? "24.8%" : "28.6%"}
          change="3.2%"
          icon={Users}
          caption="sample data"
        />
        <Stat
          label="Cart recovery opportunity"
          value={period === "7" ? "৳18,420" : "৳64,280"}
          icon={ShoppingBag}
          caption="sample abandoned cart value"
        />
      </div>
      <div className="dashboard-main-grid">
        <Panel title={bnNode("Good growth, over time.")} subtitle="Sample revenue trend">
          <SalesChart period={period} />
        </Panel>
        <Panel
          title={bnNode("Where the goodness begins.")}
          subtitle="Sample traffic sources"
        >
          <div className="traffic-bars">
            {bnNode([
              ["Facebook / Instagram", 64],
              ["Direct visits", 20],
              ["Organic search", 11],
              ["Other", 5],
            ].map(([n, v]) => (
              <div key={String(n)}>
                <span>
                  {bnNode(n)}
                  <b>{bnNode(v)}{bnNode("%")}</b>
                </span>
                <progress max="100" value={Number(v)} />
              </div>
            )))}
          </div>
          <div className="analytics-mini">
            <span>{bnNode("Checkout completion ")}<b>{bnNode("62.4%")}</b>
            </span>
            <span>{bnNode("Repeat purchase ")}<b>{bnNode("28.6%")}</b>
            </span>
            <span>{bnNode("Cart abandonment ")}<b>{bnNode("37.6%")}</b>
            </span>
          </div>
        </Panel>
      </div>
      <Panel
        title={bnNode("What’s finding its people.")}
        subtitle="Performance from local order records."
      >
        <div className="admin-table-tabs">
          {bnNode(["Products", "Categories", "Campaigns", "Searches", "Discounts"].map(
            (t) => (
              <button
                className={tab === t ? "active" : ""}
                key={t}
                onClick={() => setTab(t)}
              >
                {bnNode(t)}
              </button>
            ),
          ))}
        </div>
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{bnNode(tab)}</th>
                <th>
                  {bnNode(tab === "Searches" ? "Search count" : "Orders / units")}
                </th>
                <th>
                  {bnNode(tab === "Searches" ? "Last searched" : "Revenue / saving")}
                </th>
              </tr>
            </thead>
            <tbody>
              {bnNode(tab === "Products"
                ? s.products.map((p) => {
                    const units = s.orders.reduce(
                      (n, o) =>
                        n +
                        o.items
                          .filter((i) => i.id === p.id)
                          .reduce((n, i) => n + i.quantity, 0),
                      0,
                    );
                    return (
                      <tr key={p.id}>
                        <td>{bnNode(p.name)}</td>
                        <td>{bnNode(units)}</td>
                        <td>{bnNode(money(units * p.price))}</td>
                      </tr>
                    );
                  })
                : tab === "Categories"
                  ? s.categories
                      .filter((c) => !c.parent)
                      .map((c) => {
                        const ids = s.products
                          .filter((p) => p.category === c.name)
                          .map((p) => p.id);
                        const items = s.orders
                          .flatMap((o) => o.items)
                          .filter((i) => ids.includes(i.id));
                        return (
                          <tr key={c.id}>
                            <td>{bnNode(c.name)}</td>
                            <td>{bnNode(items.reduce((n, i) => n + i.quantity, 0))}</td>
                            <td>
                              {bnNode(money(
                                items.reduce(
                                  (n, i) =>
                                    n +
                                    i.quantity *
                                      (s.products.find((p) => p.id === i.id)
                                        ?.price || 0),
                                  0,
                                ),
                              ))}
                            </td>
                          </tr>
                        );
                      })
                  : tab === "Campaigns"
                    ? s.campaigns.map((c) => (
                        <tr key={c.id}>
                          <td>{bnNode(c.name)}</td>
                          <td>
                            {
                              bnNode(s.orders.filter(
                                (o) =>
                                  o.note === "Campaign quick order" &&
                                  o.items.some((i) => i.id === c.productId),
                              ).length)
                            }
                          </td>
                          <td>
                            {bnNode(money(
                              s.orders
                                .filter(
                                  (o) =>
                                    o.note === "Campaign quick order" &&
                                    o.items.some((i) => i.id === c.productId),
                                )
                                .reduce((n, o) => n + o.total, 0),
                            ))}
                          </td>
                        </tr>
                      ))
                    : tab === "Searches"
                      ? s.events
                          .filter((e) => e.name === "Search")
                          .slice(0, 12)
                          .map((e) => (
                            <tr key={e.id}>
                              <td>{bnNode(e.detail || "(empty query)")}</td>
                              <td>{bnNode("1")}</td>
                              <td>{bnNode(new Date(e.date).toLocaleString("bn-BD"))}</td>
                            </tr>
                          ))
                      : s.coupons.map((c) => (
                          <tr key={c.id}>
                            <td>{bnNode(c.code)}</td>
                            <td>{bnNode(c.uses)}{bnNode(" redemptions")}</td>
                            <td>
                              {bnNode(c.type === "Percentage"
                                ? c.value + "%"
                                : money(c.value))}
                            </td>
                          </tr>
                        )))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

export function PixelAdmin() {
  const s = useStore();
  const [filter, setFilter] = useState("All events");
  const eventTypes = [
    "PageView",
    "ViewContent",
    "Search",
    "AddToCart",
    "InitiateCheckout",
    "Purchase",
  ];
  return (
    <>
      <AdminTitle
        title={bnNode("See the little steps that lead to good.")}
        text="Configure your Meta Pixel and inspect storefront events in this browser."
      >
        <Button
          variant="outline"
          onClick={() => {
            s.track("PageView", "Test event · admin preview");
            s.toast("Local test event recorded. No external request sent.");
          }}
        >
          <Zap size={16} />{bnNode("Test local event")}</Button>
      </AdminTitle>
      <div className="pixel-notice">
        <Shield size={22} />
        <div>
          <b>{bnNode("Preview tracking. Privacy first.")}</b>
          <p>{bnNode("These events stay on this browser. Your Pixel ID and mappings are ready for the backend phase; nothing is sent to Meta.")}</p>
        </div>
        <Badge tone="neutral">{bnNode("External events off")}</Badge>
      </div>
      <div className="campaign-admin-grid">
        <Panel title={bnNode("Your little connection settings.")}>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              s.setSettings((x) => ({
                ...x,
                pixel: String(f.get("pixel")),
                pixelEnabled: !!f.get("enabled"),
              }));
              s.toast("Pixel configuration saved for backend integration.");
            }}
          >
            <label className="field">{bnNode("Meta Pixel ID")}<input
                name="pixel"
                pattern="[0-9]{8,20}"
                required
                defaultValue={s.settings.pixel}
              />
            </label>
            <label className="check-label">
              <input
                name="enabled"
                type="checkbox"
                defaultChecked={s.settings.pixelEnabled}
              />{bnNode("Enable tracking configuration")}</label>
            <p className="small muted">{bnNode("Enabling this stores your preference. External event delivery will be connected with the backend.")}</p>
            {bnNode(eventTypes.map((name) => (
              <Toggle
                key={name}
                checked={s.content["pixel-" + name] !== "off"}
                onChange={(v) =>
                  s.setContent((x) => ({
                    ...x,
                    ["pixel-" + name]: v ? "on" : "off",
                  }))
                }
                label={name}
                description={`Map storefront ${name} events to Meta.`}
              />
            )))}
            <Button type="submit">{bnNode("Save configuration ")}<Check size={15} />
            </Button>
          </form>
        </Panel>
        <Panel
          title={bnNode("Your local conversion funnel.")}
          subtitle="Real preview interactions, counted on this browser."
        >
          <div className="pixel-funnel">
            {bnNode(eventTypes.map((name, i) => {
              const n = s.events.filter((e) => e.name === name).length;
              return (
                <div key={name}>
                  <span style={{ width: 100 - i * 10 + "%" }}>
                    {bnNode(name)}
                    <b>{bnNode(n)}</b>
                  </span>
                </div>
              );
            }))}
          </div>
        </Panel>
      </div>
      <Panel
        title={bnNode("A little activity log.")}
        subtitle={`${s.events.length} locally recorded events`}
        action={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label={bnNode("Filter pixel events")}
          >
            <option value={"All events"}>{bnNode("All events")}</option>
            {bnNode(eventTypes.map((x) => (
              <option key={x} value={x}>{bnNode(x)}</option>
            )))}
          </select>
        }
      >
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{bnNode("Event")}</th>
                <th>{bnNode("Details")}</th>
                <th>{bnNode("Recorded")}</th>
                <th>{bnNode("Status")}</th>
              </tr>
            </thead>
            <tbody>
              {bnNode(s.events
                .filter((e) => filter === "All events" || e.name === filter)
                .slice(0, 30)
                .map((e) => (
                  <tr key={e.id}>
                    <td>
                      <b>{bnNode(e.name)}</b>
                    </td>
                    <td>{bnNode(e.detail)}</td>
                    <td>{bnNode(new Date(e.date).toLocaleString("bn-BD"))}</td>
                    <td>
                      <Badge tone="neutral">{bnNode("Local only")}</Badge>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

export function SettingsAdmin() {
  const s = useStore();
  const [tab, setTab] = useState("Store details");
  const [draft, setDraft] = useState(s.settings);
  const set = (key: keyof Settings, value: any) =>
    setDraft((x) => ({ ...x, [key]: value }));
  return (
    <>
      <AdminTitle
        title={bnNode("Your store. Your little details.")}
        text="Fine-tune the essentials behind a thoughtful shopping experience."
      >
        <Button
          onClick={() => {
            if (
              [draft.dhaka, draft.outside, draft.freeShipping, draft.tax].some(
                (v) => !Number.isFinite(v) || v < 0,
              ) ||
              draft.tax > 100 ||
              !draft.name.trim()
            ) {
              s.toast(
                "Please check the store name and non-negative charges. Tax must be 0–100%.",
              );
              return;
            }
            s.setSettings(draft);
            document.documentElement.style.setProperty("--green", draft.color);
            s.toast("Store settings saved.");
          }}
        >
          <Check size={16} />{bnNode("Save settings")}</Button>
      </AdminTitle>
      <div className="settings-layout">
        <div className="settings-nav">
          {bnNode([
            "Store details",
            "Branding",
            "Shipping & delivery",
            "Payments",
            "Notifications",
            "SEO & social",
          ].map((t) => (
            <button
              className={tab === t ? "active" : ""}
              key={t}
              onClick={() => setTab(t)}
            >
              {bnNode(t)}
              <ChevronRight size={14} />
            </button>
          )))}
        </div>
        <Panel
          title={bnNode(tab)}
          subtitle="A little care for the things that make your store yours."
        >
          <div className="form-stack">
            {bnNode(tab === "Store details" ? (
              <>
                {bnNode((
                  [
                    "name",
                    "tagline",
                    "email",
                    "phone",
                    "address",
                    "currency",
                  ] as const
                ).map((k) => (
                  <label className="field" key={k}>
                    {
                      bnNode({
                        name: "Store name",
                        tagline: "Brand tagline",
                        email: "Support email",
                        phone: "Support phone",
                        address: "Business address",
                        currency: "Currency",
                      }[k])
                    }
                    <input
                      value={draft[k]}
                      onChange={(e) => set(k, e.target.value)}
                    />
                  </label>
                )))}
                <label className="field">{bnNode("Tax rate (%)")}<input
                    type="number"
                    min="0"
                    max="100"
                    value={draft.tax}
                    onChange={(e) => set("tax", Number(e.target.value))}
                  />
                </label>
              </>
            ) : tab === "Branding" ? (
              <>
                <div
                  className="branding-preview"
                  style={{ background: draft.color }}
                >
                  <Leaf size={29} />
                  <h2>{bnNode(draft.name)}</h2>
                  <p>{bnNode(draft.tagline)}</p>
                </div>
                <label className="field">{bnNode("Primary brand colour")}<input
                    type="color"
                    value={draft.color}
                    onChange={(e) => set("color", e.target.value)}
                  />
                </label>
                <label className="field">{bnNode("Wordmark text")}<input
                    value={draft.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </label>
                <p className="muted small">{bnNode("The wordmark uses the shared brand typeface. Your primary colour updates buttons and key storefront accents.")}</p>
              </>
            ) : tab === "Shipping & delivery" ? (
              <>
                {bnNode((["dhaka", "outside", "freeShipping"] as const).map((k) => (
                  <label className="field" key={k}>
                    {
                      bnNode({
                        dhaka: "Delivery charge within Dhaka (BDT)",
                        outside: "Outside Dhaka delivery charge (BDT)",
                        freeShipping: "Free delivery threshold (BDT)",
                      }[k])
                    }
                    <input
                      type="number"
                      min="0"
                      value={draft[k]}
                      onChange={(e) => set(k, Number(e.target.value))}
                    />
                  </label>
                )))}
                <div className="shipping-zone-preview">
                  <MapPin size={22} />
                  <div>
                    <b>{bnNode("Dhaka · 1–2 working days")}</b>
                    <p>{bnNode("Standard delivery · ")}{bnNode(money(draft.dhaka))}</p>
                  </div>
                </div>
                <div className="shipping-zone-preview">
                  <Truck size={22} />
                  <div>
                    <b>{bnNode("Outside Dhaka · 3–5 working days")}</b>
                    <p>{bnNode("Nationwide delivery · ")}{bnNode(money(draft.outside))}</p>
                  </div>
                </div>
                <p className="small muted">{bnNode("Courier integrations and live serviceability will be connected with the backend.")}</p>
              </>
            ) : tab === "Payments" ? (
              <>
                <Toggle
                  checked={draft.cod}
                  onChange={(v) => set("cod", v)}
                  label="Cash on delivery"
                  description="A simple way for customers to pay at their doorstep."
                />
                <Toggle
                  checked={draft.online}
                  onChange={(v) => set("online", v)}
                  label="Online payment preview"
                  description="Show card / mobile banking as an unpaid preview. No real charge is made."
                />
                <div className="payment-gateway-card">
                  <CreditCard size={30} />
                  <h3>{bnNode("Ready for local payments.")}</h3>
                  <p>{bnNode("SSLCommerz, cards and mobile banking will be connected securely with your backend. Credentials are never stored in this frontend.")}</p>
                  <Badge tone="neutral">{bnNode("Gateway integration pending")}</Badge>
                </div>
              </>
            ) : tab === "Notifications" ? (
              <>
                <Toggle
                  checked={draft.notifications}
                  onChange={(v) => set("notifications", v)}
                  label="Store notifications"
                  description="Store order and delivery updates in the preview notification centre."
                />
                <Toggle
                  checked={draft.newsletter}
                  onChange={(v) => set("newsletter", v)}
                  label="Newsletter signup"
                  description="Show the newsletter form in your storefront footer."
                />
                {bnNode([
                  "New order",
                  "Order confirmation",
                  "Shipping update",
                  "Delivery update",
                  "Low stock",
                  "Refund update",
                  "Review request",
                ].map((t) => (
                  <Toggle
                    key={t}
                    checked={s.content["notify-" + t] !== "off"}
                    onChange={(v) =>
                      s.setContent((x) => ({
                        ...x,
                        ["notify-" + t]: v ? "on" : "off",
                      }))
                    }
                    label={t}
                    description="Save this preference for email / SMS integration."
                  />
                )))}
              </>
            ) : (
              <>
                <label className="field">{bnNode("Default SEO title")}<input
                    value={draft.seoTitle}
                    onChange={(e) => set("seoTitle", e.target.value)}
                    maxLength={70}
                  />
                </label>
                <label className="field">{bnNode("Meta description")}<textarea
                    rows={3}
                    value={draft.seoDescription}
                    onChange={(e) => set("seoDescription", e.target.value)}
                    maxLength={180}
                  />
                </label>
                <label className="field">{bnNode("Facebook page URL")}<input
                    type="url"
                    value={draft.social}
                    onChange={(e) => set("social", e.target.value)}
                  />
                </label>
                <div className="seo-preview">
                  <span>{bnNode("nirbhor.com")}</span>
                  <h3>{bnNode(draft.seoTitle)}</h3>
                  <p>{bnNode(draft.seoDescription)}</p>
                </div>
                <Link className="text-link" to="/admin/pixel">{bnNode("Configure Meta Pixel ")}<ArrowUpRight size={13} />
                </Link>
              </>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
};
const defaultTeam: TeamMember[] = [
  {
    id: "owner",
    name: "Nur Rahman",
    email: "nur@nirbhor.com",
    role: "Super Admin",
    permissions: [
      "Products",
      "Orders",
      "Customers",
      "Marketing",
      "Content",
      "Settings",
    ],
  },
];
export function TeamAdmin() {
  const s = useStore();
  const team: TeamMember[] = (() => {
    try {
      return JSON.parse(s.content.team || "null") || defaultTeam;
    } catch {
      return defaultTeam;
    }
  })();
  const [edit, setEdit] = useState<TeamMember | "new">();
  return (
    <>
      <AdminTitle
        title={bnNode("Good people, in the right places.")}
        text="Give your team the little controls they need to care for your store."
      >
        <Button onClick={() => setEdit("new")}>
          <Plus size={16} />{bnNode("Add team member")}</Button>
      </AdminTitle>
      <div className="pixel-notice">
        <Shield size={22} />
        <div>
          <b>{bnNode("Permission design preview")}</b>
          <p>{bnNode("Roles and permissions are saved locally. Secure sign-in, invitations and access enforcement will be handled by the backend.")}</p>
        </div>
      </div>
      <Panel title={bnNode("Your little team.")}>
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{bnNode("Team member")}</th>
                <th>{bnNode("Role")}</th>
                <th>{bnNode("Permissions")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bnNode(team.map((m) => (
                <tr key={m.id}>
                  <td>
                    <b>{bnNode(m.name)}</b>
                    <small>{bnNode(m.email)}</small>
                  </td>
                  <td>
                    <Badge>{bnNode(m.role)}</Badge>
                  </td>
                  <td>{bnNode(m.permissions.join(", "))}</td>
                  <td>
                    <button
                      className="icon-btn"
                      aria-label={bnNode(`Edit ${m.name} permissions`)}
                      onClick={() => setEdit(m)}
                    >
                      <Edit3 size={15} />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </Panel>
      {bnNode(edit && (
        <Modal
          title={bnNode("A little role in something good.")}
          onClose={() => setEdit(undefined)}
        >
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget),
                m: TeamMember = {
                  id: edit === "new" ? uid("u") : edit.id,
                  name: String(f.get("name")),
                  email: String(f.get("email")),
                  role: String(f.get("role")),
                  permissions: f.getAll("permissions").map(String),
                };
              const next =
                edit === "new"
                  ? [...team, m]
                  : team.map((x) => (x.id === m.id ? m : x));
              s.setContent((x) => ({ ...x, team: JSON.stringify(next) }));
              s.toast("Team member saved locally. No invitation sent.");
              setEdit(undefined);
            }}
          >
            <label className="field">{bnNode("Name")}<input
                name="name"
                required
                defaultValue={edit === "new" ? "" : edit.name}
              />
            </label>
            <label className="field">{bnNode("Email")}<input
                type="email"
                name="email"
                required
                defaultValue={edit === "new" ? "" : edit.email}
              />
            </label>
            <label className="field">{bnNode("Role")}<select
                name="role"
                defaultValue={edit === "new" ? "Product Manager" : edit.role}
              >
                {bnNode([
                  "Super Admin",
                  "Product Manager",
                  "Order Manager",
                  "Customer Support",
                  "Marketing",
                  "Content Manager",
                  "Custom",
                ].map((r) => (
                  <option key={r} value={r}>{bnNode(r)}</option>
                )))}
              </select>
            </label>
            <h3>{bnNode("A little access to…")}</h3>
            <div className="permission-grid">
              {bnNode([
                "Products",
                "Orders",
                "Customers",
                "Marketing",
                "Content",
                "Settings",
              ].map((p) => (
                <label key={p} className="check-label">
                  <input
                    name="permissions"
                    type="checkbox"
                    value={p}
                    defaultChecked={
                      edit !== "new" && edit.permissions.includes(p)
                    }
                  />
                  {bnNode(p)}
                </label>
              )))}
            </div>
            <Button type="submit">{bnNode("Save team member ")}<Check size={15} />
            </Button>
          </form>
        </Modal>
      ))}
    </>
  );
}
