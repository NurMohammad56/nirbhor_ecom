import { test, expect } from '@playwright/test';
import { bn } from '../src/bn';

test('sneakers and watches are complete departments with scoped products and configurable digital showcases',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.brand-department-card')).toHaveCount(8);
  await expect(page.locator('.cinema-scene')).toHaveCount(9);
  for(const [slug,name] of [['sneakers','স্নিকার্স'],['watches','ঘড়ি']]){
    await page.locator('.brand-nav').getByRole('link',{name,exact:true}).click();
    await expect(page).toHaveURL('/'+slug);
    await expect(page.locator('.digital-showcase-label')).toContainText('ডিজিটাল শোকেস');
    await expect(page.locator('.department-product-grid .product-card')).toHaveCount(4);
    await expect(page.locator('.department-collection-section .category-rail-card')).toHaveCount(3);
    await expect(page.locator('.top-selling-section .product-rail-window')).toHaveAttribute('data-interval','3000');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',new RegExp('style-'+slug+'-hero-v1.webp$'));
  }
  await page.goto('/sneakers/shop?subcategory='+encodeURIComponent('লো-টপ'));
  await expect(page.locator('.catalog-layout .product-card')).toHaveCount(2);
  await page.goto('/shop?q=Rose+Dial');
  await expect(page.locator('.catalog-layout .product-card')).toHaveCount(1);
});

test('style migration preserves saved edits and customer data and respects subsequent deletion',async({page})=>{
  await page.goto('/');
  await page.evaluate(()=>{
    const products=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);products.find((p:any)=>p.id==='sneaker-court').description='আমাদের নিজস্ব জোড়া';
    localStorage.setItem('nirbhor-v1-products',JSON.stringify(products.filter((p:any)=>!p.id.startsWith('watch-')&&(!p.id.startsWith('sneaker-')||p.id==='sneaker-court'))));
    localStorage.setItem('nirbhor-v1-categories',JSON.stringify(JSON.parse(localStorage.getItem('nirbhor-v1-categories')!).filter((c:any)=>!c.id.startsWith('c-sneakers')&&!c.id.startsWith('c-watches'))));
    localStorage.setItem('nirbhor-v1-banners',JSON.stringify(JSON.parse(localStorage.getItem('nirbhor-v1-banners')!).filter((b:any)=>!['sneakers-v1','watches-v1'].includes(b.id))));
    localStorage.setItem('nirbhor-v1-cart',JSON.stringify([{id:'p2',variant:'250g',quantity:2}]));
    for(const key of ['products','categories','banners'])localStorage.removeItem('nirbhor-style-v1-'+key);
  });
  await page.reload();await page.reload();
  const state=await page.evaluate(()=>({p:JSON.parse(localStorage.getItem('nirbhor-v1-products')!),c:JSON.parse(localStorage.getItem('nirbhor-v1-categories')!),b:JSON.parse(localStorage.getItem('nirbhor-v1-banners')!),cart:JSON.parse(localStorage.getItem('nirbhor-v1-cart')!)}));
  expect(state.p).toHaveLength(55);expect(state.p.find((p:any)=>p.id==='sneaker-court').description).toBe('আমাদের নিজস্ব জোড়া');
  expect(state.c.filter((c:any)=>c.id.startsWith('c-sneakers')||c.id.startsWith('c-watches'))).toHaveLength(8);
  expect(state.b).toHaveLength(9);expect(state.cart).toEqual([{id:'p2',variant:'250g',quantity:2}]);
  await page.evaluate(()=>localStorage.setItem('nirbhor-v1-products',JSON.stringify(JSON.parse(localStorage.getItem('nirbhor-v1-products')!).filter((p:any)=>p.id!=='watch-rose'))));
  await page.reload();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-products')!).some((p:any)=>p.id==='watch-rose'))).toBe(false);
});

