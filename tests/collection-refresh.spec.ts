import { test, expect } from '@playwright/test';
import { bn } from '../src/bn';

test('watch audience collections filter independently and merchants can reassign a product',async({page})=>{
  await page.goto('/watches');
  const cards=page.locator('.department-collection-section .category-rail-card');
  await expect(cards).toHaveCount(2);
  await cards.getByText('নারীদের ঘড়ি',{exact:true}).click();
  await expect(page.locator('.catalog-layout .product-name')).toHaveText(['সিলভার স্কোয়ার ঘড়ি','রোজ ডায়াল মেশ ঘড়ি']);
  await page.locator('.subcategory-chips').getByRole('button',{name:'পুরুষদের ঘড়ি',exact:true}).click();
  await expect(page.locator('.catalog-layout .product-name')).toHaveText(['ক্লাসিক মিডনাইট ঘড়ি','হেরিটেজ ট্যান ঘড়ি']);
  await page.goto('/admin/products');
  await page.getByRole('textbox',{name:bn('Search admin products'),exact:true}).fill('রোজ ডায়াল');
  await page.getByRole('button',{name:bn('Edit রোজ ডায়াল মেশ ঘড়ি'),exact:true}).click();
  await page.getByLabel(bn('Subcategory'),{exact:true}).selectOption('পুরুষদের ঘড়ি');
  await page.getByRole('button',{name:bn('Save product'),exact:true}).click();
  await page.goto('/watches/shop?subcategory='+encodeURIComponent('পুরুষদের ঘড়ি'));await page.reload();
  await expect(page.locator('.catalog-layout .product-card')).toHaveCount(3);
  await page.locator('.subcategory-chips').getByRole('button',{name:'নারীদের ঘড়ি',exact:true}).click();
  await expect(page.locator('.catalog-layout .product-name')).toHaveText(['সিলভার স্কোয়ার ঘড়ি']);
});

test('the previous catalogue upgrades without losing merchant prices, custom style products or customer data',async({page})=>{
  await page.goto('/');
  await page.evaluate(()=>{
    const products=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);
    const groups:Record<string,string>={'watch-midnight':'ব্রেসলেট স্টাইল','watch-heritage':'স্ট্র্যাপ স্টাইল','watch-square':'ব্রেসলেট স্টাইল','watch-rose':'মেশ স্টাইল'};
    for(const product of products)if(groups[product.id])product.subcategory=groups[product.id];
    products.find((p:any)=>p.id==='watch-midnight').price=3999;
    products.push({...products.find((p:any)=>p.id==='watch-midnight'),id:'merchant-watch',name:'আমাদের নিজস্ব ঘড়ি'});
    localStorage.setItem('nirbhor-v1-products',JSON.stringify(products));
    const categories=JSON.parse(localStorage.getItem('nirbhor-v1-categories')!).filter((c:any)=>!['c-watches-men','c-watches-women'].includes(c.id));
    for(const [index,name,image]of [[0,'ব্রেসলেট স্টাইল','midnight'],[1,'স্ট্র্যাপ স্টাইল','heritage'],[2,'মেশ স্টাইল','rose']])categories.push({id:`c-watches-${index}`,name,parent:'Watches',description:'ডায়াল থেকে স্ট্র্যাপ, পছন্দের প্রতিটি খুঁটিনাটি।',image:`/assets/style-watch-${image}-v1.webp`,sort:index,active:true});
    const tech=categories.find((c:any)=>c.id==='c-tech');tech.image='/assets/tech-hero-v1.webp';
    tech.experience={...tech.experience,heroImage:'/assets/tech-hero-v1.webp',heroTitle:'কাজে মন দিন।\nগানে হারিয়ে যান।',description:'হেডফোন, ইয়ারবাডস আর ডেস্কের প্রয়োজনীয় অ্যাকসেসরিজ। আপনার কাজ ও অবসরের জন্য খুঁজে নিন নিজের পছন্দ।',accent:'#594188'};
    localStorage.setItem('nirbhor-v1-categories',JSON.stringify(categories));
    const banners=JSON.parse(localStorage.getItem('nirbhor-v1-banners')!);const banner=banners.find((b:any)=>b.id==='tech-v1');banner.image='/assets/tech-hero-v1.webp';banner.title='কাজে মন দিন।\nগানে হারিয়ে যান।';localStorage.setItem('nirbhor-v1-banners',JSON.stringify(banners));
    localStorage.setItem('nirbhor-v1-cart',JSON.stringify([{id:'p2',variant:'250g',quantity:2}]));
    for(const key of ['products','categories','banners'])localStorage.removeItem('nirbhor-collection-refresh-v2-'+key);
  });
  await page.reload();await page.reload();
  const data=await page.evaluate(()=>({p:JSON.parse(localStorage.getItem('nirbhor-v1-products')!),c:JSON.parse(localStorage.getItem('nirbhor-v1-categories')!),b:JSON.parse(localStorage.getItem('nirbhor-v1-banners')!),cart:JSON.parse(localStorage.getItem('nirbhor-v1-cart')!)}));
  expect(data.p.find((p:any)=>p.id==='watch-midnight')).toMatchObject({price:3999,subcategory:'পুরুষদের ঘড়ি'});
  expect(data.p.find((p:any)=>p.id==='merchant-watch').subcategory).toBe('ব্রেসলেট স্টাইল');
  expect(data.c.filter((c:any)=>['c-watches-men','c-watches-women'].includes(c.id))).toHaveLength(2);
  expect(data.c.some((c:any)=>c.id==='c-watches-0')).toBe(true);
  expect(data.c.some((c:any)=>['c-watches-1','c-watches-2'].includes(c.id))).toBe(false);
  expect(data.c.find((c:any)=>c.id==='c-tech').experience).toMatchObject({heroImage:'/assets/tech-hero-v2.webp',heroTitle:'আপনার দিন।\nআপনার টেক।',accent:'#594188'});
  expect(data.b.find((b:any)=>b.id==='tech-v1').image).toBe('/assets/tech-hero-v2.webp');
  expect(data.cart).toEqual([{id:'p2',variant:'250g',quantity:2}]);
});

