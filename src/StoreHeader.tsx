import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useStore } from "./store";
import { money } from "./data";
import {
  categoryForDepartment,
  departments,
  departmentShopHref,
  experienceForDepartment,
  productHref,
} from "./departments";
import { useDepartment } from "./useDepartment";

export default function StoreHeader() {
  const s = useStore(),
    { department, experience, category } = useDepartment();
  const location = useLocation(),
    navigate = useNavigate();
  const [menu, setMenu] = useState(false),
    [mega, setMega] = useState(false),
    [search, setSearch] = useState(""),
    [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const visible = departments.filter(
    (d) =>
      categoryForDepartment(d, s.categories)?.active &&
      experienceForDepartment(d, s.categories).enabled,
  );
  const matches = s.products
    .filter(
      (p) =>
        p.status === "Published" &&
        (!department || p.category === category?.name) &&
        (p.name + " " + p.subcategory)
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .slice(0, 4);
  useEffect(() => {
    setMenu(false);
    setMega(false);
    setFocused(false);
    setSearch("");
  }, [location.pathname, location.search]);
  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setFocused(false);
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [menu]);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    s.track("Search", search);
    navigate(
      (department ? departmentShopHref(department) : "/shop") +
        "?q=" +
        encodeURIComponent(search),
    );
    setFocused(false);
    setMenu(false);
  }
  return (
    <>
      <div className="announcement brand-announcement">
        <div className="container">
          <span>
            <ShieldCheck size={12} />
            Thoughtful choices. Trusted every day.
          </span>
          <span className="announcement-center">
            {department && experience ? (
              experience.announcement
            ) : (
              <>
                Free delivery over {money(s.settings.freeShipping)}{" "}
                <span className="tiny-dot" /> Cash on delivery available
              </>
            )}
          </span>
          <div>
            <Link to="/track">Track your order</Link>
            <Link to="/help">Help</Link>
          </div>
        </div>
      </div>
      <header
        className={`site-header brand-site-header ${department ? "department-header" : ""}`}
      >
        <div className="container header-main">
          <button
            className="icon-btn mobile-menu"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <div className="brand-logo-lockup">
            <Link to="/" className="wordmark" aria-label="Nirbhor home">
              {s.settings.name}
            </Link>
            {department && (
              <Link
                to={"/" + department.slug}
                className="brand-logo-department"
              >
                {department.name}
              </Link>
            )}
          </div>
          <nav className="brand-nav" aria-label="Main navigation">
            <button
              className={mega ? "active" : ""}
              aria-expanded={mega}
              onClick={() => setMega(!mega)}
              onMouseEnter={() => setMega(true)}
            >
              Discover <ChevronDown size={11} />
            </button>
            {visible.map((d) => (
              <Link
                to={"/" + d.slug}
                key={d.slug}
                className={department?.slug === d.slug ? "active" : ""}
              >
                {d.name === "Home" ? "Home & living" : d.name}
              </Link>
            ))}
            <Link className="brand-nav-offers" to="/offers">
              Offers
              <span />
            </Link>
          </nav>
          <div className="header-search brand-header-search" ref={searchRef}>
            <form onSubmit={submit}>
              <Search size={16} />
              <input
                aria-label="Search products"
                placeholder={
                  department
                    ? "Search " + department.name.toLowerCase() + "…"
                    : "Find your everyday…"
                }
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
                  {search
                    ? "A few good finds"
                    : department
                      ? "Explore " + department.name
                      : "What are you looking for?"}
                </div>
                {!search ? (
                  <div className="search-chips">
                    {(department
                      ? department.subcategories.slice(0, 3)
                      : ["Honey", "Skincare", "Cotton", "Home"]
                    ).map((text) => (
                      <Link
                        key={text}
                        to={
                          (department
                            ? departmentShopHref(department)
                            : "/shop") +
                          "?q=" +
                          encodeURIComponent(text)
                        }
                      >
                        <Search size={11} />
                        {text}
                      </Link>
                    ))}
                  </div>
                ) : matches.length ? (
                  matches.map((p) => (
                    <Link
                      to={productHref(p, s.categories)}
                      key={p.id}
                      className="search-item"
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
                    Try a product name, or explore the collection.
                  </p>
                )}
                <Link
                  className="text-link"
                  to={
                    (department ? departmentShopHref(department) : "/shop") +
                    "?q=" +
                    encodeURIComponent(search)
                  }
                >
                  See all results <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
          <div className="header-actions">
            <Link
              className="icon-btn account-icon"
              aria-label="My account"
              to="/account"
            >
              <UserRound size={20} />
            </Link>
            <Link className="icon-btn" aria-label="Wishlist" to="/wishlist">
              <Heart size={20} />
              {s.wishlist.length > 0 && (
                <span className="count">{s.wishlist.length}</span>
              )}
            </Link>
            <button
              className="icon-btn bag-icon"
              aria-label="Open shopping bag"
              onClick={() => s.setDrawer(true)}
            >
              <ShoppingBag size={20} />
              <span className="count">
                {s.cart.reduce((n, i) => n + i.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
        {department && (
          <nav
            className="department-subnav"
            aria-label={`${department.name} categories`}
          >
            <div className="container">
              <Link
                className="department-subnav-all"
                to={departmentShopHref(department)}
              >
                Shop all {department.name.toLowerCase()}{" "}
                <ArrowUpRight size={12} />
              </Link>
              {s.categories
                .filter((c) => c.parent === category?.name && c.active)
                .map((c) => (
                  <Link to={departmentShopHref(department, c.name)} key={c.id}>
                    {c.name}
                  </Link>
                ))}
              <Link to="/#departments" className="department-back-link">
                All of Nirbhor <ArrowUpRight size={12} />
              </Link>
            </div>
          </nav>
        )}
        {mega && (
          <div className="brand-mega" onMouseLeave={() => setMega(false)}>
            <div className="container">
              {visible.map((d) => (
                <div className="brand-mega-column" key={d.slug}>
                  <Link to={"/" + d.slug}>
                    <img
                      src={experienceForDepartment(d, s.categories).heroImage}
                      alt=""
                    />
                    <strong>
                      Nirbhor {d.name}
                      <ArrowUpRight size={14} />
                    </strong>
                  </Link>
                  {s.categories
                    .filter(
                      (c) =>
                        c.parent ===
                          categoryForDepartment(d, s.categories)?.name &&
                        c.active,
                    )
                    .slice(0, 5)
                    .map((c) => (
                      <Link key={c.id} to={departmentShopHref(d, c.name)}>
                        {c.name}
                        <ChevronRight size={11} />
                      </Link>
                    ))}
                </div>
              ))}
              <div className="brand-mega-bottom">
                <Link to="/shop">
                  Explore all products <ArrowUpRight size={14} />
                </Link>
                <span>Good choices. One trusted place.</span>
                <Link to="/about">
                  Get to know Nirbhor <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      {menu && (
        <nav
          className="mobile-nav brand-mobile-nav"
          aria-label="Mobile navigation"
        >
          <form onSubmit={submit} className="search-field">
            <Search size={17} />
            <input
              aria-label="Mobile search"
              placeholder="Find your everyday…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <Link to="/shop">
            Shop all <ArrowUpRight size={18} />
          </Link>
          {visible.map((d) => (
            <div key={d.slug} className="mobile-department-link">
              <Link to={"/" + d.slug}>
                <img
                  src={experienceForDepartment(d, s.categories).heroImage}
                  alt=""
                />
                <span>
                  <small>NIRBHOR</small>
                  <b>{d.name === "Home" ? "Home & living" : d.name}</b>
                </span>
                <ArrowUpRight size={17} />
              </Link>
            </div>
          ))}
          {[
            ["Offers & collections", "/offers"],
            ["Our story", "/about"],
            ["My account", "/account"],
            ["Track order", "/track"],
            ["Store admin", "/admin"],
          ].map(([text, to]) => (
            <Link key={to} to={to}>
              {text}
              <ArrowUpRight size={17} />
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
