import { test, expect } from "@playwright/test";
import { bn } from "../src/bn";

test("mouse dragging a category scrolls without opening a link; click and keyboard still work", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.goto("/");
  const rail = page.locator("#departments .category-rail-window");
  await rail.scrollIntoViewIfNeeded();
  const box = (await rail.boundingBox())!;
  await page.mouse.move(box.x + 450, box.y + 60);
  await page.mouse.down();
  await page.mouse.move(box.x + 150, box.y + 60, { steps: 12 });
  await page.mouse.up();
  expect(await rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(250);
  await expect(page).toHaveURL(/\/$/);
  await rail.focus();
  await page.keyboard.press("Home");
  expect(await rail.evaluate(el => el.scrollLeft)).toBe(0);
  await page.keyboard.press("ArrowRight");
  expect(await rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(200);
  await page.keyboard.press("Home");
  await page.locator('.brand-department-card[href="/organic"]').click();
  await expect(page).toHaveURL(/\/organic$/);
});

test("all departments offer a product carousel and actual order ranking excludes cancelled orders", async ({ page }) => {
  await page.goto("/organic");
  await page.evaluate(() => {
    const orders = JSON.parse(localStorage.getItem("nirbhor-v1-orders")!);
    orders.unshift({ ...orders[0], id: "TEST-SALE", status: "Confirmed", items: [{ id: "p2", variant: "250g", quantity: 12 }] });
    orders.unshift({ ...orders[0], id: "TEST-CANCELLED", status: "Cancelled", items: [{ id: "p3", variant: "500g", quantity: 90 }] });
    localStorage.setItem("nirbhor-v1-orders", JSON.stringify(orders));
  });
  await page.reload();
  await expect(page.locator(".product-rail-window .product-name").first()).toHaveText(bn("Premium Mixed Nuts"));
  const rail = page.locator(".product-rail-window");
  await rail.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "পরের পণ্য", exact: true }).click();
  await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(100);
  for (const route of ["beauty", "fashion", "home-living"]) {
    await page.goto("/" + route);
    await expect(page.locator(".top-selling-section")).toHaveCount(1);
    expect(await page.locator(".product-rail-window .product-card").count()).toBeGreaterThan(0);
  }
  await page.goto("/shop?category=Gifts");
  await expect(page.locator(".top-selling-section")).toHaveCount(1);
});

test("quick order keeps variant pricing, shipping, stock and the existing bag intact", async ({ page }) => {
  await page.goto("/product/p1");
  await page.getByRole("button", { name: bn("Add to your bag"), exact: true }).click();
  await page.getByRole("button", { name: bn("Close bag") }).click();
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem("nirbhor-v1-products")!).find((p: any) => p.id === "p1").stock);
  await page.locator(".pdp-express-order").click();
  const dialog = page.getByRole("dialog", { name: "দ্রুত অর্ডার", exact: true });
  await dialog.getByLabel("সাইজ / প্যাক").selectOption("2 jars");
  await dialog.getByLabel("ডেলিভারি এলাকা").selectOption("Outside Dhaka");
  await dialog.getByLabel("আপনার নাম", { exact: true }).fill("সুমাইয়া আক্তার");
  await dialog.getByLabel("মোবাইল নম্বর", { exact: true }).fill("০১৭১১২২৩৩৪৪");
  await dialog.getByLabel("ডেলিভারির ঠিকানা", { exact: true }).fill("বাসা ১২, রোড ৩, কুমিল্লা সদর");
  const expectedTotal = await dialog.getByTestId("express-order-total").textContent();
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: bn("Confirm order"), exact: false }).click();
  await expect(page).toHaveURL(/order-success\/NBR-4822/);
  await expect(page.getByTestId("order-total")).toHaveText(expectedTotal!);
  const saved = await page.evaluate(() => ({ order: JSON.parse(localStorage.getItem("nirbhor-v1-orders")!)[0], stock: JSON.parse(localStorage.getItem("nirbhor-v1-products")!).find((p: any) => p.id === "p1").stock, cart: JSON.parse(localStorage.getItem("nirbhor-v1-cart")!) }));
  expect(saved.order.items[0]).toMatchObject({ id: "p1", variant: "2 jars", quantity: 1, unitPrice: 1250 });
  expect(saved.order.phone).toBe("01711223344");
  expect(saved.stock).toBe(before - 2);
  expect(saved.cart).toHaveLength(1);
});

