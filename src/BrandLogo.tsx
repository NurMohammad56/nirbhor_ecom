export default function BrandLogo({ className = "" }: { className?: string }) {
  return <span className={`nirbhor-brand-mark ${className}`}><img src="/brand/nirbhor-logo.webp" alt="" aria-hidden="true" width="925" height="586" /><span className="brand-accessible-name">নির্ভর</span></span>;
}
