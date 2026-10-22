// Khám phá mô hình · bản nháp 2 theo issue #44 (bản mẫu tĩnh, dữ liệu HF thật lấy một lần ngày 2026-10-23, xem README)
// Không gọi mạng: "mở kho" = đọc danh sách tệp đã lưu sẵn trong assets/data/models-hf-2026-10-23.js
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GiB=2**30;
const DATA=window.HFDATA||{models:[]};
const FETCH_DAY=new Date((DATA.fetchedAt||'2026-10-23')+'T12:00:00+07:00');

// ---- máy (công tắc demo, không phải cài đặt mới)
const MACHINES=[
 {id:'m4',gpu:'RTX 3050 Ti Laptop',vram:4,ram:16,cpu:'Ryzen 7 4800H',bwG:192,bwR:51},
 {id:'m12',gpu:'RTX 4070 SUPER',vram:12,ram:32,cpu:'',bwG:504,bwR:51}];
// ---- ngưỡng (#44 mục 2). GB = GiB (1024³ byte)
const TH={gpuUse:0.9,ramUse:0.6,band:0.15,ctx:4096,overhead:0.4,mmprojEst:0.8,visionBuf:0.15,q4bpw:4.85,margin:1.1,eff:0.55};
const thr=m=>{const T=m.vram*TH.gpuUse;return{T,lo:T*(1-TH.band),hi:T*(1+TH.band),R:T+m.ram*TH.ramUse}};
function level(need,m){const t=thr(m);if(need==null)return'unk';if(Math.abs(need-t.T)<=t.T*TH.band)return'check';if(need<t.T)return'ok';if(need<=t.R)return'slow';return'no'}
const RANK={ok:0,check:1,slow:2,no:3,unk:4};
const LVL={ok:['ok','Chạy mượt'],check:['chk','cần kiểm tra'],slow:['warn','Chạy chậm'],no:['bad','Không chạy được'],unk:['unk','Chưa rõ']};

// ---- trạng thái
const LSK={lang:'aivn.ui.lang',mach:'aivn.models.v2.machine',real:'aivn.models.v2.real',dl:'aivn.models.v2.downloaded'};
const Q=new URLSearchParams(location.search);
let LANG=Q.get('lang')||LS.get(LSK.lang,'vi');if(!['vi','en','zh'].includes(LANG))LANG='vi';
const st={q:'',vis:false,tool:false,fit:'',sort:'fit',mach:LS.get(LSK.mach,'m4'),sel:null,tab:'readme',quant:{},mpane:'list',ext:null,loading:null,pop:false};
if(!MACHINES.some(m=>m.id===st.mach))st.mach='m4';
const mach=()=>MACHINES.find(m=>m.id===st.mach);
let dls=[];
const done=()=>LS.get(LSK.dl,[]);

// ---- i18n
function tr(k,...a){let s=k;if(LANG!=='vi'){const v=(window.STR_M||{})[k];if(v)s=v[LANG==='en'?0:1];else console.warn('i18n thiếu:',k)}return s.replace(/\{(\d)\}/g,(x,i)=>a[+i])}
const loc=()=>LANG==='vi'?'vi-VN':LANG==='zh'?'zh-CN':'en-US';
const fmtN=n=>new Intl.NumberFormat(loc()).format(n);
const fmtG=g=>{if(g==null)return'—';const v=g>=10?g.toFixed(1):g>=1?g.toFixed(2):null;const s=v!=null?v:String(Math.round(g*1024));return(LANG==='vi'?s.replace('.',','):s)+(v!=null?' GB':' MB')};
const fmtK=n=>{if(n==null)return'—';const u=LANG==='zh'?[[1e8,'亿'],[1e4,'万']]:LANG==='vi'?[[1e6,' Tr'],[1e3,' N']]:[[1e6,'M'],[1e3,'K']];for(const[d,s]of u)if(n>=d){const v=n/d;return(v>=100?Math.round(v):v.toFixed(1)).toString().replace('.',LANG==='vi'?',':'.')+s}return String(n)};
function ago(iso){if(!iso)return'';const d=Math.max(0,Math.round((FETCH_DAY-new Date(iso))/864e5));
 if(d<1)return tr('hôm nay');if(d<14)return tr('{0} ngày trước',d);if(d<60)return tr('{0} tuần trước',Math.round(d/7));if(d<730)return tr('{0} tháng trước',Math.round(d/30));return tr('{0} năm trước',Math.round(d/365))}

// ---- phân tích tên tệp (giống src/hf.js: SPLIT_RE, parseQuant, MMPROJ_PREF)
const SPLIT_RE=/^(.*)-(\d{5})-of-(\d{5})\.gguf$/i;
const QUANT_PREF=['Q4_K_M','Q4_K_S','IQ4_XS','Q4_K_XL','Q4_0','IQ4_NL','Q5_K_M','Q5_K_S','Q6_K','MXFP4','Q8_0','Q3_K_L','Q3_K_M','Q3_K_XL','IQ3_M','Q3_K_S','Q2_K','IQ2_M'];
const MMPROJ_PREF=['Q8_0','F16','BF16','F32'];
function parseQuant(file){const base=file.split('/').pop().replace(SPLIT_RE,'$1').replace(/\.gguf$/i,'');
 const re=/(?:^|[-_.])((?:UD-)?(?:I?Q\d(?:_[0-9A-Z]+)*|BF16|F16|F32|FP16|MXFP4(?:_MOE)?|TQ\d_\d))$/i,re2=/(?:^|[-_.])((?:UD-)?(?:I?Q\d(?:_[0-9A-Z]+)*|BF16|F16|F32|FP16|MXFP4(?:_MOE)?|TQ\d_\d))(?=[-_.])/i;
 const m=base.match(re)||base.match(re2);return m?m[1].toUpperCase().replace(/^FP16$/,'F16'):null}
const kindOf=p=>{const n=p.split('/').pop().toLowerCase();if(n.includes('mmproj'))return'mmproj';if(/^(mtp|dflash|draft)-|imatrix/.test(n))return'aux';return'chat'};
function groupFiles(files){const g=new Map();
 for(const f of files){if(!/\.gguf$/i.test(f.p))continue;const m=f.p.match(SPLIT_RE);const key=m?m[1]:f.p.replace(/\.gguf$/i,'');
  let x=g.get(key);if(!x){x={key,files:[],parts:m?+m[3]:1};g.set(key,x)}x.files.push({p:f.p,s:f.s,part:m?+m[2]:1})}
 return[...g.values()].map(x=>{x.files.sort((a,b)=>a.part-b.part);const p=x.files[0].p;
  return{key:x.key,name:x.key.split('/').pop(),quant:parseQuant(p),size:x.files.reduce((s,f)=>s+f.s,0)/GiB,parts:x.parts,kind:kindOf(p),first:p}}).sort((a,b)=>a.size-b.size)}

