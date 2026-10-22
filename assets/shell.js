// Khung chung: thanh điều hướng trái
const ICONS={
 chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/></svg>',
 models:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
 biz:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
 agent:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3v4M9 13h.01M15 13h.01"/></svg>',
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
 dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 20h16"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
};
function renderRail(active){
  const items=[['index.html','home','Trang chủ bản mẫu'],['chat.html','chat','Trò chuyện'],['models.html','models','Khám phá mô hình'],['products.html','biz','Kinh doanh'],['connect.html','agent','AIVN AGENT · Kết nối ứng dụng']];
  const r=document.querySelector('.rail');
  r.innerHTML='<div class="logo">AI<span style="opacity:.8">VN</span></div>'+items.map(([h,i,t])=>`<a href="${h}" class="${i===active?'on':''}">${ICONS[i]}<span class="tip">${t}</span></a>`).join('')+'<div class="sp"></div>';
}
function toast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2200)}
const fmtGB=g=>g>=1?g.toFixed(g>=10?1:2).replace('.',',')+' GB':Math.round(g*1024)+' MB';
const vnd=n=>new Intl.NumberFormat('vi-VN').format(Math.round(n))+' ₫';
// Dữ liệu mô hình mẫu (dùng chung cho models.html & chat.html)
const MODELS=[
 {id:'qwen3-vl-2b',name:'Qwen3-VL 2B Instruct',org:'Qwen',params:2.1,layers:28,arch:'qwen3vl',caps:['Thị giác','Công cụ'],ctx:32768,dl:'182 N',upd:'3 tuần trước',desc:'Mô hình đa phương thức nhỏ gọn: hiểu ảnh, đọc chữ trong ảnh (OCR), trả lời câu hỏi về ảnh chụp màn hình. Hợp máy yếu.',hot:true},
 {id:'qwen3-vl-4b',name:'Qwen3-VL 4B Instruct',org:'Qwen',params:4.4,layers:36,arch:'qwen3vl',caps:['Thị giác','Công cụ'],ctx:32768,dl:'241 N',upd:'3 tuần trước',desc:'Bản đa phương thức cân bằng giữa chất lượng và tốc độ; mô tả ảnh, phân tích biểu đồ, hỗ trợ AIVN AGENT nhìn màn hình.',hot:true},
 {id:'qwen3-8b',name:'Qwen3 8B',org:'Qwen',params:8.2,layers:36,arch:'qwen3',caps:['Suy luận','Công cụ'],ctx:40960,dl:'1,2 Tr',upd:'2 tháng trước',desc:'Mô hình văn bản đa năng, có chế độ suy nghĩ, tiếng Việt tốt.'},
 {id:'qwen3-14b',name:'Qwen3 14B',org:'Qwen',params:14.8,layers:40,arch:'qwen3',caps:['Suy luận','Công cụ'],ctx:40960,dl:'640 N',upd:'2 tháng trước',desc:'Chất lượng cao hơn bản 8B, cần card 12 GB trở lên.'},
 {id:'llama-3.2-3b',name:'Llama 3.2 3B Instruct',org:'Meta',params:3.2,layers:28,arch:'llama',caps:['Công cụ'],ctx:131072,dl:'2,4 Tr',upd:'1 năm trước',desc:'Mô hình nhỏ, nhanh, phù hợp tóm tắt và trả lời ngắn.'},
 {id:'llama-3.1-8b',name:'Llama 3.1 8B Instruct',org:'Meta',params:8.0,layers:32,arch:'llama',caps:['Công cụ'],ctx:131072,dl:'3,1 Tr',upd:'1 năm trước',desc:'Mô hình phổ biến, ngữ cảnh dài 128K.'},
 {id:'gemma-3-4b',name:'Gemma 3 4B IT',org:'Google',params:4.3,layers:34,arch:'gemma3',caps:['Thị giác'],ctx:131072,dl:'890 N',upd:'7 tháng trước',desc:'Mô hình nhỏ có thị giác, đa ngôn ngữ.'},
 {id:'gemma-3-12b',name:'Gemma 3 12B IT',org:'Google',params:12.2,layers:48,arch:'gemma3',caps:['Thị giác'],ctx:131072,dl:'520 N',upd:'7 tháng trước',desc:'Bản 12B mạnh hơn, cần nhiều VRAM.'},
 {id:'mistral-7b',name:'Mistral 7B Instruct v0.3',org:'Mistral AI',params:7.2,layers:32,arch:'llama',caps:['Công cụ'],ctx:32768,dl:'1,8 Tr',upd:'1 năm trước',desc:'Mô hình 7B kinh điển, nhanh và ổn định.'},
 {id:'mistral-small-24b',name:'Mistral Small 3.2 24B',org:'Mistral AI',params:23.6,layers:40,arch:'mistral',caps:['Thị giác','Công cụ'],ctx:131072,dl:'310 N',upd:'4 tháng trước',desc:'Mô hình lớn, chất lượng cao; cần card 16 GB+ hoặc giảm số lớp GPU.'},
 {id:'phi-4-mini',name:'Phi-4 Mini Instruct',org:'Microsoft',params:3.8,layers:32,arch:'phi3',caps:['Suy luận'],ctx:131072,dl:'470 N',upd:'8 tháng trước',desc:'Mô hình nhỏ giỏi toán và suy luận.'},
];
// bit/trọng số gần đúng (dữ liệu mẫu)
const QUANTS=[['Q3_K_M',3.9],['Q4_K_M',4.85],['Q5_K_M',5.7],['Q6_K',6.6],['Q8_0',8.5],['F16',16]];
const qsize=(m,q)=>{const b=QUANTS.find(x=>x[0]===q)[1];return m.params*b/8*1.02+(m.caps.includes('Thị giác')?0.35:0)};
function fitOf(size,vram){const need=size+0.6; if(need<=vram*0.85)return['ok','Vừa VRAM']; if(need<=vram*1.02)return['warn','Sát giới hạn']; return['bad','Không vừa'];}
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
// Logo: màu thương hiệu lấy từ dữ liệu Simple Icons (xem assets/logos/CREDITS.md)
const LOGOS={gmail:'#EA4335',googledrive:'#4285F4',googlecalendar:'#4285F4',googlesheets:'#34A853',github:'#181717',slack:'#4A154B',zalo:'#0068FF',notion:'#000000',sqlite:'#003B57',
 qwen:'#6950EF',meta:'#0467DF',google:'#4285F4',mistralai:'#FA520F',nvidia:'#76B900',amd:'#ED1C24',brave:'#FB542B',modelcontextprotocol:'#000000',
 huggingface:{c:'#000000',bg:'#FFD21E'},microsoftexcel:'#217346'}; // HF: màu vàng thương hiệu làm nền để logo đơn sắc đọc được
function logoTile(key,sz=34,title=''){const L0=LOGOS[key],gen=!L0;const f=gen?'generic-'+key:key;const r=Math.round(sz*0.26);
  const col=gen?'#fff':(typeof L0==='string'?L0:L0.c),bg=(L0&&L0.bg)?`background:${L0.bg};`:'';
  return `<span class="lg ${gen?'gen':''}" style="${bg}width:${sz}px;height:${sz}px;border-radius:${r}px" ${title?`title="${title}"`:''}><i style="background:${col};-webkit-mask-image:url(assets/logos/${f}.svg);mask-image:url(assets/logos/${f}.svg)"></i></span>`}
