import { bn } from "../src/bn";
import { test, expect } from "@playwright/test";
import {
  seedProducts,
  seedCategories,
  seedOrders,
  seedSettings,
} from "../src/data";

test("the main homepage introduces five distinct, directly accessible departments", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-department", "main");
  await expect(page.locator(".brand-hero h1")).toHaveText(
    bn("Good choices.") + bn("A trusted place."),
  );
  await expect(page.locator(".brand-department-card")).toHaveCount(5);
  for (const slug of ["organic", "beauty", "fashion", "home-living", "smart-life"])
    await expect(
      page.locator(`.brand-department-card[href="/${slug}"]`),
    ).toBeVisible();
  await expect(page.locator(".brand-story")).toContainText(
    bn("Selected with purpose"),
  );
  await page
    .locator(".brand-hero-actions")
    .getByRole("link", { name: bn("Find your everyday"), exact: true })
    .click();
  await expect(page).toHaveURL(/#departments$/);
  await expect
    .poll(() =>
      page
        .locator("#departments")
        .evaluate((el) => el.getBoundingClientRect().top),
    )
    .toBeLessThan(200);

  await page.getByRole("button", { name: bn("Next slide"), exact: true }).click();
  await expect(page.locator(".brand-hero h1")).toContainText(bn("A little care."));
  await page.getByRole("link", { name: bn("Explore beauty"), exact: true }).click();
  await expect(page).toHaveURL(/\/beauty$/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-department",
    "beauty",
  );
});

test("department identity persists from a category through its listing and product", async ({
  page,
}) => {
  await page.goto("/beauty");
  const accent = await page
    .locator("html")
    .evaluate((el) => el.style.getPropertyValue("--green"));
  expect(accent).toBe("#754e63");
  await page.getByRole("link", { name: bn("Explore beauty"), exact: true }).click();
  await expect(page).toHaveURL(/\/beauty\/shop/);
  await expect(page.locator(".product-card")).toHaveCount(4);
  await page
    .locator(".product-name")
    .filter({ hasText: bn("Daily Glow Serum") })
    .click();
  await expect(page).toHaveURL(/\/beauty\/product\/p20/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-department",
    "beauty",
  );
  await expect(page.locator(".product-purchase h1")).toHaveText(
    bn("Daily Glow Serum"),
  );
  await expect(page.locator(".pdp-rating")).not.toContainText(bn("★★★★★"));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-department",
    "beauty",
  );
  await page.goto("/beauty/product/p17");
  await expect(page).toHaveURL(/\/fashion\/product\/p17/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-department",
    "fashion",
  );
});

