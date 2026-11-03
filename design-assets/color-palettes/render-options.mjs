import fs from 'node:fs';
import sharp from 'sharp';

const options = [
  { name: 'TEAL + ORANGE', subtitle: 'Fresh, clear, everyday commerce', primary: '#0F766E', accent: '#F97316', background: '#F7FAF9', ink: '#142D2A', tint: '#E5F1EC' },
  { name: 'NAVY + CORAL', subtitle: 'Bold offers, a polished storefront', primary: '#172554', accent: '#F43F5E', background: '#F8FAFC', ink: '#111827', tint: '#E9EDF7' },
  { name: 'FOREST + AMBER', subtitle: 'Warm, familiar, close to the brand', primary: '#173F32', accent: '#E9A23B', background: '#FBFAF6', ink: '#1B2B22', tint: '#ECF0E6' },
];
const cards = options.map((p, i) => {
  const swatches = [['PRIMARY',p.primary],['OFFERS',p.accent],['BACKGROUND',p.background],['TEXT',p.ink]];
  return `<g transform="translate(${42+i*470},145)">
  <rect width="442" height="634" rx="22" fill="white" stroke="#DAE1E4"/>
  <text x="24" y="40" class="small" fill="#657276">0${i+1} / COLOR DIRECTION</text>
  <text x="24" y="78" class="name" fill="${p.ink}">${p.name}</text>
  <text x="24" y="104" class="caption" fill="#657276">${p.subtitle}</text>
  <g transform="translate(24,130)">
   <rect width="394" height="276" rx="13" fill="${p.background}" stroke="#E4E8E7"/>
   <path d="M13 0H381Q394 0 394 13V24H0V13Q0 0 13 0" fill="${p.primary}"/>
   <text x="197" y="16" text-anchor="middle" font-size="8" fill="white">Thoughtfully chosen. For your everyday.</text>
   <text x="16" y="57" font-size="17" font-weight="800" fill="${p.primary}">NIRBHOR</text>
   <rect x="134" y="40" width="192" height="24" rx="6" fill="white" stroke="#D9E1DE"/>
   <text x="145" y="55" font-size="8" fill="#87948E">Find your next good thing</text>
   <circle cx="359" cy="52" r="7" fill="none" stroke="${p.primary}" stroke-width="1.5"/>
   <g transform="translate(12,80)">
    <rect width="370" height="143" rx="10" fill="${p.primary}"/>
    <circle cx="319" cy="23" r="98" fill="white" opacity=".06"/>
    <text x="18" y="24" font-size="8" font-weight="700" letter-spacing="1.5" fill="white" opacity=".8">THE OFFERS EDIT</text>
    <text x="18" y="55" font-size="24" font-weight="750" fill="white">Good finds.</text>
    <text x="18" y="82" font-size="24" font-weight="750" fill="white">Better prices.</text>
    <rect x="18" y="101" width="110" height="28" rx="5" fill="${p.accent}"/>
    <text x="73" y="119" text-anchor="middle" font-size="9" font-weight="750" fill="${p.ink}">Explore offers  ↗</text>
    <g transform="translate(243,36) rotate(8 38 45)"><rect width="78" height="83" y="8" rx="9" fill="${p.tint}"/><path d="M22 19V8a17 17 0 0 1 34 0V19" fill="none" stroke="${p.accent}" stroke-width="5"/><path d="M29 50h20m-10-10v20" stroke="${p.primary}" stroke-width="4" stroke-linecap="round"/></g>
   </g>
   <rect x="12" y="238" width="79" height="23" rx="11" fill="${p.tint}"/><text x="52" y="253" text-anchor="middle" font-size="8" fill="${p.primary}">Categories</text>
   <rect x="101" y="238" width="79" height="23" rx="11" fill="white" stroke="#DDE4DF"/><text x="141" y="253" text-anchor="middle" font-size="8" fill="${p.ink}">Best sellers</text>
   <rect x="190" y="238" width="79" height="23" rx="11" fill="white" stroke="#DDE4DF"/><text x="230" y="253" text-anchor="middle" font-size="8" fill="${p.ink}">Combos</text>
  </g>
  ${swatches.map(([label,color],j)=>`<g transform="translate(${24+j*100},434)"><rect width="93" height="59" rx="8" fill="${color}" stroke="#DDE4E0"/><text y="81" class="swatch-label" fill="#657276">${label}</text><text y="102" class="hex" fill="${p.ink}">${color}</text></g>`).join('')}
  <line x1="24" y1="564" x2="418" y2="564" stroke="#E6EBE7"/>
  <circle cx="32" cy="598" r="5" fill="${p.accent}"/><text x="47" y="603" class="caption" fill="${p.ink}">${i===0?'Recommended for the new Nirbhor store':i===1?'A more striking marketplace direction':'A softer evolution of the current brand'}</text>
 </g>`;
}).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1464" height="840" viewBox="0 0 1464 840"><style>text{font-family:Arial,sans-serif}.small{font-size:11px;font-weight:700;letter-spacing:1.5px}.name{font-size:28px;font-weight:750;letter-spacing:-.7px}.caption{font-size:12px}.swatch-label{font-size:9px;font-weight:700;letter-spacing:1px}.hex{font-size:13px;font-weight:700}</style><rect width="1464" height="840" fill="#EEF1F2"/><text x="42" y="58" font-family="Arial" font-size="31" font-weight="750" fill="#20312D">NIRBHOR / COLOR PALETTE OPTIONS</text><text x="42" y="91" font-family="Arial" font-size="15" fill="#657276">Three visual directions. Concept preview only - no changes to the live website.</text>${cards}</svg>`;
const directory = 'design-assets/color-palettes'; fs.mkdirSync(directory,{recursive:true}); fs.writeFileSync(directory+'/nirbhor-options-2026-11-02.svg',svg); await sharp(Buffer.from(svg)).png().toFile(directory+'/nirbhor-options-2026-11-02.png'); console.log(directory+'/nirbhor-options-2026-11-02.png');
