import { test, expect } from "@playwright/test";
import { bn } from "../src/bn";

test("category rail moves continuously, pauses on hover and resumes on leaving", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  const rail = page.locator("#departments .category-rail-window");
  await rail.scrollIntoViewIfNeeded();
  await expect(rail).toHaveAttribute("data-motion", "playing");
  await page.clock.runFor(800);
  const first = await rail.evaluate(el => el.scrollLeft);
  expect(first).toBeGreaterThan(10);
  await rail.hover();
  await expect(rail).toHaveAttribute("data-motion", "paused");
  const paused = await rail.evaluate(el => el.scrollLeft);
  await page.clock.runFor(900);
  expect(await rail.evaluate(el => el.scrollLeft)).toBe(paused);
  await page.mouse.move(2, 2);
  await expect(rail).toHaveAttribute("data-motion", "playing");
  await page.clock.runFor(800);
  expect(await rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(paused + 10);
});

test("a new category added in admin joins the compact homepage rail", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/categories");
  await page.getByRole("button", { name: bn("Add category"), exact: true }).click();
  await page.getByLabel(bn("Category name"), { exact: true }).fill("স্টেশনারি");
  await page.getByRole("button", { name: bn("Save category"), exact: true }).click();
  await page.goto("/");
  const rail = page.locator("#departments .category-rail");
  const card = rail.getByRole("link", { name: "স্টেশনারি", exact: true });
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeVisible();
  await expect(card.locator("img")).toHaveAttribute("src", "/assets/organic-world-v5.webp");
  expect(await card.evaluate(el => el.getBoundingClientRect().width)).toBeLessThan(180);
  await card.click();
  await expect(page).toHaveURL(/\/shop\?category=/);
  await expect(page.locator(".catalog-heading h1")).toHaveText("স্টেশনারি");
});

test("branding migration replaces old supplied photos and preserves merchant uploads and prices", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const products = JSON.parse(localStorage.getItem("nirbhor-v1-products")!);
    products.find((p: {id: string}) => p.id === "p1").image = "/assets/honey.webp";
    products.find((p: {id: string}) => p.id === "p8").image = "/assets/honey.webp";
    Object.assign(products.find((p: {id: string}) => p.id === "p2"), { image: "/uploads/my-own-photo.webp", price: 765 });
    localStorage.setItem("nirbhor-v1-products", JSON.stringify(products));
    localStorage.removeItem("nirbhor-brand-v5-products");
  });
  await page.reload();
  const products = await page.evaluate(() => JSON.parse(localStorage.getItem("nirbhor-v1-products")!));
  expect(products.find((p: {id: string}) => p.id === "p1").image).toBe("/assets/product-p1-v5.webp");
  expect(products.find((p: {id: string}) => p.id === "p8").image).toBe("/assets/product-p8-v5.webp");
  expect(products.find((p: {id: string}) => p.id === "p2")).toMatchObject({ image: "/uploads/my-own-photo.webp", price: 765 });
});

test("sample reviews are labelled and pending customer reviews stay unpublished", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".customer-voice")).toHaveCount(3);
  await expect(page.locator(".customer-voice").first()).toContainText("নমুনা রিভিউ");
  await page.evaluate(() => {
    const reviews = JSON.parse(localStorage.getItem("nirbhor-v1-reviews")!);
    reviews.unshift({ ...reviews[0], id: "real-customer", name: "ক্রেতা", title: "আমার কেনাকাটার অভিজ্ঞতা", status: "Pending", verified: true, demo: false });
    localStorage.setItem("nirbhor-v1-reviews", JSON.stringify(reviews));
  });
  await page.reload();
  await expect(page.locator(".customer-voices")).not.toContainText("আমার কেনাকাটার অভিজ্ঞতা");
  await page.evaluate(() => {
    const reviews = JSON.parse(localStorage.getItem("nirbhor-v1-reviews")!);
    reviews[0].status = "Approved";
    localStorage.setItem("nirbhor-v1-reviews", JSON.stringify(reviews));
  });
  await page.reload();
  await expect(page.locator(".customer-voice").first()).toContainText("আমার কেনাকাটার অভিজ্ঞতা");
  await expect(page.locator(".customer-voice").first()).toContainText("যাচাইকৃত ক্রেতা");
  await expect(page.locator(".customer-voice").first()).not.toContainText("নমুনা রিভিউ");
});
