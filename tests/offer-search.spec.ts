import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`offer search preserves scroll, focus and alignment at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/offers");
    const input = page.getByLabel("কম্বো খুঁজুন", { exact: true });
    await expect(page.locator(".combo-card")).toHaveCount(9);
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".combo-filter-bar").evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 180, behavior: "instant" }));
    await input.click();
    const start = await input.boundingBox();
    const initialScroll = await page.evaluate(() => scrollY);
    expect(initialScroll).toBeGreaterThan(300);
    for (const letter of "জিরা") {
      await input.pressSequentially(letter);
      await expect.poll(() => page.evaluate(() => new URLSearchParams(location.search).get("q"))).toBe(await input.inputValue());
      await expect(input).toBeFocused();
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(initialScroll);
      expect(Math.abs((await input.boundingBox())!.y - start!.y)).toBeLessThan(2);
    }
    await expect(page.locator(".combo-card")).toHaveCount(2);
    await page.getByRole("button", { name: "সব ফিল্টার মুছুন", exact: true }).click();
    await expect(page.locator(".combo-card")).toHaveCount(9);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(initialScroll);
    if (width > 900) {
      const boxes = await page.locator('.combo-search, [aria-label="কম্বোর বাজেট"], [aria-label="কম্বো সাজান"]').evaluateAll(els => els.map(el => { const r=el.getBoundingClientRect(); return {top:r.top,bottom:r.bottom,height:r.height}; }));
      expect(Math.max(...boxes.map(r=>r.top))-Math.min(...boxes.map(r=>r.top))).toBeLessThan(2);
      expect(Math.max(...boxes.map(r=>r.bottom))-Math.min(...boxes.map(r=>r.bottom))).toBeLessThan(2);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("link", { name: "নির্ভর হোম", exact: true }).click();
    await expect(page).toHaveURL("/");
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  });
}

test("search after the hero anchor keeps its position and does not replay reveals", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/offers");
  await page.getByRole("link", { name: "কম্বো ও অফার দেখুন", exact: true }).click();
  await expect(page).toHaveURL(/#offer-collection$/);
  const input=page.getByLabel("কম্বো খুঁজুন", { exact: true });
  await input.scrollIntoViewIfNeeded(); await input.focus();
  // Finish the intentional hero anchor scroll before testing filter updates.
  await page.waitForTimeout(700);
  await page.locator(".combo-filter-bar").evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 180, behavior: "instant" }));
  const start=await page.evaluate(()=>scrollY);
  await page.evaluate(() => {
    const section=document.querySelector('.combo-explorer')!;
    (window as any).removedReveals=0;
    new MutationObserver(records=>{for(const record of records)if(record.oldValue!==null)(window as any).removedReveals++;}).observe(section,{attributes:true,attributeFilter:['data-reveal'],attributeOldValue:true});
  });
  await input.fill("আচার");
  await expect(page.locator(".combo-card")).toHaveCount(1);
  await page.waitForTimeout(250);
  expect(await page.evaluate(()=>scrollY)).toBe(start);
  expect(await page.evaluate(()=>(window as any).removedReveals)).toBe(0);
});
