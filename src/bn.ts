import { bnCopy } from "./bn-copy";

const normal = (s: string) => s.replace(/\s+/g, " ").trim();
const dictionary = new Map(Object.entries(bnCopy).map(([key, value]) => [normal(key).toLowerCase(), value]));
const phrases = Object.entries(bnCopy).filter(([key]) => /[a-z]/i.test(key)).sort((a, b) => b[0].length - a[0].length);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = new RegExp(`(?<![a-z])(?:${phrases.map(([key]) => escape(normal(key))).join("|")})(?![a-z])`, "gi");
export const bnNumber = (value: string | number) => String(value).replace(/[0-9]/g, digit => "০১২৩৪৫৬৭৮৯"[Number(digit)]);

/** Translate presentation text only. IDs, enum values, routes and stored data stay stable. */
export function bn(value: string): string {
  if (!value || /^(https?:|data:|\/[a-z#]|#[a-f\d]{3,8}$)/i.test(value) || /^[\w.+-]+@[\w.-]+\.[a-z]+$/i.test(value) || /^(?:NBR-|SH-|DEMO-|NIRBHOR\d|WELCOME\d|FREESHIP)[\w-]*$/i.test(value) || /^[a-z]+\d[a-z\d]*$/i.test(value)) return value;
  const trimmed = normal(value);
  const exact = bnCopy[trimmed] ?? dictionary.get(trimmed.toLowerCase());
  if (exact === undefined) {
    const match = trimmed.match(/^Only (\d+) jars left in this harvest batch$/);
    if (match) return `${bnNumber(match[1])} জার বাকি আছে এই ব্যাচে`;
    const published = trimmed.match(/^(\d+) Published in your store$/i);
    if (published) return `${bnNumber(published[1])}টি প্রকাশিত পণ্য`;
    const events = trimmed.match(/^(\d+) locally recorded events$/);
    if (events) return `${bnNumber(events[1])}টি ইভেন্ট রেকর্ড হয়েছে`;
    const map = trimmed.match(/^Map storefront (.+) events to Meta\.$/);
    if (map) return `স্টোরের ${bn(map[1])} ইভেন্ট মেটার সঙ্গে যুক্ত করুন।`;
  }
  const tokens: string[] = [];
  const protect = (text: string) => text.replace(/https?:\/\/\S+|[\w.+-]+@[\w.-]+\.[a-z]+|\b[a-z\d-]+\.(?:com|net|org)\b|\b(?:NBR-|SH-|NIRBHOR\d|WELCOME\d|FREESHIP)[\w-]*/gi, token => { tokens.push(token); return `\uE000${String.fromCharCode(0xE100 + tokens.length - 1)}\uE001`; });
  const safe = protect(value);
  const translated = exact === undefined ? safe.replace(pattern, match => bnCopy[normal(match)] ?? dictionary.get(normal(match).toLowerCase()) ?? match) : (value.match(/^\s*/)?.[0] || "") + exact + (value.match(/\s*$/)?.[0] || "");
  return bnNumber(protect(translated)).replace(/\uE000([\uE100-\uEFFF])\uE001/g, (_, token: string) => tokens[token.charCodeAt(0) - 0xE100]);
}

/** Handles interpolated labels and arrays without changing React elements or form values. */
export function bnNode<T>(value: T): T {
  if (typeof value === "string") return bn(value) as T;
  if (typeof value === "number") return bnNumber(value) as T;
  if (Array.isArray(value)) return value.map(item => bnNode(item)) as T;
  return value;
}

export function searchText(value: string) {
  const aliases = Object.entries(bnCopy).filter(([english, translated]) => english.length > 3 && translated.length > 4 && value.includes(translated)).map(([english]) => english).join(" ");
  return `${value} ${bn(value)} ${aliases}`.toLocaleLowerCase("bn-BD").replace(/[০-৯]/g, n => String("০১২৩৪৫৬৭৮৯".indexOf(n)));
}

export const latinDigits = (value: string) => value.replace(/[০-৯]/g, n => String("০১২৩৪৫৬৭৮৯".indexOf(n)));
