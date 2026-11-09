"use client";
import {ArrowUpRight} from 'lucide-react';
import {Link} from '@/lib/navigation';
import {useStore} from '@/providers/store-provider';
import {departments,categoryForDepartment,experienceForDepartment} from '@/lib/departments';
export {PerfumeHero,PerfumeFamilies} from './FragranceBoutique';
export function PerfumeInvitation(){
 const s=useStore(),d=departments.find(d=>d.slug==='perfume')!,category=categoryForDepartment(d,s.categories);if(!category?.active||!experienceForDepartment(d,s.categories).enabled)return null;
 return <section className="container perfume-invitation" aria-labelledby="perfume-invite-title"><div><span className="luxury-eyebrow">নির্ভরে নতুন এক জগৎ</span><h2 id="perfume-invite-title">সুগন্ধে থাকুক<br/>নিজস্ব একটা গল্প।</h2><p>সতেজ, ফুলেল কিংবা উষ্ণ। নোট বুঝে খুঁজে নিন নিজের পছন্দ।</p><Link className="btn perfume-primary" to="/perfume">পারফিউমের জগতে<ArrowUpRight size={18}/></Link></div><div className="perfume-invitation-art" data-depth="image" data-depth-max="10"><img src="/assets/perfume-hero-v1.webp" alt="পারফিউম কালেকশনের ভিজ্যুয়াল" loading="lazy"/></div><span className="invitation-mark" aria-hidden="true">SCENT / STORY</span></section>;
}
