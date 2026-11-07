import {test,expect} from './fixtures';
import {bn} from '../src/lib/bn';
test.beforeEach(async({page})=>{await page.addInitScript(()=>{const c=JSON.parse(localStorage.getItem('nirbhor-v1-content')||'{}');c['welcome-offer-popup']=JSON.stringify({version:2,items:[]});localStorage.setItem('nirbhor-v1-content',JSON.stringify(c));});});

test('budget filters contain only categories and attributes of in-budget available products',async({page})=>{
 await page.goto('/shop?budget=500&max=500&stock=true&sort=price-low');
 const data=await page.evaluate(()=>({products:JSON.parse(localStorage.getItem('nirbhor-v1-products')!),categories:JSON.parse(localStorage.getItem('nirbhor-v1-categories')!)}));
 const eligible=data.products.filter((p:any)=>p.status==='Published'&&p.stock>0&&p.price<=500);
 const parents=data.categories.filter((c:any)=>c.active&&!c.parent&&eligible.some((p:any)=>p.category===c.name));
 expect(await page.locator('.category-filter-branch').count()).toBe(parents.length);
 expect(await page.getByLabel(bn('Filter by source')).locator('option:not([value=""])').evaluateAll(els=>els.map(el=>(el as HTMLOptionElement).value).sort())).toEqual([...new Set(eligible.map((p:any)=>p.source).filter(Boolean))].sort());
 await expect(page.getByLabel(bn('Maximum price slider'))).toHaveAttribute('max','500');
 const button=page.locator('.category-filter-expand').first();if(await button.count()){await button.click();const labels=await page.locator('.category-filter-children:not([hidden]) .sub-filter span').allTextContents();expect(labels.every(label=>eligible.some((p:any)=>bn(p.subcategory)===label))).toBe(true);}
});

test('budget survives category changes, reset and attempts to exceed the cap',async({page})=>{
 await page.goto('/shop?budget=1000&max=1000&stock=true&sort=price-low');
 await page.locator('.category-filter-parent input').first().click();
 await expect(page).toHaveURL(/budget=1000/);
 await page.getByLabel(bn('Maximum price'),{exact:true}).fill('5000');
 await expect(page.getByLabel(bn('Maximum price'),{exact:true})).toHaveValue('1000');
 await page.locator('.filters-head').getByRole('button',{name:bn('Reset'),exact:true}).click();
 await expect(page).toHaveURL(/budget=1000/);await expect(page).not.toHaveURL(/category=/);
 await page.getByLabel(bn('Sort products')).selectOption('price-high');
 const valid=await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-products')!).filter((p:any)=>p.status==='Published'&&p.stock>0&&p.price<=1000).map((p:any)=>p.name));
 const names=await page.locator('.catalog-layout .product-name').allTextContents();expect(names.every(name=>valid.includes(name))).toBe(true);
});

test('gallery card title, description, custom rows, order and visibility are controlled by admin',async({page})=>{
 await page.goto('/admin/product-pages?product=p2');await page.getByRole('tab',{name:'তথ্য ও FAQ',exact:true}).click();
 await page.getByLabel('তথ্য কার্ডের শিরোনাম',{exact:true}).fill('নিজের মতো সাজানো তথ্য');
 await page.getByLabel('তথ্য কার্ডের বিবরণ',{exact:true}).fill('এই পণ্যের প্রয়োজনীয় তথ্য এখানে দেখুন।');
 await page.getByLabel('কার্ডের তথ্য কোথা থেকে আসবে').selectOption('custom');
 await page.getByRole('button',{name:'কার্ডে তথ্য যোগ করুন'}).click();await page.getByLabel('কার্ডের তথ্য 1 নাম').fill('সংরক্ষণ');await page.getByLabel('কার্ডের তথ্য 1 মান').fill('বায়ুরোধী পাত্রে রাখুন');
 await page.getByRole('button',{name:'কার্ডে তথ্য যোগ করুন'}).click();await page.getByLabel('কার্ডের তথ্য 2 নাম').fill('পরিবেশন');await page.getByLabel('কার্ডের তথ্য 2 মান').fill('নিজের পছন্দমতো');
 await page.getByRole('button',{name:'কার্ডের তথ্য 2 উপরে',exact:true}).click();await page.getByLabel('নির্বাচিত প্যাক দেখান',{exact:true}).uncheck();
 await page.locator('.page-editor-save').getByRole('button',{name:'পরিবর্তন সেভ করুন',exact:true}).click();
 await page.goto('/product/p2');const card=page.locator('.product-gallery-summary');await expect(card).toContainText('নিজের মতো সাজানো তথ্য');await expect(card).toContainText('এই পণ্যের প্রয়োজনীয় তথ্য');await expect(card.locator('dt').first()).toHaveText('পরিবেশন');await expect(card).not.toContainText('বেছে নেওয়া প্যাক');
 await page.goto('/admin/product-pages?product=p2');await page.getByRole('tab',{name:'তথ্য ও FAQ',exact:true}).click();await page.getByLabel('ছবির নিচের তথ্য কার্ড দেখান').uncheck();await page.locator('.page-editor-save').getByRole('button',{name:'পরিবর্তন সেভ করুন',exact:true}).click();await page.goto('/product/p2');await expect(card).toHaveCount(0);
});

