import { bnNode } from "./bn";
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
import CategoryRail from "./CategoryRail";
import CustomerVoices from "./CustomerVoices";
import { ComboShowcase } from "./OfferCards";
import ProductCarousel from "./ProductCarousel";
import RecentlyViewed from "./RecentlyViewed";

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
      ? [...["p1", "p20", "p17", "p10"].map(id => live.find(p => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p), ...live.filter(p => !["p1", "p20", "p17", "p10"].includes(p.id))]
      : live
          .filter(
            (p) =>
              p.category ===
              categoryForDepartment(
                departments.find((d) => d.slug === edit)!,
                categories,
              )?.name,
          )
          ;
  return (
    <main className="brand-home">
      <CinematicHero slides={slides.length ? slides : brandBanners} />
      <div className="brand-services container">
        {bnNode([
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
              <b>{bnNode(content[`trust-heading-${i}`] || title)}</b>
              <small>{bnNode(content[`trust-text-${i}`] || text)}</small>
            </span>
          </div>
        )))}
      </div>
      <section
        className="container brand-section department-discovery"
        id="departments"
      >
        <div className="brand-section-heading">
          <div>
            <h2>{bnNode("Find your kind of good.")}</h2>
          </div>
          <p>{bnNode("Different corners of your life.")}<br />{bnNode("The same care in every choice.")}</p>
        </div>
        <CategoryRail items={categories.filter(c => !c.parent && c.active).filter(c => { const d = departments.find(item => item.categoryId === c.id); return !d || experienceForDepartment(d, categories).enabled; }).sort((a,b) => a.sort-b.sort).map(c => { const d = departments.find(item => item.categoryId === c.id); return { id:c.id, name:d ? (d.name === "Home" ? "Home & living" : d.name) : c.name, image:d ? experienceForDepartment(d, categories).heroImage : c.image, to:d ? "/"+d.slug : "/shop?category="+encodeURIComponent(c.name), department:!!d }; })} />
      </section>

      <section className="container brand-section brand-everyday-edit">
        <div className="brand-section-heading">
          <div>
            <h2>{bnNode("The everyday edit.")}</h2>
          </div>
          <Link className="brand-underlined" to="/shop">{bnNode("View the collection ")}<ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="brand-edit-tabs">
          <button
            className={edit === "all" ? "active" : ""}
            onClick={() => setEdit("all")}
          >{bnNode("A little of everything")}</button>
          {bnNode(visibleDepartments.map((d) => (
            <button
              className={edit === d.slug ? "active" : ""}
              key={d.slug}
              onClick={() => setEdit(d.slug)}
            >
              {bnNode(d.name)}
            </button>
          )))}
        </div>
        <ProductCarousel items={selected} bare className="brand-edit-products" label="আপনার জন্য বাছাই পণ্য"/>
      </section>
      <ComboShowcase />
      <RecentlyViewed/>
      <CustomerVoices />
      <section className="brand-story-wrap botanical-stage">
        <Botanical kind="dry" className="story-botanical" />
        <div className="container brand-story">
          <div className="brand-story-image">
            <img
              src="/assets/brand-story-v5.webp"
              alt={bnNode("Carefully wrapping selected everyday products at the Nirbhor packing table")}
              loading="lazy"
            />
            <span>{bnNode("THE CARE IS IN THE DETAILS.")}</span>
          </div>
          <div className="brand-story-copy">
            <h2>{bnNode("Care in what we choose.")}<br />
              <em>{bnNode("Confidence in what you do.")}</em>
            </h2>
            <p>{bnNode("Nirbhor brings together the things that make up your everyday. Good food, personal care, pieces to wear, and objects to live with - selected with a little more thought.")}</p>
            <div className="brand-principles">
              {bnNode([
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
                  <span>{bnNode(n)}</span>
                  <div>
                    <h3>{bnNode(t)}</h3>
                    <p>{bnNode(d)}</p>
                  </div>
                </div>
              )))}
            </div>
            <Link to="/about" className="brand-underlined">{bnNode("Get to know Nirbhor ")}<ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
