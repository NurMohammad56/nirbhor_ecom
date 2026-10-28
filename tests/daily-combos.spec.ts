import { test, expect } from "@playwright/test";
import { bn } from "../src/bn";

test("daily catalog migration preserves edits and does not resurrect deleted products or combos", async ({ page }) => {
  await page.goto("/offers");
  await page.evaluate(() => {
    const products = JSON.parse(localStorage.getItem("nirbhor-v1-products")!);
    products.find((p: any) => p.id === "p2").price = 987;
    const combos = JSON.parse(localStorage.getItem("nirbhor-v1-combos")!);
    combos[0].landing = { headline: "আমাদের নিজস্ব আয়োজন" };
    localStorage.setItem("nirbhor-v1-products", JSON.stringify(products.filter((p: any) => Number(p.id.slice(1)) < 25)));
    localStorage.setItem("nirbhor-v1-combos", JSON.stringify(combos.slice(0, 2)));
    localStorage.removeItem("nirbhor-daily-v1-products");
    localStorage.removeItem("nirbhor-daily-v1-combos");
  });
  await page.reload();
  let state = await page.evaluate(() => ({ products: JSON.parse(localStorage.getItem("nirbhor-v1-products")!), combos: JSON.parse(localStorage.getItem("nirbhor-v1-combos")!) }));
  expect(state.products).toHaveLength(27); expect(state.combos).toHaveLength(9);
  expect(state.products.find((p: any) => p.id === "p2").price).toBe(987);
  expect(state.combos[0].landing.headline).toBe("আমাদের নিজস্ব আয়োজন");
  await page.evaluate(() => {
    for (const [key, id] of [["products", "p25"], ["combos", "combo-spices"]]) {
      const list = JSON.parse(localStorage.getItem("nirbhor-v1-" + key)!);
      localStorage.setItem("nirbhor-v1-" + key, JSON.stringify(list.filter((x: any) => x.id !== id)));
    }
  });
  await page.reload();
  state = await page.evaluate(() => ({ products: JSON.parse(localStorage.getItem("nirbhor-v1-products")!), combos: JSON.parse(localStorage.getItem("nirbhor-v1-combos")!) }));
  expect(state.products).toHaveLength(26); expect(state.combos).toHaveLength(8);
  expect(state.products.some((p: any) => p.id === "p25")).toBe(false);
  expect(state.combos.some((c: any) => c.id === "combo-spices")).toBe(false);
  await expect(page.locator(".combo-card").filter({ hasText: "ঘি-মসলার আয়োজন" })).toHaveCount(0);
});

