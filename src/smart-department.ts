import type { Department } from "./departments";

export const smartDepartment: Department = {
  slug: "smart-life", categoryId: "c-smart-life", category: "Smart Life", name: "Smart Life",
  kicker: "প্রতিদিন একটু সহজ", tagline: "ছোট্ট উদ্ভাবনে, প্রতিদিনের সুবিধা।",
  image: "/assets/smart-life-hero-v1.webp", storyImage: "/assets/smart-life-sensor-lights-v1.webp",
  collectionLabel: "কাজের জিনিস, নতুনভাবে", eyebrow: "দৈনন্দিনের স্মার্ট সমাধান",
  subcategories: ["ঘর পরিষ্কার", "রান্নাঘরের সহায়ক", "সেন্সর ও আলো", "বাথরুমের সমাধান", "কাপড়ের যত্ন"],
  features: ["প্রয়োজন অনুযায়ী বাছাই", "মডেল ও ব্যবহারবিধির তথ্য", "কেনার আগে জেনে নিন"],
  experience: {
    heroTitle: "ছোট্ট উদ্ভাবনে,\nপ্রতিদিন একটু সহজ।",
    description: "কাপড়ের যত্ন থেকে রান্নাঘর, ডেস্ক থেকে সেন্সর লাইট। আপনার দিনের ছোট ছোট কাজে মানায় এমন ব্যবহারিক জিনিস খুঁজে নিন।",
    heroImage: "/assets/smart-life-hero-v1.webp", accent: "#245967", background: "#edf2f3", ink: "#243c46",
    announcement: "স্মার্ট লাইফ - দৈনন্দিন কাজে নতুন সুবিধা",
    storyTitle: "নতুন বলেই নয়,\nকাজে লাগে বলেই।",
    storyText: "কোন কাজটি সহজ করতে চান, সেখান থেকেই শুরু করুন। জায়গার মাপ, বিদ্যুতের প্রয়োজন, ব্যবহারবিধি আর প্যাকের ভেতরে কী থাকছে - নিজের প্রয়োজনের সঙ্গে মিলিয়ে বেছে নিন।",
    enabled: true,
  },
};
