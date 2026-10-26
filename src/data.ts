export type Product = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice: number;
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  badge: string;
  weight: string;
  source: string;
  description: string;
  brand: string;
  status: string;
  sku: string;
  type: string;
  dietary: string;
  color: string;
  created: number;
  campaign: boolean;
  video?: string;
  tags: string;
  variants?: {
    label: string;
    price: number;
    stock: number;
    sku: string;
    image: string;
  }[];
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
  cost?: number;
  barcode?: string;
  details?: Record<string, string>;
  sizeGuide?: { size: string; chest: string; length: string }[];
};
export type CartItem = {
  id: string;
  quantity: number;
  variant: string;
  unitPrice?: number;
  productName?: string;
  image?: string;
};
export type Order = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  zone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  payment: string;
  paymentStatus: string;
  date: string;
  note: string;
  tracking: string;
  courier: string;
  callStatus: string;
  internalNote: string;
  tax?: number;
  couponCode?: string;
  stockReleased?: boolean;
};
export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  status: string;
  featured: boolean;
  helpful: number;
  media: string;
  reply: string;
  verified: boolean;
  demo?: boolean;
};
export type Category = {
  id: string;
  name: string;
  parent: string;
  description: string;
  active: boolean;
  image: string;
  sort: number;
  departmentSlug?: string;
  experience?: DepartmentExperience;
};
export type DepartmentExperience = {
  heroTitle: string;
  description: string;
  heroImage: string;
  accent: string;
  background: string;
  ink: string;
  announcement: string;
  storyTitle: string;
  storyText: string;
  enabled: boolean;
};
export type Campaign = {
  id: string;
  name: string;
  headline: string;
  announcement: string;
  label: string;
  end: string;
  start: string;
  productId: string;
  discount: boolean;
  countdown: boolean;
  urgency: boolean;
  stock: boolean;
  bundles: boolean;
  quickOrder: boolean;
  sticky: boolean;
  reviews: boolean;
  trust: boolean;
  faq: boolean;
  source: boolean;
  active: boolean;
  utm: string;
  blockOrder: string[];
  announcementEnabled?: boolean;
};
export type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minimum: number;
  active: boolean;
  uses: number;
  limit: number;
  start: string;
  end: string;
  scope: string;
  perUser: number;
};
export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  active: boolean;
  image: string;
  order: number;
  start: string;
  end: string;
};
export type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  zone: string;
  default: boolean;
};
export type Profile = {
  name: string;
  email: string;
  phone: string;
  loggedIn: boolean;
};
export type Settings = {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  dhaka: number;
  outside: number;
  freeShipping: number;
  cod: boolean;
  online: boolean;
  pixel: string;
  pixelEnabled: boolean;
  newsletter: boolean;
  currency: string;
  tax: number;
  color: string;
  seoTitle: string;
  seoDescription: string;
  social: string;
  notifications: boolean;
};
const img = (n: string) => `/assets/${n}.webp`;
const make = (
  id: string,
  name: string,
  category: string,
  subcategory: string,
  price: number,
  oldPrice: number,
  image: string,
  badge: string,
  weight: string,
  source: string,
  stock = 34,
): Product => ({
  id,
  name,
  category,
  subcategory,
  price,
  oldPrice,
  image: img(image),
  images: id === "p1" ? [img(image), "/assets/hero.webp"] : [img(image)],
  stock,
  rating: 4.7 + (Number(id.slice(1)) % 3) / 10,
  reviews: 126 + Number(id.slice(1)) * 17,
  badge,
  weight,
  source,
  description: `Thoughtfully selected ${name.toLowerCase()}, with honest ingredients and nothing unnecessary. Sourced in small batches, carefully packed, and made for the everyday moments that matter.`,
  brand: category === "Beauty & Care" ? "Imported collection" : "Nirbhor",
  status: "Published",
  sku: `NBR-${id.toUpperCase()}-500`,
  type: category === "Organic Food" ? "Natural" : "Everyday",
  dietary: category === "Organic Food" ? "No added sugar" : "Sustainable",
  color: "Natural",
  created: Number(id.slice(1)),
  campaign: id === "p1",
  tags: "natural, small batch",
});
export const seedProducts: Product[] = [
  make(
    "p1",
    "Sundarban Raw Honey",
    "Organic Food",
    "Honey & Molasses",
    680,
    850,
    "honey",
    "Bestseller",
    "500g",
    "Sundarban",
    18,
  ),
  make(
    "p2",
    "Premium Mixed Nuts",
    "Organic Food",
    "Nuts & Seeds",
    890,
    990,
    "nuts",
    "Pantry favourite",
    "250g",
    "Local farms",
    42,
  ),
  make(
    "p3",
    "Ajwa Dates",
    "Organic Food",
    "Dates & Dry Fruits",
    1150,
    1290,
    "dates",
    "Naturally sweet",
    "500g",
    "Saudi Arabia",
    28,
  ),
  make(
    "p4",
    "Herbal Morning Tea",
    "Organic Food",
    "Tea & Herbal",
    450,
    0,
    "tea",
    "New arrival",
    "12 sachets",
    "Sylhet",
    8,
  ),
  make(
    "p5",
    "Organic Cow Ghee",
    "Organic Food",
    "Spices & Oils",
    1280,
    1450,
    "ghee",
    "Small batch",
    "500ml",
    "Sirajganj",
    15,
  ),
  make(
    "p6",
    "Chia Seeds",
    "Organic Food",
    "Nuts & Seeds",
    390,
    450,
    "seeds",
    "Everyday essential",
    "250g",
    "Local farms",
    56,
  ),
  make(
    "p7",
    "Honey Roasted Granola",
    "Organic Food",
    "Healthy Snacks",
    610,
    690,
    "granola",
    "Bestseller",
    "350g",
    "Dhaka",
    22,
  ),
  make(
    "p8",
    "Black Seed Honey",
    "Organic Food",
    "Honey & Molasses",
    820,
    950,
    "honey",
    "12% off",
    "500g",
    "Local farms",
    31,
  ),
  make(
    "p9",
    "Date & Seed Mix",
    "Organic Food",
    "Ready Mixes",
    520,
    610,
    "dates",
    "15% off",
    "400g",
    "Local farms",
    19,
  ),
  make(
    "p10",
    "Stoneware Breakfast Bowl",
    "Home & Living",
    "Kitchen & Dining",
    760,
    890,
    "ceramic",
    "Made by hand",
    "1 piece",
    "Bangladesh",
    24,
  ),
  make(
    "p11",
    "Linen Table Napkins",
    "Home & Living",
    "Home Textiles",
    620,
    0,
    "linen",
    "Considered living",
    "Set of 2",
    "Bangladesh",
    12,
  ),
  make(
    "p12",
    "Glass Pantry Jar Set",
    "Home & Living",
    "Storage",
    1290,
    1490,
    "jars",
    "Organise beautifully",
    "3 pieces",
    "Bangladesh",
    0,
  ),
  make(
    "p13",
    "Botanical Face Oil",
    "Beauty & Care",
    "Skin Care",
    950,
    1100,
    "oil",
    "Gentle by nature",
    "30ml",
    "Local farms",
    21,
  ),
  make(
    "p14",
    "Handmade Olive Soap",
    "Beauty & Care",
    "Bath & Body",
    280,
    350,
    "soap-unbranded-v3",
    "Plastic free",
    "100g",
    "Bangladesh",
    38,
  ),
  make(
    "p15",
    "The Morning Ritual Box",
    "Gifts",
    "Gift Sets",
    1790,
    2090,
    "bundle",
    "A thoughtful gift",
    "3 items",
    "Bangladesh",
    16,
  ),
  make(
    "p16",
    "Organic Turmeric Powder",
    "Organic Food",
    "Spices & Oils",
    290,
    340,
    "spices",
    "Farm direct",
    "200g",
    "Bogura",
    44,
  ),
];
export const seedCategories: Category[] = [
  "Organic Food",
  "Home & Living",
  "Beauty & Care",
  "Family",
  "Gifts",
]
  .map((name, i) => ({
    id: `c${i}`,
    name,
    parent: "",
    description: [
      "Good food, honest origins.",
      "A little more considered.",
      "Naturally, beautifully you.",
      "Goodness for the whole family.",
      "Give a little goodness.",
    ][i],
    active: true,
    image: img(["honey", "ceramic", "oil", "granola", "bundle"][i]),
    sort: i,
  }))
  .concat(
    [
      "Honey & Molasses",
      "Nuts & Seeds",
      "Dates & Dry Fruits",
      "Tea & Herbal",
      "Spices & Oils",
      "Healthy Snacks",
      "Ready Mixes",
    ].map((name, i) => ({
      id: `sc${i}`,
      name,
      parent: "Organic Food",
      description: "Thoughtfully sourced pantry essentials.",
      active: true,
      image: img(
        ["honey", "nuts", "dates", "tea", "spices", "granola", "seeds"][i],
      ),
      sort: i,
    })),
  );
