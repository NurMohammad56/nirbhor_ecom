import type { Banner, Category, Product } from "./data";
import { techDepartment } from "./tech-department";

const seeds = [
  ["headphones", "গ্রাফাইট ওভার-ইয়ার হেডফোন", "Graphite Over Ear Headphones", 2990, "অডিও", "গ্রাফাইট টোন আর কুশনড ইয়ারকাপের লুক। কাজের ডেস্ক বা নিজের প্লেলিস্টের জন্য পছন্দের ডিজাইনটি কাছ থেকে দেখুন।", "সংযোগের ধরন, মাইক্রোফোন, ব্যাটারি ও ডিভাইস সাপোর্ট"],
  ["earbuds", "আইভরি ইয়ারবাডস", "Ivory Earbuds Charging Case", 1890, "অডিও", "পকেটে রাখার মতো কেস আর আইভরি টোনের সিম্পল ডিজাইন। নিজের ব্যবহারের জন্য ফিট ও মডেলের তথ্য মিলিয়ে নিন।", "ডিভাইস সাপোর্ট, কেসের চার্জিং, ব্যাটারি ও ফিট"],
  ["keyboard", "ল্যাভেন্ডার কমপ্যাক্ট কীবোর্ড", "Lavender Compact Keyboard Mechanical Style", 3290, "কম্পিউটার অ্যাকসেসরিজ", "ক্রিম ও গ্রাফাইট কীক্যাপের সঙ্গে ল্যাভেন্ডার অ্যাকসেন্ট। ছোট ডেস্কের সেটআপেও নিজের রঙের একটি ছোঁয়া।", "কী লেআউট, সুইচ, সংযোগের ধরন ও অপারেটিং সিস্টেম সাপোর্ট"],
  ["mouse", "গ্রাফাইট ডেস্ক মাউস", "Graphite Desktop Ergonomic Mouse", 1190, "কম্পিউটার অ্যাকসেসরিজ", "গোলাকার গ্রিপ-লুক, স্ক্রল হুইল আর সাইড বাটনের সাজানো ডিজাইন। হাতের ফিট ও কাজের প্রয়োজন মিলিয়ে দেখুন।", "মাপ, সংযোগের ধরন, সেন্সর ও ডিভাইস সাপোর্ট"],
  ["speaker", "পেবল ডেস্ক স্পিকার", "Pebble Desktop Speaker", 2290, "অডিও", "ওয়ার্ম-গ্রে মেশ টেক্সচার আর ছোট সিলিন্ডার ডিজাইন। আপনার ডেস্ক বা পছন্দের কোণের সঙ্গে মিলিয়ে বেছে নিন।", "সংযোগের ধরন, পাওয়ার, ব্যাটারি ও অডিও আউটপুট"],
  ["webcam", "ফোকাস ডেস্ক ওয়েবক্যাম", "Focus Desktop Webcam Camera", 1990, "কম্পিউটার অ্যাকসেসরিজ", "গ্রাফাইট বডি আর মনিটরে বসানোর ক্লিপ-স্ট্যান্ডের লুক। ভিডিও কলের সেটআপে মডেলের প্রয়োজনীয় তথ্য জেনে যোগ করুন।", "রেজল্যুশন, মাইক্রোফোন, সংযোগ ও সফটওয়্যার সাপোর্ট"],
  ["controller", "আর্ক গেম কন্ট্রোলার", "Arc Game Controller Gamepad", 2490, "গেমিং", "আইভরি ও গ্রাফাইটের সঙ্গে ল্যাভেন্ডার বাটন। নিজের গেমিং সেটআপের জন্য গ্রিপ, কন্ট্রোল আর কম্প্যাটিবিলিটি মিলিয়ে নিন।", "কনসোল বা পিসি কম্প্যাটিবিলিটি, সংযোগ ও বাটন ম্যাপিং"],
  ["charger", "আইভরি ডেস্ক চার্জিং হাব", "Ivory Desktop USB C USB A Charging Hub", 1590, "চার্জিং", "এক জায়গায় পোর্ট রাখার পরিচ্ছন্ন ডেস্ক-হাব ডিজাইন। আপনার ডিভাইস ও কেবলের সঙ্গে মিলিয়ে মডেলের পাওয়ার তথ্য দেখে নিন।", "পোর্ট, মোট পাওয়ার, ভোল্টেজ, প্লাগ ও ডিভাইস কম্প্যাটিবিলিটি"],
] as const;

