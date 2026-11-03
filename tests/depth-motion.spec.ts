import {test,expect} from '@playwright/test';

test('editorial images respond to scrolling while their shopping copy remains stable',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
  const card=page.locator('.collection-story').first();
  await card.evaluate(el=>window.scrollTo({top:scrollY+el.getBoundingClientRect().top-180,behavior:'instant'}));
  await expect(card).toHaveAttribute('data-depth-active','true');
  await expect(page.locator('.collection-stories')).toHaveCSS('transform','none');
  const first=await card.evaluate(el=>parseFloat(el.style.getPropertyValue('--depth-y')));
  const before=(await card.locator('.collection-story-copy').boundingBox())!.y;
  await page.evaluate(()=>window.scrollBy({top:120,behavior:'instant'}));
  await expect.poll(()=>card.evaluate(el=>parseFloat(el.style.getPropertyValue('--depth-y')))).toBeGreaterThan(first+2);
  const after=await card.evaluate(el=>parseFloat(el.style.getPropertyValue('--depth-y')));
  expect(Math.abs(after)).toBeLessThanOrEqual(18);
  expect(Math.abs(before-(await card.locator('.collection-story-copy').boundingBox())!.y-120)).toBeLessThan(2);
  await card.click();await expect(page).toHaveURL('/fashion');
  await expect(page.locator('.department-offer-slider')).not.toHaveAttribute('data-depth-active','true');
  await expect(page.locator('.department-offer-slider .offer-slide-cta')).toBeVisible();
});

test('reduced motion changes reset depth and preserve manual hero navigation',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
  const hero=page.locator('.cinematic-shell');await expect(hero).not.toHaveAttribute('data-depth-active','true');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(hero).not.toHaveAttribute('data-depth-active','true');
  expect(await hero.evaluate(el=>el.style.getPropertyValue('--depth-y'))).toBe('');
  await page.locator('.collection-stories').scrollIntoViewIfNeeded();
  expect(await page.locator('.collection-story-media').first().evaluate(el=>getComputedStyle(el).transform)).toBe('none');
  await expect(page.locator('.cinema-arrows button')).toHaveCount(2);
  await page.locator('.cinematic-shell').scrollIntoViewIfNeeded();await page.locator('.cinema-arrows button').last().click();
  await expect(page.locator('.brand-hero-actions .btn')).toBeVisible();
});

test('featured collections respect saved category imagery and disabled departments',async({page})=>{
  await page.goto('/');
  await page.evaluate(()=>{
    const categories=JSON.parse(localStorage.getItem('nirbhor-v1-categories')!);
    categories.find((c:any)=>c.id==='c-tech').experience.heroImage='/assets/tech-keyboard-v1.webp';
    const fashion=categories.find((c:any)=>c.id==='c-fashion');fashion.experience={...(fashion.experience||{}),enabled:false};
    localStorage.setItem('nirbhor-v1-categories',JSON.stringify(categories));
  });
  await page.reload();
  await expect(page.locator('.collection-story')).toHaveCount(3);
  await expect(page.locator('.collection-story[href="/fashion"]')).toHaveCount(0);
  await expect(page.locator('.collection-story[href="/tech"] img')).toHaveAttribute('src','/assets/tech-keyboard-v1.webp');
});

test.describe('touch depth policy',()=>{
  test.use({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  test('photographs stay still and collection links remain usable on a phone',async({page})=>{
    await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
    await page.locator('.collection-stories').scrollIntoViewIfNeeded();
    const card=page.locator('.collection-story[href="/tech"]');await card.scrollIntoViewIfNeeded();
    await expect(page.locator('[data-depth-active="true"]')).toHaveCount(0);
    expect(await card.locator('.collection-story-media').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
    await card.tap();await expect(page).toHaveURL('/tech');
  });
});
