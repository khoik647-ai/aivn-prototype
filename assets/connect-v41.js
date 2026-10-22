// Bản mẫu F-PLUGINS (PR #1) — mô phỏng toàn bộ trong trình duyệt, không chạy tiến trình thật.
renderRail('agent');
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const V='x.y.z'; // phiên bản ghim do PR triển khai chọn (mục 5.4)
// ---------- Danh mục 8 mục (mục 5.4) ----------
const CATALOG=[
 {id:'filesystem',tab:'files',name:'Thư mục',desc:'Đọc và ghi một thư mục bạn chọn. Khác với “Thư mục được phép” của công cụ tệp AIVN.',logo:'folder',needs:'folder',pkg:'@modelcontextprotocol/server-filesystem',
  tools:[['read_text_file','Read the complete contents of a text file'],['write_file','Create a new file or overwrite an existing one'],['list_directory','List files and directories'],['search_files','Recursively search for files matching a pattern']]},
 {id:'fetch',tab:'web',name:'Đọc trang web',desc:'Tiến trình này tự mở mạng, kể cả khi “Cho phép truy cập mạng” đang tắt.',logo:'fetch',needs:'none',pkg:'mcp-fetch-server',tools:[['fetch_html','Fetch a website and return the content as HTML'],['fetch_markdown','Fetch a website and return the content as Markdown']]},
 {id:'brave',tab:'web',name:'Tìm kiếm Brave',desc:'Tìm trên Brave. Cần khoá API. Truy vấn tìm kiếm rời khỏi máy bạn.',logo:'brave',needs:'secret',secretVar:'BRAVE_API_KEY',pkg:'@modelcontextprotocol/server-brave-search',tools:[['brave_web_search','Performs a web search using the Brave Search API'],['brave_local_search','Searches for local businesses and places']]},
 {id:'huggingface',tab:'web',name:'Hugging Face',desc:'Máy chủ từ xa của Hugging Face. Đối số công cụ và kết quả được gửi tới huggingface.co.',logo:'huggingface',needs:'secret',optional:true,secretVar:'Authorization',url:'https://huggingface.co/mcp',
  tools:[['model_search','Search for ML models on the Hugging Face Hub'],['dataset_search','Search for datasets on the Hugging Face Hub'],['paper_search','Find ML research papers'],['hf_doc_search','Search the Hugging Face documentation']]},
 {id:'github',tab:'dev',name:'GitHub',desc:'Kho, issue và pull request trên GitHub. Cần mã truy cập.',logo:'github',needs:'secret',secretVar:'GITHUB_PERSONAL_ACCESS_TOKEN',pkg:'@modelcontextprotocol/server-github',
  tools:[['search_repositories','Search for GitHub repositories'],['get_file_contents','Get the contents of a file or directory'],['list_issues','List issues in a repository'],['create_issue','Create a new issue'],['list_pull_requests','List pull requests in a repository']]},
 {id:'memory',tab:'knowledge',name:'Ghi nhớ MCP',desc:'Bộ nhớ của riêng máy chủ MCP này, không ghi vào mục Ghi nhớ của AIVN.',logo:'memory',needs:'none',pkg:'@modelcontextprotocol/server-memory',
  tools:[['create_entities','Create multiple new entities in the knowledge graph'],['add_observations','Add new observations to existing entities'],['search_nodes','Search for nodes in the knowledge graph'],['read_graph','Read the entire knowledge graph']]},
 {id:'time',tab:'knowledge',name:'Giờ và múi giờ',desc:'Xem giờ theo múi giờ.',logo:'time',needs:'none',pkg:'@modelcontextprotocol/server-time',tools:[['get_current_time','Get current time in a specific timezone'],['convert_time','Convert time between timezones']]},
 {id:'thinking',tab:'knowledge',name:'Suy nghĩ từng bước',desc:'Máy chủ giữ các bước suy nghĩ trung gian.',logo:'thinking',needs:'none',pkg:'@modelcontextprotocol/server-sequential-thinking',tools:[['sequentialthinking','Dynamic and reflective problem-solving through thoughts']]},
];
const TABS=[['all','Tất cả'],['files','Tệp'],['web','Mạng'],['dev','Lập trình'],['knowledge','Tri thức'],['mine','Của tôi']];
const CAT=id=>CATALOG.find(c=>c.id===id);
// ---------- Mẫu AIVN AGENT (mục 7.2) ----------
const BUILTIN=[
 {id:'general',icon:'🤖',name:'Trợ lý tổng quát',description:'Cách làm việc mặc định, không thêm vai trò.',starters:[],suggest:[]},
 {id:'coder',icon:'💻',name:'Lập trình viên',description:'Đọc và sửa tệp trong thư mục được phép, nói ngắn.',starters:['Xem cấu trúc thư mục được phép và tóm tắt dự án.','Tìm chỗ gây lỗi trong tệp tôi chỉ ra.'],suggest:['filesystem']},
 {id:'docs',icon:'📄',name:'Đọc tài liệu',description:'Trả lời câu hỏi về tệp đính kèm, có trích chỗ tìm thấy.',starters:['Tóm tắt tệp đính kèm trong 5 ý.','Trong tài liệu này, hạn nộp là ngày nào?'],suggest:[]},
 {id:'research',icon:'🔎',name:'Tra cứu',description:'Tìm trên mạng khi mạng đang bật và ghi rõ địa chỉ nguồn.',starters:['Tìm 3 nguồn mới về Qwen3-VL và tóm tắt.'],suggest:['fetch']},
 {id:'files',icon:'🗂',name:'Thư ký tệp',description:'Liệt kê trước khi ghi; ghi đè và xoá vẫn chờ thẻ xin phép.',starters:['Liệt kê các tệp lớn nhất trong thư mục được phép.','Sắp xếp ảnh chụp màn hình theo tháng.'],suggest:['filesystem']},
];
// ---------- Dữ liệu lưu (giả lập userData/mcp.json, plugins-meta.json, settings) ----------
const KEY='aivn.plugins.v2';
function seed(){const t='2026-10-01T09:00:00.000Z';return{
  mcp:{mcpServers:{
    'memory':{command:'npx',args:['-y','@modelcontextprotocol/server-memory@'+V]},
    'thoi-tiet':{url:'https://mcp.example.vn/weather'}}},
  // mục 8.5: máy chủ có sẵn trước bản nâng cấp được gán duyệt + tự chạy một lần
  meta:{v:1,servers:{'memory':{catalogId:'memory',approvedAt:t,autoStart:true},'thoi-tiet':{catalogId:null,approvedAt:t,autoStart:true}}},
  master:true,lang:'vi',tpl:'general',userTpls:[],fileError:null,secretsSecure:true,hintDismissed:false}}
