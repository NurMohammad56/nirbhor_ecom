import type {Product} from '@/data/catalog';
import {productPageContent} from '@/lib/product-page-content';
export const perfumeCollectionHero='/assets/fragrance/aqua-collection-v3.webp';
export const fragranceNotes=[
 {id:'rose',name:'গোলাপ',caption:'কোমল ফুলেল আবেশ',position:0,pattern:/গোলাপ|rose/i},
 {id:'jasmine',name:'জুঁই',caption:'সাদা ফুলের কোমলতা',position:1,pattern:/জুঁই|jasmine/i},
 {id:'bergamot',name:'বার্গামট',caption:'সিট্রাসের সতেজতা',position:2,pattern:/বার্গামট|bergamot/i},
 {id:'wood',name:'কাঠ ও চন্দন',caption:'উষ্ণ, গভীর অনুভব',position:3,pattern:/কাঠ|চন্দন|সিডার|wood|cedar|sandal/i},
];
export function matchesFragranceNote(product:Product,id:string){const note=fragranceNotes.find(n=>n.id===id);if(!note)return true;const p=productPageContent(product);return p.showFragrance&&note.pattern.test([p.fragranceTopNotes,p.fragranceHeartNotes,p.fragranceBaseNotes].join(' '));}
export function fragranceArt(product:Product){const match=product.image.match(/^\/assets\/perfume-(amber|rose|noir)-v1\.webp$/);return match?'/assets/fragrance/'+match[1]+'-v2.webp':product.image;}
