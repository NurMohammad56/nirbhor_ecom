import { test, expect } from "@playwright/test";
import { bn } from "../src/bn";

test("pickles join an existing store once without replacing edits or readding merchant deletions", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const products = JSON.parse(localStorage.getItem("nirbhor-v1-products")!);
    products.find((p: any) => p.id === "p1").price = 999;
    localStorage.setItem("nirbhor-v1-products", JSON.stringify(products.filter((p: any) => !["p22", "p23", "p24"].includes(p.id))));
    localStorage.setItem("nirbhor-v1-categories", JSON.stringify(JSON.parse(localStorage.getItem("nirbhor-v1-categories")!).filter((c: any) => c.id !== "sc-pickles")));
    localStorage.removeItem("nirbhor-pickles-v1-products"); localStorage.removeItem("nirbhor-pickles-v1-categories");
  });
  await page.reload(); await page.reload();
  const data = await page.evaluate(() => ({ products: JSON.parse(localStorage.getItem("nirbhor-v1-products")!), categories: JSON.parse(localStorage.getItem("nirbhor-v1-categories")!) }));
  expect(data.products.find((p: any) => p.id === "p1").price).toBe(999);
  expect(data.products.filter((p: any) => ["p22", "p23", "p24"].includes(p.id))).toHaveLength(3);
  expect(data.categories.filter((c: any) => c.id === "sc-pickles")).toHaveLength(1);
  await page.evaluate(() => localStorage.setItem("nirbhor-v1-products", JSON.stringify(JSON.parse(localStorage.getItem("nirbhor-v1-products")!).filter((p: any) => p.id !== "p22"))));
  await page.reload();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("nirbhor-v1-products")!).some((p: any) => p.id === "p22"))).toBe(false);
});

test("the pickle collection filters to its products and supports normal variants and shopping", async ({ page }) => {
  await page.goto("/organic");
  await expect(page.locator("#pickles .product-card")).toHaveCount(3);
  await expect(page.locator(".department-product-edit")).not.toContainText("আমের আচার");
  await page.locator("#pickles").getByRole("link", { name: "আচার দেখুন", exact: true }).click();
  await expect(page).toHaveURL(/organic\/shop\?subcategory=/);
  await expect(page.locator(".catalog-products .product-card").or(page.locator(".catalog-layout .product-card"))).toHaveCount(3);
  await page.locator(".product-name").filter({ hasText: "আমের আচার" }).click();
  await expect(page.locator(".product-purchase h1")).toHaveText("আমের আচার");
  await page.locator(".variant-options button").filter({ has: page.locator("strong", { hasText: bn("500g") }) }).click();
  await page.getByRole("button", { name: bn("Add to your bag"), exact: true }).click();
  await expect(page.locator(".bag-item")).toContainText(bn("500g"));
  await expect(page.locator(".bag-item")).toContainText(bn("৳720"));
});

test("each department uses restrained noninteractive artwork and fits a small phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const [route, mood] of [["organic", "organic"], ["beauty", "beauty"], ["fashion", "fashion"], ["home-living", "home"]]) {
    await page.goto("/" + route);
    const backdrop = page.locator(".department-atmosphere > .ambient-backdrop");
    await expect(backdrop.locator("img")).toHaveCount(2);
    await expect(backdrop.locator("img").first()).toHaveAttribute("src", `/assets/ambient-${mood}-v1.webp`);
    await expect(backdrop).toHaveAttribute("aria-hidden", "true");
    expect(await backdrop.evaluate(el => getComputedStyle(el).pointerEvents)).toBe("none");
    expect(await backdrop.locator("img").first().evaluate(el => getComputedStyle(el).animationName)).toBe("none");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const urls = await backdrop.locator("img").evaluateAll(images => images.map(img => (img as HTMLImageElement).src));
    for (const url of urls) expect((await page.request.get(url)).ok()).toBe(true);
  }
});
