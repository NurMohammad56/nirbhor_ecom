import { test, expect } from '@playwright/test';
import { bn } from '../src/bn';

test('Tech catalogue filters stay inside a narrow mobile viewport',async({page})=>{
  await page.setViewportSize({width:320,height:844});
  await page.goto('/tech/shop');await page.evaluate(()=>document.fonts.ready);
  const chips=page.locator('.subcategory-chips');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(320);
  expect((await chips.boundingBox())!.x+(await chips.boundingBox())!.width).toBeLessThanOrEqual(320);
  await chips.getByRole('button',{name:'অডিও',exact:true}).click();
  await expect(page.locator('.catalog-layout .product-card')).toHaveCount(3);
});

test('Tech is discoverable throughout the store and its catalogue stays separate from Smart Life',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.brand-department-card[href="/tech"]')).toBeVisible();
  await expect(page.locator('footer a[href="/tech"]')).toBeVisible();
  await page.locator('.brand-nav').getByRole('link',{name:'টেক',exact:true}).click();
  await expect(page).toHaveURL('/tech');
  await expect(page.locator('.department-hero h1')).toContainText('গানে হারিয়ে যান।');
  await expect(page.locator('.department-product-grid .product-card')).toHaveCount(8);
  await expect(page.locator('.department-collection-section .category-rail-card')).toHaveCount(4);
  await expect(page.locator('.top-selling-section .product-rail-window')).toHaveAttribute('data-interval','3000');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',/tech-hero-v1.webp$/);
  await page.goto('/tech/shop?subcategory='+encodeURIComponent('অডিও'));
  await expect(page.locator('.catalog-layout .product-card')).toHaveCount(3);
  await page.goto('/tech/shop?q=keyboard');
  await expect(page.locator('.catalog-layout .product-card')).toHaveCount(1);
  await expect(page.locator('.product-name')).toHaveText('ল্যাভেন্ডার কমপ্যাক্ট কীবোর্ড');
  await page.goto('/smart-life/shop');
  await expect(page.locator('.catalog-layout .product-card')).toHaveCount(9);
  await expect(page.locator('.product-name').filter({hasText:'ল্যাভেন্ডার কমপ্যাক্ট কীবোর্ড'})).toHaveCount(0);
});

test('Tech migration appends once while preserving merchant content, customer state and subsequent removals',async({page})=>{
  await page.goto('/');
  await page.evaluate(()=>{
    const products=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);
    products.find((p:any)=>p.id==='tech-headphones').description='নিজের দোকানের লেখা';
    localStorage.setItem('nirbhor-v1-products',JSON.stringify(products.filter((p:any)=>!p.id.startsWith('tech-')||p.id==='tech-headphones')));
    const categories=JSON.parse(localStorage.getItem('nirbhor-v1-categories')!);
    categories.find((c:any)=>c.id==='c-tech').experience.heroImage='/assets/tech-earbuds-v1.webp';
    localStorage.setItem('nirbhor-v1-categories',JSON.stringify(categories.filter((c:any)=>!c.id.startsWith('c-tech-'))));
    localStorage.setItem('nirbhor-v1-banners',JSON.stringify(JSON.parse(localStorage.getItem('nirbhor-v1-banners')!).filter((b:any)=>b.id!=='tech-v1')));
    localStorage.setItem('nirbhor-v1-cart',JSON.stringify([{id:'p2',variant:'250g',quantity:2}]));
    for(const key of ['products','categories','banners'])localStorage.removeItem('nirbhor-tech-v1-'+key);
  });
  await page.reload();await page.reload();
  const state=await page.evaluate(()=>({p:JSON.parse(localStorage.getItem('nirbhor-v1-products')!),c:JSON.parse(localStorage.getItem('nirbhor-v1-categories')!),b:JSON.parse(localStorage.getItem('nirbhor-v1-banners')!),cart:JSON.parse(localStorage.getItem('nirbhor-v1-cart')!)}));
  expect(state.p).toHaveLength(55);expect(state.p.find((p:any)=>p.id==='tech-headphones').description).toBe('নিজের দোকানের লেখা');
  expect(state.c.filter((c:any)=>c.id.startsWith('c-tech'))).toHaveLength(5);
  expect(state.c.find((c:any)=>c.id==='c-tech').experience.heroImage).toBe('/assets/tech-earbuds-v1.webp');
  expect(state.b).toHaveLength(9);expect(state.cart).toEqual([{id:'p2',variant:'250g',quantity:2}]);
  await page.evaluate(()=>localStorage.setItem('nirbhor-v1-products',JSON.stringify(JSON.parse(localStorage.getItem('nirbhor-v1-products')!).filter((p:any)=>p.id!=='tech-mouse'))));
  await page.reload();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-products')!).some((p:any)=>p.id==='tech-mouse'))).toBe(false);
});

