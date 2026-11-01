import { test, expect } from '@playwright/test';

test('real 3D studio changes the rendered shoe color, rotates, resets and releases its canvas on photo view', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/sneakers');
  const visual = page.locator('.sneaker-studio-visual'), canvas = page.locator('.sneaker-canvas canvas'), host = page.locator('.sneaker-canvas');
  await expect(visual).toHaveAttribute('data-render-state', 'ready');
  await expect(host).toHaveAttribute('data-motion', 'still');
  await expect(page.locator('.sneaker-studio-caption')).toContainText('৩ডি ডিজাইন কনসেপ্ট');
  const initial = await canvas.screenshot();
  await page.getByRole('button', { name: 'বিচ', exact: true }).click();
  await expect(host).toHaveAttribute('data-variant', '1');
  await expect(page.getByRole('button', { name: 'বিচ', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect((await canvas.screenshot()).equals(initial)).toBe(false);
  const before = await host.getAttribute('data-rotation');
  await page.getByRole('button', { name: 'স্নিকার্স ডানে ঘোরান' }).click();
  await expect.poll(() => host.getAttribute('data-rotation')).not.toBe(before);
  await page.getByRole('button', { name: 'প্রিভিউ শুরুতে নিন' }).click();
  await expect(host).toHaveAttribute('data-rotation', before!);
  const b = (await canvas.boundingBox())!;
  await page.mouse.move(b.x + b.width * .4, b.y + b.height * .5); await page.mouse.down();
  await page.mouse.move(b.x + b.width * .7, b.y + b.height * .55, { steps: 8 }); await page.mouse.up();
  await expect.poll(() => host.getAttribute('data-rotation')).not.toBe(before);
  await page.getByRole('button', { name: 'কালেকশনের ছবি', exact: true }).click();
  await expect(canvas).toHaveCount(0); await expect(page.locator('.sneaker-studio-poster img')).toBeVisible();
  await page.getByRole('button', { name: '৩ডি ভিউ', exact: true }).click();
  await expect(visual).toHaveAttribute('data-render-state', 'ready'); await expect(canvas).toHaveCount(1);
  await page.getByRole('link', { name: 'জোড়া বেছে নিন', exact: true }).click();
  await expect(page).toHaveURL('/sneakers/shop'); await expect(canvas).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('model network failure falls back to the merchant photo and shopping remains usable', async ({ page }) => {
  await page.route('**/sneakers-studio/shoe.glb', route => route.abort());
  await page.goto('/sneakers');
  await expect(page.locator('.sneaker-studio-visual')).toHaveAttribute('data-render-state', 'fallback');
  await expect(page.locator('.sneaker-studio-poster img')).toBeVisible();
  await page.getByRole('link', { name: 'জোড়া বেছে নিন', exact: true }).click();
  await expect(page.locator('.catalog-layout .product-card')).toHaveCount(4);
});

test('devices without WebGL retain the photo, accessible links and no canvas', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type: any, ...args: any[]) { return /webgl/.test(type) ? null : (original as any).call(this, type, ...args); } as any;
  });
  await page.goto('/sneakers'); await expect(page.locator('.sneaker-studio-visual')).toHaveAttribute('data-render-state', 'fallback');
  await expect(page.locator('.sneaker-canvas canvas')).toHaveCount(0); await expect(page.locator('.sneaker-studio-poster img')).toBeVisible();
  await expect(page.getByRole('link', { name: 'জোড়া বেছে নিন', exact: true })).toBeVisible();
});

test('other departments do not fetch the 3D model, and merchant photos, copy and custom colors survive the palette upgrade', async ({ page }) => {
  let modelRequests = 0; page.on('request', request => { if (request.url().endsWith('/shoe.glb')) modelRequests++; });
  await page.goto('/organic'); await expect(page.locator('.department-hero-copy h1')).toBeVisible(); expect(modelRequests).toBe(0);
  await page.evaluate(() => {
    const categories = JSON.parse(localStorage.getItem('nirbhor-v1-categories')!);
    const category = categories.find((c: any) => c.id === 'c-sneakers');
    Object.assign(category.experience, { heroTitle: 'আমাদের নতুন সংগ্রহ', heroImage: '/assets/style-sneaker-court-v1.webp', accent: '#675123', background: '#f0f1ed', ink: '#2d3431' });
    localStorage.setItem('nirbhor-v1-categories', JSON.stringify(categories)); localStorage.removeItem('nirbhor-sneaker-studio-v1');
  });
  await page.goto('/sneakers'); await expect(page.locator('#sneaker-hero-title')).toHaveText('আমাদের নতুন সংগ্রহ');
  await page.getByRole('button', { name: 'কালেকশনের ছবি', exact: true }).click(); await expect(page.locator('.sneaker-studio-poster img')).toHaveAttribute('src', '/assets/style-sneaker-court-v1.webp');
  const exp = await page.evaluate(() => JSON.parse(localStorage.getItem('nirbhor-v1-categories')!).find((c: any) => c.id === 'c-sneakers').experience);
  expect(exp.accent).toBe('#675123'); expect(exp.background).toBe('#edf1e5'); expect(exp.ink).toBe('#232d1c');
});

test('reduced motion can be changed at runtime and a lost graphics context shows the photograph', async ({ page }) => {
  await page.goto('/sneakers'); const visual = page.locator('.sneaker-studio-visual'), host = page.locator('.sneaker-canvas');
  await expect(visual).toHaveAttribute('data-render-state', 'ready'); await expect(host).toHaveAttribute('data-motion', 'still');
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await expect(host).toHaveAttribute('data-motion', 'gentle');
  await page.emulateMedia({ reducedMotion: 'reduce' }); await expect(host).toHaveAttribute('data-motion', 'still');
  await page.locator('.sneaker-canvas canvas').evaluate((canvas: HTMLCanvasElement) => canvas.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(visual).toHaveAttribute('data-render-state', 'fallback'); await expect(page.locator('.sneaker-canvas canvas')).toHaveCount(0);
  await expect(page.locator('.sneaker-studio-poster img')).toBeVisible();
});

test.describe('mobile sneaker studio', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test('keeps vertical touch scrolling, fits the viewport and retains shopping controls', async ({ page }) => {
    await page.goto('/sneakers'); await expect(page.locator('.sneaker-studio-visual')).toHaveAttribute('data-render-state', 'ready');
    const canvas = page.locator('.sneaker-canvas canvas'); await canvas.scrollIntoViewIfNeeded();
    const box = (await canvas.boundingBox())!, before = await page.evaluate(() => scrollY);
    const client = await page.context().newCDPSession(page), x = box.x + box.width / 2, y = box.y + box.height * .7;
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 6; step++) { await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - step * 25 }] }); await page.waitForTimeout(25); }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 30);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('link', { name: 'জোড়া বেছে নিন', exact: true }).tap(); await expect(page).toHaveURL('/sneakers/shop');
  });
});
