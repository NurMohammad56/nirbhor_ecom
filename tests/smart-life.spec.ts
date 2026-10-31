import { test, expect } from "@playwright/test";
import { bn } from "../src/bn";

test("Smart Life joins discovery, navigation, scoped collections and English product search", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('.brand-department-card[href="/smart-life"]')).toContainText("স্মার্ট লাইফ");
  await expect(page.locator('.cinema-scene')).toHaveCount(9);
  await page.locator('.brand-nav').getByRole('link', { name: 'স্মার্ট লাইফ', exact: true }).click();
  await expect(page).toHaveURL('/smart-life');
  await expect(page.locator('html')).toHaveAttribute('data-department','smart-life');
  await expect(page.locator('.department-hero h1')).toContainText('প্রতিদিন একটু সহজ।');
  await expect(page.locator('.department-collection-section .category-rail-card')).toHaveCount(5);
  await expect(page.locator('.department-product-grid .product-card')).toHaveCount(12);
  await expect(page.locator('.top-selling-section .product-rail-window')).toHaveAttribute('data-interval','3000');
  await expect(page.locator('.department-smart-life .ambient-art,.department-smart-life .editorial-botanical')).toHaveCount(0);
  await page.goto('/smart-life/shop?subcategory='+encodeURIComponent('রান্নাঘরের সহায়ক'));
  await expect(page.locator('.catalog-layout .product-card')).toHaveCount(5);
  await page.goto('/smart-life/shop?q='+encodeURIComponent('সেন্সর'));
  await expect(page.locator('.catalog-layout .product-card')).toHaveCount(1);
  await expect(page.locator('.catalog-layout .product-card')).toContainText('এলইডি লাইট');
  await page.getByRole('textbox',{name:bn('Search products'),exact:true}).fill('Ultrasonic Cleaning Machine');
  await expect(page.locator('.search-popover .search-item')).toHaveCount(1);
  await page.locator('.search-popover .search-item').click();
  await expect(page).toHaveURL('/smart-life/product/smart-ultrasonic-cleaner');
  await expect(page.locator('.product-purchase h1')).toHaveText('আল্ট্রাসনিক ক্লিনিং মেশিন');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',/smart-life-ultrasonic-cleaner-v1.webp$/);
});

test("Smart Life migration adds once and preserves merchant changes, customer data and later removals", async ({ page }) => {
  await page.goto('/smart-life');
  await page.evaluate(() => {
    const products=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);
    const lint=products.find((p:any)=>p.id==='smart-lint-remover'); lint.price=1777; lint.description='আমাদের নিজস্ব পণ্যের তথ্য।';
    products.find((p:any)=>p.id==='p1').price=999;
    localStorage.setItem('nirbhor-v1-products',JSON.stringify(products.filter((p:any)=>!p.id.startsWith('smart-')||p.id==='smart-lint-remover')));
    const categories=JSON.parse(localStorage.getItem('nirbhor-v1-categories')!);
    const parent=categories.find((c:any)=>c.id==='c-smart-life');parent.experience.heroTitle='আমাদের পছন্দের স্মার্ট আয়োজন';
    localStorage.setItem('nirbhor-v1-categories',JSON.stringify(categories.filter((c:any)=>!c.id.startsWith('c-smart-life-'))));
    const banners=JSON.parse(localStorage.getItem('nirbhor-v1-banners')!); banners[0].title='আমাদের হোমপেজের লেখা';
    localStorage.setItem('nirbhor-v1-banners',JSON.stringify(banners.filter((b:any)=>b.id!=='smart-life-v1')));
    localStorage.setItem('nirbhor-v1-cart',JSON.stringify([{id:'p2',variant:'250g',quantity:2}]));
    for(const key of ['products','categories','banners'])localStorage.removeItem('nirbhor-smart-life-v1-'+key);
  });
  await page.reload(); await page.reload();
  let state=await page.evaluate(()=>({ products:JSON.parse(localStorage.getItem('nirbhor-v1-products')!), categories:JSON.parse(localStorage.getItem('nirbhor-v1-categories')!), banners:JSON.parse(localStorage.getItem('nirbhor-v1-banners')!), cart:JSON.parse(localStorage.getItem('nirbhor-v1-cart')!) }));
  expect(state.products).toHaveLength(55);
  expect(state.products.find((p:any)=>p.id==='smart-lint-remover')).toMatchObject({price:1777,description:'আমাদের নিজস্ব পণ্যের তথ্য।'});
  expect(state.products.find((p:any)=>p.id==='p1').price).toBe(999);
  expect(state.categories.filter((c:any)=>c.id.startsWith('c-smart-life'))).toHaveLength(6);
  expect(state.categories.find((c:any)=>c.id==='c-smart-life').experience.heroTitle).toBe('আমাদের পছন্দের স্মার্ট আয়োজন');
  expect(state.banners.filter((b:any)=>b.id==='smart-life-v1')).toHaveLength(1);
  expect(state.banners[0].title).toBe('আমাদের হোমপেজের লেখা');
  expect(state.cart).toEqual([{id:'p2',variant:'250g',quantity:2}]);
  await page.evaluate(()=>{
    for(const [key,id] of [['products','smart-heat-sealer'],['categories','c-smart-life-4'],['banners','smart-life-v1']]){
      localStorage.setItem('nirbhor-v1-'+key,JSON.stringify(JSON.parse(localStorage.getItem('nirbhor-v1-'+key)!).filter((x:any)=>x.id!==id)));
    }
  });
  await page.reload();
  state=await page.evaluate(()=>({ products:JSON.parse(localStorage.getItem('nirbhor-v1-products')!), categories:JSON.parse(localStorage.getItem('nirbhor-v1-categories')!), banners:JSON.parse(localStorage.getItem('nirbhor-v1-banners')!), cart:JSON.parse(localStorage.getItem('nirbhor-v1-cart')!) }));
  expect(state.products).toHaveLength(54);
  expect(state.categories.some((c:any)=>c.id==='c-smart-life-4')).toBe(false);
  expect(state.banners.some((b:any)=>b.id==='smart-life-v1')).toBe(false);
});

