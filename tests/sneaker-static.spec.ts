import { test, expect } from '@playwright/test';
import { bn } from '../src/bn';

test('sneakers restores the photograph hero without motion and retains its collection and product sections', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.goto('/sneakers');
  const hero = page.locator('.department-sneakers .department-hero-shell'), image = hero.locator('.department-immersive-media > img');
  await expect(image).toHaveAttribute('src', '/assets/style-sneakers-hero-v1.webp');
  await expect(hero.locator('h1')).toHaveText('নিজের ছন্দে,নিজের স্নিকার্সে।');
  await expect(page.locator('.sneaker-campaign')).toHaveCount(0);
  expect(await image.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  expect(await image.locator('..').evaluate(el => getComputedStyle(el).transform)).toBe('none');
  await expect(hero).not.toHaveAttribute('data-depth', 'hero');
  await expect(page.locator('.department-product-grid .product-card')).toHaveCount(4);
  await expect(page.locator('.top-selling-section')).toHaveCount(1);
  await hero.getByRole('link', { name: bn('Explore sneakers'), exact: false }).click(); await expect(page).toHaveURL('/sneakers/shop');
  await page.goto('/beauty'); await expect(page.locator('.department-hero-shell')).toHaveAttribute('data-depth', 'hero');
});

test('restoring the old default headline preserves merchant image, colors, descriptions and later copy edits', async ({ page }) => {
  await page.goto('/sneakers'); await page.evaluate(() => {
    const categories = JSON.parse(localStorage.getItem('nirbhor-v1-categories')!), category = categories.find((c: any) => c.id === 'c-sneakers');
    Object.assign(category.experience, { heroTitle: 'নিজের\nছন্দে।', heroImage: '/assets/style-sneaker-court-v1.webp', accent: '#675123', description: 'আমাদের বাছাই করা সংগ্রহ' });
    localStorage.setItem('nirbhor-v1-categories', JSON.stringify(categories)); localStorage.removeItem('nirbhor-sneaker-static-v3');
  }); await page.reload();
  await expect(page.locator('.department-hero-copy h1')).toHaveText('নিজের ছন্দে,নিজের স্নিকার্সে।');
  await expect(page.locator('.department-immersive-media img')).toHaveAttribute('src', '/assets/style-sneaker-court-v1.webp');
  await expect(page.locator('.department-hero-copy > p')).toHaveText('আমাদের বাছাই করা সংগ্রহ');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('nirbhor-v1-categories')!).find((c: any) => c.id === 'c-sneakers').experience.accent)).toBe('#675123');
  await page.evaluate(() => { const categories = JSON.parse(localStorage.getItem('nirbhor-v1-categories')!); categories.find((c: any) => c.id === 'c-sneakers').experience.heroTitle = 'আমার নিজস্ব হেডলাইন'; localStorage.setItem('nirbhor-v1-categories', JSON.stringify(categories)); localStorage.removeItem('nirbhor-sneaker-static-v3'); }); await page.reload();
  await expect(page.locator('.department-hero-copy h1')).toHaveText('আমার নিজস্ব হেডলাইন');
});
