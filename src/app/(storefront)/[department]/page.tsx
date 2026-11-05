import {notFound} from 'next/navigation';
import DepartmentLanding from '@/features/departments/DepartmentLanding';
import {departments} from '@/lib/departments';
export default async function Page({params}:{params:Promise<{department:string}>}){const {department}=await params;if(!departments.some(d=>d.slug===department))notFound();return <DepartmentLanding slug={department}/>;}
