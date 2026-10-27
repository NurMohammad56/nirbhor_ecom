import { Link } from "react-router-dom";
import { BadgeCheck, Star, ArrowUpRight } from "lucide-react";
import { useStore } from "./store";
import { bnNode } from "./bn";
import { productHref } from "./departments";

export default function CustomerVoices({ category }: { category?: string }) {
  const { reviews, products, categories } = useStore();
  const eligible = reviews.filter(review => review.status === "Approved" && (!category || products.some(product => product.id === review.productId && product.category === category)));
  const selected = [...eligible.filter(review => review.featured), ...eligible.filter(review => !review.featured)].slice(0, 3);
  if (!selected.length) return null;
  return <section className="container brand-section customer-voices">
    <div className="brand-section-heading"><h2>ক্রেতাদের অভিজ্ঞতা</h2></div>
    <div className="customer-voice-grid">{selected.map(review => {
      const product = products.find(item => item.id === review.productId);
      return <article className="customer-voice" key={review.id}>
        <div className="voice-rating" aria-label={`${bnNode(review.rating)} / ৫ রেটিং`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < review.rating ? "currentColor" : "none"} />)}<span>{review.demo ? "নমুনা রিভিউ" : review.verified ? <><BadgeCheck size={14} />যাচাইকৃত ক্রেতা</> : "ক্রেতার রিভিউ"}</span></div>
        <h3>{bnNode(review.title)}</h3><p>{bnNode(review.text)}</p>
        <footer><strong>{bnNode(review.name)}</strong>{product && <Link to={productHref(product, categories)}>{bnNode(product.name)}<ArrowUpRight size={14} /></Link>}</footer>
      </article>;
    })}</div>
  </section>;
}
