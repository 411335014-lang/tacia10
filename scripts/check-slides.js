const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'slides/coffee-class');
const read=p=>fs.readFileSync(path.join(dir,p),'utf8').replace(/^\uFEFF/,'');
const nodes=new Map(),slides=[],events={},windowEvents={};
function node(id=''){return {id,value:'',max:'',disabled:false,textContent:'',innerHTML:'',attributes:{},classList:{toggle(){}},setAttribute(k,v){this.attributes[k]=v},append(s){slides.push(s)}}}
for(const id of ['deck','prev','next','jump','print','count'])nodes.set(id,node(id));
const doc={getElementById:id=>nodes.get(id),createElement:()=>node(),querySelectorAll:s=>s==='.slide'?slides:details,addEventListener:(k,f)=>events[k]=f,activeElement:{tagName:'BODY'}};
const details=Array.from({length:5},()=>({open:false}));
const ctx=vm.createContext({document:doc,location:{hash:'#1'},history:{replaceState(a,b,h){ctx.location.hash=h}},window:{scrollTo(){},print(){},addEventListener:(k,f)=>windowEvents[k]=f}});
vm.runInContext(read('slides.js'),ctx);
assert.equal(slides.length,18);assert.equal(nodes.get('count').textContent,'01 / 18');assert.equal(nodes.get('prev').disabled,true);
const expected=['公主的女僕咖啡教室','學完可以理解什麼？','咖啡豆是什麼？','豆種有哪些差異？','不同產地，風味有何不同？','烘焙如何改變風味？','都叫中焙，為什麼味道不同？','Espresso 是什麼？','看懂一份濃縮配方','一杯濃縮怎麼做？','萃取太快，怎麼調整？','細緻奶泡怎麼形成？','拿鐵與卡布奇諾差在哪？','奶泡太厚怎麼辦？','喝起來淡，咖啡因就少嗎？','酸與苦一定是問題嗎？','換你判斷看看','帶走三個觀念'];
slides.forEach((s,i)=>assert(s.innerHTML.includes('<h1>'+expected[i]+'</h1>')));
nodes.get('next').onclick();assert.equal(nodes.get('count').textContent,'02 / 18');
doc.activeElement.tagName='BUTTON';events.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(nodes.get('count').textContent,'03 / 18');
nodes.get('jump').value='17';nodes.get('jump').oninput();assert.equal(nodes.get('count').textContent,'17 / 18');assert.equal((slides[16].innerHTML.match(/<details>/g)||[]).length,5);
nodes.get('next').onclick();nodes.get('next').onclick();assert.equal(nodes.get('count').textContent,'18 / 18');assert.equal(nodes.get('next').disabled,true);
ctx.location.hash='#9';windowEvents.hashchange();assert.equal(nodes.get('count').textContent,'09 / 18');
ctx.location.hash='#999';windowEvents.hashchange();assert.equal(nodes.get('count').textContent,'18 / 18');
windowEvents.beforeprint();assert(details.every(d=>d.open));windowEvents.afterprint();assert(details.every(d=>!d.open));
let links=0;
function checkLinks(html,file){for(const m of html.replace(/<script[\s\S]*?<\/script>/gi,'').matchAll(/(?:href|src)="([^"#]+)"/g)){const url=m[1];if(/^(https?:|data:|mailto:)/.test(url))continue;assert(!url.includes('${'),'unresolved template link');const dest=path.resolve(path.dirname(file),decodeURIComponent(url.split('#')[0]));assert(fs.existsSync(dest),'Broken link: '+path.relative(dir,file)+' -> '+url);links++}}
function walk(folder){for(const e of fs.readdirSync(folder,{withFileTypes:true})){const f=path.join(folder,e.name);if(e.isDirectory())walk(f);else if(f.endsWith('.html')){const html=fs.readFileSync(f,'utf8');checkLinks(html,f);assert(!html.includes('\uFFFD'),'replacement character in '+f)}}}
walk(dir);slides.forEach(s=>checkLinks(s.innerHTML,path.join(dir,'index.html')));
const entry=read('index.html');assert(!entry.includes('src="slides.js"'));assert(!entry.includes('href="style.css"'));assert(entry.includes('@media(max-width:700px)'));
console.log(JSON.stringify({slides:18,outline:'pass',navigation:'pass',keyboardAfterButton:'pass',range:'pass',hashAndBounds:'pass',quizCount:5,printAnswerState:'pass',offlineHtmlLinks:links,utf8:'pass',visualBrowser:'not tested'},null,2));

