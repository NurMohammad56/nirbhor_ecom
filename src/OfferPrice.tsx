import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useStore, cartTotals } from "./store";
import type { Product } from "./data";
import { itemPrice, money } from "./data";
import { bnNode } from "./bn";
import { availableCoupon, couponConditions, rememberOffer } from "./offer-merchandising";
import { couponApplies } from "./order-logic";

export function CouponPrice({product,variant}:{product:Product;variant?:string}){
  const s=useStore(),[params]=useSearchParams(),code=params.get("coupon"),coupon=s.coupons.find(c=>c.code===code&&availableCoupon(c));
  if(!coupon||!couponApplies(coupon,product))return null;
  const price=itemPrice(product,variant||product.weight),totals=cartTotals([{id:product.id,variant:variant||product.weight,quantity:1}],s.products,s.settings,"Dhaka",coupon,s);
  if(price<coupon.minimum||totals.couponDiscount<=0)return <span className="coupon-price-note">কুপনের শর্ত দেখে অর্ডার করুন</span>;
  return <div className="coupon-product-price"><span>কুপনে</span><b>{bnNode(money(price-totals.couponDiscount))}</b><small>{coupon.code} · শর্ত প্রযোজ্য</small></div>;
}
export function CouponCollectionNotice(){
  const s=useStore(),[params]=useSearchParams(),code=params.get("coupon"),coupon=s.coupons.find(c=>c.code===code&&availableCoupon(c));
  useEffect(()=>{if(coupon)rememberOffer(coupon.code);},[coupon?.code]);
  if(!code)return null;
  return <div className="coupon-collection-notice" role="status">{coupon?<><div><b>{coupon.code}</b><span>{bnNode(couponConditions(coupon))}</span></div><small>যোগ্য অর্ডারে কোডটি চেকআউটে প্রযোজ্য হবে।</small></>:<span>কুপনটি এখন প্রযোজ্য নয়। <Link to="/offers">চলতি অফার দেখুন</Link></span>}</div>;
}
