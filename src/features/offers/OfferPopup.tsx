"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from '@/lib/navigation';
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Copy, Gift, ShieldCheck } from 'lucide-react';
import { useStore } from '@/providers/store-provider';
import { useDepartment } from '@/hooks/useDepartment';
import { bnNode } from '@/lib/bn';
import { Modal } from '@/components/ui';
import { rememberOffer } from '@/lib/offer-merchandising';
import type { OfferSlide } from '@/lib/offer-merchandising';
import { markPopupSeen, popupBrowsePath, popupDate, popupOffers, popupScheduled, popupSeen, readPopups, resolvePopupOffer, safePopupLink } from '@/lib/offer-popup';
import type { OfferPopupConfig } from '@/lib/offer-popup';

export function OfferPopupCard({ config, offer, onClose, preview = false, navigation }: { config: OfferPopupConfig; offer?: OfferSlide; onClose: () => void; preview?: boolean; navigation?: ReactNode }) {
    const s = useStore(), [copied, setCopied] = useState(false);
    useEffect(() => setCopied(false), [config.id, config.revision, offer?.id]);
    const image = config.image || offer?.image || '/assets/brand-world-v5.webp';
    const href = safePopupLink(config.link) || (offer?.link || '/offers');
    return <div className="welcome-offer-shell"><Modal title={preview ? 'অফার পপআপ প্রিভিউ' : 'আপনার জন্য চলতি অফার'} onClose={onClose} wide>
        <div className="welcome-offer-card">
            <div className="welcome-offer-visual"><img src={image} alt="" onError={e => { if (!e.currentTarget.dataset.fallback) { e.currentTarget.dataset.fallback = 'yes'; e.currentTarget.src = '/assets/brand-world-v5.webp'; } }} /><span><Gift size={15} />নির্ভরের চলতি অফার</span></div>
            <div className="welcome-offer-copy"><span className="welcome-offer-kicker"><span />আপনার পছন্দে, একটু সাশ্রয়</span>
                <h2>{bnNode(config.title || offer?.title || 'চলতি অফার দেখে নিন')}</h2>
                {offer && <b className="welcome-offer-badge">{bnNode(offer.badge)}</b>}
                {config.text && <p>{bnNode(config.text)}</p>}
                {offer?.code && <button type="button" className="welcome-offer-code" aria-label="পপআপের কুপন কোড কপি করুন" onClick={async () => { try { await navigator.clipboard.writeText(offer.code!); rememberOffer(offer.code); setCopied(true); } catch { s.toast('অফারের পেজ থেকে কোডটি ব্যবহার করুন।'); } }}><span><small>চেকআউটে ব্যবহার করুন</small><strong>{offer.code}</strong></span>{copied ? <Check size={18} /> : <Copy size={18} />}<span className="sr-only" aria-live="polite">{copied ? 'কোড কপি হয়েছে' : ''}</span></button>}
                {offer && <p className="welcome-offer-conditions">{bnNode(offer.conditions)}</p>}
                {preview ? <button type="button" className="btn welcome-offer-cta" onClick={() => s.toast('প্রিভিউতে আছেন। সেভ করলে বাটনটি নির্বাচিত লিংকে যাবে।')}>{config.button || 'অফারটি দেখুন'}<ArrowUpRight size={18} /></button> : href.startsWith('/') ? <Link className="btn welcome-offer-cta" to={href} onClick={() => { rememberOffer(offer?.code); onClose(); }}>{config.button || 'অফার দেখুন'}<ArrowUpRight size={18} /></Link> : <a className="btn welcome-offer-cta" href={href} onClick={() => { rememberOffer(offer?.code); onClose(); }}>{config.button || 'অফার দেখুন'}<ArrowUpRight size={18} /></a>}
                <button type="button" className="welcome-offer-dismiss" onClick={onClose}>এখন নয়, কেনাকাটা চালিয়ে যাই</button>
                {!preview && config.frequency !== 'visit' && <button type="button" className="welcome-offer-week" onClick={() => { markPopupSeen(config, true); onClose(); }}>এই সপ্তাহে আর দেখাবেন না</button>}
                <small className="welcome-offer-trust"><ShieldCheck size={13} />অর্ডারের আগে অফারের শর্ত মিলিয়ে নিন</small>
            </div>
        </div>
        {navigation}
    </Modal></div>;
}