let DB=LS.get(KEY,null)||seed();const save=()=>LS.set(KEY,DB);
LANG=DB.lang;
const RT={state:{},err:{},logs:{}};
let UI={open:false,tab:'all',q:'',pane:'list',expanded:{},setup:{},plan:null,advMsg:null,advText:null,flash:null};
const servers=()=>DB.mcp.mcpServers;
const metaOf=k=>DB.meta.servers[k]||(DB.meta.servers[k]={catalogId:null,approvedAt:null,autoStart:false});
const keyOfCat=cid=>Object.keys(servers()).find(k=>(DB.meta.servers[k]||{}).catalogId===cid);
const isLoop=u=>/^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(u);
const safeName=k=>foldVi(k).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,24);
const now=()=>new Date().toISOString();
const log=(k,m)=>{(RT.logs[k]=RT.logs[k]||[]).push(new Date().toTimeString().slice(0,8)+'  '+m);RT.logs[k]=RT.logs[k].slice(-60)};
// ---------- Bí mật (mục 8.4) ----------
const SECRET_NAME=/TOKEN|KEY|SECRET|PASSWORD|PASSWD|CREDENTIAL|AUTH/i,SECRET_VAL=/^(sk-|ghp_|github_pat_|hf_|Bearer )/;
const isSecret=(n,v)=>typeof v==='string'&&v!==''&&(SECRET_NAME.test(n)||/^(proxy-)?authorization$/i.test(n)||SECRET_VAL.test(v));
const isRef=v=>v&&typeof v==='object'&&v.$aivnSecret;
function secretNames(s){return [...Object.entries(s.env||{}),...Object.entries(s.headers||{})].filter(([n,v])=>isRef(v)||isSecret(n,v)).map(([n])=>n)}
function extractSecrets(key,s){let n=0;for(const f of ['env','headers'])if(s[f])for(const [k,v] of Object.entries(s[f]))if(isSecret(k,v)){s[f][k]={$aivnSecret:`mcp:${safeName(key)}:${k}`};n++}return n} // giá trị bị bỏ, bản mẫu không giữ khoá
function redact(s){if(s.url)return s.url;return [s.command,...(s.args||[])].map(a=>SECRET_VAL.test(a)?'••••':a).join(' ')}
const kindOf=s=>s.url?(s.type==='sse'||/\/sse$/.test(s.url)?'sse':'http'):'stdio';
function inCatalog(s){if(s.url)return CATALOG.some(c=>c.url===s.url);const a=(s.args||[]).join(' ');return s.command==='npx'&&CATALOG.some(c=>c.pkg&&a.includes(c.pkg+'@'+V))}
const catMatch=s=>s.url?CATALOG.find(c=>c.url===s.url):CATALOG.find(c=>c.pkg&&(s.args||[]).some(a=>a===c.pkg||a.startsWith(c.pkg+'@')));
// ---------- Kiểm tra (mục 6.1) ----------
function validateServer(k,s){const kt=k.trim();if(kt.length<1||kt.length>64)return tr('Tên máy chủ phải dài 1–64 ký tự.');
 if(!s||typeof s!=='object'||Array.isArray(s))return tr('Máy chủ “{0}” cần command hoặc url.',k);
 if(s.command&&s.url)return tr('Máy chủ “{0}” chỉ được có command hoặc url.',k);
 if(!(typeof s.command==='string'&&s.command)&&!s.url)return tr('Máy chủ “{0}” cần command hoặc url.',k);
 if(s.args!==undefined&&!(Array.isArray(s.args)&&s.args.every(a=>typeof a==='string')))return tr('“args” của “{0}” phải là mảng chuỗi.',k);
 if(s.env!==undefined&&(typeof s.env!=='object'||Array.isArray(s.env)))return tr('“env” của “{0}” phải là đối tượng.',k);
 if(s.url){if(/^http:/i.test(s.url)&&!isLoop(s.url))return tr('“url” của “{0}” dùng http thì chỉ được trỏ tới máy này (localhost). Hãy dùng https.',k);if(!/^https?:\/\//i.test(s.url))return tr('Máy chủ “{0}” cần command hoặc url.',k)}
 if(s.type!==undefined&&s.type!=='sse')return tr('“type” của “{0}” chỉ được là “sse”.',k);
 if(s.timeout!==undefined&&!(Number.isInteger(s.timeout)&&s.timeout>=1000&&s.timeout<=600000))return tr('“timeout” của “{0}” phải từ 1.000 đến 600.000 ms.',k);
 return null}
function parseFile(text){if(new Blob([text]).size>262144)return{fatal:tr('Tệp mcp.json lớn hơn 256 KB.')};
 let j;try{j=JSON.parse(text)}catch{return{fatal:tr('Tệp không phải JSON hợp lệ.')}}
 if(!j||typeof j!=='object'||Array.isArray(j))return{fatal:tr('mcp.json phải là một đối tượng JSON.')};
 if(!j.mcpServers||typeof j.mcpServers!=='object'||Array.isArray(j.mcpServers))return{fatal:tr('Thiếu “mcpServers”. Nếu tệp dùng khoá “servers”, hãy đổi thành “mcpServers”.')};
 return{servers:j.mcpServers}}
const sig=s=>JSON.stringify([s.command||null,s.args||[],s.url||null,Object.keys(s.env||{}).sort(),Object.keys(s.headers||{}).sort()]);
// ---------- Trạng thái chạy ----------
function start(k){const s=servers()[k];if(!s)return;const m=metaOf(k);
 if(!DB.master){RT.state[k]='off';return render()}
 RT.state[k]='starting';delete RT.err[k];log(k,`start ${kindOf(s)}: ${redact(s)}`);render();
 setTimeout(()=>{if(!servers()[k]||RT.state[k]!=='starting')return;const e=validateServer(k,s)||(s.auth?tr('AIVN chưa hỗ trợ đăng nhập OAuth (trường auth) của máy chủ “{0}”.',k):null);
  if(e){RT.state[k]='error';RT.err[k]=e;log(k,'lỗi: '+e)}else{RT.state[k]='on';log(k,`listTools: ${toolsOf(k).length}`)}render()},window.FAST?150:1100)}
function stop(k){RT.state[k]='off';log(k,'stop');}
function toolsOf(k){const m=DB.meta.servers[k];const c=m&&m.catalogId&&CAT(m.catalogId);if(c)return c.tools;const n=safeName(k);return [[n+'_query','Sample tool reported by the server'],[n+'_list','Sample tool reported by the server']]}
function uiState(k){if(!k)return'available';const s=servers()[k];if(!s)return'available';const st=RT.state[k]||'off';return st}
const countOn=()=>Object.keys(servers()).filter(k=>RT.state[k]==='on').length;
const STLABEL={available:'Chưa kết nối','needs-setup':'Cần thiết lập',starting:'Đang kết nối…',on:'Đã kết nối',off:'Đã tắt',error:'Lỗi'};
// ---------- Thẻ xin phép (#approveCard, hàng đợi) ----------
const apQueue=[];let apCur=null,apTimer=null;
function askApproval(spec){return new Promise(res=>{apQueue.push({spec,res});if(!apCur)nextCard()})}
function nextCard(){apCur=apQueue.shift();const el=$('approveCard');clearInterval(apTimer);if(!apCur){el.className='';el.innerHTML='';return}
 const s=apCur.spec;let left=600;el.className='show'+(s.danger?' danger':'');
 const draw=()=>{el.innerHTML=`<div class="k">${tr('Thẻ xin phép')} · ${esc(s.tool)}${s.danger?`<span class="danger-tag">⚠ ${tr('Lệnh không thuộc danh mục')}</span>`:''}</div>
  <h3>${esc(s.title)}</h3><div id="apSub">${esc(s.sub||'')}</div>
  ${s.fields&&s.fields.length?`<dl class="apf">${s.fields.map(([a,b,c])=>`<dt>${esc(a)}</dt><dd>${c?`<code>${esc(b)}</code>`:esc(b)}</dd>`).join('')}</dl>`:''}
  ${s.preview?`<div class="pl">${s.preview.map(([n,c])=>`<div class="r"><b>${esc(n)}</b><code>${esc(c)}</code></div>`).join('')}</div>`:''}
  ${(s.lines||[]).map(l=>`<div class="apline">${l}</div>`).join('')}
  ${s.warn?`<div class="apwarn">⚠ ${esc(s.warn)}</div>`:''}
  ${s.alwaysLabel?`<label class="row small" style="gap:6px;margin-top:10px"><input type="checkbox" id="apAlways"> ${esc(s.alwaysLabel)}</label>`:''}<div class="apact">
   <span class="small muted" style="margin-right:auto">${tr('Tự từ chối sau {0}',`${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`)}</span>
   <button class="btn sm" onclick="apReason()">${tr('Từ chối kèm lý do')}</button>
   <button class="btn sm" onclick="apAnswer(false)">${tr('Từ chối')}<span class="kbd">Esc</span></button>
   <button class="btn sm pri" onclick="apAnswer(true)">${tr('Cho phép')}<span class="kbd" style="color:#fff;border-color:rgba(255,255,255,.5)">Ctrl+Enter</span></button></div><div id="apR"></div>`};
 draw();const keep=()=>{const c=$('apAlways');return c&&c.checked};
 apTimer=setInterval(()=>{left--;if(left<=0){apAnswer(false,{timeout:true});return}const ch=keep();const r=$('apR').innerHTML;draw();if($('apAlways'))$('apAlways').checked=ch;$('apR').innerHTML=r},1000);
 el.scrollIntoView({block:'nearest'})}
function apAnswer(ok,extra={}){if(!apCur)return;const always=!!($('apAlways')&&$('apAlways').checked);const c=apCur;apCur=null;c.res({ok,always,...extra});nextCard()}
function apReason(){$('apR').innerHTML=`<div class="row" style="margin-top:8px"><input class="inp" id="apRs" placeholder="${tr('Lý do…')}"><button class="btn sm" onclick="apAnswer(false,{reason:$('apRs').value})">${tr('Gửi')}</button></div>`;$('apRs').focus()}
// mục 3.5: đóng hộp thoại trước khi hiện thẻ, xong thì mở lại
async function withCard(spec){const was=UI.open;closeCA();const a=await askApproval(spec);if(was)openCA();return a}
const WARN=()=>tr('Máy chủ MCP là chương trình chạy trên máy bạn hoặc dịch vụ bên ngoài. Chúng có thể đọc và ghi dữ liệu. Chỉ thêm máy chủ bạn tin tưởng.');
function connectCard(k,s,{folder,autostartOnly,noToken}={}){const sn=secretNames(s),remote=s.url&&!isLoop(s.url);
 return{tool:'mcp_connect',title:tr('Cho phép kết nối “{0}”?',displayName(k)),sub:k,
  fields:[[tr('Loại'),kindOf(s)],[s.url?tr('Địa chỉ'):tr('Lệnh'),redact(s),1],...(folder?[[tr('Thư mục'),folder,1]]:[]),[tr('Khoá bí mật'),sn.length?sn.join(', '):tr('không có'),sn.length?1:0]],
  lines:[remote?'🌐 '+tr('Dữ liệu gửi tới máy chủ này rời khỏi máy bạn.'):'💻 '+tr('Chương trình này chạy trên máy bạn.'),...(folder?['📁 '+tr('Thư mục này khác “Thư mục được phép” của AIVN.')]:[]),...(noToken?['ℹ️ '+tr('Không có mã truy cập: máy chủ có thể từ chối yêu cầu.')]:[]),...(autostartOnly?['🔁 '+tr('Cho phép máy chủ này tự chạy mỗi khi mở AIVN.')]:[])],
  warn:WARN(),danger:!inCatalog(s),alwaysLabel:autostartOnly?null:tr('Tự kết nối lại máy chủ này khi mở AIVN')}}
function displayName(k){const m=DB.meta.servers[k];return m&&m.catalogId?tr(CAT(m.catalogId).name):k}
// ---------- Luồng bấm (mục 5.6) ----------
async function connectCatalog(cid){const c=CAT(cid);if(!DB.master)return;let k=keyOfCat(cid);
 if(k){const s=servers()[k];const m=metaOf(k);delete s.disabled;save();
  if(m.approvedAt){start(k);return}const a=await withCard(connectCard(k,s));if(!a.ok)return;m.approvedAt=now();m.autoStart=a.always;save();start(k);return}
 let folder=null,token=null;
 if(c.needs==='folder'){folder=await pickFolder();if(!folder)return}
 if(c.needs==='secret'){const st=UI.setup[cid];if(!st){UI.setup[cid]={v:''};render();setTimeout(()=>{const i=$('sec-'+cid);i&&i.focus()},0);return}
  token=(st.v||'').trim();if(!token&&!c.optional){$('sec-'+cid).focus();return}}
 k=servers()[cid]&&!(DB.meta.servers[cid]||{}).catalogId?cid+'-2':cid;
 const s=c.url?{url:c.url,timeout:120000}:{command:'npx',args:['-y',c.pkg+'@'+V,...(folder?[folder]:[])]};
 if(token){if(c.url)s.headers={[c.secretVar]:{$aivnSecret:`mcp:${safeName(k)}:${c.secretVar}`}};else s.env={[c.secretVar]:{$aivnSecret:`mcp:${safeName(k)}:${c.secretVar}`}}}
 const a=await withCard({...connectCard(k,s,{folder,noToken:c.optional&&!token}),title:tr('Cho phép kết nối “{0}”?',tr(c.name))});
 delete UI.setup[cid]; // từ chối / hết giờ: huỷ khoá trong bộ nhớ, không ghi tệp
 if(!a.ok){render();return}
 servers()[k]=s;DB.meta.servers[k]={catalogId:cid,approvedAt:now(),autoStart:a.always};save();start(k)}
async function connectKey(k){if(!DB.master)return;const s=servers()[k],m=metaOf(k);delete s.disabled;save();
 if(m.approvedAt){start(k);return}const a=await withCard(connectCard(k,s));if(!a.ok){render();return}m.approvedAt=now();m.autoStart=a.always;save();start(k)}
function disconnectKey(k){servers()[k].disabled=true;stop(k);save();render()}
async function removeKey(k){const ok=await modalAsk(tr('Gỡ máy chủ “{0}”?',displayName(k)),tr('Công cụ của máy chủ này sẽ biến mất. Các mục “Luôn cho phép” của nó cũng bị xoá. Khoá bí mật của máy chủ này bị xoá khỏi máy.'),tr('Gỡ'));
 if(!ok)return;stop(k);delete servers()[k];delete DB.meta.servers[k];delete RT.state[k];save();render()}
async function toggleAuto(k,on){const m=metaOf(k);if(!on){m.autoStart=false;save();return render()}
 const a=await withCard(connectCard(k,servers()[k],{autostartOnly:true}));if(a.ok){m.autoStart=true;if(!m.approvedAt)m.approvedAt=now();save()}render()}
// ---------- Hộp thoại Kết nối ứng dụng ----------
function openCA(opts={}){UI.open=true;if(opts.pane)UI.pane=opts.pane;if(opts.tab)UI.tab=opts.tab;$('caBack').classList.add('open');render();
 if(opts.scrollTo){UI.pane='list';UI.tab='all';UI.q='';UI.flash=opts.scrollTo;render();setTimeout(()=>{const e=$('card-'+opts.scrollTo);e&&e.scrollIntoView({block:'center'})},0)}
 if(UI.pane==='list')setTimeout(()=>$('caQ')&&$('caQ').focus(),0)}
function closeCA(){UI.open=false;$('caBack').classList.remove('open')}
function cardsFor(tab){const q=foldVi(UI.q);const out=[];
 for(const c of CATALOG){if(tab!=='all'&&c.tab!==tab)continue;const k=keyOfCat(c.id);
  const hay=[tr(c.name),c.name,c.id,k||'',c.pkg||'',c.url||'',tr(c.desc),c.desc,...c.tools.map(t=>t[0])].join(' ');if(q&&!foldVi(hay).includes(q))continue;out.push({cid:c.id,k,c})}
 if(tab==='all'||tab==='mine')for(const k of Object.keys(servers())){const m=DB.meta.servers[k]||{};if(m.catalogId)continue;const s=servers()[k];
  const hay=[k,redact(s),...toolsOf(k).map(t=>t[0])].join(' ');if(q&&!foldVi(hay).includes(q))continue;out.push({k,mine:true})}
 return out}
function srvCard(it){const k=it.k,c=it.c,id=it.cid||k,s=k&&servers()[k];let st=uiState(k);if(it.cid&&UI.setup[it.cid])st='needs-setup';
 const name=c?tr(c.name):k,desc=c?tr(c.desc):tr('Máy chủ MCP trong mcp.json của bạn.'),logo=c?c.logo:'modelcontextprotocol';
 const m=k?DB.meta.servers[k]||{}:{};
 let btn='';const dis=!DB.master?'disabled':'';
 if(st==='available'||st==='off')btn=`<button class="btn sm pri" data-testid="connect-apps-connect-${id}" ${dis} onclick="event.stopPropagation();${it.cid?`connectCatalog('${it.cid}')`:`connectKey('${esc(k)}')`}">${tr('Kết nối')}</button>`;
 else if(st==='on')btn=`<button class="btn sm" data-testid="connect-apps-connect-${id}" onclick="event.stopPropagation();disconnectKey('${esc(k)}')">${tr('Ngắt kết nối')}</button>`;
 else if(st==='error')btn=`<button class="btn sm" data-testid="connect-apps-connect-${id}" ${dis} onclick="event.stopPropagation();connectKey('${esc(k)}')">${tr('Thử lại')}</button>`;
 else if(st==='starting')btn=`<button class="btn sm" disabled>${tr('Đang kết nối…')}</button>`;
 const metaLine=s?`${kindOf(s)}${st==='on'?' · '+tr('{0} công cụ',toolsOf(k).length):''} · ${esc(redact(s))}`:(c.url?'http · '+c.url:'stdio · npx -y '+c.pkg+'@'+V);
 const setup=st==='needs-setup'?`<div class="setup" onclick="event.stopPropagation()"><label class="small muted">${c.secretVar}</label><input class="inp" type="password" id="sec-${c.id}" autocomplete="off" placeholder="${c.optional?'Bearer …':tr('Dán khoá vào đây')}" oninput="UI.setup['${c.id}'].v=this.value">
   <button class="btn sm pri" onclick="connectCatalog('${c.id}')">${tr('Tiếp tục')}</button><button class="btn sm ghost" onclick="delete UI.setup['${c.id}'];render()">${tr('Huỷ')}</button>
   <div class="small muted" style="flex-basis:100%">${c.optional?tr('Tuỳ chọn: chữ “Bearer …”. Bỏ trống vẫn kết nối được, nhưng yêu cầu có thể bị từ chối.'):tr('Khoá được mã hoá bằng kho khoá hệ điều hành, không ghi vào mcp.json.')}</div></div>`:'';
 const canExp=!!s;const ex=canExp&&UI.expanded[id];
 const exp=ex?`<div class="exp" onclick="event.stopPropagation()"><div class="tl"><div class="small" style="color:var(--tx3);margin-bottom:6px">${tr('Công cụ')}</div>${toolsOf(k).map(([n,d])=>`<div><code>${esc(n)}</code> <span>— ${esc(d.slice(0,200))}</span></div>`).join('')}</div>
   <div><div class="small" style="color:var(--tx3);margin-bottom:6px">${tr('Nhật ký (60 dòng cuối)')}</div><div class="log">${esc((RT.logs[k]||[]).join('\n'))||'—'}</div></div>
   <div class="row" style="grid-column:1/-1;gap:8px"><button class="btn sm" ${dis} onclick="connectKey('${esc(k)}')">${tr('Kết nối lại')}</button><button class="btn sm danger" onclick="removeKey('${esc(k)}')">${tr('Gỡ')}</button>
   <label class="row small" style="gap:6px;margin-left:8px"><input type="checkbox" ${m.autoStart?'checked':''} onchange="toggleAuto('${esc(k)}',this.checked)"> ${tr('Tự kết nối khi mở AIVN')}</label></div></div>`:'';
 return `<div class="srv ${canExp?'clickable':''} ${UI.flash===id||UI.flash===k?'flash':''}" id="card-${esc(id)}" data-testid="connect-apps-card-${esc(id)}" ${canExp?`onclick="UI.expanded['${esc(id)}']=!UI.expanded['${esc(id)}'];render()"`:''}>
  <div class="top">${logoTile(logo,34)}<span class="nm">${esc(name)}</span><span class="st ${st}">${tr(STLABEL[st])}</span><span style="flex:1"></span>${btn}</div>
  <div class="d">${desc}</div><div class="meta">${metaLine}</div>
  ${st==='error'?`<div class="err">${esc(RT.err[k]||'')}</div>`:''}${s&&st==='off'&&!m.approvedAt?`<div class="small" style="margin:4px 0 0 44px;color:var(--warn)">${tr('Chưa được duyệt: bấm Kết nối để xin phép.')}</div>`:''}${setup}${exp}</div>`}
function renderCA(){const n=countOn(),M=$('caModal');
 const head=`<div class="mh"><h2>${tr('Kết nối ứng dụng')}</h2><span class="badge ${n?'on':''}" data-testid="connect-apps-count" aria-live="polite">${n?tr('{0} đã kết nối',n):tr('Chưa kết nối')}</span><button class="x" onclick="closeCA()">✕</button></div>`;
 const foot=`<div class="mf"><div class="row"><button class="btn sm" data-testid="connect-apps-import" onclick="UI.pane='import';UI.plan=null;render()">${tr('Nhập mcp.json…')}</button><span style="flex:1"></span>
   <button class="btn sm ghost" data-testid="connect-apps-advanced" onclick="UI.pane='advanced';UI.advText=null;UI.advMsg=null;render()">${tr('Nâng cao: mcp.json')}</button></div><div class="warnline">⚠ ${WARN()}</div></div>`;
 let mid='';
 if(UI.pane==='list'){const list=UI.tab==='all'?null:cardsFor(UI.tab);
  let body='';
  if(UI.tab==='all'){for(const [t,l] of TABS.slice(1)){const its=cardsFor(t==='mine'?'mine':t).filter(i=>t==='mine'?i.mine:true);if(!its.length)continue;body+=`<div class="grp">${tr(l)}</div>`+its.map(srvCard).join('')}}
  else body=list.map(srvCard).join('');
  if(!body)body=`<div class="empty">${UI.q?tr('Không thấy “{0}”. Bạn có thể nhập tệp mcp.json.',esc(UI.q)):UI.tab==='mine'?tr('Chưa có máy chủ riêng. Nhập mcp.json hoặc sửa ở phần Nâng cao.'):''}</div>`;
  mid=`<div class="mq"><div class="search">${ICONS.search}<input class="inp" id="caQ" data-testid="connect-apps-q" placeholder="${tr('Tìm ứng dụng, máy chủ, công cụ…')}" value="${esc(UI.q)}"></div></div>
   <div class="tabs">${TABS.map(([id,l])=>`<button class="tab ${UI.tab===id?'on':''}" data-testid="connect-apps-tab-${id}" onclick="UI.tab='${id}';render()">${tr(l)}</button>`).join('')}</div>
   ${!DB.master?`<div class="apwarn" style="margin:10px 18px 0">${tr('Công tắc “Cho AIVN AGENT dùng công cụ MCP” đang tắt. Bật lại trong cài đặt để kết nối.')}</div>`:''}
   <div class="mlist scroll" id="caList">${body}</div>`}
 else if(UI.pane==='import')mid=importPane();else mid=advPane();
 M.innerHTML=head+mid+foot;
 const q=$('caQ');if(q)q.oninput=e=>{UI.q=e.target.value;const p=e.target.selectionStart;renderCA();const n2=$('caQ');n2.focus();n2.setSelectionRange(p,p)};
 if(UI.flash)setTimeout(()=>{UI.flash=null},1700)}
// ---------- Nhập (mục 6) ----------
const SAMPLE_NAME='mcp-tu-LM-Studio.json';
const SAMPLE=JSON.stringify({mcpServers:{
 'memory':{command:'npx',args:['-y','@modelcontextprotocol/server-memory@'+V]},
 'filesystem':{command:'npx',args:['-y','@modelcontextprotocol/server-filesystem@'+V,'D:\\DuAn\\AIVN'],env:{NODE_ENV:'production'}},
 'hf-mcp-server':{url:'https://huggingface.co/mcp',headers:{Authorization:'Bearer hf_mauxxxxxxxxxxxx'},timeout:120000},
 'sqlite cua hang':{command:'uvx',args:['mcp-server-sqlite','--db-path','D:\\data\\cuahang.db']},
 'thoi-tiet':{url:'https://weather.example.org/mcp'},
 'nas-nha':{url:'http://192.168.1.20:8080/mcp'},
 'lich-cong-ty':{url:'https://calendar.example.com/mcp',auth:{type:'oauth',CLIENT_SECRET:'abc123'}}}},null,2);
function makePlan(text,file){const r=parseFile(text);if(r.fatal)return{file,fatal:r.fatal};
 const plan={file,add:[],skip:[],conflict:[],rejected:[],oauthSkipped:[],secretCount:0,secretsSecure:DB.secretsSecure};const seen={};
 for(const [k0,s0] of Object.entries(r.servers)){const k=k0.trim(),s=JSON.parse(JSON.stringify(s0));
  const sn=safeName(k);const clash=Object.keys(servers()).concat(Object.keys(seen)).find(x=>x!==k&&safeName(x)===sn);
  if(clash){plan.rejected.push({name:k,error:tr('Tên “{0}” và “{1}” trùng nhau sau khi chuẩn hoá.',clash,k)});continue}seen[k]=1;
  const e=validateServer(k,s);if(e){plan.rejected.push({name:k,error:e});continue}
  if(s.auth){plan.oauthSkipped.push({name:k,kind:kindOf(s),cmd:redact(s),error:tr('AIVN chưa hỗ trợ đăng nhập OAuth (trường auth) của máy chủ “{0}”.',k)});continue}
  const cur=servers()[k];
  if(cur&&sig(cur)===sig(s)){plan.skip.push({name:k,error:tr('Đã có “{0}”.',k)});continue}
  const n=secretNames(s).filter(x=>{const v=(s.env||{})[x]??(s.headers||{})[x];return !isRef(v)}).length;plan.secretCount+=n;
  (cur?plan.conflict:plan.add).push({name:k,kind:kindOf(s),cmd:redact(s),server:s,catalog:inCatalog(s),old:cur?redact(cur):null})}
 return plan}
function importPane(){const p=UI.plan;
 const grp=(title,arr,f)=>arr.length?`<div class="grp">${title}</div><div class="pl">${arr.map(f).join('')}</div>`:'';
 return `<div class="pane scroll"><div class="row" style="margin-bottom:10px"><button class="btn sm ghost" onclick="UI.pane='list';render()">${tr('← Quay lại')}</button><b>${tr('Nhập mcp.json…')}</b></div>
  <div class="row"><button class="btn sm" onclick="$('fileIn').click()">📂 ${tr('Chọn tệp…')}</button><button class="btn sm ghost" onclick="UI.plan=makePlan(SAMPLE,SAMPLE_NAME);render()">${tr('(bản mẫu) Dùng tệp ví dụ')}</button></div>
  ${!p?`<div class="empty">${tr('Chọn tệp mcp.json để xem tóm tắt trước khi nhập.')}</div>`:p.fatal?`<div class="msg-bad" style="margin-top:12px">${tr('Tệp: {0}',esc(p.file))} — ${esc(p.fatal)}</div>`:`
  <div class="small muted" style="margin:12px 0 4px">${tr('Tệp: {0}',esc(p.file))}</div>
  ${grp('✚ '+tr('Sẽ thêm ({0})',p.add.length),p.add,a=>`<div class="r">${logoTile(catMatch(a.server)?.logo||'modelcontextprotocol',22)}<b>${esc(a.name)}</b><span class="st">${a.kind}</span><code>${esc(a.cmd)}</code>${a.catalog?'':`<span class="danger-tag">⚠</span>`}</div>`)}
  ${grp('⇄ '+tr('Trùng tên, khác nội dung ({0})',p.conflict.length),p.conflict,a=>`<div class="r"><b>${esc(a.name)}</b><code>${esc(a.old)} → ${esc(a.cmd)}</code><button class="btn sm danger" onclick="replaceOne('${esc(a.name)}')">${tr('Thay thế')}</button></div>`)}
  ${grp('↷ '+tr('Bỏ qua ({0})',p.skip.length),p.skip,a=>`<div class="r"><span class="muted">${esc(a.error)}</span></div>`)}
  ${grp('🔒 '+tr('Chưa hỗ trợ OAuth ({0})',p.oauthSkipped.length),p.oauthSkipped,a=>`<div class="r"><b>${esc(a.name)}</b><span class="muted small">${esc(a.error)}</span></div>`)}
  ${grp('✕ '+tr('Không nhập được ({0})',p.rejected.length),p.rejected,a=>`<div class="r"><b>${esc(a.name)}</b><span class="msg-bad">${esc(a.error)}</span></div>`)}
  ${p.secretCount?`<div class="small" style="margin:4px 0 10px">🔑 ${tr('Đã tách {0} khoá bí mật ra khỏi tệp. Chúng được mã hoá bằng kho khoá hệ điều hành và không ghi dạng chữ vào mcp.json.',p.secretCount)}</div>`:''}
  <div class="row"><span style="flex:1"></span>${p.add.length?`<button class="btn pri" onclick="applyImport()">${tr('Nhập các mục mới')} (${p.add.length})</button>`:`<span class="muted small">${tr('Không có mục mới để nhập.')}</span>`}</div>`}</div>`}
$('fileIn').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>262144){UI.plan={file:f.name,fatal:tr('Tệp mcp.json lớn hơn 256 KB.')};render();return}f.text().then(t=>{UI.plan=makePlan(t,f.name);render()});e.target.value=''};
async function applyImport(){const p=UI.plan;
 const a=await withCard({tool:'mcp_import',title:tr('Nhập {0} máy chủ từ mcp.json?',p.add.length),sub:p.file,preview:p.add.map(x=>[x.name,x.cmd]),
  lines:p.secretCount?['🔑 '+tr('Đã tách {0} khoá bí mật ra khỏi tệp. Chúng được mã hoá bằng kho khoá hệ điều hành và không ghi dạng chữ vào mcp.json.',p.secretCount)]:[],
  warn:WARN(),danger:p.add.some(x=>!x.catalog),alwaysLabel:tr('Tự kết nối các máy chủ này khi mở AIVN')});
 if(!a.ok)return;
 for(const x of p.add){const s=JSON.parse(JSON.stringify(x.server));extractSecrets(x.name,s);servers()[x.name]=s;const cm=catMatch(s);
  DB.meta.servers[x.name]={catalogId:cm&&!keyOfCat(cm.id)?cm.id:null,approvedAt:now(),autoStart:a.always}}
 save();const names=p.add.map(x=>x.name);UI.plan=null;UI.pane='list';UI.tab='all';render();names.forEach(start)}
async function replaceOne(name){const x=UI.plan.conflict.find(c=>c.name===name);
 const a=await withCard({tool:'mcp_replace',title:tr('Thay thế máy chủ “{0}”?',name),sub:name,fields:[[tr('Lệnh cũ'),x.old,1],[tr('Lệnh mới'),x.cmd,1]],warn:tr('Tiến trình cũ sẽ bị dừng.'),danger:true,alwaysLabel:null});
 if(!a.ok)return;stop(name);const s=JSON.parse(JSON.stringify(x.server));extractSecrets(name,s);servers()[name]=s;const m=metaOf(name);m.approvedAt=now();m.autoStart=false;save();
 UI.plan.conflict=UI.plan.conflict.filter(c=>c.name!==name);UI.plan.skip.push({name,error:tr('Đã có “{0}”.',name)});render();start(name)}
// ---------- Nâng cao (mục 5.6, 6.3, 6.4) ----------
function advPane(){const txt=UI.advText??JSON.stringify(DB.mcp,null,2);
 return `<div class="pane scroll"><div class="row" style="margin-bottom:8px"><button class="btn sm ghost" onclick="UI.pane='list';render()">${tr('← Quay lại')}</button><b>${tr('Nâng cao: mcp.json')}</b><span class="small muted">userData/mcp.json</span></div>
  ${DB.fileError?`<div class="msg-bad">${tr('Lỗi tệp: {0}',esc(DB.fileError))}</div>`:''}
  <textarea class="inp code" id="advTxt" data-testid="connect-apps-json" spellcheck="false" oninput="UI.advText=this.value">${esc(txt)}</textarea>
  <div class="small muted" style="margin:6px 0">ℹ️ ${tr('Đổi lệnh, đối số, địa chỉ, đầu mục hoặc tên biến thì máy chủ mất duyệt và phải qua thẻ xin phép.')}</div>
  <div class="row"><button class="btn pri sm" onclick="saveAdv()">${tr('Lưu & kết nối lại')}</button><button class="btn sm" onclick="exportJson()">${tr('Xuất mcp.json…')}</button><span id="advMsg">${UI.advMsg||''}</span></div></div>`}
function saveAdv(){const text=$('advTxt').value;const r=parseFile(text);
 const fail=m=>{UI.advMsg=`<span class="msg-bad">${esc(tr('Không lưu: {0}',m))}</span>`;UI.advText=text;render()};
 if(r.fatal)return fail(r.fatal);const keys=Object.keys(r.servers);
 for(const k of keys){const e=validateServer(k,r.servers[k]);if(e)return fail(e)}
 for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++)if(safeName(keys[i])===safeName(keys[j]))return fail(tr('Tên “{0}” và “{1}” trùng nhau sau khi chuẩn hoá.',keys[i],keys[j]));
 const old=servers();let lost=0;
 for(const k of Object.keys(old))if(!r.servers[k]){stop(k);delete DB.meta.servers[k];delete RT.state[k]}
 const restart=[];
 for(const k of keys){const s=r.servers[k];extractSecrets(k,s);const m=metaOf(k);
  if(!old[k]||sig(old[k])!==sig(s)){if(old[k])stop(k);if(m.approvedAt||!old[k])lost++;m.approvedAt=null;m.autoStart=false;RT.state[k]='off'}
  else if(m.approvedAt&&!s.disabled)restart.push(k);
  if(!m.catalogId){const cm=catMatch(s);if(cm&&!keyOfCat(cm.id))m.catalogId=null}}
 DB.mcp={...JSON.parse(text),mcpServers:r.servers};DB.fileError=null;save();
 UI.advText=null;UI.advMsg=`<span class="msg-ok">${lost?tr('Đã lưu. {0} máy chủ cần cho phép lại trước khi chạy.',lost):tr('Đã lưu.')}</span>`;render();restart.forEach(start)}
