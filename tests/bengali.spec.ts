import { test, expect } from "@playwright/test";

test("Bengali search, navigation and validation work with Bengali mobile digits", async ({page}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "bn-BD");
  await expect(page.locator(".wordmark").first()).toHaveText("নির্ভর");
  await page.getByRole("textbox", {name:"পণ্য খুঁজুন", exact:true}).fill("মধু");
  await page.getByRole("textbox", {name:"পণ্য খুঁজুন", exact:true}).press("Enter");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.goto("/product/p2");
  await page.getByRole("button", {name:"ব্যাগে যোগ করুন",exact:true}).click();
  await page.getByRole("button", {name:"চেকআউট করুন",exact:true}).click();
  await page.getByLabel("পূর্ণ নাম",{exact:true}).fill("বাংলা ক্রেতা");
  await page.getByLabel("মোবাইল নম্বর",{exact:true}).fill("০১৭১১২২৩৩৪৪");
  await expect(page.getByLabel("মোবাইল নম্বর",{exact:true})).toHaveValue("01711223344");
  await page.getByLabel("সম্পূর্ণ ডেলিভারির ঠিকানা").fill("বাসা ১২, রাস্তা ৮, ধানমন্ডি, ঢাকা");
  await page.getByRole("checkbox").last().check();
  await page.getByRole("button",{name:/অর্ডার দিন/}).click();
  await expect(page).toHaveURL(/order-success/);
  await expect(page.getByTestId("order-total")).toContainText("৯৫০");
  const order=await page.evaluate(()=>JSON.parse(localStorage.getItem("nirbhor-v1-orders")!)[0]);
  expect(order.phone).toBe("01711223344");
  expect(order.customer).toBe("বাংলা ক্রেতা");
});

test("every department appears in the home carousel at three-second intervals", async ({page}) => {
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.clock.install();
  await page.goto("/");
  await expect(page.locator(".cinema-scene")).toHaveCount(9);
  for(const text of ["নিজের জন্য যত্ন।","প্রতিদিনের পোশাক।","প্রকৃতির ভালোবাসা।","ঘর সাজুক","প্রতিদিন একটু সহজ।","নিজের স্নিকার্সে।","আপনার স্টাইলে।","গানে হারিয়ে যান।"]){
    await page.clock.runFor(3100);
    await expect(page.locator(".brand-hero h1")).toContainText(text);
  }
  await page.clock.runFor(3100);
  await expect(page.locator(".brand-hero h1")).toContainText("পছন্দের সবকিছু।");
});

test("translated controls preserve canonical filter and order status values", async ({page})=>{
  await page.goto("/beauty/shop");
  await page.getByLabel("পণ্য সাজান").selectOption("price-high");
  await expect(page.locator(".product-name").first()).toHaveText("ডেইলি কেয়ার ট্রিও");
  await page.goto("/admin/orders?order=NBR-4821");
  await page.getByLabel("অর্ডারের অবস্থা",{exact:true}).selectOption({label:"প্যাক করা হয়েছে"});
  await page.getByRole("button",{name:"অর্ডার আপডেট সেভ করুন"}).click();
  const order=await page.evaluate(()=>JSON.parse(localStorage.getItem("nirbhor-v1-orders")!).find((o:{id:string})=>o.id==="NBR-4821"));
  expect(order.status).toBe("Packed");
});
