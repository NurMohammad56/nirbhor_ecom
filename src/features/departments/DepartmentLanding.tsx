"use client";
import WorldEditorial from "@/features/departments/WorldEditorial";
import {PerfumeHero,ScentStudio} from "@/features/departments/PerfumeExperience";
import { bnNode } from "@/lib/bn";
import { Link, useParams } from "@/lib/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
} from "lucide-react";
import { useStore } from "@/providers/store-provider";
import {
  departments,
  categoryForDepartment,
  experienceForDepartment,
  departmentShopHref,
} from "@/lib/departments";
import { Badge, Button, Empty, ProductCard } from "@/components/ui";
import { Botanical } from "@/components/SceneMotion";
import CategoryRail from "@/features/catalog/CategoryRail";
import TopSellingRail from "@/features/catalog/TopSellingRail";
import CustomerVoices from "@/features/home/CustomerVoices";
import { ComboShowcase } from "@/features/offers/OfferCards";
import AmbientBackdrop from "@/components/AmbientBackdrop";
import CategoryCollectionSection from "@/features/catalog/CategoryCollectionSection";
import { categorySections } from "@/lib/department-sections";
import type { BuiltInSectionId } from "@/lib/department-sections";
import CinematicHero from "@/features/home/CinematicHero";
import { offerSlides } from "@/lib/offer-merchandising";