async function exportJson(){const ok=await modalAsk(tr('Xuất mcp.json…'),tr('Tệp xuất không có khoá bí mật. Máy khác phải nhập lại khoá.'),tr('Xuất'));if(!ok)return;
 const out={mcpServers:{}};for(const [k,s0] of Object.entries(servers())){if(s0.disabled)continue;const s=JSON.parse(JSON.stringify(s0));delete s.disabled;
  for(const f of ['env','headers'])if(s[f]){for(const [n,v] of Object.entries(s[f]))if(isRef(v))delete s[f][n];if(!Object.keys(s[f]).length)delete s[f]}out.mcpServers[k]=s}
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{type:'application/json'}));a.download='mcp.json';a.click()}
// ---------- Hộp thoại hỏi (modalAsk) và chọn thư mục (mô phỏng hệ điều hành) ----------
function modalAsk(title,body,okLabel){return new Promise(res=>{$('askModal').innerHTML=`<div class="mh"><h2>${esc(title)}</h2></div><div style="padding:0 18px 6px;color:var(--tx2)">${esc(body)}</div>
  <div class="row" style="padding:14px 18px;justify-content:flex-end"><button class="btn" id="askNo">${tr('Huỷ')}</button><button class="btn pri" id="askYes">${esc(okLabel)}</button></div>`;
 $('askBack').classList.add('open');const done=v=>{$('askBack').classList.remove('open');res(v)};$('askNo').onclick=()=>done(false);$('askYes').onclick=()=>done(true)})}
