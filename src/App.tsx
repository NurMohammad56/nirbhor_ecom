import { useSeo } from "./seo";
import { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";
import { StoreProvider, useStore } from "./store";
import { Header, Footer, CartDrawer, Button, Empty } from "./ui";
import Home from "./Home";
import Catalog, { Wishlist, Categories, Offers } from "./Catalog";
import ProductPage from "./Product";
import {
  Cart,
  Checkout,
  OrderSuccess,
  TrackOrder,
  Auth,
  Account,
  OrderDetail,
} from "./Commerce";
const Admin = lazy(() => import("./Admin"));
import { About, Contact, Help, StaticPage } from "./Public";
function AppContent() {
  useSeo();
  const location = useLocation(),
    s = useStore();
  const isAdmin = location.pathname.startsWith("/admin");
  useEffect(() => {
    if (location.hash) {
      setTimeout(
        () =>
          document
            .getElementById(location.hash.slice(1))
            ?.scrollIntoView({ behavior: "smooth" }),
        150,
      );
    } else window.scrollTo(0, 0);
    s.setDrawer(false);
    s.track("PageView", location.pathname + location.search);
    const product =
      location.pathname.includes("/product/") ||
      location.pathname.includes("/campaign/")
        ? s.products.find((p) => p.id === location.pathname.split("/").pop())
        : undefined;
    document.title = product
      ? product.seoTitle || product.name + " | " + s.settings.name
      : isAdmin
        ? "Commerce Admin | " + s.settings.name
        : s.settings.seoTitle;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        product?.seoDescription || s.settings.seoDescription,
      );
  }, [location.pathname, location.search]);
  useEffect(() => {
    document.documentElement.style.setProperty("--green", s.settings.color);
  }, [s.settings.color]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document
          .querySelector<HTMLInputElement>(
            'input[aria-label="Search products"]',
          )
          ?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return (
    <>
      {!isAdmin && (
        <>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Header />
        </>
      )}
      <div id="main-content">
        <Suspense
          fallback={
            <div className="route-loading">
              <span />
              <span />
              <span />
              <p>Getting a little goodness ready…</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Catalog />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route
              path="/campaign/:id"
              element={<ProductPage campaignMode />}
            />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/forgot-password" element={<Auth />} />
            <Route path="/account/order/:id" element={<OrderDetail />} />
            <Route path="/account/*" element={<Account />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/page/:slug" element={<StaticPage />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route
              path="*"
              element={
                <main className="container page-space">
                  <Empty
                    icon={Leaf}
                    title="A little off the beaten path."
                    text="Let’s find your way back to something good."
                    action={
                      <Button to="/">
                        Back to the good stuff <ArrowRight size={16} />
                      </Button>
                    }
                  />
                </main>
              }
            />
          </Routes>
        </Suspense>
      </div>
      {!isAdmin && (
        <>
          <Footer />
          <CartDrawer />
        </>
      )}
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
}
