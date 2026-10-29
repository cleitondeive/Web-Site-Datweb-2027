const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let opened=[];
function node(tag='div'){return{tag,handlers:{},style:{},children:[],classList:{add(){},remove(){}},setAttribute(k,v){this[k]=v},append(...x){this.children.push(...x)},appendChild(x){this.children.push(x)},replaceChildren(...x){this.children=x},remove(){},addEventListener(k,f){this.handlers[k]=f},click(){if(this.href)opened.push(this.href)}}}
for (const modal of [false, true]) {
opened=[];let resets=0;
const fields=Object.fromEntries(Object.entries({nome:'Ana <Silva>',email:'ana+site@exemplo.com',telefone:'(65) 99999-8888',produto:'Vizage',mensagem:'Quero conhecer biometria & controle de acesso.'}).map(([k,v])=>[k,Object.assign(node('input'),{value:v,validityMessage:'',setCustomValidity(m){this.validityMessage=m}})]));
if(modal)delete fields.mensagem;
const form=Object.assign(node('form'),{id:modal?'modal-demo-form':'main-contact-form',querySelector(q){if(q.includes('button'))return node('button');const n=q.match(/name="([^"]+)"/);return n?fields[n[1]]:null},querySelectorAll(){return Object.values(fields)},reportValidity(){return !Object.values(fields).some(x=>x.validityMessage)},reset(){resets++}});
const feedback=node(),listeners={};
const document={body:node('body'),createElement:node,getElementById(id){if(id===form.id)return form;if(id===(modal?'modal-demo-feedback':'contact-form-feedback'))return feedback;return null},querySelectorAll(){return [fields.telefone]},addEventListener(k,f){listeners[k]=f}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../js/contact.js'),'utf8'),{document,encodeURIComponent,alert(){},setTimeout:f=>f(),window:{open:(url)=>opened.push(url)}});listeners.DOMContentLoaded();
form.handlers.submit({preventDefault(){}});
assert.equal(opened.length,1,'Submission must open WhatsApp synchronously');
const url=new URL(opened[0]);assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/556530299800');
const text=url.searchParams.get('text');
for(const v of Object.values(fields).map(x=>x.value))assert.ok(text.includes(v),`Missing submitted value: ${v}`);
assert.equal(resets,0,'Keep values until the visitor actually sends on WhatsApp');
opened=[];fields.telefone.value='123';form.handlers.submit({preventDefault(){}});assert.equal(opened.length,0,'Invalid phone must not open WhatsApp');
console.log('PASS: correct WhatsApp, all fields encoded, retained values, invalid phone blocked.');

}
