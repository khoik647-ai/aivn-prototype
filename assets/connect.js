// Bản mẫu Kết nối ứng dụng v4.5 — F-PLUGINS bản 2 (PR #5) + quyết định ngày 22/10 (lượt 3). Mô phỏng hoàn toàn trong trình duyệt.
renderRail('agent');
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FOLDERS=['C:\\Users\\Khoi\\Documents\\AIVN','C:\\Users\\Khoi\\Documents\\Ke toan 2026','D:\\DuAn\\Bang tinh']; // mẫu cho bộ chọn thư mục
const agentFolder=()=>DB.agentFolder||FOLDERS[0]; // thư mục được phép của AIVN AGENT (agentFolders), chỉnh ở Cài đặt AIVN AGENT
const excelFolder=()=>(conn('excel')&&conn('excel').folder)||agentFolder(); // Excel có thư mục riêng; lần kết nối đầu mặc định = thư mục của AIVN AGENT
const baseName=p=>String(p).split(/[\\\/]/).filter(Boolean).pop();
const SECRETS_SECURE=false; // bản mẫu đóng vai máy không có kho khoá (mục 3.4 / 17.7)
const AG_MODELS=[{id:'q4',name:'Qwen3-VL 4B',params:4,ctx:8192},{id:'q14',name:'Qwen3 14B',params:14,ctx:32768},{id:'gguf',name:'mo-hinh-tu-tai.gguf',params:null,ctx:4096}];
const NATIVE_TOOLS=8,TOK_PER_TOOL=40; // giả định của bản mẫu
const GROUPS=[['productivity','Năng suất'],['communication','Giao tiếp'],['sales','Bán hàng'],['finance','Tài chính']];
const TABS=[['all','Tất cả'],...GROUPS,['mine','Của tôi']];
const STORE=[
 {id:'excel',group:'productivity',name:'Excel',logo:'microsoftexcel',ready:true,desc:'Đọc và ghi tệp Excel trong thư mục bạn chọn. Không cần cài Microsoft Excel.'},
 {id:'drive',group:'productivity',name:'Drive',logo:'googledrive',google:true,desc:'Tệp trên Google Drive.'},
 {id:'calendar',group:'productivity',name:'Calendar',logo:'googlecalendar',google:true,desc:'Lịch Google.'},
 {id:'notion',group:'productivity',name:'Notion',logo:'notion',desc:'Trang và cơ sở dữ liệu Notion.'},
 {id:'zalo',group:'communication',name:'Zalo',logo:'zalo',desc:'Nhắn tin Zalo.'},
 {id:'gmail',group:'communication',name:'Gmail',logo:'gmail',google:true,desc:'Đọc và gửi thư Gmail.'},
 {id:'biz',group:'sales',name:'AIVN Kinh doanh',logo:'@aivn',ready:true,desc:'Khách hàng, đơn bán, kho và hoá đơn ngay trong AIVN. Dữ liệu nằm trên máy này.'},
];
const ST=id=>STORE.find(s=>s.id===id);
const STORE_INFO={ // quyết định 22/10 (1): mô tả 1–2 câu, nơi để dữ liệu, nhà phát triển, phiên bản (số bản mẫu)
 biz:{long:'Cho AIVN AGENT xem và cập nhật khách hàng, đơn bán, kho và hoá đơn của bạn. Mọi dữ liệu nằm trên máy này.',where:'Trên máy này (tệp crm.db).',dev:'AIVN',ver:'4.3.0'},
 excel:{long:'Cho AIVN AGENT đọc và ghi bảng tính .xlsx, .csv trong thư mục bạn chọn. Bạn không cần cài Microsoft Excel.',where:'Trên máy này, trong thư mục của Excel.',dev:'AIVN (không phải Microsoft)',ver:'0.3.0'}};
const LEVELS=[['read','Chỉ đọc','Không hỏi.'],['write','Ghi','Hỏi bạn trước.'],['danger','Hỏi trước','Hỏi bạn mỗi lần.']];
const BIZ_CALLS=[
 ['listStock','read','Xem tồn kho'],['getPicking','read','Xem một phiếu kho'],['listPickings','read','Xem danh sách phiếu kho'],['getOrder','read','Xem một đơn bán'],['listOrders','read','Xem danh sách đơn bán'],
 ['getInvoice','read','Xem một hoá đơn'],['listInvoices','read','Xem danh sách hoá đơn'],['salesReport','read','Xem báo cáo bán hàng'],['invoiceReport','read','Xem báo cáo hoá đơn'],['stockReport','read','Xem báo cáo kho'],['overview','read','Xem tổng quan kinh doanh'],
 ['createReceipt','write','Tạo phiếu nhập kho'],['setDone','write','Đánh dấu phiếu kho đã xong'],['validatePicking','write','Xác nhận phiếu kho'],['adjustStock','write','Điều chỉnh số tồn'],['sendQuote','write','Gửi báo giá'],['confirmOrder','write','Xác nhận đơn bán'],
 ['resetToQuote','write','Đưa đơn bán về báo giá'],['saveInvoice','write','Lưu hoá đơn'],['invoiceOrder','write','Lập hoá đơn từ đơn bán'],['postInvoice','write','Ghi sổ hoá đơn'],['resetInvoice','write','Đưa hoá đơn về nháp'],
 ['cancelPicking','danger','Huỷ phiếu kho'],['cancelOrder','danger','Huỷ đơn bán'],['cancelInvoice','danger','Huỷ hoá đơn'],['registerPayment','danger','Ghi nhận thanh toán'],['creditNote','danger','Lập hoá đơn điều chỉnh giảm'],['deleteInvoice','danger','Xoá hoá đơn'],
];
const EXCEL_TOOLS=[['excel_read','read','Đọc tệp Excel hoặc CSV trong thư mục của Excel'],['excel_write','write','Ghi tệp Excel hoặc CSV trong thư mục của Excel (ghi đè thì hỏi kỹ hơn)']];
const storeTools=id=>id==='biz'?BIZ_CALLS.map(([n,k,d])=>['biz_'+n,k,d]):EXCEL_TOOLS;
const ADV=[
 {id:'filesystem',name:'Thư mục',desc:'Đọc và ghi một thư mục bạn chọn. Khác với “Thư mục được phép” của công cụ tệp AIVN.',needs:'folder',pkg:'@modelcontextprotocol/server-filesystem',ver:'2.0.0',
  tools:[['read_text_file','Read the complete contents of a file as text'],['write_file','Create a new file or completely overwrite an existing file'],['list_directory','Get a detailed listing of all files and directories'],['search_files','Recursively search for files and directories matching a pattern']]},
 {id:'fetch',name:'Đọc trang web',desc:'Tiến trình này tự mở mạng, kể cả khi “Cho phép truy cập mạng” đang tắt.',needs:'none',pkg:'mcp-fetch-server',ver:'1.1.2',tools:[['fetch_html','Fetch a website and return the content as HTML'],['fetch_markdown','Fetch a website and return the content as Markdown']]},
 {id:'huggingface',name:'Hugging Face',desc:'Máy chủ từ xa của Hugging Face. Đối số công cụ và kết quả được gửi tới huggingface.co.',needs:'secret',optional:true,secretVar:'Authorization',url:'https://huggingface.co/mcp',
  tools:[['model_search','Search for ML models on the Hugging Face Hub'],['dataset_search','Search for datasets on the Hugging Face Hub'],['paper_search','Find ML research papers'],['hf_doc_search','Search the Hugging Face documentation']]},
 {id:'memory',name:'Sổ tay agent',tile:'M',desc:'Sổ tay riêng của AIVN AGENT, nằm trong ứng dụng này. Không phải tính năng Ghi nhớ của AIVN và không ghi vào đó.',needs:'none',pkg:'@modelcontextprotocol/server-memory',ver:'2.0.0',
  tools:[['create_entities','Create multiple new entities in the knowledge graph'],['create_relations','Create multiple new relations between entities'],['add_observations','Add new observations to existing entities'],['delete_entities','Delete multiple entities and their associated relations'],['delete_observations','Delete specific observations from entities'],['delete_relations','Delete multiple relations from the knowledge graph'],['read_graph','Read the entire knowledge graph'],['search_nodes','Search for nodes in the knowledge graph'],['open_nodes','Open specific nodes by their names']]},
 {id:'thinking',name:'Suy nghĩ từng bước',desc:'Máy chủ giữ các bước suy nghĩ trung gian.',needs:'none',pkg:'@modelcontextprotocol/server-sequential-thinking',ver:'2.0.0',tools:[['sequentialthinking','A detailed tool for dynamic and reflective problem-solving through thoughts']]},
];
const ADVC=id=>ADV.find(c=>c.id===id);
const pinned=c=>c.pkg+'@'+c.ver;
const BUILTIN=[
 {id:'general',icon:'🤖',name:{vi:'Trợ lý tổng quát',en:'General assistant',zh:'通用助手'},description:{vi:'Cách làm việc mặc định, không thêm vai trò.',en:'The default way of working, no extra role.',zh:'默认工作方式，不加角色。'},starters:[],suggest:[]},
 {id:'coder',icon:'💻',name:{vi:'Lập trình viên',en:'Coder',zh:'编程助手'},description:{vi:'Đọc và sửa tệp trong thư mục được phép, nói ngắn.',en:'Read and edit files in allowed folders, keep it short.',zh:'在允许的文件夹里读写文件，回答从简。'},
  starters:[{vi:'Xem cấu trúc thư mục được phép và tóm tắt dự án.',en:'Look through the allowed folder and summarise the project.',zh:'查看允许的文件夹并概括这个项目。'},{vi:'Tìm chỗ định nghĩa hàm này và nói tệp nào chứa nó.',en:'Find where this function is defined and name the file.',zh:'找出这个函数定义在哪里，并说出是哪个文件。'}],suggest:[]},
 {id:'docs',icon:'📄',name:{vi:'Đọc tài liệu',en:'Read documents',zh:'阅读文档'},description:{vi:'Trả lời về tệp kèm theo, có trích đúng chỗ.',en:'Answer about the attached file, quoting the right place.',zh:'回答附带文件的问题，并引用正确的位置。'},
  starters:[{vi:'Tóm tắt tệp này theo từng mục, mỗi mục có một câu trích.',en:'Summarise this file by section, with one quoted sentence each.',zh:'按章节概括这个文件，每节引用一句。'},{vi:'Trong tệp này có nói đến thời hạn không? Trích đúng câu.',en:'Does this file mention a deadline? Quote the sentence.',zh:'这个文件里有没有写期限？请引用原句。'}],suggest:[]},
 {id:'research',icon:'🔎',name:{vi:'Tra cứu',en:'Research',zh:'查资料'},description:{vi:'Tìm trên mạng khi mạng đang bật và ghi địa chỉ đã xem.',en:'Search the web when the network is on and cite the pages read.',zh:'网络开启时上网查找，并写下看过的地址。'},
  starters:[{vi:'Tra cứu chủ đề này và ghi địa chỉ từng trang đã xem.',en:'Look this up and cite the address of each page you read.',zh:'查这个题目，并写下每一页的地址。'},{vi:'So sánh hai cách làm và nêu trang nào nói điều gì.',en:'Compare the two ways and say which page says what.',zh:'比较两种做法，并说明哪一页说了什么。'}],suggest:[]},
 {id:'files',icon:'🗂',name:{vi:'Thư ký tệp',en:'File clerk',zh:'文件助理'},description:{vi:'Liệt kê trước khi ghi; ghi đè và xoá vẫn chờ thẻ xin phép.',en:'Lists before writing; overwriting and deleting still wait for the card.',zh:'写入前先列出；覆盖和删除仍须等许可卡。'},
  starters:[{vi:'Liệt kê tệp trong thư mục được phép, nhóm theo loại.',en:'List the files in the allowed folder, grouped by kind.',zh:'列出允许文件夹里的文件，按类型分组。'},{vi:'Đọc bảng tính này và nói có bao nhiêu dòng.',en:'Read this spreadsheet and say how many rows it has.',zh:'读这个表格，说出有多少行。'}],suggest:['excel']},
];
const L=o=>o==null?'':typeof o==='string'?o:(o[LANG]??o.vi??Object.values(o)[0]??'');
const KEY='aivn.plugins.v45';
function seed(){const t='2026-10-01T09:00:00.000Z';return{
  mcp:{mcpServers:{'memory':{command:'npx',args:['-y',pinned(ADVC('memory'))]},'thoi-tiet':{url:'https://mcp.example.vn/weather'}}},
  meta:{v:1,connectors:{},servers:{'memory':{catalogId:'memory',approvedAt:t,alwaysOn:false},'thoi-tiet':{catalogId:null,approvedAt:t,alwaysOn:false}}},
  model:'q4',warnSig:null,master:true,lang:'vi',tpl:'general',userTpls:[],hintDismissed:false}}
