import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "./ui";
import { useStore } from "./store";
import { bnNode } from "./bn";

export default function PickleCollection({ category }: { category: string }) {
  const { products, categories } = useStore();
  const collection = categories.find(c => c.parent === category && (c.id === "sc-pickles" || c.name === "আচার"));
  const items = products.filter(p => p.category === category && p.subcategory === collection?.name && p.status === "Published");
  if (!collection?.active || !items.length) return null;
  return <section className="container brand-section pickle-collection" id="pickles" aria-label="আচারের সংগ্রহ">
    <div className="brand-section-heading"><div><span className="section-kicker">খাবারে একটু বাড়তি আনন্দ</span><h2>টক-ঝালে, পরিচিত স্বাদে</h2><p>আম, জলপাই আর মিক্সড আচার। আপনার পছন্দের স্বাদ বেছে নিন।</p></div><Link className="brand-underlined" to={`/organic/shop?subcategory=${encodeURIComponent(collection.name)}`}>{bnNode(collection.name)} দেখুন<ArrowUpRight size={16}/></Link></div>
    <div className="product-grid three">{items.slice(0, 3).map(p => <ProductCard key={p.id} product={p}/>)}</div>
  </section>;
}
