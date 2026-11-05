import {test,expect} from '@playwright/test';
import {bn} from '../src/lib/bn';
test.beforeEach(async({page})=>{await page.addInitScript(()=>{const content=JSON.parse(localStorage.getItem('nirbhor-v1-content')||'{}');content['welcome-offer-popup']=JSON.stringify({version:2,items:[]});localStorage.setItem('nirbhor-v1-content',JSON.stringify(content));});});

test('selected parent contains its children before the next parent and child filters toggle correctly',async({page})=>{
 await page.goto('/organic/shop');
 const tree=page.locator('aside .category-filter-tree'),branch=tree.locator('.category-filter-branch').filter({has:page.getByRole('checkbox',{name:/অর্গানিক খাবার/})});
 const child=branch.getByRole('checkbox',{name:bn('Nuts & Seeds'),exact:true});
 await expect(child).toBeVisible();
 const childBox=await child.boundingBox(),nextBox=await tree.getByRole('checkbox',{name:/ঘর ও জীবন/}).boundingBox();
 expect(childBox!.y).toBeLessThan(nextBox!.y);
 await child.click();await expect(page).toHaveURL(/subcategory=/);await expect(child).toBeChecked();
 await expect(page.locator('.product-name').first()).toContainText(bn('Premium Mixed Nuts'));
 await child.click();await expect(page).not.toHaveURL(/subcategory=/);await expect(child).not.toBeChecked();
 const button=branch.getByRole('button',{name:/উপক্যাটাগরি লুকান/});await button.click();await expect(child).toBeHidden();
 await branch.getByRole('button',{name:/উপক্যাটাগরি দেখুন/}).click();await expect(child).toBeVisible();
});

test('a child under a different parent switches department and stays grouped',async({page})=>{
 await page.goto('/organic/shop');
 const tree=page.locator('aside .category-filter-tree');
 await tree.getByRole('button',{name:/বিউটি ও যত্ন - উপক্যাটাগরি দেখুন/}).click();
 await expect(tree.locator('.category-filter-expand[aria-expanded="true"]')).toHaveCount(1);
 await expect(tree.getByRole('checkbox',{name:bn('Nuts & Seeds'),exact:true})).toBeHidden();
 const beauty=tree.locator('.category-filter-branch').filter({has:page.getByRole('checkbox',{name:/বিউটি ও যত্ন/})});
 const child=beauty.locator('.category-filter-children input').first();
 const label=await child.locator('..').textContent();
 await child.click();await expect(page).toHaveURL(/\/beauty\/shop\?/);
 await expect(page.locator('aside .category-filter-tree').getByRole('checkbox',{name:label!.trim(),exact:true})).toBeChecked();
 await tree.getByRole('checkbox',{name:/অর্গানিক খাবার/}).click();
 await expect(page).toHaveURL(/\/organic\/shop$/);
 await expect(tree.locator('.category-filter-expand[aria-expanded="true"]')).toHaveCount(1);
 await expect(tree.getByRole('checkbox',{name:bn('Nuts & Seeds'),exact:true})).toBeVisible();
 await expect(tree.getByRole('checkbox',{name:label!.trim(),exact:true})).toBeHidden();
});

test('gallery summary uses admin facts and jumps to real product sections',async({page})=>{
 await page.goto('/product/p2');const summary=page.getByRole('region',{name:'পণ্য এক নজরে'});
 await expect(summary).toBeVisible();await expect(summary).toContainText('২৫০');
 const facts=await summary.locator('dd').allTextContents();expect(facts.length).toBeGreaterThan(1);
 const thumb=await page.locator('.gallery-thumbnails').boundingBox(),box=await summary.boundingBox();
 expect(box!.y-thumb!.y-thumb!.height).toBeLessThan(30);
 await summary.getByRole('button',{name:'পণ্যের বিস্তারিত'}).click();
 await expect(page.locator('[data-product-section="details"]')).toBeInViewport();
 await expect(page.locator('[data-product-section="details"] h2').first()).toBeFocused();
 await page.goto('/sneakers/product/sneaker-court');
 await page.getByRole('button',{name:new RegExp(bn('EU 42'))}).click();
 await expect(page.locator('.product-gallery-summary dd').first()).toHaveText(bn('EU 42'));
});

test('mobile shows buying controls before summary and grouped filters fit the viewport',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/product/p2');
 const purchase=await page.locator('.product-purchase').boundingBox(),summary=await page.locator('.product-gallery-summary').boundingBox();
 expect(summary!.y).toBeGreaterThanOrEqual(purchase!.y+purchase!.height);
 await page.goto('/organic/shop');await page.getByRole('button',{name:new RegExp(bn('Filters'))}).first().click();
 await expect(page.getByRole('checkbox',{name:bn('Nuts & Seeds'),exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('a direct subcategory link expands its parent and filters the right products',async({page})=>{
 await page.goto('/shop?subcategory=Nuts+%26+Seeds');
 const tree=page.locator('aside .category-filter-tree');
 await expect(tree.getByRole('checkbox',{name:bn('Nuts & Seeds'),exact:true})).toBeChecked();
 await expect(tree.getByRole('checkbox',{name:/অর্গানিক খাবার/})).toBeChecked();
 await expect(page.locator('.product-name').first()).toContainText(bn('Premium Mixed Nuts'));
});