export const techProducts: Product[] = seeds.map(([key,name,english,price,subcategory,description,check],i) => {
  const id=`tech-${key}`, image=`/assets/${id}-v1.webp`, weight="স্ট্যান্ডার্ড";
  return {
    id,name,category:"Tech",subcategory,price,oldPrice:0,image,images:[image],stock:12,rating:0,reviews:0,badge:"নমুনা পণ্য",weight,
    source:"Imported collection",brand:"Imported collection",status:"Published",sku:`DEMO-${id.toUpperCase()}`,type:subcategory,dietary:"",color:"ছবির নমুনা",created:48+i,campaign:false,description,
    tags:`${english}, tech, technology, accessories, টেক, গ্যাজেট, অ্যাকসেসরিজ`,
    variants:[{label:weight,price,stock:12,sku:`DEMO-${id.toUpperCase()}-STD`,image}],
    details:{"ক্যাটালগ":"নমুনা পণ্য ও নমুনা মূল্য","বেছে নেওয়ার আগে":`${check} নির্দিষ্ট মডেল অনুযায়ী দেখে নিন।`},
    page:{kicker:"আপনার সেটআপ, আপনার মতো",shortDescription:description,showProof:false,detailsTitle:"আপনার দিনের সঙ্গে মিলিয়ে নিন",detailsBody:description,
      materialsTitle:"মডেল ও কম্প্যাটিবিলিটি",materialsBody:`${check} - অর্ডারের আগে এই তথ্যগুলো মিলিয়ে নিন। ছবিটি ডিজাইনের ধারণা বোঝানোর নমুনা; নির্দিষ্ট মডেলের স্পেসিফিকেশন সরবরাহকারীর তথ্য অনুযায়ী যোগ হবে।`,
      storage:"পণ্যের সঙ্গে দেওয়া ব্যবহার, চার্জিং ও পরিষ্কারের নির্দেশনা অনুসরণ করুন।",
      faqTitle:"কেনার আগে জেনে নিন",faqs:[{question:"আমার ডিভাইসে ব্যবহার করা যাবে?",answer:`আপনার ডিভাইস ও ব্যবহারের প্রয়োজনের সঙ্গে ${check} মিলিয়ে নিন। কোনো তথ্য না থাকলে অর্ডারের আগে আমাদের কাছে জেনে নিন।`},{question:"ওয়ারেন্টি বা রিটার্নের শর্ত কী?",answer:"নির্দিষ্ট মডেলের ওয়ারেন্টি ও রিটার্নের তথ্য দেখে নিন বা সহায়তায় যোগাযোগ করুন।"}],
      sections:[{id:"details",enabled:true},{id:"benefits",enabled:false},{id:"source",enabled:false},{id:"faq",enabled:true},{id:"reviews",enabled:true},{id:"bundle",enabled:false},{id:"related",enabled:true}]},
  };
});

export const techCategories: Category[] = [
  {id:"c-tech",name:"Tech",parent:"",description:techDepartment.tagline,active:true,image:techDepartment.image,sort:7,departmentSlug:"tech",experience:{...techDepartment.experience},
    landingSections:["categories","bestsellers","story","products","combos","reviews","faq","explore"].map(id=>({id,kind:"builtin",enabled:true}))},
  ...techDepartment.subcategories.map((name,i)=>({id:`c-tech-${i}`,name,parent:"Tech",description:techDepartment.tagline,active:true,image:techProducts.find(p=>p.subcategory===name)!.image,sort:i})),
];

/** Persist the appended list before marking the migration done, preserving merchant edits and later removals. */
export function migrateTechState<T>(key:string,value:T):T {
  if(!["products","categories","banners"].includes(key)||!Array.isArray(value))return value;
  const marker=`nirbhor-tech-v1-${key}`;
  if(localStorage.getItem(marker))return value;
  const list=value as {id:string;name?:string;parent?:string;order?:number}[];
  const banner:Banner={id:"tech-v1",title:techDepartment.experience.heroTitle,subtitle:techDepartment.experience.description,cta:"টেক দেখুন",link:"/tech",active:true,image:techDepartment.image,order:Math.max(-1,...list.map(item=>item.order||0))+1,start:"",end:""};
  const additions=key==="products"?techProducts:key==="categories"?techCategories:[banner];
  const next=[...list,...additions.filter(item=>!list.some(old=>old.id===item.id||(key==="categories"&&old.name===(item as Category).name&&old.parent===(item as Category).parent)))];
  localStorage.setItem(`nirbhor-v1-${key}`,JSON.stringify(next));
  localStorage.setItem(marker,"done");
  return next as T;
}
