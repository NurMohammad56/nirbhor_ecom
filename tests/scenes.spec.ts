import { bn } from "../src/lib/bn";
import { test, expect } from './fixtures';

test("cinematic slides advance with just two arrows and pause while a shopping link has focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  await expect(page.locator(".home-offer-slider h1")).toContainText("পছন্দের কেনাকাটায়");
  await page.clock.runFor(3100);
  await expect(page.locator(".home-offer-slider .offer-slide-kicker")).toContainText("অর্গানিক");
  await expect(page.locator(".cinema-bottom,.cinematic-hero .brand-carousel-controls")).toHaveCount(0);
  await expect(page.locator(".cinema-arrows button")).toHaveCount(2);
  await page.locator(".brand-hero-actions .btn").focus();
  await page.clock.runFor(18000);
  await expect(page.locator(".home-offer-slider .offer-slide-kicker")).toContainText("অর্গানিক");
  await page.locator(".announcement").click({ position: { x: 2, y: 2 } });
  await page.clock.runFor(3100);
  await expect(page.locator(".home-offer-slider .offer-slide-kicker")).toContainText("বিউটি");
});

test("reduced motion keeps scenes still and shopping links remain available", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
  await page.clock.runFor(18000);
  await expect(page.locator(".home-offer-slider h1")).toContainText("পছন্দের কেনাকাটায়");
  await expect(page.locator(".cinema-bottom")).toHaveCount(0);
  await expect(page.locator(".brand-hero-actions .btn")).toBeVisible();
  expect(await page.locator(".cinema-scene.is-active img").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await page.getByRole("button", { name: bn("Next slide"), exact: true }).click();
  await expect(page.locator(".home-offer-slider .offer-slide-kicker")).toContainText("অর্গানিক");
  await page.getByRole("button", { name: bn("Previous slide"), exact: true }).click();
  await expect(page.locator(".home-offer-slider h1")).toContainText("পছন্দের কেনাকাটায়");
  await page.goto("/beauty");
  expect(await page.locator(".department-offer-slider .cinema-scene.is-active img").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
});

test("existing catalogue branding is corrected without replacing custom content or customer data", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const products = JSON.parse(localStorage.getItem("nirbhor-v1-products")!);
    for (const product of products) {
      if (product.id === "p20") { product.brand = "Nirbhor"; product.price = 1555; product.image = "/assets/beauty-serum-v2.webp"; product.images = [product.image]; }
      if (product.id === "p17") { product.brand = "Nirbhor"; product.image = "/assets/fashion-kurta-v2.webp"; }
      if (product.id === "p18") { product.brand = "Actual supplier"; product.image = "/uploads/supplier-linen.webp"; }
    }
    localStorage.setItem("nirbhor-v1-products", JSON.stringify(products));
    localStorage.removeItem("nirbhor-scenes-v3-products");
    localStorage.removeItem("nirbhor-bengali-v4-products");
    localStorage.removeItem("nirbhor-brand-v5-products");
    const categories = JSON.parse(localStorage.getItem("nirbhor-v1-categories")!);
    const beauty = categories.find((c: { id: string }) => c.id === "c2");
    beauty.experience.heroTitle = "My saved beauty headline";
    beauty.experience.heroImage = "/assets/beauty-hero-v2.webp";
    localStorage.setItem("nirbhor-v1-categories", JSON.stringify(categories));
    localStorage.removeItem("nirbhor-scenes-v3-categories");
    localStorage.removeItem("nirbhor-bengali-v4-categories");
    localStorage.removeItem("nirbhor-brand-v5-categories");
    localStorage.setItem("nirbhor-v1-cart", JSON.stringify([{ id: "p1", quantity: 2, variant: "500g" }]));
  });
  await page.reload();
  const saved = await page.evaluate(() => ({ products: JSON.parse(localStorage.getItem("nirbhor-v1-products")!), cart: JSON.parse(localStorage.getItem("nirbhor-v1-cart")!) }));
  const serum = saved.products.find((p: { id: string }) => p.id === "p20");
  expect(serum).toMatchObject({ brand: "Imported collection", price: 1555, image: "/assets/serum-bare-v5.webp" });
  expect(saved.products.find((p: { id: string }) => p.id === "p17").brand).toBe("Imported collection");
  expect(saved.products.find((p: { id: string }) => p.id === "p18")).toMatchObject({ brand: "Actual supplier", image: "/uploads/supplier-linen.webp" });
  expect(saved.products.find((p: { id: string }) => p.id === "p1").brand).toBe("Nirbhor");
  expect(saved.cart).toEqual([{ id: "p1", quantity: 2, variant: "500g" }]);
  await page.goto("/beauty");
  await expect(page.locator(".department-offer-slider h1")).toHaveText(bn("My saved beauty headline"));
  await expect(page.locator(".department-offer-slider .cinema-scene.is-active img")).toHaveAttribute("src", "/assets/campaign-beauty-offer-v1.webp");
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-categories')!).find((c:any)=>c.id==='c2').experience.heroImage)).toBe('/assets/beauty-world-v5.webp');
});
