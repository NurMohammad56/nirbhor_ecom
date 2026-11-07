import {test,expect} from './fixtures';
import {bn} from '../src/lib/bn';

test('each department has three generated campaign backgrounds, real product picks and working feature links',async({page})=>{
  for(const slug of ['organic','beauty','fashion','home-living','smart-life','sneakers','watches','tech']){
    await page.goto('/'+slug);const hero=page.locator('.category-campaign-hero');
    const photos=await hero.locator('.cinema-scene img').evaluateAll(images=>images.map(image=>(image as HTMLImageElement).getAttribute('src')));
    expect(photos).toHaveLength(3);expect(new Set(photos).size).toBe(3);
    expect(photos.filter(src=>src?.startsWith('/assets/campaign-'+slug+'-'))).toHaveLength(3);
    await expect(hero.locator('.hero-product-pick').first()).toBeVisible();
    const picks=await hero.locator('.hero-product-pick').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
    expect(picks.every(href=>new RegExp('^/'+slug+'/(product|campaign)/').test(href||''))).toBe(true);
    await hero.locator('.cinema-arrows button').last().click();
    await expect(hero).toHaveClass(/creative-campaign/);await expect(hero).not.toHaveClass(/creative-spotlight/);
    await expect(hero.locator('.cinema-scene.is-active img')).toHaveAttribute('src',`/assets/campaign-${slug}-feature-v1.webp`);
    await expect.poll(()=>hero.locator('.cinema-scene.is-active img').evaluate(image=>(image as HTMLImageElement).naturalWidth)).toBeGreaterThan(1000);
    await expect(hero.locator('.hero-feature-price')).toHaveCount(0);
    const href=await hero.locator('.offer-slide-cta').getAttribute('href');expect(href).toMatch(new RegExp('^/'+slug+'/product/'));
    await hero.locator('.offer-slide-cta').click();await expect(page).toHaveURL(href!);
  }
});

test('new-arrival claims follow the catalogue badge and an unavailable product is never featured',async({page})=>{
  await page.goto('/organic');const hero=page.locator('.category-campaign-hero');
  await hero.locator('.cinema-arrows button').last().click();await expect(hero.locator('.offer-slide-saving')).toHaveText('নতুন এসেছে');
  await expect(hero.locator('h1')).toHaveText('হারবাল মর্নিং টি');
  await page.evaluate(()=>{const products=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);products.find((p:any)=>p.id==='p4').stock=0;localStorage.setItem('nirbhor-v1-products',JSON.stringify(products));});
  await page.reload();await hero.locator('.cinema-arrows button').last().click();await expect(hero.locator('.offer-slide-saving')).toHaveText('কালেকশন ফিচার');await expect(hero.locator('h1')).not.toHaveText('হারবাল মর্নিং টি');
});

test('each campaign keeps its own editable image, separate from the static category photo',async({page})=>{
  await page.goto('/admin/banners');await page.locator('.offer-banner-admin-toolbar select').selectOption('organic');
  await page.locator('.offer-banner-admin-card').nth(2).getByRole('button',{name:'ব্যানার সম্পাদনা',exact:true}).click();
  await page.getByRole('dialog').getByLabel(bn('Hero image URL'),{exact:true}).fill('/assets/spice-cumin-v1.webp');
  await page.getByRole('dialog').getByRole('button',{name:'পরিবর্তন সেভ করুন',exact:true}).click();
  await page.goto('/organic');const hero=page.locator('.category-campaign-hero');
  await expect(hero.locator('.cinema-scene.is-active img')).toHaveAttribute('src','/assets/campaign-organic-offer-v1.webp');
  await hero.locator('.cinema-arrows button').last().click();await hero.locator('.cinema-arrows button').last().click();
  await expect(hero.locator('.cinema-scene.is-active img')).toHaveAttribute('src','/assets/spice-cumin-v1.webp');
});

for(const width of [320,390])test(`category campaigns fit ${width}px without copy or image overlaps`,async({page})=>{
  await page.setViewportSize({width,height:844});
  for(const slug of ['organic','beauty','fashion','home-living','smart-life','sneakers','watches','tech']){
    await page.goto('/'+slug);const hero=page.locator('.category-campaign-hero');
    await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
    const copy=(await hero.locator('.offer-slide-copy').boundingBox())!,art=(await hero.locator('.offer-slider-art').boundingBox())!;
    expect(copy.y+copy.height).toBeLessThanOrEqual(art.y+20);
    await hero.locator('.cinema-arrows button').last().click();await expect(hero.locator('.offer-slide-cta')).toBeVisible();
  }
});