export const seedCampaigns: Campaign[] = [
  {
    id: "camp1",
    name: "The Sundarban Harvest",
    headline: "Wild by nature. Pure by promise.",
    announcement: "The harvest edit - save 20% on raw Sundarban honey",
    label: "HARVEST SPECIAL · 20% OFF",
    start: "2026-10-01",
    end: "2027-01-31T23:59",
    productId: "p1",
    discount: true,
    countdown: true,
    urgency: true,
    stock: true,
    bundles: true,
    quickOrder: true,
    sticky: true,
    reviews: true,
    trust: true,
    faq: true,
    source: true,
    active: true,
    utm: "facebook / harvest-2026",
    blockOrder: ["source", "trust", "reviews", "faq"],
  },
];
export const seedCoupons: Coupon[] = [
  {
    id: "d1",
    code: "NIRBHOR10",
    type: "Percentage",
    value: 10,
    minimum: 500,
    active: true,
    uses: 34,
    limit: 500,
    start: "2026-01-01",
    end: "2027-12-31",
    scope: "All products",
    perUser: 1,
  },
  {
    id: "d2",
    code: "WELCOME150",
    type: "Fixed amount",
    value: 150,
    minimum: 1500,
    active: true,
    uses: 12,
    limit: 200,
    start: "2026-01-01",
    end: "2027-12-31",
    scope: "All products",
    perUser: 1,
  },
  {
    id: "d3",
    code: "FREESHIP",
    type: "Free shipping",
    value: 0,
    minimum: 1000,
    active: true,
    uses: 28,
    limit: 300,
    start: "2026-01-01",
    end: "2027-12-31",
    scope: "All products",
    perUser: 3,
  },
];
export const seedBanners: Banner[] = [
  {
    id: "b1",
    title: "A little goodness,\nevery day.",
    subtitle:
      "Honest ingredients. Thoughtful choices. Discover everyday essentials that bring you closer to nature.",
    cta: "Explore organic",
    link: "/shop?category=Organic+Food",
    active: true,
    image: "/assets/hero.webp",
    order: 0,
    start: "",
    end: "",
  },
  {
    id: "b2",
    title: "Slow mornings.\nBetter beginnings.",
    subtitle:
      "Raw honey, nourishing nuts and a cup of calm. Make room for your new morning ritual.",
    cta: "Shop the morning edit",
    link: "/shop?collection=bestsellers",
    active: true,
    image: "/assets/hero.webp",
    order: 1,
    start: "",
    end: "",
  },
  {
    id: "b3",
    title: "Naturally home.\nBeautifully yours.",
    subtitle:
      "Considered materials and everyday comforts. Small changes for a home that feels like you.",
    cta: "Discover home & living",
    link: "/shop?category=Home+%26+Living",
    active: true,
    image: "/assets/home-hero.webp",
    order: 2,
    start: "",
    end: "",
  },
];
export const seedReviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    name: "Samia Rahman",
    rating: 5,
    title: "The taste takes me back home.",
    text: "Beautifully packed, and the honey has that lovely floral aroma. It has become a little morning ritual for our family.",
    date: "2026-10-18",
    status: "Approved",
    featured: true,
    helpful: 12,
    media: "",
    reply: "Thank you for making us part of your mornings, Samia.",
    verified: true,
    demo: true,
  },
  {
    id: "r2",
    productId: "p1",
    name: "Rafi Hasan",
    rating: 5,
    title: "Exactly what I was looking for.",
    text: "The source and batch information made choosing easy. Quick delivery and a lovely glass jar, too.",
    date: "2026-10-20",
    status: "Approved",
    featured: true,
    helpful: 8,
    media: "",
    reply: "",
    verified: true,
    demo: true,
  },
  {
    id: "r3",
    productId: "p2",
    name: "Nabila Jahan",
    rating: 4,
    title: "Fresh, crunchy, and generous.",
    text: "A good mix of nuts with no added salt. Perfect for my desk snack. I will be ordering again.",
    date: "2026-10-21",
    status: "Approved",
    featured: true,
    helpful: 6,
    media: "",
    reply: "",
    verified: true,
    demo: true,
  },
  {
    id: "r4",
    productId: "p4",
    name: "Imran Khan",
    rating: 5,
    title: "A lovely way to start the day",
    text: "Subtle flavour, lovely aroma and carefully packed.",
    date: "2026-10-25",
    status: "Pending",
    featured: false,
    helpful: 0,
    media: "",
    reply: "",
    verified: true,
    demo: true,
  },
];
export const seedOrders: Order[] = [
  ["NBR-4821", "Samia Rahman", "Confirmed", "p1"],
  ["NBR-4820", "Rafi Hasan", "Processing", "p2"],
  ["NBR-4819", "Nabila Jahan", "Shipped", "p15"],
  ["NBR-4818", "Imran Khan", "Delivered", "p4"],
].map(([id, customer, status, pid], i) => {
  const p = seedProducts.find((x) => x.id === pid)!;
  return {
    id,
    customer,
    phone: String(1712345678 + i).padStart(11, "0"),
    email: `${customer.split(" ")[0].toLowerCase()}@example.com`,
    address: "House 12, Road 7, Dhanmondi, Dhaka 1209",
    zone: "Dhaka",
    items: [
      {
        id: pid,
        quantity: i === 0 ? 2 : 1,
        variant: p.weight,
        unitPrice: p.price,
        productName: p.name,
        image: p.image,
      },
    ],
    subtotal: p.price * (i === 0 ? 2 : 1),
    discount: 0,
    shipping: 60,
    total: p.price * (i === 0 ? 2 : 1) + 60,
    status,
    payment: "Cash on delivery",
    paymentStatus: status === "Delivered" ? "Paid" : "Unpaid",
    date: `2026-10-${26 - i}T09:30:00`,
    note: "Please call before delivery.",
    tracking: `STF${1204521 - i}`,
    courier: "Steadfast",
    callStatus: "Confirmed",
    internalNote: "",
  };
});
export const seedSettings: Settings = {
  name: "NIRBHOR",
  tagline: "A little goodness, every day.",
  email: "hello@nirbhor.com",
  phone: "+880 1700 000 000",
  address: "Dhanmondi, Dhaka, Bangladesh",
  dhaka: 60,
  outside: 120,
  freeShipping: 1500,
  cod: true,
  online: false,
  pixel: "643210009012",
  pixelEnabled: false,
  newsletter: true,
  currency: "BDT",
  tax: 0,
  color: "#193f30",
  seoTitle: "NIRBHOR - A little goodness, every day.",
  seoDescription: "Organic pantry, thoughtful home and everyday essentials.",
  social: "https://facebook.com",
  notifications: true,
};
export const statusSteps = [
  "Placed",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for delivery",
  "Delivered",
];
export const money = (value: number) =>
  "৳" + Math.round(value).toLocaleString("en-BD");
