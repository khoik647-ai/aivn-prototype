// Khám phá mô hình · bản nháp 3 theo issue #44 + #48 (bản mẫu tĩnh, dữ liệu HF thật lấy một lần ngày 2026-10-23, xem README)
// Bản #44 giữ nguyên để so sánh: models-v2.html + assets/models-v2-44.js
// Không gọi mạng: "mở kho" = đọc danh sách tệp đã lưu sẵn trong assets/data/models-hf-2026-10-23.js
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GiB=2**30;
const DATA0=window.HFDATA||{models:[]},MOEDATA=window.HFDATA_MOE||{models:[]};
// #48: gộp thêm các kho MoE (assets/data/models-hf-moe-2026-10-23.js, lấy cùng ngày từ HF API công khai)
const DATA={...DATA0,models:[...DATA0.models,...MOEDATA.models.filter(r=>!DATA0.models.some(x=>x.id===r.id))]};
const FETCH_DAY=new Date((DATA.fetchedAt||'2026-10-23')+'T12:00:00+07:00');

// ---- máy (công tắc demo, không phải cài đặt mới)
const MACHINES=[
 {id:'m4',gpu:'RTX 3050 Ti Laptop',vram:4,ram:16,cpu:'Ryzen 7 4800H',bwG:192,bwR:51,ssd:3},
 {id:'m12',gpu:'RTX 4070 SUPER',vram:12,ram:32,cpu:'',bwG:504,bwR:51,ssd:3}];
// ---- ngưỡng (#44 mục 2). GB = GiB (1024³ byte)
const TH={gpuUse:0.9,ramUse:0.6,band:0.15,ctx:4096,overhead:0.4,mmprojEst:0.8,visionBuf:0.15,q4bpw:4.85,margin:1.1,
 // #48 + hàng chờ #44: tok/s theo công thức đã hiệu chỉnh của src/fit.js (0,75 × băng thông GPU + 2,5 ms/token), CPU 0,3 × băng thông RAM (llama.cpp đọc chuyên gia rải rác, đo thực tế thường chỉ 30–40%), rồi hạ thêm 10% để không ước cao
 effG:0.75,effC:0.3,tokMs:2.5,safe:0.9,minMoe:8,mmapCtx:[1024,2048,4096]};
const thr=m=>{const T=m.vram*TH.gpuUse;return{T,lo:T*(1-TH.band),hi:T*(1+TH.band),R:T+m.ram*TH.ramUse}};
function level(need,m){const t=thr(m);if(need==null)return'unk';if(Math.abs(need-t.T)<=t.T*TH.band)return'check';if(need<t.T)return'ok';if(need<=t.R)return'slow';return'no'}
const RANK={ok:0,check:1,moe:2,slow:3,no:4,unk:5};
// #48: mức "moe" = MoE không vừa VRAM, chuyên gia của vài lớp chạy trên CPU (--n-cpu-moe) nhưng ước tính vẫn ≥ 8 tok/s
const LVL={ok:['ok','Chạy mượt'],check:['chk','cần kiểm tra'],moe:['moe','Chạy được (MoE)'],slow:['warn','Chạy chậm'],no:['bad','Không chạy được'],unk:['unk','Chưa rõ']};

// ---- trạng thái
const LSK={lang:'aivn.ui.lang',mach:'aivn.models.v2.machine',real:'aivn.models.v2.real',dl:'aivn.models.v2.downloaded'};
const Q=new URLSearchParams(location.search);
let LANG=Q.get('lang')||LS.get(LSK.lang,'vi');if(!['vi','en','zh'].includes(LANG))LANG='vi';
const st={q:'',vis:false,tool:false,fit:'',sort:'fit',mach:LS.get(LSK.mach,'m4'),sel:null,tab:'readme',quant:{},mpane:'list',ext:null,loading:null,pop:false,mm:null,adv:{}};
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
const kindOf=p=>{const n=p.split('/').pop().toLowerCase();if(n.includes('mmproj'))return'mmproj';if(/^(mtp|dflash|draft|eagle\d*)-|imatrix/.test(n))return'aux';return'chat'};
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
// hàng chờ #44: nếu mẫu chat và thẻ không nói gì, xem README có nhắc gọi hàm / dùng công cụ không
const TOOL_RE=/function[ _-]?call|tool[ _-]?(?:use|call)|gọi công cụ/i;
const toolSrc=r=>r.gguf&&r.gguf.toolTpl?'tpl':r.toolTags.length?'tag':TOOL_RE.test(r.readme||'')?'readme':null;
const hasTools=r=>!!toolSrc(r);
const toolTag=r=>{const s=toolSrc(r);return s?`<span class="tag cap" title="${s==='readme'?tr('Theo README: có nhắc gọi hàm / dùng công cụ, mẫu chat không khai báo'):tr('Mẫu chat hoặc thẻ của kho có khai báo công cụ')}">🛠 ${tr('Công cụ')}${s==='readme'?'*':''}</span>`:''};
// #48: nhận MoE từ phần đầu tệp GGUF (expert_count / expert_used_count), không chỉ từ tên "…B-A3B".
// E = tham số của các chuyên gia (3 ma trận × emb × expert_ff × số chuyên gia × số lớp); act = phần chung + E × dùng/tổng
function moe(r){const M=r.meta||{},tot=(r.gguf&&r.gguf.total||0)/1e9,nm=r.id.match(/(\d+(?:\.\d+)?)B-A(\d+(?:\.\d+)?)B/i);
 if(M.experts>1&&M.expertsUsed&&M.layers&&tot){let E=null;
  if(M.expertFf&&M.emb)E=M.experts*3*M.emb*M.expertFf*M.layers/1e9;else if(nm)E=(tot-(+nm[2]))/(1-M.expertsUsed/M.experts);
  if(E&&E<tot)return{tot,E,used:M.expertsUsed,n:M.experts,L:M.layers,act:tot-E+E*M.expertsUsed/M.experts}}
 return nm?{tot:+nm[1],act:+nm[2]}:null}