function pickFolder(){return new Promise(res=>{const F=['D:\\DuAn\\AIVN','C:\\Users\\Khoi\\Documents','C:\\Users\\Khoi\\Desktop\\Bai tap'];let sel=0;
 const draw=()=>{$('osDlg').innerHTML=`<div class="t">📁 ${tr('Chọn thư mục')}<span style="flex:1"></span><span style="color:#6b7280;font-size:11px">${tr('Mô phỏng hộp thoại chọn thư mục của hệ điều hành')}</span></div><div style="padding:6px 0">${F.map((f,i)=>`<div class="f ${i===sel?'on':''}" data-i="${i}">📁 ${f}</div>`).join('')}</div>
  <div class="b"><button id="osNo">${tr('Huỷ')}</button><button class="p" id="osYes">${tr('Chọn')}</button></div>`;
  $('osDlg').querySelectorAll('.f').forEach(e=>e.onclick=()=>{sel=+e.dataset.i;draw()});$('osNo').onclick=()=>done(null);$('osYes').onclick=()=>done(F[sel])};
 const done=v=>{$('osBack').classList.remove('open');res(v)};draw();$('osBack').classList.add('open')})}
// ---------- Mẫu AIVN AGENT (mục 7) ----------
const allTpls=()=>BUILTIN.map(t=>({...t,builtin:true})).concat(DB.userTpls);
const curTpl=()=>allTpls().find(t=>t.id===DB.tpl)||BUILTIN[0];
const tName=t=>t.builtin?tr(t.name):t.name;
let tplEdit=null;
function renderTpl(){const M=$('tplModal');
 if(tplEdit){M.innerHTML=`<div class="mh"><h2>${tr('Tạo mẫu của tôi')}</h2><button class="x" onclick="tplEdit=null;renderTpl()">✕</button></div><div style="padding:0 18px 14px;overflow:auto">
  <label class="f">${tr('Tên mẫu')}</label><input class="inp" id="te_n" maxlength="40" value="${esc(tplEdit.name)}">
  <label class="f" style="margin-top:10px">${tr('Đoạn vai trò')}</label><textarea class="inp" id="te_a" rows="5" maxlength="4000">${esc(tplEdit.addendum||'')}</textarea>
  <label class="f" style="margin-top:10px">${tr('Câu gợi ý (mỗi dòng một câu, tối đa 6)')}</label><textarea class="inp" id="te_s" rows="3">${esc((tplEdit.starters||[]).join('\n'))}</textarea>
  <div class="small muted" style="margin-top:6px">${tr('Tên tối đa 40 ký tự, đoạn vai trò tối đa 4.000 ký tự.')}</div>
  <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" onclick="tplEdit=null;renderTpl()">${tr('Huỷ')}</button><button class="btn pri" onclick="saveTpl()">${tr('Lưu')}</button></div></div>`;return}
 const row=t=>{const cur=t.id===DB.tpl;const sug=(t.suggest||[]).map(id=>tr(CAT(id).name));
  return `<div class="tpl ${cur?'cur':''}"><div class="row"><span style="font-size:20px">${t.icon||'⭐'}</span><b>${esc(tName(t))}</b>${cur?`<span class="st on">${tr('Đang dùng')}</span>`:''}<span style="flex:1"></span>
   ${cur?'':`<button class="btn sm pri" data-testid="agent-tpl-apply-${t.id}" onclick="applyTpl('${t.id}')">${tr('Dùng mẫu này')}</button>`}</div>
   <div class="small" style="color:var(--tx2);margin:4px 0 0 30px">${esc(t.builtin?tr(t.description):t.description||'')}</div>
   ${sug.length?`<div class="small" style="margin:5px 0 0 30px;color:var(--tx3)">${(t.suggest||[]).map(id=>logoTile(CAT(id).logo,15)).join('')} ${tr('Gợi ý kết nối: {0}',sug.join(', '))}</div>`:''}
   <div class="row" style="margin:6px 0 0 30px;gap:6px">${t.builtin?(t.id!=='general'?`<button class="btn sm ghost" onclick="copyTpl('${t.id}')">${tr('Lưu thành mẫu của tôi')}</button>`:''):`<button class="btn sm ghost" onclick="renameTpl('${t.id}')">${tr('Đổi tên')}</button><button class="btn sm ghost" onclick="tplEdit={...DB.userTpls.find(x=>x.id==='${t.id}')};renderTpl()">${tr('Sửa')}</button><button class="btn sm ghost danger" onclick="delTpl('${t.id}')">${tr('Xoá')}</button>`}</div></div>`};
 M.innerHTML=`<div class="mh"><h2>${tr('Mẫu AIVN AGENT')}</h2><button class="x" onclick="$('tplBack').classList.remove('open')">✕</button></div>
  <div style="padding:0 18px 4px" class="small muted">${tr('Mẫu chỉ thêm một đoạn vai trò vào lời nhắc. Mẫu không bật công tắc và không tự kết nối ứng dụng. Khác với cấu hình mẫu của Trò chuyện.')}</div>
  <div style="overflow:auto;padding:8px 18px 4px"><div class="grp">${tr('Mẫu gắn sẵn')}</div>${allTpls().filter(t=>t.builtin).map(row).join('')}
  ${DB.userTpls.length?`<div class="grp">${tr('Mẫu của tôi')}</div>${DB.userTpls.map(t=>row({...t,builtin:false})).join('')}`:''}</div>
  <div class="row" style="padding:12px 18px;border-top:1px solid var(--line)"><button class="btn sm" onclick="tplEdit={id:null,name:'',addendum:'',starters:[]};renderTpl()">＋ ${tr('Tạo mẫu của tôi')}</button></div>`}
