"use client";
import NextLink from 'next/link';
import {usePathname,useRouter,useSearchParams as useNextSearchParams,useParams as useNextParams} from 'next/navigation';
import {forwardRef,useCallback,useEffect,useLayoutEffect,useMemo,useRef,useSyncExternalStore} from 'react';
import type {AnchorHTMLAttributes,ReactNode} from 'react';

type LinkProps=Omit<AnchorHTMLAttributes<HTMLAnchorElement>,'href'> & {to:string;replace?:boolean;state?:unknown};
export const Link=forwardRef<HTMLAnchorElement,LinkProps>(function Link({to,replace,state,...props},ref){
 return <NextLink {...props} ref={ref} href={to} replace={replace} scroll={false} prefetch={false} onClick={event=>{props.onClick?.(event);if(event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;const target=new URL(to,window.location.href);if(target.origin===location.origin&&target.pathname===location.pathname){event.preventDefault();window.history[replace?'replaceState':'pushState'](null,'',target.pathname+target.search+target.hash);window.dispatchEvent(new Event('nirbhor-navigation'));}}}/>;
});
export function NavLink({end=false,className,children,...props}:Omit<LinkProps,'className'|'children'> & {end?:boolean;className?:string|((state:{isActive:boolean})=>string);children?:ReactNode|((state:{isActive:boolean})=>ReactNode)}){
 const pathname=usePathname(),target=props.to.split(/[?#]/)[0],isActive=end?pathname===target:pathname===target||pathname.startsWith(target+'/');
 return <Link {...props} aria-current={isActive?'page':undefined} className={typeof className==='function'?className({isActive}):[className,isActive?'active':''].filter(Boolean).join(' ')}>{typeof children==='function'?children({isActive}):children}</Link>;
}
function subscribeURL(listener:()=>void){window.addEventListener('popstate',listener);window.addEventListener('hashchange',listener);window.addEventListener('nirbhor-navigation',listener);return()=>{window.removeEventListener('popstate',listener);window.removeEventListener('hashchange',listener);window.removeEventListener('nirbhor-navigation',listener);};}
function useURLSearch(){const native=useNextSearchParams().toString(),pathname=usePathname(),initial=useRef(true);const snapshot=useSyncExternalStore(subscribeURL,()=>window.location.search,()=>native?'?'+native:'');useLayoutEffect(()=>{initial.current=false;window.dispatchEvent(new Event('nirbhor-navigation'));},[native,pathname]);return initial.current?(native?'?'+native:''):snapshot;}
export function useLocation(){const pathname=usePathname(),search=useURLSearch(),hash=useSyncExternalStore(subscribeURL,()=>window.location.hash,()=> '');return {pathname,search,hash};}
export function useNavigate(){const router=useRouter();return useCallback((to:string|number,options?:{replace?:boolean;state?:unknown})=>{if(typeof to==='number'){if(to===-1)router.back();else if(to===1)router.forward();else window.history.go(to);return;}const url=new URL(to,window.location.href);if(url.origin!==location.origin){window.location.assign(url);return;}if(url.pathname===location.pathname){window.history[options?.replace?'replaceState':'pushState'](null,'',url.pathname+url.search+url.hash);window.dispatchEvent(new Event('nirbhor-navigation'));}else router[options?.replace?'replace':'push'](to,{scroll:false});},[router]);}
export function useSearchParams():[URLSearchParams,(next:URLSearchParams|string|Record<string,string>|((previous:URLSearchParams)=>URLSearchParams),options?:{replace?:boolean;preventScrollReset?:boolean})=>void]{
 const current=useURLSearch();const set=useCallback((next:URLSearchParams|string|Record<string,string>|((previous:URLSearchParams)=>URLSearchParams),options?:{replace?:boolean;preventScrollReset?:boolean})=>{const params=typeof next==='function'?next(new URLSearchParams(window.location.search)):new URLSearchParams(next),query=params.toString();window.history[options?.replace?'replaceState':'pushState'](null,'',location.pathname+(query?'?'+query:'')+location.hash);window.dispatchEvent(new Event('nirbhor-navigation'));},[]);
 const params=useMemo(()=>new URLSearchParams(current),[current]);return [params,set];
}
export function useParams<T extends Record<string,string|undefined>=Record<string,string|undefined>>(){const params=useNextParams();return Object.fromEntries(Object.entries(params).map(([key,value])=>[key,Array.isArray(value)?value.join('/'):value])) as T;}
export function Navigate({to,replace=false}:{to:string;replace?:boolean}){const navigate=useNavigate();useEffect(()=>navigate(to,{replace}),[to,replace,navigate]);return null;}