const fmtB=b=>(b>=10?Math.round(b):b.toFixed(1)).toString().replace('.',LANG==='vi'?',':'.')+'B';
const moeTag=mo=>mo.n?`MoE · ${mo.used}/${mo.n} ${tr('chuyên gia')}`:`MoE · ${mo.act}B ${tr('hoạt động')}`;
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
// tok/s (hàng chờ #44): không bao giờ ước cao. gpuGiB/cpuGiB = số GiB trọng số phải đọc cho mỗi token trên GPU / trên CPU
function tpsOf(gpuGiB,cpuGiB,m){return TH.safe/(gpuGiB*GiB/(m.bwG*1e9*TH.effG)+cpuGiB*GiB/(m.bwR*1e9*TH.effC)+TH.tokMs/1000)}
const tpsN=t=>{const v=t>=10?Math.floor(t):Math.floor(t*10)/10;return String(v).replace('.',LANG==='vi'?',':'.')};
function tpsTxt(t,measured){if(t==null)return'';return measured?`<span class="tpsm">${tr('{0} tok/s (đã đo)',tpsN(t))}</span>`
 :`<span class="tpsf" title="${tr('Ước tính theo băng thông bộ nhớ (công thức đã hiệu chỉnh của fit.js, hạ thêm 10% để không ước cao). Chưa đo trên máy này, máy thật có thể khác.')}">${tr('≈ ~{0} tok/s (ước tính)',tpsN(t))}</span>`}
// số GiB của phần chuyên gia trong một tệp: gpt-oss/MXFP4 để chuyên gia ở 4,25 bit; bản khác coi như đều bit
function expBytes(mo,g){if(!mo||!mo.E)return 0;const bpw=/MXFP4/i.test(g.quant||g.name||'')||mo.gptoss?4.25:g.size*GiB*8/(mo.tot*1e9);return Math.min(g.size*0.97,mo.E*1e9*bpw/8/GiB)}
// #48 mục 2: xếp chỗ cho một bản lượng tử. MoE không vừa VRAM → phần chung + KV + bộ đệm trên GPU, chuyên gia của ncpu lớp trên CPU (llama.cpp --n-cpu-moe ncpu)
function place(r,g,m,extra){const need=g.size+extra,t=thr(m);
 if(r.gated&&!r.meta)return{need,lv:'unk',gated:true,tps:null};
 const lv=level(need,m),mo=moe(r);if(lv==='no')return{need,lv,tps:null};
 if(mo&&mo.L&&need>t.lo){if(r.meta.arch==='gpt-oss')mo.gptoss=true;
  const eb=expBytes(mo,g),sh=g.size-eb,perL=eb/mo.L,free=t.T-extra-sh,fr=mo.used/mo.n;
  if(free>0){const k=Math.max(0,Math.min(mo.L,Math.floor(free/perL))),ncpu=mo.L-k;
   if(ncpu>0){const tps=tpsOf(sh+k*perL*fr,ncpu*perL*fr,m);
    return{need,lv:tps>=TH.minMoe?'moe':'slow',tps,ncpu,L:mo.L,gpuG:extra+sh+k*perL,cpuG:ncpu*perL,used:mo.used,n:mo.n}}}}
 const act=g.size*(mo?mo.act/mo.tot:1),gp=Math.max(0,Math.min(1,(t.T-extra)/g.size));
 return{need,lv,tps:tpsOf(act*gp,act*(1-gp),m)}}
function realFor(r,m){ // trả về danh sách bản lượng tử với nhu cầu bộ nhớ
 const G=groupFiles(r.files),chat=G.filter(g=>g.kind==='chat'),mm=G.filter(g=>g.kind==='mmproj');
 const rk=g=>{const i=MMPROJ_PREF.indexOf(g.quant||(/f16/i.test(g.name)?'F16':''));return i<0?9:i};
 const mmp=[...mm].sort((a,b)=>rk(a)-rk(b))[0]||null;
 const kv=kvBytesPerTok(r.meta,kvType(m)==='q8_0'?34/32:2);
 const extra=(kv==null?0.5:kv)+TH.overhead+(mmp?mmp.size+TH.visionBuf:0);
 const rows=chat.map(g=>({...g,...place(r,g,m,extra)}));
 return{rows,mmp,kv,kvT:kvType(m),aux:G.filter(g=>g.kind==='aux'),extra}}
const refQuant=rows=>{for(const q of QUANT_PREF){const x=rows.find(g=>g.quant===q);if(x)return x}return rows[0]};
function recQuant(rows){const ok=rows.filter(g=>g.lv==='ok'&&!/^(F16|BF16|F32)$/.test(g.quant||''));if(ok.length)return ok[ok.length-1];
 const ch=rows.filter(g=>g.lv==='check');if(ch.length)return ch[0];return refQuant(rows.filter(g=>g.lv==='moe'))||refQuant(rows.filter(g=>g.lv==='slow'))||refQuant(rows)}