test("fashion size selection and beauty share a single neutral checkout", async ({
  page,
}) => {
  await page.goto("/fashion/product/p17");
  await page.getByRole("button", { name: bn("Size guide"), exact: true }).click();
  await expect(page.locator(".size-guide-table")).toContainText(bn("40 in"));
  await page.getByRole("button", { name: bn("Close dialog") }).click();
  await page
    .locator(".variant-options button")
    .filter({ has: page.locator("strong", { hasText: /^L$/ }) })
    .click();
  await page
    .getByRole("button", { name: bn("Add to your bag"), exact: true })
    .click();
  await expect(page.locator(".bag-item")).toContainText(bn("L"));
  await page.getByRole("button", { name: bn("Close bag") }).click();
  await page.goto("/beauty/product/p20");
  await page
    .getByRole("button", { name: bn("Add to your bag"), exact: true })
    .click();
  await page
    .getByRole("button", { name: bn("Continue to checkout"), exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-department", "main");
  await expect(page.getByTestId("order-total")).toHaveText(bn("৳2,880"));
  await expect(page.locator(".summary-products")).toContainText(
    bn("The Everyday Cotton Kurta"),
  );
  await expect(page.locator(".summary-products")).toContainText(
    bn("Daily Glow Serum"),
  );
  await expect(page.locator(".summary-products")).toContainText(bn("L"));
});

test("category experience edits persist without losing category configuration", async ({
  page,
}) => {
  await page.goto("/admin/experiences");
  await page
    .locator(".experience-admin-tabs")
    .getByRole("button", { name: bn("Beauty"), exact: true })
    .click();
  await page.getByLabel(bn("Hero headline")).fill("Care, your way.");
  await page.getByLabel(bn("Accent colour"), { exact: true }).fill("#663d58");
  await page.getByRole("button", { name: bn("Save changes"), exact: true }).click();
  await page.goto("/beauty");
  await expect(page.locator(".department-hero h1")).toHaveText(
    bn("Care, your way."),
  );
  await expect
    .poll(() =>
      page
        .locator("html")
        .evaluate((el) => el.style.getPropertyValue("--green")),
    )
    .toBe("#663d58");
  await page.reload();
  await expect(page.locator(".department-hero h1")).toHaveText(
    bn("Care, your way."),
  );
  await page.goto("/admin/categories");
  await page
    .getByRole("button", { name: bn("Edit Beauty & Care"), exact: true })
    .click();
  await page.getByLabel(bn("Description")).fill("Beauty, with a little thought.");
  await page
    .getByRole("button", { name: bn("Save category"), exact: true })
    .click();
  await page.goto("/beauty");
  await expect(page.locator(".department-hero h1")).toHaveText(
    bn("Care, your way."),
  );
});

test("the department upgrade preserves previous customer and catalogue data", async ({
  page,
}) => {
  const oldProducts = seedProducts.map((p) =>
    p.id === "p1" ? { ...p, price: 999 } : p,
  );
  await page.addInitScript(
    ({ products, categories, orders, settings }) => {
      if (sessionStorage.getItem("migration-seeded")) return;
      sessionStorage.setItem("migration-seeded", "yes");
      localStorage.setItem("nirbhor-v1-products", JSON.stringify(products));
      localStorage.setItem("nirbhor-v1-categories", JSON.stringify(categories));
      localStorage.setItem("nirbhor-v1-orders", JSON.stringify(orders));
      localStorage.setItem("nirbhor-v1-settings", JSON.stringify(settings));
      localStorage.setItem(
        "nirbhor-v1-cart",
        JSON.stringify([{ id: "p1", quantity: 2, variant: "500g" }]),
      );
      localStorage.setItem("nirbhor-v1-wishlist", JSON.stringify(["p2"]));
      localStorage.setItem(
        "nirbhor-v1-addresses",
        JSON.stringify([
          {
            id: "old-address",
            label: "My home",
            name: "Existing Customer",
            phone: "01712345678",
            address: "House 8, Dhaka",
            zone: "Dhaka",
            default: true,
          },
        ]),
      );
    },
    {
      products: oldProducts,
      categories: seedCategories,
      orders: seedOrders,
      settings: seedSettings,
    },
  );
  await page.goto("/");
  await expect(page.locator(".brand-department-card")).toHaveCount(5);
  const before = await page.evaluate(() => ({
    products: JSON.parse(localStorage.getItem("nirbhor-v1-products") || "[]"),
    cart: JSON.parse(localStorage.getItem("nirbhor-v1-cart") || "[]"),
    orders: JSON.parse(localStorage.getItem("nirbhor-v1-orders") || "[]"),
    addresses: JSON.parse(localStorage.getItem("nirbhor-v1-addresses") || "[]"),
  }));
  expect(before.products.find((p: any) => p.id === "p1").price).toBe(999);
  expect(before.products.length).toBe(39);
  expect(before.cart[0].quantity).toBe(2);
  expect(before.orders.length).toBe(4);
  expect(before.addresses[0].id).toBe("old-address");
  await page.reload();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("nirbhor-v1-products") || "[]").length,
    ),
  ).toBe(39);
});

test("all department templates, listing pages, product pages and editor fit mobile screens", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/organic",
    "/beauty",
    "/fashion",
    "/home-living",
    "/beauty/shop",
    "/fashion/shop",
    "/fashion/product/p17",
    "/beauty/product/p20",
    "/home-living/product/p10",
    "/organic/campaign/p1",
    "/admin/experiences",
  ]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route + " should fit mobile",
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.filter((i) => i.complete && !i.naturalWidth).map((i) => i.src),
        ),
      route + " images",
    ).toEqual([]);
  }
  expect(errors).toEqual([]);
});