test("Smart Life purchases use the shared checkout and reserve the selected product stock", async ({ page }) => {
  await page.goto('/smart-life/product/smart-lint-remover');
  await expect(page.locator('.product-purchase h1')).toHaveText('রিচার্জেবল ফ্যাব্রিক লিন্ট রিমুভার');
  await expect(page.locator('.product-description')).toContainText('প্রিয় সোয়েটার');
  await page.getByRole('button',{name:bn('Add to your bag'),exact:true}).click();
  await page.getByRole('button',{name:bn('Continue to checkout'),exact:true}).click();
  await expect(page.getByTestId('order-total')).toHaveText(bn('৳1,550'));
  await expect(page.locator('html')).toHaveAttribute('data-department','main');
  await page.getByLabel(bn('Full name'),{exact:true}).fill('স্মার্ট লাইফ ক্রেতা');
  await page.getByLabel(bn('Mobile number'),{exact:true}).fill('01711223344');
  await page.getByLabel(bn('Full delivery address')).fill('বাসা ১২, ধানমন্ডি, ঢাকা');
  await page.getByRole('checkbox').last().check();
  await page.getByRole('button',{name:/অর্ডার দিন/}).click();
  await expect(page).toHaveURL(/order-success/);
  const data=await page.evaluate(()=>({ order:JSON.parse(localStorage.getItem('nirbhor-v1-orders')!)[0], products:JSON.parse(localStorage.getItem('nirbhor-v1-products')!) }));
  expect(data.order).toMatchObject({subtotal:1490,shipping:60,total:1550});
  expect(data.order.items[0]).toMatchObject({id:'smart-lint-remover',variant:'১টি',quantity:1,unitPrice:1490});
  expect(data.products.find((p:any)=>p.id==='smart-lint-remover').stock).toBe(19);
});

test("admin can edit Smart Life identity and sections and disable its navigation entry", async ({ page }) => {
  await page.goto('/admin/experiences');
  await page.getByRole('button',{name:'স্মার্ট লাইফ',exact:true}).click();
  await page.getByLabel(bn('Hero headline'),{exact:true}).fill('প্রয়োজনের কাজে, নিজের পছন্দ।');
  await page.getByLabel(bn('Accent colour'),{exact:true}).fill('#265d70');
  await page.getByRole('button',{name:bn('Save changes'),exact:true}).click();
  await page.goto('/smart-life');
  await expect(page.locator('.department-hero h1')).toHaveText('প্রয়োজনের কাজে, নিজের পছন্দ।');
  expect(await page.locator('html').evaluate(el=>el.style.getPropertyValue('--green'))).toBe('#265d70');
  await page.goto('/admin/sections?category=c-smart-life');
  await page.getByRole('button',{name:'সেকশন যোগ করুন',exact:true}).click();
  await page.getByLabel('সেকশনের শিরোনাম',{exact:true}).fill('ডেস্কের ছোট্ট সহায়ক');
  await page.getByLabel('মিনি ডেস্কটপ ভ্যাকুয়াম ক্লিনার সেকশনে রাখুন',{exact:true}).check();
  await page.getByRole('button',{name:'সেকশন সেভ করুন',exact:true}).click();
  await page.goto('/smart-life');
  await expect(page.locator('.category-custom-section')).toContainText('ডেস্কের ছোট্ট সহায়ক');
  await page.goto('/admin/experiences');
  await page.getByRole('button',{name:'স্মার্ট লাইফ',exact:true}).click();
  await page.getByRole('switch',{name:new RegExp(bn('Department landing is enabled'))}).uncheck();
  await page.getByRole('button',{name:bn('Save changes'),exact:true}).click();
  await page.goto('/');
  await expect(page.locator('.brand-nav a[href="/smart-life"],.brand-department-card[href="/smart-life"]')).toHaveCount(0);
  await expect(page.locator('.cinema-scene')).toHaveCount(8);
  await page.goto('/smart-life');
  await expect(page.locator('.department-hero')).toHaveCount(0);
});
