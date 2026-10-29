const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for (const reduced of [false, true]) {
function el(){const classes=new Set();return{hidden:false,inert:false,attrs:{},handlers:{},textContent:'',classList:{add:(...v)=>v.forEach(x=>classes.add(x)),remove:(...v)=>v.forEach(x=>classes.delete(x)),contains:x=>classes.has(x),toggle:(x,on)=>on?classes.add(x):classes.delete(x)},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},getAttribute(k){return this.attrs[k]},addEventListener(k,f){this.handlers[k]=f},focus(){}}}
const slides=Array.from({length:3},el),tabs=Array.from({length:3},el),nodes=Object.fromEntries(['#dw-next','#dw-prev','#dw-pause','#dw-slide-count'].map(k=>[k,el()]));
const root=el();root.querySelector=q=>nodes[q];root.querySelectorAll=q=>q==='.dw-slide'?slides:tabs;
const listeners={},intervals=new Map(),timeouts=new Map();let id=0;
const document={hidden:false,querySelector:q=>q==='.dw-hero'?root:null,querySelectorAll:()=>[],addEventListener:(k,f)=>listeners[k]=f};
const window={location:{hash:''},matchMedia:()=>({matches:reduced}),addEventListener(){}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../js/home.js'),'utf8'),{document,window,setInterval:f=>{intervals.set(++id,f);return id},clearInterval:id=>intervals.delete(id),setTimeout:f=>{timeouts.set(++id,f);return id},clearTimeout:id=>timeouts.delete(id)});listeners.DOMContentLoaded();
assert.equal(intervals.size,reduced?0:1,'Initial autoplay follows motion preference');
if(!reduced){
 root.handlers.mouseenter?.();
 assert.equal(intervals.size,1,'Hover must not permanently stop autoplay');
 [...intervals.values()][0]();
 assert.equal(nodes['#dw-slide-count'].textContent,'02 / 03','Timer advances automatically');
 nodes['#dw-next'].handlers.click();
 assert.equal(intervals.size,1,'Manual next keeps automatic rotation enabled');
 assert.equal(nodes['#dw-slide-count'].textContent,'03 / 03');
 nodes['#dw-pause'].handlers.click();assert.equal(intervals.size,0,'Explicit pause stops timer');
 nodes['#dw-prev'].handlers.click();assert.equal(intervals.size,0,'Manual navigation preserves explicit pause');
 nodes['#dw-pause'].handlers.click();assert.equal(intervals.size,1,'Play resumes timer');
 document.hidden=true;listeners.visibilitychange();assert.equal(intervals.size,0,'Background tabs suspend rotation');
 document.hidden=false;listeners.visibilitychange();assert.equal(intervals.size,1,'Returning resumes rotation');
 root.handlers.focusin({target:{closest:()=>slides[0]}});assert.equal(intervals.size,0,'Keyboard interaction pauses rotation');
 root.handlers.focusout({relatedTarget:null});assert.equal(intervals.size,1,'Leaving slide resumes rotation');
}
nodes['#dw-next'].handlers.click();nodes['#dw-next'].handlers.click();nodes['#dw-prev'].handlers.click();
for(const f of [...timeouts.values()])f();
assert.equal(slides.filter(s=>!s.hidden).length,1,'Rapid navigation leaves one slide visible');
assert.equal(slides.filter(s=>!s.inert).length,1,'Only one slide is interactive');
console.log(`PASS: autoplay lifecycle, explicit pause, rapid navigation${reduced?' / reduced motion':''}`);

}
