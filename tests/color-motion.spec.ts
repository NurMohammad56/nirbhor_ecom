import {test,expect} from '@playwright/test';

test('the live-benefit ribbon moves, pauses for reading and supports a deliberate stop',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');const ribbon=page.locator('.offer-ribbon'),track=ribbon.locator('.offer-ribbon-track');
 await ribbon.scrollIntoViewIfNeeded();await expect(ribbon).toHaveAttribute('data-motion','playing');
 const first=await track.evaluate(el=>getComputedStyle(el).transform);await expect.poll(()=>track.evaluate(el=>getComputedStyle(el).transform)).not.toBe(first);
 await ribbon.hover();await expect(ribbon).toHaveAttribute('data-motion','paused');const frozen=await track.evaluate(el=>getComputedStyle(el).transform);await page.waitForTimeout(180);expect(await track.evaluate(el=>getComputedStyle(el).transform)).toBe(frozen);
 await ribbon.getByRole('button',{name:'সুবিধার স্ট্রিপ থামান',exact:true}).click();await page.mouse.move(1,1);await ribbon.getByRole('button').blur();await expect(ribbon.getByRole('button')).toHaveAttribute('aria-pressed','true');await expect(ribbon).toHaveAttribute('data-motion','paused');
 await ribbon.getByRole('button',{name:'সুবিধার স্ট্রিপ চালু করুন',exact:true}).click();await page.mouse.move(1,1);await ribbon.getByRole('button').blur();await expect(ribbon).toHaveAttribute('data-motion','playing');
 await ribbon.locator('.offer-ribbon-group:not([aria-hidden]) a').first().focus();await expect(ribbon).toHaveAttribute('data-motion','paused');await expect(ribbon.locator('.offer-ribbon-group[aria-hidden=true]')).toHaveAttribute('inert','');
});

test('reduced motion keeps the ribbon and promotional lighting still without hiding the links',async({page})=>{
 await page.setViewportSize({width:320,height:1000});await page.goto('/');const ribbon=page.locator('.offer-ribbon');await ribbon.scrollIntoViewIfNeeded();
 await expect(ribbon).toHaveAttribute('data-motion','paused');expect(await ribbon.locator('.offer-ribbon-track').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 await expect(ribbon.getByRole('button')).toBeHidden();await expect(ribbon.getByRole('link').first()).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(320);
 const flash=page.locator('.flash-sale-section');await flash.scrollIntoViewIfNeeded();expect(await flash.locator('.flash-sale-heading').evaluate(el=>getComputedStyle(el,'::after').animationName)).toBe('none');
});

test('ambient effects stop offscreen and when the document becomes hidden',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');const flash=page.locator('.flash-sale-section');await flash.scrollIntoViewIfNeeded();await expect(flash).toHaveAttribute('data-ambient','playing');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});await expect(flash).toHaveAttribute('data-ambient','paused');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});await expect(flash).toHaveAttribute('data-ambient','playing');
 await page.locator('.site-footer').scrollIntoViewIfNeeded();await expect(flash).toHaveAttribute('data-ambient','paused');
});

test('ribbon claims use real settings and the merchant can disable the strip',async({page})=>{
 await page.goto('/');const coupon=await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-coupons')!).find((c:any)=>c.type==='Percentage'&&c.active));
 const claim=page.locator('.offer-ribbon-group:not([aria-hidden]) a').first();await expect(claim).toContainText(coupon.code);await expect(claim).toHaveAttribute('href','/shop?coupon='+coupon.code);
 await page.goto('/admin/banners');await page.getByRole('checkbox',{name:'সুবিধার অ্যানিমেটেড স্ট্রিপ দেখান',exact:true}).uncheck();await page.getByRole('button',{name:'সেকশন সেভ করুন',exact:true}).click();await page.goto('/');await expect(page.locator('.offer-ribbon')).toHaveCount(0);
});