// ---- thông tin kho: thị giác / công cụ (heuristic, ghi trong README)
const repoName=r=>r.id.split('/')[1].replace(/-GGUF$/i,'').replace(/-gguf$/,'');
const mmprojOf=r=>r.siblings.filter(f=>/mmproj/i.test(f));
const hasVision=r=>mmprojOf(r).length>0;
const visionHint=r=>!hasVision(r)&&(/image|visual/.test(r.pipeline||'')||r.tags.includes('vision'));
const hasTools=r=>!!(r.gguf&&r.gguf.toolTpl)||r.toolTags.length>0;
const moe=r=>{const m=r.id.match(/(\d+(?:\.\d+)?)B-A(\d+(?:\.\d+)?)B/i);return m?{tot:+m[1],act:+m[2]}:null};
const LOGO=r=>{const a=r.author.toLowerCase(),n=r.id.toLowerCase();if(n.includes('qwen'))return'qwen';if(n.includes('gemma'))return'google';if(n.includes('llama'))return'meta';if(/mistral|ministral/.test(n))return'mistralai';if(n.includes('phi'))return'org';return a==='huggingface'?'huggingface':'org'};

// ---- ước tính nhanh trong danh sách (#44 mục 2): Q4_K_M ≈ gguf.total × 4,85/8 byte, +10%, +0,8 GB nếu có mmproj
function estimate(r){if(!r.gguf||!r.gguf.total)return null;return r.gguf.total*TH.q4bpw/8/GiB*TH.margin+(hasVision(r)?TH.mmprojEst:0)}

// ---- số "thật" khi mở kho: tệp thật + KV cache (ctx 4096) + bộ đệm + mmproj thật (mô phỏng phép tính kiểu fit.js)
function kvBytesPerTok(meta,kvB){if(!meta||!meta.layers)return null;const L=meta.layers;let tot=0,ctx=TH.ctx;
 const kvh=i=>Array.isArray(meta.kvHeads)?meta.kvHeads[i]:(meta.kvHeads||meta.heads);
 const kl=meta.kLen||(meta.emb/meta.heads),vl=meta.vLen||kl;
 const shared=meta.sharedKv||0;
 for(let i=0;i<L-shared;i++){
  if(meta.fullAttnEvery&&((i+1)%meta.fullAttnEvery))continue; // lớp tuyến tính (SSM) không có KV theo ngữ cảnh
  let sw=false;if(Array.isArray(meta.swaPattern))sw=!!meta.swaPattern[i];else if(meta.swa&&/^gemma3$/.test(meta.arch))sw=(i+1)%6!==0;
  const tok=sw?Math.min(ctx,meta.swa):ctx,k=sw&&meta.kLenSwa?meta.kLenSwa:kl,v=sw&&meta.vLenSwa?meta.vLenSwa:vl;
  tot+=tok*kvh(i)*(k+v)*kvB}
 return tot/GiB}
const kvType=m=>m.vram<6?'q8_0':'f16';
function realFor(r,m){ // trả về danh sách bản lượng tử với nhu cầu bộ nhớ
 const G=groupFiles(r.files),chat=G.filter(g=>g.kind==='chat'),mm=G.filter(g=>g.kind==='mmproj');
 const rk=g=>{const i=MMPROJ_PREF.indexOf(g.quant||(/f16/i.test(g.name)?'F16':''));return i<0?9:i};
 const mmp=[...mm].sort((a,b)=>rk(a)-rk(b))[0]||null;
 const kv=kvBytesPerTok(r.meta,kvType(m)==='q8_0'?34/32:2);
 const extra=(kv==null?0.5:kv)+TH.overhead+(mmp?mmp.size+TH.visionBuf:0);
 const mo=moe(r);
 const rows=chat.map(g=>{const need=g.size+extra,lv=level(need,m),t=thr(m);
  const act=g.size*(mo?mo.act/mo.tot:1),gpuPart=Math.max(0,Math.min(1,(t.T-extra)/g.size));
  const tps=lv==='no'?null:TH.eff/((act*gpuPart)/m.bwG+(act*(1-gpuPart))/m.bwR);
  return{...g,need,lv,tps}});
 return{rows,mmp,kv,kvT:kvType(m),aux:G.filter(g=>g.kind==='aux'),extra}}
const refQuant=rows=>{for(const q of QUANT_PREF){const x=rows.find(g=>g.quant===q);if(x)return x}return rows[0]};
function recQuant(rows){const ok=rows.filter(g=>g.lv==='ok'&&!/^(F16|BF16|F32)$/.test(g.quant||''));if(ok.length)return ok[ok.length-1];
 const ch=rows.filter(g=>g.lv==='check');if(ch.length)return ch[0];return refQuant(rows.filter(g=>g.lv==='slow'))||refQuant(rows)}
// bộ nhớ đệm số thật (theo kho, lưu trong trình duyệt)
const realCache=()=>LS.get(LSK.real,{});
function listFit(r){const m=mach(),c=realCache()[r.id];
 if(c){const x=realFor(r,m),g=refQuant(x.rows);if(g)return{need:g.need,lv:g.lv,real:true,q:g.quant,at:c.at}}
 const e=estimate(r);return{need:e,lv:level(e,m),real:false,q:'Q4_K_M'}}

