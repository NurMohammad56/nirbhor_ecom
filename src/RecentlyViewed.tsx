import { Clock3, X } from "lucide-react";
import { useStore } from "./store";
import ProductCarousel from "./ProductCarousel";
export default function RecentlyViewed() {
  const { recent, setRecent, products } = useStore();
  const items = [...new Set(recent)].map(id => products.find(p => p.id === id && p.status === "Published")).filter((p): p is NonNullable<typeof p> => !!p).slice(0, 6);
  if (items.length < 2) return null;
  return <section className="container brand-section recently-viewed-section" aria-label="সম্প্রতি দেখা পণ্য"><div className="brand-section-heading"><div><span className="section-kicker"><Clock3 size={15}/>আগে দেখেছেন</span><h2>পছন্দগুলো আবার দেখুন</h2></div><button className="recent-clear" onClick={() => setRecent([])}><X size={14}/>দেখার ইতিহাস মুছুন</button></div><ProductCarousel items={items} bare label="সম্প্রতি দেখা পণ্যের স্লাইডার" footnote="এই ব্রাউজারে আপনার দেখা পণ্য"/></section>;
}
