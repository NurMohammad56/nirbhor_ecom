import { test, expect } from "@playwright/test";
import { bn } from "../src/bn";

test("admin adds, orders and hides category sections with selected products and a working all-products link", async ({ page }) => {
  await page.goto("/admin/sections?category=c0");
  await page.getByRole("button", { name: "সেকশন যোগ করুন", exact: true }).click();
  await page.getByLabel("সেকশনের শিরোনাম", { exact: true }).fill("টক-ঝালে, পরিচিত স্বাদে");
  await page.getByLabel("গন্তব্য লিংক", { exact: true }).fill("/organic/shop?subcategory=আচার");
  for (const name of ["আমের আচার", "জলপাই আচার", "মিক্সড আচার"]) await page.getByLabel(name + " সেকশনে রাখুন", { exact: true }).check();
  await page.getByRole("button", { name: "সেকশন সেভ করুন", exact: true }).click();
  await page.goto("/organic");
  const section = page.locator(".category-custom-section");
  await expect(section.getByRole("heading")).toHaveText("টক-ঝালে, পরিচিত স্বাদে");
  await expect(section.locator(".product-card")).toHaveCount(3);
  expect(await section.locator(".product-rail-window").getAttribute("data-interval")).toBe("3000");
  const order = await page.locator(".department-atmosphere > [data-block]").evaluateAll(els => els.map(el => el.getAttribute("data-block")));
  expect(order.indexOf(await section.getAttribute("id"))).toBe(order.indexOf("bestsellers") + 1);
  await section.getByRole("link", { name: "সব পণ্য", exact: true }).click();
  await expect(page).toHaveURL(/subcategory=/); await expect(page.locator(".catalog-layout .product-card")).toHaveCount(3);
  await page.goto("/admin/sections?category=c0");
  await page.getByRole("button", { name: "টক-ঝালে, পরিচিত স্বাদে নিচে নিন", exact: true }).click();
  await page.getByLabel("ক্যাটাগরির গল্প দেখান", { exact: true }).uncheck();
  await page.getByRole("button", { name: "সেকশন সেভ করুন", exact: true }).click();
  await page.goto("/organic"); await page.reload();
  const reordered = await page.locator(".department-atmosphere > [data-block]").evaluateAll(els => els.map(el => el.getAttribute("data-block")));
  expect(reordered.indexOf(await section.getAttribute("id"))).toBe(reordered.indexOf("products") + 1);
  await expect(page.locator('[data-block="story"]')).toHaveCount(0);
});

test("section controls also work for generic parent categories and protect unsaved changes", async ({ page }) => {
  await page.goto("/admin/sections?category=c4");
  await page.getByLabel("নতুন সেকশন কোথায় বসবে", { exact: true }).selectOption("products");
  await page.getByRole("button", { name: "সেকশন যোগ করুন", exact: true }).click();
  await page.getByLabel("সেকশনের শিরোনাম", { exact: true }).fill("আপনার উপহারের আয়োজন");
  await page.locator(".section-product-picker input").first().check();
  await page.getByLabel("মূল ক্যাটাগরি", { exact: true }).selectOption("c0");
  await expect(page.getByRole("dialog", { name: "পরিবর্তন সেভ হয়নি" })).toBeVisible();
  await page.getByRole("button", { name: "সম্পাদনায় ফিরুন", exact: true }).click();
  await page.getByRole("button", { name: "সেকশন সেভ করুন", exact: true }).click();
  await page.goto("/shop?category=Gifts");
  await expect(page.locator(".category-custom-section")).toContainText("আপনার উপহারের আয়োজন");
  const blocks = await page.locator(".catalog-atmosphere > [data-block]").evaluateAll(els => els.map(el => el.getAttribute("data-block")));
  expect(blocks[1]).toBe("products"); expect(blocks).toHaveLength(3);
});

