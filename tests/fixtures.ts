import {test as base,expect} from '@playwright/test';
/** Wait for Next's streamed route and browser-local store before legacy seed assertions. */
export const test=base.extend({page:async({page},use,info)=>{
 if(!info.file.endsWith('offer-popup.spec.ts'))await page.addInitScript(()=>{const content=JSON.parse(localStorage.getItem('nirbhor-v1-content')||'{}');content['welcome-offer-popup']=JSON.stringify({version:2,items:[]});localStorage.setItem('nirbhor-v1-content',JSON.stringify(content));});
 const ready=async()=>{await page.waitForFunction(()=>document.querySelector('#main-content')&&!document.querySelector('.route-loading')&&localStorage.getItem('nirbhor-v1-products'));await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));};
 const goto=page.goto.bind(page),reload=page.reload.bind(page);
 page.goto=async(...args)=>{const response=await goto(...args);if(response?.ok())await ready();return response;};
 page.reload=async(...args)=>{const response=await reload(...args);if(response?.ok())await ready();return response;};
 await use(page);
}});
export {expect};
