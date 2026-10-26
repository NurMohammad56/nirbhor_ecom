import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  PackageCheck,
  ShieldCheck,
  Truck,
  HeartHandshake,
} from "lucide-react";
import { useStore } from "./store";
import { Button, ProductCard } from "./ui";
import {
  categoryForDepartment,
  departments,
  experienceForDepartment,
} from "./departments";
import { brandBanners } from "./department-state";
import CinematicHero from "./CinematicHero";
import { Botanical } from "./SceneMotion";

export default function BrandHome() {
  const { products, categories, banners, content } = useStore();
  const [edit, setEdit] = useState("all");
  const slides = banners
    .filter(
      (b) =>
        b.active &&
        (!b.start || new Date(b.start) <= new Date()) &&
        (!b.end || new Date(b.end) >= new Date()),
    )
    .sort((a, b) => a.order - b.order);
  const visibleDepartments = departments.filter((d) => {
    const c = categoryForDepartment(d, categories);
    return c?.active && experienceForDepartment(d, categories).enabled;
  });
  const live = products.filter((p) => p.status === "Published");
  const selected =
    edit === "all"
      ? ["p1", "p20", "p17", "p10"]
          .map((id) => live.find((p) => p.id === id))
          .filter((p): p is NonNullable<typeof p> => !!p)
      : live
          .filter(
            (p) =>
              p.category ===
              categoryForDepartment(
                departments.find((d) => d.slug === edit)!,
                categories,
              )?.name,
          )
          .slice(0, 4);
  return (
    <main className="brand-home">
      <CinematicHero slides={slides.length ? slides : brandBanners} collections={visibleDepartments} />
      <div className="brand-services container">
        {[
          {
            Icon: PackageCheck,
            title: "Thoughtfully selected",
            text: "Good things, chosen with care.",
          },
          {
            Icon: ShieldCheck,
            title: "Clear product details",
            text: "Get to know what you choose.",
          },
          {
            Icon: Truck,
            title: "Across Bangladesh",
            text: "A little care, to your doorstep.",
          },
          {
            Icon: HeartHandshake,
            title: "Here when you need us",
            text: "Real questions. A helping hand.",
          },
        ].map(({ Icon, title, text }, i) => (
          <div key={title}>
            <Icon size={24} strokeWidth={1.3} />
            <span>
              <b>{content[`trust-heading-${i}`] || title}</b>
              <small>{content[`trust-text-${i}`] || text}</small>
            </span>
          </div>
        ))}
      </div>
      <section
        className="container brand-section department-discovery"
        id="departments"
      >
        <div className="brand-section-heading">
          <div>
            <span className="brand-eyebrow">FOUR WORLDS. ONE NIRBHOR.</span>
            <h2>Find your kind of good.</h2>
          </div>
          <p>
            Different corners of your life.
            <br />
            The same care in every choice.
          </p>
        </div>
        <div className="brand-department-grid">
          {visibleDepartments.map((d, i) => {
            const exp = experienceForDepartment(d, categories);
            return (
              <Link
                to={"/" + d.slug}
                className={"brand-department-card department-card-" + d.slug}
                key={d.slug}
                style={
                  {
                    "--card-accent": exp.accent,
                    "--card-bg": exp.background,
                  } as React.CSSProperties
                }
              >
                <div className="brand-department-image">
                  <img
                    src={exp.heroImage}
                    alt={`Nirbhor ${d.name} collection`}
                    loading="lazy"
                  />
                  <span className="department-card-number">0{i + 1}</span>
                  <span className="department-card-pill">
                    {d.collectionLabel}
                  </span>
                </div>
                <div className="brand-department-caption">
                  <span className="brand-eyebrow">
                    NIRBHOR {d.name.toUpperCase()}
                  </span>
                  <div>
                    <h3>{d.name === "Home" ? "Home & living" : d.name}</h3>
                    <span className="department-open">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                  <p>{d.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="brand-collection-note">
        <div className="container">
          <span className="brand-note-symbol">✳</span>
          <p>
            For your pantry. Your wardrobe. Your rituals.{" "}
            <em>Your everyday.</em>
          </p>
          <Link to="/shop">
            Explore all good finds <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <section className="container brand-section brand-everyday-edit">
        <div className="brand-section-heading">
          <div>
            <span className="brand-eyebrow">A FEW GOOD PLACES TO BEGIN</span>
            <h2>The everyday edit.</h2>
          </div>
          <Link className="brand-underlined" to="/shop">
            View the collection <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="brand-edit-tabs">
          <button
            className={edit === "all" ? "active" : ""}
            onClick={() => setEdit("all")}
          >
            A little of everything
          </button>
          {visibleDepartments.map((d) => (
            <button
              className={edit === d.slug ? "active" : ""}
              key={d.slug}
              onClick={() => setEdit(d.slug)}
            >
              {d.name}
            </button>
          ))}
        </div>
        <div className="product-grid four brand-edit-products">
          {selected.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="brand-story-wrap botanical-stage">
        <Botanical kind="dry" className="story-botanical" />
        <div className="container brand-story">
          <div className="brand-story-image">
            <img
              src="/assets/brand-story-v3.webp"
              alt="Carefully wrapping selected everyday products at the Nirbhor packing table"
              loading="lazy"
            />
            <span>THE CARE IS IN THE DETAILS.</span>
          </div>
          <div className="brand-story-copy">
            <span className="brand-eyebrow">A NAME TO COME BACK TO</span>
            <h2>
              Care in what we choose.
              <br />
              <em>Confidence in what you do.</em>
            </h2>
            <p>
              Nirbhor brings together the things that make up your everyday.
              Good food, personal care, pieces to wear, and objects to live with
              — selected with a little more thought.
            </p>
            <div className="brand-principles">
              {[
                [
                  "01",
                  "Selected with purpose",
                  "Everyday products with a place in your life.",
                ],
                [
                  "02",
                  "Details before promises",
                  "Useful information to help you make your own choice.",
                ],
                [
                  "03",
                  "Care beyond checkout",
                  "Clear delivery details and a helping hand when you need it.",
                ],
              ].map(([n, t, d]) => (
                <div key={n}>
                  <span>{n}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/about" className="brand-underlined">
              Get to know Nirbhor <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="container brand-closing botanical-stage">
        <Botanical className="closing-botanical" />
        <span className="brand-eyebrow">GOOD THINGS. A FAMILIAR NAME.</span>
        <h2>
          A little more considered.
          <br />A little more <em>you.</em>
        </h2>
        <p>Find what fits your life, in a place that feels familiar.</p>
        <Button to="/#departments">
          Find your everyday <ArrowUpRight size={17} />
        </Button>
        <span className="brand-closing-wordmark" aria-hidden="true">
          NIRBHOR
        </span>
      </section>
    </main>
  );
}
