export function BotanicalSprite({position,label}:{position:number;label:string}){
 return <span className="botanical-sprite" role="img" aria-label={label} style={{backgroundPosition:`${position*100/3}% center`}}/>;
}
