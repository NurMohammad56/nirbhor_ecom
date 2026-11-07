import {test,expect} from './fixtures';
test('Next dynamic product URLs support newly created browser-local products and refresh',async({page})=>{
 await page.goto('/');await page.locator('.home-offer-layout').waitFor();
 await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);p.push({...p[0],id:'next-local-product',name:'নতুন ডাইনামিক পণ্য',campaign:false,status:'Published'});localStorage.setItem('nirbhor-v1-products',JSON.stringify(p));});
 const response=await page.goto('/product/next-local-product');expect(response?.status()).toBe(200);await expect(page.locator('.product-purchase h1')).toHaveText('নতুন ডাইনামিক পণ্য');await page.reload();await expect(page.locator('.product-purchase h1')).toHaveText('নতুন ডাইনামিক পণ্য');
});
test('Next returns a real 404 for unknown routes and keeps the home route reachable',async({page})=>{
 const response=await page.goto('/missing-next-page/unmatched');expect(response?.status()).toBe(404);await expect(page.getByRole('heading',{name:'পেজটি পাওয়া যায়নি',exact:true})).toBeVisible();await page.getByRole('link',{name:'হোমপেজে ফিরুন',exact:true}).click();await expect(page).toHaveURL('/');await expect(page.locator('.home-offer-layout')).toBeVisible();
});
