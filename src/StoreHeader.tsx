import BrandLogo from "./BrandLogo";
import { bnNode, searchText, latinDigits } from "./bn";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
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
    [focused, setFocused] = useState(false),
    [menuTop, setMenuTop] = useState(96);
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
        searchText(p.name + " " + p.subcategory + " " + p.tags).includes(latinDigits(search).toLowerCase()),
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
    const close = () => setMenu(false);
    window.addEventListener("resize", close);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("resize", close);
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
            <ShieldCheck size={12} />{bnNode("Thoughtful choices. Trusted every day.")}</span>
          <span className="announcement-center">
            {bnNode(department && experience ? (
              experience.announcement
            ) : (
              <>{bnNode(`${money(s.settings.freeShipping)}-এর বেশি কেনাকাটায় ফ্রি ডেলিভারি`)}
                <span className="tiny-dot" />{bnNode(" Cash on delivery available")}</>
            ))}
          </span>
          <div>
            <Link to="/track">{bnNode("Track your order")}</Link>
            <Link to="/help">{bnNode("Help")}</Link>
          </div>
        </div>
      </div>
      <header
        className={`site-header brand-site-header ${department ? "department-header" : ""}`}
      >
        <div className="container header-main">
          <button
            className="icon-btn mobile-menu"
            aria-label={bnNode(menu ? "Close menu" : "Open menu")}
            aria-expanded={menu}
            onClick={event => { setMenuTop(event.currentTarget.closest("header")!.getBoundingClientRect().bottom); setMenu(!menu); }}
          >
            {bnNode(menu ? <X /> : <Menu />)}
          </button>
          <div className="brand-logo-lockup">
            <Link to="/" className="wordmark" aria-label={bnNode("Nirbhor home")}>
              <BrandLogo />
            </Link>
            {bnNode(department && (
              <Link
                to={"/" + department.slug}
                className="brand-logo-department"
              >
                {bnNode(department.name)}
              </Link>
            ))}
          </div>
          <nav className="brand-nav" aria-label={bnNode("Main navigation")}>
            <button
              className={mega ? "active" : ""}
              aria-expanded={mega}
              onClick={() => setMega(!mega)}
              onMouseEnter={() => setMega(true)}
            ><span className="nav-label">{bnNode("Discover")}</span><ChevronDown size={13} />
            </button>
            {bnNode(visible.map((d) => (
              <Link
                to={"/" + d.slug}
                key={d.slug}
                className={department?.slug === d.slug ? "active" : ""}
              >
                <span className="nav-label">{bnNode(d.name === "Home" ? "Home & living" : d.name)}</span>
              </Link>
            )))}
            <Link className="brand-nav-offers" to="/offers"><span className="nav-label">{bnNode("Offers")}</span><i aria-hidden="true"/>
            </Link>
          </nav>
          <div className="header-search brand-header-search" ref={searchRef}>
            <form onSubmit={submit}>
              <Search size={16} />
              <input
                aria-label={bnNode("Search products")}
                placeholder={
                  bnNode(department
                    ? "Search " + department.name.toLowerCase() + "…"
                    : "Find your everyday…")
                }
                value={search}
                onFocus={() => setFocused(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setFocused(true);
                }}
              />
              <kbd>{bnNode("⌘ K")}</kbd>
            </form>
            {bnNode(focused && (
              <div className="search-popover">
                <div className="popover-label">
                  {bnNode(search
                    ? "A few good finds"
                    : department
                      ? "Explore " + department.name
                      : "What are you looking for?")}
                </div>
                {bnNode(!search ? (
                  <div className="search-chips">
                    {bnNode((department
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
                        {bnNode(text)}
                      </Link>
                    )))}
                  </div>
                ) : matches.length ? (
                  matches.map((p) => (
                    <Link
                      to={productHref(p, s.categories)}
                      key={p.id}
                      className="search-item"
                    >
                      <img src={p.image} alt={bnNode("")} />
                      <div>
                        {bnNode(p.name)}
                        <small>{bnNode(p.weight)}</small>
                      </div>
                      <b>{bnNode(money(p.price))}</b>
                    </Link>
                  ))
                ) : (
                  <p className="small muted">{bnNode("Try a product name, or explore the collection.")}</p>
                ))}
                <Link
                  className="text-link"
                  to={
                    (department ? departmentShopHref(department) : "/shop") +
                    "?q=" +
                    encodeURIComponent(search)
                  }
                >{bnNode("See all results ")}<ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
          <div className="header-actions">
            <Link
              className="icon-btn account-icon"
              aria-label={bnNode("My account")}
              to="/account"
            >
              <UserRound size={20} />
            </Link>
            <Link className="icon-btn" aria-label={bnNode("Wishlist")} to="/wishlist">
              <Heart size={20} />
              {bnNode(s.wishlist.length > 0 && (
                <span className="count">{bnNode(s.wishlist.length)}</span>
              ))}
            </Link>
            <button
              className="icon-btn bag-icon"
              aria-label={bnNode("Open shopping bag")}
              onClick={() => s.setDrawer(true)}
            >
              <ShoppingBag size={20} />
              <span className="count">
                {bnNode(s.cart.reduce((n, i) => n + i.quantity, 0))}
              </span>
            </button>
          </div>
        </div>
        {bnNode(department && (
          <nav
            className="department-subnav"
            aria-label={bnNode(`${department.name} categories`)}
          >
            <div className="container">
              <Link
                className="department-subnav-all"
                to={departmentShopHref(department)}
              >{bnNode("Shop all ")}{bnNode(department.name.toLowerCase())}{bnNode(" ")}
                <ArrowUpRight size={12} />
              </Link>
              {bnNode(s.categories
                .filter((c) => c.parent === category?.name && c.active)
                .map((c) => (
                  <Link to={departmentShopHref(department, c.name)} key={c.id}>
                    {bnNode(c.name)}
                  </Link>
                )))}
              <Link to="/#departments" className="department-back-link">{bnNode("All of Nirbhor ")}<ArrowUpRight size={12} />
              </Link>
            </div>
          </nav>
        ))}
        {bnNode(mega && (
          <div className="brand-mega" onMouseLeave={() => setMega(false)}>
            <div className="container">
              {bnNode(visible.map((d) => (
                <div className="brand-mega-column" key={d.slug}>
                  <Link to={"/" + d.slug}>
                    <img
                      src={experienceForDepartment(d, s.categories).heroImage}
                      alt={bnNode("")}
                    />
                    <strong>{bnNode("Nirbhor ")}{bnNode(d.name)}
                      <ArrowUpRight size={14} />
                    </strong>
                  </Link>
                  {bnNode(s.categories
                    .filter(
                      (c) =>
                        c.parent ===
                          categoryForDepartment(d, s.categories)?.name &&
                        c.active,
                    )
                    .slice(0, 5)
                    .map((c) => (
                      <Link key={c.id} to={departmentShopHref(d, c.name)}>
                        {bnNode(c.name)}
                        <ChevronRight size={11} />
                      </Link>
                    )))}
                </div>
              )))}
              <div className="brand-mega-bottom">
                <Link to="/shop">{bnNode("Explore all products ")}<ArrowUpRight size={14} />
                </Link>
                <span>{bnNode("Good choices. One trusted place.")}</span>
                <Link to="/about">{bnNode("Get to know Nirbhor ")}<ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </header>
      {bnNode(menu && (
        <nav
          className="mobile-nav brand-mobile-nav"
          style={{"--nav-top": `${menuTop}px`} as CSSProperties}
          aria-label={bnNode("Mobile navigation")}
        >
          <form onSubmit={submit} className="search-field">
            <Search size={17} />
            <input
              aria-label={bnNode("Mobile search")}
              placeholder={bnNode("Find your everyday…")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <Link to="/shop">{bnNode("Shop all ")}<ArrowUpRight size={18} />
          </Link>
          {bnNode(visible.map((d) => (
            <div key={d.slug} className="mobile-department-link">
              <Link to={"/" + d.slug}>
                <img
                  src={experienceForDepartment(d, s.categories).heroImage}
                  alt={bnNode("")}
                />
                <span>
                  <small>{bnNode("NIRBHOR")}</small>
                  <b>{bnNode(d.name === "Home" ? "Home & living" : d.name)}</b>
                </span>
                <ArrowUpRight size={17} />
              </Link>
            </div>
          )))}
          {bnNode([
            ["Offers & collections", "/offers"],
            ["Our story", "/about"],
            ["My account", "/account"],
            ["Track order", "/track"],
            ["Store admin", "/admin"],
          ].map(([text, to]) => (
            <Link key={to} to={to}>
              {bnNode(text)}
              <ArrowUpRight size={17} />
            </Link>
          )))}
        </nav>
      ))}
    </>
  );
}
