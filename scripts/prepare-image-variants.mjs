import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Explicitly run when stock WebP assets change; uploads/custom URLs stay untouched.
const root=process.cwd(),assetDir=path.join(root,'public/assets'),out=path.join(assetDir,'responsive');
await fs.mkdir(out,{recursive:true});const manifest={};let count=0;
for(const name of (await fs.readdir(assetDir)).filter(name=>name.endsWith('.webp')).sort()){
 const input=path.join(assetDir,name),metadata=await sharp(input).metadata();if(!metadata.width||metadata.width<=320)continue;
 manifest['/assets/'+name]=metadata.width;
 for(const width of [320,640,960].filter(width=>width<metadata.width)){
  await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:82,effort:4}).toFile(path.join(out,name.replace(/\.webp$/,'-'+width+'.webp')));count++;
 }
}
await fs.writeFile(path.join(root,'src/lib/asset-widths.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared ${count} responsive WebP variants for ${Object.keys(manifest).length} stock assets.`);
