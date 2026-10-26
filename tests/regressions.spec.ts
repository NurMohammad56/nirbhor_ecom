import { bn } from "../src/bn";
import { test, expect } from "@playwright/test";

test("cancellation restores stock once and reopening reserves it again", async ({
  page,
}) => {
  await page.goto("/admin/orders?order=NBR-4821");
  const stock = () =>
    page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("nirbhor-v1-products") || "[]").find(
          (p: any) => p.id === "p1",
        ).stock,
    );
  expect(await stock()).toBe(18);
  await page
    .getByLabel(bn("Order status"), { exact: true })
    .selectOption("Cancelled");
  await page.getByRole("button", { name: bn("Save order updates") }).click();
  await expect.poll(stock).toBe(20);
  await page.getByRole("button", { name: bn("Save order updates") }).click();
  expect(await stock()).toBe(20);
  await page
    .getByLabel(bn("Order status"), { exact: true })
    .selectOption("Confirmed");
  await page.getByRole("button", { name: bn("Save order updates") }).click();
  await expect.poll(stock).toBe(18);
  await page.goto("/admin/products");
  await page
    .getByRole("button", { name: bn("Edit Sundarban Raw Honey"), exact: true })
    .click();
  await page.getByLabel(bn("Price (BDT)")).fill("990");
  await page.getByRole("button", { name: bn("Save product"), exact: true }).click();
  await page.goto("/login");
  await page
    .getByRole("button", { name: bn("Explore a demo customer account") })
    .click();
  await page.goto("/account/order/NBR-4821");
  await expect(page.getByTestId("order-total")).toHaveText(bn("৳1,420"));
  await expect(page.locator(".summary-products")).toContainText(bn("৳1,360"));
});

test("demo customer sees their orders and can add, edit and remove an address", async ({
  page,
}) => {
  await page.goto("/login");
  await page
    .getByRole("button", { name: bn("Explore a demo customer account") })
    .click();
  await expect(
    page.getByRole("heading", { name: bn("Hello, Samia.") }),
  ).toBeVisible();
  await expect(page.locator(".customer-order-list>a")).toHaveCount(1);
  await page.goto("/account/addresses");
  await page.getByRole("button", { name: bn("Add a new address") }).click();
  await page.getByLabel(bn("Recipient name")).fill("Samia Rahman");
  await page.getByLabel(bn("Mobile number"), { exact: true }).fill("01712345678");
  await page
    .getByLabel(bn("Full address"), { exact: true })
    .fill("House 42, Road 3, Banani, Dhaka");
  await page
    .getByRole("checkbox", { name: bn("Make this my default address") })
    .check();
  await page.getByRole("button", { name: bn("Save this little spot") }).click();
  await expect(page.locator(".address-grid")).toContainText(bn("House 42"));
  await page.getByRole("button", { name: bn("Edit address"), exact: true }).click();
  await page
    .getByLabel(bn("Full address"), { exact: true })
    .fill("House 55, Road 3, Banani, Dhaka");
  await page.getByRole("button", { name: bn("Save this little spot") }).click();
  await page.reload();
  await expect(page.locator(".address-grid")).toContainText(bn("House 55"));
  await page.getByRole("button", { name: bn("Remove"), exact: true }).click();
  await page
    .getByRole("button", { name: bn("Remove address"), exact: true })
    .click();
  await expect(page.locator(".address-grid article")).toHaveCount(0);
});
