"use client";
import type {ProductPageContent} from '@/lib/product-page-content';
import {fragranceLayers} from '@/lib/fragrance-profile';
import HeroImagePicker from '@/features/admin/HeroImagePicker';

export default function FragranceEditor({value,onChange}:{value:ProductPageContent;onChange:(patch:Partial<ProductPageContent>)=>void}){
 return <section className="fragrance-editor page-editor-card">
  <div><h3>পারফিউমের সুগন্ধের প্রোফাইল</h3><p className="muted">প্রতিটি পণ্যের নোট, ব্যাখ্যা ও ছবি আলাদা করে সাজান। প্রস্তুতকারকের তথ্য অনুযায়ী লিখুন।</p></div>
  <div className="fragrance-editor-options">
   <label className="check"><input type="checkbox" checked={value.showFragrance} onChange={e=>onChange({showFragrance:e.target.checked})}/>সুগন্ধের নোট দেখান</label>
   <label className="check"><input type="checkbox" checked={value.fragranceShowNoteImages} onChange={e=>onChange({fragranceShowNoteImages:e.target.checked})}/>নোটের ছবি দেখান</label>
   <label className="check"><input type="checkbox" checked={value.fragranceSample} onChange={e=>onChange({fragranceSample:e.target.checked})}/>নমুনা প্রোফাইল হিসেবে চিহ্নিত করুন</label>
  </div>
  <div className="fragrance-editor-copy">
   {([['fragranceKicker','সুগন্ধের কার্ডের ছোট শিরোনাম'],['fragranceTitle','সুগন্ধের কার্ডের শিরোনাম'],['fragranceIntro','সুগন্ধের কার্ডের পরিচিতি'],['fragranceFamily','ঘ্রাণের ধরন'],['fragranceConcentration','ঘনত্ব / কনসেনট্রেশন']] as const).map(([key,label])=><label className="field" key={key}>{label}<textarea aria-label={label} rows={key==='fragranceIntro'?3:2} value={value[key]} onChange={e=>onChange({[key]:e.target.value})}/></label>)}
  </div>
  <div className="fragrance-editor-layers">{fragranceLayers.map(layer=><fieldset key={layer.id} className="fragrance-editor-layer"><legend>{layer.label}</legend>
   <label className="field">{layer.label}<textarea aria-label={layer.label} rows={2} value={value[layer.notes]} onChange={e=>onChange({[layer.notes]:e.target.value})}/></label>
   <label className="field">{layer.label+' - বিস্তারিত ব্যাখ্যা'}<textarea aria-label={layer.label+' - বিস্তারিত ব্যাখ্যা'} rows={4} value={value[layer.description]} onChange={e=>onChange({[layer.description]:e.target.value})}/></label>
   <HeroImagePicker value={value[layer.image]} label={layer.label+' - ছবির লিংক'} uploadLabel={layer.label+' - ছবি আপলোড'} maxWidth={640} maxHeight={640} onChange={image=>onChange({[layer.image]:image})}/>
   {value[layer.image]&&<div className="fragrance-editor-image"><img src={value[layer.image]} alt={layer.label+' - নির্বাচিত ছবি'}/><button type="button" onClick={()=>onChange({[layer.image]:''})}>নিজের ছবি সরান</button></div>}
   <small>নোট খালি রাখলে ট্যাবটি বন্ধ থাকবে। নিজের ছবি না দিলে মিল থাকা বোটানিক্যাল ছবি দেখাবে।</small>
  </fieldset>)}</div>
  {([['fragranceOccasion','কখন মানিয়ে যায়'],['fragranceUsage','ব্যবহারের পরামর্শ'],['fragranceContext','প্রোফাইলের ব্যাখ্যা ও তথ্যের উৎস']] as const).map(([key,label])=><label className="field" key={key}>{label}<textarea aria-label={label} rows={3} value={value[key]} onChange={e=>onChange({[key]:e.target.value})}/></label>)}
  <p className="fragrance-editor-help">এই পেজের পরিবর্তন সেভ করলে প্রোফাইল আপডেট হবে। ঘ্রাণের বর্ণনা উপাদানের তালিকা নয়; যাচাই করা তথ্য ছাড়া স্থায়িত্ব বা অন্য দাবি যোগ করবেন না।</p>
 </section>;
}