test("offers support purpose, component search, budget, stock and persistent URL filters", async ({ page }) => {
  await page.goto("/offers");
  await expect(page.locator(".combo-card")).toHaveCount(9);
  await page.getByRole("button", { name: /রান্নাঘর ও মসলা/ }).click();
  await expect(page.locator(".combo-card")).toHaveCount(3);
  await page.getByLabel("কম্বোর বাজেট", { exact: true }).selectOption("1000");
  await expect(page.locator(".combo-card")).toHaveCount(1);
  await expect(page.locator(".combo-card")).toContainText("রান্নার চার মসলা");
  await expect(page.locator(".combo-card-bottom strong")).toHaveText(bn("৳936"));
  await page.reload(); await expect(page.locator(".combo-card")).toHaveCount(1);
  await page.getByRole("button", { name: "সব ফিল্টার মুছুন", exact: true }).click();
  await page.getByLabel("কম্বো খুঁজুন", { exact: true }).fill("জিরা");
  await expect(page.locator(".combo-card")).toHaveCount(2);
  await page.getByLabel("কম্বো সাজান", { exact: true }).selectOption("price-low");
  await expect(page.locator(".combo-card").first()).toContainText("রান্নার চার মসলা");
  await page.getByLabel("কম্বো খুঁজুন", { exact: true }).fill("অপ্রাসঙ্গিক পণ্য");
  await expect(page.locator(".combo-filter-empty")).toBeVisible();
  await page.getByRole("button", { name: "সব কম্বো দেখুন", exact: true }).click();
  await page.evaluate(() => {
    const products = JSON.parse(localStorage.getItem("nirbhor-v1-products")!);
    const p = products.find((p: any) => p.id === "p25"); p.stock = 0; p.variants.forEach((v: any) => v.stock = 0);
    localStorage.setItem("nirbhor-v1-products", JSON.stringify(products));
  });
  await page.reload(); await expect(page.locator(".combo-card")).toHaveCount(9);
  await page.getByLabel("স্টকে আছে", { exact: true }).check();
  await expect(page.locator(".combo-card")).toHaveCount(7);
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("spice combo purchase charges the shown savings and cancellation restores every component once", async ({ page }) => {
  await page.goto("/combo/combo-spices");
  await expect(page.locator(".combo-content-list article")).toHaveCount(4);
  await expect(page.locator(".combo-landing-price strong")).toHaveText(bn("৳936"));
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem("nirbhor-v1-products")!).filter((p: any) => ["p16", "p25", "p26", "p27"].includes(p.id)).map((p: any) => ({ id: p.id, stock: p.stock })));
  await page.getByRole("button", { name: "এখনই অর্ডার করুন", exact: true }).first().click();
  await expect(page).toHaveURL(/checkout/);
  await expect(page.getByTestId("order-total")).toHaveText(bn("৳996"));
  await page.getByLabel(bn("Full name"), { exact: true }).fill("মসলা ক্রেতা");
  await page.getByLabel(bn("Mobile number"), { exact: true }).fill("01711223344");
  await page.getByLabel(bn("Full delivery address")).fill("বাসা ১২, ধানমন্ডি, ঢাকা");
  await page.getByRole("checkbox").last().check();
  await page.getByRole("button", { name: /অর্ডার দিন/ }).click();
  await expect(page).toHaveURL(/order-success/);
  const result = await page.evaluate(() => ({ order: JSON.parse(localStorage.getItem("nirbhor-v1-orders")!)[0], products: JSON.parse(localStorage.getItem("nirbhor-v1-products")!) }));
  expect(result.order).toMatchObject({ subtotal: 1040, discount: 104, shipping: 60, total: 996 });
  expect(result.order.items).toHaveLength(4);
  expect(result.order.items.every((i: any) => i.comboId === "combo-spices" && i.variant === "200g" && i.quantity === 1)).toBe(true);
  for (const p of before) expect(result.products.find((x: any) => x.id === p.id).stock).toBe(p.stock - 1);
  await page.goto(`/admin/orders?order=${result.order.id}`);
  await page.getByLabel(bn("Order status"), { exact: true }).selectOption("Cancelled");
  await page.getByRole("button", { name: bn("Save order updates"), exact: true }).click();
  await page.goto(`/admin/orders?order=${result.order.id}`);
  await page.getByRole("button", { name: bn("Save order updates"), exact: true }).click();
  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("nirbhor-v1-products")!));
  for (const p of before) expect(restored.find((x: any) => x.id === p.id).stock).toBe(p.stock);
});

test("recently viewed is real, bounded, clearable and the homepage keeps just four combos", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".recently-viewed-section")).toHaveCount(0);
  await expect(page.locator(".combo-card")).toHaveCount(4);
  for (const id of ["p1", "p20"]) {
    await page.goto("/product/" + id);
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("nirbhor-v1-recent") || "[]")[0])).toBe(id);
  }
  await page.goto("/");
  await expect(page.locator(".recently-viewed-section .product-card")).toHaveCount(2);
  await expect(page.locator(".recently-viewed-section .product-card").first()).toContainText("ডেইলি গ্লো সিরাম");
  await page.evaluate(() => { localStorage.setItem("nirbhor-v1-wishlist", JSON.stringify(["p2"])); });
  await page.getByRole("button", { name: "দেখার ইতিহাস মুছুন", exact: true }).click();
  await expect(page.locator(".recently-viewed-section")).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("nirbhor-v1-wishlist")!))).toEqual(["p2"]);
  await page.reload(); await expect(page.locator(".recently-viewed-section")).toHaveCount(0);
});

test("admin purpose grouping is editable and persists into offers discovery", async ({ page }) => {
  await page.goto("/admin/offers");
  await page.getByRole("button", { name: "চায়ের বিরতির সঙ্গী সম্পাদনা করুন", exact: true }).click();
  await page.getByLabel("কম্বোর প্রয়োজন", { exact: true }).selectOption("breakfast");
  await page.getByRole("button", { name: "কম্বো সেভ করুন", exact: true }).click();
  await page.goto("/offers?purpose=breakfast"); await page.reload();
  await expect(page.locator(".combo-card")).toHaveCount(2);
  await expect(page.locator(".combo-card").filter({ hasText: "চায়ের বিরতির সঙ্গী" })).toBeVisible();
});