test('new product creation also saves the gallery card configuration',async({page})=>{
 await page.goto('/admin/products');await page.getByRole('button',{name:bn('Add product'),exact:true}).click();
 const dialog=page.getByRole('dialog');await dialog.getByLabel(bn('Product name'),{exact:true}).fill('নতুন কার্ডের পণ্য');await dialog.getByLabel(bn('Price (BDT)'),{exact:true}).fill('700');
 await dialog.getByRole('button',{name:'ছবির নিচের তথ্য',exact:true}).click();await dialog.getByLabel('তথ্য কার্ডের শিরোনাম',{exact:true}).fill('নতুন পণ্যের তথ্য');await dialog.getByLabel('তথ্য কার্ডের বিবরণ',{exact:true}).fill('পণ্য যোগ করার সময় সেভ করা হয়েছে।');
 await dialog.getByRole('button',{name:bn('Save product'),exact:true}).click();await expect(dialog).toHaveCount(0);
 const product=await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-products')!).find((p:any)=>p.name==='নতুন কার্ডের পণ্য'));
 expect(product.page.gallerySummaryTitle).toBe('নতুন পণ্যের তথ্য');
});

test('review rail moves left and pauses on hover and keyboard focus without pause controls',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');const rail=page.locator('.customer-voice-window');await rail.scrollIntoViewIfNeeded();await expect(rail).toHaveAttribute('data-motion','playing');
 const start=await rail.evaluate(el=>el.scrollLeft);await expect.poll(()=>rail.evaluate(el=>el.scrollLeft)).toBeGreaterThan(start+3);
 await rail.hover();await expect(rail).toHaveAttribute('data-motion','paused');const stopped=await rail.evaluate(el=>el.scrollLeft);await page.waitForTimeout(200);expect(Math.abs(await rail.evaluate(el=>el.scrollLeft)-stopped)).toBeLessThan(2);
 await page.mouse.move(0,0);await expect(rail).toHaveAttribute('data-motion','playing');await rail.focus();await expect(rail).toHaveAttribute('data-motion','paused');
 await expect(page.getByRole('button',{name:/স্লাইড থামান|স্ট্রিপ থামান/})).toHaveCount(0);await expect(page.locator('.customer-voice-group').first().getByText('নমুনা রিভিউ').first()).toBeVisible();
});

test('photographic shortcut assets load and narrow layouts remain within the viewport',async({page})=>{
 await page.setViewportSize({width:320,height:900});await page.goto('/');const images=page.locator('.shortcut-photo');await expect(images).toHaveCount(4);await expect.poll(()=>images.evaluateAll(els=>els.every(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0))).toBe(true);
 await expect(page.locator('.offer-ribbon')).not.toContainText('✦');expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(320);
 await page.locator('.customer-voices').scrollIntoViewIfNeeded();await expect(page.locator('.customer-voice-window')).toHaveAttribute('data-motion','paused');
});
