"use client";
import { Link } from "@/lib/navigation";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "@/providers/store-provider";
import { bnNode } from "@/lib/bn";
import { ProductCard } from "@/components/ui";
import ProductCarousel from "@/features/products/ProductCarousel";
import { safeSectionLink } from "@/lib/department-sections";
import type { CategorySection } from "@/lib/department-sections";
export default function CategoryCollectionSection({ block }: { block: CategorySection }) {
  const { products } = useStore();
  const items = (block.productIds || []).map(id => products.find(p => p.id === id && p.status === "Published")).filter((p): p is NonNullable<typeof p> => !!p);
  if (!block.enabled || !items.length) return null;
  return <section className="container brand-section category-custom-section" id={block.id} data-section-id={block.id}>
    <div className="brand-section-heading"><div>{block.kicker && <span className="section-kicker">{bnNode(block.kicker)}</span>}<h2>{bnNode(block.title)}</h2>{block.description && <p>{bnNode(block.description)}</p>}</div>{block.href && safeSectionLink(block.href) && <Link className="brand-underlined" to={block.href}>{bnNode(block.linkLabel || "সব পণ্য")}<ArrowUpRight size={16}/></Link>}</div>
    {block.layout === "grid" ? <div className="product-grid four">{items.map(p => <ProductCard key={p.id} product={p}/>)}</div> : <ProductCarousel items={items} bare label={block.title || "বাছাই পণ্য"}/>}
  </section>;
}
