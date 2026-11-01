import { test, expect } from '@playwright/test';
import { bn } from '../src/bn';

test('campaign centers the catalogue shoe over large type and changes image, price and destination together', async ({ page }) => {
  const errors: string[] = [], models: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('request', request => { if (/shoe\.glb|three-studio/.test(request.url())) models.push(request.url()); });
  await page.goto('/sneakers'); const hero = page.locator('.sneaker-campaign');
  await expect(hero.locator('h1')).toHaveText('নিজেরছন্দে।');
  await expect(hero.locator('.campaign-shoe')).toHaveAttribute('src', '/assets/sneaker-campaign/terra-v2.webp');
  await expect(hero.locator('.campaign-product-info')).toContainText(bn('৳2,790'));
  const art = (await hero.locator('.campaign-art').boundingBox())!, scene = (await hero.locator('.campaign-scene').boundingBox())!;
  expect(Math.abs((art.x + art.width / 2) - (scene.x + scene.width / 2))).toBeLessThan(scene.width * .08);
  await hero.getByRole('button', { name: 'কোর্ট আইভরি স্নিকার্স', exact: true }).click();
  await expect(hero.locator('.campaign-product-info h2')).toHaveText('কোর্ট আইভরি স্নিকার্স');
  await expect(hero.locator('.campaign-product-info strong')).toHaveText(bn('৳2,490'));
  await expect(hero.locator('.campaign-shoe')).toHaveAttribute('src', '/assets/sneaker-campaign/court-v2.webp');
  await expect(hero.getByRole('link', { name: 'সাইজ বেছে নিন', exact: true })).toHaveAttribute('href', '/sneakers/product/sneaker-court');
  await hero.getByRole('button', { name: 'পরের স্নিকার্স' }).click(); await expect(hero.locator('.campaign-product-info h2')).toHaveText('আরবান স্লেট স্নিকার্স');
  await hero.getByRole('button', { name: 'পরের স্নিকার্স' }).click(); await expect(hero.locator('.campaign-product-info h2')).toHaveText('স্ট্রিট টেরা হাই-টপ');
  await hero.getByRole('link', { name: 'সাইজ বেছে নিন', exact: true }).click(); await expect(page).toHaveURL('/sneakers/product/sneaker-terra');
  expect(models).toEqual([]); expect(errors).toEqual([]);
});

test('hero quick order uses the selected shoe, actual variant price and the chosen size stock', async ({ page }) => {
  await page.goto('/sneakers'); const hero = page.locator('.sneaker-campaign');
  await hero.getByRole('button', { name: 'কোর্ট আইভরি স্নিকার্স', exact: true }).click();
  await hero.getByRole('button', { name: 'দ্রুত অর্ডার', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'দ্রুত অর্ডার', exact: true });
  await expect(dialog.locator('.express-product h3')).toHaveText('কোর্ট আইভরি স্নিকার্স');
  await dialog.getByLabel('সাইজ / প্যাক').selectOption('EU 42');
  await expect(dialog.getByTestId('express-order-total')).toHaveText(bn('৳2,490'));
  await dialog.getByLabel('আপনার নাম', { exact: true }).fill('স্নিকার্স ক্রেতা');
  await dialog.getByLabel('মোবাইল নম্বর', { exact: true }).fill('01711223344');
  await dialog.getByLabel('ডেলিভারির ঠিকানা', { exact: true }).fill('বাসা ১২, ধানমন্ডি, ঢাকা');
  await dialog.getByRole('checkbox').check(); await dialog.getByRole('button', { name: /অর্ডার নিশ্চিত/ }).click();
  await expect(page).toHaveURL(/order-success/);
  const saved = await page.evaluate(() => ({ order: JSON.parse(localStorage.getItem('nirbhor-v1-orders')!)[0], product: JSON.parse(localStorage.getItem('nirbhor-v1-products')!).find((p: any) => p.id === 'sneaker-court') }));
  expect(saved.order.items[0]).toMatchObject({ id: 'sneaker-court', variant: 'EU 42', quantity: 1, unitPrice: 2490 });
  expect(saved.product.variants.find((v: any) => v.label === 'EU 42').stock).toBe(2); expect(saved.product.stock).toBe(17);
});