function openTpl(){tplEdit=null;renderTpl();$('tplBack').classList.add('open')}
function applyTpl(id){DB.tpl=id;DB.hintDismissed=false;save();$('tplBack').classList.remove('open');render()}
const uid=()=>'user-'+Math.random().toString(36).slice(2,10).padEnd(8,'0');
function copyTpl(id){const b=BUILTIN.find(x=>x.id===id);if(DB.userTpls.length>=30)return;DB.userTpls.push({id:uid(),icon:b.icon,name:tr('Bản sao của {0}',tr(b.name)).slice(0,40),description:tr(b.description),addendum:'',starters:b.starters.map(s=>tr(s)),suggest:b.suggest.slice()});save();renderTpl()}
function saveTpl(){const n=$('te_n').value.trim().slice(0,40);if(!n)return $('te_n').focus();const a=$('te_a').value.slice(0,4000),st=$('te_s').value.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,6).map(x=>x.slice(0,200));
 if(tplEdit.id){Object.assign(DB.userTpls.find(x=>x.id===tplEdit.id),{name:n,addendum:a,starters:st})}else{if(DB.userTpls.length>=30)return;DB.userTpls.push({id:uid(),icon:'⭐',name:n,description:a.slice(0,160),addendum:a,starters:st,suggest:[]})}
 tplEdit=null;save();renderTpl();render()}
