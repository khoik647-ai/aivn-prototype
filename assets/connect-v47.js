// Bản mẫu Kết nối ứng dụng v4.7 — F-PLUGINS bản 2 (PR #5) + quyết định ngày 22/10 (lượt 5: bố cục hai cột, danh sách gọn + bảng chi tiết). Mô phỏng hoàn toàn trong trình duyệt.
renderRail('agent');
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FOLDERS=['C:\\Users\\Khoi\\Documents\\AIVN','C:\\Users\\Khoi\\Documents\\Ke toan 2026','D:\\DuAn\\Bang tinh']; // mẫu cho bộ chọn thư mục
const agentFolder=()=>DB.agentFolder||FOLDERS[0]; // thư mục được phép của AIVN AGENT (agentFolders), chỉnh ở Cài đặt AIVN AGENT
const excelFolder=()=>(conn('excel')&&conn('excel').folder)||agentFolder(); // Excel có thư mục riêng; lần kết nối đầu mặc định = thư mục của AIVN AGENT
const baseName=p=>String(p).split(/[\\\/]/).filter(Boolean).pop();
const SECRETS_SECURE=true; // v4.6: bản mẫu đóng vai máy CÓ kho khoá của hệ điều hành (v4.5 đóng vai máy không có)
const AG_MODELS=[{id:'q4',name:'Qwen3-VL 4B',params:4,ctx:8192},{id:'q14',name:'Qwen3 14B',params:14,ctx:32768},{id:'gguf',name:'mo-hinh-tu-tai.gguf',params:null,ctx:4096}];
const NATIVE_TOOLS=8,TOK_PER_TOOL=40; // giả định của bản mẫu
const GROUPS=[['productivity','Năng suất'],['communication','Giao tiếp'],['sales','Bán hàng'],['finance','Tài chính']];
// v4.7: “Của tôi” và “Nâng cao” là bộ lọc trên cùng thanh, không còn là màn hình riêng
const FILTERS=[['all','Tất cả'],...GROUPS,['mine','Của tôi'],['adv','Nâng cao']];
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
 {id:'filesystem',name:'Thư mục',logo:'folder',desc:'Đọc và ghi một thư mục bạn chọn. Khác với “Thư mục được phép” của công cụ tệp AIVN.',short:'Đọc và ghi một thư mục bạn chọn.',long:'Cho AIVN AGENT đọc và ghi trong một thư mục bạn chọn. Khác với “Thư mục được phép” trong Cài đặt AIVN AGENT.',needs:'folder',pkg:'@modelcontextprotocol/server-filesystem',ver:'2.0.0',
  tools:[['read_text_file','Read the complete contents of a file as text'],['write_file','Create a new file or completely overwrite an existing file'],['list_directory','Get a detailed listing of all files and directories'],['search_files','Recursively search for files and directories matching a pattern']]},
 {id:'fetch',name:'Đọc trang web',logo:'fetch',desc:'Tiến trình này tự mở mạng, kể cả khi “Cho phép truy cập mạng” đang tắt.',short:'Đọc nội dung trang web.',long:'Cho AIVN AGENT đọc nội dung trang web. Ứng dụng này tự vào mạng, kể cả khi “Cho phép truy cập mạng” đang tắt.',needs:'none',pkg:'mcp-fetch-server',ver:'1.1.2',tools:[['fetch_html','Fetch a website and return the content as HTML'],['fetch_markdown','Fetch a website and return the content as Markdown']]},
 {id:'huggingface',name:'Hugging Face',logo:'huggingface',desc:'Máy chủ từ xa của Hugging Face. Đối số công cụ và kết quả được gửi tới huggingface.co.',short:'Tìm mô hình, bộ dữ liệu và bài báo.',long:'Tìm mô hình, bộ dữ liệu và bài báo trên Hugging Face. Những gì bạn tìm và kết quả được gửi tới huggingface.co.',needs:'secret',optional:true,secretVar:'Authorization',url:'https://huggingface.co/mcp',
  tools:[['model_search','Search for ML models on the Hugging Face Hub'],['dataset_search','Search for datasets on the Hugging Face Hub'],['paper_search','Find ML research papers'],['hf_doc_search','Search the Hugging Face documentation']]},
 {id:'memory',name:'Sổ tay agent',icon:'notebook',desc:'Sổ tay riêng của AIVN AGENT, nằm trong ứng dụng này. Không phải tính năng Ghi nhớ của AIVN và không ghi vào đó.',short:'Sổ tay riêng của AIVN AGENT.',needs:'none',pkg:'@modelcontextprotocol/server-memory',ver:'2.0.0',
  tools:[['create_entities','Create multiple new entities in the knowledge graph'],['create_relations','Create multiple new relations between entities'],['add_observations','Add new observations to existing entities'],['delete_entities','Delete multiple entities and their associated relations'],['delete_observations','Delete specific observations from entities'],['delete_relations','Delete multiple relations from the knowledge graph'],['read_graph','Read the entire knowledge graph'],['search_nodes','Search for nodes in the knowledge graph'],['open_nodes','Open specific nodes by their names']]},
 {id:'github',name:'GitHub',logo:'github',desc:'Kho mã, issue và pull request trên GitHub.',short:'Kho mã, issue và pull request.',long:'Cho AIVN AGENT xem và làm việc với kho mã, issue và pull request trên GitHub. Cần khoá truy cập cá nhân của GitHub.',
  needs:'secret',secretVar:'GITHUB_PERSONAL_ACCESS_TOKEN',image:'ghcr.io/github/github-mcp-server',
  runNote:'Chạy bằng Docker trên máy này (bản chính thức của GitHub). Một bản sau có thể chuyển sang máy chủ từ xa chính thức của GitHub (qua URL), khi đó không cần Docker.',
  tools:[['get_me','Get details of the authenticated GitHub user'],['list_issues','List issues in a GitHub repository'],['create_issue','Create a new issue in a GitHub repository'],['get_file_contents','Get the contents of a file or directory'],['create_pull_request','Create a new pull request']]},
 {id:'thinking',name:'Suy nghĩ từng bước',logo:'thinking',desc:'Máy chủ giữ các bước suy nghĩ trung gian.',short:'Giữ các bước suy nghĩ trung gian.',long:'Giúp AIVN AGENT ghi lại các bước suy nghĩ trung gian khi làm việc khó.',needs:'none',pkg:'@modelcontextprotocol/server-sequential-thinking',ver:'2.0.0',tools:[['sequentialthinking','A detailed tool for dynamic and reflective problem-solving through thoughts']]},
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
const KEY='aivn.plugins.v47';
// quyết định lượt 4 (c): khoá lưu riêng, đóng vai kho khoá của hệ điều hành (Windows Credential Manager). mcp.json chỉ giữ chỗ ${secret:…}.
const VAULT='aivn.secrets.v47';let SEC=LS.get(VAULT,{});const saveSec=()=>LS.set(VAULT,SEC);
function seed(){const t='2026-10-01T09:00:00.000Z';return{
  mcp:{mcpServers:{'memory':{command:'npx',args:['-y',pinned(ADVC('memory'))]},'thoi-tiet':{url:'https://mcp.example.vn/weather'}}},
  meta:{v:1,connectors:{},servers:{'memory':{catalogId:'memory',approvedAt:t,alwaysOn:false},'thoi-tiet':{catalogId:null,approvedAt:t,alwaysOn:false}}},
  model:'q4',warnSig:null,master:true,lang:'vi',tpl:'general',userTpls:[],hintDismissed:false}}
