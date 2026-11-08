"use client";
import {PerfumeInvitation} from "@/features/departments/PerfumeExperience";
import { bnNode } from "@/lib/bn";
import { useState } from "react";
import { Link } from "@/lib/navigation";
import {
  ArrowUpRight,
  PackageCheck,
  ShieldCheck,
  Truck,
  HeartHandshake,
} from "lucide-react";
import { useStore } from "@/providers/store-provider";
import { Button, ProductCard } from "@/components/ui";
import {
  categoryForDepartment,
  departments,
  experienceForDepartment,
} from "@/lib/departments";
import CinematicHero from "@/features/home/CinematicHero";
import { Botanical } from "@/components/SceneMotion";
import CategoryRail from "@/features/catalog/CategoryRail";
import CustomerVoices from "@/features/home/CustomerVoices";
import { ComboShowcase } from "@/features/offers/OfferCards";
import ProductCarousel from "@/features/products/ProductCarousel";
import RecentlyViewed from "@/features/products/RecentlyViewed";
import CollectionStories from "@/features/catalog/CollectionStories";
import { offerSlides } from "@/lib/offer-merchandising";
import { FlashSale, HomePromotionTiles } from "@/features/offers/CommercePromotions";
import {ShoppingShortcuts,CouponShelf,BudgetFinds} from "@/features/offers/ShoppingDiscovery";
import OfferRibbon from "@/features/offers/OfferRibbon";

export default function BrandHome() {
  const store = useStore();
  const { products, categories, content } = store;
  const [edit, setEdit] = useState("all");
  const visibleDepartments = departments.filter((d) => {
    const c = categoryForDepartment(d, categories);
    return c?.active && experienceForDepartment(d, categories).enabled;
  });
  const live = products.filter((p) => p.status === "Published");
  const selected =
    edit === "all"
      ? [...["p1", "p20", "p17", "p10", "smart-lint-remover"].map(id => live.find(p => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p), ...live.filter(p => !["p1", "p20", "p17", "p10", "smart-lint-remover"].includes(p.id))]
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
      <div className="container home-offer-layout"><CinematicHero slides={offerSlides(store)} /><HomePromotionTiles/></div>
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
      <OfferRibbon/>
      <ShoppingShortcuts/>
      <section
        className="container brand-section department-discovery"
        id="departments"
      >
        <div className="brand-section-heading">
          <div>
            <h2>{bnNode("Find your kind of good.")}</h2>
          </div>
          <Link className="brand-underlined" to="/categories">সব ক্যাটাগরি<ArrowUpRight size={16}/></Link>
        </div>
        <CategoryRail items={categories.filter(c => !c.parent && c.active).filter(c => { const d = departments.find(item => item.categoryId === c.id); return !d || experienceForDepartment(d, categories).enabled; }).sort((a,b) => a.sort-b.sort).map(c => { const d = departments.find(item => item.categoryId === c.id); return { id:c.id, name:d ? (d.name === "Home" ? "Home & living" : d.name) : c.name, image:d ? experienceForDepartment(d, categories).heroImage : c.image, to:d ? "/"+d.slug : "/shop?category="+encodeURIComponent(c.name), department:!!d }; })} />
      </section>

      <FlashSale/>
      <CouponShelf/>
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
      <PerfumeInvitation/>
      <BudgetFinds/>
      <CollectionStories/>
      <ComboShowcase />
      <RecentlyViewed/>
      <CustomerVoices />
      <section className="brand-story-wrap botanical-stage">
        <Botanical kind="dry" className="story-botanical" />
        <div className="container brand-story">
          <div className="brand-story-image" data-depth="image" data-depth-max="18">
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
