import type { Department } from "./departments";

export const techDepartment: Department = {
  slug: "tech", categoryId: "c-tech", category: "Tech", name: "Tech",
  kicker: "কাজে, গানে, নিজের জগতে", tagline: "আপনার দিনের সঙ্গে মানানসই টেক ও অ্যাকসেসরিজ।",
  image: "/assets/tech-hero-v1.webp", storyImage: "/assets/tech-headphones-v1.webp",
  collectionLabel: "আপনার সেটআপ, আপনার মতো", eyebrow: "অডিও ও প্রতিদিনের অ্যাকসেসরিজ",
  storyCaption: "নিজের সময়, নিজের সাউন্ড।",
  subcategories: ["অডিও", "কম্পিউটার অ্যাকসেসরিজ", "গেমিং", "চার্জিং"],
  features: ["কাজ অনুযায়ী বাছাই", "কম্প্যাটিবিলিটি জেনে কিনুন", "মডেলের তথ্য এক জায়গায়"],
  experience: {
    heroTitle: "কাজে মন দিন।\nগানে হারিয়ে যান।",
    description: "হেডফোন, ইয়ারবাডস আর ডেস্কের প্রয়োজনীয় অ্যাকসেসরিজ। আপনার কাজ ও অবসরের জন্য খুঁজে নিন নিজের পছন্দ।",
    heroImage: "/assets/tech-hero-v1.webp", accent: "#6950a3", background: "#f0ecf8", ink: "#322a46",
    announcement: "টেক - কাজ, গান আর নিজের সেটআপের জন্য",
    storyTitle: "একটু নিজের সময়।\nএকটু নিজের সাউন্ড।",
    storyText: "কাজের ফাঁকে গান কিংবা দিনের শেষে নিজের প্লেলিস্ট। হেডফোনের ডিজাইন, ফিট আর প্রয়োজনীয় সংযোগের তথ্য মিলিয়ে বেছে নিন আপনার সঙ্গী।",
    enabled: true,
  },
};
