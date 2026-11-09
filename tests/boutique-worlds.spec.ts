import {test,expect} from './fixtures';

test('footwear studio switches real products and opens the selected size-aware quick order',async({page})=>{
 await page.goto('/sneakers');const hero=page.locator('.footwear-hero');await expect(hero).toBeVisible();await expect(hero.locator('.footwear-picker button')).toHaveCount(4);
 await hero.getByRole('button',{name:'আরবান স্লেট স্নিকার্স',exact:true}).click();await expect(hero).toHaveClass(/footwear-mood-slate/);await expect(hero.locator('.footwear-product-caption')).toContainText('আরবান স্লেট');
 await expect(hero.locator('.footwear-purchase>a')).toHaveAttribute('href','/sneakers/product/sneaker-urban');await hero.locator('.quick-order-trigger').click();await expect(page.getByRole('dialog')).toContainText('আরবান স্লেট');
 await page.keyboard.press('Escape');await hero.locator('.footwear-purchase>a').click();await expect(page).toHaveURL('/sneakers/product/sneaker-urban');await expect(page.locator('.variant-options')).toBeVisible();
});

test('footwear hero retains uploaded campaign images and merchant headlines',async({page})=>{
 await page.goto('/sneakers');await page.evaluate(()=>{const cats=JSON.parse(localStorage.getItem('nirbhor-v1-categories')!);const c=cats.find((c:any)=>c.id==='c-sneakers');c.experience.heroTitle='আমাদের নতুন স্নিকার্স';c.experience.heroImage='/assets/style-sneaker-terra-v1.webp';localStorage.setItem('nirbhor-v1-categories',JSON.stringify(cats));});await page.reload();
 await expect(page.locator('.footwear-headline h1')).toHaveText('আমাদের নতুন স্নিকার্স');await expect(page.locator('.footwear-merchant-photo img')).toHaveAttribute('src','/assets/style-sneaker-terra-v1.webp');
 await page.locator('.footwear-picker button').first().click();await expect(page.locator('.footwear-shoe')).toBeVisible();
});

test('boutique feature prices follow the shown default variant after merchant edits',async({page})=>{
 await page.goto('/sneakers');await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);const shoe=p.find((p:any)=>p.id==='sneaker-court');shoe.variants.find((v:any)=>v.label===shoe.weight).price=3333;const scent=p.find((p:any)=>p.id==='perfume-amber');scent.variants[0].price=4444;localStorage.setItem('nirbhor-v1-products',JSON.stringify(p));});await page.reload();await expect(page.locator('.footwear-product-caption b')).toContainText('৩,৩৩৩');await page.goto('/perfume');await expect(page.locator('.fragrance-hero-product>b')).toContainText('৪,৪৪৪');
});

test('perfume categories use botanical pictures and jasmine discovery uses saved notes',async({page})=>{
 await page.goto('/perfume');await expect(page.locator('.fragrance-family-card')).toHaveCount(7);await expect(page.locator('.fragrance-family-card>img')).toHaveCount(0);await expect(page.locator('.fragrance-family-card .botanical-sprite')).toHaveCount(7);await expect(page.locator('.perfume-hero-art img')).toHaveAttribute('src','/assets/fragrance/aqua-collection-v3.webp');
 await page.locator('.fragrance-ingredient-links').getByRole('link',{name:'জুঁই',exact:false}).click();await expect(page).toHaveURL(/note=jasmine/);await expect(page.locator('.catalog-layout .product-card')).toHaveCount(2);
 await page.evaluate(()=>{const items=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);items.find((p:any)=>p.id==='perfume-amber').page.fragranceHeartNotes='মসলা';localStorage.setItem('nirbhor-v1-products',JSON.stringify(items));});await page.reload();await expect(page.locator('.catalog-layout .product-card')).toHaveCount(1);await expect(page.locator('.catalog-layout .product-card')).toContainText('রোজ মিউজ');
});

test('perfume removes the anatomy section while collection links and product note diagrams remain usable',async({page})=>{
 await page.goto('/perfume');await expect(page.getByText('THE ANATOMY OF A SCENT',{exact:true})).toHaveCount(0);await expect(page.locator('.department-section-slot[data-block="story"]')).toHaveCount(0);await expect(page.locator('.perfume-edge-botanicals img')).toHaveCount(2);
 await page.locator('.perfume-text-link').click();await expect(page).toHaveURL(/#department-collections$/);await expect(page.locator('.fragrance-families')).toBeInViewport();
 await page.goto('/perfume/product/perfume-rose');await expect(page.locator('.fragrance-notes [role="tab"]')).toHaveCount(3);await page.getByRole('tab',{name:'হার্ট নোট',exact:true}).click();await expect(page.getByRole('tabpanel',{name:'হার্ট নোট',exact:true})).toContainText('গোলাপ, জুঁই');await expect(page.locator('.fragrance-context')).toContainText('নমুনা');
});

test('the footwear offer strip preserves configured coupon destinations',async({page})=>{
 await page.goto('/sneakers');const offer=page.locator('.footwear-offer-strip a').first();await expect(offer).toContainText('১০% ছাড়');await expect(offer).toHaveAttribute('href',/\/sneakers\/shop\?coupon=/);await offer.click();await expect(page.locator('.coupon-collection-notice')).toBeVisible();await expect(page.locator('.catalog-layout .product-card')).toHaveCount(4);
});

test('disabled fragrance profiles stay hidden on product details and custom category photos survive',async({page})=>{
 await page.goto('/perfume');await page.evaluate(()=>{const products=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);products.find((p:any)=>p.id==='perfume-amber').page.showFragrance=false;localStorage.setItem('nirbhor-v1-products',JSON.stringify(products));const categories=JSON.parse(localStorage.getItem('nirbhor-v1-categories')!);categories.find((c:any)=>c.id==='c-perfume-0').image='/assets/product-p2-v5.webp';localStorage.setItem('nirbhor-v1-categories',JSON.stringify(categories));});await page.reload();await expect(page.locator('.fragrance-family-card>img')).toHaveAttribute('src','/assets/product-p2-v5.webp');await page.goto('/perfume/product/perfume-amber');await expect(page.locator('.fragrance-notes')).toHaveCount(0);
});

for(const width of [320,375,768,1440])test(`the two boutique worlds and their discovery controls fit ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));for(const path of ['/sneakers','/perfume','/perfume/product/perfume-amber']){await page.goto(path);await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);}
 await page.goto('/sneakers');const first=await page.locator('.footwear-hero').boundingBox();await page.locator('.footwear-picker button').nth(1).click();const next=await page.locator('.footwear-hero').boundingBox();expect(Math.abs(next!.height-first!.height)).toBeLessThan(2);expect(errors).toEqual([]);
});