let DB=LS.get(KEY,null)||seed();const save=()=>LS.set(KEY,DB);
LANG=DB.lang;
const RT={inst:{},state:{},err:{},logs:{},listed:{},used:{},writeOk:{},testT:{},chat:[],restarted:false};
let UI={sel:null,key:null,keyHl:null,keySaved:null,rename:null,warnOpen:false,excelPick:null,open:false,pane:'main',tab:'all',q:'',expanded:{},setup:{},plan:null,advMsg:null,advText:null,flash:null};
const servers=()=>DB.mcp.mcpServers;
const conn=id=>DB.meta.connectors[id];
const metaOf=k=>DB.meta.servers[k]||(DB.meta.servers[k]={catalogId:null,approvedAt:null,alwaysOn:false});
const keyOfCat=cid=>Object.keys(servers()).find(k=>(DB.meta.servers[k]||{}).catalogId===cid);
const safeName=k=>foldVi(k).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,24);
const now=()=>new Date().toISOString();
const log=(k,m)=>{(RT.logs[k]=RT.logs[k]||[]).push(new Date().toTimeString().slice(0,8)+'  '+redactText(m));RT.logs[k]=RT.logs[k].slice(-60)};
const SKEY=id=>'@'+id;
function hostOf(u){const m=/^[a-z]+:\/\/(\[[^\]]+\]|[^\/:?#]+)/i.exec(u);return m?m[1].toLowerCase():''}
function netKind(u){const h=hostOf(u);if(h==='localhost'||h==='[::1]'||/^127\.\d+\.\d+\.\d+$/.test(h))return'loop';
 const p=h.split('.').map(Number);if(p.length===4&&p.every(n=>Number.isInteger(n)&&n>=0&&n<=255)&&(p[0]===10||(p[0]===172&&p[1]>=16&&p[1]<=31)||(p[0]===192&&p[1]===168)))return'lan';return'public'}
const isHttp=u=>/^http:\/\//i.test(u||'');
// mục 17.5 (designer): chuẩn hoá URL trước khi so — bỏ '/' ở cuối, scheme + host không phân biệt hoa thường, đường dẫn giữ nguyên hoa thường
function normUrl(u){const m=/^([a-z][a-z0-9+.-]*:\/\/[^\/?#]*)(.*)$/i.exec(String(u||'').trim());if(!m)return String(u||'');return m[1].toLowerCase()+m[2].replace(/\/+$/,'')}
const urlEq=(a,b)=>!!a&&!!b&&normUrl(a)===normUrl(b);
const SECRET_NAME=/TOKEN|KEY|SECRET|PASSWORD|PASSWD|CREDENTIAL|AUTH/i,SECRET_VAL=/^(sk-|ghp_|github_pat_|hf_|Bearer )/;
const isRef=v=>typeof v==='string'&&/^\$\{secret:[^}]+\}$/.test(v);
const isSecret=(n,v)=>typeof v==='string'&&v!==''&&!isRef(v)&&(SECRET_NAME.test(n)||/^(proxy-)?authorization$/i.test(n)||SECRET_VAL.test(v));
function secretNames(s){return [...Object.entries(s.env||{}),...Object.entries(s.headers||{})].filter(([n,v])=>isRef(v)||isSecret(n,v)).map(([n])=>n)}
// chỗ giữ trong mcp.json: ${secret:<tên>} (một khoá) hoặc ${secret:<tên>:<BIẾN>} (khi máy chủ có nhiều khoá)
const refBase=k=>String(k).replace(/[{}:$\s]/g,'_');
function refFor(k,n,s){const b='${secret:'+refBase(k)+'}';const used=[s.env,s.headers,s.auth].filter(o=>o&&typeof o==='object').flatMap(o=>Object.entries(o)).some(([x,v])=>x!==n&&v===b);return used?'${secret:'+refBase(k)+':'+n+'}':b}
function extractSecrets(key,s){let n=0;for(const f of ['env','headers','auth'])if(s[f]&&typeof s[f]==='object')for(const [k,v] of Object.entries(s[f])){
  if(isSecret(k,v)){const r=refFor(key,k,s);s[f][k]=r;SEC[r]=v;n++}else if(f!=='auth'&&v===''&&SECRET_NAME.test(k))s[f][k]=refFor(key,k,s)}
 saveSec();return n}
const keyVarsOf=s=>['env','headers'].flatMap(f=>Object.entries(s[f]||{}).filter(([n,v])=>isRef(v)||(typeof v==='string'&&SECRET_NAME.test(n))).map(([n,v])=>[f,n,v]));
const hasKey=v=>isRef(v)&&!!SEC[v];
// che khoá: giá trị đã lưu và các dạng khoá quen thuộc không bao giờ hiện trong nhật ký, stderr hay Chi tiết
function redactText(t){let x=String(t??'');for(const v of Object.values(SEC)){if(typeof v!=='string')continue;for(const p of [v,v.replace(/^Bearer\s+/i,'')])if(p.length>=4)x=x.split(p).join('••••')}
 return x.replace(/\b(sk-|ghp_|github_pat_|hf_)[A-Za-z0-9_\-]{2,}/g,'$1••••').replace(/(Bearer\s+)(?!••••)[^\s"']+/gi,'$1••••')}
function redact(s){if(s.url)return s.url;return redactText([s.command,...(s.args||[])].map(a=>SECRET_VAL.test(a)?'••••':a).join(' '))}
const kindOf=s=>s.url?(s.type==='sse'||/\/sse$/.test(s.url)?'sse':'http'):'stdio';
const pkgArg=s=>(s.args||[]).find(a=>!a.startsWith('-'));
function unpinned(s){if(s.url||s.command!=='npx')return false;const p=pkgArg(s);return !p||!/^(@[^\/@]+\/)?[^@\/]+@[^@\s]+$/.test(p)}
const imgMatch=(c,s)=>!!(c.image&&s.command==='docker'&&(s.args||[]).includes(c.image));
function inCatalog(s){if(s.url)return ADV.some(c=>urlEq(c.url,s.url));if(s.command==='docker')return ADV.some(c=>imgMatch(c,s));return s.command==='npx'&&ADV.some(c=>c.pkg&&(s.args||[]).includes(pinned(c)))}
const pkgName=a=>a&&a.replace(/^(@[^\/@]+\/[^@]+|[^@]+)@.*$/,'$1');
function catalogMatch(s){if(s.url)return ADV.find(c=>c.url&&urlEq(c.url,s.url))||null;if(s.command==='docker')return ADV.find(c=>imgMatch(c,s))||null;if(s.command!=='npx')return null;const p=pkgName(pkgArg(s));return ADV.find(c=>c.pkg&&c.pkg===p)||null}
// mục 17.5: khoá trùng id danh mục VÀ nội dung khớp, hoặc gói (bỏ @phiên bản) / URL (đã chuẩn hoá) khớp, và chỗ đó còn trống → nhận id danh mục. Chỉ trùng khoá → Của tôi. biz/excel không bao giờ nhận từ mcp.json.
function importSlot(k,s,taken){const c=ADVC(k)&&(ADVC(k).url?urlEq(s.url,ADVC(k).url):ADVC(k).image?imgMatch(ADVC(k),s):pkgName(pkgArg(s))===ADVC(k).pkg)?ADVC(k):catalogMatch(s);
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
const TEST_LIMIT=15,KNOWN_CMDS=['npx','node','npm','python','python3'],SIM_HANG=['@vidu/mcp-bao-cao'];
// quyết định lượt 4 (d): chương trình còn thiếu. auto = AIVN có thể tự cài vào thư mục riêng (qua thẻ xin phép). Dung lượng là ước tính.
const PROGS={uv:{name:'uv',cmds:['uv','uvx'],url:'https://docs.astral.sh/uv/getting-started/installation/',auto:true,mb:40,from:'astral.sh',dl:'https://astral.sh/uv/install.ps1'},
 node:{name:'Node.js',cmds:['node','npx','npm'],url:'https://nodejs.org/en/download',auto:true,mb:100,from:'nodejs.org',dl:'https://nodejs.org/dist/ (LTS, .zip)'},
 docker:{name:'Docker',cmds:['docker'],url:'https://docs.docker.com/get-started/get-docker/',auto:false}};
const progOf=cmd=>{const e=Object.entries(PROGS).find(([,p])=>p.cmds.includes(cmd));return e?e[0]:null};
const instDir=p=>'C:\\Users\\Khoi\\AppData\\Local\\AIVN\\tools\\'+p;
const hasCmd=c=>KNOWN_CMDS.includes(c)||!!(DB.installed&&DB.installed[progOf(c)]);
const badKey=v=>{const x=String(v).replace(/^Bearer\s+/i,'');return x.length<8||/^(sai|wrong|test)/i.test(x)};
function simTest(k,s){
 if(s.url){if(isHttp(s.url)&&netKind(s.url)==='lan'){const h=/^[a-z]+:\/\/([^\/]+)/i.exec(s.url)[1];return{code:'network',sec:4,exit:null,err:'ECONNREFUSED',stderr:`connect ECONNREFUSED ${h}`}}return{ok:true,sec:3}}
 if(!hasCmd(s.command))return{code:'notfound',cmd:s.command,sec:1,exit:null,err:'ENOENT',stderr:`spawn ${s.command} ENOENT`};
 const kv=keyVarsOf(s).filter(([f])=>f==='env');const ek=kv.find(([f,n,v])=>v===''||(isRef(v)&&!SEC[v]));
 if(ek)return{code:'key',var:ek[1],sec:2,exit:1,err:'EXIT_1',stderr:`Error: ${ek[1]} environment variable is required\n    at main (file:///…/index.js:12:11)`};
 const bk=kv.find(([f,n,v])=>hasKey(v)&&badKey(SEC[v]));
 if(bk)return{code:'keybad',var:bk[1],sec:2,exit:1,err:'EXIT_1',stderr:`Error: 401 Unauthorized: invalid ${bk[1]} "${SEC[bk[2]]}"\n    at checkKey (file:///…/index.js:30:9)`};
 if(SIM_HANG.includes(pkgName(pkgArg(s))))return{code:'timeout',sec:TEST_LIMIT,exit:null,err:'ETIMEDOUT',stderr:`npm notice downloading ${pkgArg(s)} …\n(no reply to "initialize" after ${TEST_LIMIT} s, process killed)`};
 return{ok:true,sec:3}}
const TEST_MSG={keybad:['Khoá truy cập không đúng hoặc đã hết hạn.','Bấm Nhập khoá để nhập lại khoá, rồi bấm Chạy thử lại.'],timeout:['Ứng dụng không trả lời trong {0} giây nên AIVN đã dừng nó.','Bấm Chạy thử lại. Lần đầu ứng dụng có thể phải tải về lâu hơn. Nếu vẫn vậy, hỏi người cung cấp ứng dụng.'],
 notfound:['Máy này chưa có {0}, một chương trình mà ứng dụng này cần để chạy.','Cài “{0}” rồi bấm Chạy thử lại. Nếu không biết cài thế nào, hỏi người đưa bạn ứng dụng này.'],
 notfound_auto:['Máy này chưa có {0}, một chương trình mà ứng dụng này cần để chạy.','Bấm “Cài giúp tôi” để AIVN cài {0} cho bạn, hoặc tự cài theo Hướng dẫn cài rồi bấm Chạy thử lại.'],
 notfound_manual:['Máy này chưa có {0}, một chương trình mà ứng dụng này cần để chạy.','AIVN không tự cài được {0}. Cài theo Hướng dẫn cài, mở {0} lên, rồi bấm Chạy thử lại.'],
 key:['Ứng dụng cần khoá truy cập nhưng khoá đang trống.','Bấm Nhập khoá, dán khoá truy cập, rồi bấm Chạy thử lại.'],
 network:['Không tới được ứng dụng qua mạng.','Kiểm tra thiết bị đó đang bật và cùng mạng với máy này, rồi bấm Chạy thử lại.']};
const testArg=t=>t.code==='timeout'?TEST_LIMIT:t.code==='notfound'?(progOf(t.cmd)?PROGS[progOf(t.cmd)].name:t.cmd):'';
const testCode=t=>t.code==='notfound'&&progOf(t.cmd)?(PROGS[progOf(t.cmd)].auto?'notfound_auto':'notfound_manual'):t.code;
const testMsg=t=>tr(TEST_MSG[testCode(t)][0],testArg(t)),testFix=t=>tr(TEST_MSG[testCode(t)][1],testArg(t));
const TEST_LINE=()=>tr('AIVN sẽ chạy thử nhanh một lần (tối đa {0} giây): mở ứng dụng, xem có những chức năng gì, rồi tắt ngay. Sau đó ứng dụng chỉ chạy khi AIVN AGENT dùng lần đầu. Các lần kết nối sau không chạy thử nữa, trừ khi ứng dụng bị lỗi hoặc bạn bấm Chạy thử lại.',TEST_LIMIT);
function runTest(k){return new Promise(res=>{const s=servers()[k];if(!s)return res(null);const m=metaOf(k),o=simTest(k,s),lim=Math.min(o.sec,TEST_LIMIT);
 RT.state[k]='testing';RT.testT[k]=0;delete RT.err[k];delete m.test;log(k,`test: start ${kindOf(s)}: ${redact(s)} (limit ${TEST_LIMIT}s)`);render();
 const iv=setInterval(()=>{if(!servers()[k]||RT.state[k]!=='testing'){clearInterval(iv);return res(null)}RT.testT[k]++;
  if(RT.testT[k]<lim)return render();clearInterval(iv);
  if(o.ok){const n=toolsOf(k).length;m.test={ok:true,n,at:now()};RT.listed[k]=true;log(k,`test: listTools -> ${n}`);log(k,'test: stop');RT.state[k]=DB.master&&m.approvedAt&&!s.disabled?'waiting':'off';log(k,'lazy: waiting for first use')}
  else{m.test={ok:false,code:o.code,cmd:o.cmd,var:o.var,exit:o.exit,err:o.err,stderr:redactText(o.stderr),sec:lim,at:now()};log(k,o.code==='timeout'?`test: no reply in ${TEST_LIMIT}s, killed`:`test: failed (${o.err}${o.exit!=null?', exit '+o.exit:''})`);RT.state[k]='error';RT.err[k]=()=>testMsg(m.test)}
  save();render();res(m.test)},window.FAST?120:1000)})}
async function runTests(keys){const rs=await Promise.all(keys.map(runTest));const ok=rs.filter(r=>r&&r.ok).length,bad=rs.filter(r=>r&&!r.ok).length;if(ok+bad)toast(tr('Chạy thử xong: {0} được, {1} lỗi.',ok,bad))}
// “Cài giúp tôi”: thẻ xin phép (cài gì, vào đâu, dung lượng ước tính) → tiến trình mô phỏng → tự chạy thử lại các mục đang thiếu chương trình này
async function installProg(p,k){const P=PROGS[p];if(RT.inst[p]||!P.auto)return;
 const a=await withCard(()=>({tool:'aivn_install_program',logoHtml:letterTile(P.name,30),title:tr('Cho AIVN cài {0}?',P.name),sub:tr('Để chạy “{0}”',displayName(k)),
  fields:[[tr('Chương trình'),tr('{0} · bản chính thức mới nhất',P.name)],[tr('Cài vào'),instDir(p),1],[tr('Dung lượng'),tr('khoảng {0} MB (ước tính)',P.mb)],[tr('Tải từ'),P.from]],
  lines:[tr('Chỉ AIVN dùng bản này. AIVN không đổi cài đặt chung của máy (PATH) và không cần quyền quản trị.'),tr('Cài xong, AIVN tự chạy thử lại các ứng dụng đang cần {0}.',P.name)],
  details:[[tr('Địa chỉ tải'),P.dl,1],[tr('Hướng dẫn chính thức'),P.url,1]],danger:false,alwaysLabel:null}));
 if(!a.ok){render();return}
 const I=RT.inst[p]={pct:0,phase:'dl'};log(k,`install: ${P.name} from ${P.from} -> ${instDir(p)}`);render();
 await new Promise(res=>{const iv=setInterval(()=>{I.pct=Math.min(100,I.pct+(I.phase==='dl'?9:12));if(I.phase==='dl'&&I.pct>=70)I.phase='inst';render();if(I.pct>=100){clearInterval(iv);res()}},window.FAST?60:300)});
 delete RT.inst[p];(DB.installed=DB.installed||{})[p]={at:now(),dir:instDir(p)};save();
 const ks=Object.keys(servers()).filter(x=>{const t=(DB.meta.servers[x]||{}).test;return t&&t.ok===false&&t.code==='notfound'&&progOf(t.cmd)===p});
 ks.forEach(x=>log(x,`install: ${P.name} ready`));toast(tr('Đã cài {0}. Đang chạy thử lại…',P.name));render();runTests(ks)}
// quyết định lượt 3 (4): đổi tên hiển thị (chỉ máy chủ người dùng thêm). Không để trống; “Dùng tên gốc” để quay lại khoá mcp.json.
const isUserSrv=k=>k[0]!=='@'&&!(DB.meta.servers[k]||{}).catalogId;
// quyết định lượt 4 (c): ô khoá ở Nâng cao. Ẩn mặc định, có nút 👁. Lưu vào kho khoá trên máy, mcp.json chỉ giữ ${secret:…}. Khoá đã lưu không bao giờ điền lại vào ô.
// Lưu/đổi/xoá GIÁ TRỊ khoá: người dùng tự bấm nên không qua thẻ. Thêm BIẾN khoá mới làm đổi cấu hình chạy nên qua thẻ (giống quy tắc đổi tên biến).
// v4.7: khoá khai báo trong danh mục (vd. Hugging Face Authorization) luôn có ô, kể cả khi lúc kết nối bỏ trống
const catOf=k=>{const m=DB.meta.servers[k];return m&&m.catalogId?ADVC(m.catalogId):null};
function keyVarsUI(k){const s=servers()[k],vs=keyVarsOf(s),c=catOf(k);if(c&&c.secretVar&&!vs.some(x=>x[1]===c.secretVar))vs.push([s.url?'headers':'env',c.secretVar,null]);return vs}
const optTag=(k,n)=>{const c=catOf(k);return c&&c.optional&&c.secretVar===n?` <span class="opt" data-testid="key-optional">${tr('Không bắt buộc')}</span>`:''};
function keyBox(k){const s=servers()[k];if(!s||s.auth)return'';const vs=keyVarsUI(k),user=isUserSrv(k);if(!vs.length&&!user)return'';
 const K=UI.key&&UI.key.k===k?UI.key:null,tk=esc(k);
 const row=([f,n,v])=>{const ed=K&&!K.add&&K.n===n,tn=esc(n);
  return `<div class="krow" data-testid="key-row-${tk}-${tn}"><span class="kl">🔑 ${tr('Khoá truy cập')} <code>${tn}</code>${optTag(k,n)}</span>${ed?keyInput(k,K):hasKey(v)?`<span class="kok" data-testid="key-saved-${tk}">🔒 ${tr('Đã lưu')} <span aria-hidden="true">••••••••</span></span><span style="flex:1"></span><button class="btn sm ghost" data-testid="key-change-${tk}" onclick="keyEdit('${tk}','${tn}')">${tr('Thay khoá')}</button><button class="btn sm ghost" data-testid="key-del-${tk}" onclick="keyDel('${tk}','${tn}')">${tr('Xoá khoá')}</button>`:`<span class="kmiss" data-testid="key-missing-${tk}">${tr('Chưa có khoá')}</span><span style="flex:1"></span><button class="btn sm pri" data-testid="key-enter-${tk}" onclick="keyEdit('${tk}','${tn}')">${tr('Nhập khoá')}</button>`}</div>`};
 const ph=(vs.find(([f,n,v])=>isRef(v))||[])[2]||refFor(k,'KEY',s);
 const add=!user||K&&!K.add?'':K&&K.add?`<div class="krow" data-testid="key-add-row-${tk}"><span class="kl">🔑 ${tr('Tên khoá')}</span><input class="inp kname" id="key-name" data-testid="key-name-${tk}" maxlength="64" autocomplete="off" spellcheck="false" placeholder="API_KEY" value="${esc(K.name)}" oninput="UI.key.name=this.value" onkeydown="event.stopPropagation();if(event.key==='Escape')keyCancel()"></div><div class="krow"><span class="kl">${tr('Khoá')}</span>${keyInput(k,K)}</div>`:`<div><button class="btn sm ghost" data-testid="key-add-${tk}" onclick="keyAdd('${tk}')">＋ ${tr('Thêm khoá')}</button></div>`;
 return `<div class="keybox ${UI.keyHl===k?'hl':''}" id="keybox-${tk}" data-testid="key-box-${tk}" onclick="event.stopPropagation()">${vs.map(row).join('')}${add}${K&&K.err?`<div class="msg-bad small" data-testid="key-err">${esc(K.err)}</div>`:''}
  <div class="small muted knote">🔒 ${tr('Lưu an toàn trên máy, không ghi vào mcp.json.')} ${tr('Trong mcp.json chỉ có chỗ giữ {0}.',`<code>${esc(ph)}</code>`)}</div>${UI.keySaved===k?`<div class="msg-ok small ksaved" data-testid="key-saved-msg-${tk}">✓ ${tr('Đã lưu khoá.')} <button class="btn sm pri" data-testid="key-retest-${tk}" ${!DB.master||st(k)==='testing'?'disabled':''} onclick="UI.keySaved=null;connectKey('${tk}',{retest:true})">${tr('Chạy thử lại')}</button></div>`:''}</div>`}
function keyInput(k,K){const tk=esc(k);return `<span class="kin"><input class="inp" id="key-in" data-testid="key-input-${tk}" type="${K.show?'text':'password'}" autocomplete="off" spellcheck="false" aria-label="${tr('Khoá truy cập')}" placeholder="${tr('Dán khoá vào đây')}" value="${esc(K.v)}" oninput="UI.key.v=this.value" onkeydown="event.stopPropagation();if(event.key==='Enter')keySave();if(event.key==='Escape')keyCancel()">
  <button class="btn sm ghost eye" data-testid="key-eye-${tk}" aria-pressed="${K.show}" title="${K.show?tr('Ẩn khoá'):tr('Hiện khoá')}" aria-label="${K.show?tr('Ẩn khoá'):tr('Hiện khoá')}" onclick="UI.key.show=!UI.key.show;render();setTimeout(()=>{const i=$('key-in');i&&i.focus()},0)">${K.show?'🙈':'👁'}</button>
  <button class="btn sm pri" data-testid="key-save-${tk}" onclick="keySave()">${tr('Lưu khoá này')}</button><button class="btn sm ghost" data-testid="key-cancel-${tk}" onclick="keyCancel()">${tr('Huỷ')}</button></span>`}
const focusKey=id=>setTimeout(()=>{const i=$(id||'key-in');if(i){i.scrollIntoView({block:'center'});i.focus()}},0);
function keyEdit(k,n){UI.key={k,n,v:'',show:false,err:null,add:false,name:''};UI.keySaved=null;render();focusKey()}
function keyAdd(k){UI.key={k,n:null,v:'',show:false,err:null,add:true,name:''};UI.keySaved=null;render();focusKey('key-name')}
function keyCancel(){UI.key=null;UI.keyHl=null;render()}
// nút “Nhập khoá”: chọn mục ở danh sách và mở ô khoá trong bảng chi tiết bên phải (tô sáng, con trỏ ở sẵn)
function openKey(k){const s=servers()[k];if(!s)return;const t=(DB.meta.servers[k]||{}).test||{},vs=keyVarsOf(s);
 const n=(keyVarsUI(k).find(x=>x[1]===t.var)||keyVarsUI(k).find(x=>!hasKey(x[2]))||keyVarsUI(k)[0]||[])[1];
 UI.key=n?{k,n,v:'',show:false,err:null,add:false,name:''}:{k,n:null,v:'',show:false,err:null,add:true,name:''};UI.keyHl=k;UI.keySaved=null;UI.sel=k;if(!UI.open)UI.tab=isUserSrv(k)?'mine':'adv';
 if(!inList(k)){UI.q='';UI.tab='mine'}openCA({sel:k});setTimeout(()=>{const b=$('keybox-'+k);b&&b.scrollIntoView({block:'center'});const i=$(n?'key-in':'key-name');i&&i.focus()},30)}
async function keySave(){const K=UI.key;if(!K)return;const v=K.v.trim(),k=K.k,s=servers()[k];if(!s)return keyCancel();
 const err=m=>{K.err=m;render();focusKey()};
 if(!v)return err(tr('Khoá không được để trống.'));
 let n=K.n;
 if(K.add){n=K.name.trim();if(!/^[A-Za-z_][A-Za-z0-9_-]{0,63}$/.test(n))return err(tr('Tên khoá chỉ gồm chữ không dấu, số, _ hoặc -, và bắt đầu bằng chữ.'));
  if((s.env&&n in s.env)||(s.headers&&n in s.headers))return err(tr('Đã có khoá tên này.'));
  const f=s.url?'headers':'env',ref=refFor(k,n,s);
  const a=await withCard(()=>({tool:'mcp_key_add',logoHtml:srvLogo(k,30),title:tr('Thêm khoá cho “{0}”?',displayName(k)),sub:displayName(k),
   fields:[[tr('Tên khoá'),n,1],[tr('Lưu khoá'),KEY_NOTE()]],lines:[tr('Thêm khoá làm đổi cách chạy ứng dụng nên cần bạn cho phép.'),tr('Ứng dụng nhận khoá này mỗi lần chạy.')],
   details:[[tr('Tên gốc'),k,1],[tr('Chỗ giữ trong mcp.json'),ref,1]],danger:false,alwaysLabel:null}));
  if(!a.ok){render();return}
  s[f]=s[f]||{};s[f][n]=ref;SEC[ref]=v}
 else{const e=keyVarsUI(k).find(x=>x[1]===n);if(!e)return keyCancel();const [f,,cur]=e;const ref=isRef(cur)?cur:refFor(k,n,s);s[f]=s[f]||{};s[f][n]=ref;SEC[ref]=v} // khoá danh mục đã khai báo sẵn: không cần thẻ
 saveSec();save();log(k,`key: ${n} saved to secure store`);UI.key=null;UI.keyHl=null;UI.keySaved=k;render()}
async function keyDel(k,n){const s=servers()[k],e=keyVarsOf(s).find(x=>x[1]===n);if(!e)return;
 const ok=await modalAsk(tr('Xoá khoá “{0}”?',n),tr('Khoá bị xoá khỏi máy. Chỗ giữ trong mcp.json vẫn còn; ứng dụng sẽ báo thiếu khoá cho đến khi bạn nhập lại.'),tr('Xoá khoá'));
 if(!ok)return;if(isRef(e[2]))delete SEC[e[2]];saveSec();log(k,`key: ${n} removed`);if(UI.keySaved===k)UI.keySaved=null;render()}
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
const letterTile=(name,sz=32)=>`<span class="lt" style="width:${sz}px;height:${sz}px;font-size:${Math.max(12,Math.round(sz*.42))}px">${esc((String(name).trim()[0]||'?').toUpperCase())}</span>`;
// quyết định lượt 4 (a): chữ trên ô lấy từ TÊN HIỂN THỊ (id chỉ dùng bên trong). Sổ tay agent dùng biểu tượng quyển sổ tự vẽ (CC0, assets/logos/agent-notebook.svg).
const ICON_SVG={notebook:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h11.5A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5H6z"/><path d="M6 3v18M3.5 7H6M3.5 12H6M3.5 17H6M10 8h5.5M10 11.5h5.5"/></svg>'};
const iconTile=(ic,sz=32)=>`<span class="lt ic" data-icon="${ic}" style="width:${sz}px;height:${sz}px">${ICON_SVG[ic]}</span>`;
const catLogo=(c,sz=32)=>c.logo?logoTile(c.logo,sz):c.icon?iconTile(c.icon,sz):letterTile(tr(c.name),sz);
const srvLogo=(k,sz=32)=>{const m=DB.meta.servers[k];const c=m&&m.catalogId&&ADVC(m.catalogId);if(c)return catLogo(c,sz);const g=srvGuess(k);return g?logoTile(g,sz):letterTile(displayName(k),sz)};
// v4.7: logo rõ hơn cho mục bạn thêm, đoán theo lệnh/tên (brave, sqlite, github…)
const srvGuess=k=>{const t=(k+' '+JSON.stringify((DB.mcp&&DB.mcp.mcpServers||{})[k]||{})).toLowerCase();return ['brave','sqlite','github','notion','slack','huggingface'].find(x=>t.includes(x))||(/fetch/.test(t)?'fetch':/think/.test(t)?'thinking':'')};
function storeLogo(a,sz=32){return a.logo==='@aivn'?`<img class="lgimg" src="assets/logos/aivn-app.svg" width="${sz}" height="${sz}" alt="">`:logoTile(a.logo,sz)}
const srcLogo=(k,sz)=>k[0]==='@'?storeLogo(ST(k.slice(1)),sz):srvLogo(k,sz);
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
 return{tool:'mcp_connect',logoHtml:title?(c?catLogo(c,30):letterTile(nm,30)):srvLogo(k,30),title:tr('Cho phép kết nối “{0}”?',nm),sub:nm,
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
 const r=await askApproval(()=>({tool,logoHtml:srvLogo(k,30),title:tr('AIVN AGENT muốn dùng “{0}”',nm),sub:nm,fields:[[tr('Ứng dụng'),nm]],
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
 if(c.needs==='secret'){const s0=UI.setup[cid];if(!s0){UI.setup[cid]={v:'',show:false};render();setTimeout(()=>{const i=$('sec-'+cid);i&&i.focus()},0);return}
  token=(s0.v||'').trim();if(!token&&!c.optional){$('sec-'+cid).focus();return}}
 k=newKeyFor(cid);
 const s=c.url?{url:c.url,timeout:120000}:c.image?{command:'docker',args:['run','-i','--rm','-e',c.secretVar,c.image]}:{command:'npx',args:['-y',pinned(c),...(folder?[folder]:[])]};
 if(token){const ref=refFor(k,c.secretVar,s);SEC[ref]=token;if(c.url)s.headers={[c.secretVar]:ref};else s.env={[c.secretVar]:ref}}
 const a=await withCard(mcpSpec(k,s,{folder,noToken:c.optional&&!token,title:()=>tr(c.name),test:true}));
 delete UI.setup[cid];if(!a.ok){render();return}
 servers()[k]=s;DB.meta.servers[k]={catalogId:cid,approvedAt:now(),alwaysOn:false};saveSec();save();runTest(k)}
// quyết định lượt 4 (b): chạy thử chỉ khi nhập, thêm ở Nâng cao, bấm “Chạy thử lại”, hoặc kết nối lại một mục đang Lỗi.
// Mục đã chạy thử được: kết nối / kết nối lại không chạy thử (nhanh). Mục chưa từng chạy thử (vd. dữ liệu mẫu có sẵn) thì chạy thử một lần.
async function connectKey(k,o={}){if(!DB.master)return;const s=servers()[k],m=metaOf(k);if(s.auth){start(k);return}
 const need=!!o.retest||RT.state[k]==='error'||!(m.test&&m.test.ok);
 if(!m.approvedAt){const a=await withCard(mcpSpec(k,s,{test:need}));if(!a.ok){render();return}m.approvedAt=now()}
 delete s.disabled;save();
 if(need)return runTest(k);
 stop(k);delete RT.err[k];RT.state[k]='waiting';log(k,'connect: test passed before, no test run');log(k,'lazy: waiting for first use');save();render();
 toast(tr('Đã kết nối “{0}”. Lần trước chạy thử đã được nên không chạy thử lại.',displayName(k)))}
function disconnectKey(k){if(k[0]==='@')return disconnectStore(k.slice(1));servers()[k].disabled=true;stop(k);save();render()}
async function removeKey(k){const ok=await modalAsk(tr('Gỡ máy chủ “{0}”?',displayName(k)),tr('Công cụ của máy chủ này sẽ biến mất. Các mục “Luôn cho phép” của nó cũng bị xoá. Khoá bí mật của máy chủ này bị xoá khỏi máy.'),tr('Gỡ'));
 if(!ok)return;stop(k);keyVarsOf(servers()[k]).forEach(([f,n,v])=>{if(isRef(v))delete SEC[v]});saveSec();delete servers()[k];delete DB.meta.servers[k];delete RT.state[k];delete UI.expanded[k];if(UI.rename&&UI.rename.k===k)UI.rename=null;save();render()}
async function toggleAlways(k,on){ // “Luôn chạy sẵn” — mặc định tắt (thay cho tự chạy khi mở AIVN)
const m=metaOf(k);if(!on){m.alwaysOn=false;save();return render()}
 const a=await withCard(mcpSpec(k,servers()[k],{autostartOnly:true}));if(a.ok){m.alwaysOn=true;if(!m.approvedAt)m.approvedAt=now();save()}render()}
// ===== v4.7 (lượt 5): hai cột — bên trái danh sách gọn (logo, tên, một dòng, chấm trạng thái), bên phải bảng chi tiết của mục đang chọn =====
// Mỗi bảng chi tiết có MỘT nút chính lớn theo trạng thái; việc phụ là nút nhỏ; chữ kỹ thuật nằm trong “Chi tiết” (đóng sẵn).
function openCA(o={}){UI.open=true;if(o.pane==='adv')UI.tab='adv';else if(o.pane==='main'&&UI.tab==='adv')UI.tab='all';if(o.tab)UI.tab=o.tab;if(o.sel)UI.sel=o.sel;
 if(o.scrollTo){const k=o.scrollTo;UI.q='';UI.sel=k;if(!inList(k))UI.tab=k[0]==='@'&&!conn(k.slice(1))?'all':'mine';UI.flash=k}
 $('caBack').classList.add('open');render();
 setTimeout(()=>{const e=document.querySelector('#caList .li.cur');e&&e.scrollIntoView({block:'nearest'});if(!o.scrollTo&&!o.sel&&!UI.key&&!o.noFocus)$('caQ')&&$('caQ').focus()},0)}
function closeCA(){UI.open=false;$('caBack').classList.remove('open')}
const PILL={waiting:'Đã kết nối · chờ dùng lần đầu',available:'Chưa kết nối',soon:'Sắp có','needs-setup':'Cần thiết lập',starting:'Đang kết nối…',testing:'Đang chạy thử…',installing:'Đang cài…',on:'Đã kết nối',off:'Đã tắt',error:'Lỗi'};
// đang “Cài giúp tôi” thì mục hiện Đang cài…, không hiện Lỗi/Chạy thử lại
const instOf=k=>{const t=k&&(DB.meta.servers[k]||{}).test,p=t&&t.ok===false&&t.code==='notfound'&&progOf(t.cmd);return p&&RT.inst[p]?p:null};
// màu + biểu tượng thống nhất: xanh = đã kết nối, xám = chưa kết nối, đỏ = lỗi, vàng = sắp có (xanh dương = đang chạy thử / đang cài)
const DOT={on:'ok',waiting:'ok',available:'off',off:'off','needs-setup':'off',error:'bad',soon:'soon',testing:'busy',starting:'busy',installing:'busy'};
const DOT_IC={ok:'✓',off:'',bad:'!',soon:'…',busy:'⟳'};
const dotOf=s=>DOT[s]||'off';
const sdot=s=>{const d=dotOf(s),t=esc(tr(PILL[s]||''));return `<span class="sd ${d}" data-dot="${d}" title="${t}" role="img" aria-label="${t}">${DOT_IC[d]}</span>`};
const pill2=s=>`<span class="pill2 ${dotOf(s)}" data-testid="ca-status">${sdot(s)}${tr(PILL[s])}</span>`;
function storeState(a){if(!a.ready)return'soon';const c=conn(a.id);return !c?'available':!c.enabled?'off':RT.used[a.id]?'on':'waiting'}
function toggleNotify(id){DB.notify=DB.notify||{};if(DB.notify[id])delete DB.notify[id];else DB.notify[id]=now();save();render()}
const MASTER_HINT=()=>tr('Công tắc “Cho AIVN AGENT dùng các ứng dụng đã kết nối” đang tắt. AIVN AGENT sẽ không dùng ứng dụng nào cho đến khi bạn bật lại.');
function alwaysRow(k){if(!k||servers()[k].auth)return'';const m=metaOf(k);
 return `<label class="row small always" style="gap:6px" data-testid="adv-always-${esc(k)}"><input type="checkbox" ${m.alwaysOn?'checked':''} onchange="toggleAlways('${esc(k)}',this.checked)"> <b>${tr('Luôn chạy sẵn')}</b> <span class="muted">${m.alwaysOn?tr('Chạy ngay khi mở AIVN, tốn thêm bộ nhớ.'):tr('Tắt: chỉ chạy khi AIVN AGENT cần, đỡ tốn bộ nhớ.')}</span></label>`}
const tfail=k=>{const t=(DB.meta.servers[k]||{}).test;return t&&t.ok===false};
const match=(...xs)=>{const q=foldVi(UI.q.trim());return !q||foldVi(xs.join(' ')).includes(q)};
const EMPTY_GROUP={finance:['💰','Chưa có ứng dụng tài chính.','Nhóm này sẽ có thêm ứng dụng trong các bản sau.']};
function emptyGroup(g){const [ic,h,sub]=EMPTY_GROUP[g]||['🗂','Chưa có ứng dụng trong nhóm này.',null];
 return `<div class="emptybox" data-testid="connect-apps-group-${g}"><div class="ei" aria-hidden="true">${ic}</div><div class="eh">${tr(h)}</div>${sub?`<div class="es">${tr(sub)}</div>`:''}</div>`}
// mục chọn: '@excel' (cửa hàng), 'cat:<id>' (danh mục Nâng cao), '<khoá mcp.json>' (ứng dụng đã thêm), 'x:import', 'x:json'
function selInfo(sel){if(!sel)return null;
 if(sel[0]==='@'){const a=ST(sel.slice(1));return a?{t:'store',a,k:sel}:null}
 if(sel.startsWith('cat:')){const c=ADVC(sel.slice(4));if(!c)return null;const k=keyOfCat(c.id);return k?{t:'srv',k,c}:{t:'cat',c}}
 if(sel==='x:import'||sel==='x:json')return{t:sel.slice(2)};
 if(servers()[sel]){const m=DB.meta.servers[sel]||{};return{t:'srv',k:sel,c:m.catalogId?ADVC(m.catalogId):null}}
 return null}
const selKey=sel=>{const i=selInfo(sel);return i?(i.k||sel):null};
function stateOf(i){return i.t==='store'?storeState(i.a):i.t==='cat'?(UI.setup[i.c.id]?'needs-setup':'available'):i.t==='srv'?(instOf(i.k)?'installing':st(i.k)):null}
const itemName=i=>i.t==='store'?tr(i.a.name):i.t==='cat'?tr(i.c.name):i.t==='srv'?displayName(i.k):i.t==='import'?tr('Nhập mcp.json'):'mcp.json';
const emojiTile=(e,sz)=>`<span class="lt" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz*.42)}px">${e}</span>`;
const itemLogo=(i,sz)=>i.t==='store'?storeLogo(i.a,sz):i.t==='cat'?catLogo(i.c,sz):i.t==='srv'?srvLogo(i.k,sz):emojiTile(i.t==='import'?'📂':'{ }',sz);
function errShort(k){const t=(DB.meta.servers[k]||{}).test;if(t&&t.ok===false)return testMsg(t);const s=servers()[k];return s&&s.auth?tr('AIVN chưa hỗ trợ cách đăng nhập mà ứng dụng này cần.'):tr('Không kết nối được.')}
const progText=p=>{const I=RT.inst[p];return I.phase==='dl'?tr('Đang tải {0}… {1}%',PROGS[p].name,I.pct):tr('Đang cài {0}… {1}%',PROGS[p].name,I.pct)};
const srvDesc=(k,c)=>{const m=DB.meta.servers[k]||{};return c?tr(c.short):m.sampleDesc?tr(m.sampleDesc):tr('Bạn thêm ở Nâng cao.')};
function itemLine(i,s){
 if(i.t==='srv'){const p=instOf(i.k);if(p)return['busy',progText(p)];if(s==='testing')return['busy',tr('Đang chạy thử… {0}/{1} giây',RT.testT[i.k]||0,TEST_LIMIT)];
  if(s==='error')return['bad',errShort(i.k)];return['',srvDesc(i.k,i.c)]}
 if(i.t==='store')return['',tr(i.a.desc)];
 if(i.t==='cat')return['',tr(i.c.short)];
 return['',i.t==='import'?tr('Mang ứng dụng từ LM Studio, Claude Desktop… sang AIVN.'):tr('Sửa tay tệp cấu hình.')]}
function rowHtml(sel){const i=selInfo(sel);if(!i)return'';const s=stateOf(i),[c,l]=itemLine(i,s),cur=!!UI.sel&&selKey(UI.sel)===selKey(sel);
 const tid=i.t==='store'?'app-'+i.a.id:i.t==='cat'?'cat-'+i.c.id:i.t==='srv'?i.k:sel.replace(':','-');
 return `<button class="li ${cur?'cur':''} ${UI.flash&&UI.flash===selKey(sel)?'flash':''}" data-testid="ca-row-${esc(tid)}" data-sel="${esc(sel)}" aria-current="${cur}" onclick="selectItem(this.dataset.sel)">${itemLogo(i,36)}<span class="lm"><span class="ln">${esc(itemName(i))}</span><span class="ls ${c}">${c==='bad'?'':''}${esc(l)}</span></span>${s?sdot(s):''}</button>`}
function listSecs(){const vis=a=>match(tr(a.name),a.name,tr(a.desc),a.desc),visS=k=>match(displayName(k),k),visC=c=>match(tr(c.name),c.name,tr(c.short),c.short);
 if(UI.tab==='all')return GROUPS.map(([g,l])=>[tr(l),STORE.filter(a=>a.group===g&&vis(a)).map(a=>'@'+a.id),'connect-apps-group-'+g]);
 if(UI.tab==='mine')return[[null,[...['biz','excel'].filter(id=>conn(id)&&vis(ST(id))).map(id=>'@'+id),...Object.keys(servers()).filter(visS)]]];
 if(UI.tab==='adv'){const user=Object.keys(servers()).filter(k=>!(DB.meta.servers[k]||{}).catalogId&&visS(k));
  const files=[['x:import',tr('Nhập mcp.json')],['x:json','mcp.json']].filter(([,n])=>match(n)).map(x=>x[0]);
  return[[tr('Có sẵn'),ADV.filter(visC).map(c=>'cat:'+c.id)],[tr('Bạn thêm'),user],[tr('Tệp cấu hình'),files]]}
 return[[null,STORE.filter(a=>a.group===UI.tab&&vis(a)).map(a=>'@'+a.id),'connect-apps-group-'+UI.tab]]}
const inList=sel=>listSecs().flatMap(x=>x[1]).some(x=>selKey(x)===selKey(sel));
function listHtml(secs){const all=secs.flatMap(x=>x[1]);
 if(!all.length){if(GROUPS.some(g=>g[0]===UI.tab)&&!STORE.some(a=>a.group===UI.tab))return emptyGroup(UI.tab);
  return UI.q.trim()?`<div class="empty">${tr('Không thấy “{0}”.',esc(UI.q.trim()))}<div style="margin-top:8px"><a href="#" data-testid="connect-apps-notfound-adv" onclick="setTab('adv');return false">${tr('Không thấy? Thêm máy chủ MCP ở Nâng cao')}</a></div></div>`:`<div class="empty">${tr('Chưa kết nối ứng dụng nào.')}</div>`}
 return secs.map(([h,arr,tid])=>arr.length?`<div class="lsec" ${tid?`data-testid="${tid}"`:''}>${h?`<div class="lgrp">${esc(h)}</div>`:''}${arr.map(rowHtml).join('')}</div>`:'').join('')}
function setTab(t){UI.tab=t;render()}
function selectItem(sel){UI.sel=sel;if(!inList(sel)){UI.q='';if(!inList(sel)){const i=selInfo(sel);UI.tab=i&&(i.t==='cat'||i.t==='import'||i.t==='json')?'adv':i&&i.t==='store'&&!conn(i.a.id)?'all':'mine'}}
 if(UI.key&&UI.key.k!==selKey(sel)){UI.key=null;UI.keyHl=null}
 if(UI.rename&&UI.rename.k!==selKey(sel))UI.rename=null;
 if(UI.open)render();else openCA({sel})}
const legend=()=>`<div class="legend" data-testid="ca-legend">${[['on','Đã kết nối'],['available','Chưa kết nối'],['error','Lỗi'],['soon','Sắp có']].map(([s,l])=>`<span>${sdot(s)} ${tr(l)}</span>`).join('')}</div>`;
const BIG=(cls,attrs,label)=>`<button class="btn big ${cls}" data-testid="ca-primary" ${attrs}>${label}</button>`;
const phead=(logo,name,s,sub)=>`<div class="ph">${logo}<div class="phm"><h3>${name}</h3>${sub||''}${s?pill2(s):''}</div></div>`;
const disM=()=>!DB.master?`disabled title="${esc(MASTER_HINT())}"`:'';
function panelHtml(){const i=selInfo(UI.sel);if(!i)return `<div class="pempty">${tr('Chọn một ứng dụng bên trái để xem chi tiết.')}</div>`;
 const mh=!DB.master&&i.t!=='import'&&i.t!=='json'&&!(i.t==='store'&&!i.a.ready)?`<div class="apwarn" data-testid="connect-apps-master-off" style="margin:0 0 16px">${MASTER_HINT()}</div>`:'';
 return mh+(i.t==='store'?storePanel(i.a):i.t==='cat'?catPanel(i.c):i.t==='srv'?srvPanel(i.k):i.t==='import'?importPanel():jsonPanel())}
function storePanel(a){const id=a.id,s=storeState(a),c=conn(id);
 if(!a.ready){const on=DB.notify&&DB.notify[id];
  return `<div class="detail" data-testid="connect-apps-soon-${id}">${phead(storeLogo(a,56),esc(tr(a.name)),s)}
   <div class="pact">${BIG(on?'':'pri',`data-act="notify" aria-pressed="${!!on}" data-testid2="connect-apps-notify-${id}" onclick="toggleNotify('${id}')"`,on?'✓ '+tr('Sẽ báo bạn'):'🔔 '+tr('Báo tôi khi có'))}</div>
   <p class="pdesc">${esc(tr(a.desc))}</p>${a.google?`<div class="pnote">${tr('Chờ đăng nhập Google.')}</div>`:''}${on?`<div class="pnote ok">${tr('AIVN sẽ báo bạn ngay trong ứng dụng khi có. Không gửi gì ra ngoài.')}</div>`:''}</div>`}
 const i=STORE_INFO[id],cn=s==='on'||s==='waiting';
 const P=cn?BIG('',`data-act="disconnect" onclick="disconnectStore('${id}')"`,tr('Ngắt kết nối')):BIG('pri',`data-act="connect" onclick="connectStore('${id}')"`,tr('Kết nối'));
 const cnt=lvlCount(id);
 const lv=LEVELS.map(([l,h,sub])=>{const ts=storeTools(id).filter(t=>t[1]===l);return ts.length?`<div class="lvl lvl-${l}"><div class="lh"><span class="lb">${tr(h)}</span><span class="muted small">${tr(sub)} · ${tr('{0} việc',ts.length)}</span></div><div class="tgl">${ts.map(t=>esc(tr(t[2]))).join(' · ')}</div></div>`:''}).join('');
 return `<div class="detail" data-testid="connect-apps-detail-${id}">${phead(storeLogo(a,56),esc(tr(a.name)),s)}
  <div class="pact">${P}${cn?`<span class="muted small">${tr('Làm được {0} việc',storeTools(id).length)}</span>`:''}<span style="flex:1"></span>${c?`<button class="btn sm ghost danger" data-testid="ca-remove" onclick="removeStore('${id}')">${tr('Gỡ')}</button>`:''}</div>
  <p class="pdesc">${esc(tr(i.long))}</p>
  ${id==='excel'?`<div class="psec">${excelFolderHtml('detail')}</div>`:''}
  <div class="psec"><h5>${tr('Quyền')}</h5><div class="lvls">${LEVELS.map(([l,h,sub],j)=>cnt[j]?`<span class="lvc lvl-${l}"><b>${tr(h)}</b> ${tr('{0} việc',cnt[j])} · ${tr(sub)}</span>`:'').join('')}</div>
   <details class="apdet" data-testid="perm-details" ${UI.expanded['perm:'+id]?'open':''} ontoggle="if(this.isConnected)UI.expanded['perm:${id}']=this.open"><summary onclick="UI.expanded['perm:${id}']=!this.parentNode.open">${tr('Xem từng việc')}</summary>${lv}</details></div>
  <div class="psec"><dl class="kv"><dt>${tr('Dữ liệu nằm ở')}</dt><dd>🖥 ${tr(i.where)}</dd><dt>${tr('Nhà phát triển và phiên bản')}</dt><dd>${esc(tr(i.dev))} · ${tr('bản {0} (số mẫu)',i.ver)}</dd></dl></div>
  <details class="apdet ptech" data-testid="connect-apps-detail-tech"><summary>${tr('Chi tiết')}</summary><dl class="apf">
   <dt>${tr('Cách chạy')}</dt><dd>${tr('Trong AIVN, không có tiến trình riêng, không qua mcp.json.')}</dd>
   <dt>${tr('Đường truyền')}</dt><dd>${tr('Gọi trực tiếp trong ứng dụng (không stdio, không http).')}</dd>
   <dt>${tr('Công cụ')}</dt><dd>${storeTools(id).map(t=>`<code>${t[0]}</code>`).join(' ')}</dd></dl></details></div>`}
const catRun=c=>c.url?esc(c.url):c.image?esc(`docker run -i --rm -e ${c.secretVar} ${c.image}`):esc(pinned(c))+' · '+tr('đóng sẵn trong bản cài');
function catTech(c){const ek='cat:'+c.id;return `<details class="apdet ptech" data-testid="adv-details-${c.id}" ${UI.expanded[ek]?'open':''} ontoggle="if(this.isConnected)UI.expanded['${ek}']=this.open"><summary onclick="UI.expanded['${ek}']=!this.parentNode.open">${tr('Chi tiết')}</summary>
 <dl class="apf"><dt>${c.url?tr('Địa chỉ'):tr('Lệnh')}</dt><dd><code>${catRun(c)}</code></dd>${c.runNote?`<dt>${tr('Cách chạy')}</dt><dd data-testid="run-note-${c.id}">${esc(tr(c.runNote))}</dd>`:''}
 <dt>${tr('Công cụ')}</dt><dd>${c.tools.map(([n])=>`<code>${esc(n)}</code>`).join(' ')}</dd></dl><div class="small muted">${MCP_WARN()}</div></details>`}
function setupBox(c){const S=UI.setup[c.id];
 return `<div class="keybox hl" data-testid="setup-${c.id}"><div class="krow"><span class="kl">🔑 ${tr('Khoá truy cập')} <code>${esc(c.secretVar)}</code>${c.optional?` <span class="opt" data-testid="key-optional">${tr('Không bắt buộc')}</span>`:''}</span>
  <span class="kin"><input class="inp" type="${S.show?'text':'password'}" id="sec-${c.id}" data-testid="setup-input-${c.id}" autocomplete="off" spellcheck="false" aria-label="${tr('Khoá truy cập')}" placeholder="${c.optional?'Bearer …':tr('Dán khoá vào đây')}" value="${esc(S.v)}" oninput="UI.setup['${c.id}'].v=this.value" onkeydown="event.stopPropagation();if(event.key==='Enter')connectCatalog('${c.id}')">
  <button class="btn sm ghost eye" data-testid="setup-eye-${c.id}" aria-pressed="${!!S.show}" aria-label="${S.show?tr('Ẩn khoá'):tr('Hiện khoá')}" title="${S.show?tr('Ẩn khoá'):tr('Hiện khoá')}" onclick="UI.setup['${c.id}'].show=!UI.setup['${c.id}'].show;render();setTimeout(()=>{const i=$('sec-${c.id}');i&&i.focus()},0)">${S.show?'🙈':'👁'}</button></span></div>
  <div class="row" style="gap:8px;margin-top:6px"><button class="btn pri" data-testid="setup-continue-${c.id}" onclick="connectCatalog('${c.id}')">${tr('Tiếp tục')}</button><button class="btn sm ghost" onclick="delete UI.setup['${c.id}'];render()">${tr('Huỷ')}</button></div>
  <div class="small muted knote">${c.optional?tr('Không bắt buộc. Bỏ trống vẫn kết nối được, nhưng yêu cầu có thể bị từ chối.')+' ':''}🔒 ${tr('Lưu an toàn trên máy, không ghi vào mcp.json.')}</div></div>`}
function catPanel(c){const setup=UI.setup[c.id];
 return `<div class="detail" data-testid="connect-apps-card-${c.id}">${phead(catLogo(c,56),esc(tr(c.name)),setup?'needs-setup':'available')}
  ${setup?`<div class="psec">${setupBox(c)}</div>`:`<div class="pact">${BIG('pri',`data-act="connect" ${disM()} onclick="connectCatalog('${c.id}')"`,tr('Kết nối'))}</div>`}
  <p class="pdesc">${esc(tr(c.long||c.desc))}</p>
  ${c.deprecated?`<div class="dep">${tr('Gói này trên npm đã ngừng được hỗ trợ. AIVN ghim đúng bản cuối và không tự tải bản khác.')}</div>`:''}
  ${catTech(c)}</div>`}
function srvTech(k){const s=servers()[k],m=DB.meta.servers[k]||{},t=m.test,c=m.catalogId&&ADVC(m.catalogId),ek='t:'+k,tk=esc(k),red=t&&/••••/.test(t.stderr||'');
 const rows=[[tr('Tên gốc (trong mcp.json)'),`<code data-testid="orig-name-${tk}">${esc(k)}</code>`],...(m.label?[[tr('Tên hiển thị'),esc(m.label)]]:[]),
  [(s.url?tr('Địa chỉ'):tr('Lệnh'))+' · '+kindOf(s),`<code>${esc(redact(s))}</code>`]];
 if(c&&c.runNote)rows.push([tr('Cách chạy'),`<span data-testid="run-note-${tk}">${esc(tr(c.runNote))}</span>`]);
 if(runsBundled(c,s))rows.push([tr('Cách chạy'),tr('Gói này nằm sẵn trong bản cài AIVN. Khi chạy, AIVN không gọi npx và không tải gì.')]);
 if(t&&t.ok===false)rows.push([tr('Mã lỗi'),`<code>${esc(t.err)}</code>`],[tr('Mã thoát'),t.exit==null?tr('không có (tiến trình không tự thoát)'):`<code>${t.exit}</code>`],[tr('Thời gian'),tr('{0} giây',t.sec)],
  ['stderr',`<pre class="log">${esc(redactText(t.stderr))}</pre>${red?`<div class="small muted" data-testid="redacted-note-${tk}">🔒 ${tr('Khoá đã được che (••••). AIVN không bao giờ hiện khoá trong nhật ký hay Chi tiết.')}</div>`:''}`]);
 else if(st(k)==='error'&&errText(k))rows.push([tr('Lỗi'),esc(errText(k))]);
 rows.push([tr('Công cụ'),RT.listed[k]?toolsOf(k).map(([n,d])=>`<div><code>${esc(n)}</code> <span class="muted">— ${esc(d)}</span></div>`).join(''):'—'],[tr('Nhật ký (60 dòng cuối)'),`<div class="log">${esc((RT.logs[k]||[]).join('\n'))||'—'}</div>`]);
 return `<details class="apdet ptech" data-testid="test-details-${tk}" ${UI.expanded[ek]?'open':''} ontoggle="if(this.isConnected)UI.expanded['${esc(ek)}']=this.open"><summary onclick="UI.expanded['${esc(ek)}']=!this.parentNode.open">${tr('Chi tiết')}</summary><dl class="apf">${rows.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl><div class="small muted">${MCP_WARN()}</div></details>`}
const guideA=(P,big)=>`<a class="btn ${big?'big pri':'sm'}" data-testid="${big?'ca-primary':'install-guide'}" data-act="guide" href="${P.url}" target="_blank" rel="noopener noreferrer">📖 ${tr('Hướng dẫn cài')} ↗</a>`;
function srvPanel(k){const s=servers()[k],m=DB.meta.servers[k]||{},c=m.catalogId?ADVC(m.catalogId):null,t=m.test,tk=esc(k),p=instOf(k),s0=p?'installing':st(k),busy=s0==='testing'||s0==='starting'||!!p;
 const sm=(tid,act,label)=>`<button class="btn sm" data-testid="${tid}" ${disM()} ${busy?'disabled':''} onclick="${act}">${label}</button>`;
 const retest=sm('retest-'+tk,`connectKey('${tk}',{retest:true})`,tr('Chạy thử lại')),reconn=sm('reconnect-'+tk,`connectKey('${tk}')`,tr('Kết nối lại'));
 let P='';const sec=[];
 if(p)P=BIG('','disabled data-act="installing"','⬇ '+tr('Đang cài…'));
 else if(s0==='testing')P=BIG('','disabled data-act="testing"',tr('Đang chạy thử…'));
 else if(s0==='starting')P=BIG('','disabled data-act="starting"',tr('Đang kết nối…'));
 else if(s.auth)P=BIG('',`data-act="remove" onclick="removeKey('${tk}')"`,tr('Gỡ'));
 else if(s0==='error'&&t&&t.ok===false){
  if(t.code==='key'||t.code==='keybad')P=BIG('pri',`data-act="key" data-testid2="enter-key-${tk}" ${disM()} onclick="openKey('${tk}')"`,'🔑 '+tr('Nhập khoá'));
  else if(t.code==='notfound'){const pg=progOf(t.cmd),PG=pg&&PROGS[pg];
   if(PG&&PG.auto){P=BIG('pri',`data-act="install" data-testid2="install-${pg}-${tk}" ${disM()} onclick="installProg('${pg}','${tk}')"`,'⬇ '+tr('Cài giúp tôi'));sec.push(guideA(PG))}
   else if(PG)P=guideA(PG,true)}
  if(!P)P=BIG('pri',`data-act="retest" ${disM()} onclick="connectKey('${tk}',{retest:true})"`,tr('Chạy thử lại'));else sec.push(retest)}
 else if(s0==='error')P=BIG('pri',`data-act="retest" ${disM()} onclick="connectKey('${tk}',{retest:true})"`,tr('Thử lại'));
 else if(s0==='on'||s0==='waiting'){P=BIG('',`data-act="disconnect" onclick="disconnectKey('${tk}')"`,tr('Ngắt kết nối'));sec.push(reconn,retest)}
 else P=BIG('pri',`data-act="connect" ${disM()} onclick="connectKey('${tk}')"`,tr('Kết nối'));
 if(isUserSrv(k)&&!(UI.rename&&UI.rename.k===k))sec.push(`<button class="btn sm ghost" data-testid="rename-${tk}" onclick="renameStart('${tk}')">✎ ${tr('Đổi tên hiển thị')}</button>`);
 const rm=s.auth?'':`<button class="btn sm ghost danger" data-testid="ca-remove" onclick="removeKey('${tk}')">${tr('Gỡ')}</button>`;
 // trạng thái: lỗi (một câu + cách sửa), đang cài / đang chạy thử (thanh tiến trình), hoặc chạy thử được
 let stl='';
 if(p){const I=RT.inst[p];stl=`<div class="tst run" data-testid="install-progress-${tk}">⬇ ${progText(p)}<span class="bar"><i style="width:${I.pct}%"></i></span></div>`}
 else if(s0==='testing'){const n=RT.testT[k]||0;stl=`<div class="tst run" data-testid="test-${tk}">⏳ ${tr('Đang chạy thử… {0}/{1} giây',n,TEST_LIMIT)}<span class="bar"><i style="width:${Math.round(100*n/TEST_LIMIT)}%"></i></span></div>`}
 else if(s0==='error'){const fail=t&&t.ok===false;stl=`<div class="perr" data-testid="test-${tk}"><b>✕ ${esc(fail?testMsg(t):errShort(k))}</b><div class="fix">${esc(fail?testFix(t):s.auth?tr('Hỏi người cung cấp ứng dụng xem có cách kết nối bằng khoá truy cập không.'):tr('Bấm Thử lại. Nếu vẫn lỗi, mở Chi tiết để xem.'))}</div></div>`}
 else if(t&&t.ok){const pi=progOf(s.command),inst=pi&&DB.installed&&DB.installed[pi];stl=`<div class="tst ok" data-testid="test-${tk}">✓ ${tr('Chạy thử được · {0} chức năng',t.n)}</div>${inst?`<div class="tst ok small" data-testid="installed-${tk}">⬇ ${tr('Đã cài {0} cho AIVN',PROGS[pi].name)}</div>`:''}`}
 const kb=keyBox(k),ar=alwaysRow(k);
 const name=UI.rename&&UI.rename.k===k?nameOrEdit(k,'nm'):esc(displayName(k));
 return `<div class="detail" data-testid="connect-apps-card-${tk}">${phead(srvLogo(k,56),name,s0,renameErr(k))}
  <div class="pact">${P}${sec.join('')}<span style="flex:1"></span>${rm}</div>${stl}
  <p class="pdesc">${esc(c?tr(c.long||c.desc):srvDesc(k,null))}</p>
  ${kb?`<div class="psec"><h5>${tr('Khoá truy cập')}</h5>${kb}</div>`:''}
  ${ar?`<div class="psec"><h5>${tr('Khi nào chạy')}</h5>${ar}</div>`:''}
  ${srvTech(k)}</div>`}
function importPanel(){return `<div class="detail" data-testid="ca-import">${phead(emojiTile('📂',56),tr('Nhập mcp.json'),null,`<div class="small muted" style="margin-top:4px">${tr('Mang ứng dụng từ LM Studio, Claude Desktop… sang AIVN.')}</div>`)}
 <div class="pact">${BIG('pri',`data-act="pick" onclick="$('fileIn').click()"`,'📂 '+tr('Chọn tệp mcp.json…'))}<button class="btn sm" data-testid="connect-apps-sample" onclick="UI.plan=makePlan(SAMPLE,SAMPLE_NAME);render()">${tr('(bản mẫu) Dùng tệp ví dụ')}</button><span style="flex:1"></span><button class="btn sm ghost" onclick="exportJson()">${tr('Xuất mcp.json…')}</button></div>
 <p class="pdesc">${tr('Mỗi mục mới được chạy thử một lần (tối đa {0} giây) để biết có dùng được không.',TEST_LIMIT)}</p>
 ${importPlan()}<div class="warnline" data-testid="connect-apps-mcp-warn" style="margin-top:14px">${MCP_WARN()}</div></div>`}
function jsonPanel(){return `<div class="detail" data-testid="ca-json">${phead(emojiTile('{ }',56),'mcp.json',null,`<div class="small muted" style="margin-top:4px">${tr('Sửa tay tệp cấu hình.')}</div>`)}
 <textarea class="inp code" id="advTxt" data-testid="connect-apps-json" spellcheck="false" oninput="UI.advText=this.value" style="margin-top:16px">${esc(UI.advText??JSON.stringify(DB.mcp,null,2))}</textarea>
 <div class="small muted" style="margin:6px 0" data-testid="json-secret-note">🔑 ${tr('Chỗ giữ như {0} trỏ tới khoá đã lưu an toàn trên máy. Khoá thật không bao giờ ghi vào mcp.json.','<code>${secret:tim-kiem}</code>')}</div>
 <div class="small muted" style="margin:6px 0">ℹ️ ${tr('Đổi lệnh, đối số, địa chỉ, đầu mục hoặc tên biến thì máy chủ mất duyệt và phải qua thẻ xin phép.')}</div>
 <div class="row"><button class="btn pri" data-testid="ca-primary" onclick="saveAdv()">${tr('Lưu & kết nối lại')}</button><span id="advMsg">${UI.advMsg||''}</span></div></div>`}
function renderCA(){const M=$('caModal'),ae=document.activeElement,fid=ae&&ae.tagName==='INPUT'&&M.contains(ae)&&ae.id?ae.id:null;let fpos=null;try{fpos=fid?ae.selectionStart:null}catch(e){}
 const sc=$('caList')?$('caList').scrollTop:0,sp=$('caPanel')?$('caPanel').scrollTop:0,n=countOn();
 const secs=listSecs(),flat=secs.flatMap(x=>x[1]);if(!UI.sel||!flat.some(x=>selKey(x)===selKey(UI.sel)))UI.sel=flat[0]||null;
 const same=M.dataset.sel===String(selKey(UI.sel));M.dataset.sel=String(selKey(UI.sel));
 M.innerHTML=`<div class="mh"><h2>${tr('Kết nối ứng dụng')}</h2><span class="badge ${n?'on':''}" data-testid="connect-apps-count" aria-live="polite">${n?tr('{0} đã kết nối',n):tr('Chưa kết nối')}</span><button class="x" onclick="closeCA()" aria-label="✕">✕</button></div>
  <div class="ca-top"><div class="search">${ICONS.search}<input class="inp" id="caQ" data-testid="connect-apps-q" placeholder="${tr('Tìm ứng dụng…')}" value="${esc(UI.q)}"></div>
   <div class="chips" role="tablist">${FILTERS.map(([id,l])=>`<button class="chip ${id==='adv'?'adv':''} ${UI.tab===id?'on':''}" role="tab" aria-selected="${UI.tab===id}" data-testid="connect-apps-tab-${id}" onclick="setTab('${id}')">${id==='adv'?'⚙ ':''}${tr(l)}</button>`).join('')}</div>
   <span style="flex:1"></span><button class="btn sm" data-testid="connect-apps-import-top" onclick="selectItem('x:import')">📂 ${tr('Nhập mcp.json')}</button></div>
  <div class="ca-body"><div class="ca-left"><div class="scroll" id="caList">${listHtml(secs)}</div>${legend()}</div>
   <div class="scroll" id="caPanel" data-testid="ca-panel">${panelHtml()}</div></div>`;
 $('caQ').oninput=e=>{UI.q=e.target.value;renderCA()};
 $('caList').scrollTop=sc;if(same)$('caPanel').scrollTop=sp;
 if(UI.flash)setTimeout(()=>{UI.flash=null},1700);
 if(fid&&$(fid)){const e=$(fid);e.focus();try{const q=fpos??e.value.length;e.setSelectionRange(q,q)}catch(x){}}
 const ri=UI.rename&&$('rn-in');if(ri&&document.activeElement!==ri){const q=UI.rename.pos??ri.value.length;ri.focus();try{ri.setSelectionRange(q,q)}catch(e){}}}
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
 'github':{command:'docker',args:['run','-i','--rm','-e','GITHUB_PERSONAL_ACCESS_TOKEN','ghcr.io/github/github-mcp-server'],env:{GITHUB_PERSONAL_ACCESS_TOKEN:'ghp_mauxxxxxxxxxxxxxxxxxxxx'}},
 'lich-cong-ty':{url:'https://calendar.example.com/mcp',auth:{type:'oauth',CLIENT_SECRET:'abc123'}}}},null,2);
// v4.7: mô tả một dòng cho các mục của tệp ví dụ (bản mẫu); lich-cong-ty cố ý là mẫu lỗi (cần OAuth)
const SAMPLE_DESC={'brave-search':'Tìm trên mạng bằng Brave.','nas-nha':'Ổ mạng trong nhà.','thoi-tiet':'Dự báo thời tiết.','may-ngoai':'Máy ở ngoài mạng nội bộ.','nas-ten':'Ổ mạng trong nhà (theo tên).','sqlite':'Đọc tệp cơ sở dữ liệu SQLite.','thinking':'Suy nghĩ từng bước (qua mạng).','tim-kiem':'Tìm kiếm (cần khoá).','bao-cao':'Báo cáo (mẫu chạy quá giờ).','lich-cong-ty':'Lịch công ty (mẫu lỗi)'};
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
  ${grp('✚ '+tr('Sẽ thêm ({0})',p.add.length),p.add,a=>`<div class="r">${a.slot?catLogo(ADVC(a.slot),22):letterTile(a.name,22)}<b>${esc(a.name)}</b><span class="st">${a.kind}</span><code>${esc(a.cmd)}</code><span class="small dest">→ ${a.slot?tr('Nâng cao: {0}',tr(ADVC(a.slot).name)):tr('Của tôi')}</span>${a.danger?`<span class="danger-tag">⚠ ${esc(whyOf(a))}</span>`:''}</div>`)}
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
 const sd=n=>p.file===SAMPLE_NAME&&SAMPLE_DESC[n]?{sampleDesc:SAMPLE_DESC[n]}:{};
 for(const x of p.add){const s=JSON.parse(JSON.stringify(x.server));extractSecrets(x.name,s);servers()[x.name]=s;DB.meta.servers[x.name]={catalogId:x.slot||null,approvedAt:now(),alwaysOn:false,...sd(x.name)}}
 for(const x of p.oauthSkipped){const s=JSON.parse(JSON.stringify(x.server));extractSecrets(x.name,s);servers()[x.name]=s;DB.meta.servers[x.name]={catalogId:null,approvedAt:null,alwaysOn:false,...sd(x.name)};RT.state[x.name]='error';const nm=x.name;RT.err[nm]=()=>tr('AIVN chưa hỗ trợ đăng nhập OAuth (trường auth) của máy chủ "{0}".',nm)}
 const names=p.add.map(x=>x.name);save();UI.plan=null;UI.tab='mine';UI.q='';UI.sel=names[0]||UI.sel;render();runTests(names)}
async function replaceOne(name){const x=UI.plan.conflict.find(c=>c.name===name);
 const a=await withCard(()=>({tool:'mcp_replace',logoHtml:srvLogo(name,30),title:tr('Thay thế máy chủ “{0}”?',name),sub:name,details:[[tr('Lệnh cũ'),x.old,1],[tr('Lệnh mới'),x.cmd,1]],warn:tr('Tiến trình cũ sẽ bị dừng.'),danger:true,alwaysLabel:null}));
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
 $('o_draft').textContent='⚠ '+tr('Bản nháp 4.7 theo F-PLUGINS bản 2 + quyết định ngày 22/10 (lượt 5)')+' · '+tr('Dữ liệu mẫu · lưu trong trình duyệt');$('o_draft').title=$('o_draft').textContent;
 $('o_v46').textContent=tr('Bản 4.6');$('o_v41').textContent=tr('Bản 4.1');$('o_v45').textContent=tr('Bản 4.5');$('o_v44').textContent=tr('Bản 4.4');$('o_v43').textContent=tr('Bản 4.3');$('o_v42').textContent=tr('Bản 4.2');$('o_restart').textContent='↻ '+tr('Mô phỏng mở lại AIVN');$('o_reset').textContent=tr('↺ Đặt lại');$('o_set').textContent='⚙ '+tr('Cài đặt (mô phỏng)');
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
  ${onSources().length?`<div class="simuse" data-testid="sim-agent-use"><div class="small muted">${tr('(bản mẫu) Cho AIVN AGENT thử dùng ứng dụng:')}</div>${['biz','excel'].filter(id=>conn(id)?.enabled).map(id=>storeActs(id).map(([tl,l,d])=>`<button class="chipq" data-testid="sim-use-${tl}" onclick="agentUse('${id}','${tl}')">${storeLogo(ST(id),14)} ${esc(tr(d))}</button>`).join('')).join('')}${onSources().filter(k=>k[0]!=='@').map(k=>`<button class="chipq" data-testid="sim-use-mcp-${esc(k)}" onclick="agentUseMcp('${esc(k)}')">${srvLogo(k,14)} ${esc(tr('Dùng “{0}”',displayName(k)))}</button>`).join('')}</div>`:!DB.master&&connectedKeys().length?`<div class="simuse small muted" data-testid="sim-master-off">${MASTER_HINT()}</div>`:''}
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
$('o_reset').onclick=()=>{localStorage.removeItem(KEY);localStorage.removeItem(VAULT);location.reload()};
$('o_restart').onclick=restartSim;
RT.restarted=!!(DB.meta.connectors.biz||DB.meta.connectors.excel||Object.values(DB.meta.servers).some(m=>m.approvedAt));render();setTimeout(()=>startAll(false),window.FAST?0:400);