async function renameTpl(id){const t=DB.userTpls.find(x=>x.id===id);const n=prompt(tr('Đổi tên'),t.name);if(n&&n.trim()){t.name=n.trim().slice(0,40);save();renderTpl();render()}}
function delTpl(id){DB.userTpls=DB.userTpls.filter(x=>x.id!==id);if(DB.tpl===id)DB.tpl='general';save();renderTpl();render()}
// ---------- Trang AIVN AGENT ----------
function renderPage(){const n=countOn(),t=curTpl();
 document.documentElement.lang=LANG==='zh'?'zh-CN':LANG;
 $('o_draft').textContent='⚠ '+tr('Bản nháp theo thiết kế nháp F-PLUGINS (PR #1), chưa phải thiết kế chính thức')+' · '+tr('Dữ liệu mẫu · lưu trong trình duyệt');
 $('o_lang').textContent=tr('Ngôn ngữ giao diện')+':';$('o_reset').textContent=tr('↺ Đặt lại');$('o_model').textContent=tr('Mô hình: Qwen3-VL 4B · chạy trên máy');
 document.querySelectorAll('#langSeg button').forEach(b=>b.classList.toggle('on',b.dataset.l===LANG));
 $('caBtn').innerHTML=`🔌 ${tr('Kết nối ứng dụng')}${n?`<span class="cnt-badge">${tr('{0} đã kết nối',n)}</span>`:''}`;
 $('tplBtn').textContent=`${t.icon||'⭐'} ${tr('Mẫu: {0}',tName(t))}`;
 const miss=(t.suggest||[]).filter(id=>{const k=keyOfCat(id);return !(k&&RT.state[k]==='on')});
 $('tplHint').innerHTML=miss.length&&!DB.hintDismissed?`<div class="tplhint">💡 ${tr('Mẫu này dùng được với: {0}',miss.map(id=>tr(CAT(id).name)).join(', '))}${miss.map(id=>`<button class="btn sm pri" onclick="connectCatalog('${id}')">${tr('Kết nối')}</button>`).join('')}<span style="flex:1"></span><button class="x" style="font-size:15px" onclick="DB.hintDismissed=true;save();renderPage()">✕</button></div>`:'';
 const starters=(t.builtin===false?t.starters:(t.starters||[]).map(s=>tr(s)))||[];
 $('msgs').innerHTML=`<div class="greet"><div class="b"><div class="av">AI</div><div>${tr('Xin chào! Mình là AIVN AGENT. Mình làm việc trên máy bạn và luôn hỏi trước khi làm việc quan trọng.')}</div></div>
  <div id="chips">${starters.map(s=>`<button class="chipq" onclick="$('inp').value=this.textContent;$('inp').focus()">${esc(s)}</button>`).join('')}</div></div>`;
 $('inp').placeholder=tr('Nhắn cho AIVN AGENT…');$('sendBtn').textContent=tr('Gửi');
 $('mcpBadges').innerHTML=Object.keys(servers()).filter(k=>['on','error'].includes(RT.state[k])).map(k=>{const m=DB.meta.servers[k]||{};const c=m.catalogId&&CAT(m.catalogId);
  return `<span class="mb" onclick="openCA({scrollTo:'${m.catalogId||esc(k)}'})" title="${esc(k)}">${logoTile(c?c.logo:'modelcontextprotocol',16)}${esc(displayName(k))}<span class="d" style="background:${RT.state[k]==='on'?'var(--ok)':'var(--bad)'}"></span></span>`}).join('');
 $('agentSettings').innerHTML=`<div class="small muted" style="margin:0 2px 10px;font-weight:600">${tr('Cài đặt AIVN AGENT')}</div>
  <div class="sec"><h4>🔌 ${tr('Kết nối ứng dụng')}</h4><div class="srow"><span class="badge ${n?'on':''}">${n?tr('{0} đã kết nối',n):tr('Chưa kết nối')}</span></div>
   <button class="btn sm pri" style="width:100%;justify-content:center" data-testid="connect-apps-settings" onclick="openCA({pane:'list'})">${tr('Kết nối ứng dụng')}</button>
   <div style="margin-top:8px"><a href="#" class="small" onclick="openCA({pane:'advanced'});return false">${tr('Nâng cao: mcp.json')}</a></div>
   <div class="srow" style="margin-top:10px"><div class="sw ${DB.master?'on':''}" onclick="toggleMaster()"></div>${tr('Cho AIVN AGENT dùng công cụ MCP')}</div></div>
  <div class="sec"><h4>📁 ${tr('Thư mục được phép')}</h4><div class="small" style="font-family:monospace;color:var(--tx2)">C:\\Users\\Khoi\\Documents\\AIVN</div><button class="btn sm ghost" style="margin-top:6px">＋ ${tr('Thêm thư mục')}</button></div>
  <div class="sec"><div class="srow"><div class="sw"></div>${tr('Cho phép truy cập mạng')}</div><div class="srow"><div class="sw"></div>${tr('Tự làm không hỏi')}</div><div class="small muted">${tr('Không bao giờ áp dụng cho công cụ MCP.')}</div></div>
  <div class="sec"><h4>✅ ${tr('Luôn cho phép')}</h4><div class="small muted">${tr('Chưa có công cụ nào.')}</div></div>`}