let DB=LS.get(KEY,null)||seed();const save=()=>LS.set(KEY,DB);
LANG=DB.lang;
const RT={state:{},err:{},logs:{},listed:{},used:{},writeOk:{},testT:{},chat:[],restarted:false};
let UI={rename:null,warnOpen:false,excelPick:null,open:false,pane:'main',tab:'all',q:'',expanded:{},setup:{},plan:null,advMsg:null,advText:null,flash:null};
const servers=()=>DB.mcp.mcpServers;
const conn=id=>DB.meta.connectors[id];
const metaOf=k=>DB.meta.servers[k]||(DB.meta.servers[k]={catalogId:null,approvedAt:null,alwaysOn:false});
const keyOfCat=cid=>Object.keys(servers()).find(k=>(DB.meta.servers[k]||{}).catalogId===cid);
const safeName=k=>foldVi(k).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,24);
const now=()=>new Date().toISOString();
const log=(k,m)=>{(RT.logs[k]=RT.logs[k]||[]).push(new Date().toTimeString().slice(0,8)+'  '+m);RT.logs[k]=RT.logs[k].slice(-60)};
const SKEY=id=>'@'+id;
function hostOf(u){const m=/^[a-z]+:\/\/(\[[^\]]+\]|[^\/:?#]+)/i.exec(u);return m?m[1].toLowerCase():''}
function netKind(u){const h=hostOf(u);if(h==='localhost'||h==='[::1]'||/^127\.\d+\.\d+\.\d+$/.test(h))return'loop';
 const p=h.split('.').map(Number);if(p.length===4&&p.every(n=>Number.isInteger(n)&&n>=0&&n<=255)&&(p[0]===10||(p[0]===172&&p[1]>=16&&p[1]<=31)||(p[0]===192&&p[1]===168)))return'lan';return'public'}
const isHttp=u=>/^http:\/\//i.test(u||'');
// mục 17.5 (designer): chuẩn hoá URL trước khi so — bỏ '/' ở cuối, scheme + host không phân biệt hoa thường, đường dẫn giữ nguyên hoa thường
function normUrl(u){const m=/^([a-z][a-z0-9+.-]*:\/\/[^\/?#]*)(.*)$/i.exec(String(u||'').trim());if(!m)return String(u||'');return m[1].toLowerCase()+m[2].replace(/\/+$/,'')}
const urlEq=(a,b)=>!!a&&!!b&&normUrl(a)===normUrl(b);
const SECRET_NAME=/TOKEN|KEY|SECRET|PASSWORD|PASSWD|CREDENTIAL|AUTH/i,SECRET_VAL=/^(sk-|ghp_|github_pat_|hf_|Bearer )/;
const isSecret=(n,v)=>typeof v==='string'&&v!==''&&(SECRET_NAME.test(n)||/^(proxy-)?authorization$/i.test(n)||SECRET_VAL.test(v));
const isRef=v=>v&&typeof v==='object'&&v.$aivnSecret;
function secretNames(s){return [...Object.entries(s.env||{}),...Object.entries(s.headers||{})].filter(([n,v])=>isRef(v)||isSecret(n,v)).map(([n])=>n)}
function extractSecrets(key,s){let n=0;for(const f of ['env','headers'])if(s[f])for(const [k,v] of Object.entries(s[f]))if(isSecret(k,v)){s[f][k]={$aivnSecret:`mcp:${safeName(key)}:${k}`};n++}
 if(s.auth&&typeof s.auth==='object')for(const [k,v] of Object.entries(s.auth))if(isSecret(k,v)){s.auth[k]={$aivnSecret:`mcp:${safeName(key)}:${k}`};n++}return n}
function redact(s){if(s.url)return s.url;return [s.command,...(s.args||[])].map(a=>SECRET_VAL.test(a)?'••••':a).join(' ')}
const kindOf=s=>s.url?(s.type==='sse'||/\/sse$/.test(s.url)?'sse':'http'):'stdio';
const pkgArg=s=>(s.args||[]).find(a=>!a.startsWith('-'));
function unpinned(s){if(s.url||s.command!=='npx')return false;const p=pkgArg(s);return !p||!/^(@[^\/@]+\/)?[^@\/]+@[^@\s]+$/.test(p)}
function inCatalog(s){if(s.url)return ADV.some(c=>urlEq(c.url,s.url));return s.command==='npx'&&ADV.some(c=>c.pkg&&(s.args||[]).includes(pinned(c)))}
const pkgName=a=>a&&a.replace(/^(@[^\/@]+\/[^@]+|[^@]+)@.*$/,'$1');
function catalogMatch(s){if(s.url)return ADV.find(c=>c.url&&urlEq(c.url,s.url))||null;if(s.command!=='npx')return null;const p=pkgName(pkgArg(s));return ADV.find(c=>c.pkg&&c.pkg===p)||null}
// mục 17.5: khoá trùng id danh mục VÀ nội dung khớp, hoặc gói (bỏ @phiên bản) / URL (đã chuẩn hoá) khớp, và chỗ đó còn trống → nhận id danh mục. Chỉ trùng khoá → Của tôi. biz/excel không bao giờ nhận từ mcp.json.
function importSlot(k,s,taken){const c=ADVC(k)&&(ADVC(k).url?urlEq(s.url,ADVC(k).url):pkgName(pkgArg(s))===ADVC(k).pkg)?ADVC(k):catalogMatch(s);
 if(!c||keyOfCat(c.id)||taken.has(c.id))return null;return c.id}
const runsBundled=(c,s)=>!!(c&&c.pkg&&!s.url&&(s.args||[]).includes(pinned(c)));
const isDanger=s=>!inCatalog(s)||unpinned(s)||(isHttp(s.url)&&netKind(s.url)==='lan');
const KEY_NOTE=()=>SECRETS_SECURE?tr('Khoá được mã hoá bằng kho khoá của hệ điều hành và không bao giờ hiện lại hay ghi vào nhật ký.'):tr('Máy này không có kho khoá an toàn của hệ điều hành: khoá chỉ giữ trong bộ nhớ đến khi thoát AIVN (không ghi ra đĩa).');
const MCP_WARN=()=>tr('⚠ Máy chủ MCP là chương trình chạy trên máy bạn (stdio) hoặc dịch vụ bên ngoài (http/SSE) và có thể đọc/ghi dữ liệu. Chỉ thêm máy chủ bạn tin tưởng. AIVN luôn xin phép trước mỗi lần gọi công cụ MCP (trừ khi bạn chọn “Luôn cho phép”).');
function validateServer(k,s){const kt=k.trim();if(kt.length<1||kt.length>64)return tr('Tên máy chủ phải từ 1 đến 64 ký tự.');
 if(!s||typeof s!=='object'||Array.isArray(s))return tr('Máy chủ "{0}" không hợp lệ.',k);
 if(s.command&&s.url)return tr('Máy chủ "{0}" chỉ được có command hoặc url.',k);
 if(!(typeof s.command==='string'&&s.command)&&!s.url)return tr('Máy chủ "{0}" cần "command" (stdio) hoặc "url" (http/SSE).',k);
 if(s.args!==undefined&&!Array.isArray(s.args))return tr('"args" của "{0}" phải là mảng.',k);
 if(s.args&&!s.args.every(a=>typeof a==='string'))return tr('"args" của "{0}" chỉ được chứa chuỗi.',k);
 if(s.env!==undefined&&(typeof s.env!=='object'||Array.isArray(s.env)||s.env===null))return tr('"env" của "{0}" phải là đối tượng.',k);
 if(s.url){if(!/^https?:\/\//i.test(s.url))return tr('"url" của "{0}" phải bắt đầu bằng http:// hoặc https://',k);if(isHttp(s.url)&&netKind(s.url)==='public')return tr('"url" của "{0}" dùng http ra ngoài mạng nội bộ. Hãy dùng https, hoặc một địa chỉ trong mạng nội bộ.',k)}
 if(s.type!==undefined&&s.type!=='sse')return tr('"type" của "{0}" chỉ được là "sse".',k);
 if(s.timeout!==undefined&&!(Number.isInteger(s.timeout)&&s.timeout>=1000&&s.timeout<=600000))return tr('"timeout" của "{0}" phải là số nguyên từ 1000 đến 600000.',k);
 if(s.cwd!==undefined&&!(typeof s.cwd==='string'&&/^([a-zA-Z]:\\|\/)/.test(s.cwd)))return tr('"cwd" của "{0}" phải là thư mục có sẵn.',k);
 return null}
function parseFile(text){if(new Blob([text]).size>262144)return{fatal:tr('Tệp mcp.json lớn hơn 256 KB.')};
 let j;try{j=JSON.parse(text)}catch{return{fatal:tr('mcp.json không phải JSON hợp lệ.')}}
 if(!j||typeof j!=='object'||Array.isArray(j))return{fatal:tr('mcp.json phải là một đối tượng JSON.')};
 if(!j.mcpServers||typeof j.mcpServers!=='object'||Array.isArray(j.mcpServers))return{fatal:tr('Thiếu "mcpServers". Nếu tệp dùng khoá "servers", hãy đổi thành "mcpServers".')};
 return{servers:j.mcpServers}}
const sig=s=>JSON.stringify([s.command||null,s.args||[],s.url||null,Object.keys(s.env||{}).sort(),Object.keys(s.headers||{}).sort()]);
function start(k){const s=servers()[k];if(!s)return;if(!DB.master){RT.state[k]='off';return render()}
 RT.state[k]='starting';delete RT.err[k];const m=DB.meta.servers[k]||{},c=m.catalogId&&ADVC(m.catalogId);
 log(k,runsBundled(c,s)?`start stdio (bundled ${pinned(c)}, no npx)`:`start ${kindOf(s)}: ${redact(s)}`);render();
 setTimeout(()=>{if(!servers()[k]||RT.state[k]!=='starting')return;const ef=()=>validateServer(k,s)||(s.auth?tr('AIVN chưa hỗ trợ đăng nhập OAuth (trường auth) của máy chủ "{0}".',k):null);const e=ef();
  const so=e?null:simTest(k,s);
  if(e){RT.state[k]='error';RT.err[k]=ef;const o=LANG;LANG='en';const le=ef();LANG=o;log(k,'error: '+le)}else if(!so.ok){RT.state[k]='error';RT.err[k]=()=>testMsg(so);log(k,'error: '+so.err)}else{RT.state[k]='on';RT.listed[k]=true;log(k,`listTools: ${toolsOf(k).length}`)}render()},window.FAST?150:1100)}
// quyết định lượt 3 (3): chạy thử một lần khi nhập mcp.json hoặc thêm ở Nâng cao: mở → xem danh sách chức năng → tắt ngay, tối đa 15 giây.
// Xong vẫn “chờ dùng lần đầu”. Bản mẫu: kết quả cố định theo cấu hình (lệnh lạ → không tìm thấy, khoá trống → thiếu khoá, http mạng nội bộ → không tới được, gói @vidu/mcp-bao-cao → quá giờ).
const TEST_LIMIT=15,KNOWN_CMDS=['npx','node','python','python3','docker'],SIM_HANG=['@vidu/mcp-bao-cao'];
function simTest(k,s){
 if(s.url){if(isHttp(s.url)&&netKind(s.url)==='lan'){const h=/^[a-z]+:\/\/([^\/]+)/i.exec(s.url)[1];return{code:'network',sec:4,exit:null,err:'ECONNREFUSED',stderr:`connect ECONNREFUSED ${h}`}}return{ok:true,sec:3}}
 if(!KNOWN_CMDS.includes(s.command))return{code:'notfound',cmd:s.command,sec:1,exit:null,err:'ENOENT',stderr:`spawn ${s.command} ENOENT`};
 const ek=Object.entries(s.env||{}).find(([n,v])=>SECRET_NAME.test(n)&&v==='');
 if(ek)return{code:'key',sec:2,exit:1,err:'EXIT_1',stderr:`Error: ${ek[0]} environment variable is required\n    at main (file:///…/index.js:12:11)`};
 if(SIM_HANG.includes(pkgName(pkgArg(s))))return{code:'timeout',sec:TEST_LIMIT,exit:null,err:'ETIMEDOUT',stderr:`npm notice downloading ${pkgArg(s)} …\n(no reply to "initialize" after ${TEST_LIMIT} s, process killed)`};
 return{ok:true,sec:3}}
const TEST_MSG={timeout:['Ứng dụng không trả lời trong {0} giây nên AIVN đã dừng nó.','Bấm Chạy thử lại. Lần đầu ứng dụng có thể phải tải về lâu hơn. Nếu vẫn vậy, hỏi người cung cấp ứng dụng.'],
 notfound:['Máy này chưa có chương trình “{0}” mà ứng dụng cần.','Cài “{0}” rồi bấm Chạy thử lại.'],
 key:['Ứng dụng cần khoá truy cập nhưng khoá đang trống.','Thêm khoá ở Nâng cao rồi bấm Chạy thử lại.'],
 network:['Không tới được ứng dụng qua mạng.','Kiểm tra thiết bị đó đang bật và cùng mạng với máy này, rồi bấm Chạy thử lại.']};
const testArg=t=>t.code==='timeout'?TEST_LIMIT:t.code==='notfound'?t.cmd:'';
const testMsg=t=>tr(TEST_MSG[t.code][0],testArg(t)),testFix=t=>tr(TEST_MSG[t.code][1],testArg(t));
const TEST_LINE=()=>tr('AIVN sẽ chạy thử nhanh (tối đa {0} giây): mở ứng dụng, xem có những chức năng gì, rồi tắt ngay. Sau đó ứng dụng chỉ chạy khi AIVN AGENT dùng lần đầu.',TEST_LIMIT);
function runTest(k){return new Promise(res=>{const s=servers()[k];if(!s)return res(null);const m=metaOf(k),o=simTest(k,s),lim=Math.min(o.sec,TEST_LIMIT);
 RT.state[k]='testing';RT.testT[k]=0;delete RT.err[k];delete m.test;log(k,`test: start ${kindOf(s)}: ${redact(s)} (limit ${TEST_LIMIT}s)`);render();
 const iv=setInterval(()=>{if(!servers()[k]||RT.state[k]!=='testing'){clearInterval(iv);return res(null)}RT.testT[k]++;
  if(RT.testT[k]<lim)return render();clearInterval(iv);
  if(o.ok){const n=toolsOf(k).length;m.test={ok:true,n,at:now()};RT.listed[k]=true;log(k,`test: listTools -> ${n}`);log(k,'test: stop');RT.state[k]=DB.master&&m.approvedAt&&!s.disabled?'waiting':'off';log(k,'lazy: waiting for first use')}
  else{m.test={ok:false,code:o.code,cmd:o.cmd,exit:o.exit,err:o.err,stderr:o.stderr,sec:lim,at:now()};log(k,o.code==='timeout'?`test: no reply in ${TEST_LIMIT}s, killed`:`test: failed (${o.err}${o.exit!=null?', exit '+o.exit:''})`);RT.state[k]='error';RT.err[k]=()=>testMsg(m.test)}
  save();render();res(m.test)},window.FAST?120:1000)})}
async function runTests(keys){const rs=await Promise.all(keys.map(runTest));const ok=rs.filter(r=>r&&r.ok).length,bad=rs.filter(r=>r&&!r.ok).length;if(ok+bad)toast(tr('Chạy thử xong: {0} được, {1} lỗi.',ok,bad))}
function testLine(k){const m=DB.meta.servers[k]||{},t=m.test,s0=RT.state[k],tk=esc(k);
 if(s0==='testing'){const n=RT.testT[k]||0;return `<div class="tst run" data-testid="test-${tk}">⏳ ${tr('Đang chạy thử… {0}/{1} giây',n,TEST_LIMIT)}<span class="bar"><i style="width:${Math.round(100*n/TEST_LIMIT)}%"></i></span></div>`}
 if(!t||s0==='starting')return'';
 if(t.ok)return `<div class="tst ok" data-testid="test-${tk}">✓ ${tr('Chạy thử được · {0} chức năng',t.n)}</div>`;
 const ek='t:'+k;
 return `<div class="tst bad" data-testid="test-${tk}" onclick="event.stopPropagation()"><b>✕ ${esc(testMsg(t))}</b><div class="fix">${esc(testFix(t))}</div>
  <details class="apdet" data-testid="test-details-${tk}" ${UI.expanded[ek]?'open':''} ontoggle="if(this.isConnected)UI.expanded['${esc(ek)}']=this.open"><summary onclick="UI.expanded['${esc(ek)}']=!this.parentNode.open">${tr('Chi tiết')}</summary>
  <dl class="apf"><dt>${tr('Mã lỗi')}</dt><dd><code>${esc(t.err)}</code></dd><dt>${tr('Mã thoát')}</dt><dd>${t.exit==null?tr('không có (tiến trình không tự thoát)'):`<code>${t.exit}</code>`}</dd><dt>${tr('Thời gian')}</dt><dd>${tr('{0} giây',t.sec)}</dd><dt>stderr</dt><dd><pre class="log">${esc(t.stderr)}</pre></dd></dl></details></div>`}
// quyết định lượt 3 (4): đổi tên hiển thị (chỉ máy chủ người dùng thêm). Không để trống; “Dùng tên gốc” để quay lại khoá mcp.json.
const isUserSrv=k=>k[0]!=='@'&&!(DB.meta.servers[k]||{}).catalogId;
function renameStart(k){UI.rename={k,v:displayName(k),err:null,pos:null};render();setTimeout(()=>{const i=$('rn-in');if(i){i.focus();i.select()}},0)}
function renameCancel(){UI.rename=null;render()}
function renameSave(){const r=UI.rename;if(!r)return;const v=r.v.trim();if(!v){r.err=tr('Tên hiển thị không được để trống.');return render()}
 const m=metaOf(r.k);if(v===r.k)delete m.label;else m.label=v.slice(0,64);UI.rename=null;save();render()}
function renameReset(){const r=UI.rename;if(!r)return;delete metaOf(r.k).label;UI.rename=null;save();render()}
function renameBtn(k){return isUserSrv(k)&&!(UI.rename&&UI.rename.k===k)?`<button class="btn sm ghost" data-testid="rename-${esc(k)}" onclick="event.stopPropagation();renameStart('${esc(k)}')">✎ ${tr('Đổi tên hiển thị')}</button>`:''}
function nameOrEdit(k,cls){const r=UI.rename;if(!r||r.k!==k)return `<span class="${cls}">${esc(displayName(k))}</span>`;const lb=(DB.meta.servers[k]||{}).label;
 return `<span class="rn" onclick="event.stopPropagation()"><input class="inp" id="rn-in" data-testid="rename-input-${esc(k)}" maxlength="64" value="${esc(r.v)}" aria-label="${tr('Tên hiển thị')}" oninput="UI.rename.v=this.value;UI.rename.pos=this.selectionStart" onkeydown="event.stopPropagation();if(event.key==='Enter')renameSave();if(event.key==='Escape')renameCancel()">
  <button class="btn sm pri" data-testid="rename-save" onclick="renameSave()">${tr('Lưu')}</button><button class="btn sm ghost" data-testid="rename-cancel" onclick="renameCancel()">${tr('Huỷ')}</button>${lb?`<button class="btn sm ghost" data-testid="rename-reset" onclick="renameReset()">${tr('Dùng tên gốc')}</button>`:''}</span>`}
const renameErr=k=>UI.rename&&UI.rename.k===k&&UI.rename.err?`<div class="msg-bad small" data-testid="rename-err" style="margin-top:4px">${esc(UI.rename.err)}</div>`:'';
const errText=k=>{const e=RT.err[k];return typeof e==='function'?(e()||''):(e||'')};
function stop(k){if(RT.state[k]&&RT.state[k]!=='off')log(k,'stop');RT.state[k]='off'}
function toolsOf(k){if(k[0]==='@')return storeTools(k.slice(1));const m=DB.meta.servers[k];const c=m&&m.catalogId&&ADVC(m.catalogId);if(c)return c.tools;const n=safeName(k);return [[n+'_query','Sample tool reported by the server'],[n+'_list','Sample tool reported by the server']]}
const st=k=>k[0]==='@'?storeState(ST(k.slice(1))):(RT.state[k]||'off');
const connectedKeys=()=>[...['biz','excel'].filter(id=>conn(id)?.enabled).map(SKEY),...Object.keys(servers()).filter(k=>['on','waiting'].includes(RT.state[k])&&!servers()[k].disabled)];
const onSources=()=>DB.master?connectedKeys():[]; // công tắc tắt → AIVN AGENT không dùng ứng dụng nào
const countOn=()=>connectedKeys().length;
// quyết định lượt 3 (4): máy chủ người dùng thêm hiện tên gốc (khoá mcp.json); có thể đổi tên hiển thị (meta.label). Tên gốc giữ trong Chi tiết.
function displayName(k){if(k[0]==='@')return tr(ST(k.slice(1)).name);const m=DB.meta.servers[k];const c=m&&m.catalogId&&ADVC(m.catalogId);return c?tr(c.name):(m&&m.label)||k}
const catTile=c=>c.tile||c.name; // chữ trên ô cố định theo mục (Sổ tay agent: M theo id memory), không đổi theo tên hiển thị
const tileKey=k=>{const m=DB.meta.servers[k];return m&&m.catalogId?catTile(ADVC(m.catalogId)):k}; // mục danh mục, hoặc khoá mcp.json (không theo tên hiển thị)
const letterTile=(name,sz=32)=>`<span class="lt" style="width:${sz}px;height:${sz}px">${esc((String(name).trim()[0]||'?').toUpperCase())}</span>`;
function storeLogo(a,sz=32){return a.logo==='@aivn'?`<img class="lgimg" src="assets/logos/aivn-app.svg" width="${sz}" height="${sz}" alt="">`:logoTile(a.logo,sz)}
const srcLogo=(k,sz)=>k[0]==='@'?storeLogo(ST(k.slice(1)),sz):letterTile(tileKey(k),sz);
function toolCheck(){const M=AG_MODELS.find(m=>m.id===DB.model)||AG_MODELS[0];const list=onSources().map(k=>({k,n:toolsOf(k).length}));
 const total=NATIVE_TOOLS+list.reduce((a,b)=>a+b.n,0);const small=!(M.params>=8);const budget=Math.min(4000,Math.max(1500,Math.floor(M.ctx*.25)));const tok=total*TOK_PER_TOOL;
 return{M,list,total,warn:small&&total>20,block:tok>budget,budget,tok,sig:[M.ctx,total,...list.map(x=>x.k+':'+x.n)].join('|')}}
const apQueue=[];let apCur=null,apTimer=null,apLeft=0;
function askApproval(specFn){return new Promise(res=>{apQueue.push({specFn,res});if(!apCur)nextCard()})}
const fmtLeft=()=>`${Math.floor(apLeft/60)}:${String(apLeft%60).padStart(2,'0')}`;
function drawCard(){const el=$('approveCard');const s=apCur.specFn();const chk=!!($('apAlways')&&$('apAlways').checked),op=!!($('apDet')&&$('apDet').open&&apCur.drawn);
 el.className='show'+(s.danger?' danger':'');
 const dl=rows=>`<dl class="apf">${rows.map(([a,b,c])=>`<dt>${esc(a)}</dt><dd>${c?`<code>${esc(b)}</code>`:esc(b)}</dd>`).join('')}</dl>`;
 el.innerHTML=`<div class="k">${tr('Thẻ xin phép')}${s.danger?`<span class="danger-tag">⚠ ${tr('Cần xem kỹ')}</span>`:''}</div>
  <div class="row" style="gap:10px;margin-top:4px">${s.logoHtml||''}<h3 style="margin:0">${esc(s.title)}</h3></div>${s.sub?`<div id="apSub">${esc(s.sub)}</div>`:''}
  ${s.fields&&s.fields.length?dl(s.fields):''}${s.extraHtml||''}
  ${s.preview?`<div class="pl">${s.preview.map(([n,c])=>`<div class="r"><b>${esc(n)}</b><span class="muted small">${esc(c)}</span></div>`).join('')}</div>`:''}
  ${(s.lines||[]).map(l=>`<div class="apline">${esc(l)}</div>`).join('')}
  ${s.warn?`<div class="apwarn">${esc(s.warn)}</div>`:''}
  ${s.details&&s.details.length?`<details class="apdet" id="apDet" data-testid="approve-details" ${op?'open':''}><summary>${tr('Chi tiết')}</summary>${dl(s.details)}${s.detailNote?`<div class="small muted">${esc(s.detailNote)}</div>`:''}</details>`:''}
  ${s.alwaysLabel?`<label class="row small" style="gap:6px;margin-top:10px"><input type="checkbox" id="apAlways" ${chk?'checked':''}> ${esc(s.alwaysLabel)}</label>`:''}
  <div class="apact"><span class="small muted" style="margin-right:auto">${tr('Tự từ chối sau {0}','<span id="apT">'+fmtLeft()+'</span>')}</span>
   <button class="btn sm" onclick="apReason()">${tr('Từ chối kèm lý do')}</button>
   <button class="btn sm" onclick="apAnswer(false)">${tr('Từ chối')}<span class="kbd">Esc</span></button>
   <button class="btn sm pri" onclick="apAnswer(true)">${tr('Cho phép')}<span class="kbd" style="color:#fff;border-color:rgba(255,255,255,.5)">Ctrl+Enter</span></button></div><div id="apR"></div>`;
 apCur.drawn=true}
function nextCard(){apCur=apQueue.shift();const el=$('approveCard');clearInterval(apTimer);if(!apCur){el.className='';el.innerHTML='';return}
 apLeft=600;drawCard();el.scrollTop=0;apTimer=setInterval(()=>{apLeft--;if(apLeft<=0){apAnswer(false,{timeout:true});return}const t=$('apT');if(t)t.textContent=fmtLeft()},1000)}
function apAnswer(ok,extra={}){if(!apCur)return;const always=!!($('apAlways')&&$('apAlways').checked);const c=apCur;apCur=null;c.res({ok,always,...extra});nextCard()}
function apReason(){$('apR').innerHTML=`<div class="row" style="margin-top:8px"><input class="inp" id="apRs" placeholder="${tr('Lý do…')}"><button class="btn sm" onclick="apAnswer(false,{reason:$('apRs').value})">${tr('Gửi')}</button></div>`;$('apRs').focus()}
async function withCard(specFn){const was=UI.open;closeCA();const a=await askApproval(specFn);if(was)openCA();return a}
const lvlCount=id=>LEVELS.map(([l])=>storeTools(id).filter(t=>t[1]===l).length);
// quyết định 22/10 lượt 2 (d): Excel có thư mục riêng. Lần kết nối đầu mặc định = thư mục của AIVN AGENT (hiện trong thẻ).
// Đổi thư mục của Excel không bao giờ đổi thư mục của AIVN AGENT, và ngược lại. Đổi sang thư mục mới (cả hai loại) luôn qua thẻ xin phép.
const fName=p=>`<b title="${esc(p)}">${esc(baseName(p))}</b>`;
function excelFolderHtml(mode){const c=conn('excel');const p=mode==='card'?(UI.excelPick||agentFolder()):excelFolder();
 const btn=mode==='plain'||(mode==='detail'&&!c)?'':`<button class="btn sm ghost" data-testid="excel-folder-change" onclick="${mode==='card'?'pickExcelInCard()':'changeExcelFolder()'}">${tr('Đổi thư mục')}</button>`;
 const note=mode==='card'?`<div class="small muted fnote" data-testid="excel-folder-note">${p===agentFolder()?tr('Lúc đầu giống thư mục của AIVN AGENT. Đổi ở đây chỉ đổi cho Excel.'):tr('Khác thư mục của AIVN AGENT ({0}). Đổi ở đây chỉ đổi cho Excel.',fName(agentFolder()))}</div>`
  :mode==='detail'?`<div class="dline small" data-testid="excel-agent-folder">🗂 ${tr('Thư mục của AIVN AGENT (trong Cài đặt AIVN AGENT): {0}',fName(agentFolder()))}</div><div class="small muted fnote">${c?tr('Đổi thư mục của Excel không đổi thư mục của AIVN AGENT.'):tr('Khi kết nối, Excel bắt đầu với thư mục của AIVN AGENT. Bạn đổi được ngay trong thẻ xin phép.')}</div>`:'';
 return `<div class="apline fold">📁 ${tr('Thư mục của Excel:')} <b title="${esc(p)}" data-testid="excel-folder">${esc(baseName(p))}</b>${btn}</div>${note}`}
async function pickExcelInCard(){const f=await pickFolder(FOLDERS);if(!f)return;UI.excelPick=f;if(apCur)drawCard()}
function folderCard(who,f,old){const ex=who==='excel';return()=>({tool:ex?'excel_set_folder':'agent_set_folder',logoHtml:ex?storeLogo(ST('excel'),30):`<img class="lgimg" src="assets/logos/aivn-app.svg" width="30" height="30" alt="">`,
 title:ex?tr('Cho Excel dùng thư mục “{0}”?',baseName(f)):tr('Cho AIVN AGENT dùng thư mục “{0}”?',baseName(f)),sub:ex?'Excel':'AIVN AGENT',
 fields:[[tr('Thư mục mới'),f,1],[tr('Thư mục cũ'),old,1]],
 lines:ex?[tr('Excel chỉ đọc và ghi trong thư mục mới.'),tr('Thư mục của AIVN AGENT không đổi.')]:[tr('AIVN AGENT đọc và ghi tệp trong thư mục mới.'),tr('Thư mục của Excel không đổi.')],details:[],danger:false,alwaysLabel:null})}
async function changeExcelFolder(){const c=conn('excel');if(!c)return;const old=excelFolder();const f=await pickFolder(FOLDERS);if(!f||f===old)return;
 const r=await withCard(folderCard('excel',f,old));if(r.ok){c.folder=f;delete RT.writeOk.excel;save()}render()}
async function changeAgentFolder(){const old=agentFolder();const f=await pickFolder(FOLDERS);if(!f||f===old)return;
 const r=await withCard(folderCard('agent',f,old));if(r.ok){DB.agentFolder=f;save()}render()}
function storeSpec(id){return()=>{const a=ST(id),n=tr(a.name);
 const fields=id==='biz'?[[tr('Việc'),tr('Khách hàng, đơn bán, kho và hoá đơn trong AIVN Kinh doanh.')]]:[[tr('Việc'),tr('Đọc và ghi tệp .xlsx và .csv.')]];
 const [r,w,d]=lvlCount(id);fields.push([tr('Quyền'),tr('Chỉ đọc {0} · Ghi {1} · Hỏi trước {2}',r,w,d)]);
 const lines=id==='biz'?[tr('Dữ liệu nằm trên máy này (crm.db).')]:[tr('Chỉ trong thư mục này.'),tr('Không cần cài Microsoft Excel.')];
 lines.push(tr('Kết nối được giữ khi bạn mở lại AIVN.'));
 return{tool:'connector_connect',logoHtml:storeLogo(a,30),title:tr('Cho phép kết nối “{0}”?',n),sub:n,fields,lines,extraHtml:id==='excel'?excelFolderHtml('card'):'',
  warn:id==='biz'?tr('AIVN Kinh doanh đọc và sửa dữ liệu kinh doanh trên máy này. Xoá, huỷ và ghi nhận thanh toán vẫn hỏi bạn từng lần.'):tr('Ghi tệp Excel trong thư mục này. Ghi đè vẫn hỏi bạn trước.'),
  details:[],danger:false,alwaysLabel:null}}}
function mcpSpec(k,s,{folder,autostartOnly,noToken,title,test}={}){return()=>{const sn=secretNames(s),net=s.url?netKind(s.url):null,m=DB.meta.servers[k]||{},c=m.catalogId?ADVC(m.catalogId):catalogMatch(s);
 const lines=[];if(s.url&&net!=='loop')lines.push(tr('Dữ liệu gửi tới máy chủ này rời khỏi máy bạn.'));if(s.url&&net==='lan')lines.push(tr('Địa chỉ http này nằm trong mạng nội bộ của bạn.'));
 if(unpinned(s))lines.push(tr('Lệnh này không ghim phiên bản. npx có thể tải mã mới.'));if(noToken)lines.push(tr('Không có mã truy cập: máy chủ có thể từ chối yêu cầu.'));
 if(autostartOnly)lines.push(tr('Cho phép máy chủ này luôn chạy sẵn từ lúc mở AIVN. Việc này tốn thêm bộ nhớ (RAM/VRAM).'));
 if(test)lines.push(TEST_LINE());
 const nm=title?title():displayName(k);
 return{tool:'mcp_connect',logoHtml:letterTile(title?catTile(c||{name:nm}):tileKey(k),30),title:tr('Cho phép kết nối “{0}”?',nm),sub:nm,
  fields:[[tr('Khoá bí mật'),sn.length?sn.join(', '):tr('không có'),sn.length?1:0],...(sn.length?[[tr('Lưu khoá'),KEY_NOTE()]]:[])],lines,
  details:[[tr('Tên gốc'),k,1],[s.url?tr('Địa chỉ'):tr('Lệnh'),redact(s),1],[tr('Loại'),kindOf(s)],...(folder?[[tr('Thư mục'),folder,1]]:[])],
  detailNote:runsBundled(c,s)?tr('Gói này nằm sẵn trong bản cài AIVN. Khi chạy, AIVN không gọi npx và không tải gì.'):null,
  warn:MCP_WARN(),danger:isDanger(s),alwaysLabel:null}}}
async function connectStore(id){const a=ST(id);if(!a.ready)return;const c=conn(id);
 if(c&&c.approvedAt){c.enabled=true;RT.used[id]=true;save();render();return}
 if(id==='excel')UI.excelPick=null;const r=await withCard(storeSpec(id));const pick=UI.excelPick;UI.excelPick=null;if(!r.ok){render();return}
 DB.meta.connectors[id]={approvedAt:now(),enabled:true,...(id==='excel'?{folder:pick||agentFolder()}:{})};RT.used[id]=true;save();render()}
function disconnectStore(id){const c=conn(id);if(c){c.enabled=false;save()}render()}
async function removeStore(id){const n=tr(ST(id).name);const ok=await modalAsk(tr('Gỡ “{0}”?',n),tr('Công cụ của kết nối này sẽ biến mất. Các mục “Luôn cho phép” của nó cũng bị xoá.'),tr('Gỡ'));
 if(!ok)return;delete DB.meta.connectors[id];delete RT.used[id];delete RT.writeOk[id];save();render()}
// quyết định 22/10 (5): nhớ “đã kết nối” qua lần mở lại; chạy khi AIVN AGENT dùng lần đầu; lần ghi đầu sau khi mở lại vẫn qua thẻ
function storeActs(id){return id==='biz'?[['listStock','read','Xem tồn kho'],['createReceipt','write','Tạo phiếu nhập kho'],['cancelInvoice','danger','Huỷ hoá đơn']].map(([n,l,d])=>['biz_'+n,l,d]):EXCEL_TOOLS.map(([n,l])=>[n,l,l==='read'?'Đọc tệp Excel':'Ghi tệp Excel'])}
async function agentUse(id,tool){const c=conn(id),a=ST(id),t=storeActs(id).find(x=>x[0]===tool);if(!c||!c.enabled||!DB.master)return;
 const say=m=>{RT.chat.push(m);render()};
 if(!RT.used[id]){RT.used[id]=true;say('▶ '+tr('{0} bắt đầu chạy (lần dùng đầu).',tr(a.name)))}
 if(t[1]==='write'&&RT.writeOk[id]||t[1]==='read'){say('✓ '+tr(t[2]));return}
 const r=await askApproval(()=>({tool,logoHtml:storeLogo(a,30),title:tr('AIVN AGENT muốn: {0}',tr(t[2])),sub:tr(a.name),
  fields:[[tr('Ứng dụng'),tr(a.name)],[tr('Việc'),tr(t[2])]],extraHtml:id==='excel'?excelFolderHtml('plain'):'',
  lines:t[1]==='write'&&RT.restarted?[tr('Lần ghi đầu tiên sau khi mở lại AIVN.')]:t[1]==='danger'?[tr('Việc này luôn hỏi bạn mỗi lần.')]:[],
  details:[[tr('Công cụ'),tool,1]],danger:t[1]==='danger',alwaysLabel:null}));
 if(!r.ok){say('✕ '+tr('Bạn đã từ chối: {0}',tr(t[2])));return}
 if(t[1]==='write')RT.writeOk[id]=true;say('✓ '+tr(t[2]))}
async function agentUseMcp(k){if(!DB.master||!servers()[k])return;const say=m=>{RT.chat.push(m);render()};const nm=displayName(k);
 if(RT.state[k]!=='on'){say('▶ '+tr('{0} bắt đầu chạy (lần dùng đầu).',nm));start(k);await new Promise(r=>{const t=setInterval(()=>{if(RT.state[k]!=='starting'){clearInterval(t);r()}},50)})}
 if(RT.state[k]!=='on'){say('✕ '+tr('Không chạy được “{0}”. Mở Nâng cao để xem.',nm));return}
 const tool=toolsOf(k)[0][0];
 const r=await askApproval(()=>({tool,logoHtml:letterTile(tileKey(k),30),title:tr('AIVN AGENT muốn dùng “{0}”',nm),sub:nm,fields:[[tr('Ứng dụng'),nm]],
  lines:[tr('Ứng dụng thêm ở Nâng cao luôn hỏi bạn trước mỗi lần dùng.')],details:[[tr('Tên gốc'),k,1],[tr('Công cụ'),tool,1]],danger:false,alwaysLabel:null}));
 say(r.ok?'✓ '+tr('Đã dùng “{0}”',nm):'✕ '+tr('Bạn đã từ chối: {0}',nm))}
function restartSim(){closeCA();$('tplBack').classList.remove('open');Object.keys(servers()).forEach(stop);
 RT.state={};RT.listed={};RT.used={};RT.writeOk={};RT.chat=[];RT.restarted=true;
 toast(tr('(bản mẫu) Đã mở lại AIVN. Kết nối vẫn còn. Ứng dụng chỉ chạy khi AIVN AGENT dùng lần đầu, trừ mục “Luôn chạy sẵn”.'));startAll(true)}
function newKeyFor(cid){if(!servers()[cid])return cid;let i=2;while(servers()[cid+'-'+i])i++;return cid+'-'+i}
async function connectCatalog(cid){if(!DB.master)return;const c=ADVC(cid);let k=keyOfCat(cid);
 if(k)return connectKey(k);
 let folder=null,token=null;
 if(c.needs==='folder'){folder=await pickFolder(['D:\\DuAn\\AIVN','C:\\Users\\Khoi\\Documents','C:\\Users\\Khoi\\Desktop\\Bai tap']);if(!folder)return}
 if(c.needs==='secret'){const s0=UI.setup[cid];if(!s0){UI.setup[cid]={v:''};render();setTimeout(()=>{const i=$('sec-'+cid);i&&i.focus()},0);return}
  token=(s0.v||'').trim();if(!token&&!c.optional){$('sec-'+cid).focus();return}}
 k=newKeyFor(cid);
 const s=c.url?{url:c.url,timeout:120000}:{command:'npx',args:['-y',pinned(c),...(folder?[folder]:[])]};
 if(token){const ref={$aivnSecret:`mcp:${safeName(k)}:${c.secretVar}`};if(c.url)s.headers={[c.secretVar]:ref};else s.env={[c.secretVar]:ref}}
 const a=await withCard(mcpSpec(k,s,{folder,noToken:c.optional&&!token,title:()=>tr(c.name),test:true}));
 delete UI.setup[cid];if(!a.ok){render();return}
 servers()[k]=s;DB.meta.servers[k]={catalogId:cid,approvedAt:now(),alwaysOn:false};save();runTest(k)}
async function connectKey(k){if(!DB.master)return;const s=servers()[k],m=metaOf(k);if(s.auth){start(k);return}delete s.disabled;save();
 if(!m.approvedAt){const a=await withCard(mcpSpec(k,s,{test:true}));if(!a.ok){render();return}m.approvedAt=now();save()}
 runTest(k)} // kết nối / kết nối lại / chạy thử lại: chạy thử rồi chờ dùng lần đầu
function disconnectKey(k){if(k[0]==='@')return disconnectStore(k.slice(1));servers()[k].disabled=true;stop(k);save();render()}
async function removeKey(k){const ok=await modalAsk(tr('Gỡ máy chủ “{0}”?',displayName(k)),tr('Công cụ của máy chủ này sẽ biến mất. Các mục “Luôn cho phép” của nó cũng bị xoá. Khoá bí mật của máy chủ này bị xoá khỏi máy.'),tr('Gỡ'));
 if(!ok)return;stop(k);delete servers()[k];delete DB.meta.servers[k];delete RT.state[k];delete UI.expanded[k];if(UI.rename&&UI.rename.k===k)UI.rename=null;save();render()}
async function toggleAlways(k,on){ // “Luôn chạy sẵn” — mặc định tắt (thay cho tự chạy khi mở AIVN)
const m=metaOf(k);if(!on){m.alwaysOn=false;save();return render()}
 const a=await withCard(mcpSpec(k,servers()[k],{autostartOnly:true}));if(a.ok){m.alwaysOn=true;if(!m.approvedAt)m.approvedAt=now();save()}render()}
function openCA(o={}){UI.open=true;$('caModal').dataset.pane='';if(o.pane)UI.pane=o.pane;if(o.tab)UI.tab=o.tab;$('caBack').classList.add('open');
 if(o.scrollTo){const k=o.scrollTo;UI.q='';if(k[0]==='@'){UI.pane='detail';UI.detail=k.slice(1)}else{UI.pane='adv';UI.expanded[k]=true}UI.flash=k}
 render();setTimeout(()=>{const e=document.querySelector('#caModal .flash')||(o.section&&$(o.section));e&&e.scrollIntoView({block:'center'});if(UI.pane==='main'&&!o.scrollTo)$('caQ')&&$('caQ').focus()},0)}
function closeCA(){UI.open=false;$('caBack').classList.remove('open')}
const PILL={waiting:'Đã kết nối · chờ dùng lần đầu',available:'Chưa kết nối',soon:'Sắp có','needs-setup':'Cần thiết lập',starting:'Đang kết nối…',testing:'Đang chạy thử…',on:'Đã kết nối',off:'Đã tắt',error:'Lỗi'};
const pill=s=>`<span class="st ${s}">${tr(PILL[s])}</span>`;
const toggleExp=k=>{UI.expanded[k]=!UI.expanded[k];render()};
function storeState(a){if(!a.ready)return'soon';const c=conn(a.id);return !c?'available':!c.enabled?'off':RT.used[a.id]?'on':'waiting'}
function storeTile(a){const s=storeState(a),k=SKEY(a.id);
 let btn='';if(s==='available'||s==='off')btn=`<button class="btn sm pri" data-testid="connect-apps-connect-${a.id}" onclick="event.stopPropagation();connectStore('${a.id}')">${tr('Kết nối')}</button>`;
 else if(s==='on'||s==='waiting')btn=`<button class="btn sm" data-testid="connect-apps-connect-${a.id}" onclick="event.stopPropagation();disconnectStore('${a.id}')">${tr('Ngắt kết nối')}</button>`;
 else if(s==='soon'){const on=DB.notify&&DB.notify[a.id];btn=`<button class="btn sm ${on?'':'ghost'}" data-testid="connect-apps-notify-${a.id}" aria-pressed="${!!on}" onclick="event.stopPropagation();toggleNotify('${a.id}')">${on?'✓ '+tr('Sẽ báo bạn'):'🔔 '+tr('Báo tôi khi có')}</button>`}
 const tid=a.ready?`connect-apps-card-${a.id}`:`connect-apps-soon-${a.id}`;const on=DB.notify&&DB.notify[a.id];
 return `<div class="card tile ${s==='on'||s==='waiting'?'on':''} ${a.ready?'clickable':'soon'} ${UI.flash===k?'flash':''}" data-testid="${tid}" ${a.ready?`onclick="openDetail('${a.id}')"`:''}>
  <div class="t">${storeLogo(a)}<div class="nm">${esc(tr(a.name))}</div><span style="flex:1"></span>${pill(s)}</div>
  <div class="d">${esc(tr(a.desc))}</div>${a.google?`<div class="gl">${tr('Chờ đăng nhập Google.')}</div>`:''}${on?`<div class="gl ok">${tr('AIVN sẽ báo bạn ngay trong ứng dụng khi có. Không gửi gì ra ngoài.')}</div>`:''}
  <div class="ft">${a.ready&&(s==='on'||s==='waiting')?`<span class="muted small">${tr('Làm được {0} việc',storeTools(a.id).length)}</span>`:''}<span style="flex:1"></span>${btn}</div></div>`}
function toggleNotify(id){DB.notify=DB.notify||{};if(DB.notify[id])delete DB.notify[id];else DB.notify[id]=now();save();render()}
function openDetail(id){UI.detail=id;UI.pane='detail';render()}
function detailBody(id){const a=ST(id),i=STORE_INFO[id],s=storeState(a),c=conn(id);
 const btn=s==='available'||s==='off'?`<button class="btn pri" data-testid="connect-apps-detail-connect" onclick="connectStore('${id}')">${tr('Kết nối')}</button>`:`<button class="btn" data-testid="connect-apps-detail-connect" onclick="disconnectStore('${id}')">${tr('Ngắt kết nối')}</button>`;
 const lv=LEVELS.map(([l,h,sub])=>{const ts=storeTools(id).filter(t=>t[1]===l);return ts.length?`<div class="lvl lvl-${l}"><div class="lh"><span class="lb">${tr(h)}</span><span class="muted small">${tr(sub)} · ${tr('{0} việc',ts.length)}</span></div><div class="tgl">${ts.map(t=>esc(tr(t[2]))).join(' · ')}</div></div>`:''}).join('');
 return `<div class="detail" data-testid="connect-apps-detail-${id}">
  <div class="dh">${storeLogo(a,48)}<div><h3>${esc(tr(a.name))}</h3>${pill(s)}</div><span style="flex:1"></span>${btn}</div>
  <p class="dl">${esc(tr(i.long))}</p>
  <div class="grp">${tr('Quyền')}</div>${lv}
  <div class="grp">${tr('Dữ liệu nằm ở')}</div><div class="dline">🖥 ${tr(i.where)}</div>${id==='excel'?excelFolderHtml('detail'):''}
  <div class="grp">${tr('Nhà phát triển và phiên bản')}</div><div class="dline">${esc(tr(i.dev))} · ${tr('bản {0} (số mẫu)',i.ver)}</div>
  ${c?`<div class="row" style="margin-top:12px"><button class="btn sm danger" onclick="removeStore('${id}')">${tr('Gỡ')}</button></div>`:''}
  <details class="apdet" data-testid="connect-apps-detail-tech"><summary>${tr('Chi tiết')}</summary><dl class="apf">
   <dt>${tr('Cách chạy')}</dt><dd>${tr('Trong AIVN, không có tiến trình riêng, không qua mcp.json.')}</dd>
   <dt>${tr('Đường truyền')}</dt><dd>${tr('Gọi trực tiếp trong ứng dụng (không stdio, không http).')}</dd>
   <dt>${tr('Công cụ')}</dt><dd>${storeTools(id).map(t=>`<code>${t[0]}</code>`).join(' ')}</dd></dl></details></div>`}
const MASTER_HINT=()=>tr('Công tắc “Cho AIVN AGENT dùng các ứng dụng đã kết nối” đang tắt. AIVN AGENT sẽ không dùng ứng dụng nào cho đến khi bạn bật lại.');
function mcpExpand(k){const s=servers()[k],m=DB.meta.servers[k]||{},dis=!DB.master?'disabled':'';
 return `<div class="exp" onclick="event.stopPropagation()"><div style="grid-column:1/-1" class="small"><span style="color:var(--tx3)">${tr('Tên gốc (trong mcp.json)')}:</span> <code data-testid="orig-name-${esc(k)}">${esc(k)}</code>${m.label?` · <span style="color:var(--tx3)">${tr('Tên hiển thị')}:</span> ${esc(m.label)}`:''}</div>${errText(k)&&!(m.test&&m.test.ok===false)?`<div class="msg-bad" style="grid-column:1/-1">${esc(errText(k))}</div>`:''}
   <div class="tl"><div class="small" style="color:var(--tx3);margin-bottom:6px">${tr('Công cụ')}</div>${RT.listed[k]?toolsOf(k).map(([n,d])=>`<div><code>${esc(n)}</code> <span>— ${esc(d)}</span></div>`).join(''):`<div class="muted small">—</div>`}</div>
   <div><div class="small" style="color:var(--tx3);margin-bottom:6px">${tr('Nhật ký (60 dòng cuối)')}</div><div class="log">${esc((RT.logs[k]||[]).join('\n'))||'—'}</div></div>
   <div style="grid-column:1/-1"><span class="small" style="color:var(--tx3)">${s.url?tr('Địa chỉ'):tr('Lệnh')} · ${kindOf(s)}</span><div class="meta">${esc(redact(s))}</div></div>
   <div class="row" style="grid-column:1/-1;gap:8px">${s.auth?'':`<button class="btn sm" ${dis} ${st(k)==='testing'?'disabled':''} onclick="connectKey('${esc(k)}')">${tr('Kết nối lại')}</button>`}<button class="btn sm danger" onclick="removeKey('${esc(k)}')">${tr('Gỡ')}</button>
   </div></div>`}
function alwaysRow(k){if(!k||servers()[k].auth)return'';const m=metaOf(k);
 return `<label class="row small always" style="gap:6px;margin-top:6px" data-testid="adv-always-${esc(k)}" onclick="event.stopPropagation()"><input type="checkbox" ${m.alwaysOn?'checked':''} onchange="toggleAlways('${esc(k)}',this.checked)"> <b>${tr('Luôn chạy sẵn')}</b> <span class="muted">${m.alwaysOn?tr('Chạy ngay khi mở AIVN, tốn thêm bộ nhớ.'):tr('Tắt: chỉ chạy khi AIVN AGENT cần, đỡ tốn bộ nhớ.')}</span></label>`}
function techDetails(id,k,meta){const ek=k||('cat:'+id);return `<details class="apdet" data-testid="adv-details-${esc(id)}" ${UI.expanded[ek]?'open':''} ontoggle="if(this.isConnected)UI.expanded['${esc(ek)}']=this.open" onclick="event.stopPropagation()"><summary onclick="UI.expanded['${esc(ek)}']=!this.parentNode.open">${tr('Chi tiết')}</summary><div class="meta">${meta}</div>${k?mcpExpand(k):''}</details>`}
function mcpBtn(k,id){const s0=st(k),dis=!DB.master?`disabled title="${esc(MASTER_HINT())}"`:'';
 if(servers()[k].auth)return'';
  if(s0==='on'||s0==='waiting')return `<button class="btn sm" data-testid="connect-apps-connect-${esc(id)}" onclick="event.stopPropagation();disconnectKey('${esc(k)}')">${tr('Ngắt kết nối')}</button>`;
 if(s0==='starting')return `<button class="btn sm" disabled>${tr('Đang kết nối…')}</button>`;
 if(s0==='testing')return `<button class="btn sm" disabled data-testid="connect-apps-connect-${esc(id)}">${tr('Đang chạy thử…')}</button>`;
 const tf=(DB.meta.servers[k]||{}).test;
 return `<button class="btn sm ${s0==='error'?'':'pri'}" ${dis} data-testid="connect-apps-connect-${esc(id)}" onclick="event.stopPropagation();connectKey('${esc(k)}')">${s0==='error'?(tf&&tf.ok===false?tr('Chạy thử lại'):tr('Thử lại')):tr('Kết nối')}</button>`}
const catDesc=k=>{const m=DB.meta.servers[k]||{};const c=m.catalogId&&ADVC(m.catalogId);return c?tr(c.desc):tr('Máy chủ MCP trong mcp.json của bạn.')};
function mineMcpTile(k){const s0=st(k);
 return `<div class="card tile clickable ${s0==='on'||s0==='waiting'?'on':''}" data-testid="connect-apps-card-${esc(k)}" onclick="openCA({scrollTo:'${esc(k)}'})">
  <div class="t">${letterTile(tileKey(k))}${nameOrEdit(k,'nm')}${UI.rename&&UI.rename.k===k?'':`<span style="flex:1"></span>${pill(s0)}`}</div>${renameErr(k)}
  <div class="d">${s0==='error'&&!tfail(k)?tr('Không kết nối được. Mở Nâng cao để xem.'):tr('Bạn thêm ở Nâng cao.')}</div>${testLine(k)}
  <div class="ft">${renameBtn(k)}<span style="flex:1"></span>${mcpBtn(k,k)}</div></div>`}
const tfail=k=>{const t=(DB.meta.servers[k]||{}).test;return t&&t.ok===false}
const match=(...xs)=>{const q=foldVi(UI.q.trim());return !q||foldVi(xs.join(' ')).includes(q)};
const EMPTY_GROUP={finance:['💰','Chưa có ứng dụng tài chính.','Nhóm này sẽ có thêm ứng dụng trong các bản sau.']};
function emptyGroup(g){const [ic,h,sub]=EMPTY_GROUP[g]||['🗂','Chưa có ứng dụng trong nhóm này.',null];
 return `<div class="emptybox" data-testid="connect-apps-group-${g}"><div class="ei" aria-hidden="true">${ic}</div><div class="eh">${tr(h)}</div>${sub?`<div class="es">${tr(sub)}</div>`:''}</div>`}
function mainBody(){const grid=arr=>`<div class="grid">${arr.join('')}</div>`;const vis=a=>match(tr(a.name),a.name,tr(a.desc),a.desc);const none=()=>`<div class="empty">${tr('Không thấy “{0}”.',esc(UI.q.trim()))}<div style="margin-top:8px"><a href="#" data-testid="connect-apps-notfound-adv" onclick="openCA({pane:'adv'});return false">${tr('Không thấy? Thêm máy chủ MCP ở Nâng cao')}</a></div></div>`;
 if(UI.tab==='all'){let b='';for(const [g,l] of GROUPS){const its=STORE.filter(a=>a.group===g&&vis(a));if(its.length)b+=`<div class="grp" data-testid="connect-apps-group-${g}">${tr(l)}</div>`+grid(its.map(storeTile))}return b||none()}
 if(UI.tab==='mine'){const st0=['biz','excel'].filter(id=>conn(id)&&vis(ST(id))).map(id=>storeTile(ST(id)));
  const mk=Object.keys(servers()).filter(k=>match(displayName(k),k)).map(mineMcpTile);
  const all=[...st0,...mk];return all.length?grid(all):UI.q.trim()?none():`<div class="empty">${tr('Chưa kết nối ứng dụng nào.')}</div>`}
 const its=STORE.filter(a=>a.group===UI.tab);const shown=its.filter(vis);
 if(!its.length)return emptyGroup(UI.tab);
 return shown.length?`<div data-testid="connect-apps-group-${UI.tab}">${grid(shown.map(storeTile))}</div>`:none()}
function renderCA(){const n=countOn(),M=$('caModal');const sc=$('caList')?$('caList').scrollTop:0;const samePane=M.dataset.pane===UI.pane;M.dataset.pane=UI.pane;
 const head=`<div class="mh"><h2>${tr('Kết nối ứng dụng')}</h2><span class="badge ${n?'on':''}" data-testid="connect-apps-count" aria-live="polite">${n?tr('{0} đã kết nối',n):tr('Chưa kết nối')}</span><button class="x" onclick="closeCA()" aria-label="✕">✕</button></div>`;
 if(UI.pane==='main'){
  M.innerHTML=head+`<div class="mq"><div class="search">${ICONS.search}<input class="inp" id="caQ" data-testid="connect-apps-q" placeholder="${tr('Tìm ứng dụng…')}" value="${esc(UI.q)}"></div></div>
   <div class="tabs">${TABS.map(([id,l])=>`<button class="tab ${UI.tab===id?'on':''}" data-testid="connect-apps-tab-${id}" onclick="UI.tab='${id}';render()">${tr(l)}</button>`).join('')}</div>
   <div class="mlist scroll" id="caList">${mainBody()}</div>
   <div class="mf"><button class="btn sm" data-testid="connect-apps-advanced" onclick="openCA({pane:'adv'})">⚙ ${tr('Nâng cao')}</button></div>`;
  const q=$('caQ');q.oninput=e=>{UI.q=e.target.value;const p=e.target.selectionStart;renderCA();const n2=$('caQ');n2.focus();n2.setSelectionRange(p,p)}}
 else if(UI.pane==='detail'){M.innerHTML=head+`<div class="advhead"><button class="btn sm ghost" data-testid="connect-apps-detail-back" onclick="UI.pane='main';render()">${tr('← Quay lại')}</button></div><div class="mlist scroll" id="caList">${detailBody(UI.detail)}</div>`}
 else{M.innerHTML=head+`<div class="advhead"><button class="btn sm ghost" onclick="UI.pane='main';render()">${tr('← Quay lại')}</button><b>${tr('Nâng cao')}</b></div><div class="mlist scroll" id="caList">${advBody()}</div>
   <div class="mf"><div class="warnline" data-testid="connect-apps-mcp-warn">${MCP_WARN()}</div></div>`}
 const L2=$('caList');if(L2&&samePane&&!UI.flash)L2.scrollTop=sc;
 if(UI.flash)setTimeout(()=>{UI.flash=null},1700);
 const ri=UI.rename&&$('rn-in');if(ri&&document.activeElement!==ri){const p=UI.rename.pos??ri.value.length;ri.focus();try{ri.setSelectionRange(p,p)}catch(e){}}}
function advRow(c){const k=keyOfCat(c.id),s0=UI.setup[c.id]?'needs-setup':k?st(k):'available',ex=k&&UI.expanded[k],dis=!DB.master?`disabled title="${esc(MASTER_HINT())}"`:'';
 const btn=k?mcpBtn(k,c.id):s0==='needs-setup'?'':`<button class="btn sm pri" ${dis} data-testid="connect-apps-connect-${c.id}" onclick="event.stopPropagation();connectCatalog('${c.id}')">${tr('Kết nối')}</button>`;
 const setup=s0==='needs-setup'?`<div class="setup" onclick="event.stopPropagation()"><label class="small muted">${c.secretVar}</label><input class="inp" type="password" id="sec-${c.id}" autocomplete="off" placeholder="${c.optional?'Bearer …':tr('Dán khoá vào đây')}" oninput="UI.setup['${c.id}'].v=this.value">
   <button class="btn sm pri" onclick="connectCatalog('${c.id}')">${tr('Tiếp tục')}</button><button class="btn sm ghost" onclick="delete UI.setup['${c.id}'];render()">${tr('Huỷ')}</button>
   <div class="small muted" style="flex-basis:100%">${c.optional?tr('Tuỳ chọn: chữ “Bearer …”. Bỏ trống vẫn kết nối được, nhưng yêu cầu có thể bị từ chối.')+' ':''}${KEY_NOTE()}</div></div>`:'';
 const meta=k&&!c.url&&!runsBundled(c,servers()[k])?esc(redact(servers()[k])):c.url?esc(c.url):esc(pinned(c))+' · '+tr('đóng sẵn trong bản cài');
 return `<div class="srv ${k&&UI.flash===k?'flash':''}" id="adv-${c.id}" data-testid="connect-apps-card-${c.id}">
  <div class="top">${letterTile(catTile(c),30)}<span class="nm">${esc(tr(c.name))}</span>${pill(s0)}<span style="flex:1"></span>${btn}</div>
  <div class="d">${esc(tr(c.desc))}</div>${s0==='error'&&!ex&&!tfail(k)?`<div class="err">${esc(errText(k))}</div>`:''}${k?testLine(k):''}${alwaysRow(k)}
  ${c.deprecated?`<div class="dep">${tr('Gói này trên npm đã ngừng được hỗ trợ. AIVN ghim đúng bản cuối và không tự tải bản khác.')}</div>`:''}${setup}${techDetails(c.id,k,meta)}</div>`}
function advUserRow(k){const s=servers()[k],ex=UI.expanded[k],s0=st(k);
 return `<div class="srv ${UI.flash===k?'flash':''}" id="adv-${esc(k)}" data-testid="connect-apps-card-${esc(k)}">
  <div class="top">${letterTile(k,30)}${UI.rename&&UI.rename.k===k?nameOrEdit(k,'nm'):`${nameOrEdit(k,'nm')}${pill(s0)}<span style="flex:1"></span>${renameBtn(k)}${mcpBtn(k,k)}`}</div>${renameErr(k)}
  <div class="d">${tr('Máy chủ MCP trong mcp.json của bạn.')}</div>${s0==='error'&&!ex&&!tfail(k)?`<div class="err">${esc(errText(k))}</div>`:''}${testLine(k)}${alwaysRow(k)}${techDetails(k,k,esc(kindOf(s))+' · '+esc(redact(s)))}</div>`}
function advBody(){const user=Object.keys(servers()).filter(k=>!(DB.meta.servers[k]||{}).catalogId);
 return `${!DB.master?`<div class="apwarn" data-testid="connect-apps-master-off" style="margin:0 0 12px">${MASTER_HINT()}</div>`:''}
  <div class="grp">${tr('Máy chủ có sẵn')}</div>${ADV.map(advRow).join('')}<div class="small muted" style="margin:2px 4px 6px" data-testid="connect-apps-github-note">${tr('GitHub sẽ dùng máy chủ MCP chính thức từ xa (qua URL) trong một bản sau.')}</div>
  ${user.length?`<div class="grp">${tr('Máy chủ khác trong mcp.json')}</div>${user.map(advUserRow).join('')}`:''}
  <div class="grp" id="advImport">${tr('Nhập / xuất')}</div>
  <div class="row"><button class="btn sm" data-testid="connect-apps-import" onclick="$('fileIn').click()">📂 ${tr('Nhập mcp.json…')}</button><button class="btn sm ghost" onclick="UI.plan=makePlan(SAMPLE,SAMPLE_NAME);render();setTimeout(()=>$('advImport').scrollIntoView({block:'start'}),0)">${tr('(bản mẫu) Dùng tệp ví dụ')}</button><span style="flex:1"></span><button class="btn sm" onclick="exportJson()">${tr('Xuất mcp.json…')}</button></div>
  ${importPlan()}
  <div class="grp" id="advJson">mcp.json</div>
  <textarea class="inp code" id="advTxt" data-testid="connect-apps-json" spellcheck="false" oninput="UI.advText=this.value">${esc(UI.advText??JSON.stringify(DB.mcp,null,2))}</textarea>
  <div class="small muted" style="margin:6px 0">ℹ️ ${tr('Đổi lệnh, đối số, địa chỉ, đầu mục hoặc tên biến thì máy chủ mất duyệt và phải qua thẻ xin phép.')}</div>
  <div class="row"><button class="btn pri sm" onclick="saveAdv()">${tr('Lưu & kết nối lại')}</button><span id="advMsg">${UI.advMsg||''}</span></div>`}
const SAMPLE_NAME='mcp-tu-LM-Studio.json';
const SAMPLE=JSON.stringify({mcpServers:{
 'memory':{command:'npx',args:['-y',pinned(ADVC('memory'))]},
 'hf-mcp-server':{url:'HTTPS://HuggingFace.co/mcp/',headers:{Authorization:'Bearer hf_mauxxxxxxxxxxxx'},timeout:120000},
 'filesystem':{command:'npx',args:['-y','@modelcontextprotocol/server-filesystem','D:\\DuAn'],env:{NODE_ENV:'production'}},
 'brave-search':{command:'npx',args:['-y','@modelcontextprotocol/server-brave-search@0.6.2'],env:{BRAVE_API_KEY:'BSAmauxxxxxxxxxx'}},
 'nas-nha':{url:'http://192.168.1.20:8080/mcp'},
 'thoi-tiet':{url:'https://weather.example.org/mcp'},
 'may-ngoai':{url:'http://203.0.113.7/mcp'},
 'nas-ten':{url:'http://nas.local/mcp'},
 'thinking':{url:'https://example.org/thinking-mcp'},
 'sqlite':{command:'uvx',args:['mcp-server-sqlite','--db-path','D:\\DuAn\\data.db']},
 'tim-kiem':{command:'npx',args:['-y','@vidu/mcp-tim-kiem@2.1.0'],env:{SEARCH_API_KEY:''}},
 'bao-cao':{command:'npx',args:['-y','@vidu/mcp-bao-cao@1.0.0']},
 'lich-cong-ty':{url:'https://calendar.example.com/mcp',auth:{type:'oauth',CLIENT_SECRET:'abc123'}}}},null,2);
function makePlan(text,file){const r=parseFile(text);if(r.fatal)return{file,fatal:r.fatal};
 const plan={file,add:[],skip:[],conflict:[],rejected:[],oauthSkipped:[],secretCount:0};const seen={},taken=new Set();
 for(const [k0,s0] of Object.entries(r.servers)){const k=k0.trim(),s=JSON.parse(JSON.stringify(s0));
  const sn=safeName(k);const clash=Object.keys(servers()).concat(Object.keys(seen)).find(x=>x!==k&&safeName(x)===sn);
  if(clash){plan.rejected.push({name:k,error:tr('Tên "{0}" và "{1}" trùng nhau sau khi chuẩn hoá.',clash,k)});continue}seen[k]=1;
  const e=validateServer(k,s);if(e){plan.rejected.push({name:k,error:e});continue}
  if(s.auth){plan.oauthSkipped.push({name:k,server:s,error:tr('AIVN chưa hỗ trợ đăng nhập OAuth (trường auth) của máy chủ "{0}".',k)});continue}
  const cur=servers()[k];if(cur&&sig(cur)===sig(s)){plan.skip.push({name:k,error:tr('Đã có "{0}".',k)});continue}
  plan.secretCount+=secretNames(s).filter(x=>{const v=(s.env||{})[x]??(s.headers||{})[x];return !isRef(v)}).length;
  const slot=cur?null:importSlot(k,s,taken);if(slot)taken.add(slot);
  (cur?plan.conflict:plan.add).push({name:k,slot,kind:kindOf(s),cmd:redact(s),server:s,danger:isDanger(s),why:s.url&&netKind(s.url)==='lan'?'lan':unpinned(s)?'pin':!inCatalog(s)?'cat':null,old:cur?redact(cur):null})}
 return plan}
const WHY={lan:'Địa chỉ http này nằm trong mạng nội bộ của bạn.',pin:'Lệnh này không ghim phiên bản. npx có thể tải mã mới.',cat:'Lệnh không thuộc danh mục Nâng cao.',catUrl:'Địa chỉ không thuộc danh mục Nâng cao.'};
const whyOf=x=>tr(WHY[x.why==='cat'&&x.kind!=='stdio'?'catUrl':x.why]);
const secretLine=n=>SECRETS_SECURE?tr('Đã tách {0} khoá bí mật ra khỏi tệp. Chúng được mã hoá bằng kho khoá hệ điều hành và không ghi dạng chữ vào mcp.json.',n):KEY_NOTE();
function importPlan(){const p=UI.plan;if(!p)return'';const grp=(title,arr,f)=>arr.length?`<div class="small" style="margin:10px 0 4px;color:var(--tx3);font-weight:600">${title}</div><div class="pl">${arr.map(f).join('')}</div>`:'';
 if(p.fatal)return `<div class="msg-bad" style="margin-top:10px">${tr('Tệp: {0}',esc(p.file))} — ${esc(p.fatal)}</div>`;
 return `<div class="impbox" data-testid="connect-apps-import-plan"><div class="small muted">${tr('Tệp: {0}',esc(p.file))} · ${tr('Máy chủ khớp một mục Nâng cao còn trống sẽ vào mục đó. Các máy chủ khác vào Của tôi.')}</div>
  ${grp('✚ '+tr('Sẽ thêm ({0})',p.add.length),p.add,a=>`<div class="r">${letterTile(a.slot||a.name,22)}<b>${esc(a.name)}</b><span class="st">${a.kind}</span><code>${esc(a.cmd)}</code><span class="small dest">→ ${a.slot?tr('Nâng cao: {0}',tr(ADVC(a.slot).name)):tr('Của tôi')}</span>${a.danger?`<span class="danger-tag">⚠ ${esc(whyOf(a))}</span>`:''}</div>`)}
  ${grp('⇄ '+tr('Trùng tên, khác nội dung ({0})',p.conflict.length),p.conflict,a=>`<div class="r"><b>${esc(a.name)}</b><code>${esc(a.old)} → ${esc(a.cmd)}</code><button class="btn sm danger" onclick="replaceOne('${esc(a.name)}')">${tr('Thay thế')}</button></div>`)}
  ${grp('↷ '+tr('Bỏ qua ({0})',p.skip.length),p.skip,a=>`<div class="r"><span class="muted">${esc(a.error)}</span></div>`)}
  ${grp('🔒 '+tr('Chưa hỗ trợ OAuth ({0})',p.oauthSkipped.length),p.oauthSkipped,a=>`<div class="r"><b>${esc(a.name)}</b><span class="muted small">${esc(a.error)}</span></div>`)}
  ${grp('✕ '+tr('Không nhập được ({0})',p.rejected.length),p.rejected,a=>`<div class="r"><b>${esc(a.name)}</b><span class="msg-bad">${esc(a.error)}</span></div>`)}
  ${p.secretCount?`<div class="small" style="margin:6px 0">🔑 ${esc(secretLine(p.secretCount))}</div>`:''}
  <div class="row" style="margin-top:8px"><span style="flex:1"></span>${p.add.length?`<button class="btn pri sm" data-testid="connect-apps-import-apply" onclick="applyImport()">${tr('Nhập các mục mới')} (${p.add.length})</button>`:`<span class="muted small">${tr('Không có mục mới để nhập.')}</span>`}</div></div>`}
$('fileIn').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>262144){UI.plan={file:f.name,fatal:tr('Tệp mcp.json lớn hơn 256 KB.')};render();return}f.text().then(t=>{UI.plan=makePlan(t,f.name);render()});e.target.value=''};
async function applyImport(){const p=UI.plan;
 const a=await withCard(()=>({tool:'mcp_import',logoHtml:letterTile('M',30),title:tr('Nhập {0} máy chủ từ mcp.json?',p.add.length),sub:p.file,preview:p.add.map(x=>[x.name,x.kind+' · → '+(x.slot?tr('Nâng cao: {0}',tr(ADVC(x.slot).name)):tr('Của tôi'))+(x.danger?' · ⚠ '+whyOf(x):'')]),
  lines:[TEST_LINE(),...(p.secretCount?['🔑 '+secretLine(p.secretCount)]:[])],details:p.add.map(x=>[x.name,x.cmd,1]),warn:MCP_WARN(),danger:p.add.some(x=>x.danger),alwaysLabel:null}));
 if(!a.ok)return;
 for(const x of p.add){const s=JSON.parse(JSON.stringify(x.server));extractSecrets(x.name,s);servers()[x.name]=s;DB.meta.servers[x.name]={catalogId:x.slot||null,approvedAt:now(),alwaysOn:false}}
 for(const x of p.oauthSkipped){const s=JSON.parse(JSON.stringify(x.server));extractSecrets(x.name,s);servers()[x.name]=s;DB.meta.servers[x.name]={catalogId:null,approvedAt:null,alwaysOn:false};RT.state[x.name]='error';const nm=x.name;RT.err[nm]=()=>tr('AIVN chưa hỗ trợ đăng nhập OAuth (trường auth) của máy chủ "{0}".',nm)}
 const names=p.add.map(x=>x.name);save();UI.plan=null;UI.pane='main';UI.tab='mine';UI.q='';render();runTests(names)}
async function replaceOne(name){const x=UI.plan.conflict.find(c=>c.name===name);
 const a=await withCard(()=>({tool:'mcp_replace',logoHtml:letterTile(name,30),title:tr('Thay thế máy chủ “{0}”?',name),sub:name,details:[[tr('Lệnh cũ'),x.old,1],[tr('Lệnh mới'),x.cmd,1]],warn:tr('Tiến trình cũ sẽ bị dừng.'),danger:true,alwaysLabel:null}));
 if(!a.ok)return;stop(name);const s=JSON.parse(JSON.stringify(x.server));extractSecrets(name,s);servers()[name]=s;const m=metaOf(name);m.approvedAt=now();m.alwaysOn=false;save();
 UI.plan.conflict=UI.plan.conflict.filter(c=>c.name!==name);UI.plan.skip.push({name,error:tr('Đã có "{0}".',name)});delete m.test;render();runTest(name)}
function saveAdv(){const text=$('advTxt').value;const r=parseFile(text);
 const fail=m=>{UI.advMsg=`<span class="msg-bad">${esc(tr('Không lưu: {0}',m))}</span>`;UI.advText=text;render()};
 if(r.fatal)return fail(r.fatal);const keys=Object.keys(r.servers);
 for(const k of keys){const e=validateServer(k,r.servers[k]);if(e)return fail(e)}
 for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++)if(safeName(keys[i])===safeName(keys[j]))return fail(tr('Tên "{0}" và "{1}" trùng nhau sau khi chuẩn hoá.',keys[i],keys[j]));
 const old=servers();let lost=0;
 for(const k of Object.keys(old))if(!r.servers[k]){stop(k);delete DB.meta.servers[k];delete RT.state[k]}
 const restart=[];
 for(const k of keys){const s=r.servers[k];extractSecrets(k,s);const m=metaOf(k);
  if(!old[k]||sig(old[k])!==sig(s)){if(old[k])stop(k);lost++;m.approvedAt=null;m.alwaysOn=false;delete m.test;RT.state[k]='off'}
  else if(m.approvedAt&&!s.disabled)restart.push([k,RT.state[k]==='on'||m.alwaysOn])}
 DB.mcp={...JSON.parse(text),mcpServers:r.servers};save();
 UI.advText=null;UI.advMsg=`<span class="msg-ok">${lost?tr('Đã lưu. {0} máy chủ cần cho phép lại trước khi chạy.',lost):tr('Đã lưu.')}</span>`;render();restart.forEach(([k,run])=>{if(run)start(k);else{RT.state[k]=DB.master?'waiting':'off';render()}})}
async function exportJson(){const ok=await modalAsk(tr('Xuất mcp.json…'),tr('Tệp xuất không có khoá bí mật. Máy khác phải nhập lại khoá.'),tr('Xuất'));if(!ok)return;
 const out={mcpServers:{}};for(const [k,s0] of Object.entries(servers())){if(s0.disabled)continue;const s=JSON.parse(JSON.stringify(s0));delete s.disabled;
  for(const f of ['env','headers'])if(s[f]){for(const [n,v] of Object.entries(s[f]))if(isRef(v))delete s[f][n];if(!Object.keys(s[f]).length)delete s[f]}out.mcpServers[k]=s}
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{type:'application/json'}));a.download='mcp.json';a.click()}
function modalAsk(title,body,okLabel){return new Promise(res=>{$('askModal').innerHTML=`<div class="mh"><h2>${esc(title)}</h2></div><div style="padding:0 18px 6px;color:var(--tx2)">${esc(body)}</div>
  <div class="row" style="padding:14px 18px;justify-content:flex-end"><button class="btn" id="askNo">${tr('Huỷ')}</button><button class="btn pri" id="askYes">${esc(okLabel)}</button></div>`;
 $('askBack').classList.add('open');const done=v=>{$('askBack').classList.remove('open');res(v)};$('askNo').onclick=()=>done(false);$('askYes').onclick=()=>done(true)})}
function pickFolder(F){return new Promise(res=>{let sel=0;
 const draw=()=>{$('osDlg').innerHTML=`<div class="t">📁 ${tr('Chọn thư mục')}<span style="flex:1"></span><span style="color:#6b7280;font-size:11px">${tr('Mô phỏng hộp thoại chọn thư mục của hệ điều hành')}</span></div><div style="padding:6px 0">${F.map((f,i)=>`<div class="f ${i===sel?'on':''}" data-i="${i}">📁 ${f}</div>`).join('')}</div>
  <div class="b"><button id="osNo">${tr('Huỷ')}</button><button class="p" id="osYes">${tr('Chọn')}</button></div>`;
  $('osDlg').querySelectorAll('.f').forEach(e=>e.onclick=()=>{sel=+e.dataset.i;draw()});$('osNo').onclick=()=>done(null);$('osYes').onclick=()=>done(F[sel])};
 const done=v=>{$('osBack').classList.remove('open');res(v)};draw();$('osBack').classList.add('open')})}
const allTpls=()=>BUILTIN.map(t=>({...t,builtin:true})).concat(DB.userTpls);
const curTpl=()=>allTpls().find(t=>t.id===DB.tpl)||{...BUILTIN[0],builtin:true};
const trIn=(lg,k,...a)=>{const o=LANG;LANG=lg;const r=tr(k,...a);LANG=o;return r};
let tplEdit=null;
function renderTpl(){const M=$('tplModal');
 if(tplEdit){M.innerHTML=`<div class="mh"><h2>${tr('Tạo mẫu của tôi')}</h2><button class="x" onclick="tplEdit=null;renderTpl()">✕</button></div><div style="padding:0 18px 14px;overflow:auto">
  <label class="f">${tr('Tên mẫu')}</label><input class="inp" id="te_n" maxlength="40" value="${esc(L(tplEdit.name))}">
  <label class="f" style="margin-top:10px">${tr('Đoạn vai trò')}</label><textarea class="inp" id="te_a" rows="5" maxlength="4000">${esc(L(tplEdit.addendum))}</textarea>
  <label class="f" style="margin-top:10px">${tr('Câu gợi ý (mỗi dòng một câu, tối đa 6)')}</label><textarea class="inp" id="te_s" rows="3">${esc((tplEdit.starters||[]).map(L).join('\n'))}</textarea>
  <div class="small muted" style="margin-top:6px">${tr('Tên tối đa 40 ký tự, đoạn vai trò tối đa 4.000 ký tự.')} ${tr('Mẫu của bạn giữ nguyên ngôn ngữ bạn viết, không dịch máy.')}</div>
  <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" onclick="tplEdit=null;renderTpl()">${tr('Huỷ')}</button><button class="btn pri" onclick="saveTpl()">${tr('Lưu')}</button></div></div>`;return}
 const row=t=>{const cur=t.id===DB.tpl;const sug=(t.suggest||[]).map(id=>tr(ST(id).name));
  return `<div class="tpl ${cur?'cur':''}"><div class="row"><span style="font-size:20px">${t.icon||'⭐'}</span><b>${esc(L(t.name))}</b>${cur?`<span class="st on">${tr('Đang dùng')}</span>`:''}<span style="flex:1"></span>
   ${cur?'':`<button class="btn sm pri" data-testid="agent-tpl-apply-${t.id}" onclick="applyTpl('${t.id}')">${tr('Dùng mẫu này')}</button>`}</div>
   <div class="small" style="color:var(--tx2);margin:4px 0 0 30px">${esc(L(t.description))}</div>
   ${sug.length?`<div class="small row" style="margin:5px 0 0 30px;color:var(--tx3);gap:5px">${(t.suggest||[]).map(id=>storeLogo(ST(id),16)).join('')} ${tr('Mẫu này dùng được với: {0}',sug.join(', '))}</div>`:''}
   <div class="row" style="margin:6px 0 0 30px;gap:6px">${t.builtin?(t.id!=='general'?`<button class="btn sm ghost" onclick="copyTpl('${t.id}')">${tr('Lưu thành mẫu của tôi')}</button>`:''):`<button class="btn sm ghost" onclick="renameTpl('${t.id}')">${tr('Đổi tên')}</button><button class="btn sm ghost" onclick="tplEdit=JSON.parse(JSON.stringify(DB.userTpls.find(x=>x.id==='${t.id}')));renderTpl()">${tr('Sửa')}</button><button class="btn sm ghost danger" onclick="delTpl('${t.id}')">${tr('Xoá')}</button>`}</div></div>`};
 M.innerHTML=`<div class="mh"><h2>${tr('Mẫu AIVN AGENT')}</h2><button class="x" onclick="$('tplBack').classList.remove('open')">✕</button></div>
  <div style="padding:0 18px 4px" class="small muted">${tr('Mẫu chỉ thêm một đoạn vai trò vào lời nhắc. Mẫu không bật công tắc và không tự kết nối ứng dụng. Khác với cấu hình mẫu của Trò chuyện.')}</div>
  <div style="padding:2px 18px 4px" class="small">👤 ${tr('Một mẫu cho cả hồ sơ: đổi mẫu là đổi cho mọi cuộc trò chuyện, từ lượt sau.')}</div>
  <div style="overflow:auto;padding:8px 18px 4px"><div class="grp">${tr('Mẫu gắn sẵn')}</div>${allTpls().filter(t=>t.builtin).map(row).join('')}
  ${DB.userTpls.length?`<div class="grp">${tr('Mẫu của tôi')}</div>${DB.userTpls.map(t=>row({...t,builtin:false})).join('')}`:''}</div>
  <div class="row" style="padding:12px 18px;border-top:1px solid var(--line)"><button class="btn sm" onclick="tplEdit={id:null,name:{},addendum:{},starters:[]};renderTpl()">＋ ${tr('Tạo mẫu của tôi')}</button></div>`}
function openTpl(){tplEdit=null;renderTpl();$('tplBack').classList.add('open')}
function applyTpl(id){DB.tpl=id;DB.hintDismissed=false;save();$('tplBack').classList.remove('open');render()}
const uid=()=>'user-'+Math.random().toString(36).slice(2,10).padEnd(8,'0');
function copyTpl(id){const b=BUILTIN.find(x=>x.id===id);if(DB.userTpls.length>=30)return;const name={};for(const lg of ['vi','en','zh'])name[lg]=trIn(lg,'Bản sao của {0}',b.name[lg]).slice(0,40);
 DB.userTpls.push({id:uid(),icon:b.icon,name,description:{...b.description},addendum:{},starters:JSON.parse(JSON.stringify(b.starters)),suggest:b.suggest.slice()});save();renderTpl()}
function saveTpl(){const n=$('te_n').value.trim().slice(0,40);if(!n)return $('te_n').focus();const a=$('te_a').value.slice(0,4000),sts=$('te_s').value.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,6).map(x=>x.slice(0,200));
 if(tplEdit.id){const t=DB.userTpls.find(x=>x.id===tplEdit.id);t.name={...t.name,[LANG]:n};t.addendum={...(t.addendum||{}),[LANG]:a};t.starters=sts.map(x=>({[LANG]:x}))}
 else{if(DB.userTpls.length>=30)return;DB.userTpls.push({id:uid(),icon:'⭐',name:{[LANG]:n},description:{[LANG]:a.slice(0,160)},addendum:{[LANG]:a},starters:sts.map(x=>({[LANG]:x})),suggest:[]})}
 tplEdit=null;save();renderTpl();render()}
function renameTpl(id){const t=DB.userTpls.find(x=>x.id===id);const n=prompt(tr('Đổi tên'),L(t.name));if(n&&n.trim()){t.name={...t.name,[LANG]:n.trim().slice(0,40)};save();renderTpl();render()}}
function delTpl(id){DB.userTpls=DB.userTpls.filter(x=>x.id!==id);if(DB.tpl===id)DB.tpl='general';save();renderTpl();render()}
const fmtN=n=>new Intl.NumberFormat(LANG==='vi'?'vi-VN':LANG==='zh'?'zh-CN':'en-US').format(n);
function renderWarn(){const c=toolCheck(),el=$('toolWarn');
 if(!(c.block||(c.warn&&DB.warnSig!==c.sig))){el.innerHTML='';return}
 el.innerHTML=`<div class="toolwarn ${c.block?'block':''}" data-testid="connect-apps-tool-warn"><div class="row" style="align-items:flex-start;gap:8px"><span>⚠</span><div style="flex:1">
  <b>${c.block?tr('Bạn đang bật quá nhiều ứng dụng cho mô hình này. AIVN AGENT chưa trả lời được cho đến khi bạn tắt bớt.'):tr('Bạn đang bật nhiều ứng dụng, agent có thể chậm hơn. Nên tắt bớt cái không dùng.')}</b>
  <div class="twl">${c.list.map(x=>`<span class="twi">${srcLogo(x.k,16)} ${esc(displayName(x.k))} <button class="btn sm" data-testid="tool-warn-off-${esc(x.k)}" onclick="disconnectKey('${esc(x.k)}')">${tr('Tắt')}</button></span>`).join('')}</div>
  <details class="apdet twdet" data-testid="tool-warn-details" ${UI.warnOpen?'open':''} ontoggle="if(this.isConnected)UI.warnOpen=this.open"><summary onclick="UI.warnOpen=!this.parentNode.open">${tr('Chi tiết')}</summary>
   <div class="small">${tr('Mô hình {0} đang thấy {1} công cụ, nhiều hơn mức hợp với ngữ cảnh {2}. AIVN không tự bỏ công cụ.',esc(c.M.name),c.total,fmtN(c.M.ctx))}</div>
   ${c.block?`<div class="small">${tr('Mô tả công cụ khoảng {0} token, vượt ngân sách {1} token. Lượt sau chưa bắt đầu cho đến khi bạn tắt bớt.',fmtN(c.tok),fmtN(c.budget))}</div>`:''}
   <div class="twl"><span class="twi">${tr('Công cụ của AIVN AGENT')} · ${NATIVE_TOOLS}</span>${c.list.map(x=>`<span class="twi">${srcLogo(x.k,16)} ${esc(displayName(x.k))} · ${x.n}</span>`).join('')}</div></details>
  <a href="#" class="small" onclick="openCA({pane:'main'});return false">${tr('Mở Kết nối ứng dụng')}</a></div>
  ${c.block?'':`<button class="btn sm ghost" onclick="DB.warnSig='${esc(c.sig)}';save();renderPage()">${tr('Đã hiểu')}</button>`}</div></div>`}
function renderPage(){const n=countOn(),t=curTpl();
 document.documentElement.lang=LANG==='zh'?'zh-CN':LANG;
 $('o_draft').textContent='⚠ '+tr('Bản nháp 4.5 theo F-PLUGINS bản 2 + quyết định ngày 22/10 (lượt 3)')+' · '+tr('Dữ liệu mẫu · lưu trong trình duyệt');$('o_draft').title=$('o_draft').textContent;
 $('o_v41').textContent=tr('Bản 4.1');$('o_v44').textContent=tr('Bản 4.4');$('o_v43').textContent=tr('Bản 4.3');$('o_v42').textContent=tr('Bản 4.2');$('o_restart').textContent='↻ '+tr('Mô phỏng mở lại AIVN');$('o_reset').textContent=tr('↺ Đặt lại');$('o_set').textContent='⚙ '+tr('Cài đặt (mô phỏng)');
 $('setPop').innerHTML=`<div class="small" style="font-weight:600;margin-bottom:6px">${tr('Cài đặt')} · ${tr('Giao diện')}</div><label class="small muted" for="uiLangSel">${tr('Ngôn ngữ giao diện')}</label>
  <select id="uiLangSel" class="inp" style="margin-top:4px"><option value="vi" ${LANG==='vi'?'selected':''}>Tiếng Việt</option><option value="en" ${LANG==='en'?'selected':''}>English</option><option value="zh" ${LANG==='zh'?'selected':''}>中文</option></select>
  <div class="small muted" style="margin-top:6px">${tr('Chỗ này đóng vai mục Cài đặt của ứng dụng. Hộp thoại Kết nối ứng dụng không có nút đổi ngôn ngữ.')}</div>`;
 $('uiLangSel').onchange=e=>setLang(e.target.value);
 $('o_model').textContent=tr('Mô hình:');
 $('modelSel').innerHTML=AG_MODELS.map(m=>`<option value="${m.id}" ${m.id===DB.model?'selected':''}>${m.name} · ${tr('ngữ cảnh {0}',fmtN(m.ctx))}</option>`).join('');
 $('caBtn').innerHTML=`🔌 ${tr('Kết nối ứng dụng')}${n?`<span class="cnt-badge">${tr('{0} đã kết nối',n)}</span>`:''}`;
 $('tplBtn').textContent=`${t.icon||'⭐'} ${tr('Mẫu: {0}',L(t.name))}`;
 renderWarn();
 const miss=(t.suggest||[]).filter(id=>!conn(id)?.enabled);
 $('tplHint').innerHTML=miss.length&&!DB.hintDismissed?`<div class="tplhint">💡 ${tr('Mẫu này dùng được với: {0}',miss.map(id=>tr(ST(id).name)).join(', '))}${miss.map(id=>`<button class="btn sm pri" onclick="connectStore('${id}')">${tr('Kết nối')}</button>`).join('')}<span style="flex:1"></span><button class="x" style="font-size:15px" onclick="DB.hintDismissed=true;save();renderPage()">✕</button></div>`:'';
 $('msgs').innerHTML=`<div class="greet"><div class="b"><div class="av">AI</div><div>${tr('Xin chào! Mình là AIVN AGENT. Mình làm việc trên máy bạn và luôn hỏi trước khi làm việc quan trọng.')}</div></div>
  <div id="chips">${(t.starters||[]).map(s=>`<button class="chipq" onclick="$('inp').value=this.textContent;$('inp').focus()">${esc(L(s))}</button>`).join('')}</div>
  ${onSources().length?`<div class="simuse" data-testid="sim-agent-use"><div class="small muted">${tr('(bản mẫu) Cho AIVN AGENT thử dùng ứng dụng:')}</div>${['biz','excel'].filter(id=>conn(id)?.enabled).map(id=>storeActs(id).map(([tl,l,d])=>`<button class="chipq" data-testid="sim-use-${tl}" onclick="agentUse('${id}','${tl}')">${storeLogo(ST(id),14)} ${esc(tr(d))}</button>`).join('')).join('')}${onSources().filter(k=>k[0]!=='@').map(k=>`<button class="chipq" data-testid="sim-use-mcp-${esc(k)}" onclick="agentUseMcp('${esc(k)}')">${letterTile(tileKey(k),14)} ${esc(tr('Dùng “{0}”',displayName(k)))}</button>`).join('')}</div>`:!DB.master&&connectedKeys().length?`<div class="simuse small muted" data-testid="sim-master-off">${MASTER_HINT()}</div>`:''}
  ${RT.chat.map(m=>`<div class="simline">${esc(m)}</div>`).join('')}</div>`;
 $('inp').placeholder=tr('Nhắn cho AIVN AGENT…');$('sendBtn').textContent=tr('Gửi');
 const bk=[...['biz','excel'].filter(id=>conn(id)?.enabled).map(SKEY),...Object.keys(servers()).filter(k=>['on','waiting','starting','testing','error'].includes(RT.state[k]))];
 $('mcpBadges').innerHTML=bk.map(k=>`<span class="mb" onclick="openCA({scrollTo:'${esc(k)}'})">${srcLogo(k,16)}${esc(displayName(k))}<span class="d" style="background:${st(k)==='error'?'var(--bad)':st(k)==='waiting'||st(k)==='starting'||st(k)==='testing'?'var(--warn)':'var(--ok)'}" title="${esc(tr(PILL[st(k)]||''))}"></span></span>`).join('');
 $('agentSettings').innerHTML=`<div class="small muted" style="margin:0 2px 10px;font-weight:600">${tr('Cài đặt AIVN AGENT')}</div>
  <div class="sec"><h4>🔌 ${tr('Kết nối ứng dụng')}</h4><div class="srow"><span class="badge ${n?'on':''}">${n?tr('{0} đã kết nối',n):tr('Chưa kết nối')}</span></div>
   <button class="btn sm pri" style="width:100%;justify-content:center" data-testid="connect-apps-settings" onclick="openCA({pane:'main'})">${tr('Kết nối ứng dụng')}</button>
   <div style="margin-top:8px"><a href="#" class="small" data-testid="connect-apps-settings-advanced" onclick="openCA({pane:'adv'});return false">${tr('Nâng cao')}</a></div>
   <div class="srow" style="margin-top:10px;align-items:flex-start"><div class="sw ${DB.master?'on':''}" id="mcpMaster" role="switch" tabindex="0" aria-checked="${DB.master}" onclick="toggleMaster()"></div><span>${tr('Cho AIVN AGENT dùng các ứng dụng đã kết nối')}</span></div></div>
  <div class="sec" data-testid="agent-folder-sec"><h4>📁 ${tr('Thư mục được phép')}</h4><div class="small muted" style="margin-bottom:4px">${tr('Thư mục AIVN AGENT được đọc và ghi. Excel có thư mục riêng.')}</div><div class="small" style="font-family:monospace;color:var(--tx2)" data-testid="agent-folder" title="${esc(agentFolder())}">${esc(agentFolder())}</div>
   <div class="row" style="margin-top:6px;gap:6px"><button class="btn sm" data-testid="agent-folder-change" onclick="changeAgentFolder()">${tr('Đổi thư mục')}</button><button class="btn sm ghost">＋ ${tr('Thêm thư mục')}</button></div></div>
  <div class="sec"><div class="srow"><div class="sw"></div>${tr('Cho phép truy cập mạng')}</div><div class="srow"><div class="sw"></div>${tr('Tự làm không hỏi')}</div><div class="small muted">${tr('Không áp dụng cho các ứng dụng đã kết nối.')}</div></div>
  <div class="sec"><h4>✅ ${tr('Luôn cho phép')}</h4><div class="small muted">${tr('Chưa có mục nào.')}</div></div>`}
function setLang(l){LANG=DB.lang=l;save();render();if($('tplBack').classList.contains('open'))renderTpl();if(apCur)drawCard()}
function toggleMaster(){DB.master=!DB.master;save();if(!DB.master){Object.keys(servers()).forEach(stop);render()}else{render();startAll(true)}}
function startAll(onlyMcp){ // quyết định 22/10 lượt 2 (c): mọi kết nối chỉ chạy khi dùng lần đầu; máy chủ có “Luôn chạy sẵn” thì chạy ngay
 Object.keys(servers()).forEach(k=>{const m=metaOf(k),s=servers()[k];if(s.auth){RT.state[k]='error';RT.err[k]=()=>tr('AIVN chưa hỗ trợ đăng nhập OAuth (trường auth) của máy chủ "{0}".',k);return}
  if(!m.approvedAt||s.disabled){RT.state[k]='off';return}if(!DB.master){RT.state[k]='off';return}if(m.test&&m.test.ok===false){RT.state[k]='error';RT.err[k]=()=>testMsg(m.test);return}if(m.alwaysOn)start(k);else{RT.state[k]='waiting';log(k,'lazy: waiting for first use')}});save();render()}
function render(){renderPage();if(UI.open)renderCA()}
$('modelSel').onchange=e=>{DB.model=e.target.value;save();renderPage()};
$('sendBtn').onclick=()=>{if(toolCheck().block){toast(tr('Chưa gửi được: hãy tắt bớt ứng dụng trước.'));return}toast(tr('(bản mẫu) Tin nhắn không được gửi thật.'))};
$('o_set').onclick=e=>{e.stopPropagation();$('setPop').classList.toggle('open')};document.addEventListener('click',e=>{if(!e.target.closest('#setPop')&&e.target.id!=='o_set')$('setPop').classList.remove('open')});
const CMDS=[['🔌','Kết nối ứng dụng',()=>openCA({pane:'main'})],['⭐','Mẫu AIVN AGENT',()=>openTpl()],['💬','Trò chuyện mới',()=>{}],['🔍','Khám phá mô hình',()=>location.href='models.html'],['💼','Kinh doanh',()=>location.href='products.html']];
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
$('caBtn').onclick=()=>openCA({pane:'main'});$('tplBtn').onclick=openTpl;
$('o_reset').onclick=()=>{localStorage.removeItem(KEY);location.reload()};
$('o_restart').onclick=restartSim;
RT.restarted=!!(DB.meta.connectors.biz||DB.meta.connectors.excel||Object.values(DB.meta.servers).some(m=>m.approvedAt));render();setTimeout(()=>startAll(false),window.FAST?0:400);