// ---- nhận diện liên kết HF / user/model (#44 mục 1)
function parseRef(s){s=(s||'').trim();if(!s||/\s/.test(s))return null;
 let m=s.match(/^(?:https?:\/\/)?(?:www\.)?(?:huggingface\.co|hf\.co)\/(.+)$/i);
 if(m){let p=m[1].split(/[?#]/)[0].replace(/\/+$/,'').split('/');
  if(['datasets','spaces','docs','blog','collections','papers','models'].includes(p[0])){if(p[0]==='models'&&p.length>=3)p=p.slice(1);else return{bad:p[0]}}
  if(p.length<2||!p[0]||!p[1])return{bad:'short'};
  const id=p[0]+'/'+p[1];let file=null;if(['blob','resolve'].includes(p[2])&&p.length>4)file=decodeURIComponent(p.slice(4).join('/'));
  return{id,file,url:true}}
 if(/^[A-Za-z0-9][\w.-]*\/[\w.-]+$/.test(s))return{id:s,file:null,url:false};return null}
const findRepo=id=>DATA.models.find(r=>r.id.toLowerCase()===String(id).toLowerCase());

// ---- tìm kiếm thường
const norm=s=>s.toLowerCase().replace(/[-_.\s]+/g,'');
function visible(){const ref=parseRef(st.q);const toks=ref?[]:st.q.toLowerCase().split(/\s+/).filter(Boolean).map(norm);
 return DATA.models.map(r=>({r,f:listFit(r)})).filter(({r,f})=>{const hay=norm(r.id+' '+(r.gguf&&r.gguf.arch||''));
  if(toks.length&&!toks.every(t=>hay.includes(t)))return false;if(st.vis&&!hasVision(r))return false;if(st.tool&&!hasTools(r))return false;if(st.fit&&f.lv!==st.fit)return false;return true})}
function sorted(v){const s=st.sort,by={dl:(a,b)=>b.r.downloads-a.r.downloads,likes:(a,b)=>b.r.likes-a.r.likes,new:(a,b)=>new Date(b.r.lastModified)-new Date(a.r.lastModified),size:(a,b)=>(a.f.need??1e9)-(b.f.need??1e9)};
 return[...v].sort(s==='fit'?(a,b)=>RANK[a.f.lv]-RANK[b.f.lv]||b.r.downloads-a.r.downloads:by[s])}

// ---- vẽ
function badge(f,cls=''){const[c,t]=LVL[f.lv];return`<span class="fit2 ${c} ${cls}">${f.real?'':'≈ '}${tr(t)}</span>`}
function renderShell(){
 document.documentElement.lang=LANG==='zh'?'zh-CN':LANG;document.title=tr('Khám phá mô hình')+' · AIVN ('+tr('bản mẫu')+')';
 document.querySelectorAll('.rail a').forEach(a=>{const t=a.querySelector('.tip');if(!t)return;t.dataset.vi=t.dataset.vi||t.textContent;t.textContent=tr(t.dataset.vi);a.setAttribute('aria-label',t.textContent)});
 const m=mach();
 $('top').innerHTML=`<h1>${tr('Khám phá mô hình')}</h1><span class="sub">${tr('Tìm trên Hugging Face, xem có chạy được trên máy bạn không, rồi tải về')}</span><span class="grow"></span>
  <span class="banner" data-testid="banner">${tr('Bản nháp 2 theo issue #44')}</span><span class="sample">${tr('Dữ liệu HF thật, lấy ngày {0}',DATA.fetchedAt)}</span>
  <div class="seg" role="group" aria-label="${tr('Ngôn ngữ')}">${[['vi','VI'],['en','EN'],['zh','中文']].map(([k,t])=>`<button data-testid="lang-${k}" class="${LANG===k?'on':''}" aria-pressed="${LANG===k}" onclick="setLang('${k}')">${t}</button>`).join('')}</div>
  <button class="btn dlbtn" id="dlToggle" aria-expanded="${$('dlp').classList.contains('open')}" onclick="toggleDl()">⬇ <span class="dlt">${tr('Tải về')}</span> <span class="n" id="dlCount">0</span></button>`;
 $('machine').innerHTML=`<span class="lbl">${tr('Máy của bạn')}</span><div class="seg mseg" role="radiogroup" aria-label="${tr('Máy của bạn')}">${MACHINES.map(x=>`<button role="radio" aria-checked="${x.id===st.mach}" class="${x.id===st.mach?'on':''}" data-testid="mach-${x.id}" onclick="setMach('${x.id}')"><b>${x.gpu}</b> <span>${x.vram} GB VRAM · ${x.ram} GB RAM</span></button>`).join('')}</div>
  <span class="muted small mdemo">${m.id==='m4'?esc(m.cpu)+' · ':''}${tr('máy thứ hai chỉ để thử (demo)')}</span>`;
}
function renderFilters(){const all=DATA.models.map(r=>({r,f:listFit(r)}));const n=lv=>all.filter(x=>x.f.lv===lv).length;
 $('caps').innerHTML=`<button class="chip ${st.vis?'on':''}" aria-pressed="${st.vis}" data-testid="f-vision" onclick="st.vis=!st.vis;renderList()">👁 ${tr('Nhìn được màn hình (dùng cho AGENT)')}</button>
  <button class="chip ${st.tool?'on':''}" aria-pressed="${st.tool}" data-testid="f-tool" onclick="st.tool=!st.tool;renderList()">🛠 ${tr('Dùng công cụ')}</button>`;
 $('fits').innerHTML=`<span class="lbl">${tr('Mức chạy')}</span>`+[['',tr('Tất cả'),all.length],['ok',tr('Chạy mượt'),n('ok')],['check',tr('cần kiểm tra'),n('check')],['slow',tr('Chạy chậm'),n('slow')],['no',tr('Không chạy được'),n('no')]].map(([k,t,c])=>
  `<button class="chip fc ${k?LVL[k][0]:''} ${st.fit===k?'on':''}" aria-pressed="${st.fit===k}" data-testid="fit-${k||'all'}" onclick="st.fit='${k}';renderList()">${k?'<i></i>':''}${t} <span class="c">${c}</span></button>`).join('');
}
function _renderList(keepFocus){
 renderFilters();const ref=parseRef(st.q),v=sorted(visible()),tot=DATA.models.length,filt=st.vis||st.tool||st.fit||st.q&&!ref;
 const sortOpts=[['fit',tr('Hợp máy trước')],['dl',tr('Lượt tải')],['likes',tr('Lượt thích')],['new',tr('Mới cập nhật')],['size',tr('Bộ nhớ cần (nhỏ → lớn)')]];
 $('cntrow').innerHTML=`<span class="small" id="cnt" aria-live="polite">${filt?tr('{0} / {1} kết quả',v.length,tot):tr('{0} kết quả · hiện tất cả, không ẩn mô hình nào',tot)}</span>
  ${filt?`<button class="lnk small" onclick="clearF()">${tr('Bỏ lọc')}</button>`:''}<span class="grow"></span>
  <label class="small muted" for="sortSel">${tr('Sắp xếp')}</label><select id="sortSel" class="inp sel" onchange="st.sort=this.value;renderList()">${sortOpts.map(([k,t])=>`<option value="${k}" ${st.sort===k?'selected':''}>${t}</option>`).join('')}</select>
  <button class="lnk small" id="howBtn" aria-expanded="${st.pop}" aria-controls="howPop" onclick="togglePop()" data-testid="how">ⓘ ${tr('Cách ước tính')}</button>`;
 let h='';
 if(ref){const r=ref.id&&findRepo(ref.id);h+=`<button class="m refhint" data-ref="1" onclick="openRef()" data-testid="ref-hint"><span class="av hf">${logoTile('huggingface',38,'Hugging Face')}</span><span class="mm"><span class="nm">${ref.bad?tr('Liên kết này không phải trang mô hình'):tr('Mở trực tiếp kho {0}',esc(ref.id))}</span><span class="meta">${ref.bad?tr('Hãy dán liên kết dạng huggingface.co/tên-người/tên-mô-hình'):r?tr('Nhấn Enter để mở trang mô hình (tab README)'):tr('Không có trong dữ liệu mẫu ngoại tuyến — Enter để xem')}</span></span><span class="kbd">↵ Enter</span></button>`}
 let grp=null;const d=done();
 for(const{r,f}of v){
  if(st.sort==='fit'&&grp!==f.lv){grp=f.lv;h+=`<div class="gh" role="presentation"><span class="fit2 ${LVL[grp][0]} dot"></span>${tr(LVL[grp][1])} <span class="muted">· ${v.filter(x=>x.f.lv===grp).length}</span></div>`}
  const have=d.some(x=>x.id===r.id),ing=dls.find(x=>x.id===r.id&&x.state!=='done'),mo=moe(r);
  const tags=[hasVision(r)?`<span class="tag cap">👁 ${tr('Nhìn màn hình')}</span>`:visionHint(r)?`<span class="tag" title="${tr('Mô hình gốc hiểu ảnh nhưng kho này không có tệp mmproj nên AIVN không nhìn ảnh được')}">${tr('ảnh? thiếu mmproj')}</span>`:'',
   hasTools(r)?`<span class="tag cap">🛠 ${tr('Công cụ')}</span>`:'',mo?`<span class="tag">MoE · ${mo.act}B ${tr('hoạt động')}</span>`:'',r.gated?`<span class="tag">🔒 ${tr('cần đồng ý điều khoản')}</span>`:''].join('');
  h+=`<button class="m ${r.id===st.sel?'sel':''}" data-id="${esc(r.id)}" aria-current="${r.id===st.sel}" data-testid="row">
   ${logoTile(LOGO(r),38,r.author)}<span class="mm"><span class="nm">${esc(repoName(r))}</span>
   <span class="meta"><span>${esc(r.author)}</span>${r.gguf.total?`<span>${fmtParams(r.gguf.total)}</span>`:''}<span title="${tr('Lượt tải 30 ngày')}">⬇ ${fmtK(r.downloads)}</span><span>♥ ${fmtK(r.likes)}</span><span>${ago(r.lastModified)}</span></span>
   <span class="tags">${tags}</span></span>
   <span class="right">${badge(f)}<span class="small muted need">${f.q} · ${tr('cần')} ${f.real?'':'≈ '}${fmtG(f.need)}</span>
   ${f.real?`<span class="small realmk" title="${tr('Tính từ danh sách tệp thật + KV cache, đã lưu đệm')}">✓ ${tr('số từ tệp thật')}</span>`:''}
   ${have?`<span class="small okc">✓ ${tr('Đã tải')}</span>`:ing?`<span class="small accc">${tr('Đang tải {0}%',Math.floor(ing.done/ing.size*100))}</span>`:''}</span></button>`}
 if(!v.length)h+=`<div class="empty">${tr('Không có kết quả trong dữ liệu mẫu.')}<br><button class="btn sm" style="margin-top:10px" onclick="clearF()">${tr('Bỏ lọc')}</button></div>`;
 const L=$('list'),sc=L.scrollTop;L.innerHTML=h;L.scrollTop=sc;
 L.querySelectorAll('.m[data-id]').forEach(e=>e.onclick=()=>openRepo(e.dataset.id,{tab:st.sel===e.dataset.id?st.tab:'readme'}));
 if(keepFocus){const e=L.querySelector(`.m[data-id="${CSS.escape(keepFocus)}"]`);e&&e.focus()}
 renderPop();
}
const fmtParams=t=>{const b=t/1e9;return(b>=10?Math.round(b):b.toFixed(1)).toString().replace('.',LANG==='vi'?',':'.')+'B '+tr('tham số')};
function renderPop(){const p=$('howPop');p.hidden=!st.pop;p.setAttribute('aria-label',tr('Cách ước tính'));if(!st.pop)return;const m=mach(),t=thr(m),g=x=>fmtG(x);
 p.innerHTML=`<div class="ph2"><b>${tr('Cách ước tính')}</b><button class="x" aria-label="${tr('Đóng')}" onclick="togglePop(false)">×</button></div>
 <p class="small">${tr('Trong danh sách (chưa mở kho): bản Q4_K_M ≈ số tham số × 4,85 / 8 byte, cộng 10% dự phòng, cộng ≈ 0,8 GB nếu kho có tệp mmproj (phần nhìn ảnh).')}</p>
 <table class="th"><tr><th>${tr('Máy')}</th><td colspan="2">${esc(m.gpu)} · ${m.vram} GB VRAM · ${m.ram} GB RAM</td></tr>
 <tr><td><span class="fit2 ok">${tr('Chạy mượt')}</span></td><td>${tr('cần dưới {0}',g(t.lo))}</td><td class="muted">${tr('nằm gọn trong VRAM dùng được ({0} = 90% VRAM)',g(t.T))}</td></tr>
 <tr><td><span class="fit2 chk">${tr('cần kiểm tra')}</span></td><td>${g(t.lo)} – ${g(t.hi)}</td><td class="muted">${tr('trong khoảng ±15% quanh ngưỡng VRAM; không bao giờ tính là mượt')}</td></tr>
 <tr><td><span class="fit2 warn">${tr('Chạy chậm')}</span></td><td>${g(t.hi)} – ${g(t.R)}</td><td class="muted">${tr('phần dư chạy trên RAM/CPU (dùng tối đa 60% RAM = {0})',g(m.ram*TH.ramUse))}</td></tr>
 <tr><td><span class="fit2 bad">${tr('Không chạy được')}</span></td><td>${tr('trên {0}',g(t.R))}</td><td class="muted">${tr('vượt VRAM + RAM dùng được')}</td></tr></table>
 <p class="small">${tr('Khi mở một kho: dùng dung lượng tệp thật của từng bản lượng tử + KV cache cho ngữ cảnh {0} token ({1}) + {2} bộ đệm tính toán + tệp mmproj thật. Số này được lưu đệm trong trình duyệt và thay số ước tính trong danh sách.',fmtN(TH.ctx),kvType(m)==='q8_0'?tr('KV q8_0 vì VRAM dưới 6 GB'):tr('KV f16'),g(TH.overhead))}</p>
 <p class="small muted">${tr('Dấu ≈ nghĩa là ước tính, máy thật có thể khác. GB ở đây là GiB (1024³ byte). Tốc độ tok/s chỉ là ước lượng thô theo băng thông bộ nhớ, chưa hiệu chỉnh.')}</p>
 <button class="lnk small" onclick="clearReal()">${tr('Xoá số đã lưu đệm')}</button>`}
function togglePop(v){st.pop=v==null?!st.pop:v;renderList();if(st.pop)setTimeout(()=>{const b=$('howPop').querySelector('.x');b&&b.focus()},0);else $('howBtn').focus()}
function clearReal(){LS.set(LSK.real,{});toast(tr('Đã xoá số đã lưu đệm'));st.sel&&openRepo(st.sel,{tab:st.tab,quiet:true});renderList()}
function clearF(){st.vis=st.tool=false;st.fit='';st.q='';$('q').value='';renderList()}

// ---- README an toàn: bỏ thẻ HTML, thoát ký tự, chỉ dựng lại vài cú pháp markdown
function inl(s,id){const codes=[];s=s.replace(/`([^`]+)`/g,(x,c)=>{codes.push(c);return'\u0000'+(codes.length-1)+'\u0000'});s=esc(s);
 s=s.replace(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g,(x,a)=>`<span class="img">🖼 ${a||tr('ảnh')}</span>`);
 s=s.replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g,(x,t,u)=>{u=u.replace(/&amp;/g,'&');if(!/^https?:\/\//i.test(u)){if(/^(javascript|data|vbscript):/i.test(u)||u.startsWith('#'))return t;u='https://huggingface.co/'+id+'/blob/main/'+u.replace(/^\.?\//,'')}
  return`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${t}</a>`});
 s=s.replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');return s.replace(/\u0000(\d+)\u0000/g,(x,i)=>`<code>${esc(codes[+i])}</code>`)}
function md(src,id){if(!src)return`<p class="muted">${tr('Kho này không có README công khai (cần đăng nhập/đồng ý điều khoản trên Hugging Face).')}</p>`;
 src=src.replace(/<!--[\s\S]*?-->/g,'').replace(/<\/?[a-zA-Z][^>]*>/g,'').replace(/&nbsp;/g,' ');
 const L=src.split('\n'),o=[];let i=0;
 while(i<L.length){let l=L[i];
  if(/^\s*```/.test(l)){const b=[];i++;while(i<L.length&&!/^\s*```/.test(L[i]))b.push(L[i++]);i++;o.push(`<pre><code>${esc(b.join('\n'))}</code></pre>`);continue}
  let m=l.match(/^(#{1,6})\s+(.*)/);if(m){const n=Math.min(6,m[1].length+2);o.push(`<h${n}>${inl(m[2],id)}</h${n}>`);i++;continue}
  if(/^\s*\|/.test(l)){const rows=[];while(i<L.length&&/^\s*\|/.test(L[i]))rows.push(L[i++]);const cells=r=>r.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
   const body=rows.filter(r=>!/^\s*\|?\s*:?-{2,}/.test(r));o.push(`<div class="tw"><table>${body.map((r,k)=>`<tr>${cells(r).map(c=>k?`<td>${inl(c,id)}</td>`:`<th>${inl(c,id)}</th>`).join('')}</tr>`).join('')}</table></div>`);continue}
  if(/^\s*([-*+]|\d+\.)\s+/.test(l)){const it=[];const ol=/^\s*\d+\./.test(l);while(i<L.length&&/^\s*([-*+]|\d+\.)\s+/.test(L[i]))it.push(L[i++].replace(/^\s*([-*+]|\d+\.)\s+/,''));o.push(`<${ol?'ol':'ul'}>${it.map(x=>`<li>${inl(x,id)}</li>`).join('')}</${ol?'ol':'ul'}>`);continue}
  if(/^\s*>/.test(l)){const b=[];while(i<L.length&&/^\s*>/.test(L[i]))b.push(L[i++].replace(/^\s*>\s?/,''));o.push(`<blockquote>${inl(b.join(' '),id)}</blockquote>`);continue}
  if(/^\s*(-{3,}|\*{3,})\s*$/.test(l)){o.push('<hr>');i++;continue}
  if(!l.trim()){i++;continue}
  const p=[];while(i<L.length&&L[i].trim()&&!/^(#{1,6}\s|\s*```|\s*\||\s*([-*+]|\d+\.)\s|\s*>)/.test(L[i]))p.push(L[i++]);if(!p.length){p.push(L[i++])}o.push(`<p>${inl(p.join(' '),id)}</p>`)}
 return o.join('')}

