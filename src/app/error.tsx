"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="container page-space"><h1>পেজটি খোলা যায়নি</h1><p>আবার চেষ্টা করুন।</p><button type="button" className="btn" onClick={reset}>আবার খুলুন</button></main>;}
