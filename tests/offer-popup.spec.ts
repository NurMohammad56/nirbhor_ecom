import {test,expect} from './fixtures';
import {defaultPopup,popupConfigKey} from '../src/lib/offer-popup';
import type {OfferPopupConfig} from '../src/lib/offer-popup';
import {bn} from '../src/lib/bn';

async function setup(page:import('@playwright/test').Page,config:Partial<OfferPopupConfig>={}){
 await page.addInitScript(({key,config})=>{
  if(!localStorage.getItem('popup-test-configured')){const content=JSON.parse(localStorage.getItem('nirbhor-v1-content')||'{}');content[key]=JSON.stringify({version:2,items:[config]});localStorage.setItem('nirbhor-v1-content',JSON.stringify(content));localStorage.setItem('popup-test-configured','yes');}
 },{key:popupConfigKey,config:{...defaultPopup,delay:0,...config}});
}
const popup=(page:import('@playwright/test').Page)=>page.getByRole('dialog',{name:'আপনার জন্য চলতি অফার',exact:true});

test('admin customizes, previews, saves and publishes the visitor popup with a real coupon',async({page,context})=>{
 await setup(page,{enabled:false});
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto('/admin/offer-popup');
 await page.getByLabel('সাইটে অফার পপআপ চালু রাখুন').check();
 await page.getByLabel('পপআপের শিরোনাম',{exact:true}).fill('আপনার পছন্দে চলতি সাশ্রয়');
 await page.getByLabel('পপআপের সহায়ক লেখা').fill('অফারের শর্ত মিলিয়ে আপনার প্রয়োজনের পণ্য বেছে নিন।');
 await page.getByLabel('পপআপ বাটনের লেখা').fill('আমার অফার দেখি');
 await page.getByLabel('পপআপের ছবির লিংক').fill('/assets/campaign-organic-feature-v1.webp');
 await page.getByRole('button',{name:'প্রিভিউ দেখুন',exact:true}).click();
 const preview=page.getByRole('dialog',{name:'অফার পপআপ প্রিভিউ'});
 await expect(preview.getByRole('heading',{name:'আপনার পছন্দে চলতি সাশ্রয়'})).toBeVisible();
 await page.keyboard.press('Escape');
 expect(await page.evaluate(()=>localStorage.getItem('nirbhor-popup-seen-welcome-v1'))).toBeNull();
 await page.getByRole('button',{name:'পপআপ সেভ করুন',exact:true}).click();
 await page.reload();
 await expect(page.getByLabel('পপআপের শিরোনাম',{exact:true})).toHaveValue('আপনার পছন্দে চলতি সাশ্রয়');
 await page.goto('/');
 await expect(popup(page)).toBeVisible();
 await expect(popup(page).locator('.welcome-offer-visual img')).toHaveAttribute('src','/assets/campaign-organic-feature-v1.webp');
 const code=await popup(page).locator('.welcome-offer-code strong').textContent();
 await popup(page).getByRole('button',{name:'পপআপের কুপন কোড কপি করুন'}).click();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(code);
 await popup(page).getByRole('link',{name:'আমার অফার দেখি'}).click();
 await expect(page).toHaveURL(/coupon=/);
 await expect(popup(page)).toHaveCount(0);
});

test('daily frequency prevents repeat popups and a new admin revision allows a new campaign',async({page})=>{
 await setup(page,{frequency:'day'});
 await page.goto('/');await expect(popup(page)).toBeVisible();await page.keyboard.press('Escape');
 await page.reload();await expect(popup(page)).toHaveCount(0);
 await page.goto('/admin/offer-popup');
 await page.getByRole('button',{name:'নতুন করে দেখানোর সংস্করণ'}).click();
 await page.getByRole('button',{name:'পপআপ সেভ করুন',exact:true}).click();
 await page.goto('/');await expect(popup(page)).toBeVisible();
 await popup(page).getByRole('button',{name:'এই সপ্তাহে আর দেখাবেন না'}).click();
 await page.reload();await expect(popup(page)).toHaveCount(0);
 const blocked=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.endsWith('-blocked')).map(k=>Number(localStorage.getItem(k))));
 expect(blocked.some(t=>t>Date.now()+6*86400000)).toBeTruthy();
});

test('category targeting excludes other categories and transactional pages',async({page})=>{
 await setup(page,{scope:'department',departments:['organic']});
 for(const path of ['/admin/offer-popup','/checkout','/cart','/account','/beauty','/']){await page.goto(path);await expect(popup(page)).toHaveCount(0);}
 await page.goto('/organic');await expect(popup(page)).toBeVisible();
});

