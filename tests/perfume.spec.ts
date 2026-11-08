import {test,expect} from './fixtures';
import {bn} from '../src/lib/bn';

test('perfume discovery, scent filtering and the shared purchase flow work',async({page})=>{
 await page.goto('/');await expect(page.locator('.perfume-invitation')).toBeVisible();
 await page.locator('.perfume-invitation a').click();await expect(page).toHaveURL('/perfume');
 await expect(page.locator('.perfume-hero h1')).toContainText('আপনার উপস্থিতি');
 await page.locator('.scent-family-tabs').getByRole('button',{name:'ফ্লোরাল',exact:true}).click();await expect(page.locator('.scent-pick')).toHaveCount(1);await expect(page.locator('.scent-pick')).toContainText('রোজ মিউজ');
 await page.locator('.scent-pick').click();await expect(page).toHaveURL('/perfume/product/perfume-rose');
 await page.locator('.scent-layer-tabs').getByRole('tab',{name:'হার্ট নোট',exact:true}).click();await expect(page.getByRole('tabpanel',{name:'হার্ট নোট',exact:true})).toContainText('গোলাপ, জুঁই');await expect(page.locator('.fragrance-sample-tag')).toBeVisible();
 await page.getByRole('button',{name:bn('Add to your bag'),exact:true}).click();await expect(page.locator('.bag-item')).toContainText('রোজ মিউজ');
 await page.getByRole('button',{name:bn('Continue to checkout'),exact:true}).click();await expect(page).toHaveURL('/checkout');await expect(page.locator('.checkout-page')).toContainText('রোজ মিউজ');
});

test('merchant controls scent notes and the hero without losing existing edits',async({page})=>{
 await page.goto('/admin/product-pages?product=perfume-amber');await page.getByRole('tab',{name:'তথ্য ও FAQ',exact:true}).click();
 await page.getByLabel('হার্ট নোট',{exact:true}).fill('জুঁই ও গোলাপ');await page.getByLabel('প্রোফাইলের ব্যাখ্যা ও তথ্যের উৎস',{exact:true}).fill('প্রস্তুতকারকের তথ্য অনুযায়ী সম্পাদিত প্রোফাইল।');await page.locator('.page-editor-save').getByRole('button',{name:'পরিবর্তন সেভ করুন',exact:true}).click();
 await page.goto('/perfume/product/perfume-amber');await page.getByRole('tab',{name:'হার্ট নোট',exact:true}).click();await expect(page.getByRole('tabpanel',{name:'হার্ট নোট',exact:true})).toContainText('জুঁই ও গোলাপ');await page.reload();await page.getByRole('tab',{name:'হার্ট নোট',exact:true}).click();await expect(page.getByRole('tabpanel',{name:'হার্ট নোট',exact:true})).toContainText('জুঁই ও গোলাপ');
 await page.goto('/admin/experiences');await page.locator('.experience-admin-tabs').getByRole('button',{name:'পারফিউম',exact:true}).click();await page.getByLabel(bn('Hero headline'),{exact:true}).fill('নিজের সুগন্ধ খুঁজুন');await page.getByLabel(bn('Hero image URL'),{exact:true}).fill('/assets/perfume-rose-v1.webp');await page.getByRole('button',{name:bn('Save changes'),exact:true}).click();
 await page.goto('/perfume');await expect(page.locator('.perfume-hero h1')).toHaveText('নিজের সুগন্ধ খুঁজুন');await expect(page.locator('.perfume-hero-art img')).toHaveAttribute('src','/assets/perfume-rose-v1.webp');
});

test('the appended catalogue preserves prices, customer data and merchant removals',async({page})=>{
 await page.goto('/');await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);p.find((p:any)=>p.id==='p1').price=777;localStorage.setItem('nirbhor-v1-products',JSON.stringify(p));});await page.reload();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-products')!).find((p:any)=>p.id==='p1').price)).toBe(777);
 await page.evaluate(()=>localStorage.setItem('nirbhor-v1-products',JSON.stringify(JSON.parse(localStorage.getItem('nirbhor-v1-products')!).filter((p:any)=>p.id!=='perfume-noir'))));await page.reload();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-products')!).some((p:any)=>p.id==='perfume-noir'))).toBe(false);
});

for(const width of [320,390,1440])test(`perfume and its buying controls fit ${width}px without runtime errors`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height:900});
 for(const path of ['/perfume','/perfume/shop','/perfume/product/perfume-amber','/admin/product-pages?product=perfume-amber']){await page.goto(path);await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);}
 await page.goto('/perfume');await expect(page.locator('.perfume-hero-art img')).toBeVisible();expect(await page.locator('.perfume-hero-art img').evaluate((i:HTMLImageElement)=>i.naturalWidth)).toBeGreaterThan(1000);expect(errors).toEqual([]);
});
