import type {Category,Product} from '@/data/catalog';
import {perfumeDepartment as d} from './perfume-department';
const seeds=[
 ['amber','অ্যাম্বার উড','উডি ও অ্যাম্বার',2890,'বার্গামট','জুঁই, মৃদু মসলার আভাস','ভ্যানিলা, চন্দন','উষ্ণ কাঠের সঙ্গে নরম মিষ্টতার ভাবনা। সন্ধ্যার সাজে একটু গভীর, একটু নিজস্ব অনুভব।'],
 ['rose','রোজ মিউজ','ফ্লোরাল',2490,'সতেজ ফলের আভাস','গোলাপ, জুঁই','মাস্ক, নরম কাঠ','গোলাপের কোমলতা আর সাদা ফুলের হালকা আবেশ। পরিচ্ছন্ন, ফুলেল সুগন্ধের একটি ভিজ্যুয়াল ধারণা।'],
 ['noir','ভের্ট নোয়ার','ফ্রেশ ও সিট্রাস',3190,'বার্গামট, সবুজ পাতার আভাস','অ্যারোম্যাটিক হার্বস','সিডার, উডি অ্যাম্বার','সবুজ সতেজতা দিয়ে শুরু, কাঠের উষ্ণতায় শেষ। সতেজ আর গভীর ঘ্রাণের মাঝামাঝি একটি পছন্দ।']
] as const;
export const perfumeProducts:Product[]=seeds.map(([key,name,subcategory,price,top,heart,base,description],i)=>{
 const id='perfume-'+key,image='/assets/'+id+'-v1.webp';return {id,name,category:'Perfume',subcategory,price,oldPrice:0,image,images:[image],stock:12,rating:0,reviews:0,badge:'নমুনা পণ্য',weight:'৫০ মিলি',source:'Imported collection',brand:'Imported collection',status:'Published',sku:'DEMO-PERFUME-'+key.toUpperCase(),type:'পারফিউম',dietary:'',color:'ছবির নমুনা',created:90+i,campaign:false,description,tags:'perfume, fragrance, scent, সুগন্ধি, পারফিউম, '+name,
 variants:[{label:'৫০ মিলি',price,stock:12,sku:'DEMO-PERFUME-'+key.toUpperCase(),image}],
 details:{'ক্যাটালগ':'নমুনা পণ্য ও নমুনা মূল্য','প্রোফাইল':'ডিজাইন বোঝানোর নমুনা; প্রস্তুতকারকের তথ্য নয়।'},
 page:{showFragrance:true,fragranceSample:true,fragranceFamily:subcategory,fragranceTopNotes:top,fragranceHeartNotes:heart,fragranceBaseNotes:base,fragranceConcentration:'নির্মাতার তথ্য যোগ হবে',fragranceContext:'উপরের নোটগুলো এই ডিজাইনের নমুনা প্রোফাইল। প্রকৃত পণ্য যোগ করার সময় প্রস্তুতকারকের তথ্য অনুযায়ী পরিবর্তন করুন।',kicker:'সুগন্ধের কালেকশন',shortDescription:description,showProof:false,showRating:false,detailsTitle:'সুগন্ধের গল্প, আপনার পছন্দে',detailsBody:description,materialsTitle:'কেনার আগে জেনে নিন',materialsBody:'ছবি, মূল্য ও সুগন্ধের প্রোফাইল ডিজাইনের নমুনা। প্রকৃত ব্র্যান্ড, ঘনত্ব, উপাদান ও প্যাকেজিংয়ের তথ্য প্রস্তুতকারকের বিবরণ অনুযায়ী যোগ হবে।',storage:'সরাসরি রোদ ও অতিরিক্ত তাপ থেকে দূরে রাখুন। প্যাকেজিংয়ের ব্যবহারবিধি অনুসরণ করুন।',faqs:[{question:'সুগন্ধ কতক্ষণ থাকবে?',answer:'সময় নির্দিষ্ট পণ্য, ত্বক, আবহাওয়া ও ব্যবহারের ওপর নির্ভর করে। যাচাইকৃত তথ্য ছাড়া নির্দিষ্ট ঘণ্টার নিশ্চয়তা দেওয়া হচ্ছে না।'},{question:'ঘ্রাণের নোট কি উপাদানের সম্পূর্ণ তালিকা?',answer:'না। নোট সুগন্ধ বোঝানোর ভাষা। উপাদান ও অ্যালার্জেনের তথ্য পণ্যের প্যাকেজিং থেকে দেখুন।'}],sections:[{id:'details',enabled:true},{id:'faq',enabled:true},{id:'benefits',enabled:false},{id:'source',enabled:false},{id:'reviews',enabled:true},{id:'bundle',enabled:false},{id:'related',enabled:true}]}
 };
});
export const perfumeCategories:Category[]=[{id:d.categoryId,name:d.category,parent:'',description:d.tagline,active:true,image:d.image,sort:8,departmentSlug:d.slug,experience:{...d.experience},landingSections:['categories','story','products','reviews','faq','explore'].map(id=>({id,kind:'builtin',enabled:true}))},...d.subcategories.map((name,i)=>({id:'c-perfume-'+i,name,parent:d.category,description:d.tagline,active:true,image:perfumeProducts.find(p=>p.subcategory===name)!.image,sort:i}))];
/** Append once; never replace merchant records or resurrect deliberate removals. */
export function migratePerfumeState<T>(key:string,value:T):T{
 if(!['products','categories'].includes(key)||!Array.isArray(value))return value;
 const marker='nirbhor-perfume-v1-'+key;if(localStorage.getItem(marker))return value;
 const list=value as {id:string;name?:string;parent?:string}[],additions=key==='products'?perfumeProducts:perfumeCategories;
 const next=[...list,...additions.filter(item=>!list.some(old=>old.id===item.id||(key==='categories'&&old.name===(item as Category).name&&old.parent===(item as Category).parent)))];
 localStorage.setItem('nirbhor-v1-'+key,JSON.stringify(next));localStorage.setItem(marker,'done');return next as T;
}