// bộ nhớ đệm số thật (theo kho, lưu trong trình duyệt)
const realCache=()=>LS.get(LSK.real,{});
function listFit(r){const m=mach(),c=realCache()[r.id];
 if(r.gated&&!r.meta)return{need:estimate(r),lv:'unk',gated:true,real:false,q:'Q4_K_M'}; // hàng chờ #44: kho gated chưa đọc được đầu tệp
 if(c){const x=realFor(r,m),g=refQuant(x.rows);if(g)return{need:g.need,lv:g.lv,real:true,q:g.quant,at:c.at,tps:g.tps}}
 const e=estimate(r);if(e==null)return{need:e,lv:'unk',real:false,q:'Q4_K_M'};
 const p=place(r,{size:e/TH.margin,quant:'Q4_K_M',name:''},m,e-e/TH.margin);return{need:e,lv:p.lv,real:false,q:'Q4_K_M',tps:p.tps}}

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
function badge(f,cls=''){if(f.gated)return`<span class="fit2 unk ${cls}">🔒 ${tr('chưa đọc được thông tin')}</span>`;const[c,t]=LVL[f.lv];return`<span class="fit2 ${c} ${cls}">${f.real?'':'≈ '}${tr(t)}</span>`}
function renderShell(){
 document.documentElement.lang=LANG==='zh'?'zh-CN':LANG;document.title=tr('Khám phá mô hình')+' · AIVN ('+tr('bản mẫu')+')';
 document.querySelectorAll('.rail a').forEach(a=>{const t=a.querySelector('.tip');if(!t)return;t.dataset.vi=t.dataset.vi||t.textContent;t.textContent=tr(t.dataset.vi);a.setAttribute('aria-label',t.textContent)});
 const m=mach();
 $('top').innerHTML=`<h1>${tr('Khám phá mô hình')}</h1><span class="sub">${tr('Tìm trên Hugging Face, xem có chạy được trên máy bạn không, rồi tải về')}</span><span class="grow"></span>
  <span class="banner" data-testid="banner">${tr('Bản nháp 3 · issue #44 + #48')}</span><span class="sample">${tr('Dữ liệu HF thật, lấy ngày {0}',DATA.fetchedAt)}</span>
  <div class="seg" role="group" aria-label="${tr('Ngôn ngữ')}">${[['vi','VI'],['en','EN'],['zh','中文']].map(([k,t])=>`<button data-testid="lang-${k}" class="${LANG===k?'on':''}" aria-pressed="${LANG===k}" onclick="setLang('${k}')">${t}</button>`).join('')}</div>
  <button class="btn dlbtn" id="dlToggle" aria-expanded="${$('dlp').classList.contains('open')}" onclick="toggleDl()">⬇ <span class="dlt">${tr('Tải về')}</span> <span class="n" id="dlCount">0</span></button>`;
 $('machine').innerHTML=`<span class="lbl">${tr('Máy của bạn')}</span><div class="seg mseg" role="radiogroup" aria-label="${tr('Máy của bạn')}">${MACHINES.map(x=>`<button role="radio" aria-checked="${x.id===st.mach}" class="${x.id===st.mach?'on':''}" data-testid="mach-${x.id}" onclick="setMach('${x.id}')"><b>${x.gpu}</b> <span>${x.vram} GB VRAM · ${x.ram} GB RAM</span></button>`).join('')}</div>
  <span class="muted small mdemo">${m.id==='m4'?esc(m.cpu)+' · ':''}${tr('máy thứ hai chỉ để thử (demo)')}</span>`;
}
function renderFilters(){const all=DATA.models.map(r=>({r,f:listFit(r)}));const n=lv=>all.filter(x=>x.f.lv===lv).length;
 $('caps').innerHTML=`<button class="chip ${st.vis?'on':''}" aria-pressed="${st.vis}" data-testid="f-vision" onclick="st.vis=!st.vis;renderList()">👁 ${tr('Nhìn được màn hình (dùng cho AGENT)')}</button>
  <button class="chip ${st.tool?'on':''}" aria-pressed="${st.tool}" data-testid="f-tool" onclick="st.tool=!st.tool;renderList()">🛠 ${tr('Dùng công cụ')}</button>`;
 $('fits').innerHTML=`<span class="lbl">${tr('Mức chạy')}</span>`+[['',tr('Tất cả'),all.length],['ok',tr('Chạy mượt'),n('ok')],['check',tr('cần kiểm tra'),n('check')],['moe',tr('Chạy được (MoE)'),n('moe')],['slow',tr('Chạy chậm'),n('slow')],['no',tr('Không chạy được'),n('no')]].filter(([k,t,c])=>k!=='moe'||c).map(([k,t,c])=>
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
 if(!filt&&!ref)h+=renderPicks();
 let grp=null;const d=done();
 for(const{r,f}of v){
  if(st.sort==='fit'&&grp!==f.lv){grp=f.lv;h+=`<div class="gh" role="presentation"><span class="fit2 ${LVL[grp][0]} dot"></span>${tr(LVL[grp][1])} <span class="muted">· ${v.filter(x=>x.f.lv===grp).length}</span></div>`}
  const have=d.some(x=>x.id===r.id),ing=dls.find(x=>x.id===r.id&&x.state!=='done'),mo=moe(r);
  const tags=[hasVision(r)?`<span class="tag cap">👁 ${tr('Nhìn màn hình')}</span>`:visionHint(r)?`<span class="tag" title="${tr('Mô hình gốc hiểu ảnh nhưng kho này không có tệp mmproj nên AIVN không nhìn ảnh được')}">${tr('ảnh? thiếu mmproj')}</span>`:'',
   toolTag(r),mo?`<span class="tag">${moeTag(mo)}</span>`:'',r.gated?`<span class="tag">🔒 ${tr('cần đồng ý điều khoản')}</span>`:''].join('');
  h+=`<button class="m ${r.id===st.sel?'sel':''}" data-id="${esc(r.id)}" aria-current="${r.id===st.sel}" data-testid="row">
   ${logoTile(LOGO(r),38,r.author)}<span class="mm"><span class="nm">${esc(repoName(r))}</span>
   <span class="meta"><span>${esc(r.author)}</span>${r.gguf.total?`<span>${fmtParams(r.gguf.total)}</span>`:''}<span title="${tr('Lượt tải 30 ngày')}">⬇ ${fmtK(r.downloads)}</span><span>♥ ${fmtK(r.likes)}</span><span>${ago(r.lastModified)}</span></span>
   <span class="tags">${tags}</span></span>
   <span class="right">${badge(f)}<span class="small muted need">${f.gated?tr('repo cần quyền truy cập'):`${f.q} · ${tr('cần')} ${f.real?'':'≈ '}${fmtG(f.need)}`}</span>
   ${f.lv==='no'?`<span class="small badc need">${tr('máy dùng được ≈ {0}',fmtG(thr(mach()).R))}</span>`:''}
   ${f.real?`<span class="small realmk" title="${tr('Tính từ danh sách tệp thật + KV cache, đã lưu đệm')}">✓ ${tr('số từ tệp thật')}</span>`:''}
   ${have?`<span class="small okc">✓ ${tr('Đã tải')}</span>`:ing?`<span class="small accc">${tr('Đang tải {0}%',Math.floor(ing.done/ing.size*100))}</span>`:''}</span></button>`}
 if(!v.length)h+=`<div class="empty">${tr('Không có kết quả trong dữ liệu mẫu.')}<br><button class="btn sm" style="margin-top:10px" onclick="clearF()">${tr('Bỏ lọc')}</button></div>`;
 const L=$('list'),sc=L.scrollTop;L.innerHTML=h;L.scrollTop=sc;
 L.querySelectorAll('.m[data-id]').forEach(e=>e.onclick=()=>openRepo(e.dataset.id,{tab:st.sel===e.dataset.id?st.tab:'readme'}));
 L.querySelectorAll('.pk[data-pick]').forEach(e=>e.onclick=()=>openRepo(e.dataset.pick,{tab:'files',file:e.dataset.q,kbd:true}));
 if(keepFocus){const e=L.querySelector(`.m[data-id="${CSS.escape(keepFocus)}"]`);e&&e.focus()}
 renderPop();
}
// ---- #48 mục 1: "Mạnh nhất cho máy của bạn" (MoE), chọn theo RAM thật của máy
// measured = số đo B-LADDER (#37) trên máy cùng loại, tok/s. Chưa có số đo nào → null, dùng số ước tính ≈ (theo quản lý: số mẫu có dấu ≈)
const PICKS=[
 {id:'unsloth/Qwen3-30B-A3B-Instruct-2507-GGUF',q:'Q4_K_M',minRam:32,why:()=>tr('Mạnh nhất nhóm này: trò chuyện, viết, nhiều ngôn ngữ'),measured:{m4:null,m12:null}},
 {id:'ggml-org/gpt-oss-20b-GGUF',q:'MXFP4',minRam:16,why:()=>tr('Suy luận tốt, gọi công cụ'),measured:{m4:null,m12:null}},
 {id:'ibm-granite/granite-4.0-h-tiny-GGUF',q:'Q4_K_M',minRam:16,why:()=>tr('Nhỏ và nhanh, ngữ cảnh dài'),measured:{m4:null,m12:null}}];
function picksFor(m){return PICKS.filter(p=>m.ram>=p.minRam).map(p=>{const r=findRepo(p.id);if(!r)return null;const x=realFor(r,m),g=x.rows.find(y=>y.quant===p.q)||refQuant(x.rows);if(!g)return null;
 const meas=p.measured[m.id],tps=meas!=null?meas:g.tps;return{p,r,g,tps,meas:meas!=null}}).filter(o=>o&&o.g.lv!=='no'&&o.tps!=null&&o.tps>=TH.minMoe)}
function renderPicks(){const m=mach(),P=picksFor(m);if(!P.length)return'';
 return`<section class="picks" aria-labelledby="pkH" data-testid="picks"><div class="pkh"><h2 id="pkH">⚡ ${tr('Mạnh nhất cho máy của bạn')}</h2>
  <span class="small muted">${tr('Mô hình MoE: mỗi token chỉ dùng vài “chuyên gia”, nên mô hình lớn vẫn chạy được khi phần dư nằm trên RAM.')}</span></div>
  <div class="pkl">${P.map(o=>pickCard(o,m)).join('')}</div>
  <div class="small muted pkn">${tr('Số ≈ là số mẫu ước tính, chưa đo B-LADDER (#37) trên máy cùng loại. Chỉ giữ gợi ý khi số đo đạt từ {0} tok/s.',TH.minMoe)}</div></section>`}
function pickCard({p,r,g,tps,meas},m){const mo=moe(r);
 const where=g.ncpu?tr('GPU ≈ {0} + RAM ≈ {1}',fmtG(g.gpuG),fmtG(g.cpuG)):tr('vừa hết trong GPU');
 return`<button class="pk" data-pick="${esc(r.id)}" data-q="${esc(g.key)}" data-testid="pick"><span class="pkt">${logoTile(LOGO(r),30,r.author)}<span class="pkn2"><b>${esc(repoName(r))}</b>
  <span class="small muted">${esc(g.quant||g.name)} · ${tr('tệp')} ${fmtG(g.size)} · ${fmtB(mo.tot)} · ${mo.used}/${mo.n} ${tr('chuyên gia')}</span></span></span>
  <span class="small pkw">${p.why()}</span>
  <span class="pkm">${badge({lv:g.lv,real:true})} ${tpsTxt(tps,meas)}</span>
  <span class="small muted">${tr('cần')} ≈ ${fmtG(g.need)} · ${where}</span>
  ${g.ncpu?`<span class="small moel">🧩 ${tr('chuyên gia của {0}/{1} lớp trên CPU',g.ncpu,g.L)} · <code>--n-cpu-moe ${g.ncpu}</code></span>`:''}</button>`}
const fmtParams=t=>{const b=t/1e9;return(b>=10?Math.round(b):b.toFixed(1)).toString().replace('.',LANG==='vi'?',':'.')+'B '+tr('tham số')};
function renderPop(){const p=$('howPop');p.hidden=!st.pop;p.setAttribute('aria-label',tr('Cách ước tính'));if(!st.pop)return;const m=mach(),t=thr(m),g=x=>fmtG(x);
 p.innerHTML=`<div class="ph2"><b>${tr('Cách ước tính')}</b><button class="x" aria-label="${tr('Đóng')}" onclick="togglePop(false)">×</button></div>
 <p class="small">${tr('Trong danh sách (chưa mở kho): bản Q4_K_M ≈ số tham số × 4,85 / 8 byte, cộng 10% dự phòng, cộng ≈ 0,8 GB nếu kho có tệp mmproj (phần nhìn ảnh).')}</p>
 <table class="th"><tr><th>${tr('Máy')}</th><td colspan="2">${esc(m.gpu)} · ${m.vram} GB VRAM · ${m.ram} GB RAM</td></tr>
 <tr><td><span class="fit2 ok">${tr('Chạy mượt')}</span></td><td>${tr('cần dưới {0}',g(t.lo))}</td><td class="muted">${tr('nằm gọn trong VRAM dùng được ({0} = 90% VRAM)',g(t.T))}</td></tr>
 <tr><td><span class="fit2 chk">${tr('cần kiểm tra')}</span></td><td>${g(t.lo)} – ${g(t.hi)}</td><td class="muted">${tr('trong khoảng ±15% quanh ngưỡng VRAM; không bao giờ tính là mượt')}</td></tr>
 <tr><td><span class="fit2 moe">${tr('Chạy được (MoE)')}</span></td><td>${g(t.lo)} – ${g(t.R)}</td><td class="muted">${tr('MoE: phần chung + KV cache trên GPU, chuyên gia của N lớp trên CPU (--n-cpu-moe N), ước tính từ {0} tok/s',TH.minMoe)}</td></tr>
 <tr><td><span class="fit2 warn">${tr('Chạy chậm')}</span></td><td>${g(t.hi)} – ${g(t.R)}</td><td class="muted">${tr('phần dư chạy trên RAM/CPU (dùng tối đa 60% RAM = {0})',g(m.ram*TH.ramUse))}</td></tr>
 <tr><td><span class="fit2 bad">${tr('Không chạy được')}</span></td><td>${tr('trên {0}',g(t.R))}</td><td class="muted">${tr('vượt VRAM + RAM dùng được')}</td></tr></table>
 <p class="small">${tr('Khi mở một kho: dùng dung lượng tệp thật của từng bản lượng tử + KV cache cho ngữ cảnh {0} token ({1}) + {2} bộ đệm tính toán + tệp mmproj thật. Số này được lưu đệm trong trình duyệt và thay số ước tính trong danh sách.',fmtN(TH.ctx),kvType(m)==='q8_0'?tr('KV q8_0 vì VRAM dưới 6 GB'):tr('KV f16'),g(TH.overhead))}</p>
 <p class="small muted">${tr('Dấu ≈ nghĩa là ước tính, máy thật có thể khác. GB ở đây là GiB (1024³ byte). tok/s ước tính theo băng thông bộ nhớ bằng công thức đã hiệu chỉnh của fit.js, hạ thêm 10% để không ước cao; chưa phải số đo.')}</p>
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
function openRepo(id,o={}){if(st.mm&&st.mm.id!==id)mmStop();const r=findRepo(id);st.ext=null;st.sel=r?r.id:null;st.tab=o.tab||'readme';if(o.file)st.quant[st.sel]=o.file;st.mpane='detail';
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
   ${hasVision(r)?`<span class="tag cap">👁 ${tr('Nhìn màn hình')}</span>`:''}${toolTag(r)}${mo?`<span class="tag">${moeTag(mo)}</span>`:''}${r.gated?`<span class="tag">🔒 ${tr('cần đồng ý điều khoản')}</span>`:''}
   <span class="tag">⬇ ${fmtK(r.downloads)}</span><span class="tag">♥ ${fmtK(r.likes)}</span><span class="tag">${tr('cập nhật')} ${ago(r.lastModified)}</span></div>
  <div class="fitrow">${badge(f,'big')}<span class="small fittxt">${f.gated?tr('Chưa đọc được thông tin: repo cần quyền truy cập trên Hugging Face (đăng nhập và đồng ý điều khoản).'):f.real?tr('{0} cần {1} trên {2} (tệp thật + KV cache, ngữ cảnh {3})',f.q,fmtG(f.need),esc(m.gpu),fmtN(TH.ctx)):tr('ước tính {0} cần ≈ {1}',f.q,fmtG(f.need))}</span>
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
 wireFoot(el,r);
 el.querySelectorAll('.q[data-k]').forEach(e=>{e.onclick=()=>{st.quant[r.id]=e.dataset.k;renderDetail();const n=$('detail').querySelector(`.q[data-k="${CSS.escape(e.dataset.k)}"]`);n&&n.focus()};
  e.onkeydown=ev=>{if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){ev.preventDefault();const a=[...el.querySelectorAll('.q[data-k]')],i=a.indexOf(e);const n=a[i+(ev.key==='ArrowDown'?1:-1)];n&&n.focus()}}});
}
function wireFoot(el,r){
 el.querySelectorAll('[data-alt]').forEach(b=>b.onclick=()=>{st.quant[r.id]=b.dataset.alt;st.tab='files';renderDetail();const n=$('detail').querySelector(`.q[data-k="${CSS.escape(b.dataset.alt)}"]`);n&&n.focus()});
 el.querySelectorAll('[data-pickgo]').forEach(b=>b.onclick=()=>openRepo(b.dataset.pickgo,{tab:'files',file:b.dataset.q,kbd:true}));
 const d=el.querySelector('details.adv');if(!d)return;const k=d.dataset.k;
 d.ontoggle=()=>{st.adv[k]=d.open};
 const cur=()=>st.mm&&st.mm.k===k?st.mm:(st.mm={k,id:r.id,name:repoName(r),ack:false,ctx:2048,run:false,tok:0});
 const a=d.querySelector('[data-mm=ack]');a.onchange=()=>{if(st.mm&&st.mm.run&&st.mm.k!==k)return;const m=cur();m.ack=a.checked;renderDetail();const n=$('detail').querySelector('[data-mm=ack]');n&&n.focus()};
 const c=d.querySelector('[data-mm=ctx]');c.onchange=()=>{cur().ctx=+c.value};
 const g=d.querySelector('[data-mm=go]');g&&(g.onclick=()=>{const m=cur();if(!m.ack)return;const M=mach();m.sec=ssdSec(r,selQuant(r,realFor(r,M)),M);m.run=true;m.tok=0;m.el=0;mmBar();renderDetail();const s=$('mmbar').querySelector('button');s&&s.focus()})}
function selQuant(r,x){const k=st.quant[r.id];return x.rows.find(g=>g.key===k)||x.rows.find(g=>g.quant===k)||recQuant(x.rows)}
function filesPane(r,m){const x=realFor(r,m),sel=selQuant(r,x),rec=recQuant(x.rows),d=done(),t=thr(m);
 const mo=moe(r);
 const kvTxt=x.kv==null?tr('không đọc được phần đầu tệp GGUF, giả định KV ≈ 0,5 GB'):tr('KV cache {0} cho {1} token ({2}, {3} lớp)',fmtG(x.kv),fmtN(TH.ctx),x.kvT,r.meta.layers);
 let h=`<div class="small muted asm">${tr('Số thật cho {0}: dung lượng tệp + {1} + {2} bộ đệm tính toán',esc(m.gpu),kvTxt,fmtG(TH.overhead))}${x.mmp?' + '+tr('mmproj {0} ({1}) + {2} bộ đệm ảnh',esc(x.mmp.quant||x.mmp.name),fmtG(x.mmp.size),fmtG(TH.visionBuf)):''}. <span class="cached">✓ ${tr('đã lưu đệm')}</span></div>
 <div class="qtable" role="radiogroup" aria-label="${tr('Chọn bản lượng tử hoá')}"><div class="qh"><span></span><span>${tr('Bản')}</span><span class="qsz">${tr('Tệp')}</span><span>${tr('Cần (chạy)')}</span><span class="qlv">${tr('Mức chạy')}</span><span class="tps">≈ tok/s</span></div>`;
 for(const g of x.rows){const s=g===sel,have=d.some(y=>y.id===r.id&&y.k===g.key);
  h+=`<div class="q ${s?'sel':''}" role="radio" aria-checked="${s}" tabindex="${s?0:-1}" data-k="${esc(g.key)}" data-testid="q-${esc(g.quant||g.name)}"><span class="rad"></span>
   <span class="qn">${esc(g.quant||g.name)}${g.parts>1?` <span class="muted">· ${g.parts} ${tr('phần')}</span>`:''}${g===rec?`<span class="rec">★ ${tr('Đề xuất')}</span>`:''}${have?`<span class="rec">✓ ${tr('Đã tải')}</span>`:''}</span>
   <span class="small qsz">${fmtG(g.size)}</span><span class="small"><b>${fmtG(g.need)}</b></span><span class="qlv">${badge({lv:g.lv,real:true,gated:g.gated})}</span><span class="small muted tps" ${g.tps?`title="${tr('Ước tính, hạ thêm 10% để không ước cao')}"`:''}>${g.tps?'~'+tpsN(g.tps):'—'}</span></div>`}
 h+='</div>';
 if(x.mmp)h+=`<div class="small muted asm">${tr('Tệp nhìn ảnh (mmproj) sẽ tải kèm: {0} · {1}',esc(x.mmp.first),fmtG(x.mmp.size))}</div>`;
 if(x.aux.length)h+=`<div class="small muted asm">${tr('Tệp phụ trợ không tính (MTP/draft/imatrix): {0}',x.aux.map(a=>esc(a.name)).join(', '))}</div>`;
 h+=`<div class="small muted asm">${tr('Ngưỡng máy này: mượt dưới {0}, cần kiểm tra {0}–{1}, chậm đến {2}.',fmtG(t.lo),fmtG(t.hi),fmtG(t.R))}${mo&&mo.n?' '+tr('MoE {0}/{1} chuyên gia mỗi token (đọc từ đầu tệp GGUF).',mo.used,mo.n):''} <button class="lnk small" onclick="togglePop(true)">${tr('Cách ước tính')}</button></div>`;
 return h}
// #48 mục 3: báo "Không chạy được trên máy này" bằng số thật (GB cần so với GB máy có) + cách xử lý; mục 4: SSD mmap chỉ trong Nâng cao
function tooBig(r,g,x,m){const t=thr(m),miss=g.need-t.R;
 const alt=[...x.rows].reverse().find(y=>y.lv!=='no'&&!/^(F16|BF16|F32)$/.test(y.quant||''));const pk=picksFor(m).find(o=>o.r.id!==r.id);
 return`<div class="toobig" role="alert" data-testid="toobig"><b>⛔ ${tr('Không chạy được trên máy này')}</b>
  <div class="small">${tr('Bản {0} cần ≈ {1} khi chạy (tệp {2} + KV cache + bộ đệm). Máy này có {3} GB VRAM + {4} GB RAM; AIVN dùng được tối đa ≈ {5} (90% VRAM + 60% RAM). Thiếu ≈ {6}.',esc(g.quant||g.name),fmtG(g.need),fmtG(g.size),m.vram,m.ram,fmtG(t.R),fmtG(miss))}</div>
  <div class="small tbfix"><b>${tr('Cách xử lý')}:</b> ${alt?`<button class="lnk small" data-alt="${esc(alt.key)}" data-testid="alt">${tr('Chọn bản nhỏ hơn {0} (cần ≈ {1})',esc(alt.quant||alt.name),fmtG(alt.need))}</button>`:tr('Kho này không có bản nào vừa máy.')}
   ${pk?`<button class="lnk small" data-pickgo="${esc(pk.r.id)}" data-q="${esc(pk.g.key)}" data-testid="alt-pick">${tr('Thử {0} (MoE, chạy được trên máy này)',esc(repoName(pk.r)))}</button>`:''}</div>
  <div class="small muted">${tr('Nếu vẫn nạp, AIVN dừng ở bước Nạp mô hình và báo: “Mô hình quá to: cần ≈ {0}, máy có {1} GB VRAM + {2} GB RAM.”',fmtG(g.need),m.vram,m.ram)}</div>
  ${mmapAdv(r,g,m)}</div>`}
// thời gian mỗi token khi đọc phần không vừa RAM thẳng từ SSD: phần phải đọc mỗi token × tỉ lệ không nằm trong bộ nhớ đệm / tốc độ SSD, nhân 1,5 vì đọc rải rác
function ssdSec(r,g,m){const t=thr(m),mo=moe(r);if(mo&&r.meta&&r.meta.arch==='gpt-oss')mo.gptoss=true;const eb=expBytes(mo,g),act=mo&&mo.n?(g.size-eb)+eb*mo.used/mo.n:g.size;
 const miss=Math.max(0.05,1-Math.max(0,t.R-1)/g.size);return act*miss*GiB/(m.ssd*1e9)*1.5+0.05}
function mmapAdv(r,g,m){const k=r.id+'@'+g.key,mm=st.mm&&st.mm.k===k?st.mm:null,sec=ssdSec(r,g,m),open=st.adv[k]||!!mm;
 const spd=sec<1?tr('≈ ~{0} tok/s',tpsN(1/sec)):tr('≈ {0} giây/token',String(Math.round(sec*10)/10).replace('.',LANG==='vi'?',':'.'));
 return`<details class="adv" data-k="${esc(k)}" ${open?'open':''}><summary data-testid="adv">⚙ ${tr('Nâng cao: đọc thẳng từ SSD (mmap), thử nghiệm')}</summary>
  <div class="mmwarn" data-testid="mmwarn">⚠ <b>${tr('Rất chậm và có thể làm máy đứng hình.')}</b> ${tr('Phần không vừa RAM được đọc thẳng từ SSD cho mỗi token: {0} (SSD NVMe ≈ {1} GB/s). Chỉ để trò chuyện thử. Không bao giờ tự chọn, không dùng cho AIVN AGENT. Sẽ bỏ tính năng này nếu QA thấy Windows bị đơ.',spd,m.ssd)}</div>
  <label class="ck"><input type="checkbox" data-mm="ack" ${mm&&mm.ack?'checked':''}> ${tr('Tôi hiểu máy có thể chậm hoặc đứng hình')}</label>
  <label class="small ctxl">${tr('Giới hạn ngữ cảnh')} <select class="inp sel" data-mm="ctx">${TH.mmapCtx.map(c=>`<option value="${c}" ${(mm?mm.ctx:2048)===c?'selected':''}>${fmtN(c)}</option>`).join('')}</select> ${tr('token (tối đa {0})',fmtN(4096))}</label>
  ${mm&&mm.run?`<div class="small mmrun"><span class="spin"></span> ${tr('Đang chạy từ SSD · {0} token · {1}',mm.tok,spd)}</div>`
   :`<button class="btn" data-mm="go" data-testid="mm-go" ${mm&&mm.ack?'':'disabled'}>▶ ${tr('Thử chạy từ SSD')}</button>`}</details>`}
function mmBar(){let b=$('mmbar');const mm=st.mm&&st.mm.run?st.mm:null;document.body.classList.toggle('mmon',!!mm);
 if(!mm){b&&b.remove();return}
 if(!b){b=document.createElement('div');b.id='mmbar';b.className='mmbar';b.setAttribute('role','status');document.body.appendChild(b)}
 b.innerHTML=`<span class="spin"></span><span class="small mmt">${tr('Đang chạy {0} từ SSD · {1} token',esc(mm.name),mm.tok)}</span><button class="btn danger" data-testid="mm-stop" onclick="mmStop()">■ ${tr('Dừng')}</button>`}
function mmStop(){if(!st.mm)return;const was=st.mm.run;st.mm=null;mmBar();if(was){toast(tr('Đã dừng và giải phóng bộ nhớ'));renderDetail()}}
function footer(r,m){const x=realFor(r,m);if(!x.rows.length)return'';const g=selQuant(r,x),t=thr(m),d=done();
 const have=d.find(y=>y.id===r.id&&y.k===g.key),ing=dls.find(y=>y.id===r.id&&y.k===g.key&&y.state!=='done');
 const tot=g.size+(x.mmp?x.mmp.size:0),col={ok:'var(--ok)',check:'#38bdf8',moe:'#2dd4bf',slow:'var(--warn)',no:'var(--bad)',unk:'var(--tx3)'}[g.lv];
 const scale=Math.max(t.R,g.need)*1.05,pv=Math.min(100,g.need/scale*100),pT=t.T/scale*100;
 const msg={ok:tr('Chạy toàn bộ trên GPU.'),check:tr('Sát ngưỡng VRAM: có thể chạy hết trên GPU hoặc phải chia sang RAM. Nên chạy thử, hoặc chọn bản nhỏ hơn.'),slow:tr('Không vừa VRAM: một phần chạy trên RAM/CPU, chậm hơn nhiều.'),moe:tr('Không vừa VRAM nhưng là MoE: mỗi token chỉ dùng {0}/{1} chuyên gia nên vẫn khá nhanh.',g.used,g.n),no:'',unk:tr('Chưa đọc được thông tin: repo cần quyền truy cập trên Hugging Face.')}[g.lv];
 const moeL=g.ncpu?`<div class="small moel" data-testid="moe-place">🧩 ${tr('Phần chung + KV cache trên GPU (≈ {0}); chuyên gia của {1}/{2} lớp chạy trên CPU (≈ {3} trong RAM).',fmtG(g.gpuG),g.ncpu,g.L,fmtG(g.cpuG))} <code>--n-cpu-moe ${g.ncpu}</code></div>`:'';
 return`<div class="dfoot"><div class="row small"><span>${tr('Bộ nhớ cần khi chạy {0}',esc(g.quant||g.name))}</span><span class="grow"></span><b>${fmtG(g.need)}</b><span class="muted">/ ${m.vram} GB VRAM + ${m.ram} GB RAM</span></div>
  <div class="memviz" role="img" aria-label="${tr('Bộ nhớ cần {0}, ngưỡng VRAM {1}',fmtG(g.need),fmtG(t.T))}"><i style="width:${pv}%;background:${col}"></i><b style="left:${pT}%" title="${tr('ngưỡng VRAM')}"></b></div>
  ${g.lv==='no'?tooBig(r,g,x,m):`<div class="small" style="color:${col};margin-bottom:${moeL?4:10}px">${msg} ${tpsTxt(g.tps)}</div>${moeL}`}
  ${have?`<div class="row"><button class="btn" style="flex:1;justify-content:center" disabled>✓ ${tr('Đã tải về')}</button><a class="btn pri" href="chat.html">${tr('Nạp & trò chuyện')} →</a></div>`
  :ing?`<div class="row small"><span>${tr('Đang tải {0}…',esc(g.quant||g.name))}</span><span class="grow"></span><span>${Math.floor(ing.done/ing.size*100)}%</span></div><div class="bar ${ing.state==='paused'?'paused':''}" style="margin:6px 0 10px"><i style="width:${ing.done/ing.size*100}%"></i></div>
   <div class="row"><button class="btn" onclick="togglePause('${esc(ing.key)}')">${ing.state==='paused'?'▶ '+tr('Tiếp tục'):'⏸ '+tr('Tạm dừng')}</button><button class="btn danger" onclick="cancelDl('${esc(ing.key)}')">✕ ${tr('Huỷ')}</button></div>`
  :`<button class="btn ${g.lv==='no'?'':'pri'} dlgo" data-testid="dl" onclick="startDl()" ${r.gated?'disabled':''}>⬇ ${g.lv==='no'?tr('Vẫn tải về {0} · {1} (để dùng trên máy khác)',esc(g.quant||g.name),fmtG(tot)):tr('Tải về {0} · {1}',esc(g.quant||g.name),fmtG(tot))}${x.mmp?' '+tr('(kèm mmproj)'):''}</button>${r.gated?`<div class="small muted" style="margin-top:6px">${tr('Kho này yêu cầu đăng nhập Hugging Face và đồng ý điều khoản trước khi tải.')}</div>`:''}`}</div>`}

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
 if(ch)keepF(()=>{renderDl();renderDetail();_renderList()})
 if(st.mm&&st.mm.run){st.mm.el+=0.5*(window.FAST?20:1);st.mm.tok=Math.floor(st.mm.el/st.mm.sec);mmBar();const e=$('detail').querySelector('.mmrun');e&&(e.innerHTML=e.innerHTML.replace(/\d+ token/,st.mm.tok+' token'))}},500);

// ---- chung
function keepF(fn){const a=document.activeElement;let sel=null;
 if(a&&a!==document.body){if(a.id)sel='#'+CSS.escape(a.id);else if(a.dataset.testid&&a.dataset.testid!=='row')sel=`[data-testid="${a.dataset.testid}"]`;else if(a.dataset.id)sel=`.m[data-id="${CSS.escape(a.dataset.id)}"]`;else if(a.dataset.k)sel=`.q[data-k="${CSS.escape(a.dataset.k)}"]`}
 fn();if(sel&&(!document.activeElement||document.activeElement===document.body)){const n=document.querySelector(sel);n&&n.focus({preventScroll:true})}}
function renderList(k){keepF(()=>_renderList(k))}
function renderAll(){keepF(_renderAll)}
function setLang(l){LANG=l;LS.set(LSK.lang,l);renderAll()}
function setMach(id){if(st.mm)mmStop();st.mach=id;LS.set(LSK.mach,id);renderAll();const b=document.querySelector(`[data-testid="mach-${id}"]`);b&&b.focus()}
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
