import {useEffect,useId,useState} from 'react';
import {ChevronDown} from 'lucide-react';
import type {Category,Product} from './data';
import {bnNode} from './bn';
import {descendants} from './category-tree';

export default function CategoryFilterTree({categories,products,category,subcategory,onParent,onChild}:{categories:Category[];products:Product[];category:string;subcategory:string;onParent:(parent:Category)=>void;onChild:(parent:Category,child:Category)=>void}){
 const prefix=useId(),[expanded,setExpanded]=useState(category);
 useEffect(()=>setExpanded(category),[category]);
 const active=categories.filter(c=>c.active),roots=active.filter(c=>!c.parent);
 const renderChildren=(root:Category,parent:string,ancestors:string[])=>active.filter(c=>c.parent===parent&&!ancestors.includes(c.name)).map(child=>{
  const selected=category===root.name&&subcategory===child.name;
  const nested=active.some(c=>c.parent===child.name&&!ancestors.includes(c.name));
  return <li key={child.id}><label className={`check-label sub-filter ${selected?'is-selected':''}`}><input type="checkbox" checked={selected} onChange={()=>onChild(root,child)}/><span>{bnNode(child.name)}</span></label>{nested&&<ul>{renderChildren(root,child.name,[...ancestors,child.name])}</ul>}</li>;
 });
 return <div className="category-filter-tree">{roots.map(root=>{
  const children=active.some(c=>c.parent===root.name),open=expanded===root.name,id=prefix+'-'+root.id;
  const names=descendants(active,root.name),count=products.filter(p=>p.status==='Published'&&(p.category===root.name||names.has(p.category))).length;
  return <div className={`category-filter-branch ${category===root.name?'is-selected':''}`} data-category-parent={root.id} key={root.id}>
   <div className="category-filter-parent"><label className="check-label"><input type="checkbox" checked={category===root.name} onChange={()=>{setExpanded(category===root.name?'':root.name);onParent(root);}}/><span>{bnNode(root.name)}</span><small>{bnNode(count)}</small></label>{children&&<button type="button" className="category-filter-expand" aria-label={`${bnNode(root.name)} - উপক্যাটাগরি ${open?'লুকান':'দেখুন'}`} aria-expanded={open} aria-controls={id} onClick={()=>setExpanded(old=>old===root.name?'':root.name)}><ChevronDown size={15}/></button>}</div>
   {children&&<ul id={id} hidden={!open} className="category-filter-children" aria-label={`${bnNode(root.name)} - উপক্যাটাগরি`}>{renderChildren(root,root.name,[root.name])}</ul>}
  </div>;
 })}</div>;
}
