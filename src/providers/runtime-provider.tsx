"use client";
import type {ReactNode} from 'react';
import {StoreProvider} from './store-provider';
import ApplicationShell from '@/components/layout/ApplicationShell';
export default function RuntimeProvider({children}:{children:ReactNode}){return <StoreProvider><ApplicationShell>{children}</ApplicationShell></StoreProvider>;}