// ---- chi tiết
function openRepo(id,o={}){const r=findRepo(id);st.ext=null;st.sel=r?r.id:null;st.tab=o.tab||'readme';if(o.file)st.quant[st.sel]=o.file;st.mpane='detail';
 if(!r){st.ext=o.ext||{id};renderAll();return}
 const c=realCache();
 if(!c[r.id]&&!o.quiet){st.loading=r.id;renderAll();setTimeout(()=>{const c2=realCache();c2[r.id]={at:new Date().toISOString(),files:r.files.length};LS.set(LSK.real,c2);st.loading=null;renderAll();afterOpen(o)},window.FAST?60:450)}
 else{renderAll();afterOpen(o)}}
function afterOpen(o){if(o.kbd||narrow())setTimeout(()=>{const b=narrow()?$('detail').querySelector('.mback'):$('detail').querySelector('[role=tab][aria-selected=true]');b&&b.focus({preventScroll:true})},0)}
function openRef(){const ref=parseRef(st.q);if(!ref)return;if(ref.bad){toast(tr('Liên kết này không phải trang mô hình'));return}
 const r=findRepo(ref.id);let file=null;if(r&&ref.file&&/\.gguf$/i.test(ref.file)){const f=ref.file,g=groupFiles(r.files).find(g=>g.first===f||f.replace(SPLIT_RE,'$1')===g.key||f.replace(/\.gguf$/i,'')===g.key);file=g&&g.kind==='chat'?g.key:null}
 openRepo(ref.id,{tab:file?'files':'readme',file,ext:{id:ref.id,url:ref.url},kbd:true})}
