import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight,Check,Eye,Gift,RefreshCw} from 'lucide-react';
import {useStore} from './store';
import {Button} from './ui';
import {bnNode} from './bn';
import {departments} from './departments';
import HeroImagePicker from './HeroImagePicker';
import {OfferPopupCard} from './OfferPopup';
import {popupConfigKey,popupDate,popupOffers,popupScheduled,readPopup,resolvePopupOffer,safePopupLink} from './offer-popup';
import type {OfferPopupConfig} from './offer-popup';

export default function OfferPopupAdmin(){
 const s=useStore(),[draft,setDraft]=useState(()=>readPopup(s.content)),[preview,setPreview]=useState(false),[error,setError]=useState('');
 const offers=popupOffers(s),offer=resolvePopupOffer(draft,offers);
 const update=<K extends keyof OfferPopupConfig>(key:K,value:OfferPopupConfig[K])=>{setDraft(d=>({...d,[key]:value}));setError('');};
 const save=(event:React.FormEvent)=>{
  event.preventDefault();
  if(draft.link&&!safePopupLink(draft.link)){setError('এই সাইটের লিংক দিন, যেমন /offers অথবা /combo/combo-pantry।');return;}
  if(draft.start&&draft.end&&popupDate(draft.end)<=popupDate(draft.start)){setError('শেষের সময় শুরুর সময়ের পরে দিন।');return;}
  if(draft.scope==='department'&&!draft.departments.length){setError('অন্তত একটি ক্যাটাগরি নির্বাচন করুন।');return;}
  if(draft.enabled&&draft.offerId!=='message'&&!offer){setError('চালু ও কেনা যায় এমন একটি অফার বেছে নিন, অথবা সাধারণ ব্যানার ব্যবহার করুন।');return;}
  s.setContent(c=>({...c,[popupConfigKey]:JSON.stringify(draft)}));s.toast('অফার পপআপের সেটিংস সেভ হয়েছে।');
 };
 return <><div className="admin-title"><div><h1>অফার পপআপ</h1><p>প্রথম দেখায় আপনার চলতি অফার। সঠিক জায়গায়, সঠিক সময়ে।</p></div><Link className="btn outline" to="/">স্টোর দেখুন<ArrowUpRight size={16}/></Link></div>
  <form className="popup-admin-layout" onSubmit={save}>
   <div className="popup-admin-fields">
    <section className="popup-admin-panel"><div className="popup-admin-panel-title"><Gift size={20}/><h2>ব্যানার ও অফার</h2></div>
     <label className="check-label popup-enable"><input type="checkbox" checked={draft.enabled} onChange={e=>update('enabled',e.target.checked)}/>সাইটে অফার পপআপ চালু রাখুন</label>
     <label className="field">পপআপের অফার<select value={draft.offerId} onChange={e=>update('offerId',e.target.value)}><option value="auto">চালু অফার থেকে স্বয়ংক্রিয়ভাবে</option><option value="message">সাধারণ ব্যানার (ছাড়ের দাবি ছাড়া)</option>{!['auto','message'].includes(draft.offerId)&&!offers.some(o=>o.id===draft.offerId)&&<option value={draft.offerId}>আগের অফারটি এখন চালু নেই</option>}{offers.map(o=><option key={o.id} value={o.id}>{bnNode(o.kicker)} - {bnNode(o.badge)}{o.code?' · '+o.code:''}</option>)}</select></label>
     <p className="popup-admin-help">ছাড়ের অঙ্ক, কুপন কোড ও শর্ত মূল অফার থেকে আসবে। অফার বন্ধ বা মেয়াদ শেষ হলে সেটির পপআপ দেখাবে না।</p>
     <label className="field">পপআপের শিরোনাম<textarea aria-label="পপআপের শিরোনাম" rows={2} maxLength={120} value={draft.title} onChange={e=>update('title',e.target.value)} required/></label>
     <label className="field">পপআপের সহায়ক লেখা<textarea aria-label="পপআপের সহায়ক লেখা" rows={3} maxLength={300} value={draft.text} onChange={e=>update('text',e.target.value)}/></label>
     <fieldset className="popup-image-field"><legend>পপআপের ছবি</legend><HeroImagePicker value={draft.image} onChange={value=>update('image',value)} label="পপআপের ছবির লিংক" uploadLabel="পপআপের ছবি আপলোড"/><button type="button" className="text-button" onClick={()=>update('image','')}>ছবি অফার থেকে নিন</button><small>ছবি না দিলে নির্বাচিত অফারের ব্যানার ব্যবহার হবে।</small></fieldset>
     <div className="form-grid"><label className="field">পপআপ বাটনের লেখা<input maxLength={40} value={draft.button} onChange={e=>update('button',e.target.value)} required/></label><label className="field">বাটনের লিংক (ঐচ্ছিক)<input placeholder="/offers" value={draft.link} onChange={e=>update('link',e.target.value)}/><small>খালি রাখলে মূল অফারের পেজে যাবে।</small></label></div>
    </section>
    <section className="popup-admin-panel"><h2>কখন ও কোথায় দেখাবেন</h2><div className="form-grid">
     <label className="field">কত সেকেন্ড পরে<input type="number" min="0" max="60" step="1" value={draft.delay} onChange={e=>update('delay',Number(e.target.value))} required/></label>
     <label className="field">কতবার দেখাবেন<select value={draft.frequency} onChange={e=>update('frequency',e.target.value as OfferPopupConfig['frequency'])}><option value="session">এক ভিজিটে একবার</option><option value="day">২৪ ঘণ্টায় একবার</option><option value="week">৭ দিনে একবার</option></select></label>
     <label className="field">কোন পেজে<select value={draft.scope} onChange={e=>update('scope',e.target.value as OfferPopupConfig['scope'])}><option value="home">শুধু হোমপেজে</option><option value="browse">সব শপিং পেজে</option><option value="department">নির্দিষ্ট ক্যাটাগরিতে</option></select></label>
     <label className="field">কোন ডিভাইসে<select value={draft.devices} onChange={e=>update('devices',e.target.value as OfferPopupConfig['devices'])}><option value="all">সব ডিভাইসে</option><option value="mobile">শুধু মোবাইলে</option><option value="desktop">শুধু ডেস্কটপে</option></select></label>
    </div>
    {draft.scope==='department'&&<fieldset className="popup-departments"><legend>ক্যাটাগরি বেছে নিন</legend>{departments.map(d=><label className="check-label" key={d.slug}><input type="checkbox" checked={draft.departments.includes(d.slug)} onChange={e=>update('departments',e.target.checked?[...draft.departments,d.slug]:draft.departments.filter(x=>x!==d.slug))}/>{bnNode(d.name)}</label>)}</fieldset>}
    <div className="form-grid"><label className="field">শুরুর সময় (বাংলাদেশ)<input type="datetime-local" value={draft.start} onChange={e=>update('start',e.target.value)}/></label><label className="field">শেষের সময় (বাংলাদেশ)<input type="datetime-local" value={draft.end} onChange={e=>update('end',e.target.value)}/></label></div><p className="popup-admin-help">সময় খালি রাখলে আলাদা সময়সীমা থাকবে না। কার্ট, চেকআউট ও অ্যাকাউন্ট পেজে পপআপ দেখানো হবে না।</p>
    </section>
    <div className="popup-admin-save">{error&&<p className="field-error" role="alert">{error}</p>}<Button type="submit"><Check size={17}/>পপআপ সেভ করুন</Button><Button type="button" variant="outline" onClick={()=>setPreview(true)}><Eye size={17}/>প্রিভিউ দেখুন</Button></div>
   </div>
   <aside className="popup-admin-summary"><span className="popup-status"><span className={draft.enabled&&popupScheduled(draft)?'is-on':''}/>{draft.enabled?(popupScheduled(draft)?'চালু':'সময়সূচি অনুযায়ী দেখাবে'):'বন্ধ'}</span><h2>একটু সাশ্রয়, সুন্দর শুরু</h2><div className="popup-admin-mini"><img src={draft.image||offer?.image||'/assets/brand-world-v5.webp'} alt=""/><div><b>{bnNode(draft.title)}</b>{offer&&<span>{bnNode(offer.badge)}</span>}</div></div><Button type="button" variant="outline" onClick={()=>setPreview(true)}><Eye size={17}/>বড় করে দেখুন</Button><p>ক্রেতা সহজেই বন্ধ করতে পারবেন। কিবোর্ডে Escape দিয়েও বন্ধ হবে। একই ভিজিটে বারবার এসে কেনাকাটা থামাবে না।</p><hr/><h3>নতুন ক্যাম্পেইন শুরু করবেন?</h3><p>আগে দেখা ক্রেতাকেও পরেরবার দেখাতে নতুন সংস্করণ বেছে নিয়ে সেভ করুন।</p><button type="button" className="btn outline" onClick={()=>{update('revision',crypto.randomUUID());s.toast('নতুন সংস্করণ প্রস্তুত। কার্যকর করতে পপআপ সেভ করুন।');}}><RefreshCw size={15}/>নতুন করে দেখানোর সংস্করণ</button><small>পরিবর্তন সেভ করার পর কার্যকর হবে।</small></aside>
  </form>
  {preview&&<OfferPopupCard config={draft} offer={offer} preview onClose={()=>setPreview(false)}/>}
 </>;
}
