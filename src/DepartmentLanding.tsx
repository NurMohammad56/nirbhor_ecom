import { bnNode } from "./bn";
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
import { Botanical, useSceneMotion } from "./SceneMotion";

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
  const sceneRef = useSceneMotion();
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
          title={bnNode("This collection is taking a little pause.")}
          text="Explore another corner of your everyday."
          action={
            <Button to="/#departments">{bnNode("Explore Nirbhor ")}<ArrowRight size={16} />
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
      <section ref={sceneRef} className="department-hero-shell immersive-department">
        <div className="department-immersive-media" aria-hidden="true">
          <img src={exp.heroImage} alt={bnNode("")} fetchPriority="high" />
        </div>
        <div className="department-hero-shade" />
        <div className="container">
          <nav className="department-breadcrumb" aria-label={bnNode("Breadcrumb")}>
            <Link to="/">{bnNode("Nirbhor")}</Link>
            <ChevronRight size={12} />
            <span>{bnNode(d.name)}</span>
          </nav>
          <div className="department-hero">
            <div className="department-hero-copy">

              <h1>
                {bnNode(exp.heroTitle.split("\n").map((line, i) => (
                  <span key={i}>{bnNode(line)}</span>
                )))}
              </h1>
              <p>{bnNode(exp.description)}</p>
              <div>
                <Button to={departmentShopHref(d)}>{bnNode(`Explore ${d.name === "Home" ? "home & living" : d.name.toLowerCase()}`)}
                  <ArrowUpRight size={17} />
                </Button>
                <a href="#department-collections" className="brand-underlined">{bnNode("Find your favourites ")}<ArrowRight size={15} />
                </a>
              </div>
            </div>
            {bnNode(d.slug === "beauty" && <div className="serum-orbit" aria-hidden="true"><img src="/assets/serum-float-v3.webp" alt={bnNode("")} /></div>)}
          </div>
          <div className="department-scene-footer"><a href="#department-collections">{bnNode("SCROLL TO DISCOVER ")}<span>{bnNode("↓")}</span></a></div>
        </div>
        {bnNode((d.slug === "organic" || d.slug === "home-living") && <Botanical kind={d.slug === "organic" ? "leaf" : "dry"} className="hero-botanical" />)}
      </section>
      <div className="container department-features">
        {bnNode(d.features.map((text) => (
          <span key={text}>
            <Check size={14} />
            {bnNode(text)}
          </span>
        )))}
        <Link to="/page/shipping">{bnNode("Delivery across Bangladesh ")}<ArrowUpRight size={13} />
        </Link>
      </div>
      <section
        className="container brand-section department-collection-section"
        id="department-collections"
      >
        <div className="brand-section-heading">
          <div>
            
            <h2>
              {bnNode(d.slug === "organic"
                ? "Goodness for your pantry."
                : d.slug === "beauty"
                  ? "Find your feel-good ritual."
                  : d.slug === "fashion"
                    ? "Your wardrobe, your way."
                    : "Good things to come home to.")}
            </h2>
          </div>
          <Link className="brand-underlined" to={departmentShopHref(d)}>{bnNode("Shop all ")}{bnNode(d.name.toLowerCase())} <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="department-collection-grid">
          {bnNode(selectedCollections.map((c, i) => {
            const p = items.find((p) => p.subcategory === c.name)!;
            return (
              <Link
                key={c.id}
                className="department-collection-card"
                to={departmentShopHref(d, c.name)}
              >
                <div>
                  <img src={c.image || p.image} alt={bnNode(c.name)} loading="lazy" />
                  <span>{bnNode("0")}{bnNode(i + 1)}</span>
                </div>
                <footer>
                  <span>
                    <h3>{bnNode(c.name)}</h3>
                    <small>
                      {bnNode(items.filter((p) => p.subcategory === c.name).length)}{bnNode(" ")}{bnNode("considered")}{bnNode(" ")}
                      {bnNode(items.filter((p) => p.subcategory === c.name).length ===
                      1
                        ? "find"
                        : "finds")}
                    </small>
                  </span>
                  <ArrowUpRight size={20} />
                </footer>
              </Link>
            );
          }))}
        </div>
        <div className="department-subcategory-links">
          {bnNode(subcategories.map((c) => (
            <Link key={c.id} to={departmentShopHref(d, c.name)}>
              {bnNode(c.name)}
              <ArrowUpRight size={12} />
            </Link>
          )))}
        </div>
      </section>
      <section className="department-product-edit">
        <div className="container brand-section">
          <div className="brand-section-heading">
            <div>
              
              <h2>{bnNode(d.collectionLabel)}{bnNode(".")}</h2>
            </div>
            <Link className="brand-underlined" to={departmentShopHref(d)}>{bnNode("All good finds ")}<ArrowUpRight size={16} />
            </Link>
          </div>
          <div
            className={`product-grid department-product-grid ${featured.length >= 4 ? "four" : "three"}`}
          >
            {bnNode(featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            )))}
          </div>
        </div>
      </section>
      <section className="container brand-section department-editorial botanical-stage">
        <div className="department-editorial-image">
          <img
            src={d.storyImage}
            alt={
              bnNode(d.slug === "organic"
                ? "A forest full of natural character"
                : d.slug === "fashion"
                  ? "A closer look at considered fabric and tailoring"
                  : d.slug === "beauty"
                    ? "A closer look at your daily care"
                    : "Natural linen and thoughtful home details")
            }
            loading="lazy"
          />
          <span>
            {bnNode(d.name === "Organic"
              ? "ORIGINS MATTER."
              : d.name === "Beauty"
                ? "A MOMENT FOR YOURSELF."
                : d.name === "Fashion"
                  ? "THE DETAILS MAKE THE DIFFERENCE."
                  : "THE COMFORT IS IN THE DETAILS.")}
          </span>
        </div>
        <div>
          
          <h2>
            {bnNode(exp.storyTitle.split("\n").map((line, i) => (
              <span key={i}>{bnNode(line)}</span>
            )))}
          </h2>
          <p>{bnNode(exp.storyText)}</p>
          <div className="department-editorial-details">
            {bnNode(d.features.map((text) => (
              <span key={text}>
                <Check size={13} />
                {bnNode(text)}
              </span>
            )))}
          </div>
          <Link
            to={d.slug === "organic" ? "/page/sourcing" : "/about"}
            className="brand-underlined"
          >{bnNode("A little more about our choices ")}<ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <section className="department-faq-section botanical-stage">
        <Botanical kind={d.slug === "organic" ? "leaf" : "dry"} className="editorial-botanical" />
        <div className="container brand-section department-faq">
          <div>
            
            <h2>{bnNode("Before you")}<br />{bnNode("make it yours.")}</h2>
            <p>{bnNode("A few helpful details for your next good choice.")}</p>
            <Link to="/contact" className="brand-underlined">{bnNode("Ask us a question ")}<ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="faq-list">
            {bnNode(questions[d.slug].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {bnNode(q)}
                  <span>{bnNode("+")}</span>
                </summary>
                <p>{bnNode(a)}</p>
              </details>
            )))}
          </div>
        </div>
      </section>
      <section className="container department-switcher">
        
        <div>
          {bnNode(departments
            .filter(
              (other) =>
                other.slug !== d.slug &&
                categoryForDepartment(other, categories)?.active &&
                experienceForDepartment(other, categories).enabled,
            )
            .map((other) => (
              <Link to={"/" + other.slug} key={other.slug}>
                <span>{bnNode("NIRBHOR ")}<b>{bnNode(other.name)}</b>
                </span>
                <ArrowUpRight size={18} />
              </Link>
            )))}
        </div>
      </section>
    </main>
  );
}
