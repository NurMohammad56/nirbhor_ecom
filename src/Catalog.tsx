import { descendants } from "./category-tree";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Grid2X2,
  LayoutList,
  SlidersHorizontal,
  X,
  Search,
  Heart,
  Leaf,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useStore } from "./store";
import { money } from "./data";
import {
  Badge,
  Breadcrumb,
  Button,
  Empty,
  ProductCard,
  SectionTitle,
} from "./ui";
function distance(a: string, b: string): number {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [
    i,
    ...Array(b.length).fill(0),
  ]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(
        m[i - 1][j] + 1,
        m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return m[a.length][b.length];
}
export default function Catalog() {
  const { products, categories, track } = useStore();
  const [params, setParams] = useSearchParams();
  const [mobileFilters, setMobileFilters] = useState(false),
    [view, setView] = useState("grid"),
    [page, setPage] = useState(1),
    [extra, setExtra] = useState(false);
  const category = params.get("category") || "",
    subcategory = params.get("subcategory") || "",
    query = params.get("q") || "",
    collection = params.get("collection") || "";
  const activeKeys = [
    "subcategory",
    "min",
    "max",
    "stock",
    "discount",
    "rating",
    "source",
    "weight",
    "brand",
    "type",
    "dietary",
    "delivery",
    "color",
    "custom",
  ];
  const title = query
    ? `Results for “${query}”`
    : subcategory ||
      category ||
      (collection === "bestsellers"
        ? "Everyday favourites"
        : collection === "new"
          ? "A little something new"
          : collection === "offers"
            ? "Good finds. Better prices."
            : "All the everyday good.");
  function set(key: string, value: string) {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value);
    else p.delete(key);
    setParams(p);
    setPage(1);
  }
  const list = useMemo(() => {
    let list = products.filter((p) => p.status === "Published");
    if (category) list = list.filter((p) => p.category === category);
    if (subcategory)
      list = list.filter(
        (p) =>
          p.subcategory === subcategory ||
          descendants(categories, subcategory).has(p.subcategory),
      );
    if (query) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.name + " " + p.category + " " + p.subcategory + " " + p.tags)
            .toLowerCase()
            .includes(q) ||
          p.name
            .toLowerCase()
            .split(" ")
            .some(
              (w) =>
                q.length >= 4 && distance(w, q) <= Math.floor(q.length / 4),
            ),
      );
    }
    if (collection === "offers" || params.get("discount"))
      list = list.filter(
        (p) =>
          p.oldPrice > p.price &&
          ((p.oldPrice - p.price) / p.oldPrice) * 100 >=
            Number(params.get("discount") || 0),
      );
    if (params.get("min"))
      list = list.filter((p) => p.price >= Number(params.get("min")));
    if (params.get("max"))
      list = list.filter((p) => p.price <= Number(params.get("max")));
    if (params.get("stock")) list = list.filter((p) => p.stock > 0);
    if (params.get("rating"))
      list = list.filter((p) => p.rating >= Number(params.get("rating")));
    for (const key of [
      "source",
      "weight",
      "brand",
      "type",
      "dietary",
      "color",
    ] as const) {
      const value = params.get(key);
      if (value) list = list.filter((p) => p[key] === value);
    }
    if (params.get("delivery") === "Same-day")
      list = list.filter(
        (p) => p.source === "Dhaka" || p.source === "Local farms",
      );
    if (params.get("custom"))
      list = list.filter((p) =>
        p.tags.toLowerCase().includes(params.get("custom")!.toLowerCase()),
      );
    const sort =
      params.get("sort") || (collection === "new" ? "newest" : "bestselling");
    return list.sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : sort === "rating"
            ? b.rating - a.rating
            : sort === "newest"
              ? b.created - a.created
              : sort === "popular"
                ? b.reviews - a.reviews
                : a.id === "p1"
                  ? -1
                  : b.id === "p1"
                    ? 1
                    : b.reviews - a.reviews,
    );
  }, [products, params.toString()]);
  useEffect(() => {
    setPage(1);
  }, [params.toString()]);
  const active = activeKeys.filter((k) => params.get(k));
  const totalPages = Math.ceil(list.length / 9);
  const clear = () => {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (query) p.set("q", query);
    if (collection) p.set("collection", collection);
    setParams(p);
    setPage(1);
  };
  const filters = (
    <>
      <div className="filters-head">
        <h3>Refine your finds</h3>
        <button className="text-button small" onClick={clear}>
          Reset
        </button>
        <button
          className="icon-btn mobile-only"
          onClick={() => setMobileFilters(false)}
          aria-label="Close filters"
        >
          <X size={20} />
        </button>
      </div>
      <div className="filter-group">
        <h4>
          Category <ChevronDown size={14} />
        </h4>
        {categories
          .filter((c) => !c.parent && c.active)
          .map((c) => (
            <label className="check-label" key={c.id}>
              <input
                type="checkbox"
                checked={category === c.name}
                onChange={() => {
                  const p = new URLSearchParams(params);
                  p.delete("subcategory");
                  if (category === c.name) p.delete("category");
                  else p.set("category", c.name);
                  setParams(p);
                }}
              />
              <span>{c.name}</span>
              <span className="muted">
                {
                  products.filter(
                    (p) => p.category === c.name && p.status === "Published",
                  ).length
                }
              </span>
            </label>
          ))}
        {category &&
          categories
            .filter((c) => c.parent === category && c.active)
            .map((c) => (
              <label className="check-label sub-filter" key={c.id}>
                <input
                  type="checkbox"
                  checked={subcategory === c.name}
                  onChange={() =>
                    set("subcategory", subcategory === c.name ? "" : c.name)
                  }
                />
                <span>{c.name}</span>
              </label>
            ))}
      </div>
      <div className="filter-group">
        <h4>
          Price range <span>BDT</span>
        </h4>
        <input
          aria-label="Maximum price slider"
          className="range-input"
          type="range"
          min="0"
          max="3000"
          step="50"
          value={params.get("max") || 3000}
          onChange={(e) => set("max", e.target.value)}
        />
        <div className="price-inputs">
          <label>
            Min
            <input
              aria-label="Minimum price"
              type="number"
              min="0"
              placeholder="৳ 0"
              value={params.get("min") || ""}
              onChange={(e) => set("min", e.target.value)}
            />
          </label>
          <span>—</span>
          <label>
            Max
            <input
              aria-label="Maximum price"
              type="number"
              min="0"
              placeholder="৳ 3,000"
              value={params.get("max") || ""}
              onChange={(e) => set("max", e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="filter-group">
        <h4>Availability</h4>
        <label className="check-label">
          <input
            type="checkbox"
            checked={!!params.get("stock")}
            onChange={(e) => set("stock", e.target.checked ? "in" : "")}
          />
          In stock only
        </label>
      </div>
      <div className="filter-group">
        <h4>A little extra goodness</h4>
        <label className="check-label">
          <input
            type="checkbox"
            checked={!!params.get("discount")}
            onChange={(e) => set("discount", e.target.checked ? "10" : "")}
          />
          10% off or more
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            checked={!!params.get("rating")}
            onChange={(e) => set("rating", e.target.checked ? "4.8" : "")}
          />
          <span>
            <span className="stars">★★★★</span> 4.8 & above
          </span>
        </label>
      </div>
      <div className="filter-group">
        <h4>Source / origin</h4>
        <select
          aria-label="Filter by source"
          value={params.get("source") || ""}
          onChange={(e) => set("source", e.target.value)}
        >
          <option value="">All origins</option>
          {[...new Set(products.map((p) => p.source))].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <button
        className="text-link more-filters"
        onClick={() => setExtra(!extra)}
      >
        {extra ? "Fewer filters" : "More ways to find your good"}
        <ChevronDown size={15} />
      </button>
      {extra && (
        <div className="filter-group">
          {(["weight", "brand", "type", "dietary", "color"] as const).map(
            (k) => (
              <label className="field" key={k}>
                {
                  {
                    weight: "Size / weight",
                    brand: "Brand",
                    type: "Product type",
                    dietary: "Dietary / material",
                    color: "Colour",
                  }[k]
                }
                <select
                  value={params.get(k) || ""}
                  onChange={(e) => set(k, e.target.value)}
                >
                  <option value="">Any</option>
                  {[...new Set(products.map((p) => p[k]))].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            ),
          )}
          <label className="field">
            Delivery
            <select
              value={params.get("delivery") || ""}
              onChange={(e) => set("delivery", e.target.value)}
            >
              <option value="">All Bangladesh</option>
              <option>Same-day</option>
            </select>
          </label>
          <label className="field">
            Custom attribute / tag
            <input
              placeholder="e.g. small batch"
              value={params.get("custom") || ""}
              onChange={(e) => set("custom", e.target.value)}
            />
          </label>
        </div>
      )}
      <div className="filter-promise">
        <Leaf size={21} />
        <strong>Good origins. Good choices.</strong>
        <p>Every product has a story. We make sure you know it.</p>
        <Link to="/page/sourcing">
          Our sourcing promise <ArrowUpRight size={13} />
        </Link>
      </div>
      <Button
        className="mobile-only full"
        onClick={() => setMobileFilters(false)}
      >
        Show {list.length} good finds
      </Button>
    </>
  );
  return (
    <>
      <section className="catalog-header">
        <div className="container">
          <Breadcrumb
            items={[
              {
                label: category || "Shop",
                to: category
                  ? `/shop?category=${encodeURIComponent(category)}`
                  : undefined,
              },
              ...(subcategory ? [{ label: subcategory }] : []),
            ]}
          />
          <div className="catalog-heading">
            <div>
              <span className="eyebrow">
                THOUGHTFULLY CHOSEN. EVERY SINGLE ONE.
              </span>
              <h1>{title}</h1>
              <p>
                {query
                  ? `${list.length} little discoveries for your everyday.`
                  : category === "Organic Food"
                    ? "From nature to your pantry. Honest ingredients, extraordinary everyday goodness."
                    : "Good choices for your pantry, your home, and everything in between."}
              </p>
            </div>
            <div className="catalog-emblem">
              <Leaf size={26} />
              <span>GOOD BY NATURE</span>
            </div>
          </div>
          {category === "Organic Food" && (
            <div className="subcategory-chips">
              <button
                className={!subcategory ? "active" : ""}
                onClick={() => set("subcategory", "")}
              >
                All organic
              </button>
              {categories
                .filter((c) => c.parent === category && c.active)
                .map((c) => (
                  <button
                    key={c.id}
                    className={subcategory === c.name ? "active" : ""}
                    onClick={() => set("subcategory", c.name)}
                  >
                    {c.name}
                  </button>
                ))}
            </div>
          )}
        </div>
      </section>
      <div className="container catalog-layout">
        <aside className={`filters ${mobileFilters ? "mobile-open" : ""}`}>
          {filters}
        </aside>
        {mobileFilters && (
          <div
            className="filter-backdrop"
            onClick={() => setMobileFilters(false)}
          />
        )}
        <section className="catalog-results">
          <div className="results-toolbar">
            <span>
              <b>{list.length}</b> good finds
            </span>
            <button
              className="btn outline mobile-filter-btn"
              onClick={() => setMobileFilters(true)}
            >
              <SlidersHorizontal size={16} />
              Filters {active.length > 0 && `(${active.length})`}
            </button>
            <div className="sort-controls">
              <label>
                Sort by:{" "}
                <select
                  aria-label="Sort products"
                  value={
                    params.get("sort") ||
                    (collection === "new" ? "newest" : "bestselling")
                  }
                  onChange={(e) => set("sort", e.target.value)}
                >
                  <option value="bestselling">Bestselling</option>
                  <option value="popular">Most popular</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="rating">Top rated</option>
                  <option value="newest">Newest arrivals</option>
                </select>
              </label>
              <div className="view-switch">
                <button
                  aria-label="Grid view"
                  className={view === "grid" ? "active" : ""}
                  onClick={() => setView("grid")}
                >
                  <Grid2X2 size={17} />
                </button>
                <button
                  aria-label="List view"
                  className={view === "list" ? "active" : ""}
                  onClick={() => setView("list")}
                >
                  <LayoutList size={18} />
                </button>
              </div>
            </div>
          </div>
          {active.length > 0 && (
            <div className="active-filters">
              {active.map((k) => (
                <button key={k} onClick={() => set(k, "")}>
                  {k === "stock"
                    ? "In stock"
                    : k === "min"
                      ? `From ${money(Number(params.get(k)))}`
                      : k === "max"
                        ? `Under ${money(Number(params.get(k)))}`
                        : k === "discount"
                          ? `${params.get(k)}%+ off`
                          : k === "rating"
                            ? `${params.get(k)}★ & up`
                            : params.get(k)}
                  <X size={12} />
                </button>
              ))}
              <button className="clear-filters" onClick={clear}>
                Clear all
              </button>
            </div>
          )}
          {list.length ? (
            <>
              <div
                className={`product-grid ${view === "list" ? "list-view" : ""}`}
              >
                {list.slice((page - 1) * 9, page * 9).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="pagination">
                <span>
                  Showing {Math.min((page - 1) * 9 + 1, list.length)}–
                  {Math.min(page * 9, list.length)} of {list.length} good finds
                </span>
                <div>
                  <button
                    aria-label="Previous page"
                    disabled={page === 1}
                    onClick={() => {
                      setPage(page - 1);
                      window.scrollTo({ top: 320, behavior: "smooth" });
                    }}
                  >
                    <ChevronLeft size={17} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      aria-label={`Page ${i + 1}`}
                      key={i}
                      className={page === i + 1 ? "active" : ""}
                      onClick={() => {
                        setPage(i + 1);
                        window.scrollTo({ top: 320, behavior: "smooth" });
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    aria-label="Next page"
                    disabled={page === totalPages}
                    onClick={() => {
                      setPage(page + 1);
                      window.scrollTo({ top: 320, behavior: "smooth" });
                    }}
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Empty
              icon={Search}
              title="Let’s find a different kind of good."
              text="No products match these filters. Try broadening your search."
              action={
                <Button
                  onClick={() => {
                    setParams({});
                    setPage(1);
                  }}
                >
                  Explore all products <ArrowRight size={16} />
                </Button>
              }
            />
          )}
          <div className="catalog-note">
            <Leaf size={16} />
            <span>Every good find comes with a little more care.</span>
            <Link to="/page/shipping">
              Delivery across Bangladesh <ArrowUpRight size={13} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
export function Wishlist() {
  const { wishlist, products } = useStore();
  return (
    <main className="container page-space">
      <Breadcrumb items={[{ label: "Your wishlist" }]} />
      <SectionTitle
        eyebrow="SAVE A LITTLE GOODNESS FOR LATER"
        title="Your good-finds list."
        link="/shop"
        label="Keep exploring"
      />
      {wishlist.length ? (
        <div className="product-grid four">
          {wishlist
            .map((id) => products.find((p) => p.id === id))
            .filter((p): p is NonNullable<typeof p> => !!p)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      ) : (
        <Empty
          icon={Heart}
          title="Something good will catch your eye."
          text="Tap the heart on any product to keep it close."
          action={
            <Button to="/shop">
              Find your favourites <ArrowRight size={16} />
            </Button>
          }
        />
      )}
    </main>
  );
}
export function Categories() {
  const { categories, products } = useStore();
  return (
    <main className="container page-space">
      <Breadcrumb items={[{ label: "All categories" }]} />
      <SectionTitle
        eyebrow="A WORLD OF EVERYDAY GOOD"
        title="Find your little corner of goodness."
      />
      <div className="all-categories">
        {categories
          .filter((c) => !c.parent && c.active)
          .map((c) => (
            <article key={c.id}>
              <Link
                className="all-category-image"
                to={`/shop?category=${encodeURIComponent(c.name)}`}
              >
                <img src={c.image} alt={c.name} />
                <span className="round-link">
                  <ArrowUpRight size={20} />
                </span>
              </Link>
              <Link to={`/shop?category=${encodeURIComponent(c.name)}`}>
                <h2>{c.name}</h2>
              </Link>
              <p>{c.description}</p>
              <div>
                {categories
                  .filter((s) => s.parent === c.name && s.active)
                  .map((s) => (
                    <Link
                      key={s.id}
                      to={`/shop?category=${encodeURIComponent(c.name)}&subcategory=${encodeURIComponent(s.name)}`}
                    >
                      {s.name}
                      <ArrowRight size={13} />
                    </Link>
                  ))}
              </div>
            </article>
          ))}
      </div>
    </main>
  );
}
export function Offers() {
  const { coupons, products, toast, campaigns } = useStore();
  return (
    <>
      <section className="offers-hero">
        <div className="container">
          <Breadcrumb items={[{ label: "Offers & little extras" }]} />
          <span className="eyebrow">GOOD THINGS COME WITH LITTLE EXTRAS</span>
          <h1>
            A little more goodness.
            <br />
            <em>A little less to spend.</em>
          </h1>
          <p>
            Thoughtful bundles, seasonal finds, and offers worth making room
            for.
          </p>
        </div>
        <span className="offer-decoration">✳</span>
      </section>
      <main className="container section">
        <SectionTitle
          eyebrow="A LITTLE SOMETHING FOR YOU"
          title="Good codes. Great choices."
        />
        <div className="coupon-grid">
          {coupons
            .filter((c) => c.active)
            .map((c) => (
              <article className="coupon-card" key={c.id}>
                <span className="eyebrow">YOUR EVERYDAY EXTRA</span>
                <h2>
                  {c.type === "Free shipping"
                    ? "Delivery, on us."
                    : c.type === "Percentage"
                      ? `${c.value}% off your good finds.`
                      : `${money(c.value)} off something good.`}
                </h2>
                <p>
                  On orders over {money(c.minimum)} · Valid until{" "}
                  {new Date(c.end).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <div>
                  <code>{c.code}</code>
                  <button
                    className="text-link"
                    onClick={() => {
                      navigator.clipboard
                        ?.writeText(c.code)
                        .then(() => toast("Offer code copied"))
                        .catch(() => toast(`Use ${c.code} at checkout`));
                    }}
                  >
                    Copy code <Copy size={14} />
                  </button>
                </div>
              </article>
            ))}
        </div>
        <div className="campaign-cards">
          {campaigns
            .filter((c) => c.active)
            .map((c) => (
              <Link to={`/campaign/${c.productId}`} key={c.id}>
                <img src="/assets/hero.webp" alt="Sundarban honey harvest" />
                <div>
                  <Badge tone="warm">THE SEASONAL EDIT</Badge>
                  <h2>{c.name}</h2>
                  <p>{c.headline}</p>
                  <span className="text-link">
                    Explore the harvest <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
        </div>
        <SectionTitle
          eyebrow="SAME GOODNESS. SWEETER PRICE."
          title="A few offers to feel good about."
        />
        <div className="product-grid four">
          {products
            .filter((p) => p.oldPrice > p.price && p.status === "Published")
            .slice(0, 8)
            .map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
        </div>
      </main>
    </>
  );
}
