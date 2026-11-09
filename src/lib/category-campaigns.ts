/** Campaign photography is illustrative; product tiles always use the actual catalogue. */
export const categoryCampaigns: Record<string, {title:string; text:string; edit:string; color:string; secondary:string}> = {
  organic: {title:"প্রতিদিনের পাতে,\nএকটু ভালো বাছাই।",text:"মধু, বাদাম, খেজুর ও মসলার পছন্দগুলো একসঙ্গে দেখুন।",edit:"সকালের টেবিল থেকে রান্নাঘর",color:"pantry",secondary:"আপনার পান্ট্রির\nপরের পছন্দ"},
  beauty: {title:"নিজের যত্নে,\nনিজের পছন্দে।",text:"সিরাম, ফেস অয়েল ও দৈনন্দিন যত্নের পণ্য - প্রয়োজন বুঝে বেছে নিন।",edit:"আপনার যত্নের আয়োজন",color:"beauty",secondary:"যত্নের রুটিনে\nপছন্দের সংযোজন"},
  fashion: {title:"রোজকার পোশাকে,\nনিজস্ব একটা ছন্দ।",text:"কুর্তা, ওভারশার্ট ও ছোট ছোট স্টাইলের পছন্দগুলো ঘুরে দেখুন।",edit:"সহজ পোশাক, সুন্দর পছন্দ",color:"fashion",secondary:"পরের দিনের\nপোশাক বেছে নিন"},
  "home-living": {title:"ছোট্ট বদলে,\nভালো লাগার ঘর।",text:"বাটি, লিনেন ও ঘরের ছোট প্রয়োজনগুলোতে আনুন নিজের ছোঁয়া।",edit:"ঘরের প্রতিটি কোণে পছন্দ",color:"living",secondary:"টেবিল সাজুক\nআপনার মতো"},
  "smart-life": {title:"ছোট্ট কাজে,\nস্মার্ট একটা পছন্দ।",text:"রান্নাঘর, পরিষ্কার ও ডেস্কের কাজের জন্য প্রয়োজনীয় গ্যাজেট দেখুন।",edit:"প্রতিদিনের কাজে নতুন ভাবনা",color:"smart",secondary:"কাজের জিনিসে\nগুছিয়ে নিন দিন"},
  sneakers: {title:"পরের জোড়ায়,\nনিজের স্টাইল।",text:"কোর্ট, হাই-টপ কিংবা রানার লুক - সাইজ ও ডিজাইন মিলিয়ে বেছে নিন।",edit:"আপনার পরের পদক্ষেপ",color:"sneakers",secondary:"রং, ফিট আর\nনিজের পছন্দ"},
  watches: {title:"সময়ের সঙ্গে,\nস্টাইলও থাকুক।",text:"নারী ও পুরুষের ঘড়ি - ডায়াল, স্ট্র্যাপ ও মডেলের তথ্য দেখে পছন্দ করুন।",edit:"ছোট্ট অনুষঙ্গে নিজের পরিচয়",color:"watches",secondary:"কবজিতে থাকুক\nপছন্দের ছোঁয়া"},
  tech: {title:"আপনার সেটআপ,\nআপনার মতো।",text:"কীবোর্ড, মাউস, অডিও ও ডেস্ক অ্যাকসেসরিজ - কাজ ও অবসরের পছন্দ।",edit:"ডেস্ক থেকে আপনার প্রতিদিন",color:"tech",secondary:"কাজ আর অবসরে\nসেটআপ হোক সম্পূর্ণ"},
};
export const campaignPhoto=(slug:string,secondary=false)=>slug==='sneakers'?'/assets/sneakers-studio/showroom-ivory-v1.webp':`/assets/campaign-${slug}-${secondary?"edit":"offer"}-v1.webp`;