test('scheduled, expired and inactive offers are not advertised',async({page})=>{
 await setup(page,{start:'2099-01-01T00:00',end:'2099-01-02T00:00'});
 await page.goto('/');await expect(popup(page)).toHaveCount(0);
 await page.goto('/admin/offer-popup');
 await page.getByLabel('শুরুর সময় (বাংলাদেশ)').fill('2020-01-01T00:00');
 await page.getByLabel('শেষের সময় (বাংলাদেশ)').fill('2020-01-02T00:00');
 await page.getByRole('button',{name:'পপআপ সেভ করুন',exact:true}).click();
 await page.goto('/');await expect(popup(page)).toHaveCount(0);
 await page.evaluate(({key})=>{const content=JSON.parse(localStorage.getItem('nirbhor-v1-content')!);const value=JSON.parse(content[key]);value.items[0]={...value.items[0],start:'',end:'',offerId:'missing-expired-offer'};content[key]=JSON.stringify(value);localStorage.setItem('nirbhor-v1-content',JSON.stringify(content));},{key:popupConfigKey});
 await page.reload();await expect(popup(page)).toHaveCount(0);
});

test('keyboard focus stays inside, Escape restores focus and body scrolling',async({page})=>{
 await setup(page,{delay:1});await page.goto('/');
 const origin=page.locator('.brand-site-header a').first();await origin.focus();
 await expect(popup(page)).toBeVisible();
 await page.keyboard.press('Shift+Tab');
 expect(await popup(page).evaluate(el=>el.contains(document.activeElement))).toBeTruthy();
 await page.keyboard.press('Tab');
 await expect(popup(page).getByRole('button',{name:bn('Close dialog'),exact:true})).toBeFocused();
 await expect(page.locator('body')).toHaveCSS('overflow','hidden');
 await page.keyboard.press('Escape');await expect(popup(page)).toHaveCount(0);
 await expect(origin).toBeFocused();await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
});

test('popup waits while customer is using search or shopping bag',async({page})=>{
 await setup(page,{delay:1});await page.goto('/');
 await page.locator('.brand-header-search input').focus();
 await page.waitForTimeout(1500);await expect(popup(page)).toHaveCount(0);
 await page.locator('.brand-header-search input').evaluate(el=>(el as HTMLInputElement).blur());
 await expect(popup(page)).toBeVisible();await page.keyboard.press('Escape');
 await page.goto('/admin/offer-popup');await page.getByRole('button',{name:'নতুন করে দেখানোর সংস্করণ'}).click();await page.getByRole('button',{name:'পপআপ সেভ করুন',exact:true}).click();
 await page.goto('/');await page.getByRole('button',{name:bn('Open shopping bag'),exact:true}).click();
 await page.waitForTimeout(1500);await expect(popup(page)).toHaveCount(0);
 await page.keyboard.press('Escape');await expect(popup(page)).toBeVisible();
});

test('mobile popup fits 320px, scrolls on short screens and respects device controls',async({page})=>{
 await page.setViewportSize({width:320,height:600});await setup(page,{devices:'mobile'});await page.goto('/');
 await expect(popup(page)).toBeVisible();
 await popup(page).getByRole('button',{name:'এখন নয়, কেনাকাটা চালিয়ে যাই'}).scrollIntoViewIfNeeded();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 const box=await popup(page).boundingBox();expect(box!.width).toBeLessThanOrEqual(292);expect(box!.height).toBeLessThanOrEqual(572);
 await expect(popup(page)).toHaveCSS('animation-name','none');
 await page.keyboard.press('Escape');
});

test('admin rejects unsafe destinations and invalid time ranges',async({page})=>{
 await setup(page,{enabled:false});await page.goto('/admin/offer-popup');
 await page.getByLabel('বাটনের লিংক (ঐচ্ছিক)').fill('javascript:alert(1)');
 await page.getByRole('button',{name:'পপআপ সেভ করুন',exact:true}).click();await expect(page.locator('.field-error[role="alert"]')).toContainText('সঠিক পেজ বা https:// লিংক দিন');
 await page.getByLabel('বাটনের লিংক (ঐচ্ছিক)').fill('/offers');
 await page.getByLabel('শুরুর সময় (বাংলাদেশ)').fill('2030-01-02T00:00');await page.getByLabel('শেষের সময় (বাংলাদেশ)').fill('2030-01-01T00:00');
 await page.getByRole('button',{name:'পপআপ সেভ করুন',exact:true}).click();await expect(page.locator('.field-error[role="alert"]')).toContainText('শেষের সময়');
});

