import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Leaf,
  Sparkles,
  Ruler,
  Armchair,
} from "lucide-react";
import { useStore } from "./store";
import {
  departments,
  categoryForDepartment,
  experienceForDepartment,
  departmentShopHref,
} from "./departments";
import { Badge, Button, Empty, ProductCard } from "./ui";

const questions: Record<string, [string, string][]> = {
  organic: [
    [
      "What can I find in the pantry?",
      "Explore honey, nuts and seeds, dates, tea, and everyday pantry staples. Product pages include size and source details.",
    ],
    [
      "Where do the products come from?",
      "Source details are shown on individual products. Seasonal ingredients can vary in colour, aroma and texture.",
    ],
    [
      "How should I choose a pack?",
      "Select a size or bundle on the product page. The price and delivery total are shown before you confirm your order.",
    ],
  ],
  beauty: [
    [
      "How do I choose my routine?",
      "Begin with the type of product you need, then review the ingredient list, directions and size on the product page and packaging.",
    ],
    [
      "Where can I find ingredient details?",
      "Check the product description and packaging for the complete ingredient list, directions, and expiry information. Contact us if you need a detail before ordering.",
    ],
    [
      "What if I need help choosing?",
      "Our support page is a good place to ask a product question. For individual skin concerns, get guidance from an appropriate professional.",
    ],
  ],
  fashion: [
    [
      "How do I choose my size?",
      "Open the size guide on the product page and compare the garment measurements with a piece you already own. Measurements are in inches.",
    ],
    [
      "What are the pieces made from?",
      "Material and fit information appear on each product page. Follow the care instructions provided with your garment.",
    ],
    [
      "Can I ask about an exchange?",
      "Review the return and exchange information before ordering, or contact us with the item and your question.",
    ],
  ],
  "home-living": [
    [
      "Where can I find dimensions?",
      "Look in the details section of the product page for materials, dimensions and what is included in the set.",
    ],
    [
      "How do I care for these pieces?",
      "Follow the material-specific care instructions on each product page and the included packaging.",
    ],
    [
      "How will my order be packed?",
      "Homeware is carefully wrapped for the journey. If anything arrives damaged, keep the packaging and contact us with your order number and photos.",
    ],
  ],
};
export default function DepartmentLanding({ slug }: { slug?: string }) {
  const params = useParams();
  const { products, categories } = useStore();
  const d = departments.find((d) => d.slug === (slug || params.department));
  if (!d) return null;
  const category = categoryForDepartment(d, categories),
    exp = experienceForDepartment(d, categories);
  if (!category?.active || !exp.enabled)
    return (
      <main className="container page-space">
        <Empty
          title="This collection is taking a little pause."
          text="Explore another corner of your everyday."
          action={
            <Button to="/#departments">
              Explore Nirbhor <ArrowRight size={16} />
            </Button>
          }
        />
      </main>
    );
  const items = products.filter(
    (p) => p.category === category.name && p.status === "Published",
  );
  const subcategories = categories.filter(
    (c) => c.parent === category.name && c.active,
  );
  const featured = items.slice(0, 4);
  const selectedCollections = subcategories
    .filter((c) => items.some((p) => p.subcategory === c.name))
    .slice(0, 3);
  const Icon =
    d.slug === "organic"
      ? Leaf
      : d.slug === "beauty"
        ? Sparkles
        : d.slug === "fashion"
          ? Ruler
          : Armchair;
  return (
    <main className={`department-landing department-${d.slug}`}>
      <section className="department-hero-shell">
        <div className="container">
          <nav className="department-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Nirbhor</Link>
            <ChevronRight size={12} />
            <span>{d.name}</span>
          </nav>
          <div className="department-hero">
            <div className="department-hero-copy">
              <span className="brand-eyebrow">
                <Icon size={14} />
                {d.kicker}
              </span>
              <h1>
                {exp.heroTitle.split("\n").map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </h1>
              <p>{exp.description}</p>
              <div>
                <Button to={departmentShopHref(d)}>
                  Explore{" "}
                  {d.name === "Home" ? "home & living" : d.name.toLowerCase()}
                  <ArrowUpRight size={17} />
                </Button>
                <a href="#department-collections" className="brand-underlined">
                  Find your favourites <ArrowRight size={15} />
                </a>
              </div>
              <span className="department-signature">
                NIRBHOR <i>{d.name}</i>
              </span>
            </div>
            <div className="department-hero-image">
              <img
                src={exp.heroImage}
                alt={`The Nirbhor ${d.name} collection`}
                fetchPriority="high"
              />
              <div className="department-photo-caption">
                <span>{d.eyebrow}</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container department-features">
        {d.features.map((text) => (
          <span key={text}>
            <Check size={14} />
            {text}
          </span>
        ))}
        <Link to="/page/shipping">
          Delivery across Bangladesh <ArrowUpRight size={13} />
        </Link>
      </div>
      <section
        className="container brand-section department-collection-section"
        id="department-collections"
      >
        <div className="brand-section-heading">
          <div>
            <span className="brand-eyebrow">EXPLORE YOUR CORNER</span>
            <h2>
              {d.slug === "organic"
                ? "Goodness for your pantry."
                : d.slug === "beauty"
                  ? "Find your feel-good ritual."
                  : d.slug === "fashion"
                    ? "Your wardrobe, your way."
                    : "Good things to come home to."}
            </h2>
          </div>
          <Link className="brand-underlined" to={departmentShopHref(d)}>
            Shop all {d.name.toLowerCase()} <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="department-collection-grid">
          {selectedCollections.map((c, i) => {
            const p = items.find((p) => p.subcategory === c.name)!;
            return (
              <Link
                key={c.id}
                className="department-collection-card"
                to={departmentShopHref(d, c.name)}
              >
                <div>
                  <img src={c.image || p.image} alt={c.name} loading="lazy" />
                  <span>0{i + 1}</span>
                </div>
                <footer>
                  <span>
                    <h3>{c.name}</h3>
                    <small>
                      {items.filter((p) => p.subcategory === c.name).length}{" "}
                      considered{" "}
                      {items.filter((p) => p.subcategory === c.name).length ===
                      1
                        ? "find"
                        : "finds"}
                    </small>
                  </span>
                  <ArrowUpRight size={20} />
                </footer>
              </Link>
            );
          })}
        </div>
        <div className="department-subcategory-links">
          {subcategories.map((c) => (
            <Link key={c.id} to={departmentShopHref(d, c.name)}>
              {c.name}
              <ArrowUpRight size={12} />
            </Link>
          ))}
        </div>
      </section>
      <section className="department-product-edit">
        <div className="container brand-section">
          <div className="brand-section-heading">
            <div>
              <span className="brand-eyebrow">
                THE NIRBHOR {d.name.toUpperCase()} EDIT
              </span>
              <h2>{d.collectionLabel}.</h2>
            </div>
            <Link className="brand-underlined" to={departmentShopHref(d)}>
              All good finds <ArrowUpRight size={16} />
            </Link>
          </div>
          <div
            className={`product-grid department-product-grid ${featured.length >= 4 ? "four" : "three"}`}
          >
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
      <section className="container brand-section department-editorial">
        <div className="department-editorial-image">
          <img
            src={d.storyImage}
            alt={
              d.slug === "organic"
                ? "A forest full of natural character"
                : d.slug === "fashion"
                  ? "A closer look at considered fabric and tailoring"
                  : d.slug === "beauty"
                    ? "A closer look at your daily care"
                    : "Natural linen and thoughtful home details"
            }
            loading="lazy"
          />
          <span>
            {d.name === "Organic"
              ? "ORIGINS MATTER."
              : d.name === "Beauty"
                ? "A MOMENT FOR YOURSELF."
                : d.name === "Fashion"
                  ? "THE DETAILS MAKE THE DIFFERENCE."
                  : "THE COMFORT IS IN THE DETAILS."}
          </span>
        </div>
        <div>
          <span className="brand-eyebrow">THE THOUGHT BEHIND THE THINGS</span>
          <h2>
            {exp.storyTitle.split("\n").map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </h2>
          <p>{exp.storyText}</p>
          <div className="department-editorial-details">
            {d.features.map((text) => (
              <span key={text}>
                <Check size={13} />
                {text}
              </span>
            ))}
          </div>
          <Link
            to={d.slug === "organic" ? "/page/sourcing" : "/about"}
            className="brand-underlined"
          >
            A little more about our choices <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <section className="department-faq-section">
        <div className="container brand-section department-faq">
          <div>
            <span className="brand-eyebrow">A LITTLE CLARITY</span>
            <h2>
              Before you
              <br />
              make it yours.
            </h2>
            <p>A few helpful details for your next good choice.</p>
            <Link to="/contact" className="brand-underlined">
              Ask us a question <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="faq-list">
            {questions[d.slug].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="container department-switcher">
        <span className="brand-eyebrow">MORE SIDES OF YOUR EVERYDAY</span>
        <div>
          {departments
            .filter(
              (other) =>
                other.slug !== d.slug &&
                categoryForDepartment(other, categories)?.active &&
                experienceForDepartment(other, categories).enabled,
            )
            .map((other) => (
              <Link to={"/" + other.slug} key={other.slug}>
                <span>
                  NIRBHOR <b>{other.name}</b>
                </span>
                <ArrowUpRight size={18} />
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
