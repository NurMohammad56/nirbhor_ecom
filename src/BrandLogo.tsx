import { useId } from "react";
export default function BrandLogo({ className = "" }: { className?: string }) {
  const filter = "nirbhor-teal-" + useId().replaceAll(":", "");
  return <span className={`nirbhor-brand-mark ${className}`}><svg aria-hidden="true" width="0" height="0" style={{position:"absolute"}}><filter id={filter} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1.1049038 -0.2045313 0.0996276 0 0 -0.9860335 2.8351955 -0.8491620 0 0 -1.0803849 2.1818746 -0.1014898 0 0 0 0 0 1 0"/></filter></svg><img src="/brand/nirbhor-logo.webp" alt="" aria-hidden="true" width="925" height="586" style={{filter:`url(#${filter})`}} /><span className="brand-accessible-name">নির্ভর</span></span>;
}
