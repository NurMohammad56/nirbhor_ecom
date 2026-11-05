import {test,expect} from '@playwright/test';
import {bn} from '../src/lib/bn';

test('catalogue pagination fits a narrow phone and remains usable',async({page})=>{
  await page.setViewportSize({width:320,height:844});await page.goto('/shop');await page.evaluate(()=>document.fonts.ready);
  const pages=page.locator('.pagination');await pages.scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await pages.getByRole('button',{name:bn('Page 2'),exact:true}).click();
  await expect(pages.getByRole('button',{name:bn('Page 2'),exact:true})).toHaveClass('active');
});

test('the category directory is compact, image-free and closes when the pointer leaves',async({page})=>{
  await page.goto('/');
  const trigger=page.getByRole('button',{name:bn('Discover'),exact:true}),panel=page.locator('#category-directory');
  await trigger.hover();await expect(panel).toBeVisible();
  await expect(panel.locator('img')).toHaveCount(0);
  await expect(panel.locator('.category-directory-group')).toHaveCount(8);
  expect((await panel.boundingBox())!.height).toBeLessThan(550);
  const bounds=(await panel.boundingBox())!;await page.mouse.move(bounds.x+15,bounds.y+40);
  await expect(panel).toBeVisible();
  await page.mouse.move(1435,960);await expect(panel).toHaveCount(0);
  expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
});

test('click, outside click and keyboard dismissal work without trapping focus',async({page})=>{
  await page.goto('/');const trigger=page.getByRole('button',{name:bn('Discover'),exact:true}),panel=page.locator('#category-directory');
  await trigger.click();await expect(panel).toBeVisible();
  await page.mouse.click(1420,900);await expect(panel).toHaveCount(0);
  await trigger.focus();await trigger.press('ArrowDown');await expect(panel.locator('a').first()).toBeFocused();
  await page.keyboard.press('Escape');await expect(panel).toHaveCount(0);await expect(trigger).toBeFocused();
  await trigger.press('Enter');await expect(panel).toBeVisible();
  await panel.getByRole('button',{name:'ক্যাটাগরি মেনু বন্ধ করুন'}).click();await expect(panel).toHaveCount(0);
  await trigger.focus();await trigger.press('Enter');await panel.locator('a').last().focus();await page.keyboard.press('Tab');await expect(panel).toHaveCount(0);
});

test('category links keep their scope and page scrolling dismisses the directory',async({page})=>{
  await page.goto('/');const trigger=page.getByRole('button',{name:bn('Discover'),exact:true}),panel=page.locator('#category-directory');
  await trigger.hover();await panel.getByRole('link',{name:'নারীদের ঘড়ি',exact:true}).click();
  await expect(page).toHaveURL('/watches/shop?subcategory='+encodeURIComponent('নারীদের ঘড়ি'));
  await expect(page.locator('.catalog-layout .product-card')).toHaveCount(2);await expect(panel).toHaveCount(0);
  await trigger.click();await expect(panel).toBeVisible();await page.evaluate(()=>window.scrollBy(0,300));await expect(panel).toHaveCount(0);
});

test('compact navigation uses small symbols and closes with Escape',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/');
  const trigger=page.getByRole('button',{name:bn('Open menu'),exact:true});await trigger.click();
  const menu=page.locator('.brand-mobile-nav');await expect(menu).toBeVisible();
  await expect(menu.locator('img')).toHaveCount(0);await expect(menu.locator('.mobile-department-link')).toHaveCount(8);
  await page.keyboard.press('Escape');await expect(menu).toHaveCount(0);await expect(trigger).toBeFocused();
  expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
});