const narrow=()=>matchMedia('(max-width:767px)').matches;
function mBack(){const id=st.sel;st.mpane='list';renderAll();setTimeout(()=>{const e=id&&$('list').querySelector(`.m[data-id="${CSS.escape(id)}"]`);(e||$('q')).focus();e&&e.scrollIntoView({block:'nearest'})},0)}
function renderDetail(){const el=$('detail'),back=`<button class="mback" onclick="mBack()" data-testid="back">← ${tr('Quay lại')}</button>`;
 document.body.classList.toggle('m-detail',st.mpane==='detail');
 if(st.ext&&!st.sel){const id=st.ext.id;el.innerHTML=back+`<div class="dh"><h2>${esc(id)}</h2><p class="muted">${tr('Kho này không có trong dữ liệu mẫu ngoại tuyến của bản mẫu.')}</p>
  <p class="small">${tr('Trong ứng dụng thật, AIVN sẽ gọi {0} và {1} để lấy README và danh sách tệp, rồi tính số thật như các kho khác.',`<code>/api/models/${esc(id)}</code>`,`<code>/tree/main</code>`)}</p>
  <a class="btn" href="https://huggingface.co/${esc(id)}" target="_blank" rel="noopener noreferrer">${tr('Mở trên Hugging Face')} ↗</a></div>`;return}
 const r=st.sel&&findRepo(st.sel);
 if(!r){el.innerHTML=`<div class="empty">${tr('Chọn một mô hình để xem chi tiết, hoặc dán liên kết Hugging Face vào ô tìm kiếm.')}</div>`;return}
 const m=mach(),f=listFit(r),mo=moe(r);
 let h=back+`<div class="dh"><div class="row">${logoTile(LOGO(r),40,r.author)}<div style="min-width:0"><h2>${esc(repoName(r))}</h2><div class="muted small rid">${esc(r.id)}</div></div></div>
  <div class="row tagrow" style="margin-top:10px;gap:5px">${r.gguf.arch?`<span class="tag">${esc(r.gguf.arch)}</span>`:''}${r.gguf.total?`<span class="tag">${fmtParams(r.gguf.total)}</span>`:''}${r.gguf.ctx?`<span class="tag">${tr('ngữ cảnh tối đa {0}',fmtK(r.gguf.ctx))}</span>`:''}
   ${hasVision(r)?`<span class="tag cap">👁 ${tr('Nhìn màn hình')}</span>`:''}${hasTools(r)?`<span class="tag cap">🛠 ${tr('Công cụ')}</span>`:''}${mo?`<span class="tag">MoE ${mo.tot}B / ${mo.act}B</span>`:''}${r.gated?`<span class="tag">🔒 ${tr('cần đồng ý điều khoản')}</span>`:''}
   <span class="tag">⬇ ${fmtK(r.downloads)}</span><span class="tag">♥ ${fmtK(r.likes)}</span><span class="tag">${tr('cập nhật')} ${ago(r.lastModified)}</span></div>
  <div class="fitrow">${badge(f,'big')}<span class="small fittxt">${f.real?tr('{0} cần {1} trên {2} (tệp thật + KV cache, ngữ cảnh {3})',f.q,fmtG(f.need),esc(m.gpu),fmtN(TH.ctx)):tr('ước tính {0} cần ≈ {1}',f.q,fmtG(f.need))}</span>
   <a class="lnk small hflink" href="https://huggingface.co/${esc(r.id)}" target="_blank" rel="noopener noreferrer">${tr('Mở trên Hugging Face')} ↗</a></div></div>`;
 const G=groupFiles(r.files).filter(g=>g.kind==='chat').length;
 h+=`<div class="tabs" role="tablist" aria-label="${tr('Chi tiết mô hình')}">${[['readme',tr('Giới thiệu (README)')],['files',tr('Tệp & lượng tử ({0})',G)]].map(([k,t])=>`<button role="tab" id="tab-${k}" aria-controls="pane" aria-selected="${st.tab===k}" tabindex="${st.tab===k?0:-1}" class="${st.tab===k?'on':''}" data-tab="${k}" data-testid="tab-${k}">${t}</button>`).join('')}</div>
  <div id="pane" role="tabpanel" aria-labelledby="tab-${st.tab}" class="pane scroll" tabindex="0">`;
 if(st.loading===r.id)h+=`<div class="empty"><span class="spin"></span> ${tr('Đang đọc danh sách tệp…')}</div>`;
 else if(st.tab==='readme')h+=`<div class="readme" data-testid="readme"><div class="small muted rsrc">${tr('README từ Hugging Face (rút gọn, đã bỏ HTML và ảnh để hiển thị an toàn)')}</div>${md(r.readme,r.id)}</div>`;
 else h+=filesPane(r,m);
 h+='</div>';
 if(st.loading!==r.id)h+=footer(r,m);
 const op=$('pane'),ps=op&&el.dataset.k===st.sel+st.tab?op.scrollTop:0;el.innerHTML=h;el.dataset.k=st.sel+st.tab;const np=$('pane');np&&(np.scrollTop=ps);
 el.querySelectorAll('[role=tab]').forEach(b=>{b.onclick=()=>{st.tab=b.dataset.tab;renderDetail();$('tab-'+st.tab).focus()};
  b.onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();st.tab=st.tab==='readme'?'files':'readme';renderDetail();$('tab-'+st.tab).focus()}}});
 el.querySelectorAll('.q[data-k]').forEach(e=>{e.onclick=()=>{st.quant[r.id]=e.dataset.k;renderDetail();const n=$('detail').querySelector(`.q[data-k="${CSS.escape(e.dataset.k)}"]`);n&&n.focus()};
  e.onkeydown=ev=>{if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){ev.preventDefault();const a=[...el.querySelectorAll('.q[data-k]')],i=a.indexOf(e);const n=a[i+(ev.key==='ArrowDown'?1:-1)];n&&n.focus()}}});
}
function selQuant(r,x){const k=st.quant[r.id];return x.rows.find(g=>g.key===k)||recQuant(x.rows)}
function filesPane(r,m){const x=realFor(r,m),sel=selQuant(r,x),rec=recQuant(x.rows),d=done(),t=thr(m);
 const kvTxt=x.kv==null?tr('không đọc được phần đầu tệp GGUF, giả định KV ≈ 0,5 GB'):tr('KV cache {0} cho {1} token ({2}, {3} lớp)',fmtG(x.kv),fmtN(TH.ctx),x.kvT,r.meta.layers);
 let h=`<div class="small muted asm">${tr('Số thật cho {0}: dung lượng tệp + {1} + {2} bộ đệm tính toán',esc(m.gpu),kvTxt,fmtG(TH.overhead))}${x.mmp?' + '+tr('mmproj {0} ({1}) + {2} bộ đệm ảnh',esc(x.mmp.quant||x.mmp.name),fmtG(x.mmp.size),fmtG(TH.visionBuf)):''}. <span class="cached">✓ ${tr('đã lưu đệm')}</span></div>
 <div class="qtable" role="radiogroup" aria-label="${tr('Chọn bản lượng tử hoá')}"><div class="qh"><span></span><span>${tr('Bản')}</span><span class="qsz">${tr('Tệp')}</span><span>${tr('Cần (chạy)')}</span><span class="qlv">${tr('Mức chạy')}</span><span class="tps">≈ tok/s</span></div>`;
 for(const g of x.rows){const s=g===sel,have=d.some(y=>y.id===r.id&&y.k===g.key);
  h+=`<div class="q ${s?'sel':''}" role="radio" aria-checked="${s}" tabindex="${s?0:-1}" data-k="${esc(g.key)}" data-testid="q-${esc(g.quant||g.name)}"><span class="rad"></span>
   <span class="qn">${esc(g.quant||g.name)}${g.parts>1?` <span class="muted">· ${g.parts} ${tr('phần')}</span>`:''}${g===rec?`<span class="rec">★ ${tr('Đề xuất')}</span>`:''}${have?`<span class="rec">✓ ${tr('Đã tải')}</span>`:''}</span>
   <span class="small qsz">${fmtG(g.size)}</span><span class="small"><b>${fmtG(g.need)}</b></span><span class="qlv">${badge({lv:g.lv,real:true})}</span><span class="small muted tps">${g.tps?(g.tps>=10?Math.round(g.tps):g.tps.toFixed(1)).toString().replace('.',LANG==='vi'?',':'.'):'—'}</span></div>`}
 h+='</div>';
 if(x.mmp)h+=`<div class="small muted asm">${tr('Tệp nhìn ảnh (mmproj) sẽ tải kèm: {0} · {1}',esc(x.mmp.first),fmtG(x.mmp.size))}</div>`;
 if(x.aux.length)h+=`<div class="small muted asm">${tr('Tệp phụ trợ không tính (MTP/draft/imatrix): {0}',x.aux.map(a=>esc(a.name)).join(', '))}</div>`;
 h+=`<div class="small muted asm">${tr('Ngưỡng máy này: mượt dưới {0}, cần kiểm tra {0}–{1}, chậm đến {2}.',fmtG(t.lo),fmtG(t.hi),fmtG(t.R))} <button class="lnk small" onclick="togglePop(true)">${tr('Cách ước tính')}</button></div>`;
 return h}