test("combo landing copy is editable and multiple packs keep component stock and pricing correct", async ({ page }) => {
  await page.goto("/admin/offers");
  await page.getByRole("button", { name: "সকালের সঙ্গী সম্পাদনা করুন", exact: true }).click();
  await page.getByText("কম্বো ল্যান্ডিং পেজের লেখা", { exact: true }).click();
  await page.getByLabel("ল্যান্ডিং পেজের শিরোনাম", { exact: true }).fill("সকালের আয়োজনে পছন্দের তিন সঙ্গী");
  await page.getByLabel("ল্যান্ডিং পেজের পরিচিতি", { exact: true }).fill("মধু, বাদাম আর চা - নিজের মতো সকাল সাজান।");
  await page.getByLabel("কম্বোর গল্প", { exact: true }).fill("একসঙ্গে বেছে নিন। প্যাকের পরিমাণ ও দামের হিসাব নিচে দেখুন।");
  await page.getByRole("button", { name: "কম্বো সেভ করুন", exact: true }).click();
  await page.goto("/offers");
  await page.getByRole("link", { name: "সকালের সঙ্গী কম্বোর বিস্তারিত দেখুন", exact: true }).click();
  await expect(page).toHaveURL(/combo\/combo-morning$/);
  await expect(page.locator(".combo-landing h1")).toHaveText("সকালের আয়োজনে পছন্দের তিন সঙ্গী");
  await expect(page.locator(".combo-story-band")).toContainText("প্যাকের পরিমাণ ও দামের হিসাব নিচে দেখুন");
  await expect(page.locator(".combo-content-list article")).toHaveCount(3);
  await expect(page.locator(".combo-product-reviews")).toContainText("নমুনা রিভিউ");
  await page.locator(".combo-pack-select").getByRole("button", { name: bn("Increase quantity"), exact: true }).click();
  await expect(page.locator(".combo-landing-price strong")).toHaveText(bn("৳3,580"));
  await page.getByRole("button", { name: "কম্বো ব্যাগে রাখুন", exact: true }).click();
  await expect(page.locator(".combo-cart-group footer strong")).toContainText("৩,৫৮০");
  await page.getByRole("button", { name: bn("Continue to checkout"), exact: true }).click();
  await page.getByLabel(bn("Full name"), { exact: true }).fill("কম্বো ক্রেতা");
  await page.getByLabel(bn("Mobile number"), { exact: true }).fill("01711223344");
  await page.getByLabel(bn("Full delivery address")).fill("বাসা ১২, ধানমন্ডি, ঢাকা");
  await page.getByRole("checkbox").last().check();
  await page.getByRole("button", { name: /অর্ডার দিন/ }).click();
  await expect(page).toHaveURL(/order-success/);
  const data = await page.evaluate(() => ({ order: JSON.parse(localStorage.getItem("nirbhor-v1-orders")!)[0], products: JSON.parse(localStorage.getItem("nirbhor-v1-products")!) }));
  expect(data.order.total).toBe(3580); expect(data.order.items).toHaveLength(3);
  expect(data.order.items.every((i: any) => i.quantity === 2 && i.comboId === "combo-morning")).toBe(true);
  expect(data.products.find((p: any) => p.id === "p1").stock).toBe(16);
});

test("expired and incomplete combos cannot be ordered from their landing page", async ({ page }) => {
  await page.goto("/combo/combo-morning");
  await page.evaluate(() => {
    const combos = JSON.parse(localStorage.getItem("nirbhor-v1-combos")!); combos[0].end = "2000-01-01";
    localStorage.setItem("nirbhor-v1-combos", JSON.stringify(combos));
  });
  await page.reload();
  await expect(page.locator(".combo-landing-purchase").getByRole("button", { name: "এখনই অর্ডার করুন", exact: true })).toBeDisabled();
  await expect(page.locator(".combo-live-facts")).toContainText("মেয়াদ শেষ");
  await page.evaluate(() => {
    const combos = JSON.parse(localStorage.getItem("nirbhor-v1-combos")!); combos[0].end = "";
    localStorage.setItem("nirbhor-v1-combos", JSON.stringify(combos));
    localStorage.setItem("nirbhor-v1-products", JSON.stringify(JSON.parse(localStorage.getItem("nirbhor-v1-products")!).filter((p: any) => p.id !== "p2")));
  });
  await page.reload();
  await expect(page.locator(".combo-landing-purchase")).toContainText("পণ্যের তথ্য হালনাগাদ হচ্ছে");
  await expect(page.locator(".combo-landing-price")).toHaveCount(0);
  await expect(page.locator(".combo-landing-purchase").getByRole("button", { name: "এখনই অর্ডার করুন", exact: true })).toBeDisabled();
});

test("product copy is inviting while merchant descriptions are preserved", async ({ page }) => {
  await page.goto("/product/p1");
  await expect(page.locator(".product-description")).toContainText("চায়ের কাপে");
  await page.evaluate(() => {
    const products = JSON.parse(localStorage.getItem("nirbhor-v1-products")!); products.find((p: any) => p.id === "p1").description = "স্টোরের নিজস্ব যাচাই করা তথ্য।";
    localStorage.setItem("nirbhor-v1-products", JSON.stringify(products));
  });
  await page.reload(); await expect(page.locator(".product-description")).toHaveText("স্টোরের নিজস্ব যাচাই করা তথ্য।");
});

test("selected home products use a carousel and the new landing and builder fit mobile", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".brand-everyday-edit .product-rail-window")).toHaveAttribute("data-interval", "3000");
  await expect(page.locator(".brand-home .ambient-backdrop")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/combo/combo-morning", "/admin/sections", "/organic", "/"]) {
    await page.goto(route); await expect(page.locator("h1,h2").first()).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
