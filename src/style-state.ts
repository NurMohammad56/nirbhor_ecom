import type { Product, Category, Banner } from "./data";
import { styleDepartments } from "./style-departments";
const seeds = [
  ["sneaker-court", "কোর্ট আইভরি স্নিকার্স", "Ivory Court Sneakers", 2490, "লো-টপ", "আইভরি ও সেজ টোনে ক্লিন কোর্ট-স্টাইল লুক। নিজের পছন্দের পোশাকের সঙ্গে মিলিয়ে দেখুন, সাইজের তথ্য জেনে বেছে নিন।"],
  ["sneaker-urban", "আরবান স্লেট স্নিকার্স", "Urban Slate Runner Sneakers", 2890, "রানার স্টাইল", "চারকোল ও স্লেট টোনে রানার-স্টাইল ডিজাইন। প্যানেল আর সোলের লুক কাছ থেকে দেখে নিজের প্রতিদিনের স্টাইলে মেলান।"],
  ["sneaker-terra", "স্ট্রিট টেরা হাই-টপ", "Street Terra High Top Sneakers", 2790, "হাই-টপ", "ক্রিম ও টেরাকোটা টোনের হাই-টপ সিলুয়েট। লেস আর গোড়ালির কাট দেখে আপনার পছন্দের স্ট্রিট লুক সাজান।"],
  ["sneaker-knit", "ডেইলি নিট স্নিকার্স", "Daily Knit Look Sneakers", 2190, "লো-টপ", "ওটমিল টোন আর নিট-লুক টেক্সচারে সিম্পল একটি জোড়া। ডিজাইন ও ফিটের তথ্য মিলিয়ে নিজের দিনের জন্য বেছে নিন।"],
  ["watch-midnight", "ক্লাসিক মিডনাইট ঘড়ি", "Classic Midnight Bracelet Watch", 3490, "ব্রেসলেট স্টাইল", "মিডনাইট-ব্লু ডায়াল আর সিলভার টোনের ব্রেসলেট লুক। পোশাকের সঙ্গে মিলিয়ে নিজের পছন্দের খুঁটিনাটি দেখুন।"],
  ["watch-heritage", "হেরিটেজ ট্যান ঘড়ি", "Heritage Tan Strap Watch", 2990, "স্ট্র্যাপ স্টাইল", "ক্রিম ডায়াল, ট্যান স্ট্র্যাপ-লুক আর সিম্পল মার্কারের আয়োজন। আপনার দৈনন্দিন স্টাইলে শান্ত একটি ছোঁয়া।"],
  ["watch-square", "সিলভার স্কোয়ার ঘড়ি", "Silver Square Bracelet Watch", 3890, "ব্রেসলেট স্টাইল", "রাউন্ডেড-স্কোয়ার কেস আর গ্রাফাইট ডায়ালের ভিন্ন লুক। আকৃতি, স্ট্র্যাপ ও কবজির ফিট মিলিয়ে পছন্দ করুন।"],
  ["watch-rose", "রোজ ডায়াল মেশ ঘড়ি", "Rose Dial Mesh Watch", 3290, "মেশ স্টাইল", "রোজ টোনের কেস, শ্যাম্পেন ডায়াল আর মেশ ব্রেসলেটের লুক। ছোট ছোট ডিজাইন ডিটেইলে আপনার পছন্দ খুঁজুন।"],
] as const;
export const styleProducts: Product[] = seeds.map(([id,name,english,price,subcategory,description],i) => {
  const sneaker = id.startsWith("sneaker"), image = `/assets/style-${id}-v1.webp`, weight = sneaker ? "EU 40" : "স্ট্যান্ডার্ড";
  const variants = (sneaker ? ["EU 38","EU 39","EU 40","EU 41","EU 42","EU 43"] : [weight]).map(label => ({label,price,stock:sneaker?3:18,sku:`DEMO-${id.toUpperCase()}-${label.replaceAll(' ','-')}`,image}));
  return { id, name, category:sneaker?"Sneakers":"Watches", subcategory, price, oldPrice:0, image, images:[image], stock:18, rating:0,reviews:0,badge:"নমুনা পণ্য",weight,source:"Imported collection",brand:"Imported collection",status:"Published",sku:`DEMO-${id.toUpperCase()}`,type:sneaker?"স্নিকার্স":"হাতঘড়ি",dietary:"",color:"ছবির নমুনা",created:40+i,campaign:false,description,tags:`${english}, ${sneaker?'shoes, footwear, sneaker, স্নিকার্স, জুতা':'watch, wristwatch, ঘড়ি'}`,variants,
    details:{"ক্যাটালগ":"নমুনা পণ্য ও নমুনা মূল্য","মডেলের তথ্য":sneaker?"সাইজ, ইনসোলের মাপ ও উপাদান চূড়ান্ত মডেল অনুযায়ী দেখুন।":"কেসের মাপ, মুভমেন্ট, স্ট্র্যাপ ও পানি-সহনশীলতার তথ্য চূড়ান্ত মডেল অনুযায়ী দেখুন।"},
    page:{kicker:sneaker?"নিজের স্টাইলে, নিজের পথে":"সময় থাকুক নিজের স্টাইলে",shortDescription:description,showProof:false,detailsTitle:"ডিজাইনের খুঁটিনাটি",detailsBody:description,materialsTitle:sneaker?"সাইজ ও যত্নের তথ্য":"মডেল ও যত্নের তথ্য",materialsBody:"ছবিটি ডিজাইনের ধারণা বোঝানোর নমুনা। নির্দিষ্ট মডেলের উপাদান, মাপ ও যত্নের নির্দেশনা অর্ডারের আগে দেখে নিন।",storage:"মডেলের সঙ্গে দেওয়া পরিষ্কার ও সংরক্ষণের নির্দেশনা অনুসরণ করুন।",faqTitle:"বেছে নেওয়ার আগে",faqs:[{question:sneaker?"সঠিক সাইজ কীভাবে বেছে নেব?":"মডেলের বিস্তারিত কোথায় পাব?",answer:sneaker?"EU সাইজের সঙ্গে নির্দিষ্ট মডেলের ইনসোল ও ফিটমেন্টের তথ্য মিলিয়ে নিন। শুধু সাইজ নম্বর দেখে অনুমান না করে প্রয়োজনে আমাদের সঙ্গে যোগাযোগ করুন।":"এই পেজের মডেল, মাপ ও যত্নের তথ্য দেখুন। মুভমেন্ট, পানি-সহনশীলতা বা ওয়ারেন্টির তথ্য না থাকলে অর্ডারের আগে জেনে নিন।"}],sections:[{id:"details",enabled:true},{id:"benefits",enabled:false},{id:"source",enabled:false},{id:"faq",enabled:true},{id:"reviews",enabled:true},{id:"bundle",enabled:false},{id:"related",enabled:true}]},
  };
});
export const styleCategories: Category[] = styleDepartments.flatMap((d,index) => [
  {id:d.categoryId,name:d.category,parent:"",description:d.tagline,active:true,image:d.image,sort:5+index,departmentSlug:d.slug,experience:{...d.experience}},
  ...d.subcategories.map((name,i)=>({id:`${d.categoryId}-${i}`,name,parent:d.category,description:d.tagline,active:true,image:styleProducts.find(p=>p.category===d.category&&p.subcategory===name)!.image,sort:i})),
]);
export function migrateStyleState<T>(key: string,value:T):T {
  if(!["products","categories","banners"].includes(key)||!Array.isArray(value))return value;
  const marker=`nirbhor-style-v1-${key}`;if(localStorage.getItem(marker))return value;
  const list=value as {id:string;name?:string;parent?:string;order?:number}[];
  const max=Math.max(-1,...list.map(b=>b.order||0));
  const banners:Banner[]=styleDepartments.map((d,i)=>({id:`${d.slug}-v1`,title:d.experience.heroTitle,subtitle:d.experience.description,cta:d.slug==="sneakers"?"স্নিকার্স দেখুন":"ঘড়ি দেখুন",link:`/${d.slug}`,active:true,image:d.image,order:max+1+i,start:"",end:""}));
  const additions=key==="products"?styleProducts:key==="categories"?styleCategories:banners;
  const next=[...list,...additions.filter(item=>!list.some(old=>old.id===item.id||(key==="categories"&&old.name===(item as Category).name&&old.parent===(item as Category).parent)))];
  localStorage.setItem(`nirbhor-v1-${key}`,JSON.stringify(next));localStorage.setItem(marker,"done");return next as T;
}
