import {notFound} from 'next/navigation';
import {departments} from '@/lib/departments';
import View from '@/features/products/ScopedProduct';
export default async function Page({params}:{params:Promise<{department:string}>}){const {department}=await params;if(!departments.some(d=>d.slug===department))notFound();return <View department={department} campaignMode/>;}
