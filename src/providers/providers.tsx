"use client";
import dynamic from 'next/dynamic';
import type {ReactNode} from 'react';
const Runtime=dynamic(()=>import('./runtime-provider'),{ssr:false,loading:()=> <div className="route-loading"><span/><span/><span/><p>নির্ভর প্রস্তুত হচ্ছে...</p></div>});
/** Existing cart/admin state is browser-local; only its interactive tree waits for hydration. */
export default function Providers({children}:{children:ReactNode}){return <Runtime>{children}</Runtime>;}