const questions: Record<string, [string, string][]> = {
  tech: [
    ["এখানে কী ধরনের টেক পণ্য পাব?", "হেডফোন, ইয়ারবাডস, স্পিকার, কীবোর্ড, মাউস, ওয়েবক্যাম, গেম কন্ট্রোলার ও চার্জিং অ্যাকসেসরিজ। কাজ বা অবসরের প্রয়োজন অনুযায়ী ক্যাটাগরি থেকে বেছে নিন।"],
    ["আমার ডিভাইসের সঙ্গে কাজ করবে?", "নির্দিষ্ট মডেলের সংযোগ, পোর্ট, অপারেটিং সিস্টেম ও ডিভাইস সাপোর্ট মিলিয়ে নিন। তথ্য না থাকলে অর্ডারের আগে আমাদের কাছে জেনে নিন।"],
    ["স্পেসিফিকেশন ও ওয়ারেন্টি কোথায় পাব?", "প্রতিটি পণ্যের বিস্তারিত অংশে মডেলের তথ্য দেখুন। ওয়ারেন্টি ও রিটার্নের শর্ত পণ্য অনুযায়ী আলাদা হতে পারে; কেনার আগে নিশ্চিত হয়ে নিন।"],
  ],
  sneakers: [
    ["সাইজ কীভাবে বেছে নেব?", "নির্দিষ্ট মডেলের EU সাইজ, ইনসোলের মাপ ও ফিটমেন্টের তথ্য মিলিয়ে নিন। প্রয়োজন হলে অর্ডারের আগে আমাদের সঙ্গে যোগাযোগ করুন।"],
    ["উপাদান ও যত্নের তথ্য কোথায় পাব?", "প্রতিটি পণ্যের বিস্তারিত অংশ ও মডেলের ব্যবহারবিধি দেখুন। ছবির রং বা টেক্সচার দেখে নির্দিষ্ট উপাদান অনুমান না করে তথ্য মিলিয়ে নিন।"],
    ["সাইজ পরিবর্তন করা যাবে?", "অর্ডারের আগে রিটার্ন ও এক্সচেঞ্জের শর্ত দেখে নিন। নির্দিষ্ট পণ্যের তথ্য জানতে সহায়তায় যোগাযোগ করুন।"],
  ],
  watches: [
    ["মুভমেন্ট ও কেসের মাপ কোথায় দেখব?", "পণ্যের বিস্তারিত অংশে নির্দিষ্ট মডেলের তথ্য দেখুন। কোনো তথ্য না থাকলে অর্ডারের আগে জেনে নিন।"],
    ["ঘড়ি কি পানিতে ব্যবহার করা যাবে?", "পানি-সহনশীলতা মডেল অনুযায়ী আলাদা। নিশ্চিত রেটিং ও নির্মাতার নির্দেশনা ছাড়া পানিতে ব্যবহার করবেন না।"],
    ["ওয়ারেন্টির শর্ত কী?", "নির্দিষ্ট মডেলের ওয়ারেন্টি ও রিটার্নের শর্ত দেখুন বা আমাদের সঙ্গে যোগাযোগ করুন।"],
  ],
  "smart-life": [
    ["স্মার্ট লাইফে কী ধরনের পণ্য পাব?", "ঘর পরিষ্কার, রান্নাঘর, সেন্সর লাইট, বাথরুম ও কাপড়ের যত্নের ব্যবহারিক সহায়ক পাবেন। দাম দিয়ে নয়, নিজের প্রয়োজনের কাজটি দিয়ে পছন্দ শুরু করুন।"],
    ["চার্জিং ও মডেলের তথ্য কোথায় দেখব?", "পণ্যের বিস্তারিত অংশে পাওয়ার, মাপ, ব্যবহারবিধি ও প্যাকের তথ্য দেখুন। কোনো তথ্য না থাকলে অর্ডারের আগে আমাদের কাছে জেনে নিন।"],
    ["ওয়ারেন্টি বা পরিবর্তনের সুযোগ আছে?", "শর্ত পণ্য ও মডেল অনুযায়ী আলাদা হতে পারে। নির্বাচিত পণ্যের ওয়ারেন্টি ও রিটার্নের তথ্য দেখে নিন অথবা সহায়তার জন্য যোগাযোগ করুন।"],
  ],
  perfume: [["কোন সুগন্ধ দিয়ে শুরু করব?","সতেজ ঘ্রাণ পছন্দ হলে ফ্রেশ ও সিট্রাস, ফুলের আবেশ চাইলে ফ্লোরাল, আর উষ্ণতা চাইলে উডি ও অ্যাম্বার বিভাগটি দেখুন।"],["টপ, হার্ট ও বেস নোট কী?","এগুলো ঘ্রাণের বিভিন্ন অনুভব বোঝানোর বর্ণনা। নোট পণ্যের উপাদান বা অ্যালার্জেনের সম্পূর্ণ তালিকা নয়।"],["স্থায়িত্ব ও আসল পণ্যের তথ্য কীভাবে জানব?","ব্র্যান্ড, পরিমাণ, ঘনত্ব ও প্রস্তুতকারকের তথ্য পণ্যের বিস্তারিত অংশে মিলিয়ে নিন। ত্বক ও আবহাওয়াভেদে সুগন্ধের অভিজ্ঞতা বদলাতে পারে।"]],
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
  const store = useStore(), { products, categories } = store;
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
  const featured = items;
  const builtIn = {
    categories: (<section className="container brand-section department-collection-section" id="department-collections">
        <div className="brand-section-heading"><h2>{bnNode("Categories")}</h2><Link className="brand-underlined" to={departmentShopHref(d)}>{bnNode("All products")}<ArrowUpRight size={16} /></Link></div>
        <CategoryRail label={bnNode(d.name)+" ক্যাটাগরি"} items={subcategories.map(c=>({id:c.id,name:c.name,image:c.image || items.find(p=>p.subcategory===c.name)?.image || exp.heroImage,to:departmentShopHref(d,c.name)}))} />
      </section>),
    bestsellers: (<TopSellingRail category={category.name}/>),
    products: (<section className="department-product-edit">
        <div className="container brand-section">
          <div className="brand-section-heading">
            <div>
              
              <h2>{bnNode("All products")}</h2>
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
      </section>),
    combos: (<ComboShowcase category={category.name} />),
    reviews: (<CustomerVoices category={category.name} />),
    story: d.slug === "perfume" ? <ScentStudio/> : <div className="container world-story-wrap"><WorldEditorial slug={d.slug}/></div>,
    faq: (<section className="department-faq-section botanical-stage">
        {!["smart-life","sneakers","watches","tech"].includes(d.slug) && <Botanical kind={d.slug === "organic" ? "leaf" : "dry"} className="editorial-botanical" />}
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
      </section>),
    explore: (<section className="container department-switcher">
        
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
      </section>),
  };
  return (
    <main className={`department-landing department-${d.slug}`}>
      {d.slug === "perfume" ? <div className="container perfume-hero-wrap"><PerfumeHero/></div> : offerSlides(store,d.slug).length ? <div className="container department-promo-wrap"><CinematicHero slides={offerSlides(store,d.slug)} department/></div> : <section data-depth={d.slug === "sneakers" ? undefined : "hero"} data-depth-max="18" className="department-hero-shell immersive-department">
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
            {bnNode(d.slug === "beauty" && <div className="serum-orbit" aria-hidden="true"><img src="/assets/serum-bare-v5.webp" alt={bnNode("")} /></div>)}
          </div>
          <div className="department-scene-footer">{d.showcaseLabel&&<span className="digital-showcase-label">{d.showcaseLabel}</span>}<a href="#department-collections">{bnNode("SCROLL TO DISCOVER ")}<span>{bnNode("↓")}</span></a></div>
        </div>
        {bnNode((d.slug === "organic" || d.slug === "home-living") && <Botanical kind={d.slug === "organic" ? "leaf" : "dry"} className="hero-botanical" />)}
      </section>}
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
      <div className="ambient-surface department-atmosphere"><AmbientBackdrop kind={d.slug}/>
      {categorySections(category).filter(block => block.enabled).map(block => <div className="department-section-slot" data-block={block.id} key={block.id}>{block.kind === "collection" ? <CategoryCollectionSection block={block}/> : builtIn[block.id as BuiltInSectionId]}</div>)}
      </div>
    </main>
  );
}
