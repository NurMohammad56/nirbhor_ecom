import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Star,
  Quote,
  Sparkles,
  Check,
} from "lucide-react";
import { useStore } from "./store";
import { Badge, Button, SectionTitle, ProductCard, TrustStrip } from "./ui";
import { money } from "./data";
export default function Home() {
  const { products, categories, banners, reviews, recent, content } =
    useStore();
  const [slide, setSlide] = useState(0),
    [paused, setPaused] = useState(false),
    [stopped, setStopped] = useState(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [category, setCategory] = useState("Organic Food"),
    [tab, setTab] = useState("Bestsellers");
  const activeBanners = banners
    .filter(
      (b) =>
        b.active &&
        (!b.start || new Date(b.start) <= new Date()) &&
        (!b.end || new Date(b.end) >= new Date()),
    )
    .sort((a, b) => a.order - b.order);
  const current = activeBanners[slide % Math.max(1, activeBanners.length)];
  useEffect(() => {
    if (paused || stopped || activeBanners.length < 2) return;
    const timer = setInterval(
      () => setSlide((s) => (s + 1) % activeBanners.length),
      6500,
    );
    return () => clearInterval(timer);
  }, [activeBanners.length, paused, stopped]);
  const parentCategories = categories.filter((c) => !c.parent && c.active);
  const subcategories = categories.filter(
    (c) => c.parent === category && c.active,
  );
  const popular = products
    .filter((p) => p.status === "Published" && p.stock > 0)
    .sort((a, b) =>
      tab === "New arrivals"
        ? b.created - a.created
        : tab === "On offer"
          ? b.oldPrice - b.price - (a.oldPrice - a.price)
          : ["p1", "p2", "p3", "p4"].indexOf(a.id) === -1
            ? 1
            : ["p1", "p2", "p3", "p4"].indexOf(b.id) === -1
              ? -1
              : ["p1", "p2", "p3", "p4"].indexOf(a.id) -
                ["p1", "p2", "p3", "p4"].indexOf(b.id),
    )
    .slice(0, 4);
  const featuredReviews = reviews
    .filter((r) => r.status === "Approved" && r.featured)
    .slice(0, 3);
  return (
    <>
      <section className="home-intro container">
        <div className="home-preline">
          <span>GOOD FOOD. THOUGHTFUL LIVING.</span>
          <Link to="/about">
            Rooted in nature. Made for you. <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="hero-grid">
          <div
            className="hero-main"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {current ? (
              <>
                <img
                  className="hero-image"
                  src={current.image}
                  alt="Raw honey, nuts and dates, thoughtfully sourced for your everyday pantry"
                />
                <div className="hero-image-fade" />
                <div className="hero-copy" key={current.id}>
                  <span className="hero-kicker">
                    <span /> THE EVERYDAY GOODNESS EDIT
                  </span>
                  <h1>
                    {current.title.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i === 0 && <br />}
                      </span>
                    ))}
                  </h1>
                  <p>{current.subtitle}</p>
                  <div className="hero-buttons">
                    <Button to={current.link}>
                      {current.cta}
                      <ArrowRight size={17} />
                    </Button>
                    <Link className="hero-secondary" to="/about">
                      Our story <ArrowUpRight size={15} />
                    </Link>
                  </div>
                  <div className="hero-social-proof">
                    <div className="avatar-stack">
                      <span>SR</span>
                      <span>RH</span>
                      <span>NJ</span>
                    </div>
                    <div>
                      <span className="stars">★★★★★</span>
                      <small>Loved by 2,400+ happy homes</small>
                    </div>
                  </div>
                </div>
                <div className="hero-controls">
                  <button
                    className="autoplay-toggle"
                    aria-label={
                      stopped ? "Play hero carousel" : "Pause hero carousel"
                    }
                    aria-pressed={stopped}
                    onClick={() => setStopped(!stopped)}
                  >
                    {stopped ? "▷" : "Ⅱ"}
                  </button>
                  <div className="slide-dots">
                    {activeBanners.map((b, i) => (
                      <button
                        key={b.id}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={slide % activeBanners.length === i}
                        className={
                          slide % activeBanners.length === i ? "active" : ""
                        }
                        onClick={() => setSlide(i)}
                      />
                    ))}
                  </div>
                  <span>
                    {String((slide % activeBanners.length) + 1).padStart(
                      2,
                      "0",
                    )}{" "}
                    <span className="muted">
                      / {String(activeBanners.length).padStart(2, "0")}
                    </span>
                  </span>
                  <div>
                    <button
                      className="icon-btn"
                      aria-label="Previous slide"
                      onClick={() =>
                        setSlide(
                          (s) =>
                            (s - 1 + activeBanners.length) %
                            activeBanners.length,
                        )
                      }
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      className="icon-btn"
                      aria-label="Next slide"
                      onClick={() =>
                        setSlide((s) => (s + 1) % activeBanners.length)
                      }
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <span className="hero-stamp">
                  <Leaf size={20} />
                  <span>
                    HONEST ORIGINS
                    <br />
                    EVERYDAY GOODNESS
                  </span>
                </span>
              </>
            ) : (
              <div className="hero-copy">
                <h1>
                  A little goodness,
                  <br />
                  every day.
                </h1>
                <Button to="/shop">
                  Explore the shop <ArrowRight size={17} />
                </Button>
              </div>
            )}
          </div>
          <div className="hero-promos">
            <Link className="promo-card morning-promo" to="/product/p15">
              <div>
                <span className="eyebrow">THE MORNING RITUAL</span>
                <h2>
                  Start slow.
                  <br />
                  Start better.
                </h2>
                <p>Honey, nuts & a moment for you.</p>
                <b>
                  Discover the bundle <ArrowUpRight size={15} />
                </b>
              </div>
              <img src="/assets/nuts.webp" alt="Nourishing mixed nuts" />
              <span className="promo-price">FROM {money(1290)}</span>
            </Link>
            <Link
              className="promo-card home-promo"
              to="/shop?category=Home+%26+Living"
            >
              <img
                src="/assets/home-hero.webp"
                alt="A calm, thoughtfully considered home"
              />
              <div>
                <span className="eyebrow">A MORE CONSIDERED HOME</span>
                <h2>
                  Little things.
                  <br />
                  Lovely living.
                </h2>
                <b>
                  Explore home & living <ArrowUpRight size={15} />
                </b>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <TrustStrip />
      <section className="section container categories-section">
        <SectionTitle
          eyebrow="FIND YOUR EVERYDAY GOOD"
          title={content.categoryHeading || "Good things, in every corner."}
          link="/categories"
          label="All categories"
        />
        <div className="category-tabs">
          {parentCategories.map((c) => (
            <button
              key={c.id}
              className={category === c.name ? "active" : ""}
              onClick={() => setCategory(c.name)}
            >
              {c.name}
              <span>
                {
                  products.filter(
                    (p) => p.category === c.name && p.status === "Published",
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
        <div className="category-shelf">
          <Link
            className="category-intro"
            to={`/shop?category=${encodeURIComponent(category)}`}
          >
            <Leaf size={26} strokeWidth={1.3} />
            <div>
              <h3>{category}</h3>
              <p>
                {parentCategories.find((c) => c.name === category)?.description}
              </p>
            </div>
            <span className="round-link">
              <ArrowUpRight size={20} />
            </span>
            <span className="botanical-line">❧</span>
          </Link>
          <div className="category-tiles">
            {(subcategories.length
              ? subcategories.slice(0, 6)
              : products
                  .filter((p) => p.category === category)
                  .slice(0, 6)
                  .map((p) => ({
                    id: p.id,
                    name: p.subcategory,
                    image: p.image,
                  }))
            ).map((c, i) => (
              <Link
                key={c.id}
                className="category-tile"
                to={`/shop?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(c.name)}`}
              >
                <div className={"category-thumb thumb-" + i}>
                  <img src={c.image} alt="" loading="lazy" />
                </div>
                <div>
                  <strong>{c.name}</strong>
                  <span>
                    {products.filter((p) => p.subcategory === c.name).length ||
                      "Explore"}{" "}
                    {products.some((p) => p.subcategory === c.name)
                      ? "good finds"
                      : "the collection"}
                  </span>
                </div>
                <ArrowUpRight size={15} />
              </Link>
            ))}
            {!subcategories.length &&
              !products.some((p) => p.category === category) && (
                <div className="coming-category">
                  <Sparkles size={25} />
                  <h3>A little goodness is growing.</h3>
                  <p>Our family collection is coming soon.</p>
                  <Link to="/shop" className="text-link">
                    Explore all essentials <ArrowRight size={15} />
                  </Link>
                </div>
              )}
          </div>
        </div>
      </section>
      <section className="bestsellers-section">
        <div className="container section">
          <SectionTitle
            eyebrow="TRIED. LOVED. REORDERED."
            title={
              content.popularHeading || "The ones you keep coming back for."
            }
            link="/shop?collection=bestsellers"
            label="Shop all favourites"
          />
          <div className="product-tabs">
            {["Bestsellers", "New arrivals", "On offer"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={tab === t ? "active" : ""}
              >
                {t}
              </button>
            ))}
            <span>Good taste, great company.</span>
          </div>
          <div className="product-grid four">
            {popular.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
      <section className="harvest-section container">
        <div className="harvest-visual">
          <img
            src="/assets/hero.webp"
            alt="Golden raw honey in a glass jar, with natural honey dipper"
            loading="lazy"
          />
          <span className="harvest-batch">
            SMALL BATCH
            <br />
            <b>Big on goodness.</b>
          </span>
        </div>
        <div className="harvest-copy">
          <span className="eyebrow">FROM THE SUNDARBANS, WITH CARE</span>
          <h2>
            Nothing added.
            <br />
            Everything nature
            <br />
            intended.
          </h2>
          <p>
            Wild blossoms. Patient bees. And honey that tells the story of where
            it comes from. Meet our raw, unfiltered Sundarban honey.
          </p>
          <div className="harvest-checks">
            <span>
              <Check size={14} />
              Single-origin
            </span>
            <span>
              <Check size={14} />
              Small-batch packed
            </span>
            <span>
              <Check size={14} />
              No added sugar
            </span>
          </div>
          <Button to="/campaign/p1">
            Meet your new pantry staple
            <ArrowRight size={17} />
          </Button>
          <Link className="text-link" to="/page/sourcing">
            Our sourcing promise <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
      <section className="offer-ribbon">
        <div className="container">
          <span className="ribbon-icon">✳</span>
          <div>
            <span className="eyebrow">A LITTLE WELCOME GIFT</span>
            <h3>Your first good choice comes with 10% off.</h3>
          </div>
          <span>
            Use code <b>NIRBHOR10</b> at checkout
          </span>
          <Button variant="light" to="/offers">
            Find your favourites <ArrowUpRight size={17} />
          </Button>
        </div>
      </section>
      <section className="section container">
        <SectionTitle
          eyebrow="SLOW LIVING, WELL CHOSEN"
          title="For the home you’re growing."
          link="/shop?category=Home+%26+Living"
          label="Explore the collection"
        />
        <div className="lifestyle-grid">
          <Link to="/shop?category=Home+%26+Living" className="lifestyle-large">
            <img
              src="/assets/home-hero.webp"
              alt="Warm natural interiors and thoughtful everyday living"
              loading="lazy"
            />
            <div>
              <span className="eyebrow">MAKE ROOM FOR SIMPLE THINGS</span>
              <h3>A home that feels like you.</h3>
              <span>
                Explore home & living <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>
          {products
            .filter((p) => p.category === "Home & Living" && p.stock > 0)
            .slice(0, 2)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="testimonials-section">
        <div className="container section">
          <SectionTitle
            eyebrow="GOODNESS, IN THEIR WORDS"
            title="A little love from our community."
          />
          <div className="testimonial-grid">
            {featuredReviews.map((r, i) => (
              <article key={r.id}>
                <div className="quote-top">
                  <span className="stars">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                  <Quote size={23} strokeWidth={1} />
                </div>
                <h3>“{r.title}”</h3>
                <p>{r.text}</p>
                <div className="review-author">
                  <span className="review-avatar">
                    {r.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>{r.name}</strong>
                    <span>
                      <Check size={11} /> Verified customer ·{" "}
                      {["Dhaka", "Narayanganj", "Chattogram"][i]}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="community-rating">
            <span className="stars">★★★★★</span>
            <b>4.9 out of 5</b>
            <span>from our growing community of happy homes</span>
          </div>
        </div>
      </section>
      {recent.length > 0 && (
        <section className="section container">
          <SectionTitle
            eyebrow="GOOD TO SEE YOU AGAIN"
            title="A second look at something good."
            link="/account/recent"
            label="Recently viewed"
          />
          <div className="product-grid four">
            {recent
              .slice(0, 4)
              .map((id) => products.find((p) => p.id === id))
              .filter((p): p is NonNullable<typeof p> => !!p)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      )}
      <section className="brand-promise container">
        <Leaf size={30} strokeWidth={1.2} />
        <h2>
          Better for your everyday.
          <br />
          <em>A little closer to nature.</em>
        </h2>
        <p>
          We believe good choices should feel simple. So we bring you honest
          products,
          <br className="desktop-only" /> transparent origins, and a little more
          care in everything we do.
        </p>
        <Link to="/about" className="text-link">
          Get to know NIRBHOR <ArrowUpRight size={16} />
        </Link>
      </section>
    </>
  );
}