test('Tech purchases use the shared checkout and reserve stock with the correct price',async({page})=>{
  await page.goto('/tech/product/tech-headphones');
  await expect(page.locator('h1')).toHaveText('গ্রাফাইট ওভার-ইয়ার হেডফোন');
  await page.getByRole('button',{name:bn('Add to your bag'),exact:true}).click();
  await page.getByRole('button',{name:bn('Continue to checkout'),exact:true}).click();
  await expect(page.getByTestId('order-total')).toHaveText(bn('৳2,990'));
  await page.getByLabel(bn('Full name'),{exact:true}).fill('টেক ক্রেতা');
  await page.getByLabel(bn('Mobile number'),{exact:true}).fill('01711223344');
  await page.getByLabel(bn('Full delivery address')).fill('বাসা ১২, ধানমন্ডি, ঢাকা');
  await page.getByRole('checkbox').last().check();await page.getByRole('button',{name:/অর্ডার দিন/}).click();
  await expect(page).toHaveURL(/order-success/);
  const data=await page.evaluate(()=>({p:JSON.parse(localStorage.getItem('nirbhor-v1-products')!).find((p:any)=>p.id==='tech-headphones'),o:JSON.parse(localStorage.getItem('nirbhor-v1-orders')!)[0]}));
  expect(data.o.items[0]).toMatchObject({id:'tech-headphones',quantity:1,unitPrice:2990});
  expect(data.p.stock).toBe(11);expect(data.p.variants[0].stock).toBe(11);
});

test('admin controls Tech hero, sections and public visibility',async({page})=>{
  await page.goto('/admin/experiences');await page.getByRole('button',{name:'টেক',exact:true}).click();
  await page.getByLabel(bn('Hero headline'),{exact:true}).fill('আমার নতুন টেক কালেকশন');
  await page.getByLabel(bn('Hero image URL'),{exact:true}).fill('/assets/tech-keyboard-v1.webp');
  await page.getByRole('button',{name:bn('Save changes'),exact:true}).click();
  await page.goto('/tech');await expect(page.locator('.department-hero h1')).toHaveText('আমার নতুন টেক কালেকশন');
  await expect(page.locator('.department-immersive-media img')).toHaveAttribute('src','/assets/tech-keyboard-v1.webp');
  await page.goto('/admin/sections?category=c-tech');
  await page.getByRole('button',{name:'সেকশন যোগ করুন',exact:true}).click();
  await page.getByLabel('সেকশনের শিরোনাম',{exact:true}).fill('আমার ডেস্ক সেটআপ');
  await page.getByLabel('গ্রাফাইট ডেস্ক মাউস সেকশনে রাখুন',{exact:true}).check();
  await page.getByRole('button',{name:'সেকশন সেভ করুন',exact:true}).click();
  await page.goto('/tech');await expect(page.locator('.category-custom-section')).toContainText('আমার ডেস্ক সেটআপ');
  await page.goto('/admin/experiences');await page.getByRole('button',{name:'টেক',exact:true}).click();
  await page.getByRole('switch',{name:new RegExp(bn('Department landing is enabled'))}).uncheck();
  await page.getByRole('button',{name:bn('Save changes'),exact:true}).click();
  await page.goto('/');await expect(page.locator('.brand-nav a[href="/tech"],.brand-department-card[href="/tech"]')).toHaveCount(0);
  await expect(page.locator('.cinema-scene')).toHaveCount(8);
  await page.goto('/tech');await expect(page.locator('.department-hero')).toHaveCount(0);
});
