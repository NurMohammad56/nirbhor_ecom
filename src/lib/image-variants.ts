import widths from './asset-widths.json';

/** Keep original src/URLs for merchant compatibility; browsers choose an appropriate stock size. */
export function imageVariants(src:string,sizes='(max-width:700px) 78vw, (max-width:1100px) 33vw, 320px'){
 const width=(widths as Record<string,number>)[src];if(!width)return {};
 return {sizes,srcSet:[...[320,640,960].filter(w=>w<width).map(w=>src.replace('/assets/','/assets/responsive/').replace(/\.webp$/,'-'+w+'.webp')+' '+w+'w'),src+' '+width+'w'].join(', ')};
}
