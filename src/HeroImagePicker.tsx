import { useEffect, useId, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { bnNode } from "./bn";

export default function HeroImagePicker({value,onChange}:{value:string;onChange:(value:string)=>void}) {
  const id=useId(),request=useRef(0),[busy,setBusy]=useState(false),[error,setError]=useState("");
  useEffect(()=>()=>{request.current++;},[]);
  async function upload(file?:File) {
    if(!file)return;
    const token=++request.current;setError("");
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)){setError("JPG, PNG বা WebP ছবি দিন।");return;}
    if(file.size>8*1024*1024){setError("৮ এমবির মধ্যে একটি ছবি বেছে নিন।");return;}
    setBusy(true);
    try {
      const bitmap=await createImageBitmap(file);
      let data:string;
      try {
        const ratio=Math.min(1,1920/bitmap.width,1280/bitmap.height),canvas=document.createElement('canvas');
        canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
        const context=canvas.getContext('2d');if(!context)throw Error('Canvas unavailable');
        context.drawImage(bitmap,0,0,canvas.width,canvas.height);data=canvas.toDataURL('image/webp',.86);
        if(data.length>1200000)data=canvas.toDataURL('image/webp',.65);
        if(data.length>1200000)throw Error('Image too large');
      } finally {bitmap.close();}
      if(request.current===token)onChange(data);
    } catch {if(request.current===token)setError("ছবিটি পড়া যায়নি বা খুব বড়। অন্য একটি ছবি দিয়ে চেষ্টা করুন।");}
    finally {if(request.current===token)setBusy(false);}
  }
  return <div className="hero-image-picker">
    <label className="field">{bnNode('Hero image URL')}<input aria-label={bnNode('Hero image URL')} value={value.startsWith('data:')?'':value} placeholder={value.startsWith('data:')?'কম্পিউটার থেকে বাছাই করা ছবি':'https://…'} onChange={e=>{request.current++;setBusy(false);setError('');onChange(e.target.value);}}/></label>
    <label className={`hero-image-upload ${busy?'is-busy':''}`} htmlFor={id}><Upload size={16}/>{busy?'ছবি প্রস্তুত হচ্ছে…':'কম্পিউটার থেকে ছবি বেছে নিন'}</label>
    <input id={id} className="hero-image-file" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} aria-label="হিরোর ছবি আপলোড" onChange={e=>{const file=e.target.files?.[0];e.target.value='';void upload(file);}}/>
    <small>JPG, PNG বা WebP। ছবি বেছে নিয়ে পেজ সেভ করুন।</small>
    {error&&<p className="field-error" role="alert">{error}</p>}
  </div>;
}