function footer(r,m){const x=realFor(r,m);if(!x.rows.length)return'';const g=selQuant(r,x),t=thr(m),d=done();
 const have=d.find(y=>y.id===r.id&&y.k===g.key),ing=dls.find(y=>y.id===r.id&&y.k===g.key&&y.state!=='done');
 const tot=g.size+(x.mmp?x.mmp.size:0),col={ok:'var(--ok)',check:'#38bdf8',slow:'var(--warn)',no:'var(--bad)'}[g.lv];
 const scale=Math.max(t.R,g.need)*1.05,pv=Math.min(100,g.need/scale*100),pT=t.T/scale*100;
 const msg={ok:tr('Chạy toàn bộ trên GPU.'),check:tr('Sát ngưỡng VRAM: có thể chạy hết trên GPU hoặc phải chia sang RAM. Nên chạy thử, hoặc chọn bản nhỏ hơn.'),slow:tr('Không vừa VRAM: một phần chạy trên RAM/CPU, chậm hơn nhiều.'),no:tr('Vượt cả VRAM và RAM dùng được của máy này.')}[g.lv];
 return`<div class="dfoot"><div class="row small"><span>${tr('Bộ nhớ cần khi chạy {0}',esc(g.quant||g.name))}</span><span class="grow"></span><b>${fmtG(g.need)}</b><span class="muted">/ ${m.vram} GB VRAM + ${m.ram} GB RAM</span></div>
  <div class="memviz" role="img" aria-label="${tr('Bộ nhớ cần {0}, ngưỡng VRAM {1}',fmtG(g.need),fmtG(t.T))}"><i style="width:${pv}%;background:${col}"></i><b style="left:${pT}%" title="${tr('ngưỡng VRAM')}"></b></div>
  <div class="small" style="color:${col};margin-bottom:10px">${msg}${g.tps?' '+tr('≈ {0} tok/s (thô).',Math.round(g.tps)):''}</div>
  ${have?`<div class="row"><button class="btn" style="flex:1;justify-content:center" disabled>✓ ${tr('Đã tải về')}</button><a class="btn pri" href="chat.html">${tr('Nạp & trò chuyện')} →</a></div>`
  :ing?`<div class="row small"><span>${tr('Đang tải {0}…',esc(g.quant||g.name))}</span><span class="grow"></span><span>${Math.floor(ing.done/ing.size*100)}%</span></div><div class="bar ${ing.state==='paused'?'paused':''}" style="margin:6px 0 10px"><i style="width:${ing.done/ing.size*100}%"></i></div>
   <div class="row"><button class="btn" onclick="togglePause('${esc(ing.key)}')">${ing.state==='paused'?'▶ '+tr('Tiếp tục'):'⏸ '+tr('Tạm dừng')}</button><button class="btn danger" onclick="cancelDl('${esc(ing.key)}')">✕ ${tr('Huỷ')}</button></div>`
  :`<button class="btn pri dlgo" data-testid="dl" onclick="startDl()" ${r.gated?'disabled':''}>⬇ ${tr('Tải về {0} · {1}',esc(g.quant||g.name),fmtG(tot))}${x.mmp?' '+tr('(kèm mmproj)'):''}</button>${r.gated?`<div class="small muted" style="margin-top:6px">${tr('Kho này yêu cầu đăng nhập Hugging Face và đồng ý điều khoản trước khi tải.')}</div>`:''}`}</div>`}

