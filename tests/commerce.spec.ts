import { test, expect } from "@playwright/test";
test("customer completes a variant-aware, discounted guest order and tracks it", async ({
  page,
}) => {
  await page.goto("/product/p2");
  await page.getByRole("button", { name: "Add to your bag" }).click();
  await expect(
    page.getByRole("dialog", { name: "Shopping bag" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue to checkout" }).click();
  await page.getByLabel("Discount code").fill("NIRBHOR10");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByTestId("order-total")).toHaveText("৳861");
  await page.getByLabel("Full name", { exact: true }).fill("Test Customer");
  await page.getByLabel("Mobile number", { exact: true }).fill("01711223344");
  await page
    .getByLabel("Email address (optional)", { exact: true })
    .fill("test@example.com");
  await page
    .getByLabel("Full delivery address")
    .fill("House 12, Road 8, Dhanmondi, Dhaka");
  await page.getByRole("checkbox").last().check();
  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(page).toHaveURL(/order-success\/NBR-4822/);
  await expect(page.getByTestId("order-total")).toHaveText("৳861");
  await page.getByRole("link", { name: "Follow your little delivery" }).click();
  await expect(
    page.getByRole("heading", { name: "Order #NBR-4822" }),
  ).toBeVisible();
  await expect(page.locator(".order-timeline .current")).toContainText(
    "Order placed",
  );
  const saved = await page.evaluate(
    () => JSON.parse(localStorage.getItem("nirbhor-v1-orders") || "[]")[0],
  );
  expect(saved.items[0].unitPrice).toBe(890);
  expect(saved.discount).toBe(89);
  expect(saved.paymentStatus).toBe("Unpaid");
});
test("catalog filters, typo search, sort and wishlist are usable", async ({
  page,
}) => {
  await page.goto("/shop?q=honee");
  await expect(page.locator(".product-card")).toHaveCount(3);
  await page.getByLabel("Sort products").selectOption("price-low");
  await expect(page.locator(".product-name").first()).toHaveText(
    "Sundarban Raw Honey",
  );
  await page.getByLabel("Save Sundarban Raw Honey to wishlist").click();
  await page.goto("/wishlist");
  await expect(page.locator(".product-name")).toHaveText("Sundarban Raw Honey");
  await page.reload();
  await expect(page.locator(".product-name")).toHaveText("Sundarban Raw Honey");
  await page.goto("/shop?category=Organic+Food");
  await page.getByLabel("In stock only").click();
  await expect(page.getByLabel("In stock only")).toBeChecked();
  await page.getByLabel("Maximum price", { exact: true }).fill("500");
  await expect(page.locator(".product-card")).toHaveCount(3);
  await page.getByRole("button", { name: "List view" }).click();
  await expect(page.locator(".list-view")).toBeVisible();
});
test("admin product edit persists and is visible in the storefront", async ({
  page,
}) => {
  await page.goto("/admin/products");
  await page
    .getByRole("button", { name: "Edit Premium Mixed Nuts", exact: true })
    .click();
  await page
    .getByLabel("Product name", { exact: true })
    .fill("Harvest Mixed Nuts");
  await page.getByLabel("Price (BDT)").fill("920");
  await page.getByRole("button", { name: "Save product", exact: true }).click();
  await page.goto("/product/p2");
  await expect(
    page.getByRole("heading", { name: "Harvest Mixed Nuts", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".pdp-price")).toContainText("৳920");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Harvest Mixed Nuts", exact: true }),
  ).toBeVisible();
});
test("campaign controls change the customer experience and quick-order bundle total", async ({
  page,
}) => {
  await page.goto("/admin/campaigns");
  await page.getByRole("switch", { name: /Countdown timer/ }).uncheck();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.goto("/campaign/p1");
  await expect(page.locator(".countdown")).toHaveCount(0);
  await page.getByRole("button", { name: /2 jars/ }).click();
  await expect(
    page.getByRole("button", { name: /Confirm order/ }),
  ).toContainText("৳1,310");
  await page.getByLabel("Full name", { exact: true }).fill("Harvest Customer");
  await page.getByLabel("Mobile number", { exact: true }).fill("01811223344");
  await page
    .getByLabel("Delivery address", { exact: true })
    .fill("House 8, Road 9, Banani, Dhaka");
  await page.locator(".quick-order-form input[type=checkbox]").check();
  await page.getByRole("button", { name: /Confirm order/ }).click();
  await expect(page).toHaveURL(/order-success/);
  await expect(page.getByTestId("order-total")).toHaveText("৳1,310");
  const stock = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("nirbhor-v1-products") || "[]").find(
        (p: any) => p.id === "p1",
      ).stock,
  );
  expect(stock).toBe(16);
});
test("new product, inventory adjustment and order update work", async ({
  page,
}) => {
  await page.goto("/admin/products");
  await page
    .getByRole("link", { name: "Add product", exact: true })
    .count()
    .then(async (n) => {
      if (n)
        await page
          .getByRole("link", { name: "Add product", exact: true })
          .click();
      else
        await page
          .getByRole("button", { name: "Add product", exact: true })
          .click();
    });
  await page
    .getByLabel("Product name", { exact: true })
    .fill("Test Harvest Box");
  await page.getByLabel("Price (BDT)").fill("1500");
  await page.getByLabel("Stock quantity").fill("5");
  await page.getByLabel("Visibility").selectOption("Published");
  await page.getByRole("button", { name: "Save product", exact: true }).click();
  await page.goto("/admin/inventory");
  await page.getByLabel("Search inventory").fill("Test Harvest Box");
  await page.getByRole("button", { name: "Adjust stock" }).click();
  await page.getByLabel("Quantity", { exact: true }).fill("7");
  await page
    .getByLabel("A little note for the record")
    .fill("New batch arrived");
  await page.getByRole("button", { name: "Save adjustment" }).click();
  await expect(page.locator("tbody").first()).toContainText("12 units");
  await page.goto("/admin/orders?order=NBR-4821");
  await page.getByLabel("Order status", { exact: true }).selectOption("Packed");
  await page.getByLabel("Tracking number").fill("TEST123");
  await page.getByRole("button", { name: "Save order updates" }).click();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.goto("/track?order=NBR-4821&phone=01712345678");
  await expect(page.locator(".order-timeline .current")).toContainText(
    "Packed",
  );
  await expect(page.locator(".tracking-info")).toContainText("TEST123");
});
test("mobile menus, filters and form layouts stay within the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .locator(".mobile-nav")
    .getByRole("link", { name: "Shop all", exact: true })
    .click();
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await expect(page.locator(".filters.mobile-open")).toBeVisible();
  await page.getByRole("button", { name: "Close filters" }).click();
  for (const route of [
    "/",
    "/shop",
    "/product/p2",
    "/campaign/p1",
    "/cart",
    "/login",
    "/account",
    "/admin",
    "/admin/products",
    "/admin/campaigns",
    "/admin/settings",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1,h2").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route + " has horizontal overflow",
    ).toBe(true);
  }
});
test("all main routes render without client errors or broken images", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/",
    "/shop",
    "/categories",
    "/offers",
    "/product/p2",
    "/campaign/p1",
    "/wishlist",
    "/cart",
    "/checkout",
    "/login",
    "/register",
    "/forgot-password",
    "/track",
    "/about",
    "/contact",
    "/help",
    "/page/shipping",
    "/page/returns",
    "/page/privacy",
    "/page/terms",
    "/admin",
    "/admin/products",
    "/admin/categories",
    "/admin/inventory",
    "/admin/orders",
    "/admin/customers",
    "/admin/reviews",
    "/admin/discounts",
    "/admin/campaigns",
    "/admin/banners",
    "/admin/content",
    "/admin/analytics",
    "/admin/pixel",
    "/admin/settings",
    "/admin/team",
  ]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    expect(await page.locator("body").innerText(), route).not.toBe("");
    const broken = await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs.filter((i) => i.complete && !i.naturalWidth).map((i) => i.src),
      );
    expect(broken, route).toEqual([]);
  }
  expect(errors).toEqual([]);
});