test('merchant hero overrides, custom watch grouping and later removals survive the update',async({page})=>{
  await page.goto('/');
  await page.evaluate(()=>{
    const categories=JSON.parse(localStorage.getItem('nirbhor-v1-categories')!);const tech=categories.find((c:any)=>c.id==='c-tech');
    tech.experience={...tech.experience,heroImage:'/assets/tech-mouse-v1.webp',heroTitle:'আমাদের টেক কালেকশন',description:'নিজেদের লেখা'};
    localStorage.setItem('nirbhor-v1-categories',JSON.stringify(categories));
    const products=JSON.parse(localStorage.getItem('nirbhor-v1-products')!);products.find((p:any)=>p.id==='watch-rose').subcategory='নিজস্ব ডিজাইন';localStorage.setItem('nirbhor-v1-products',JSON.stringify(products));
    const banners=JSON.parse(localStorage.getItem('nirbhor-v1-banners')!);const banner=banners.find((b:any)=>b.id==='tech-v1');banner.image='/assets/tech-keyboard-v1.webp';banner.title='আমাদের ব্যানার';localStorage.setItem('nirbhor-v1-banners',JSON.stringify(banners));
    for(const key of ['products','categories','banners'])localStorage.removeItem('nirbhor-collection-refresh-v2-'+key);
  });
  await page.goto('/tech');await page.reload();
  await expect(page.locator('.department-immersive-media img')).toHaveAttribute('src','/assets/tech-mouse-v1.webp');
  await expect(page.locator('.department-hero h1')).toHaveText('আমাদের টেক কালেকশন');
  const data=await page.evaluate(()=>({p:JSON.parse(localStorage.getItem('nirbhor-v1-products')!),b:JSON.parse(localStorage.getItem('nirbhor-v1-banners')!)}));
  expect(data.p.find((p:any)=>p.id==='watch-rose').subcategory).toBe('নিজস্ব ডিজাইন');
  expect(data.b.find((b:any)=>b.id==='tech-v1')).toMatchObject({title:'আমাদের ব্যানার',image:'/assets/tech-keyboard-v1.webp'});
  await page.evaluate(()=>{
    localStorage.setItem('nirbhor-v1-products',JSON.stringify(JSON.parse(localStorage.getItem('nirbhor-v1-products')!).filter((p:any)=>p.id!=='watch-rose')));
    localStorage.setItem('nirbhor-v1-categories',JSON.stringify(JSON.parse(localStorage.getItem('nirbhor-v1-categories')!).filter((c:any)=>c.id!=='c-watches-women')));
  });
  await page.reload();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-products')!).some((p:any)=>p.id==='watch-rose'))).toBe(false);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nirbhor-v1-categories')!).some((c:any)=>c.id==='c-watches-women'))).toBe(false);
});