// ---- tải về (giữ từ bản 1, mô phỏng)
function renderDl(){const act=dls.filter(x=>x.state!=='done');const c=$('dlCount');c&&(c.textContent=act.length);
 $('dlpH').textContent=tr('Đang tải về');
 $('dll').innerHTML=dls.length?dls.map(x=>{const p=x.done/x.size*100,left=(x.size-x.done)*1024/x.speed;
  return`<div class="dli"><div class="t"><b>${esc(x.name)}</b><span class="tag">${esc(x.q)}</span></div><div class="bar ${x.state==='paused'?'paused':''}" style="margin-top:7px"><i style="width:${p}%"></i></div>
  <div class="s"><span>${fmtG(x.done)} / ${fmtG(x.size)} · ${p.toFixed(0)}%</span><span>${x.state==='done'?`<span class="okc">✓ ${tr('Hoàn tất')}</span>`:x.state==='paused'?tr('Đã tạm dừng'):tr('{0} MB/s · còn {1}',x.speed.toFixed(1),left>60?tr('{0} phút',Math.ceil(left/60)):tr('{0} giây',Math.ceil(left)))}</span></div>
  ${x.state!=='done'?`<div class="row" style="margin-top:7px;gap:6px"><button class="btn sm" onclick="togglePause('${esc(x.key)}')">${x.state==='paused'?'▶ '+tr('Tiếp tục'):'⏸ '+tr('Tạm dừng')}</button><button class="btn sm danger" onclick="cancelDl('${esc(x.key)}')">✕ ${tr('Huỷ')}</button></div>`:''}</div>`}).join(''):`<div class="empty small">${tr('Chưa có tệp nào đang tải.')}</div>`}
