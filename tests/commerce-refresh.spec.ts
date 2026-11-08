import { test, expect } from './fixtures';
import { bn } from '../src/lib/bn';
import { departmentOffers } from '../src/lib/offer-merchandising';
import { seedProducts } from '../src/data/catalog';

test('the home and all eight departments advertise real scoped offers with working destinations',async({page})=>{
  await page.goto('/');await expect(page.locator('.home-offer-slider .cinema-scene')).toHaveCount(10);
  await expect(page.locator('.home-offer-slider .offer-slide-saving')).toHaveText('১০% ছাড়');
  await expect(page.locator('.home-offer-slider .offer-slide-conditions')).toContainText('ন্যূনতম ৳৫০০');
  await expect(page.locator('.flash-sale-section .product-card').first()).toBeVisible();
  for(const slug of ['organic','beauty','fashion','home-living','smart-life','sneakers','watches','tech']){
    await page.goto('/'+slug);await expect(page.locator('.department-offer-slider .cinema-scene')).toHaveCount(3);
    const href=await page.locator('.offer-slide-cta').getAttribute('href');expect(href).toMatch(new RegExp(`^/${slug}/shop\\?(collection=offers|coupon=)`));
    await page.locator('.offer-slide-cta').click();await expect(page.locator('.catalog-layout .product-card').first()).toBeVisible();
  }
});

test('a coupon banner carries its code through catalogue price previews and a real quick order',async({page})=>{
  await page.goto('/');await page.locator('.home-offer-slider .offer-slide-cta').click();await expect(page).toHaveURL(/shop\?coupon=NIRBHOR10/);
  await expect(page.locator('.coupon-collection-notice')).toContainText('NIRBHOR10');
  const name=await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-products')!).find((p:any)=>p.id==='p1').name);
  const card=page.locator('.catalog-layout .product-card').filter({has:page.getByRole('link',{name,exact:true})});
  await expect(card.locator('.coupon-product-price b')).toHaveText(bn('৳612'));
  await card.locator('.quick-order-trigger').click();const dialog=page.getByRole('dialog',{name:'দ্রুত অর্ডার',exact:true});
  await expect(dialog.getByTestId('express-order-total')).toHaveText(bn('৳672'));
  await dialog.getByLabel('আপনার নাম',{exact:true}).fill('অফারের ক্রেতা');await dialog.getByLabel('মোবাইল নম্বর',{exact:true}).fill('01988112233');await dialog.getByLabel('ডেলিভারির ঠিকানা',{exact:true}).fill('বাসা ২৫, রোড ৪, ধানমন্ডি, ঢাকা');
  await dialog.getByRole('checkbox').check();await dialog.getByRole('button',{name:/অর্ডার নিশ্চিত/}).click();await expect(page).toHaveURL(/order-success/);
  const order=await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-orders')!)[0]);expect(order.total).toBe(672);expect(order.discount).toBe(68);expect(order.couponCode).toBe('NIRBHOR10');expect(order.items[0].unitPrice).toBe(680);
});

test('an offer expires while the page is open and its banner and price preview disappear at the deadline',async({page})=>{
  const now=new Date('2026-11-02T06:00:00+06:00');await page.clock.install({time:now});await page.goto('/');
  await page.evaluate((end)=>{const coupons=JSON.parse(localStorage.getItem('nirbhor-v1-coupons')!);for(const c of coupons){c.active=c.id==='d1';if(c.id==='d1')c.end=end;}localStorage.setItem('nirbhor-v1-coupons',JSON.stringify(coupons));},new Date(now.getTime()+5000).toISOString());
  await page.reload();await expect(page.locator('.home-offer-slider .offer-slide-saving')).toContainText('১০%');await page.clock.runFor(5100);
  await expect(page.locator('.home-offer-slider .offer-slide-saving')).not.toContainText('১০%');
  await page.goto('/sneakers/shop?coupon=NIRBHOR10');await expect(page.locator('.coupon-collection-notice')).toContainText('এখন প্রযোজ্য নয়');await expect(page.locator('.coupon-product-price')).toHaveCount(0);
});

test('admin edits and hides the main offer banner without changing the actual coupon, prices or saved orders',async({page})=>{
  await page.goto('/admin/banners');await page.locator('.offer-banner-admin-card').first().getByRole('button',{name:'ব্যানার সম্পাদনা',exact:true}).click();const dialog=page.getByRole('dialog');
  await dialog.getByLabel('ব্যানারের শিরোনাম').fill('আপনার পছন্দ, আমাদের আয়োজন');await dialog.getByLabel(bn('Hero image URL'),{exact:true}).fill('/assets/offers-combo-hero-v1.webp');await dialog.getByRole('button',{name:'পরিবর্তন সেভ করুন',exact:true}).click();
  await page.goto('/');await expect(page.locator('.home-offer-slider h1')).toHaveText('আপনার পছন্দ, আমাদের আয়োজন');await expect(page.locator('.home-offer-slider .cinema-scene.is-active img')).toHaveAttribute('src','/assets/offers-combo-hero-v1.webp');
  await expect(page.locator('.home-offer-slider .offer-slide-saving')).toHaveText('১০% ছাড়');
  await page.goto('/admin/banners');await page.locator('.offer-banner-admin-card').first().getByRole('button',{name:'ব্যানার লুকান',exact:true}).click();await page.goto('/');await expect(page.locator('.home-offer-slider h1')).not.toHaveText('আপনার পছন্দ, আমাদের আয়োজন');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-coupons')!).find((c:any)=>c.code==='NIRBHOR10').value)).toBe(10);
});

test('autoplay advances at three seconds and stops while a customer focuses the offer link',async({page})=>{
  await page.clock.install();await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');const hero=page.locator('.home-offer-slider');const first=await hero.locator('h1').textContent();
  await page.clock.runFor(3100);await expect(hero.locator('h1')).not.toHaveText(first!);await hero.locator('.offer-slide-cta').focus();const focused=await hero.locator('h1').textContent();await page.clock.runFor(6500);await expect(hero.locator('h1')).toHaveText(focused!);
  await expect(hero.locator('.cinema-arrows button')).toHaveCount(2);
});

test('offer claims omit exhausted coupons and out-of-stock items with a larger historical discount',()=>{
  const p={...seedProducts[0],id:'offer-p',category:'Organic Food',price:80,oldPrice:100,stock:10,status:'Published' as const};
  const s={products:[p,{...p,id:'empty',price:50,stock:0}],categories:[{id:'c0',name:'Organic Food',parent:'',active:true,description:'',image:p.image,sort:0}],coupons:[{id:'used',code:'USED',type:'Percentage',value:90,minimum:0,active:true,uses:2,limit:2,start:'',end:'',scope:'All products',perUser:1}],combos:[],discounts:[],content:{}};
  const slides=departmentOffers(s,'organic');expect(slides.filter(s=>s.source==='sale')).toHaveLength(1);expect(slides[0].badge).toBe('সর্বোচ্চ 20% ছাড়');expect(slides[0].link).toContain('collection=offers');expect(slides.some(s=>s.source==='coupon')).toBe(false);
});

for(const width of [320,390])test(`the new storefront, coupon catalogue and banner editor fit ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:844});for(const route of ['/','/beauty','/sneakers/shop?coupon=NIRBHOR10','/admin/banners']){await page.goto(route);await page.locator('h1').first().waitFor();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
