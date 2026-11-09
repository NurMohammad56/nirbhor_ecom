import {test,expect} from './fixtures';

test('merchant edits profile copy, all note details, uploads and practical information persist on the product',async({page})=>{
 await page.goto('/admin/product-pages?product=perfume-amber');await page.getByRole('tab',{name:'তথ্য ও FAQ',exact:true}).click();
 const fields={
  'সুগন্ধের কার্ডের ছোট শিরোনাম':'আপনার সুগন্ধের গল্প',
  'সুগন্ধের কার্ডের শিরোনাম':'ফুল থেকে কাঠের আবেশ',
  'সুগন্ধের কার্ডের পরিচিতি':'নোটের তথ্য দেখে নিজের পছন্দ বেছে নিন।',
  'টপ নোট - বিস্তারিত ব্যাখ্যা':'শুরুর সিট্রাসের বর্ণনা।',
  'হার্ট নোট':'গোলাপ ও জুঁই',
  'হার্ট নোট - বিস্তারিত ব্যাখ্যা':'হার্ট নোটে ফুলের কোমল আবেশ।\nএটি সম্পাদিত প্রোফাইলের বর্ণনা।',
  'বেস নোট - বিস্তারিত ব্যাখ্যা':'শেষের কাঠের অনুভব।',
  'ঘনত্ব / কনসেনট্রেশন':'Eau de Parfum',
  'কখন মানিয়ে যায়':'বিশেষ দিনের জন্য আপনার পছন্দ অনুযায়ী।',
  'ব্যবহারের পরামর্শ':'প্যাকের নির্দেশনা মেনে ব্যবহার করুন।',
  'প্রোফাইলের ব্যাখ্যা ও তথ্যের উৎস':'প্রস্তুতকারকের তথ্য মিলিয়ে সম্পাদনা করুন।',
 };
 for(const [name,value]of Object.entries(fields))await page.getByLabel(name,{exact:true}).fill(value);
 await page.getByLabel('হার্ট নোট - ছবি আপলোড',{exact:true}).setInputFiles('public/assets/fragrance/botanicals-v2.webp');
 await expect(page.locator('.fragrance-editor-image img')).toHaveAttribute('src',/^data:image\/webp/);
 await page.locator('.page-editor-save').getByRole('button',{name:'পরিবর্তন সেভ করুন',exact:true}).click();
 await page.reload();await page.getByRole('tab',{name:'তথ্য ও FAQ',exact:true}).click();await expect(page.getByLabel('সুগন্ধের কার্ডের শিরোনাম',{exact:true})).toHaveValue(fields['সুগন্ধের কার্ডের শিরোনাম']);
 await page.goto('/perfume/product/perfume-amber');const card=page.locator('.fragrance-notes');await expect(card.locator('h2')).toHaveText(fields['সুগন্ধের কার্ডের শিরোনাম']);await expect(card).toContainText(fields['সুগন্ধের কার্ডের পরিচিতি']);await expect(card).toContainText(fields['কখন মানিয়ে যায়']);await expect(card).toContainText(fields['ব্যবহারের পরামর্শ']);await expect(card).toContainText('Eau de Parfum');
 await card.getByRole('tab',{name:'হার্ট নোট',exact:true}).click();await expect(card.getByRole('tabpanel')).toContainText('হার্ট নোটে ফুলের কোমল আবেশ।');await expect(card.getByRole('tabpanel')).toContainText('গোলাপ ও জুঁই');const image=card.locator('.scent-note-art img');await expect(image).toHaveAttribute('src',/^data:image\/webp/);expect(await image.evaluate((i:HTMLImageElement)=>i.naturalWidth)).toBeLessThanOrEqual(640);
 await page.reload();await card.getByRole('tab',{name:'হার্ট নোট',exact:true}).click();await expect(card.getByRole('tabpanel')).toContainText('হার্ট নোটে ফুলের কোমল আবেশ।');
});

test('merchant can hide note artwork or the entire profile without deleting the saved content',async({page})=>{
 await page.goto('/admin/product-pages?product=perfume-rose');await page.getByRole('tab',{name:'তথ্য ও FAQ',exact:true}).click();await page.getByLabel('নোটের ছবি দেখান',{exact:true}).uncheck();await page.locator('.page-editor-save').getByRole('button',{name:'পরিবর্তন সেভ করুন',exact:true}).click();
 await page.goto('/perfume/product/perfume-rose');await expect(page.locator('.fragrance-notes')).toBeVisible();await expect(page.locator('.scent-note-art')).toHaveCount(0);await page.getByRole('tab',{name:'হার্ট নোট',exact:true}).click();await expect(page.locator('.fragrance-notes').getByRole('tabpanel')).toContainText('গোলাপ, জুঁই');
 await page.goto('/admin/product-pages?product=perfume-rose');await page.getByRole('tab',{name:'তথ্য ও FAQ',exact:true}).click();await page.getByLabel('সুগন্ধের নোট দেখান',{exact:true}).uncheck();await page.locator('.page-editor-save').getByRole('button',{name:'পরিবর্তন সেভ করুন',exact:true}).click();await page.goto('/perfume/product/perfume-rose');await expect(page.locator('.fragrance-notes')).toHaveCount(0);
});

test('unknown notes do not receive unrelated botanical artwork and empty profiles do not create blank cards',async({page})=>{
 await page.goto('/perfume/product/perfume-amber');await page.evaluate(()=>{const items=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);const product=items.find((p:any)=>p.id==='perfume-amber');product.page={...product.page,fragranceTopNotes:'Rain / Mineral',fragranceHeartNotes:'',fragranceBaseNotes:''};localStorage.setItem('nirbhor-v1-products',JSON.stringify(items));});await page.reload();await expect(page.locator('.fragrance-notes').getByRole('tabpanel')).toContainText('Rain / Mineral');await expect(page.locator('.scent-note-art')).toHaveCount(0);await expect(page.getByRole('tab',{name:'হার্ট নোট',exact:true})).toBeDisabled();
 await page.evaluate(()=>{const items=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);items.find((p:any)=>p.id==='perfume-amber').page.fragranceTopNotes='';localStorage.setItem('nirbhor-v1-products',JSON.stringify(items));});await page.reload();await expect(page.locator('.fragrance-notes')).toHaveCount(0);
});

for(const width of [320,375,768,1024,1440])test(`fragrance profile and its editor fit ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const path of ['/perfume/product/perfume-amber','/perfume/product/perfume-rose','/perfume/product/perfume-noir','/admin/product-pages?product=perfume-amber']){
  await page.goto(path);if(path.startsWith('/admin'))await page.getByRole('tab',{name:'তথ্য ও FAQ',exact:true}).click();else{await page.getByRole('tab',{name:'হার্ট নোট',exact:true}).click();await expect(page.locator('.fragrance-notes').getByRole('tabpanel')).toBeVisible();}
  await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
 }expect(errors).toEqual([]);
});