function startDl(){const r=findRepo(st.sel),x=realFor(r,mach()),g=selQuant(r,x),key=r.id+'@'+g.key;if(dls.some(y=>y.key===key&&y.state!=='done'))return;
 dls.unshift({key,id:r.id,k:g.key,q:g.quant||g.name,name:repoName(r),size:g.size+(x.mmp?x.mmp.size:0),done:0,speed:24,state:'run'});$('dlp').classList.add('open');toast(tr('Bắt đầu tải {0} {1}',repoName(r),g.quant||''));renderAll()}
function togglePause(k){const x=dls.find(y=>y.key===k);x.state=x.state==='paused'?'run':'paused';renderAll()}
function cancelDl(k){dls=dls.filter(y=>y.key!==k);toast(tr('Đã huỷ tải'));renderAll()}
function toggleDl(v){const p=$('dlp');p.classList.toggle('open',v);$('dlToggle').setAttribute('aria-expanded',p.classList.contains('open'))}
setInterval(()=>{let ch=false;for(const x of dls){if(x.state!=='run')continue;x.speed=Math.max(8,Math.min(48,x.speed+(Math.random()-.5)*6));
 x.done=Math.min(x.size,x.done+x.speed/1024*0.5*(window.SPEEDUP||1));ch=true;
 if(x.done>=x.size){x.state='done';const d=done();d.push({id:x.id,k:x.k,size:x.size});LS.set(LSK.dl,d);toast(tr('✓ Đã tải xong {0}',x.name))}}
 if(ch)keepF(()=>{renderDl();renderDetail();_renderList()})},500);

// ---- chung
function keepF(fn){const a=document.activeElement;let sel=null;
 if(a&&a!==document.body){if(a.id)sel='#'+CSS.escape(a.id);else if(a.dataset.testid&&a.dataset.testid!=='row')sel=`[data-testid="${a.dataset.testid}"]`;else if(a.dataset.id)sel=`.m[data-id="${CSS.escape(a.dataset.id)}"]`;else if(a.dataset.k)sel=`.q[data-k="${CSS.escape(a.dataset.k)}"]`}
 fn();if(sel&&(!document.activeElement||document.activeElement===document.body)){const n=document.querySelector(sel);n&&n.focus({preventScroll:true})}}
function renderList(k){keepF(()=>_renderList(k))}
function renderAll(){keepF(_renderAll)}
function setLang(l){LANG=l;LS.set(LSK.lang,l);renderAll()}
function setMach(id){st.mach=id;LS.set(LSK.mach,id);renderAll();const b=document.querySelector(`[data-testid="mach-${id}"]`);b&&b.focus()}
function _renderAll(){renderShell();$('q').placeholder=narrow()?tr('Tìm hoặc dán liên kết HF'):tr('Tìm mô hình, hoặc dán liên kết Hugging Face / tên-người/tên-mô-hình');$('q').setAttribute('aria-label',tr('Tìm mô hình hoặc dán liên kết Hugging Face'));
 $('qhelp').textContent=tr('Ví dụ: qwen3-vl · gemma 3 · https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct-GGUF');renderList();renderDetail();renderDl()}
const qi=$('q');
qi.oninput=()=>{st.q=qi.value;renderList()};
qi.onpaste=()=>setTimeout(()=>{st.q=qi.value;const r=parseRef(st.q);renderList();if(r&&!r.bad)openRef()},0);
qi.onkeydown=e=>{if(e.key==='Enter'){if(parseRef(qi.value))openRef();else{const f=$('list').querySelector('.m[data-id]');f&&f.focus()}}
 else if(e.key==='ArrowDown'){e.preventDefault();const f=$('list').querySelector('.m');f&&f.focus()}else if(e.key==='Escape'&&qi.value){qi.value='';st.q='';renderList()}};
$('list').addEventListener('keydown',e=>{const a=[...$('list').querySelectorAll('.m')],i=a.indexOf(document.activeElement);if(i<0)return;
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const n=a[i+(e.key==='ArrowDown'?1:-1)];if(n)n.focus();else if(e.key==='ArrowUp')qi.focus()}
 else if(e.key==='Home'||e.key==='End'){e.preventDefault();a[e.key==='Home'?0:a.length-1].focus()}
 else if(e.key==='Enter'&&a[i].dataset.id){e.preventDefault();openRepo(a[i].dataset.id,{kbd:true})}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();qi.focus()}
 else if(e.key==='Escape'){if(st.pop)togglePop(false);else if($('dlp').classList.contains('open')){toggleDl(false);$('dlToggle').focus()}else if(narrow()&&st.mpane==='detail')mBack()}});
matchMedia('(max-width:767px)').addEventListener('change',()=>renderAll());
renderRail('models');$('sic').outerHTML=ICONS.search;
$('dlClose').onclick=()=>{toggleDl(false);$('dlToggle').focus()};
{const o=Q.get('open');if(Q.get('fresh'))LS.set(LSK.real,{});renderAll();if(o){qi.value=o;st.q=o;openRef()}}