export const uid = (prefix: string) =>
  prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
export function productVariants(p: Product) {
  const options = p.variants?.length
    ? p.variants
    : [
        {
          label: p.weight,
          price: p.price,
          stock: p.stock,
          sku: p.sku,
          image: p.image,
        },
        ...(p.weight === "500g"
          ? [
              {
                label: "250g",
                price: Math.round((p.price * 0.55) / 10) * 10,
                stock: p.stock,
                sku: p.sku + "-250",
                image: p.image,
              },
              {
                label: "1kg",
                price: Math.round((p.price * 1.9) / 10) * 10,
                stock: p.stock,
                sku: p.sku + "-1K",
                image: p.image,
              },
            ]
          : []),
      ];
  return p.campaign
    ? [
        ...options,
        {
          label: "2 jars",
          price: Math.round((p.price * 1.84) / 10) * 10,
          stock: Math.floor(p.stock / 2),
          sku: p.sku + "-2",
          image: p.image,
        },
        {
          label: "3 jars",
          price: Math.round((p.price * 2.63) / 10) * 10,
          stock: Math.floor(p.stock / 3),
          sku: p.sku + "-3",
          image: p.image,
        },
      ]
    : options;
}
export const itemPrice = (p: Product, variant: string) =>
  productVariants(p).find((v) => v.label === variant)?.price || p.price;
export const variantUnits = (variant: string) =>
  variant === "2 jars" ? 2 : variant === "3 jars" ? 3 : 1;
