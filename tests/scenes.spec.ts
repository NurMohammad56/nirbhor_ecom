import { test, expect } from "@playwright/test";

test("cinematic slides advance automatically and can be paused", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await expect(page.locator(".brand-hero h1")).toContainText("Good choices.");
  await page.clock.runFor(8700);
  await expect(page.locator(".brand-hero h1")).toContainText("A little care.");
  await page.getByRole("button", { name: "Pause hero carousel" }).click();
  await page.locator(".announcement").click({ position: { x: 2, y: 2 } });
  await page.clock.runFor(18000);
  await expect(page.locator(".brand-hero h1")).toContainText("A little care.");
  await expect(page.getByRole("button", { name: "Play hero carousel" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Next slide", exact: true }).click();
  await expect(page.locator(".brand-hero h1")).toContainText("Your everyday.");
});

test("reduced motion keeps scenes still while allowing manual navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
  await page.clock.runFor(18000);
  await expect(page.locator(".brand-hero h1")).toContainText("Good choices.");
  await expect(page.getByRole("button", { name: "Play hero carousel" })).toBeDisabled();
  expect(await page.locator(".cinema-scene.is-active img").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await page.getByRole("button", { name: "Next slide", exact: true }).click();
  await expect(page.locator(".brand-hero h1")).toContainText("A little care.");
  await page.goto("/beauty");
  expect(await page.locator(".serum-orbit img").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
});

test("existing catalogue branding is corrected without replacing custom content or customer data", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const products = JSON.parse(localStorage.getItem("nirbhor-v1-products")!);
    for (const product of products) {
      if (product.id === "p20") { product.brand = "Nirbhor"; product.price = 1555; product.image = "/assets/beauty-serum-v2.webp"; product.images = [product.image]; }
      if (product.id === "p17") { product.brand = "Nirbhor"; product.image = "/assets/fashion-kurta-v2.webp"; }
      if (product.id === "p18") { product.brand = "Actual supplier"; product.image = "/assets/linen.webp"; }
    }
    localStorage.setItem("nirbhor-v1-products", JSON.stringify(products));
    localStorage.removeItem("nirbhor-scenes-v3-products");
    const categories = JSON.parse(localStorage.getItem("nirbhor-v1-categories")!);
    const beauty = categories.find((c: { id: string }) => c.id === "c2");
    beauty.experience.heroTitle = "My saved beauty headline";
    beauty.experience.heroImage = "/assets/beauty-hero-v2.webp";
    localStorage.setItem("nirbhor-v1-categories", JSON.stringify(categories));
    localStorage.removeItem("nirbhor-scenes-v3-categories");
    localStorage.setItem("nirbhor-v1-cart", JSON.stringify([{ id: "p1", quantity: 2, variant: "500g" }]));
  });
  await page.reload();
  const saved = await page.evaluate(() => ({ products: JSON.parse(localStorage.getItem("nirbhor-v1-products")!), cart: JSON.parse(localStorage.getItem("nirbhor-v1-cart")!) }));
  const serum = saved.products.find((p: { id: string }) => p.id === "p20");
  expect(serum).toMatchObject({ brand: "Imported collection", price: 1555, image: "/assets/serum-float-v3.webp" });
  expect(saved.products.find((p: { id: string }) => p.id === "p17").brand).toBe("Imported collection");
  expect(saved.products.find((p: { id: string }) => p.id === "p18")).toMatchObject({ brand: "Actual supplier", image: "/assets/linen.webp" });
  expect(saved.products.find((p: { id: string }) => p.id === "p1").brand).toBe("Nirbhor");
  expect(saved.cart).toEqual([{ id: "p1", quantity: 2, variant: "500g" }]);
  await page.goto("/beauty");
  await expect(page.locator(".department-hero h1")).toHaveText("My saved beauty headline");
  await expect(page.locator(".department-immersive-media img")).toHaveAttribute("src", "/assets/beauty-world-v3.webp");
});
