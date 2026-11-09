import {test,expect} from './fixtures';

test.beforeEach(async({page})=>{await page.addInitScript(()=>{const c=JSON.parse(localStorage.getItem('nirbhor-v1-content')||'{}');c['welcome-offer-popup']=JSON.stringify({version:2,items:[]});localStorage.setItem('nirbhor-v1-content',JSON.stringify(c));});});
import {productSales} from '../src/lib/best-selling';

for(const width of [1440,1024,768,390,320])test(`every slide keeps its hero and following content stationary at ${width}px`,async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:1200});
 for(const route of ['/','/organic','/beauty','/fashion','/home-living','/smart-life','/watches','/tech']){
  await page.goto(route);await page.evaluate(()=>document.fonts.ready);
  const hero=page.locator('.offer-slider');await expect(hero).toHaveAttribute('data-hero-stable','true');
  const initial=await hero.evaluate(el=>({height:el.getBoundingClientRect().height,bottom:el.getBoundingClientRect().bottom+scrollY}));
  const count=await hero.locator('.cinema-scene').count();
  for(let i=0;i<count;i++){
   await hero.locator('.cinema-arrows button').last().click();
   const next=await hero.evaluate(el=>({height:el.getBoundingClientRect().height,bottom:el.getBoundingClientRect().bottom+scrollY}));
   expect(Math.abs(next.height-initial.height),route).toBeLessThan(1);expect(Math.abs(next.bottom-initial.bottom),route).toBeLessThan(1);
  }
 }
});

test('long merchant copy and image changes stay stable after resizing on a noninitial slide',async({page})=>{
 await page.goto('/organic');await page.evaluate(()=>{
  const content=JSON.parse(localStorage.getItem('nirbhor-v1-content')||'{}');
  content['offer-banner-organic-spotlight-title']='নিজের পছন্দের হারবাল চা দিয়ে প্রতিদিনের ছোট্ট বিরতিটি সাজিয়ে নিন';
  content['offer-banner-organic-spotlight-text']='উপাদান, প্যাকের পরিমাণ এবং ব্যবহারবিধি মিলিয়ে আপনার পছন্দের পণ্যটি বেছে নিন। অর্ডারের আগে বর্তমান দাম ও ডেলিভারির তথ্যও দেখে নিন।';
  content['offer-banner-organic-spotlight-image']='/assets/product-p4-v5.webp';localStorage.setItem('nirbhor-v1-content',JSON.stringify(content));
 });await page.reload();const hero=page.locator('.offer-slider');await hero.locator('.cinema-arrows button').last().click();
 for(const width of [390,320,1440]){
  await page.setViewportSize({width,height:1400});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(80);
  const height=(await hero.boundingBox())!.height;
  for(let i=0;i<3;i++){await hero.locator('.cinema-arrows button').last().click();expect(Math.abs((await hero.boundingBox())!.height-height)).toBeLessThan(1);}
  const copy=(await hero.locator('.offer-slide-copy').boundingBox())!,conditions=(await hero.locator('.offer-slide-conditions').boundingBox())!;expect(conditions.y+conditions.height).toBeLessThan(copy.y+copy.height);
 }
});

test('shopping shortcuts open the intended offers tab and budget links enforce actual prices',async({page})=>{
 await page.goto('/');await page.locator('.shopping-shortcuts a[href="/offers?tab=combo"]').click();
 await expect(page.getByRole('tab',{name:'কম্বো',exact:true})).toHaveAttribute('aria-selected','true');await expect(page.locator('.offer-code-grid')).toHaveCount(0);
 await page.goto('/');await page.locator('.coupon-shelf .shopping-section-heading a').click();await expect(page.getByRole('tab',{name:'কুপন',exact:true})).toHaveAttribute('aria-selected','true');await expect(page.locator('.combo-explorer')).toHaveCount(0);
 await page.goto('/');await page.locator('.budget-find-card').first().click();await expect(page).toHaveURL(/max=500/);
 await expect(page.locator('.catalog-layout .product-name').first()).toBeVisible();
 const names=await page.locator('.catalog-layout .product-name').allTextContents();
 const valid=await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-products')!).filter((p:any)=>p.status==='Published'&&p.stock>0&&p.price<=500).map((p:any)=>p.name));
 expect(names.length).toBeGreaterThan(0);expect(names.every(name=>valid.includes(name))).toBe(true);
});

test('copying an active coupon preserves scroll and expired coupons disappear',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto('/');const shelf=page.locator('.coupon-shelf');await shelf.scrollIntoViewIfNeeded();
 const code=await shelf.locator('code').first().textContent(),button=shelf.getByRole('button',{name:code+' কপি করুন',exact:true});await button.scrollIntoViewIfNeeded();const top=await page.evaluate(()=>scrollY);
 await button.click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(code);expect(Math.abs(await page.evaluate(()=>scrollY)-top)).toBeLessThan(2);
 await page.evaluate(()=>{const coupons=JSON.parse(localStorage.getItem('nirbhor-v1-coupons')!);coupons.forEach((c:any)=>c.end='2020-01-01');localStorage.setItem('nirbhor-v1-coupons',JSON.stringify(coupons));});await page.reload();await expect(shelf).toHaveCount(0);
});

test('best-selling discovery follows actual orders and admin can hide the new home sections',async({page})=>{
 await page.goto('/shop?collection=bestsellers');const orders=await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-orders')!));const sales=productSales(orders);
 const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-products')!));const names=await page.locator('.catalog-layout .product-name').allTextContents();
 const counts=names.map(name=>sales.get(data.find((p:any)=>p.name===name).id)||0);expect(counts).toEqual([...counts].sort((a,b)=>b-a));
 await page.goto('/admin/banners');await page.getByRole('checkbox',{name:'হোমপেজে কুপন দেখান',exact:true}).uncheck();await page.getByRole('checkbox',{name:'বাজেটের পণ্য দেখান',exact:true}).uncheck();await page.getByRole('button',{name:'সেকশন সেভ করুন',exact:true}).click();
 await page.goto('/');await expect(page.locator('.coupon-shelf,.budget-finds')).toHaveCount(0);
});

test('mobile search is directly reachable and discovery sections fit a narrow screen',async({page})=>{
 await page.setViewportSize({width:320,height:900});await page.goto('/');await expect(page.locator('.brand-header-search input')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(320);
 await page.locator('.brand-header-search input').fill('মধু');await page.locator('.brand-header-search input').press('Enter');await expect(page).toHaveURL(/q=/);await expect(page.locator('.catalog-layout .product-card')).toHaveCount(2);
});
