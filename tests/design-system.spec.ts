import {test,expect} from './fixtures';

test('department gallery is keyboard operable and links selected catalogue products',async({page})=>{
 await page.goto('/');const gallery=page.locator('.department-gallery');await gallery.scrollIntoViewIfNeeded();
 const tabs=gallery.getByRole('tab');await expect(tabs).toHaveCount(9);
 const current=gallery.locator('[role=tab][aria-selected=true]');await current.focus();await page.keyboard.press('Home');
 await expect(tabs.first()).toBeFocused();await expect(tabs.first()).toHaveAttribute('aria-selected','true');
 await page.keyboard.press('End');await expect(tabs.last()).toBeFocused();await expect(gallery.getByRole('tabpanel')).toBeVisible();
 await gallery.getByRole('tab',{name:'টেক',exact:true}).click();const picks=gallery.locator('.world-product-picker button');
 await picks.last().click();await expect(picks.last()).toHaveAttribute('aria-pressed','true');
 const href=await gallery.locator('.world-action').getAttribute('href');expect(href).toContain('/product/');
 await gallery.locator('.world-action').click();await expect(page).toHaveURL(new RegExp(href!+'$'));await expect(page.locator('.product-detail')).toBeVisible();
});

test('fragrance note tabs support keyboard navigation and skip missing merchant notes',async({page})=>{
 await page.goto('/perfume/product/perfume-amber');const tabs=page.locator('.scent-layer-tabs');
 await tabs.getByRole('tab').first().focus();await page.keyboard.press('ArrowRight');await expect(tabs.getByRole('tab').nth(1)).toBeFocused();
 await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected','true');await page.keyboard.press('End');await expect(tabs.getByRole('tab').last()).toBeFocused();
 await page.evaluate(()=>{const items=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);const p=items.find((p:any)=>p.id==='perfume-amber');p.page={...p.page,fragranceTopNotes:'',fragranceHeartNotes:'',fragranceBaseNotes:'Cedar'};localStorage.setItem('nirbhor-v1-products',JSON.stringify(items));});
 await page.reload();await expect(page.locator('.scent-layer-tabs [aria-selected=true]')).toHaveText('বেস নোট');await expect(page.locator('.scent-layer-panel h3')).toHaveText('Cedar');
});

test('hidden departments and disabled editorial sections stay under merchant control',async({page})=>{
 await page.goto('/');await page.evaluate(()=>{const cats=JSON.parse(localStorage.getItem('nirbhor-v1-categories')!);cats.find((c:any)=>c.id==='c-tech').active=false;localStorage.setItem('nirbhor-v1-categories',JSON.stringify(cats));});await page.reload();
 await expect(page.locator('.department-gallery').getByRole('tab',{name:'টেক',exact:true})).toHaveCount(0);
 await expect(page.locator('.department-gallery [role=tab][aria-selected=true]')).toHaveCount(1);
});

test('editorial redesign retains merchant-written story title and description',async({page})=>{
 await page.goto('/tech');await page.evaluate(()=>{const cats=JSON.parse(localStorage.getItem('nirbhor-v1-categories')!);const tech=cats.find((c:any)=>c.id==='c-tech');tech.experience={...tech.experience,storyTitle:'নিজের কাজের আয়োজন',storyText:'পণ্যের তথ্য দেখে নিজের সেটআপ সাজান।'};localStorage.setItem('nirbhor-v1-categories',JSON.stringify(cats));});await page.reload();
 await expect(page.locator('.world-editorial-copy h2')).toHaveText('নিজের কাজের আয়োজন');await expect(page.locator('.world-editorial-copy>p')).toHaveText('পণ্যের তথ্য দেখে নিজের সেটআপ সাজান।');
});

test('responsive stock photography loads a real small file while custom image URLs stay intact',async({page})=>{
 await page.setViewportSize({width:375,height:950});await page.goto('/organic/shop');const image=page.locator('.product-card .product-photo img').first();await image.scrollIntoViewIfNeeded();
 await expect(image).toHaveAttribute('srcset',/\/assets\/responsive\//);await expect.poll(()=>image.evaluate((el:HTMLImageElement)=>el.naturalWidth)).toBeGreaterThan(0);
 expect(await image.evaluate((el:HTMLImageElement)=>el.currentSrc)).toContain('/assets/responsive/');
 const original=(await image.getAttribute('src'))!;const custom=original+'?merchant=1';
 await page.evaluate(({original,custom})=>{const items=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);const p=items.find((p:any)=>p.image===original);p.image=custom;localStorage.setItem('nirbhor-v1-products',JSON.stringify(items));},{original,custom});await page.reload();
 const edited=page.locator('.product-card img').filter({visible:true}).first();await expect(edited).toHaveAttribute('src',custom);expect(await edited.getAttribute('srcset')).toBeNull();
});

for(const width of [320,375,768])test(`header search and the stable offer hero do not overlap at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:950});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 const header=await page.locator('.brand-site-header').boundingBox(),hero=page.locator('.home-offer-slider');const first=(await hero.boundingBox())!;
 expect(first.y).toBeGreaterThanOrEqual(header!.y+header!.height-1);
 await hero.locator('.cinema-arrows button').last().click();await expect(hero.locator('.cinema-scene.is-active img')).toBeVisible();
 const next=(await hero.boundingBox())!;expect(Math.abs(next.height-first.height)).toBeLessThan(2);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
});