test('sneaker checkout reserves the chosen size only',async({page})=>{
  await page.goto('/sneakers/product/sneaker-court');
  await page.getByRole('button',{name:new RegExp(bn('EU 42'))}).click();
  await page.getByRole('button',{name:bn('Add to your bag'),exact:true}).click();
  await page.getByRole('button',{name:bn('Continue to checkout'),exact:true}).click();
  await expect(page.getByTestId('order-total')).toHaveText(bn('৳2,490'));
  await page.getByLabel(bn('Full name'),{exact:true}).fill('স্নিকার্স ক্রেতা');await page.getByLabel(bn('Mobile number'),{exact:true}).fill('01711223344');await page.getByLabel(bn('Full delivery address')).fill('বাসা ১২, ধানমন্ডি, ঢাকা');
  await page.getByRole('checkbox').last().check();await page.getByRole('button',{name:/অর্ডার দিন/}).click();await expect(page).toHaveURL(/order-success/);
  const data=await page.evaluate(()=>({p:JSON.parse(localStorage.getItem('nirbhor-v1-products')!).find((p:any)=>p.id==='sneaker-court'),o:JSON.parse(localStorage.getItem('nirbhor-v1-orders')!)[0]}));
  expect(data.o.items[0]).toMatchObject({id:'sneaker-court',variant:'EU 42',quantity:1});expect(data.p.stock).toBe(17);expect(data.p.variants.find((v:any)=>v.label==='EU 42').stock).toBe(2);expect(data.p.variants.find((v:any)=>v.label==='EU 38').stock).toBe(3);
});

test('admin can replace a hero by URL or upload and the chosen image persists',async({page})=>{
  await page.goto('/admin/experiences');await page.getByRole('button',{name:'ঘড়ি',exact:true}).click();
  await page.getByLabel(bn('Hero image URL'),{exact:true}).fill('/assets/style-watch-heritage-v1.webp');await page.getByRole('button',{name:bn('Save changes'),exact:true}).click();
  await page.goto('/watches');await expect(page.locator('.department-immersive-media img')).toHaveAttribute('src','/assets/style-watch-heritage-v1.webp');
  await page.goto('/admin/experiences');await page.getByRole('button',{name:'স্নিকার্স',exact:true}).click();
  await page.getByLabel('হিরোর ছবি আপলোড',{exact:true}).setInputFiles('public/assets/style-sneaker-court-v1.webp');
  await expect(page.locator('.experience-preview > img')).toHaveAttribute('src',/^data:image\/webp/);
  await page.getByRole('button',{name:bn('Save changes'),exact:true}).click();await page.goto('/sneakers');await page.reload();
  await expect(page.locator('.department-immersive-media img')).toHaveAttribute('src',/^data:image\/webp/);
});

test('hover magnification follows the pointer, resets and keeps the full image dialog usable',async({page})=>{
  await page.goto('/watches/product/watch-midnight');const photo=page.locator('.main-product-photo');await photo.scrollIntoViewIfNeeded();const b=(await photo.boundingBox())!;
  await page.mouse.move(b.x+b.width*.25,b.y+b.height*.3);await expect(photo).toHaveAttribute('data-zoomed','true');
  const first=await photo.evaluate(el=>el.style.getPropertyValue('--zoom-x'));await page.mouse.move(b.x+b.width*.75,b.y+b.height*.6);const second=await photo.evaluate(el=>el.style.getPropertyValue('--zoom-x'));expect(parseFloat(second)).toBeGreaterThan(parseFloat(first));
  await expect.poll(()=>photo.locator('> img').evaluate(el=>getComputedStyle(el).transform)).toBe('matrix(1.9, 0, 0, 1.9, 0, 0)');
  await page.mouse.move(2,2);await expect(photo).not.toHaveAttribute('data-zoomed','true');
  await page.getByRole('button',{name:bn('Zoom product image'),exact:true}).click();await expect(page.locator('.zoomed-product')).toBeVisible();
});

test.describe('touch product imagery',()=>{
  test.use({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  test('touch keeps images stable and retains tap-to-enlarge',async({page})=>{
    await page.goto('/sneakers/product/sneaker-knit');const photo=page.locator('.main-product-photo');await photo.tap();await expect(photo).not.toHaveAttribute('data-zoomed','true');await page.getByRole('button',{name:bn('Zoom product image'),exact:true}).tap();await expect(page.locator('.zoomed-product')).toBeVisible();
  });
});

test('compact desktop menu opens below the header and reaches the new collections',async({page})=>{
  await page.setViewportSize({width:1366,height:900});await page.goto('/');
  await page.getByRole('button',{name:bn('Open menu'),exact:true}).click();
  const menu=page.locator('.brand-mobile-nav');await expect(menu).toBeVisible();
  const header=await page.locator('.brand-site-header').boundingBox(),nav=await menu.boundingBox();
  expect(Math.abs(nav!.y-(header!.y+header!.height))).toBeLessThan(2);
  await menu.getByRole('link',{name:/স্নিকার্স/}).click();await expect(page).toHaveURL('/sneakers');await expect(menu).toHaveCount(0);
  expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
});
