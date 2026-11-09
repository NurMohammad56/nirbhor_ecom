import {accordTones,validAccords} from '@/lib/fragrance-accords';
import type {ProductPageContent} from '@/lib/product-page-content';
export default function FragranceAccords({profile}:{profile:ProductPageContent}){
 const accords=validAccords(profile.fragranceAccords);
 if(!profile.fragranceShowAccords||!accords.length)return null;
 return <div className="fragrance-accords"><div className="accords-heading"><h3>{profile.fragranceAccordsTitle}</h3>{profile.fragranceSample&&<small>নমুনা প্রোফাইল</small>}</div><ul>{accords.map((accord,i)=><li key={i}><div className="accord-label"><span>{accord.name}</span><small>{accord.strength>=75?'প্রধান':accord.strength>=45?'মাঝারি':'হালকা'}</small></div><div className="accord-track" aria-hidden="true"><span style={{width:accord.strength+'%',background:accordTones[accord.tone].color}}/></div></li>)}</ul><p>বারের দৈর্ঘ্য ঘ্রাণের আপেক্ষিক চরিত্র বোঝায়, উপাদানের শতাংশ নয়।</p></div>;
}