test("top selling products advance automatically and pause for the customer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/organic");
  const rail = page.locator(".product-rail-window");
  await rail.scrollIntoViewIfNeeded();
  await page.mouse.move(2, 2);
  await expect(rail).toHaveAttribute("data-motion", "playing");
  await page.clock.runFor(5500);
  await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(50);
  await rail.hover();
  await expect(rail).toHaveAttribute("data-motion", "paused");
  const position = await rail.evaluate(el => el.scrollLeft);
  await page.clock.runFor(6000);
  expect(await rail.evaluate(el => el.scrollLeft)).toBe(position);
  await page.mouse.move(2, 2);
  await expect(rail).toHaveAttribute("data-motion", "playing");
});

test("nav labels share one baseline and quick order respects reduced motion and focus restoration", async ({ page }) => {
  await page.goto("/");
  const boxes = await page.locator(".brand-nav .nav-label").evaluateAll(els => els.map(el => ({ top: el.getBoundingClientRect().top, height: el.getBoundingClientRect().height })));
  expect(Math.max(...boxes.map(b => b.top)) - Math.min(...boxes.map(b => b.top))).toBeLessThan(1);
  await page.locator(".brand-everyday-edit .quick-order-trigger").first().click();
  const dialog = page.getByRole("dialog", { name: "দ্রুত অর্ডার", exact: true });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".brand-everyday-edit .quick-order-trigger").first()).toBeFocused();
  expect(await page.locator(".brand-everyday-edit .quick-order-trigger").first().evaluate(el => getComputedStyle(el, "::after").animationName)).toBe("none");
});

test("animated product cards cannot clip the quick order dialog and a stock change blocks ordering", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/beauty");
  await page.locator(".product-rail-window .quick-order-trigger").first().click();
  const dialog = page.getByRole("dialog", { name: "দ্রুত অর্ডার", exact: true });
  const box = (await dialog.boundingBox())!;
  expect(box.width).toBeGreaterThan(500);
  expect(box.x).toBeGreaterThan(300);
  await dialog.getByLabel("আপনার নাম", { exact: true }).fill("Test Customer");
  await dialog.getByLabel("মোবাইল নম্বর", { exact: true }).fill("01711223344");
  await dialog.getByLabel("ডেলিভারির ঠিকানা", { exact: true }).fill("House 12, Road 7, Dhaka");
  await dialog.getByRole("checkbox").check();
  const productId = await page.locator(".product-rail-window .product-name").first().getAttribute("href");
  const editor = await page.context().newPage();
  await editor.goto("/admin/inventory");
  await editor.evaluate(id => {
    const products = JSON.parse(localStorage.getItem("nirbhor-v1-products")!);
    products.find((p: any) => id!.endsWith("/" + p.id)).stock = 0;
    localStorage.setItem("nirbhor-v1-products", JSON.stringify(products));
  }, productId);
  await expect(dialog.getByRole("button", { name: bn("Confirm order"), exact: false })).toBeDisabled();
  await expect(dialog).toContainText("এই প্যাকটি এখন স্টকে নেই");
  await editor.close();
});

test("dashboard shows saved order values and fits mobile without sample growth claims", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.locator(".admin-overview h1")).toHaveText("আপনার স্টোর, এক নজরে");
  await expect(page.locator(".admin-overview")).not.toContainText("12.8%");
  await expect(page.locator(".dashboard-task-list")).toContainText("অর্ডার নিশ্চিত করুন");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel(bn("Dashboard period")).selectOption("30");
  await expect(page.locator(".stats-grid .stat-card")).toHaveCount(4);
});

test.describe("native touch swipe", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("category and product rails respond to a finger without navigating or overflowing", async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    async function swipe(selector: string) {
      const rail = page.locator(selector); await rail.scrollIntoViewIfNeeded();
      const box = (await rail.boundingBox())!;
      const x = Math.min(340, box.x + box.width - 25), y = box.y + 65;
      await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
      for (let i = 1; i <= 10; i++) {
        await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - i * 22, y }] });
        await page.waitForTimeout(20);
      }
      await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(100);
    }
    await page.goto("/");
    await swipe("#departments .category-rail-window");
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/organic");
    await swipe(".product-rail-window");
    await expect(page).toHaveURL(/\/organic$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
