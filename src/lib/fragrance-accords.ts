import type {Product} from '@/data/catalog';
export const accordTones={woody:{name:'কাঠের ঘ্রাণ',color:'#a17551'},amber:{name:'অ্যাম্বার',color:'#bd9147'},floral:{name:'ফুলেল',color:'#bd7a91'},fresh:{name:'সতেজ',color:'#5f997c'},citrus:{name:'সিট্রাস',color:'#a09942'},spicy:{name:'মসলাদার',color:'#aa6447'},musk:{name:'মাস্ক',color:'#8a8195'},aquatic:{name:'জলীয়',color:'#5d94ab'}} as const;
export type FragranceAccord={name:string;strength:number;tone:keyof typeof accordTones};
export function validAccords(items:FragranceAccord[]){return items.filter(a=>a.name.trim()).map(a=>({...a,strength:Math.max(0,Math.min(100,Number(a.strength)||0)),tone:a.tone in accordTones?a.tone:'woody' as const}));}
/** Demonstration weights are only used for the existing explicitly labelled sample products. */
export function sampleFragranceAccords(p:Product):FragranceAccord[]{
 if(!p.page?.fragranceSample)return [];
 const samples:Record<string,FragranceAccord[]>={
  'perfume-amber':[{name:'উডি',strength:90,tone:'woody'},{name:'অ্যাম্বার',strength:78,tone:'amber'},{name:'মৃদু মসলাদার',strength:62,tone:'spicy'},{name:'ফুলেল',strength:46,tone:'floral'},{name:'সিট্রাস',strength:32,tone:'citrus'}],
  'perfume-rose':[{name:'ফুলেল',strength:92,tone:'floral'},{name:'সতেজ',strength:73,tone:'fresh'},{name:'মাস্ক',strength:58,tone:'musk'},{name:'উডি',strength:37,tone:'woody'}],
  'perfume-noir':[{name:'সতেজ',strength:92,tone:'fresh'},{name:'সিট্রাস',strength:80,tone:'citrus'},{name:'উডি',strength:66,tone:'woody'},{name:'অ্যাম্বার',strength:42,tone:'amber'}],
 };return samples[p.id]||[];
}
