import {test,expect} from './fixtures';
import {bn} from '../src/lib/bn';

test('delivery estimate follows region and quantity with actual free-shipping threshold',async({page})=>{
 await page.goto('/product/p2');
 await expect(page.getByTestId('delivery-preview-shipping')).toHaveText('৳৬০');
 await expect(page.getByTestId('delivery-preview-total')).toHaveText('৳৯৫০');
 await page.getByLabel('সম্ভাব্য ডেলিভারির অঞ্চল').selectOption('Outside Dhaka');
 await expect(page.getByTestId('delivery-preview-shipping')).toHaveText('৳১২০');
 await expect(page.getByTestId('delivery-preview-total')).toHaveText('৳১,০১০');
 await page.locator('.pdp-add-row .quantity button').last().click();
 await expect(page.getByTestId('delivery-preview-shipping')).toHaveText('ফ্রি');
 await expect(page.getByTestId('delivery-preview-total')).toHaveText('৳১,৭৮০');
});

test('sticky purchase retains selected quantity, hides for bag and returns on close',async({page})=>{
 await page.goto('/product/p2');
 await expect(page.locator('.pdp-sticky-purchase')).toHaveCount(0);
 await page.locator('.pdp-add-row .quantity button').last().click();
 await page.locator('.delivery-preview').scrollIntoViewIfNeeded();
 await expect(page.locator('.pdp-sticky-purchase')).toBeVisible();
 await expect(page.locator('.pdp-sticky-copy')).toContainText('২টি');
 await page.locator('.pdp-sticky-purchase button').click();
 await expect(page.locator('.pdp-sticky-purchase')).toHaveCount(0);
 await expect(page.locator('.bag-item .quantity')).toContainText('২');
 await page.getByRole('button',{name:bn('Close bag'),exact:true}).click();
 await expect(page.locator('.pdp-sticky-purchase')).toBeVisible();
});

test('share copies exact product URL',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto('/product/p2');
 await page.getByRole('button',{name:'পণ্যের লিংক কপি করুন',exact:true}).click();
 await expect(page.getByRole('button',{name:'পণ্যের লিংক কপি হয়েছে',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(page.url());
});

test('mobile gallery swipe and delivery layout fit narrow screens',async({page})=>{
 await page.setViewportSize({width:320,height:800});
 await page.goto('/product/p1');
 const photo=page.locator('.main-product-photo');
 const image=photo.locator('img').first(),before=await image.getAttribute('src');
 await photo.dispatchEvent('pointerdown',{pointerType:'touch',clientX:240,clientY:200});
 await photo.dispatchEvent('pointerup',{pointerType:'touch',clientX:90,clientY:210});
 await expect(image).not.toHaveAttribute('src',before!);
 await page.locator('.delivery-preview').scrollIntoViewIfNeeded();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 const spacing=await page.locator('.pdp-assurances').evaluate(el=>{const a=el.getBoundingClientRect(),b=el.querySelector('svg')!.getBoundingClientRect();return b.left-a.left;});
 expect(spacing).toBeGreaterThanOrEqual(18);
});
