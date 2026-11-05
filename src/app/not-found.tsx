"use client";
import {Link} from '@/lib/navigation';
export default function NotFound(){return <main className="container page-space"><h1>পেজটি পাওয়া যায়নি</h1><p>ঠিকানাটি মিলিয়ে দেখুন অথবা হোমপেজে ফিরে যান।</p><Link className="btn" to="/">হোমপেজে ফিরুন</Link></main>;}
