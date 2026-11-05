"use client";
import { useStore } from "@/providers/store-provider";
import { bnNode } from "@/lib/bn";
import { bestSelling, productSales } from "@/lib/best-selling";
import { descendants } from "@/lib/category-tree";
import ProductCarousel from "@/features/products/ProductCarousel";
export default function TopSellingRail({ category }: { category: string }) {
  const { products, orders, categories } = useStore();
  const names = descendants(categories, category); names.add(category);
  const items = bestSelling(products.filter(p => names.has(p.category)), orders);
  const sales = productSales(orders), hasSales = items.some(p => (sales.get(p.id) || 0) > 0);
  return <ProductCarousel items={items} title={hasSales ? "বেশি অর্ডার হওয়া পণ্য" : "পছন্দের তালিকায় রাখুন"} kicker="আপনার জন্য বাছাই" label={bnNode(category) + " - জনপ্রিয় পণ্যের স্লাইডার"} footnote={hasSales ? "এই ব্রাউজারে সংরক্ষিত অর্ডার অনুযায়ী" : undefined} className="top-selling-section"/>;
}