test('each new document entry shows again, but internal navigation does not',async({page,context})=>{
 await setup(page,{frequency:'visit',delay:0});await page.goto('/');
 await expect(popup(page)).toBeVisible();
 await expect(popup(page).getByRole('button',{name:'এই সপ্তাহে আর দেখাবেন না'})).toHaveCount(0);
 await page.keyboard.press('Escape');
 await page.locator('.brand-site-header a[href="/offers"]').first().click();
 await expect(page).toHaveURL(/\/offers$/);await expect(popup(page)).toHaveCount(0);
 await page.reload();await expect(popup(page)).toBeVisible();await page.keyboard.press('Escape');
 const second=await context.newPage();await second.goto('/');await expect(popup(second)).toBeVisible();await second.close();
});

test('legacy eight-second daily configuration migrates to a fresh popup within four seconds',async({page})=>{
 await page.addInitScript(({key})=>{localStorage.setItem('nirbhor-v1-content',JSON.stringify({[key]:JSON.stringify({enabled:true,revision:'welcome-v1',delay:8,frequency:'day',scope:'home',title:'আগের ব্যানারের লেখা',offerId:'auto',image:'/assets/brand-world-v5.webp'})}));localStorage.setItem('nirbhor-popup-seen-welcome-v1',String(Date.now()));localStorage.setItem('nirbhor-popup-seen-welcome-v1-blocked',String(Date.now()+86400000));},{key:popupConfigKey});
 await page.goto('/organic');
 await expect(popup(page)).toBeVisible({timeout:4000});
 await expect(popup(page).getByRole('heading',{name:'আগের ব্যানারের লেখা'})).toBeVisible();
 await page.keyboard.press('Escape');await page.reload();await expect(popup(page)).toBeVisible({timeout:4000});
});

test('admin manages multiple popups, ordering and individual redirects without losing drafts',async({page})=>{
 await setup(page,{enabled:false});await page.goto('/admin/offer-popup');
 await page.getByLabel('পপআপের অফার',{exact:true}).selectOption('message');
 await page.getByLabel('পপআপের শিরোনাম',{exact:true}).fill('প্রথম অফার');
 await page.getByLabel('বাটনের লিংক (ঐচ্ছিক)').fill('/organic/shop');
 await page.getByLabel('সাইটে অফার পপআপ চালু রাখুন').check();
 await page.getByRole('button',{name:'নতুন পপআপ',exact:true}).click();
 await page.getByLabel('পপআপের শিরোনাম',{exact:true}).fill('দ্বিতীয় অফার');
 await page.getByLabel('পপআপের অফার',{exact:true}).selectOption('message');
 await page.getByLabel('বাটনের লিংক (ঐচ্ছিক)').fill('https://example.com/deals');
 await page.getByLabel('কত সেকেন্ড পরে',{exact:true}).fill('0');
 await page.getByLabel('সাইটে অফার পপআপ চালু রাখুন').check();
 await page.getByRole('button',{name:'পপআপ ২ উপরে নিন',exact:true}).click();
 await page.getByRole('button',{name:'পপআপ সেভ করুন',exact:true}).click();
 await page.reload();await expect(page.getByLabel('পপআপের শিরোনাম',{exact:true})).toHaveValue('দ্বিতীয় অফার');
 await page.goto('/');await expect(popup(page)).toBeVisible();
 await expect(popup(page).getByRole('heading',{name:'দ্বিতীয় অফার'})).toBeVisible();
 await expect(popup(page).locator('.welcome-offer-cta')).toHaveAttribute('href','https://example.com/deals');
 await popup(page).getByRole('button',{name:'পরের অফার',exact:true}).click();
 await expect(popup(page).getByRole('heading',{name:'প্রথম অফার'})).toBeVisible();
 await popup(page).locator('.welcome-offer-cta').click();await expect(page).toHaveURL(/\/organic\/shop$/);
 await expect(popup(page)).toHaveCount(0);
 await page.goto('/admin/offer-popup');
 await page.getByRole('button',{name:'পপআপ ১ মুছুন',exact:true}).click();
 await page.getByRole('button',{name:'পপআপ ১ মুছুন',exact:true}).click();
 await page.getByRole('button',{name:'পপআপ সেভ করুন',exact:true}).click();
 await page.reload();await expect(page.locator('.popup-campaign-list article')).toHaveCount(0);
 await page.goto('/');await expect(popup(page)).toHaveCount(0);
});
