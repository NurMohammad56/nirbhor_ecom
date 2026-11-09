/** Presentation-only themes. Storage keys, catalogue values and merchant data stay intact. */
export type WorldTheme = {accent:string;surface:string;ink:string;label:string;title:string;description:string;layout:'origin'|'atelier'|'workbench';};
export const worldThemes:Record<string,WorldTheme>={
 main:{accent:'#174d40',surface:'#f7f6f2',ink:'#24342c',label:'নির্ভর / প্রতিদিনের পছন্দ',title:'প্রতিদিনের প্রয়োজন। একটু নিজের মতো।',description:'খাবার থেকে স্টাইল, ঘর থেকে টেক - আপনার পছন্দের জগৎ এক ঠিকানায়।',layout:'origin'},
 organic:{accent:'#405b3c',surface:'#f4f2e8',ink:'#263b29',label:'প্যান্ট্রি / উৎস / স্বাদ',title:'আপনার টেবিলে, ভালো পছন্দ।',description:'পণ্যের উৎস, পরিমাণ ও বর্ণনা দেখে নিজের প্যান্ট্রি সাজান।',layout:'origin'},
 beauty:{accent:'#85445a',surface:'#faf0f1',ink:'#422b35',label:'বিউটি / নিজের যত্ন',title:'নিজের জন্য একটু সময়।',description:'উপাদান ও ব্যবহারের তথ্য মিলিয়ে খুঁজে নিন নিজের রুটিন।',layout:'origin'},
 fashion:{accent:'#443b37',surface:'#f0ece5',ink:'#292725',label:'পোশাক / টেক্সচার / স্টাইল',title:'নিজের মতো করে পরুন।',description:'ডিজাইন পছন্দ করুন। সাইজ ও কাপড়ের তথ্য মিলিয়ে বেছে নিন।',layout:'atelier'},
 'home-living':{accent:'#826247',surface:'#f4ede3',ink:'#3f342b',label:'ঘর / টেক্সচার / প্রতিদিন',title:'ছোট বদলে, আপনার নিজের ঘর।',description:'ম্যাটেরিয়াল, মাপ আর ব্যবহার - ঘরের পণ্য কেনার আগে কাছ থেকে দেখুন।',layout:'origin'},
 'smart-life':{accent:'#286967',surface:'#edf4f1',ink:'#213d3b',label:'দৈনন্দিন কাজ / সহজ সমাধান',title:'কাজের জিনিস, কাজের জায়গায়।',description:'প্রয়োজন অনুযায়ী পণ্য বাছুন। মডেলের তথ্য জেনে সিদ্ধান্ত নিন।',layout:'workbench'},
 sneakers:{accent:'#b34726',surface:'#f6eee6',ink:'#272624',label:'স্নিকার্স / পরের পদক্ষেপ',title:'আপনার স্টাইল। আপনার পরের জোড়া।',description:'সিলুয়েট থেকে সাইজ - পছন্দের জুতাটি আরও কাছ থেকে দেখুন।',layout:'atelier'},
 watches:{accent:'#745a35',surface:'#f5f1e8',ink:'#332d25',label:'ঘড়ি / ছোট অনুষঙ্গে পরিচয়',title:'সময়ের সঙ্গে, নিজের স্টাইল।',description:'ডায়াল, স্ট্র্যাপ ও মডেলের তথ্য মিলিয়ে খুঁজে নিন নিজের ঘড়ি।',layout:'atelier'},
 tech:{accent:'#4944a4',surface:'#efeff9',ink:'#292943',label:'টেক / কাজ / নিজের সেটআপ',title:'আপনার সেটআপ, নতুনভাবে।',description:'অডিও, কাজ আর গেমিংয়ের জন্য পণ্যের প্রয়োজনীয় তথ্য এক জায়গায়।',layout:'workbench'},
 perfume:{accent:'#242424',surface:'#ffffff',ink:'#222222',label:'পারফিউম / সুগন্ধের গল্প',title:'আপনার উপস্থিতি। আপনার সুগন্ধ।',description:'ঘ্রাণের নোট বুঝে খুঁজে নিন নিজের পছন্দ।',layout:'origin'}
};
export function visualTheme(slug='main',merchantAccent?:string){
 const theme=worldThemes[slug]||worldThemes.main;
 // Historical default colours receive the new presentation palette; explicit custom colours survive.
 const defaults=['#0f766e','#193f30','#455c20','#6950a3','#946547','#303332','#84603b'];
 return {...theme,accent:merchantAccent&&!defaults.includes(merchantAccent.toLowerCase())?merchantAccent:theme.accent};
}