function toggleMaster(){DB.master=!DB.master;save();if(!DB.master){Object.keys(servers()).forEach(k=>{if(RT.state[k]!=='off')stop(k)});render()}else{render();Object.keys(servers()).forEach(k=>{const m=metaOf(k);if(m.autoStart&&m.approvedAt&&!servers()[k].disabled)start(k)})}}
function render(){renderPage();if(UI.open)renderCA()}
// ---------- Ctrl+K ----------
const CMDS=[['🔌','Kết nối ứng dụng',()=>openCA({pane:'list'})],['⭐','Mẫu AIVN AGENT',()=>openTpl()],['💬','Trò chuyện mới',()=>{}],['🔍','Khám phá mô hình',()=>location.href='models.html'],['💼','Kinh doanh',()=>location.href='products.html']];
let palSel=0;
function openPal(){palSel=0;const draw=q=>{const its=CMDS.filter(c=>!q||foldVi(tr(c[1])+' '+c[1]).includes(foldVi(q)));palSel=Math.min(palSel,Math.max(0,its.length-1));
  $('palList').innerHTML=its.map((c,i)=>`<div class="pi ${i===palSel?'on':''}" data-i="${i}">${c[0]} ${tr(c[1])}</div>`).join('');
  $('palList').querySelectorAll('.pi').forEach(e=>e.onclick=()=>run(its[+e.dataset.i]));return its};
 const run=c=>{$('palBack').classList.remove('open');c&&c[2]()};
 $('pal').innerHTML=`<input id="palQ" placeholder="${tr('Gõ lệnh…')}"><div class="small muted" style="padding:6px 16px 2px">${tr('Lệnh nhanh')}</div><div id="palList" style="padding-bottom:6px"></div>`;
 let its=draw('');$('palBack').classList.add('open');const q=$('palQ');q.focus();
 q.oninput=()=>{its=draw(q.value)};q.onkeydown=e=>{if(e.key==='ArrowDown'){palSel=Math.min(palSel+1,its.length-1);its=draw(q.value);e.preventDefault()}else if(e.key==='ArrowUp'){palSel=Math.max(palSel-1,0);its=draw(q.value);e.preventDefault()}else if(e.key==='Enter')run(its[palSel]);else if(e.key==='Escape')$('palBack').classList.remove('open')}}
