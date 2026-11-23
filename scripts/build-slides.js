// Build from the approved outline and Wiki; no package installation required.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'slides/coffee-class');
const read = p => fs.readFileSync(path.join(root,p),'utf8').replace(/^\uFEFF/,'');
const write = (p,s) => fs.writeFileSync(path.join(out,p),s,'utf8');
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const wiki = ['coffee-beans','coffee-roasting','espresso','milk','coffee-faq'];
for(const p of wiki) if(!read('wiki/'+p+'.md').includes('##')) throw Error('Missing Wiki '+p);
let js=read('slides/coffee-class/slides.js');
// Deliverable links resolve inside this folder, even after it is copied.
js=js.replaceAll('../../wiki/${refs[ref]}.md','wiki/${refs[ref]}.html')
 .replace(/\.\.\/\.\.\/wiki\/([a-z-]+)\.md/g,'wiki/$1.html')
 .replaceAll('sources.md','sources.html').replaceAll('workflow.md','workflow.html');
write('slides.js',js);
let shell=read('templates/slides-shell.html');
shell=shell.replace('<link rel="stylesheet" href="style.css">','<style>'+read('slides/coffee-class/style.css')+'</style>')
 .replace('<script src="slides.js"></script>','<script>'+js.replace(/<\/script/gi,'<\\/script')+'</script>');
write('index.html',shell);
// A small escaped Markdown renderer for the project's headings, lists, tables and links.
function inline(s){return esc(s).replace(/!\[([^\]]*)\]\(([a-zA-Z0-9.\-_/]+)\)/g,'<img alt="$1" src="$2" style="max-width:100%;height:auto">').replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>{
 if(!/^(https?:\/\/|[a-zA-Z0-9.\-_/]+(?:#[a-zA-Z0-9.\-_]+)?)$/.test(url)) return label;
 return '<a href="'+url.replace(/\.md(?=#|$)/,'.html')+'">'+label+'</a>';
}).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');}
function render(md){let html='',table=false,code=false;
 for(const line of md.split(/\r?\n/)){
  if(line.startsWith('```')){if(table){html+='</tbody></table>';table=false}html+=code?'</code></pre>':'<pre><code>';code=!code;continue}
  if(code){html+=esc(line)+'\n';continue}
  if(line.trim().startsWith('|')){if(/^\|[\s:|\-]+\|$/.test(line.trim()))continue;
   const cells=line.trim().slice(1,-1).split('|');if(!table){html+='<table><tbody>';table=true}html+='<tr>'+cells.map(c=>'<td>'+inline(c.trim())+'</td>').join('')+'</tr>';continue}
  if(table){html+='</tbody></table>';table=false}
  const h=line.match(/^(#{1,6})\s+(.+)$/);if(h){html+='<h'+h[1].length+'>'+inline(h[2])+'</h'+h[1].length+'>';continue}
  if(line.trim())html+='<p>'+inline(line)+'</p>';
 }if(table)html+='</tbody></table>';if(code)html+='</code></pre>';return html;}
const docCss='body{max-width:940px;margin:40px auto;padding:0 24px 60px;background:#faf5eb;color:#49342d;font:18px/1.8 "Microsoft JhengHei",sans-serif}a{color:#745184}h1{line-height:1.35}table{width:100%;border-collapse:collapse;display:block;overflow:auto}td{border:1px solid #ded3c7;padding:10px}pre{overflow:auto;background:#e9e0f1;padding:18px}code{font-size:14px}svg{max-width:100%;height:auto}';
function document(title,body,back){return '<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><style>'+docCss+'</style><body><nav><a href="'+back+'">返回教學簡報</a></nav>'+body+'</body></html>';}
// Include the authoritative Wiki and source notes as readable offline snapshots.
fs.cpSync(path.join(root,'wiki'),path.join(out,'wiki'),{recursive:true});
fs.mkdirSync(path.join(out,'raw'),{recursive:true});
fs.cpSync(path.join(root,'raw'),path.join(out,'raw'),{recursive:true});
for(const dir of ['wiki','raw']){function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const full=path.join(p,e.name);if(e.isDirectory())walk(full);else if(e.name.endsWith('.md')){
 const rel=path.relative(out,full);const back=path.relative(path.dirname(full),path.join(out,'index.html')).replaceAll('\\','/');
 write(rel.replace(/\.md$/,'.html'),document(e.name,render(fs.readFileSync(full,'utf8').replace(/^\uFEFF/,'')),back));
 }}}walk(path.join(out,dir));}
// Wiki navigation includes project/check links; bundle these destinations as well.
for(const dir of ['checks']){fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true});for(const file of fs.readdirSync(path.join(out,dir))){if(file.endsWith('.md'))write(dir+'/'+file.replace(/\.md$/,'.html'),document(file,render(read(dir+'/'+file)),'../index.html'));}}
write('README.html',document('專案說明',render(read('README.md').replaceAll('slides/coffee-class/','')),'index.html'));
write('AGENTS.html',document('專案規則',render(read('AGENTS.md')),'index.html'));
for(const name of ['sources','workflow','submission'])write(name+'.html',document(name,render(read('slides/coffee-class/'+name+'.md').replaceAll('../../wiki/','wiki/').replaceAll('../../checks/','checks/')),'index.html'));
console.log('Built 18-slide offline HTML with bundled Wiki and source notes.');


for(const name of ['requirements','GIT-GUIDE']){write(name+'.html',document(name,render(read(name+'.md')),'index.html'));write(name+'.md',read(name+'.md'));}
write('AGENTS.md',read('AGENTS.md'));
write('assignment.html',document('作業成果：公主的女僕咖啡教室',render(read('slides/coffee-class/submission.md')),'index.html'));