export default function OfferPopup() {
    const s = useStore(), { pathname } = useLocation(), { department } = useDepartment();
    const configs = useMemo(() => readPopups(s.content), [s.content]);
    const offers = useMemo(() => popupOffers(s), [s.products, s.categories, s.coupons, s.combos, s.discounts, s.content, s.offerClock]);
    const [openIds, setOpenIds] = useState<string[]>([]), [index, setIndex] = useState(0), [entry, setEntry] = useState(0);
    const [now, setNow] = useState(Date.now), [mobile, setMobile] = useState(() => matchMedia('(max-width: 767px)').matches);
    const visitShown = useRef(false);
    const eligible = configs.filter(config => {
        const offerReady = config.offerId === 'message' || !!resolvePopupOffer(config, offers);
        const pageMatches = config.scope === 'home' ? pathname === '/' : config.scope === 'department' ? !!department && config.departments.includes(department.slug) : true;
        const deviceMatches = config.devices === 'all' || (config.devices === 'mobile' ? mobile : !mobile);
        return config.enabled && offerReady && popupBrowsePath(pathname) && pageMatches && deviceMatches && popupScheduled(config, now);
    });
    const signature = JSON.stringify(eligible.map(c => [c.id, c.revision, c.delay, c.frequency]));
    useEffect(() => { const media = matchMedia('(max-width: 767px)'), change = () => setMobile(media.matches); media.addEventListener('change', change); return () => media.removeEventListener('change', change); }, []);
    useEffect(() => {
        const dates = configs.flatMap(c => [popupDate(c.start), popupDate(c.end)]).filter(t => Number.isFinite(t) && t > Date.now());
        const timer = setTimeout(() => setNow(Date.now()), Math.max(25, Math.min(30000, ...dates.map(t => t - Date.now()))));
        return () => clearTimeout(timer);
    }, [configs, now]);
    useEffect(() => { const restore = (event: PageTransitionEvent) => { if (event.persisted) { visitShown.current = false; setOpenIds([]); setEntry(x => x + 1); } }; window.addEventListener('pageshow', restore); return () => window.removeEventListener('pageshow', restore); }, []);
    useEffect(() => {
        setOpenIds([]);
        if (visitShown.current) return;
        const candidates = eligible.filter(c => !popupSeen(c));
        if (!candidates.length) return;
        let timer: ReturnType<typeof setTimeout>;
        const show = () => {
            if (visitShown.current) return;
            const available = candidates.filter(c => !popupSeen(c) && popupScheduled(c));
            if (!available.length) return;
            const active = document.activeElement;
            const busy = document.hidden || !!document.querySelector('[role="dialog"],.modal-backdrop') || !!active?.matches('input,textarea,select,[contenteditable="true"]');
            if (busy) { timer = setTimeout(show, 250); return; }
            visitShown.current = true; available.forEach(c => markPopupSeen(c)); setIndex(0); setOpenIds(available.map(c => c.id));
        };
        timer = setTimeout(show, candidates[0].delay * 1000);
        return () => clearTimeout(timer);
    }, [signature, pathname, entry]);
    useEffect(() => { if (s.drawer) setOpenIds([]); }, [s.drawer]);
    const visible = eligible.filter(c => openIds.includes(c.id)), active = visible[index % Math.max(visible.length, 1)];
    if (!active) return null;
    const activeIndex = visible.indexOf(active);
    const navigate = (direction: number) => setIndex(i => (i + direction + visible.length) % visible.length);
    const navigation = visible.length > 1 ? <nav className="welcome-offer-navigation" aria-label="পপআপের অফার বেছে নিন"><button type="button" className="icon-btn" aria-label="আগের অফার" onClick={() => navigate(-1)}><ChevronLeft size={20} /></button><div className="welcome-offer-pages"><span aria-live="polite">{bnNode(activeIndex + 1)} / {bnNode(visible.length)} অফার</span><div>{visible.map((item, i) => <button type="button" key={item.id} aria-label={`অফার ${bnNode(i + 1)} দেখুন`} aria-pressed={i === activeIndex} onClick={() => setIndex(i)} />)}</div></div><button type="button" className="icon-btn" aria-label="পরের অফার" onClick={() => navigate(1)}><ChevronRight size={20} /></button></nav> : undefined;
    return <OfferPopupCard config={active} offer={resolvePopupOffer(active, offers)} navigation={navigation} onClose={() => setOpenIds([])} />;
}