document.addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPal();return}
 if(apCur&&!$('palBack').classList.contains('open')){if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();apAnswer(true)}else if(e.key==='Escape'&&document.activeElement?.id!=='apRs'){e.preventDefault();apAnswer(false)}return}
 if(e.key==='Escape'){if($('palBack').classList.contains('open'))$('palBack').classList.remove('open');else if($('tplBack').classList.contains('open'))$('tplBack').classList.remove('open');else if(UI.open)closeCA()}});
['caBack','tplBack','palBack'].forEach(id=>$(id).addEventListener('mousedown',e=>{if(e.target.id===id){if(id==='caBack')closeCA();else $(id).classList.remove('open')}}));
$('caBtn').onclick=()=>openCA({pane:'list'});$('tplBtn').onclick=openTpl;
$('langSeg').querySelectorAll('button').forEach(b=>b.onclick=()=>{LANG=DB.lang=b.dataset.l;save();render();if($('tplBack').classList.contains('open'))renderTpl();if(apCur){const c=apCur;apQueue.unshift(c);apCur=null;nextCard()}});
$('o_reset').onclick=()=>{localStorage.removeItem(KEY);location.reload()};
// Khởi động: chỉ autoStart && approvedAt && !disabled (mục 8.5)
render();setTimeout(()=>{Object.keys(servers()).forEach(k=>{const m=metaOf(k);if(m.autoStart&&m.approvedAt&&!servers()[k].disabled)start(k)})},window.FAST?0:400);
if(location.hash==='#open')openCA({pane:'list'});
