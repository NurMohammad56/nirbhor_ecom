import type { Product, Review } from "@/data/catalog";
import { sellingDescription } from "@/lib/merchandising-copy";
import {sampleFragranceAccords,type FragranceAccord} from '@/lib/fragrance-accords';

export type ProductBlockId = "benefits" | "details" | "source" | "faq" | "reviews" | "bundle" | "related";
export type ProductPageContent = {
 fragranceShowAccords:boolean;fragranceAccordsTitle:string;fragranceAccords:FragranceAccord[];
 showFragrance:boolean;fragranceSample:boolean;fragranceFamily:string;fragranceConcentration:string;fragranceTopNotes:string;fragranceHeartNotes:string;fragranceBaseNotes:string;fragranceContext:string;
 fragranceKicker:string;fragranceTitle:string;fragranceIntro:string;fragranceShowNoteImages:boolean;
 fragranceTopDescription:string;fragranceHeartDescription:string;fragranceBaseDescription:string;
 fragranceTopImage:string;fragranceHeartImage:string;fragranceBaseImage:string;fragranceOccasion:string;fragranceUsage:string;
 showGallerySummary:boolean;gallerySummaryTitle:string;gallerySummaryText:string;gallerySummaryMode:'auto'|'custom';gallerySummaryFacts:{label:string;value:string}[];gallerySummaryShowPack:boolean;gallerySummaryShowLinks:boolean;gallerySummaryShowSupport:boolean;
  headline: string; kicker: string; shortDescription: string;
  addToCartText: string; buyNowText: string; orderButtonText: string;
  quickOrderTitle: string; quickOrderText: string; quickOrderButtonText: string;
  assurances: { title: string; text: string }[];
  detailsTitle: string; detailsBody: string; materialsTitle: string; materialsBody: string;
  storage: string; ingredients: string; batch: string; deliveryText: string; returnsText: string;
  benefitsTitle: string; benefits: { title: string; text: string }[];
  sourceTitle: string; sourceText: string; sourceImage: string; sourceCaption: string;
  specifications: { label: string; value: string }[];
  proof: { label: string; value: string }[];
  faqTitle: string; faqs: { question: string; answer: string }[];
  reviewsTitle: string; relatedTitle: string; bundleTitle: string;
  sections: { id: ProductBlockId; enabled: boolean }[];
  showRating: boolean; showStock: boolean; showAssurances: boolean; showBuyNow: boolean;
  allowReviews: boolean; showProof: boolean;
};
export const productBlockNames: Record<ProductBlockId, string> = { benefits: "পণ্যের সুবিধা", details: "বিস্তারিত তথ্য", source: "উৎস ও গল্প", faq: "প্রশ্ন ও উত্তর", reviews: "রিভিউ", bundle: "একসঙ্গে কিনুন", related: "সংশ্লিষ্ট পণ্য" };
export function productPageContent(p: Product): ProductPageContent {
  const custom = p.page || {};
  const defaults: ProductPageContent = {
 fragranceShowAccords:true,fragranceAccordsTitle:'ঘ্রাণের প্রধান বৈশিষ্ট্য',fragranceAccords:sampleFragranceAccords(p),
 showFragrance:false,fragranceSample:false,fragranceFamily:"",fragranceConcentration:"",fragranceTopNotes:"",fragranceHeartNotes:"",fragranceBaseNotes:"",fragranceContext:"",
 fragranceKicker:'সুগন্ধকে একটু চিনে নিন',fragranceTitle:'প্রতিটি নোটে, আলাদা অনুভব।',fragranceIntro:'টপ, হার্ট ও বেস নোট বেছে ঘ্রাণের বর্ণনা পড়ুন। নিজের পছন্দের সঙ্গে মিলিয়ে নিন।',fragranceShowNoteImages:true,
 fragranceTopDescription:'প্রথম পরিচয়ের ঘ্রাণকে টপ নোট বলা হয়। এই প্রোফাইলের শুরুর অনুভব এখানে তুলে ধরা হয়েছে।',fragranceHeartDescription:'সুগন্ধের মাঝের চরিত্রকে হার্ট নোট বলা হয়। ফুলেল, মসলাদার বা অন্য যে আবেশটি পণ্যে বর্ণিত আছে, সেটি এখানে দেখুন।',fragranceBaseDescription:'সুগন্ধের গভীর, শেষের চরিত্রকে বেস নোট বলা হয়। ত্বক ও পরিবেশভেদে ঘ্রাণের অভিজ্ঞতা আলাদা হতে পারে।',
 fragranceTopImage:'',fragranceHeartImage:'',fragranceBaseImage:'',fragranceOccasion:'',fragranceUsage:'',
 showGallerySummary:true,gallerySummaryTitle:'কেনার আগে এক নজরে',gallerySummaryText:'',gallerySummaryMode:'auto',gallerySummaryFacts:[],gallerySummaryShowPack:true,gallerySummaryShowLinks:true,gallerySummaryShowSupport:true,
    headline: "", kicker: "", shortDescription: sellingDescription(p), addToCartText: "", buyNowText: "", orderButtonText: "",
    quickOrderTitle: "", quickOrderText: "", quickOrderButtonText: "",
    assurances: [{ title: "ডেলিভারির তথ্য", text: "ঠিকানা অনুযায়ী চার্জ অর্ডারের আগে দেখুন" }, { title: "পেমেন্ট ও সহায়তা", text: "ডেলিভারি ও পেমেন্টের শর্ত চেকআউটে দেখুন" }],
    detailsTitle: "পণ্যটি সম্পর্কে আরও জানুন", detailsBody: "", materialsTitle: "উপাদান ও ব্যবহারের তথ্য", materialsBody: "প্যাকেজিংয়ে দেওয়া উপাদান ও ব্যবহারবিধি দেখে নিন। বিস্তারিত জানতে আমাদের সঙ্গে যোগাযোগ করুন।",
    storage: "প্যাকেজিংয়ে দেওয়া সংরক্ষণ ও যত্নের নির্দেশনা অনুসরণ করুন।", ingredients: "", batch: "", deliveryText: "", returnsText: "",
    benefitsTitle: "আপনার পছন্দের আরও কিছু কারণ",
    benefits: [{ title: "পণ্যের তথ্য একসঙ্গে", text: "পরিমাণ, উৎস ও প্রয়োজনীয় তথ্য দেখে বেছে নিন।" }, { title: "যত্নে প্যাকিং", text: "ডেলিভারির জন্য পণ্য উপযোগী করে প্যাক করা হয়।" }, { title: "সহজে অর্ডার", text: "পছন্দের ভ্যারিয়েন্ট বেছে ব্যাগে যোগ করুন।" }, { title: "প্রয়োজনে সহায়তা", text: "অর্ডার ও পণ্য সম্পর্কে জানতে যোগাযোগ করুন।" }],
    sourceTitle: "উৎস থেকে আপনার ঘরে", sourceText: "", sourceImage: p.category === "Organic Food" ? "/assets/source.webp" : p.image, sourceCaption: "উৎস ও পণ্যের তথ্য দেখে বেছে নিন",
    specifications: [...Object.entries(p.details || {}).map(([label, value]) => ({ label, value })), { label: "ব্র্যান্ড", value: p.brand }, { label: "পরিমাণ / সাইজ", value: p.weight }, { label: "উৎস", value: p.source }, { label: "ধরন", value: p.type }, { label: "উপাদান / বৈশিষ্ট্য", value: p.dietary }, { label: "রং", value: p.color }].filter(i => i.value),
    proof: [{ label: "পণ্যের উৎস", value: p.source }, { label: "পরিমাণ", value: p.weight }, { label: "ব্র্যান্ড", value: p.brand }, { label: "অর্ডার", value: "সহজ চেকআউট" }],
    faqTitle: "কেনার আগে যা জানতে চান",
    faqs: [{ question: "পণ্যের বিস্তারিত কোথায় পাব?", answer: "এই পেজের বিস্তারিত তথ্য ও উপাদান অংশ দেখুন। কোনো তথ্য না পেলে আমাদের সঙ্গে যোগাযোগ করুন।" }, { question: "ডেলিভারি চার্জ কত?", answer: "ডেলিভারির ঠিকানা অনুযায়ী চেকআউটে চার্জ দেখানো হয়। অর্ডার নিশ্চিত করার আগেই মোট খরচ দেখতে পাবেন।" }, { question: "পণ্য নিয়ে কোনো সমস্যা হলে কী করব?", answer: "অর্ডার নম্বর ও সমস্যার ছবি নিয়ে আমাদের সহায়তা টিমের সঙ্গে যোগাযোগ করুন।" }],
    reviewsTitle: "ক্রেতাদের অভিজ্ঞতা", relatedTitle: "আপনার পছন্দ হতে পারে", bundleTitle: "একসঙ্গে কিনতে পারেন",
    sections: [{ id: "details", enabled: true }, { id: "benefits", enabled: false }, { id: "source", enabled: false }, { id: "faq", enabled: false }, { id: "reviews", enabled: true }, { id: "bundle", enabled: true }, { id: "related", enabled: true }],
    showRating: true, showStock: true, showAssurances: true, showBuyNow: true, allowReviews: true, showProof: true,
  };
  return { ...defaults, ...custom, sections: custom.sections ? [...custom.sections, ...defaults.sections.filter(s => !custom.sections!.some(c => c.id === s.id))] : defaults.sections };
}
export function reviewSummary(productId: string, reviews: Review[]) {
  const approved = reviews.filter(r => r.productId === productId && r.status === "Approved");
  return { approved, count: approved.length, average: approved.length ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length : 0 };
}
export const reviewSourceLabel = (r: Review) => r.demo ? "নমুনা রিভিউ" : r.source === "admin" ? "স্টোর থেকে যোগ করা" : r.verified ? "যাচাইকৃত ক্রেতা" : "ক্রেতার রিভিউ";
export const reviewIsVideo = (url: string) => url.startsWith("data:video") || /\.(?:mp4|webm|ogg)(?:[?#]|$)/i.test(url);