test('merchant hero photos and copy remain editable while the rejected default palette upgrades once', async ({ page }) => {
  await page.goto('/sneakers');
  await page.evaluate(() => {
    const categories = JSON.parse(localStorage.getItem('nirbhor-v1-categories')!), category = categories.find((c: any) => c.id === 'c-sneakers');
    Object.assign(category.experience, { heroTitle: 'নিজের ছন্দে,\nনিজের স্নিকার্সে।', accent: '#455c20', background: '#edf1e5', ink: '#232d1c' });
    localStorage.setItem('nirbhor-v1-categories', JSON.stringify(categories)); localStorage.removeItem('nirbhor-sneaker-campaign-v2');
  }); await page.reload();
  await expect(page.locator('#sneaker-hero-title')).toHaveText('নিজেরছন্দে।');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('nirbhor-v1-categories')!).find((c: any) => c.id === 'c-sneakers').experience.accent)).toBe('#193f30');
  await page.evaluate(() => {
    const categories = JSON.parse(localStorage.getItem('nirbhor-v1-categories')!), category = categories.find((c: any) => c.id === 'c-sneakers');
    Object.assign(category.experience, { heroTitle: 'আমাদের নতুন সংগ্রহ', heroImage: '/assets/style-sneaker-court-v1.webp', accent: '#675123' });
    localStorage.setItem('nirbhor-v1-categories', JSON.stringify(categories)); localStorage.removeItem('nirbhor-sneaker-campaign-v2');
  }); await page.reload();
  await expect(page.locator('#sneaker-hero-title')).toHaveText('আমাদের নতুন সংগ্রহ');
  await expect(page.locator('.sneaker-campaign')).toHaveAttribute('data-view', 'photo');
  await expect(page.locator('.campaign-collection-photo img')).toHaveAttribute('src', '/assets/style-sneaker-court-v1.webp');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('nirbhor-v1-categories')!).find((c: any) => c.id === 'c-sneakers').experience.accent)).toBe('#675123');
  await page.getByRole('button', { name: 'ফিচার্ড পণ্য', exact: true }).click(); await expect(page.locator('.sneaker-campaign')).toHaveAttribute('data-view', 'product');
});

test('unpublished or deleted products leave the hero and merchant product photos take precedence', async ({ page }) => {
  await page.goto('/sneakers'); await page.evaluate(() => {
    const products = JSON.parse(localStorage.getItem('nirbhor-v1-products')!).filter((p: any) => p.id !== 'sneaker-terra');
    Object.assign(products.find((p: any) => p.id === 'sneaker-court'), { image: '/assets/style-sneaker-knit-v1.webp' });
    products.find((p: any) => p.id === 'sneaker-urban').status = 'Draft'; localStorage.setItem('nirbhor-v1-products', JSON.stringify(products));
  }); await page.reload();
  const hero = page.locator('.sneaker-campaign');
  await expect(hero.locator('.campaign-product-info h2')).toHaveText('কোর্ট আইভরি স্নিকার্স');
  await expect(hero.locator('.campaign-shoe')).toHaveAttribute('src', '/assets/style-sneaker-knit-v1.webp');
  await expect(hero.locator('.campaign-thumbnails button')).toHaveCount(2);
  await page.evaluate(() => { const products = JSON.parse(localStorage.getItem('nirbhor-v1-products')!); products.forEach((p: any) => { if (p.category === 'Sneakers') p.status = 'Draft'; }); localStorage.setItem('nirbhor-v1-products', JSON.stringify(products)); }); await page.reload();
  await expect(hero).toHaveAttribute('data-view', 'photo'); await expect(hero.getByRole('link', { name: 'কালেকশন দেখুন', exact: true })).toBeVisible(); await expect(hero.locator('.quick-order-trigger')).toHaveCount(0);
});

test('motion is restrained, can be paused and respects a runtime reduced-motion preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.goto('/sneakers'); const hero = page.locator('.sneaker-campaign'), art = hero.locator('.campaign-art');
  await expect(hero).toHaveAttribute('data-motion', 'playing');
  const b = (await art.boundingBox())!; await page.mouse.move(b.x + b.width * .7, b.y + b.height * .4);
  expect(await art.evaluate(el => el.style.getPropertyValue('--shoe-x'))).not.toBe('');
  await hero.getByRole('button', { name: 'অ্যানিমেশন থামান', exact: true }).click(); await expect(hero).toHaveAttribute('data-motion', 'paused');
  expect(await art.evaluate(el => el.style.getPropertyValue('--shoe-x'))).toBe('');
  await hero.getByRole('button', { name: 'অ্যানিমেশন চালু করুন', exact: true }).click(); await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(hero).toHaveAttribute('data-motion', 'paused'); expect(await hero.locator('.campaign-float').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});

for (const width of [320, 390]) test(`campaign controls fit a ${width}px phone with readable type, touch targets and no overflow`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 }); await page.goto('/sneakers'); const hero = page.locator('.sneaker-campaign');
  for (const button of await hero.locator('button:visible').all()) { const box = (await button.boundingBox())!; expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44); }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const title = (await hero.locator('h1').boundingBox())!, scene = (await hero.locator('.campaign-scene').boundingBox())!;
  expect(title.y).toBeLessThan(scene.y + 20);
  await hero.getByRole('button', { name: 'কোর্ট আইভরি স্নিকার্স', exact: true }).click(); await expect(hero.locator('.campaign-product-info h2')).toHaveText('কোর্ট আইভরি স্নিকার্স');
  await hero.getByRole('link', { name: 'সাইজ বেছে নিন', exact: true }).click(); await expect(page).toHaveURL('/sneakers/product/sneaker-court');
});
