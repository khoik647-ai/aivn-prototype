// Bản mẫu Kết nối ứng dụng v4.12 — báo cáo QA v4.11 (lượt 10: quét khoá theo LUẬT — tên, args, command, URL, lồng nhau; không-phải-khoá theo từng máy chủ; một luật tên 1–64 ký tự). Trước đó: v4.11 — báo cáo QA v4.10 (lượt 9: tên dài không còn treo khi “Giữ cả hai”, bắt thêm 6 loại khoá lọt — mật khẩu trong URL ở env/args, header -H "X-API-Key: …", ?access_key=, *_PASS, secret AWS dạng arg —, bỏ chọn một dòng vẫn lưu phần còn lại, JWT một khối, không gợi ý sha/digest/tên tệp, nút Kết nối trang chính ≥44px, thanh công cụ một hàng ≥1024px). Trước đó v4.10 — F-PLUGINS bản 2 (PR #5) + quyết định 22/10 + báo cáo QA v4.9 (lượt 8: dò khoá ở mọi chỗ trong mcp.json + thẻ xin phép từng khoá, vùng chạm ≥44px khi dùng tay, trùng tên máy chủ, bản so sánh khi lưu mcp.json, thẻ lọc Đã kết nối, mô tả không bị cắt, tô màu cú pháp). Mô phỏng hoàn toàn trong trình duyệt.
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
// v4.9: thêm “Đã cài” (= đã kết nối hoặc đã thêm, kể cả đang tắt/lỗi). “Đã kết nối” là bộ lọc ẩn, mở bằng huy hiệu “x đã kết nối”. “Của tôi” chỉ còn mục tự thêm.
const FILTERS=[['all','Tất cả'],['installed','Đã cài'],['connected','Đã kết nối'],...GROUPS,['mine','Của tôi'],['adv','Nâng cao']];
const STORE=[
 {id:'excel',group:'productivity',name:'Excel',logo:'microsoftexcel',ready:true,short:'Đọc và ghi tệp Excel.',desc:'Đọc và ghi tệp Excel trong thư mục bạn chọn. Không cần cài Microsoft Excel.'},
 {id:'drive',group:'productivity',name:'Drive',logo:'googledrive',google:true,desc:'Tệp trên Google Drive.'},
 {id:'calendar',group:'productivity',name:'Calendar',logo:'googlecalendar',google:true,desc:'Lịch Google.'},
 {id:'notion',group:'productivity',name:'Notion',logo:'notion',desc:'Trang và cơ sở dữ liệu Notion.'},
 {id:'zalo',group:'communication',name:'Zalo',logo:'zalo',desc:'Nhắn tin Zalo.'},
 {id:'gmail',group:'communication',name:'Gmail',logo:'gmail',google:true,desc:'Đọc và gửi thư Gmail.'},
 {id:'biz',group:'sales',name:'AIVN Kinh doanh',logo:'@aivn',ready:true,short:'Khách hàng, đơn bán, kho, hoá đơn.',desc:'Khách hàng, đơn bán, kho và hoá đơn ngay trong AIVN. Dữ liệu nằm trên máy này.'},
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
const KEY='aivn.plugins.v412';
// quyết định lượt 4 (c): khoá lưu riêng, đóng vai kho khoá của hệ điều hành (Windows Credential Manager). mcp.json chỉ giữ chỗ ${secret:…}.
const VAULT='aivn.secrets.v412';
// v4.10: kho khoá MÔ PHỎNG. Ứng dụng thật dùng kho khoá của hệ điều hành (Windows Credential Manager / macOS Keychain / libsecret).
// Bản mẫu không bao giờ ghi khoá dạng chữ: localStorage chỉ giữ mục đã làm rối (XOR + base64, nhãn "sim1:"), không phải mã hoá thật.
const VKEY='aivn-sim-vault-412';
const obf=v=>'sim1:'+btoa(Array.from(new TextEncoder().encode(String(v)),(b,i)=>String.fromCharCode(b^VKEY.charCodeAt(i%VKEY.length))).join(''));
const deobf=x=>{if(typeof x!=='string'||!x.startsWith('sim1:'))return x;try{const b=atob(x.slice(5));return new TextDecoder().decode(Uint8Array.from(b,(c,i)=>c.charCodeAt(0)^VKEY.charCodeAt(i%VKEY.length)))}catch{return ''}};
let SEC=Object.fromEntries(Object.entries(LS.get(VAULT,{})||{}).map(([k,v])=>[k,deobf(v)]));
const saveSec=()=>LS.set(VAULT,Object.fromEntries(Object.entries(SEC).map(([k,v])=>[k,obf(v)])));
function seed(){const t='2026-10-01T09:00:00.000Z';return{
  mcp:{mcpServers:{'memory':{command:'npx',args:['-y',pinned(ADVC('memory'))]},'thoi-tiet':{url:'https://mcp.example.vn/weather'}}},
  meta:{v:1,connectors:{},servers:{'memory':{catalogId:'memory',approvedAt:t,alwaysOn:false},'thoi-tiet':{catalogId:null,approvedAt:t,alwaysOn:false,sampleDesc:'Xem thời tiết theo thành phố.'}}},
  model:'q4',warnSig:null,master:true,lang:'vi',tpl:'general',userTpls:[],hintDismissed:false}}
let DB=LS.get(KEY,null)||seed();const save=()=>LS.set(KEY,DB);
LANG=DB.lang;
const RT={inst:{},state:{},err:{},logs:{},listed:{},used:{},writeOk:{},testT:{},chat:[],restarted:false};
let UI={sel:null,key:null,keyHl:null,keySaved:null,rename:null,warnOpen:false,excelPick:null,open:false,pane:'main',tab:'all',q:'',expanded:{},setup:{},plan:null,advMsg:null,ed:null,edScroll:0,flash:null,mpane:'list',menu:null,opener:null};
const servers=()=>DB.mcp.mcpServers;
const conn=id=>DB.meta.connectors[id];
const metaOf=k=>DB.meta.servers[k]||(DB.meta.servers[k]={catalogId:null,approvedAt:null,alwaysOn:false});
const keyOfCat=cid=>Object.keys(servers()).find(k=>(DB.meta.servers[k]||{}).catalogId===cid);
// v4.11 (quyết định 23/10 — quy tắc tên): tên Unicode (chữ Hán, emoji…) không gập được về a-z0-9 → thêm mã băm ngắn của cả tên, để hai tên khác nhau không bị coi là trùng
const nameHash=k=>{let h=5381;for(const c of String(k))h=((h*33)^c.codePointAt(0))>>>0;return h.toString(36).slice(0,6)};
// v4.12 (P411-4): tên trùng xét theo CẢ tên (sau khi bỏ khoảng trắng hai đầu, chuẩn NFC). safeName (mã nội bộ của công cụ) giờ là đơn ánh:
// tên thuần a-z0-9 nối bằng '-' và ≤ 24 ký tự giữ nguyên (đổi '-' thành '_'); mọi tên khác = 17 ký tự gập đầu + '_' + mã băm của cả tên → hai tên khác nhau không bao giờ “trùng sau chuẩn hoá”
const nameKey=k=>String(k??'').trim().normalize('NFC');
const safeName=k=>{const t=nameKey(k);if(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t)&&t.length<=24)return t.replace(/-/g,'_');const a=foldVi(t).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');return (a.slice(0,17).replace(/_$/,'')+'_'+nameHash(t)).replace(/^_/,'')};
// MỘT quy tắc tên cho Thêm, nhập và trình sửa: 1–64 ký tự (đếm theo ký tự Unicode), không có ký tự điều khiển
const nlen=k=>[...String(k)].length,cpSlice=(k,n)=>[...String(k)].slice(0,n).join('');
function nameErr(k){const kt=String(k??'').trim();if(nlen(kt)<1||nlen(kt)>64)return tr('Tên máy chủ phải từ 1 đến 64 ký tự.');if(/[\u0000-\u001f\u007f]/.test(kt))return tr('Tên máy chủ không được chứa ký tự điều khiển.');return ''}
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
// ===== v4.10 (P49-2): tìm khoá ở MỌI chỗ trong mcp.json, hỏi trước khi chuyển vào kho khoá, che khoá ở mọi nơi hiển thị =====
// v4.12 (P411-1/2/3): nhận diện khoá theo LUẬT, không theo danh sách tên. Tên (biến env, tiêu đề, cờ dòng lệnh, tham số URL, khoá JSON ở MỌI độ sâu)
// được tách đoạn theo camelCase / snake_case / kebab-case / dấu chấm (đã giải mã %xx). Tên là khoá khi có một đoạn là từ khoá
// (key, token, secret, pass, pwd, auth, bearer, jwt, session, dsn, credential, cookie, otp, pat…) hoặc đoạn ghép kết thúc bằng từ đó
// (refreshtoken, clientsecret, apikey, dbpassword…). Đoạn phủ định (file, path, len, max, sha, id…) cho biết tên chỉ MÔ TẢ khoá, không chứa khoá.
const NAME_SEG=new Set(['key','keys','token','tokens','secret','secrets','pass','password','passwords','passwd','passphrase','pwd','pw','auth','authorization','bearer','jwt','session','sessions','dsn','credential','credentials','cred','creds','cookie','cookies','otp','totp','hotp','pin','pat','apikey','appid','appsecret']);
const SEG_END=/(token|tokens|secret|secrets|password|passwd|passphrase|credentials?|cookie|cookies|bearer|apikey|session|jwt)$/;
const KEY_END=/^(api|access|secret|private|auth|client|master|encryption|enc|signing|sign|license|licence|app|session|ssh|gpg|pgp|deploy|admin|service|account|subscription|consumer|hmac|webhook|bot|sk)key$/;
const PASS_END=/^(db|my|sql|mysql|pg|postgres|redis|admin|root|user|app|smtp|mail|ftp|ssh|vnc|login|master|wifi|basic|key|store)(pass|pwd|pw)$/;
const NAME_NOT=new Set(['file','files','path','dir','type','length','len','size','count','limit','max','min','ttl','timeout','expiry','expires','url','uri','endpoint','header','prefix','name','format','layout','mode',
 'id','ids','sha','digest','hash','checksum','integrity','commit','rev','revision','version','enabled','enable','disabled','required','scheme','method','provider','env','var','policy','algorithm','alg','bits','hint','label','field','placeholder','public','pub','cache','cmd','command','helper','issuer','audience','scope','scopes','host','port','region','rotation','fingerprint']);
const HASH_SEG=new Set(['sha','digest','hash','checksum','integrity','commit','rev','revision','etag','fingerprint']); // v4.12: “id” không còn là tên băm (OWM_ID = 32 hex vẫn là khoá); KEY_ID=k-2026-10 không bị bắt vì giá trị thấp entropy
const pctDec=s=>String(s??'').replace(/(?:%[0-9A-Fa-f]{2})+/g,m=>{try{return decodeURIComponent(m)}catch(e){return m}});
const nameSegs=n=>pctDec(n).split(/[^A-Za-z0-9]+|(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/).filter(Boolean).map(x=>x.toLowerCase().replace(/\d+$/,'')).filter(Boolean);
const nameSegs2=n=>{const a=nameSegs(n),b=pctDec(n).toLowerCase().split(/[^a-z0-9]+/).map(x=>x.replace(/\d+$/,'')).filter(Boolean);return [...new Set([...a,...b])]}; // thêm cách tách chỉ theo dấu nối (tOkEn_2, APIKEY)
const segSecret=x=>NAME_SEG.has(x)||SEG_END.test(x)||KEY_END.test(x)||PASS_END.test(x);
function nameSecret(n){n=String(n??'').trim().replace(/^-+/,'');if(!n||/^(PWD|OLDPWD)$/.test(n))return false;const seg=nameSegs2(n);const hit=seg.filter(segSecret);if(!hit.length)return false;
 // “id” phủ định khoá/token (KEY_ID, TOKEN_ID) nhưng KHÔNG phủ định phiên/cookie (x-session-id, SESSION_ID là khoá phiên)
 const soft=hit.every(x=>/(session|sessions|cookie|cookies)$/.test(x));
 // “id” chỉ phủ định khi đứng SAU từ khoá (KEY_ID, tokenId); id_token / idToken (OIDC) vẫn là khoá
 const fi=seg.findIndex(segSecret);
 return !seg.some((x,i)=>NAME_NOT.has(x)&&!((x==='id'||x==='ids')&&(soft||i<fi)))}
const hashName=n=>nameSegs2(n).some(x=>HASH_SEG.has(x));
const SECRET_NAME={test:nameSecret};
// giá trị không bao giờ là khoá (--auth none, TOKEN=false, AUTH=oauth, ${VAR}, %VAR%, số ngắn…)
const NONVAL=/^(none|null|nil|undefined|false|true|off|on|no|yes|disabled|enabled|0|1|-|oauth|oauth2|basic|bearer|header|query|env|auto|default|required|optional|prompt|ask|keychain|vault|stdin)$/i;
const ENVREF=/^(\$\{?[A-Za-z_]\w*\}?|%[A-Za-z_]\w*%|\$env:[A-Za-z_]\w*)$/i;
const PATHV=/^(~|\.{0,2}\/|[A-Za-z]:\\)/;
const valOk=v=>{if(typeof v!=='string')return false;const t=v.trim();return !!t&&!/\$\{secret:[^}]+\}/.test(t)&&!t.includes('•')&&!NONVAL.test(t)&&!ENVREF.test(t)&&!/^\d{1,5}$/.test(t)};
const flagValOk=v=>valOk(v)&&!v.startsWith('-')&&!PATHV.test(v)&&!/^[a-z][a-z0-9+.-]*:\/\//i.test(v);
// v4.12 (P411-7): “không phải khoá” chỉ áp dụng cho ĐÚNG máy chủ + vị trí + chuỗi đó (chỉ lưu dấu băm); có nút đặt lại
const NK_KEY='aivn.notkey.v412';const hashStr=v=>{let h=2166136261;for(const c of String(v))h=Math.imul(h^c.codePointAt(0),16777619)>>>0;return h.toString(36)+':'+String(v).length};
const nkId=(name,path,val)=>hashStr(String(name)+'\u0001'+path.join('\u0001')+'\u0001'+val);
let NOTKEY=new Set();try{NOTKEY=new Set(JSON.parse(localStorage.getItem(NK_KEY)||'[]'))}catch(e){}
const nkSave=()=>{SCAN_MEMO.clear();try{localStorage.setItem(NK_KEY,JSON.stringify([...NOTKEY]))}catch(e){}};
function notKeyAdd(f){NOTKEY.add(nkId(f.name,f.path,f.val));nkSave()}
function notKeyReset(){NOTKEY.clear();nkSave()}
function nkResetUi(){const n=NOTKEY.size;notKeyReset();UI.advMsg=`<span class="msg-ok" data-testid="notkey-reset-done">${esc(tr('Đã đặt lại {0} mục. Lần lưu sau AIVN sẽ hỏi lại các chuỗi này.',n))}</span>`;render()}
// cờ ghi phiên bản/commit: giá trị hex sau --rev là sha git, không phải khoá (P410-5)
const REV_FLAG=/^--?(rev|revision|commit|sha|git-?sha|ref|hash|checkout|digest|integrity)$/i;
const KEY_PFX_RE='(?:sk-(?:proj-|live-|ant-)?|sk_live_|sk_test_|rk_live_|ghp_|gho_|ghu_|ghs_|ghr_|github_pat_|hf_|xox[abposr]-|xapp-|AIza|glpat-|AKIA|ya29\\.)';
const SECRET_VAL=new RegExp('^(Bearer\\s+\\S+|'+KEY_PFX_RE+'[A-Za-z0-9_\\-.]{6,})');
const isSecret=(n,v)=>typeof v==='string'&&v!==''&&!isRef(v)&&(SECRET_NAME.test(n)||/^(proxy-)?authorization$/i.test(n)||SECRET_VAL.test(v));
function secretNames(s){return [...Object.entries(s.env||{}),...Object.entries(s.headers||{})].filter(([n,v])=>isRef(v)||isSecret(n,v)).map(([n])=>n)}
const SECRET_FLAG={test:f=>typeof f==='string'&&(/^(-k|--key)$/i.test(f)||/^--?[A-Za-z][\w.-]*$/.test(f)&&nameSecret(f.replace(/^-+/,'')))};
// tham số URL không theo luật tên nhưng luôn là khoá (chữ ký URL, appid)
const SECRET_PARAM=/^(?:sig|signature|appid|app[-_]?id|x-amz-signature|x-amz-credential|x-amz-security-token|code_verifier)$/i;
const paramSecret=n=>{const d=pctDec(n);return nameSecret(d)||SECRET_PARAM.test(d)};
const isRef=v=>typeof v==='string'&&/^\$\{secret:[^}]+\}$/.test(v);
const hasRefIn=v=>typeof v==='string'&&/\$\{secret:[^}]+\}/.test(v);
const MYSQL_RE=/(?:^|[\s"'\/\\@_-])(?:mysql|mariadb|mysqldump|mysqladmin|mysqlsh|mysqlimport)(?:\.exe)?(?=[\s"',\]_=@.-]|$)/i;
function entropy(s){const f={};for(const c of s)f[c]=(f[c]||0)+1;let e=0;for(const k in f){const p=f[k]/s.length;e-=p*Math.log2(p)}return e}
// chuỗi "trông như khoá": tiền tố quen thuộc (chắc chắn) hoặc chuỗi base64/hex dài ≥20 ký tự, ngẫu nhiên (có thể)
function highEntropy(t){if(t.length<20||t.length>512)return false;
 if(/^[0-9a-f]+$/i.test(t))return /\d/.test(t)&&/[a-f]/i.test(t)&&entropy(t)>=3;
 if(!/^[A-Za-z0-9+\/_\-]+={0,2}$/.test(t))return false;
 const seg=t.split(/[-_]/).reduce((a,b)=>b.length>a.length?b:a,'');if(seg.length<16)return false;
 if(!/\d/.test(seg)||!/[A-Za-z]/.test(seg))return false;
 if(!(/[a-z]/.test(seg)&&/[A-Z]/.test(seg))&&t.length<32)return false;
 return entropy(t)>=3.5}
// v4.12 (P411-10): nhớ kết quả theo chuỗi — trình sửa 3000 máy chủ chỉ quét lại phần đã đổi
const KL_MEMO=new Map();
function keyLikeIn(str,ctx){if(typeof str!=='string'||!str)return [];const mk=(ctx&&ctx.hash?'h':'')+(ctx&&ctx.my?'m':'')+'\u0001'+str;const c=KL_MEMO.get(mk);if(c)return c.map(o=>({...o}));
 const r=keyLikeIn0(str,ctx||{});if(KL_MEMO.size>40000)KL_MEMO.clear();KL_MEMO.set(mk,r);return r.map(o=>({...o}))}
function keyLikeIn0(str,ctx){const out=[];const s=str.replace(/\$\{secret:[^}]+\}/g,m=>' '.repeat(m.length));
 const put=(a,b,sure,x)=>{if(b>a&&!out.some(o=>a<o.b&&b>o.a))out.push({a,b,sure,...(x||{})})};
 // v4.11 (P410-4): JWT là MỘT khoá (không tách 3 ref)
 let m;const jw=/(?<![A-Za-z0-9_\-])eyJ[A-Za-z0-9_\-]{6,}\.[A-Za-z0-9_\-]{6,}\.[A-Za-z0-9_\-]{6,}/g;while((m=jw.exec(s)))put(m.index,m.index+m[0].length,true);
 const re=new RegExp('(?<![A-Za-z0-9])'+KEY_PFX_RE+'[A-Za-z0-9_\\-.]{8,}','g');
 while((m=re.exec(s)))put(m.index,m.index+m[0].length,true);
 // v4.12 (P411-2): userinfo của URL — user:mật-khẩu@, :mật-khẩu@ (user trống) và token@ (không có ':')
 const ui=/([a-z][a-z0-9+.-]*):\/\/([^\s\/?#@"'<>]*)@/gi;
 while((m=ui.exec(s))){const info=m[2],base=m.index+m[1].length+3,c=info.indexOf(':');
  if(c>=0){const pw=info.slice(c+1);if(valOk(pctDec(pw)))put(base+c+1,base+info.length,true,{n:'url-pass'})}
  else if(valOk(info)&&(new RegExp('^'+KEY_PFX_RE).test(info)||highEntropy(info)||info.length>=16&&/\d/.test(info)&&/[A-Za-z]/.test(info)||
   /^(https?|wss?)$/i.test(m[1])&&pctDec(info).length>=6&&!/^(git|user|users|admin|root|anonymous|guest|ubuntu|ec2-user|postgres|deploy|test|demo|public)$/i.test(pctDec(info))))put(base,base+info.length,true,{n:'url-token'})}
 // v4.12: webhook Slack/Discord — phần cuối đường dẫn là khoá
 const wh=/hooks\.slack\.com\/(?:services|workflows|triggers)\/(?:[A-Za-z0-9]+\/){1,3}([A-Za-z0-9_-]{6,})|discord(?:app)?\.com\/api\/webhooks\/\d+\/([A-Za-z0-9_-]{6,})/gi;
 while((m=wh.exec(s))){const v=m[1]||m[2],a=m.index+m[0].length-v.length;put(a,a+v.length,true,{n:'webhook'})}
 // Bearer/Basic …
 const bre=/\b(?:Bearer|Basic)\s+([A-Za-z0-9._~+\/\-=]{8,})/gi;while((m=bre.exec(s))){if(m[1].includes('•'))continue;const a=m.index+m[0].length-m[1].length;put(a,a+m[1].length,true,{n:'bearer'})}
 // v4.12 (P411-1/2/3): MỘT luật gán “tên = giá trị” / “tên: giá trị” cho mọi chuỗi — env trong args (docker -e A=b, --env=A=b, "OPENAI_API_KEY=sk…"),
 // lệnh "A=b prog", chuỗi kết nối ADO/ODBC (Password=…;), tiêu đề "X-Api-Key: …", tham số truy vấn/fragment (?api%5Fkey=, #access_token=), nhật ký lỗi
 const as=/(?<![\w.%-])(-{0,2})([A-Za-z_%][\w.%-]*)(["']?)[ \t]*([=:])[ \t]*(?!\/\/)(["']?)([^\s"'`,;&#<>\[\]{}()|]+)/g;
 while((m=as.exec(s))){const n=m[2],v=m[6],a=m.index+m[0].length-v.length,url=/[?&#;]$/.test(s.slice(Math.max(0,m.index-1),m.index));
  const okName=paramSecret(n),vv=pctDec(v);
  // dạng "tên: giá trị" trong văn bản thường: chỉ nhận giá trị trông như khoá (không phải một từ chữ thường)
  const colonOk=m[4]==='='||m[3]||m[5]||!/^[a-z]+$/.test(v)||v.length>=12;
  if(okName&&colonOk&&v!=='$'&&valOk(vv)&&!PATHV.test(v)){put(a,a+v.length,true,{n:pctDec(n)});as.lastIndex=a+v.length;continue}
  // giá trị đã mã hoá %xx dưới tên thường: giải mã rồi xét như khoá
  if(url&&v.includes('%')&&(new RegExp('^'+KEY_PFX_RE).test(vv)||highEntropy(vv)))put(a,a+v.length,false,{n:pctDec(n)});
  as.lastIndex=a}
 // v4.12 (P411-1): cờ tách rời: --x-token v, -k v, "--api-key", "v"; cờ tách đôi --api key v; mysql -p v / -pV
 const T=[];const tk0=/[^\s"',\[\]]+/g;while((m=tk0.exec(s)))T.push([m.index,m[0]]);
 const my=ctx.my||MYSQL_RE.test(s);
 for(let i=0;i<T.length;i++){const [p,t]=T[i],nx=T[i+1],n2=T[i+2];
  if(/^--?[A-Za-z][\w.-]*$/.test(t)){
   if(nx&&SECRET_FLAG.test(t)&&flagValOk(nx[1])){put(nx[0],nx[0]+nx[1].length,true,{n:t.replace(/^-+/,'')});continue}
   if(nx&&n2&&/^[A-Za-z]+$/.test(nx[1])&&NAME_SEG.has(nx[1].toLowerCase())&&!SECRET_FLAG.test(t)&&nameSecret(t.replace(/^-+/,'')+'-'+nx[1])&&flagValOk(n2[1])){put(n2[0],n2[0]+n2[1].length,true,{n:t.replace(/^-+/,'')+'-'+nx[1]});continue}
   if(my&&t==='-p'&&nx&&flagValOk(nx[1])){put(nx[0],nx[0]+nx[1].length,true,{n:'mysql-p'});continue}}
  if(my&&/^-p[^-]/.test(t)&&valOk(t.slice(2)))put(p+2,p+t.length,true,{n:'mysql-p'})}
 // v4.12 (P411-8): digest/SRI (sha256:…, sha512-…) không bao giờ là khoá
 const skip=[];const sri=/(?:sha(?:1|224|256|384|512)|md5)[-:][A-Za-z0-9+\/=_\-]{16,}/gi;while((m=sri.exec(s)))skip.push([m.index,m.index+m[0].length]);
 const inSkip=(a,b)=>skip.some(([x,y])=>a<y&&b>x);
 if(!ctx.hash){
 // v4.11 (P410-2): secret AWS 40 ký tự (có / hoặc +) — "có thể"; scanServer nâng thành "chắc" khi máy chủ có AKIA…
 const aw=/(?<![A-Za-z0-9+\/=])[A-Za-z0-9+\/]{30,60}(?![A-Za-z0-9+\/=])/g;while((m=aw.exec(s))){const t=m[0];if(inSkip(m.index,m.index+t.length))continue;if(/[\/+]/.test(t)&&/[A-Z]/.test(t)&&/[a-z]/.test(t)&&/\d/.test(t)&&!/^\//.test(t)&&!/\/$/.test(t)&&!/\/\//.test(t)&&!t.split('/').some(x=>/^[a-z]{1,12}$/.test(x))&&entropy(t)>=4)put(m.index,m.index+t.length,false,{aws:true})}
 const tk=/[A-Za-z0-9+\/_\-]{20,}={0,2}/g;
 while((m=tk.exec(s))){const a=m.index,b=a+m[0].length;if(out.some(o=>a<o.b&&b>o.a)||inSkip(a,b))continue;
  for(const part of m[0].split('/')){/* đường dẫn a/b/c không phải khoá: xét từng đoạn */const pa=a+m[0].indexOf(part),pb=pa+part.length;
   // v4.11 (P410-5): digest sha256:…, tên tệp (…Q4KM2025.gguf) và sha git sau --rev không phải khoá
   if(/(?:sha(?:1|224|256|384|512)|md5)[:-]$/i.test(s.slice(Math.max(0,pa-8),pa)))continue;
   if(/^\.[A-Za-z][A-Za-z0-9]{0,5}(?![A-Za-z0-9])/.test(s.slice(pb,pb+8)))continue;
   if(/^[0-9a-f]{7,64}$/i.test(part)&&/--?(?:rev|revision|commit|sha|git-?sha|ref|hash|checkout)(?:=|["',\s]+)$/i.test(s.slice(Math.max(0,pa-24),pa)))continue;
   // v4.12 (P411-8): giá trị gán cho tên kiểu băm/mã (GIT_SHA=…, KEY_ID=…, "digest": …) không phải khoá
   const asg=/([A-Za-z_][\w.-]*)["']?[ \t]*[=:][ \t]*["']?$/.exec(s.slice(Math.max(0,pa-48),pa));if(asg&&hashName(asg[1])&&!nameSecret(asg[1]))continue;
   if(highEntropy(part)&&!out.some(o=>pa<o.b&&pb>o.a))out.push({a:pa,b:pb,sure:false})}}}
 return out.map(o=>({...o,text:str.slice(o.a,o.b)}))}
const PFX_ONLY=new RegExp('^'+KEY_PFX_RE);
function maskVal(v){v=String(v??'');let pre='';const b=/^(Bearer\s+|Basic\s+|token\s+)/i.exec(v);if(b){pre=b[1];v=v.slice(pre.length)}
 const p=PFX_ONLY.exec(v);const head=p?p[0]:'';const rest=v.slice(head.length);
 // v4.11 (P410-3): hiện vài ký tự đầu để người dùng biết đang xét chuỗi nào (hf_Qa••••, Tr••••); 4 ký tự cuối chỉ khi chuỗi đủ dài
 const k=rest.length>=8?2:rest.length>=6?1:0;return pre+head+rest.slice(0,k)+'••••'+(rest.length>=20?rest.slice(-4):'')}
const getAt=(s,p)=>p.reduce((o,k)=>o==null?o:o[k],s);
function setAt(s,p,v){const o=getAt(s,p.slice(0,-1));if(o)o[p[p.length-1]]=v}
// Quét MỘT máy chủ → danh sách phát hiện {name,path,mode,val,sure,label,loc}; nhớ theo (tên, nội dung) cho trình sửa lớn (P411-10)
const SCAN_MEMO=new Map();let HLV=new Set();
function scanServer(name,s){if(!s||typeof s!=='object')return [];let j;try{j=JSON.stringify(s)}catch(e){j=null}
 const mk=j==null?null:String(name)+'\u0001'+j;if(mk&&SCAN_MEMO.has(mk))return SCAN_MEMO.get(mk).map(f=>({...f,path:[...f.path]}));
 const F=scanServer0(name,s);if(mk){if(SCAN_MEMO.size>12000)SCAN_MEMO.clear();SCAN_MEMO.set(mk,F.map(f=>({...f,path:[...f.path]})))}return F}
function scanServer0(name,s){const F=[];const seen=new Set();
 const add=o=>{const id=o.path.join('\u0001')+'|'+o.val;if(seen.has(id)||!o.val||NOTKEY.has(nkId(name,o.path,o.val)))return;seen.add(id);F.push({name,...o,masked:maskVal(o.val)})};
 const parts=(path,str,label,loc,ctx)=>{const hs=keyLikeIn(str,ctx);
  hs.forEach(h=>{if(F.some(o=>o.path.join('\u0001')===path.join('\u0001')&&o.val.includes(h.text)))return;const whole=h.a===0&&h.b===str.length||/^Bearer\s+$/i.test(str.slice(0,h.a))&&h.b===str.length;
   add({path,mode:whole?'whole':'part',val:whole?str:h.text,sure:h.sure||/^Bearer\s+$/i.test(str.slice(0,h.a)),label:h.n||label,loc:h.n&&h.n!==label?loc+' › '+h.n:loc})})};
 const my=MYSQL_RE.test([s.command,...(Array.isArray(s.args)?s.args:[])].filter(x=>typeof x==='string').join(' '));
 for(const f of ['env','headers'])if(s[f]&&typeof s[f]==='object'&&!Array.isArray(s[f]))for(const [n,v] of Object.entries(s[f])){
  if(typeof v!=='string'||!v||isRef(v))continue;
  const byName=(nameSecret(n)||(f==='headers'&&/^(proxy-)?authorization$/i.test(n))||/^Bearer\s+\S/i.test(v))&&valOk(v)&&!(PATHV.test(v)&&!/\s/.test(v));
  if(byName&&!hasRefIn(v))add({path:[f,n],mode:'whole',val:v,sure:true,label:n,loc:f+' › '+n});else parts([f,n],v,n,f+' › '+n,{hash:hashName(n)&&!nameSecret(n),my})}
 if(s.auth&&typeof s.auth==='object')for(const [n,v] of Object.entries(s.auth)){if(typeof v!=='string'||!v||isRef(v))continue;
  if(nameSecret(n)&&valOk(v)&&!hasRefIn(v))add({path:['auth',n],mode:'whole',val:v,sure:true,label:n,loc:'auth › '+n});else parts(['auth',n],v,n,'auth › '+n)}
 if(Array.isArray(s.args)){const A=s.args;A.forEach((a,i)=>{if(typeof a!=='string'||!a||isRef(a))return;const prev=A[i-1],pp=A[i-2];
  // --cờ=giá-trị
  const eq=/^(--?[A-Za-z][\w.-]*)=([\s\S]+)$/.exec(a);
  if(eq&&SECRET_FLAG.test(eq[1])&&flagValOk(eq[2])&&!hasRefIn(eq[2])){add({path:['args',i],mode:'tail',pre:eq[1]+'=',val:eq[2],sure:true,label:eq[1].replace(/^-+/,''),loc:'args › '+eq[1]+'='});return}
  // TÊN=giá-trị (docker -e, --env TÊN=…, --env=TÊN=…, "OPENAI_API_KEY=sk-…")
  const nv=/^(?:--?[A-Za-z][\w-]*=)?([A-Za-z_][\w.-]*)=([\s\S]+)$/.exec(a);
  if(nv&&nameSecret(nv[1])&&valOk(nv[2])&&!PATHV.test(nv[2])&&!hasRefIn(nv[2])){add({path:['args',i],mode:'tail',pre:a.slice(0,a.length-nv[2].length),val:nv[2],sure:true,label:nv[1],loc:'args › '+nv[1]+'='});return}
  if(typeof prev==='string'){
   if(REV_FLAG.test(prev)&&/^[0-9a-f]{7,64}$/i.test(a))return;
   if(/^--?[A-Za-z][\w.-]*$/.test(prev)&&SECRET_FLAG.test(prev)&&(flagValOk(a)||/^-[^-\s]{5,}$/.test(a)&&valOk(a))&&!hasRefIn(a)){add({path:['args',i],mode:'whole',val:a,sure:true,label:prev.replace(/^-+/,''),loc:'args › '+prev});return}
   if(my&&prev==='-p'&&flagValOk(a)&&!hasRefIn(a)){add({path:['args',i],mode:'whole',val:a,sure:true,label:'mysql-p',loc:'args › -p'});return}
   // cờ tách đôi: --api key GIÁ-TRỊ
   if(typeof pp==='string'&&/^--?[A-Za-z][\w-]*$/.test(pp)&&/^[A-Za-z]+$/.test(prev)&&NAME_SEG.has(prev.toLowerCase())&&!SECRET_FLAG.test(pp)&&nameSecret(pp.replace(/^-+/,'')+'-'+prev)&&flagValOk(a)&&!hasRefIn(a)){
    add({path:['args',i],mode:'whole',val:a,sure:true,label:pp.replace(/^-+/,'')+'-'+prev,loc:'args › '+pp+' '+prev});return}}
  if(my&&/^-p[^-]/.test(a)&&valOk(a.slice(2))&&!hasRefIn(a)){add({path:['args',i],mode:'tail',pre:'-p',val:a.slice(2),sure:true,label:'mysql-p',loc:'args › -p'});return}
  parts(['args',i],a,'arg'+i,'args['+i+']',{my})})}
 // v4.12 (P411-2): URL — xét MỌI phần (userinfo, truy vấn, fragment, %xx) bằng cùng luật
 if(typeof s.url==='string'&&s.url)parts(['url'],s.url,'url','url');
 // mọi chuỗi khác (command, cwd, khoá lạ, đối tượng lồng nhau ở mọi độ sâu) — tên theo cùng luật (P411-3: refreshToken, clientSecret…)
 const walk=(o,path)=>{if(typeof o==='string'){if(isRef(o)||!o)return;const kn=[...path].reverse().find(x=>typeof x==='string'&&!/^\d+$/.test(x));
   if(kn&&path.length>1&&nameSecret(kn)&&valOk(o)&&!PATHV.test(o)&&!hasRefIn(o)){add({path,mode:'whole',val:o,sure:true,label:kn,loc:path.join(' › ')});return}
   parts(path,o,kn||path.join('.'),path.join(' › '),{hash:!!kn&&hashName(kn)&&!nameSecret(kn),my});return}
  if(o&&typeof o==='object')for(const [k,v] of Object.entries(o))walk(v,[...path,k])};
 // v4.11 (P410-2): cùng máy chủ có AKIA… → chuỗi 40 ký tự kiểu secret AWS là "chắc chắn"
 const akia=()=>/(?<![A-Z0-9])A[KS]IA[0-9A-Z]{12,}/.test(JSON.stringify(s));
 for(const [k,v] of Object.entries(s))if(!['env','headers','auth','args','url'].includes(k))walk(v,[k]);
 for(const f of ['env','headers','auth'])if(s[f]&&typeof s[f]==='object')for(const [k,v] of Object.entries(s[f]))if(v&&typeof v==='object')walk(v,[f,k]);
 if(F.some(f=>!f.sure&&/^[A-Za-z0-9+\/]{30,60}$/.test(f.val))&&akia())F.forEach(f=>{if(/^[A-Za-z0-9+\/]{30,60}$/.test(f.val)&&/[\/+]/.test(f.val))f.sure=true});
 return F}
// chỗ giữ trong mcp.json: ${secret:<tên>} (một khoá) hoặc ${secret:<tên>:<nhãn>} (nhiều khoá)
const refBase=k=>String(k).replace(/[{}:$\s]/g,'_');
const refLabel=l=>String(l).replace(/[{}:$\s]/g,'_').slice(0,40)||'key';
function refFor(k,n,s){const b='${secret:'+refBase(k)+'}';const self=[s.env,s.headers,s.auth].some(o=>o&&typeof o==='object'&&o[n]===b);
 return !self&&JSON.stringify(s).includes(JSON.stringify(b).slice(1,-1))?'${secret:'+refBase(k)+':'+refLabel(n)+'}':b}
// thay giá trị bằng chỗ giữ: chỉ thay đúng phần khoá (sau '=', trong URL, trong lệnh…)
function applyFinding(s,f,ref){const cur=getAt(s,f.path);if(typeof cur!=='string')return;
 if(f.mode==='whole')setAt(s,f.path,ref);
 else if((f.mode==='tail'||f.mode==='eq')&&cur.endsWith(f.val))setAt(s,f.path,cur.slice(0,cur.length-f.val.length)+ref);
 else setAt(s,f.path,cur.split(f.val).join(ref))}
function assignRefs(name,s,list){const base='${secret:'+refBase(name)+'}';const j=JSON.stringify(s);const used=new Set((j.match(/\$\{secret:[^}]+\}/g)||[]));
 const single=list.length===1&&!used.has(base);
 return list.map(f=>{let r=single?base:'${secret:'+refBase(name)+':'+refLabel(f.label)+'}',i=2;while(used.has(r))r=r.replace(/(-\d+)?\}$/,'-'+(i++)+'}');used.add(r);return r})}
// biến env/headers tên giống khoá mà để trống → chỗ giữ (không có khoá nào bị chuyển)
function placeholderEmpty(key,s){for(const f of ['env','headers'])if(s[f]&&typeof s[f]==='object')for(const [k,v] of Object.entries(s[f]))if(v===''&&SECRET_NAME.test(k))s[f][k]=refFor(key,k,s)}
const allRefs=s=>[...new Set((JSON.stringify(s||{}).match(/\$\{secret:[^}]+\}/g)||[]))];
const keyVarsOf=s=>['env','headers'].flatMap(f=>Object.entries(s[f]||{}).filter(([n,v])=>isRef(v)||(typeof v==='string'&&SECRET_NAME.test(n))).map(([n,v])=>[f,n,v]));
const hasKey=v=>isRef(v)&&!!SEC[v];
// che khoá: giá trị trong kho + CÙNG luật với scanServer (tên theo luật, URL mọi phần, cờ, gán TÊN=giá-trị) cho nhật ký, stderr, Chi tiết, diff, thông báo
function redactText(t){let x=String(t??'');for(const v of Object.values(SEC)){if(typeof v!=='string')continue;for(const p of [v,v.replace(/^Bearer\s+/i,'')])if(p.length>=4)x=x.split(p).join(maskVal(p))}
 x=x.replace(/((?:^|[\s"'\[,])(--?[A-Za-z][\w.-]*)(?![\w.-])(?:"?\s*,\s*"?|"?\s+"?))(?!\$\{secret|--)([^\s"',\]]+)/g,(m,a,f,v)=>!SECRET_FLAG.test(f)||!(flagValOk(v)||/^-[^-\s]{5,}$/.test(v)&&valOk(v))?m:a+maskVal(v));
 if(MYSQL_RE.test(x)){x=x.replace(/((?:^|[\s"'\[,])-p(?:"?\s*,\s*"?|"?\s+"?))(?!-|\$\{secret)([^\s"',\]]+)/g,(m,a,v)=>flagValOk(v)?a+maskVal(v):m);
  x=x.replace(/((?:^|[\s"'\[,])-p)([^\s"',\]\-•][^\s"',\]]*)/g,(m,a,v)=>valOk(v)&&!v.includes('••••')?a+maskVal(v):m)}
 x=x.replace(/("([^"\\]+)"\s*:\s*")(?!\$\{secret)([^"]+)"/g,(m,a,n,v)=>!nameSecret(n)||!valOk(v)?m:a+maskVal(v)+'"');
 x=x.replace(/(:\/\/:?[^\/\s:@"']*:)([^@\s\/"']+)@/g,(m,a,v)=>a+(v.includes('••••')?v:'••••')+'@');
 x=x.replace(/(Bearer\s+)(?![^\s"']*••••)[^\s"']+/gi,(m,a,v)=>a+maskVal(m.slice(a.length)));
 for(const h of keyLikeIn(x).sort((p,q)=>q.a-p.a))x=x.slice(0,h.a)+maskVal(h.text)+x.slice(h.b);
 return x}
function maskServer(name,s){const c=JSON.parse(JSON.stringify(s||{}));for(const f of scanServer(name,c)){const cur=getAt(c,f.path);if(typeof cur!=='string')continue;
  setAt(c,f.path,f.mode==='whole'?maskVal(f.val):cur.split(f.val).join(maskVal(f.val)))}return c}
function redact(s){const m=maskServer('',s);if(m.url)return redactText(m.url);return redactText([m.command,...(m.args||[])].join(' '))}
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
function validateServer(k,s){{const ne=nameErr(k);if(ne)return ne}
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
 setTimeout(()=>{if(!servers()[k]||RT.state[k]!=='starting')return;const ef=()=>validateServer(k,s)||(s.auth?oauthMsg(k):null);const e=ef();
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
 if(bk)return{code:'keybad',var:bk[1],sec:2,exit:1,err:'EXIT_1',stderr:`Error: 401 Unauthorized: invalid ${bk[1]} "${maskVal(SEC[bk[2]])}"\n    at checkKey (file:///…/index.js:30:9)`};
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
async function runTests(keys){const rs=await Promise.all(keys.map(runTest));const ok=rs.filter(r=>r&&r.ok).length,bad=rs.filter(r=>r&&!r.ok).length;if(ok+bad)toastT(()=>tr('Chạy thử xong: {0} được, {1} lỗi.',ok,bad))}
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
 ks.forEach(x=>log(x,`install: ${P.name} ready`));toastT(()=>tr('Đã cài {0}. Đang chạy thử lại…',P.name));render();runTests(ks)}
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
 // v4.8: máy chủ tự thêm chưa có khoá → không có ô khoá lớn, chỉ một liên kết nhỏ; ô khoá tô sáng chỉ khi chạy thử báo thiếu/sai khoá (nút Nhập khoá)
 if(user&&!vs.length&&!K&&UI.keySaved!==k)return `<a href="#" class="addkey" data-testid="key-add-${tk}" onclick="keyAdd('${tk}');return false">＋ ${tr('Thêm khoá (nếu cần)')}</a>`;
 const row=([f,n,v])=>{const ed=K&&!K.add&&K.n===n,tn=esc(n);
  return `<div class="krow" data-testid="key-row-${tk}-${tn}"><span class="kl">🔑 ${tr('Khoá truy cập')} <code>${tn}</code>${optTag(k,n)}</span>${ed?keyInput(k,K):hasKey(v)?`<span class="kok" data-testid="key-saved-${tk}">🔒 ${tr('Đã lưu')} <span aria-hidden="true">••••••••</span></span><span style="flex:1"></span><button class="btn sm ghost" data-testid="key-change-${tk}" onclick="keyEdit('${tk}','${tn}')">${tr('Thay khoá')}</button><button class="btn sm ghost" data-testid="key-del-${tk}" onclick="keyDel('${tk}','${tn}')">${tr('Xoá khoá')}</button>`:`<span class="kmiss" data-testid="key-missing-${tk}">${tr('Chưa có khoá')}</span><span style="flex:1"></span><button class="btn sm pri" data-testid="key-enter-${tk}" onclick="keyEdit('${tk}','${tn}')">${tr('Nhập khoá')}</button>`}</div>`};
 const ph=(vs.find(([f,n,v])=>isRef(v))||[])[2]||refFor(k,'KEY',s);
 const miss=vs.some(([f,n,v])=>!hasKey(v)&&!optTag(k,n)); // v4.9 (P48-7): đã có ô khoá (thiếu hay đã lưu) thì ẩn “＋ Thêm khoá”; thêm khoá phụ qua menu ⋯
 const add=!user||K&&!K.add||((miss||vs.length)&&!(K&&K.add))?'':K&&K.add?`<div class="krow" data-testid="key-add-row-${tk}"><span class="kl">🔑 ${tr('Tên khoá')}</span><input class="inp kname" id="key-name" data-testid="key-name-${tk}" maxlength="64" autocomplete="off" spellcheck="false" placeholder="API_KEY" value="${esc(K.name)}" oninput="UI.key.name=this.value" onkeydown="event.stopPropagation();if(event.key==='Escape')keyCancel()"></div><div class="krow"><span class="kl">${tr('Khoá')}</span>${keyInput(k,K)}</div>`:`<div><a href="#" class="addkey" data-testid="key-add-${tk}" onclick="keyAdd('${tk}');return false">＋ ${tr('Thêm khoá (nếu cần)')}</a></div>`;
 return `<div class="keybox ${UI.keyHl===k?'hl':''}" id="keybox-${tk}" data-testid="key-box-${tk}" onclick="event.stopPropagation()">${vs.map(row).join('')}${add}${K&&K.err?`<div class="msg-bad small" data-testid="key-err">${esc(K.err)}</div>`:''}
  <div class="small muted knote">🔒 ${tr('Lưu an toàn trên máy, không ghi vào mcp.json.')} ${tr('Trong mcp.json chỉ có chỗ giữ {0}.',`<code>${esc(ph)}</code>`)}</div>${UI.keySaved===k?`<div class="msg-ok small ksaved" data-testid="key-saved-msg-${tk}">✓ ${tr('Đã lưu khoá.')} <button class="btn sm pri" data-testid="key-retest-${tk}" ${!DB.master||st(k)==='testing'?'disabled':''} onclick="UI.keySaved=null;connectKey('${tk}',{retest:true})">${tr('Chạy thử lại')}</button></div>`:''}</div>`}
function keyInput(k,K){const tk=esc(k);return `<span class="kin"><input class="inp" id="key-in" data-testid="key-input-${tk}" type="${K.show?'text':'password'}" autocomplete="off" spellcheck="false" aria-label="${tr('Khoá truy cập')}" placeholder="${tr('Dán khoá vào đây')}" value="" oninput="UI.key.v=this.value" onkeydown="event.stopPropagation();if(event.key==='Enter')keySave();if(event.key==='Escape')keyCancel()">
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
 UI.mpane='detail';if(!inList(k)){UI.q='';UI.tab='all'}openCA({sel:k});setTimeout(()=>{const b=$('keybox-'+k);b&&b.scrollIntoView({block:'center'});const i=$(n?'key-in':'key-name');i&&i.focus()},30)}
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
 return `<span class="rn" onclick="event.stopPropagation()"><input class="inp" id="rn-in" data-testid="rename-input-${esc(k)}" value="${esc(r.v)}" aria-label="${tr('Tên hiển thị')}" oninput="UI.rename.v=this.value;UI.rename.pos=this.selectionStart" onkeydown="event.stopPropagation();if(event.key==='Enter')renameSave();if(event.key==='Escape')renameCancel()">
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
 apLeft=600;drawCard();el.scrollTop=0;{const a=document.activeElement;if(!a||a===document.body||a.closest('#caBack:not(.open)')){el.tabIndex=-1;el.focus({preventScroll:true})}}apTimer=setInterval(()=>{apLeft--;if(apLeft<=0){apAnswer(false,{timeout:true});return}const t=$('apT');if(t)t.textContent=fmtLeft()},1000)}
function apAnswer(ok,extra={}){if(!apCur)return;const always=!!($('apAlways')&&$('apAlways').checked);const c=apCur;apCur=null;c.res({ok,always,...extra});nextCard()}
function apReason(){$('apR').innerHTML=`<div class="row" style="margin-top:8px"><input class="inp" id="apRs" placeholder="${tr('Lý do…')}"><button class="btn sm" onclick="apAnswer(false,{reason:$('apRs').value})">${tr('Gửi')}</button></div>`;$('apRs').focus()}
// v4.9 (P48-5): đóng hộp thoại khi hiện thẻ nhưng không trả focus; mở lại thì focus về đúng nút đã bấm (theo id / data-testid)
async function withCard(specFn){const was=UI.open,fk=was?focusKeyOf(document.activeElement):null;UI.menu=null;closeCA(false);const a=await askApproval(specFn);
 if(was){openCA({reopen:true,noFocus:true});const e=fk&&document.querySelector('#caModal '+fk);(e&&!e.disabled&&e.offsetParent!==null?e:document.querySelector('#caList .li.cur .li-main'))?.focus()}return a}
function focusKeyOf(el){if(!el||el===document.body||!el.getAttribute)return null;if(el.id)return'#'+CSS.escape(el.id);const t=el.getAttribute('data-testid');return t?`[data-testid="${CSS.escape(t)}"]`:null}
function toastT(f){toast(f());const t=document.querySelector('.toast');if(t)t._f=f} // v4.9 (P48-8): đổi ngôn ngữ thì dịch lại thông báo đang hiện
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
 const cnt=lvlCount(id),LS2=[tr('không hỏi'),tr('hỏi bạn trước'),tr('hỏi bạn mỗi lần')]; // v4.9 (P48-6): chỉ liệt kê mức có việc, khớp bảng bên phải
 fields.push([tr('Quyền'),LEVELS.map(([l,h],j)=>cnt[j]?tr('{0}: {1} việc ({2})',tr(h),cnt[j],LS2[j]):'').filter(Boolean).join(' · ')]);
 const lines=id==='biz'?[tr('Dữ liệu nằm trên máy này (crm.db).')]:[tr('Chỉ trong thư mục này.'),tr('Không cần cài Microsoft Excel.')];
 lines.push(tr('Kết nối được giữ khi bạn mở lại AIVN.'));
 return{tool:'connector_connect',logoHtml:storeLogo(a,30),title:tr('Cho phép kết nối “{0}”?',n),sub:n,fields,lines,extraHtml:id==='excel'?excelFolderHtml('card'):'',
  warn:id==='biz'?tr('AIVN Kinh doanh đọc và sửa dữ liệu kinh doanh trên máy này. Xoá, huỷ và ghi nhận thanh toán vẫn hỏi bạn từng lần.'):tr('Ghi tệp Excel trong thư mục này. Ghi đè vẫn hỏi bạn trước.'),
  details:[],danger:false,alwaysLabel:null}}}
// ===== v4.10 (P49-2): thẻ xin phép chuyển khoá — liệt kê từng khoá (đã che) kèm vị trí, chọn từng mục; không bao giờ chuyển âm thầm =====
let SCARD=null;
function secretCardSpec(){return()=>{const S=SCARD;if(!S)return{title:'',lines:[]};const its=S.items,nSrv=new Set(its.map(f=>f.name)).size,sel=S.ch.filter(Boolean).length;
 const rows=its.map((f,i)=>{const on=S.ch[i];const note=on?'':tr('Không chuyển → giữ nguyên chuỗi này (bạn xác nhận đây không phải khoá).');
  return `<label class="skrow ${on?'':'off'}" data-testid="secret-item-${i}"><input type="checkbox" id="sk${i}" ${on?'checked':''} onchange="skToggle(${i},this.checked)"><span class="skm"><code class="skv" data-testid="secret-masked">${esc(f.masked)}</code><span class="sktag ${f.sure?'sure':''}">${f.sure?tr('khoá'):tr('có thể là khoá')}</span><span class="skl">${esc(f.name)} › ${esc(f.loc)}</span>${note?`<span class="sknote">${esc(note)}</span><span class="skwarn" role="note" data-testid="secret-plain-warn-${i}">⚠ ${esc(tr('Giá trị này sẽ được lưu trong mcp.json dưới dạng chữ thường (không che).'))}</span>`:''}</span></label>`}).join('');
 return{tool:'secret_move',logoHtml:emojiTile('🔑',30),title:tr('Chuyển {0} khoá vào kho khoá an toàn?',sel),sub:S.ctx+' · '+tr('{0} máy chủ',nSrv)+' · '+tr('Bước {0}/{1}',1,2),
  extraHtml:`<div class="sklist" data-testid="secret-card-list">${rows}</div><div class="small muted" style="margin:4px 0 6px">${tr('Đã chọn {0}/{1}. Bỏ chọn một mục nếu đó không phải khoá.',sel,its.length)} ${tr('Bỏ chọn chỉ ảnh hưởng dòng đó: các khoá và máy chủ khác vẫn được lưu.')}</div>`,
  lines:[tr('Cho phép: chuyển các khoá đã chọn vào kho khoá; mcp.json chỉ giữ {0}.','${secret:…}'),tr('Từ chối: máy chủ có khoá sẽ không được lưu. Không khoá nào được ghi dạng chữ.'),tr('Sau thẻ này là thẻ lưu (bước 2/2).')],
  warn:tr('Bản mẫu: kho khoá chỉ là mô phỏng (đã làm rối, không ghi dạng chữ). Ứng dụng thật dùng kho khoá của hệ điều hành.'),details:[],danger:false,alwaysLabel:null}}}
function skToggle(i,v){if(!SCARD)return;SCARD.ch[i]=v;if(apCur)drawCard();const e=$('sk'+i);e&&e.focus()}
// trả về {ok, blocked:[tên không được lưu], moves:[[ref, khoá]] (chỉ ghi vào kho sau khi thẻ lưu được cho phép), count}
async function secretGate(map,ctx){const items=[];for(const [k,s] of Object.entries(map))items.push(...scanServer(k,s));
 if(!items.length)return{ok:true,blocked:[],moves:[],count:0,items,plain:[]};
 SCARD={items,ch:items.map(()=>true),ctx};const a=await withCard(secretCardSpec());const ch=SCARD?SCARD.ch:items.map(()=>false);SCARD=null;
 const blocked=new Set();if(!a.ok){items.forEach(f=>blocked.add(f.name));return{ok:false,blocked:[...blocked],moves:[],count:0,items,plain:[]}}
 // v4.11 (P410-3): bỏ chọn một dòng = “không phải khoá” → giữ nguyên chuỗi đó, KHÔNG huỷ cả lần lưu; nhớ lựa chọn để lần sau không hỏi lại
 const plain=items.filter((f,i)=>!ch[i]);plain.forEach(notKeyAdd);
 const moves=[];for(const [k,s] of Object.entries(map)){if(blocked.has(k))continue;const L=items.filter((f,i)=>f.name===k&&ch[i]);if(!L.length)continue;
  const refs=assignRefs(k,s,L);L.forEach((f,i)=>{moves.push([refs[i],f.val]);applyFinding(s,f,refs[i])})}
 return{ok:true,blocked:[...blocked],moves,count:moves.length,items,plain}}
const commitMoves=m=>{for(const [r,v] of m)SEC[r]=v;saveSec()};
const blockMsg=b=>tr('Chưa lưu “{0}”: tệp còn khoá viết thẳng mà bạn chưa cho chuyển vào kho khoá. AIVN không bao giờ lưu khoá dạng chữ. Hãy làm lại và chọn Cho phép, hoặc xoá khoá khỏi tệp rồi nhập ở mục Khoá truy cập.',b.join(', '));
// v4.10 (P49-10): thẻ liệt kê tối đa 12 mục, phần còn lại gộp thành một dòng
const capList=(arr,n=12)=>arr.length>n?[...arr.slice(0,n),['…',tr('+{0} máy chủ nữa',arr.length-n)]]:arr;
// v4.10: diff ngắn (thêm/bớt/đổi dòng) cho thẻ lưu mcp.json — khoá luôn bị che
function lineDiff(a,b){const A=a.split('\n'),B=b.split('\n');let p=0;while(p<A.length&&p<B.length&&A[p]===B[p])p++;let s=0;while(s<A.length-p&&s<B.length-p&&A[A.length-1-s]===B[B.length-1-s])s++;
 const a1=A.slice(p,A.length-s),b1=B.slice(p,B.length-s),out=[];
 if(a1.length*b1.length>4e6){a1.forEach(l=>out.push(['-',l]));b1.forEach(l=>out.push(['+',l]));return{ops:out,at:p}}
 const n=a1.length,m=b1.length,T=Array.from({length:n+1},()=>new Uint32Array(m+1));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)T[i][j]=a1[i]===b1[j]?T[i+1][j+1]+1:Math.max(T[i+1][j],T[i][j+1]);
 let i=0,j=0;while(i<n||j<m){if(i<n&&j<m&&a1[i]===b1[j]){out.push(['=',a1[i]]);i++;j++}else if(j<m&&(i>=n||T[i][j+1]>=T[i+1][j])){out.push(['+',b1[j]]);j++}else{out.push(['-',a1[i]]);i++}}
 return{ops:out,at:p}}
function diffHtml(a,b,max=16,plain){const {ops}=lineDiff(a,b);const PV=(plain||[]).map(f=>f.val).filter(Boolean);const ch=[];let k=0;
 while(k<ops.length){if(ops[k][0]==='='){k++;continue}let d=[],ad=[];while(k<ops.length&&ops[k][0]==='-')d.push(ops[k++][1]);while(k<ops.length&&ops[k][0]==='+')ad.push(ops[k++][1]);
  const pr=Math.min(d.length,ad.length);for(let x=0;x<pr;x++){ch.push(['~-',d[x]]);ch.push(['~+',ad[x]])}d.slice(pr).forEach(l=>ch.push(['-',l]));ad.slice(pr).forEach(l=>ch.push(['+',l]))}
 const nA=ch.filter(c=>c[0]==='+').length,nR=ch.filter(c=>c[0]==='-').length,nC=ch.filter(c=>c[0]==='~+').length;
 const rows=ch.slice(0,max).map(([t,l])=>`<div class="df ${t==='+'?'add':t==='-'?'rm':t==='~+'?'chg add':'chg rm'}"><span class="dfm" aria-hidden="true">${t.endsWith('+')?'+':'−'}</span><code>${esc(redactText(l).trim()||' ')}</code>${t.endsWith('+')&&PV.some(v=>l.includes(v)||l.includes(JSON.stringify(v).slice(1,-1)))?`<span class="dfplain" data-testid="diff-plain">⚠ ${esc(tr('lưu dạng chữ thường (bạn đã bỏ chọn)'))}</span>`:''}</div>`).join('');
 return `<div class="dfbox" data-testid="save-diff"><div class="dfh">${tr('Thay đổi: thêm {0} dòng · bớt {1} dòng · sửa {2} dòng',nA,nR,nC)}</div>${rows}${ch.length>max?`<div class="df more">${tr('+{0} dòng nữa',ch.length-max)}</div>`:''}</div>`}
function mcpSpec(k,s,{folder,autostartOnly,noToken,title,test}={}){return()=>{const sn=[...new Set([...secretNames(s),...allRefs(s).filter(r=>!Object.values({...(s.env||{}),...(s.headers||{})}).some(v=>String(v).includes(r))).map(r=>r.slice(9,-1))])],net=s.url?netKind(s.url):null,m=DB.meta.servers[k]||{},c=m.catalogId?ADVC(m.catalogId):catalogMatch(s);
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
 toastT(()=>tr('(bản mẫu) Đã mở lại AIVN. Kết nối vẫn còn. Ứng dụng chỉ chạy khi AIVN AGENT dùng lần đầu, trừ mục “Luôn chạy sẵn”.'));startAll(true)}
function newKeyFor(cid){if(!servers()[cid])return cid;let i=2;while(servers()[cid+'-'+i])i++;return cid+'-'+i}
async function connectCatalog(cid){if(!DB.master)return;const c=ADVC(cid);let k=keyOfCat(cid);
 if(k)return connectKey(k);
 let folder=null,token=null;
 if(c.needs==='folder'){folder=await pickFolder(['D:\\DuAn\\AIVN','C:\\Users\\Khoi\\Documents','C:\\Users\\Khoi\\Desktop\\Bai tap']);if(!folder)return}
 if(c.needs==='secret'){const s0=UI.setup[cid];if(!s0){UI.setup[cid]={v:'',show:false};render();setTimeout(()=>{const i=$('sec-'+cid);i&&i.focus()},0);return}
  token=(s0.v||'').trim();if(!token&&!c.optional){$('sec-'+cid).focus();return}}
 k=newKeyFor(cid);
 const s=c.url?{url:c.url,timeout:120000}:c.image?{command:'docker',args:['run','-i','--rm','-e',c.secretVar,c.image]}:{command:'npx',args:['-y',pinned(c),...(folder?[folder]:[])]};
 let ref=null;if(token){ref=refFor(k,c.secretVar,s);if(c.url)s.headers={[c.secretVar]:ref};else s.env={[c.secretVar]:ref}} // v4.10: khoá vào kho chỉ sau khi được cho phép
 const a=await withCard(mcpSpec(k,s,{folder,noToken:c.optional&&!token,title:()=>tr(c.name),test:true}));
 delete UI.setup[cid];if(!a.ok){render();return}
 if(ref)SEC[ref]=token;servers()[k]=s;DB.meta.servers[k]={catalogId:cid,approvedAt:now(),alwaysOn:false};saveSec();save();runTest(k)}
// quyết định lượt 4 (b): chạy thử chỉ khi nhập, thêm ở Nâng cao, bấm “Chạy thử lại”, hoặc kết nối lại một mục đang Lỗi.
// Mục đã chạy thử được: kết nối / kết nối lại không chạy thử (nhanh). Mục chưa từng chạy thử (vd. dữ liệu mẫu có sẵn) thì chạy thử một lần.
async function connectKey(k,o={}){if(!DB.master)return;const s=servers()[k],m=metaOf(k);if(s.auth){start(k);return}
 const need=!!o.retest||RT.state[k]==='error'||!(m.test&&m.test.ok);
 if(!m.approvedAt){const a=await withCard(mcpSpec(k,s,{test:need}));if(!a.ok){render();return}m.approvedAt=now()}
 delete s.disabled;save();
 if(need)return runTest(k);
 stop(k);delete RT.err[k];RT.state[k]='waiting';log(k,'connect: test passed before, no test run');log(k,'lazy: waiting for first use');save();render();
 toastT(()=>tr('Đã kết nối “{0}”. Lần trước chạy thử đã được nên không chạy thử lại.',displayName(k)))}
function disconnectKey(k){if(k[0]==='@')return disconnectStore(k.slice(1));servers()[k].disabled=true;stop(k);save();render()}
async function removeKey(k){const ok=await modalAsk(tr('Gỡ máy chủ “{0}”?',displayName(k)),tr('Công cụ của máy chủ này sẽ biến mất. Các mục “Luôn cho phép” của nó cũng bị xoá. Khoá bí mật của máy chủ này bị xoá khỏi máy.'),tr('Gỡ'));
 if(!ok)return;stop(k);allRefs(servers()[k]).forEach(v=>delete SEC[v]);saveSec();delete servers()[k];delete DB.meta.servers[k];delete RT.state[k];delete UI.expanded[k];if(UI.rename&&UI.rename.k===k)UI.rename=null;save();render()}
async function toggleAlways(k,on){ // “Luôn chạy sẵn” — mặc định tắt (thay cho tự chạy khi mở AIVN)
const m=metaOf(k);if(!on){m.alwaysOn=false;save();return render()}
 const a=await withCard(mcpSpec(k,servers()[k],{autostartOnly:true}));if(a.ok){m.alwaysOn=true;if(!m.approvedAt)m.approvedAt=now();save()}render()}
// ===== v4.7 (lượt 5): hai cột — bên trái danh sách gọn (logo, tên, một dòng, chấm trạng thái), bên phải bảng chi tiết của mục đang chọn =====
// Mỗi bảng chi tiết có MỘT nút chính lớn theo trạng thái; việc phụ là nút nhỏ; chữ kỹ thuật nằm trong “Chi tiết” (đóng sẵn).
function openCA(o={}){const was=UI.open;if(!was&&!o.reopen)UI.opener=focusKeyOf(document.activeElement);
 UI.open=true;if(o.pane==='adv')UI.tab='adv';else if(o.pane==='main'&&UI.tab==='adv')UI.tab='all';if(o.tab)UI.tab=o.tab;if(o.sel)UI.sel=o.sel;
 if(o.scrollTo){const k=o.scrollTo;UI.q='';UI.sel=k;if(!inList(k))UI.tab='all';UI.flash=k;UI.mpane='detail'}else if(o.sel)UI.mpane='detail';else if(!was&&!o.reopen)UI.mpane='list';
 $('caBack').classList.add('open');render();
 setTimeout(()=>{const e=document.querySelector('#caList .li.cur');e&&e.scrollIntoView({block:'nearest'});if(o.noFocus||UI.key)return;
  if(!o.scrollTo&&!o.sel){$('caQ')&&$('caQ').focus();return}
  const b=narrow()&&UI.mpane==='detail'?document.querySelector('#caPanel [data-testid="ca-primary"]:not([disabled])')||document.querySelector('#caPanel .mback'):document.querySelector('#caList .li.cur .li-main');b&&b.focus({preventScroll:true})},0)}
// v4.9 (P48-5b): đóng thì trả focus về nút đã mở hộp thoại (mặc định nút Kết nối ứng dụng)
function closeCA(restore=true){UI.open=false;UI.menu=null;$('caBack').classList.remove('open');if(restore){const e=(UI.opener&&document.querySelector(UI.opener))||$('caBtn');UI.opener=null;e&&e.focus()}}
const narrow=()=>matchMedia('(max-width:767px)').matches;
function mBack(){UI.mpane='list';UI.menu=null;renderCA();setTimeout(()=>{const e=document.querySelector('#caList .li.cur .li-main');e&&(e.focus(),e.scrollIntoView({block:'nearest'}))},0)}
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
 if(sel==='x:import'||sel==='x:json'||sel==='x:add')return{t:sel.slice(2)};
 if(servers()[sel]){const m=DB.meta.servers[sel]||{};return{t:'srv',k:sel,c:m.catalogId?ADVC(m.catalogId):null}}
 return null}
const selKey=sel=>{const i=selInfo(sel);return i?(i.k||sel):null};
function stateOf(i){return i.t==='store'?storeState(i.a):i.t==='cat'?(UI.setup[i.c.id]?'needs-setup':'available'):i.t==='srv'?(instOf(i.k)?'installing':st(i.k)):null}
const itemName=i=>i.t==='store'?tr(i.a.name):i.t==='cat'?tr(i.c.name):i.t==='srv'?displayName(i.k):i.t==='import'?tr('Nhập mcp.json'):i.t==='add'?tr('Thêm máy chủ'):'mcp.json';
const emojiTile=(e,sz)=>`<span class="lt" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz*.42)}px">${e}</span>`;
const itemLogo=(i,sz)=>i.t==='store'?storeLogo(i.a,sz):i.t==='cat'?catLogo(i.c,sz):i.t==='srv'?srvLogo(i.k,sz):emojiTile(i.t==='import'?'📂':i.t==='add'?'＋':'{ }',sz);
// v4.11 (ý quản lý): nói rõ KIỂU đăng nhập chưa hỗ trợ và cách xử lý (gỡ máy chủ hoặc chờ bản sau)
const AUTH_LBL={oauth:'OAuth',oauth2:'OAuth 2.0',oidc:'OpenID Connect',saml:'SAML',sso:'SSO',device:'OAuth (device code)'};
function authLabel(s){const t=s&&s.auth&&typeof s.auth==='object'&&typeof s.auth.type==='string'?s.auth.type.trim():'';return t?AUTH_LBL[t.toLowerCase()]||t:'OAuth'}
function oauthMsg(k,s0){const s=s0||servers()[k]||(UI.plan&&UI.plan.oauthSkipped||[]).map(x=>x.name===k&&x.server).find(Boolean);
 return tr('Máy chủ “{0}” cần đăng nhập kiểu {1}. AIVN chưa hỗ trợ kiểu đăng nhập này. Cách xử lý: gỡ máy chủ này, hoặc chờ bản AIVN sau.',k,authLabel(s))}
function errShort(k){const t=(DB.meta.servers[k]||{}).test;if(t&&t.ok===false)return testMsg(t);const s=servers()[k];return s&&s.auth?tr('AIVN chưa hỗ trợ đăng nhập kiểu {0}.',authLabel(s)):tr('Không kết nối được.')}
const progText=p=>{const I=RT.inst[p];return I.phase==='dl'?tr('Đang tải {0}… {1}%',PROGS[p].name,I.pct):tr('Đang cài {0}… {1}%',PROGS[p].name,I.pct)};
// v4.8: mô tả theo công dụng (mẫu: sampleDesc; khác: đoán theo lệnh/tên); mục tự thêm có nhãn nhỏ “Tự thêm”
const GUESS_DESC={brave:'Tìm trên mạng bằng Brave.',sqlite:'Đọc tệp cơ sở dữ liệu SQLite.',github:'Xem và quản lý kho mã trên GitHub.',notion:'Đọc và ghi trang Notion.',slack:'Đọc và gửi tin trong Slack.',huggingface:'Tìm mô hình và bộ dữ liệu trên Hugging Face.',fetch:'Đọc nội dung trang web.',thinking:'Suy nghĩ từng bước (qua mạng).'};
// v4.10: chữ ngắn cho dòng danh sách (không bị cắt ở 1024/1280/390); câu đủ ở title + bảng chi tiết (full=true)
const GUESS_SHORT={sqlite:'Đọc tệp SQLite.',github:'Kho mã trên GitHub.',slack:'Đọc và gửi tin Slack.',huggingface:'Mô hình trên Hugging Face.',fetch:'Đọc trang web.'};
const srvDesc=(k,c,full)=>{const m=DB.meta.servers[k]||{};if(c)return tr(c.short);if(m.sampleDesc)return tr(m.sampleDesc);const gk=srvGuess(k),g=(!full&&GUESS_SHORT[gk])||GUESS_DESC[gk];return g?tr(g):full?tr('Chưa có mô tả. Mở Chi tiết để xem lệnh.'):tr('Chưa có mô tả.')};
const selfTag=k=>isUserSrv(k)?`<span class="selftag" data-testid="self-tag-${esc(k)}" role="img" aria-label="${esc(tr('Tự thêm'))}" title="${esc(tr('Tự thêm'))}"><span class="stx" aria-hidden="true">${tr('Tự thêm')}</span><span class="sti" aria-hidden="true">✎</span></span>`:'';
function itemLine(i,s){ // [lớp, chữ ngắn, chữ đầy đủ cho title]
 if(i.t==='srv'){const p=instOf(i.k);if(p)return['busy',progText(p)];if(s==='testing')return['busy',tr('Đang chạy thử… {0}/{1} giây',RT.testT[i.k]||0,TEST_LIMIT)];
  if(s==='error')return['bad',tr('Lỗi'),errShort(i.k)];return['',srvDesc(i.k,i.c),i.c?tr(i.c.long||i.c.short):srvDesc(i.k,null,true)]} // v4.8: dòng lỗi chỉ ghi “Lỗi”; câu lỗi ở bảng phải (v4.9: và trong title)
 if(i.t==='store')return['',tr(i.a.short||i.a.desc),tr(i.a.desc)]; // v4.9 (P48-10): chữ ngắn trên dòng, đủ ý trong title
 if(i.t==='cat')return['',tr(i.c.short),tr(i.c.long||i.c.short)];
 return['',i.t==='import'?tr('Từ LM Studio, Claude Desktop…'):i.t==='add'?tr('Lệnh hoặc URL máy chủ MCP.'):tr('Sửa tay tệp cấu hình.'),i.t==='import'?tr('Mang ứng dụng từ LM Studio, Claude Desktop… sang AIVN.'):i.t==='add'?tr('Nhập lệnh hoặc địa chỉ của máy chủ MCP.'):tr('Sửa tay tệp cấu hình.')]} // v4.10: chữ ngắn để không bị cắt ở 1024/1280; câu đủ ở title
// ===== v4.9 (lượt 7): mỗi dòng = nút mở (logo + chấm trạng thái ở góc, tên, một dòng) + công tắc bật/tắt (role=switch) + nút ⋯ (menu việc phụ) =====
const tidOf=(i,sel)=>i.t==='store'?'app-'+i.a.id:i.t==='cat'?'cat-'+i.c.id:i.t==='srv'?i.k:sel.replace(':','-');
function rowSwitch(i,s){if(i.t==='import'||i.t==='json'||i.t==='add'||(i.t==='store'&&!i.a.ready))return null;
 const busy=['starting','testing','installing'].includes(s),on=busy||s==='on'||s==='waiting';
 if(i.t==='srv'&&servers()[i.k].auth)return{on:false,dis:true,auth:true,title:tr('Không bật được: AIVN chưa hỗ trợ đăng nhập kiểu {0}. Gỡ máy chủ này hoặc chờ bản sau.',authLabel(servers()[i.k]))};
 if(busy)return{on,dis:true,busy:true,title:tr(PILL[s])};
 if(i.t==='srv'&&s==='error')return DB.master?{on:true,err:true,dis:false,title:tr('Đang lỗi, bấm để thử lại')}:{on:true,err:true,dis:true,title:MASTER_HINT()}; // v4.10 (P49-7)
 if(!DB.master&&i.t!=='store'&&!on)return{on,dis:true,title:MASTER_HINT()};
 return{on,dis:false,title:on?tr('Đang bật. Bấm để ngắt kết nối.'):tr('Đang tắt. Bấm để kết nối.')}}
function rowHtml(sel){const i=selInfo(sel);if(!i)return'';const s=stateOf(i),[c,l,full]=itemLine(i,s),cur=!!UI.sel&&selKey(UI.sel)===selKey(sel),tid=esc(tidOf(i,sel)),nm=itemName(i),es=esc(sel),ti=cur?0:-1;
 const sw=rowSwitch(i,s),mi=menuItems(sel,'row').length>1,mo=!!(UI.menu&&UI.menu.sel===sel&&UI.menu.where==='row');
 const swh=sw?`<button class="swt ${sw.on?'on':''} ${sw.busy?'busy':''} ${sw.err?'err':''}" role="switch" aria-checked="${sw.err?'mixed':sw.on}" aria-label="${esc(tr('Bật/tắt kết nối: {0}',nm))}" title="${esc(sw.title)}" data-testid="toggle-${tid}" tabindex="${ti}" ${sw.dis?'aria-disabled="true"':''} ${sw.auth?`aria-describedby="swd-${tid}"`:''} onclick="event.stopPropagation();toggleRow('${es}')"><i></i></button>${sw.auth?`<span id="swd-${tid}" class="sr-only">${esc(sw.title)}</span>`:''}`:`<span class="swt-ph"></span>`;
 const mh=mi?`<button class="kebab" aria-haspopup="menu" aria-expanded="${mo}" aria-label="${esc(tr('Thao tác khác: {0}',nm))}" title="${esc(tr('Thao tác khác'))}" data-testid="menu-btn-${tid}" tabindex="${ti}" onclick="event.stopPropagation();openMenu('${es}','row')">⋯</button>`:`<span class="kebab-ph"></span>`;
 return `<div class="li ${cur?'cur':''} ${UI.flash&&UI.flash===selKey(sel)?'flash':''}" role="listitem" data-testid="ca-row-${tid}" data-sel="${es}" onclick="selectItem(this.dataset.sel)">`+
  `<button class="li-main" data-testid="ca-open-${tid}" tabindex="${ti}" aria-current="${cur}" onclick="event.stopPropagation();selectItem('${es}',{kbd:event.detail===0})"><span class="lgw">${itemLogo(i,36)}${s?sdot(s):''}</span><span class="lm"><span class="ln" title="${esc(nm)}">${esc(nm)}${i.t==='srv'?selfTag(i.k):''}</span><span class="ls ${c}" title="${esc(full||l)}">${esc(l)}</span></span></button>${swh}${mh}</div>`}
function toggleRow(sel){const i=selInfo(sel);if(!i)return;const sw=rowSwitch(i,stateOf(i));if(sw&&sw.dis&&sw.auth){toastT(()=>{const j=selInfo(sel);return j?rowSwitch(j,stateOf(j)).title:''});return}/* v4.11: chạm công tắc xám → hiện lời giải thích (thay cho tooltip trên màn chạm) */if(!sw||sw.dis)return;UI.menu=null;
 if(i.t==='store')return sw.on?disconnectStore(i.a.id):connectStore(i.a.id);
 if(i.t==='cat'){if(i.c.needs==='secret'){UI.sel=sel;UI.mpane='detail'}return connectCatalog(i.c.id)}
 if(i.t==='srv')return sw.err?connectKey(i.k,{retest:true}):sw.on?disconnectKey(i.k):connectKey(i.k)}
// nút chính của bảng phải theo trạng thái (dùng chung cho bảng và menu ⋯)
function srvPrim(k){const s=servers()[k],t=(DB.meta.servers[k]||{}).test,p=instOf(k),s0=p?'installing':st(k);
 if(p)return'installing';if(s0==='testing'||s0==='starting')return s0;if(s.auth)return'remove';
 if(s0==='error'&&t&&t.ok===false){if(t.code==='key'||t.code==='keybad')return'key';if(t.code==='notfound'){const pg=progOf(t.cmd);if(pg&&PROGS[pg].auto)return'install';if(pg)return'guide'}return'retest'}
 if(s0==='error')return'retry';if(s0==='on'||s0==='waiting')return'disconnect';return'connect'}
const keyMissing=k=>keyVarsUI(k).some(([f,n,v])=>!hasKey(v)&&!optTag(k,n));
// menu ⋯: việc phụ theo trạng thái. where='row' thêm “Mở chi tiết” và “Xem chi tiết kỹ thuật”.
function menuItems(sel,where){const i=selInfo(sel);if(!i)return[];const R=[],tid=esc(tidOf(i,sel)),es=esc(sel),add=(id,label,act,o={})=>R.push({id,label,act,...o});
 if(where==='row'&&i.t!=='import'&&i.t!=='json')add('menu-open-'+tid,'↗ '+tr('Mở chi tiết'),`selectItem('${es}',{kbd:true})`);
 if(i.t==='store'&&conn(i.a.id))add('ca-remove','🗑 '+tr('Gỡ'),`removeStore('${i.a.id}')`,{danger:true});
 if(i.t==='cat'&&where==='row')add('menu-tech-'+tid,'ⓘ '+tr('Xem chi tiết kỹ thuật'),`showTech('${es}','cat:${i.c.id}')`);
 if(i.t==='srv'){const k=i.k,tk=esc(k),s=servers()[k],p=instOf(k),s0=p?'installing':st(k),busy=['testing','starting','installing'].includes(s0),dm=!DB.master,pr=srvPrim(k);
  if(!s.auth){
   if(s0==='on'||s0==='waiting')add('reconnect-'+tk,'↻ '+tr('Kết nối lại'),`connectKey('${tk}')`,{dis:dm});
   if((s0==='on'||s0==='waiting')||(s0==='error'&&pr!=='retest'&&pr!=='retry'))add('retest-'+tk,'▶ '+tr('Chạy thử lại'),`connectKey('${tk}',{retest:true})`,{dis:dm||busy});
   if(pr==='install'){const t=(DB.meta.servers[k]||{}).test,PG=PROGS[progOf(t.cmd)];add('install-guide','📖 '+tr('Hướng dẫn cài')+' ↗',`window.open('${PG.url}','_blank','noopener')`)}}
  if(isUserSrv(k))add('rename-'+tk,'✎ '+tr('Đổi tên hiển thị'),`menuRename('${tk}')`);
  if(isUserSrv(k)&&!s.auth&&!keyMissing(k))add('menu-addkey-'+tk,'🔑 '+tr('Thêm khoá'),`menuAddKey('${tk}')`);
  if(where==='row')add('menu-tech-'+tid,'ⓘ '+tr('Xem chi tiết kỹ thuật'),`showTech('${es}','t:${tk}')`);
  if(!s.auth)add('ca-remove','🗑 '+tr('Gỡ'),`removeKey('${tk}')`,{danger:true,dis:busy})}
 return R}
function menuBtn(sel){if(!menuItems(sel,'panel').length)return'';const o=!!(UI.menu&&UI.menu.where==='panel');
 return `<button class="kebab pk" data-testid="ca-more" aria-haspopup="menu" aria-expanded="${o}" aria-label="${esc(tr('Thao tác khác'))}" title="${esc(tr('Thao tác khác'))}" onclick="openMenu('${esc(sel)}','panel')">⋯</button>`}
function menuHtml(){if(!UI.menu)return'';const its=menuItems(UI.menu.sel,UI.menu.where);if(!its.length){UI.menu=null;return''}let sep=false;
 return `<div class="camenu" id="caMenu" role="menu" aria-label="${esc(tr('Thao tác khác'))}" data-testid="ca-menu">${its.map(x=>{const h=(x.danger&&!sep&&(sep=true))?'<div class="msep" role="separator"></div>':'';return h+`<button role="menuitem" tabindex="-1" class="${x.danger?'danger':''}" data-testid="${x.id}" ${x.dis?'disabled':''} onclick="closeMenu(false);${x.act}">${esc(x.label)}</button>`}).join('')}</div>`}
const menuTrigger=()=>!UI.menu?null:UI.menu.where==='panel'?document.querySelector('#caPanel .kebab.pk'):document.querySelector(`#caList .li[data-sel="${CSS.escape(UI.menu.sel)}"] .kebab`);
function openMenu(sel,where){if(UI.menu&&UI.menu.sel===sel&&UI.menu.where===where)return closeMenu(true);UI.menu={sel,where,focusFirst:true};renderCA()}
function closeMenu(focusTrig){const t=menuTrigger();UI.menu=null;const m=$('caMenu');m&&m.remove();document.querySelectorAll('#caModal .kebab[aria-expanded="true"]').forEach(b=>b.setAttribute('aria-expanded','false'));if(focusTrig&&t)t.focus()}
function placeMenu(){const m=$('caMenu');if(!m)return;const t=menuTrigger();if(!t){m.remove();UI.menu=null;return}UI.menu.top=$('caList').scrollTop;const r=t.getBoundingClientRect(),mw=m.offsetWidth,mh=m.offsetHeight;
 const left=Math.max(8,Math.min(r.right-mw,innerWidth-mw-8));let top=r.bottom+4;if(top+mh>innerHeight-8)top=Math.max(8,r.top-mh-4);m.style.left=left+'px';m.style.top=top+'px'}
function menuKey(e){const its=[...$('caMenu').querySelectorAll('button:not([disabled])')],i=its.indexOf(document.activeElement);
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();e.stopPropagation();its[(i+(e.key==='ArrowDown'?1:-1)+its.length)%its.length]?.focus()}
 else if(e.key==='Home'||e.key==='End'){e.preventDefault();e.stopPropagation();(e.key==='Home'?its[0]:its[its.length-1])?.focus()}
 else if(e.key==='Escape'||e.key==='Tab'){e.preventDefault();e.stopPropagation();closeMenu(true)}}
function menuRename(k){UI.sel=k;UI.mpane='detail';renameStart(k)}
function menuAddKey(k){UI.sel=k;UI.mpane='detail';keyAdd(k)}
function showTech(sel,ek){UI.sel=sel;UI.mpane='detail';UI.expanded[ek]=true;render();setTimeout(()=>{const d=document.querySelector('#caPanel details.ptech');if(d){d.scrollIntoView({block:'start'});d.querySelector('summary').focus()}},0)}
// ↑/↓/Home/End đổi mục chọn trong danh sách; Enter mở chi tiết (nút chính bên phải; trên điện thoại sang màn chi tiết)
function listKey(e){const row=e.target.closest&&e.target.closest('#caList .li');if(!row)return;
 if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const rows=[...document.querySelectorAll('#caList .li')];let ix=rows.indexOf(row);
  ix=e.key==='Home'?0:e.key==='End'?rows.length-1:Math.max(0,Math.min(rows.length-1,ix+(e.key==='ArrowDown'?1:-1)));const sel=rows[ix].dataset.sel;
  UI.sel=sel;UI.menu=null;if(UI.key&&UI.key.k!==selKey(sel)){UI.key=null;UI.keyHl=null}if(UI.rename&&UI.rename.k!==selKey(sel))UI.rename=null;renderCA();
  const b=document.querySelector('#caList .li.cur .li-main');b&&(b.focus(),b.scrollIntoView({block:'nearest'}))}}
// v4.9 (P48-3/4): “Tất cả” = mục đã cài trước (thứ tự cố định) rồi cửa hàng; có chữ tìm thì tìm cả Nâng cao và tệp cấu hình
const installedKeys=()=>[...['biz','excel'].filter(id=>conn(id)).map(SKEY),...Object.keys(servers())];
function visSel(sel){const i=selInfo(sel);if(!i)return false;
 if(i.t==='store')return match(tr(i.a.name),i.a.name,tr(i.a.desc),i.a.desc,i.a.short?tr(i.a.short):'');
 if(i.t==='cat')return match(tr(i.c.name),i.c.name,tr(i.c.short),i.c.short);
 if(i.t==='srv'){const m=DB.meta.servers[i.k]||{};return match(displayName(i.k),i.k,srvDesc(i.k,i.c,true),m.sampleDesc||'',i.c?i.c.name+' '+i.c.short:'')}
 return match(itemName(i),i.t==='import'?'Nhập mcp.json import':i.t==='add'?'Thêm máy chủ add server':'mcp.json')}
function listSecs(){const q=!!UI.q.trim(),inst=installedKeys(),instSet=new Set(inst),f=a=>a.filter(visSel);
 if(UI.tab==='all'){const secs=[[tr('Đã cài'),f(inst),'ca-sec-installed'],...GROUPS.map(([g,l])=>[tr(l),f(STORE.filter(a=>a.group===g&&!instSet.has('@'+a.id)).map(a=>'@'+a.id)),'connect-apps-group-'+g])];
  if(q)secs.push([tr('Nâng cao'),f(ADV.filter(c=>!keyOfCat(c.id)).map(c=>'cat:'+c.id)),'ca-sec-adv'],[tr('Tệp cấu hình'),f(['x:add','x:import','x:json']),'ca-sec-files']);return secs}
 if(UI.tab==='installed')return[[null,f(inst),'ca-sec-installed']];
 if(UI.tab==='connected')return[[null,f(connectedKeys()),'ca-sec-connected']];
 if(UI.tab==='mine')return[[null,f(Object.keys(servers()).filter(isUserSrv)),'ca-sec-mine']];
 if(UI.tab==='adv')return[[tr('Có sẵn'),f(ADV.map(c=>'cat:'+c.id))],[tr('Bạn thêm'),f(Object.keys(servers()).filter(isUserSrv))],[tr('Tệp cấu hình'),f(['x:add','x:import','x:json'])]];
 return[[null,f(STORE.filter(a=>a.group===UI.tab).map(a=>'@'+a.id)),'connect-apps-group-'+UI.tab]]}
const inList=sel=>listSecs().flatMap(x=>x[1]).some(x=>selKey(x)===selKey(sel));
const fNote=()=>UI.tab==='installed'?tr('Đã cài: ứng dụng bạn đã kết nối hoặc đã thêm, kể cả khi đang tắt hoặc lỗi.'):UI.tab==='connected'?tr('Đã kết nối: đang bật và dùng được (chấm xanh lá).'):UI.tab==='mine'?tr('Của tôi: chỉ những ứng dụng bạn tự thêm (nhãn Tự thêm).'):'';
function listHtml(secs){const all=secs.flatMap(x=>x[1]),q=UI.q.trim();
 if(!all.length){if(!q&&GROUPS.some(g=>g[0]===UI.tab)&&!STORE.some(a=>a.group===UI.tab))return emptyGroup(UI.tab);
  if(q)return `<div class="empty" data-testid="ca-empty">${tr('Không thấy “{0}”.',esc(q))}${UI.tab!=='all'?`<div style="margin-top:8px"><a href="#" data-testid="ca-search-all" onclick="setTab('all');return false">${tr('Tìm trong Tất cả')}</a></div>`:''}<div style="margin-top:8px"><a href="#" data-testid="connect-apps-notfound-adv" onclick="setTab('adv');return false">${tr('Không thấy? Thêm máy chủ MCP ở Nâng cao')}</a></div></div>`;
  return `<div class="empty" data-testid="ca-empty">${UI.tab==='mine'?tr('Bạn chưa tự thêm ứng dụng nào.'):UI.tab==='installed'?tr('Chưa cài ứng dụng nào.'):tr('Chưa kết nối ứng dụng nào.')}</div>`}
 return secs.map(([h,arr,tid])=>arr.length?`<div class="lsec" ${tid?`data-testid="${tid}"`:''}>${h?`<div class="lgrp" ${tid==='ca-sec-installed'?`title="${esc(tr('Đã cài: ứng dụng bạn đã kết nối hoặc đã thêm, kể cả khi đang tắt hoặc lỗi.'))}"`:''}>${esc(h)}</div>`:''}${arr.map(rowHtml).join('')}</div>`:'').join('')}
function setTab(t){UI.tab=t;UI.mpane='list';UI.menu=null;render();setTimeout(()=>{const c=document.querySelector(`[data-testid="connect-apps-tab-${t==='connected'?'connected':t}"]`)||$('caQ');if(UI.open&&c&&document.activeElement&&(document.activeElement===document.body||!document.contains(document.activeElement)))c.focus()},0)}
function selectItem(sel,o={}){UI.sel=sel;UI.menu=null;UI.mpane='detail';if(!inList(sel)){UI.q='';if(!inList(sel)){const i=selInfo(sel);UI.tab=i&&(i.t==='cat'||i.t==='import'||i.t==='json'||i.t==='add')?'adv':'all'}}
 if(UI.key&&UI.key.k!==selKey(sel)){UI.key=null;UI.keyHl=null}
 if(UI.rename&&UI.rename.k!==selKey(sel))UI.rename=null;
 if(UI.open)render();else openCA({sel});
 if(o.kbd)setTimeout(()=>{const t=document.querySelector('#caPanel [data-testid="ca-primary"]:not([disabled])')||document.querySelector('#caPanel .detail button:not([disabled]),#caPanel .detail a[href],#caPanel textarea')||document.querySelector('#caPanel .mback');t&&t.focus()},0)
 else if(narrow())setTimeout(()=>{const b=document.querySelector('#caPanel .mback');b&&b.focus()},0)}
const legend=()=>`<div class="legend" data-testid="ca-legend">${[['on','Đã kết nối'],['available','Chưa kết nối'],['error','Lỗi'],['soon','Sắp có'],['testing','Đang chạy thử / đang cài']].map(([s,l])=>`<span>${sdot(s)} ${tr(l)}</span>`).join('')}</div>`;
const BIG=(cls,attrs,label)=>`<button class="btn big ${cls}" data-testid="ca-primary" ${attrs}>${label}</button>`;
const phead=(logo,name,s,sub)=>`<div class="ph">${logo}<div class="phm"><h3>${name}</h3>${sub||''}${s?pill2(s):''}</div></div>`;
const disM=()=>!DB.master?`disabled title="${esc(MASTER_HINT())}"`:'';
function panelHtml(){const i=selInfo(UI.sel);if(!i)return `<div class="pempty">${tr('Chọn một ứng dụng bên trái để xem chi tiết.')}</div>`;
 const mh=!DB.master&&i.t!=='import'&&i.t!=='json'&&i.t!=='add'&&!(i.t==='store'&&!i.a.ready)?`<div class="apwarn" data-testid="connect-apps-master-off" style="margin:0 0 16px">${MASTER_HINT()}</div>`:'';
 return `<button class="mback" data-testid="ca-back" onclick="mBack()">← ${tr('Quay lại')}</button>`+mh+(i.t==='store'?storePanel(i.a):i.t==='cat'?catPanel(i.c):i.t==='srv'?srvPanel(i.k):i.t==='import'?importPanel():i.t==='add'?addPanel():jsonPanel())}
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
  <div class="pact">${P}${menuBtn('@'+id)}${cn?`<span class="muted small">${tr('Làm được {0} việc',storeTools(id).length)}</span>`:''}</div>
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
  <span class="kin"><input class="inp" type="${S.show?'text':'password'}" id="sec-${c.id}" data-testid="setup-input-${c.id}" autocomplete="off" spellcheck="false" aria-label="${tr('Khoá truy cập')}" placeholder="${c.optional?'Bearer …':tr('Dán khoá vào đây')}" value="" oninput="UI.setup['${c.id}'].v=this.value" onkeydown="event.stopPropagation();if(event.key==='Enter')connectCatalog('${c.id}')">
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
// v4.9 (P48-11): bảng phải chỉ còn MỘT nút chính lớn + nút ⋯ (Kết nối lại, Chạy thử lại, Hướng dẫn cài, Đổi tên hiển thị, Thêm khoá, Gỡ)
function srvPanel(k){const s=servers()[k],m=DB.meta.servers[k]||{},c=m.catalogId?ADVC(m.catalogId):null,t=m.test,tk=esc(k),p=instOf(k),s0=p?'installing':st(k),pr=srvPrim(k);
 let P='';
 if(pr==='installing')P=BIG('','disabled data-act="installing"','⬇ '+tr('Đang cài…'));
 else if(pr==='testing')P=BIG('','disabled data-act="testing"',tr('Đang chạy thử…'));
 else if(pr==='starting')P=BIG('','disabled data-act="starting"',tr('Đang kết nối…'));
 else if(pr==='remove')P=BIG('',`data-act="remove" onclick="removeKey('${tk}')"`,tr('Gỡ'));
 else if(pr==='key')P=BIG('pri',`data-act="key" data-testid2="enter-key-${tk}" ${disM()} onclick="openKey('${tk}')"`,'🔑 '+tr('Nhập khoá'));
 else if(pr==='install'){const pg=progOf(t.cmd);P=BIG('pri',`data-act="install" data-testid2="install-${pg}-${tk}" ${disM()} onclick="installProg('${pg}','${tk}')"`,'⬇ '+tr('Cài giúp tôi'))}
 else if(pr==='guide')P=guideA(PROGS[progOf(t.cmd)],true);
 else if(pr==='retest')P=BIG('pri',`data-act="retest" ${disM()} onclick="connectKey('${tk}',{retest:true})"`,tr('Chạy thử lại'));
 else if(pr==='retry')P=BIG('pri',`data-act="retest" ${disM()} onclick="connectKey('${tk}',{retest:true})"`,tr('Thử lại'));
 else if(pr==='disconnect')P=BIG('',`data-act="disconnect" onclick="disconnectKey('${tk}')"`,tr('Ngắt kết nối'));
 else P=BIG('pri',`data-act="connect" ${disM()} onclick="connectKey('${tk}')"`,tr('Kết nối'));
 let stl='';
 if(p){const I=RT.inst[p];stl=`<div class="tst run" data-testid="install-progress-${tk}">⬇ ${progText(p)}<span class="bar"><i style="width:${I.pct}%"></i></span></div>`}
 else if(s0==='testing'){const n=RT.testT[k]||0;stl=`<div class="tst run" data-testid="test-${tk}">⏳ ${tr('Đang chạy thử… {0}/{1} giây',n,TEST_LIMIT)}<span class="bar"><i style="width:${Math.round(100*n/TEST_LIMIT)}%"></i></span></div>`}
 else if(s0==='error'){const fail=t&&t.ok===false;stl=`<div class="perr" data-testid="test-${tk}"><b>✕ ${esc(fail?testMsg(t):errShort(k))}</b><div class="fix">${esc(fail?testFix(t):s.auth?tr('Gỡ máy chủ này (nút Gỡ), hoặc chờ bản AIVN sau hỗ trợ {0}. Bạn cũng có thể hỏi người cung cấp xem có cách kết nối bằng khoá truy cập không.',authLabel(s)):tr('Bấm Thử lại. Nếu vẫn lỗi, mở Chi tiết để xem.'))}</div></div>`}
 else if(t&&t.ok){const pi=progOf(s.command),inst=pi&&DB.installed&&DB.installed[pi];stl=`<div class="tst ok" data-testid="test-${tk}">✓ ${tr('Chạy thử được · {0} chức năng',t.n)}</div>${inst?`<div class="tst ok small" data-testid="installed-${tk}">⬇ ${tr('Đã cài {0} cho AIVN',PROGS[pi].name)}</div>`:''}`}
 const kb=keyBox(k),ar=alwaysRow(k);
 const name=UI.rename&&UI.rename.k===k?nameOrEdit(k,'nm'):esc(displayName(k));
 return `<div class="detail" data-testid="connect-apps-card-${tk}">${phead(srvLogo(k,56),name+selfTag(k),s0,renameErr(k))}
  <div class="pact">${P}${menuBtn(k)}</div>${stl}
  <p class="pdesc">${esc(c?tr(c.long||c.desc):srvDesc(k,null,true))}</p>
  ${kb?kb.startsWith('<a ')?`<div class="psec">${kb}</div>`:`<div class="psec"><h5>${tr('Khoá truy cập')}</h5>${kb}</div>`:''}
  ${ar?`<div class="psec"><h5>${tr('Khi nào chạy')}</h5>${ar}</div>`:''}
  ${srvTech(k)}</div>`}
function importPanel(){return `<div class="detail" data-testid="ca-import">${phead(emojiTile('📂',56),tr('Nhập mcp.json'),null,`<div class="small muted" style="margin-top:4px">${tr('Mang ứng dụng từ LM Studio, Claude Desktop… sang AIVN.')}</div>`)}
 <div class="pact">${BIG('pri',`data-act="pick" onclick="$('fileIn').click()"`,'📂 '+tr('Chọn tệp mcp.json…'))}<button class="btn sm" data-testid="connect-apps-sample" onclick="UI.plan=makePlan(SAMPLE,SAMPLE_NAME);render()">${tr('(bản mẫu) Dùng tệp ví dụ')}</button><span style="flex:1"></span><button class="btn sm ghost" onclick="exportJson()">${tr('Xuất mcp.json…')}</button></div>
 <p class="pdesc">${tr('Mỗi mục mới được chạy thử một lần (tối đa {0} giây) để biết có dùng được không.',TEST_LIMIT)}</p>
 ${importPlan()}<div class="warnline" data-testid="connect-apps-mcp-warn" style="margin-top:14px">${MCP_WARN()}</div></div>`}
// ===== v4.9: trình sửa mcp.json trong ứng dụng (Nâng cao › mcp.json, hoặc nút “{ } mcp.json” trên thanh trên) =====
// số dòng, kiểm tra JSON ngay khi gõ (lỗi bằng lời dễ hiểu + dòng/cột), khoá chỉ hiện dạng ${secret:…}, Lưu luôn qua thẻ xin phép, mục thêm/đổi lệnh được chạy thử lại.
const JERR=c=>({trail:tr('Thừa dấu phẩy ở cuối danh sách. Xoá dấu phẩy này.'),comma:tr('Thiếu dấu phẩy. Thêm “,” sau giá trị ở dòng này.'),colon:tr('Thiếu dấu hai chấm “:” sau tên.'),
 key:tr('Tên phải nằm trong ngoặc kép, ví dụ "command".'),squote:tr('Dùng ngoặc kép (") thay cho ngoặc đơn.'),str:tr('Chuỗi chưa có ngoặc kép đóng.'),
 eof:tr('Tệp dừng giữa chừng: còn thiếu “}” hoặc “]”.'),value:tr('Giá trị không hợp lệ. Chữ phải nằm trong ngoặc kép.'),extra:tr('Có chữ thừa sau dấu “}” cuối cùng.')})[c];
// v4.10 (P49-3): ghi lại từng mục trong mcpServers (vị trí tên và giá trị) để báo tên trùng theo dòng:cột; trùng tên ở chỗ khác là lỗi
function jsonScan(t,rec){let i=0,lc=-1;const n=t.length,E=(code,at,k)=>{throw{code,at,k}},ws=()=>{while(i<n&&/\s/.test(t[i]))i++};
 const str=()=>{const s0=i;i++;while(i<n){const c=t[i];if(c==='"'){i++;return}if(c==='\\'){i+=2;continue}if(c==='\n')E('str',s0);i++}E('str',s0)};
 const val=(pk,d)=>{ws();if(i>=n)E('eof',n);const c=t[i];if(c==='{')return coll('}',true,pk,d);if(c==='[')return coll(']',false,pk,d);if(c==='"')return str();if(c==="'")E('squote',i);
  const m=/^(-?\d+(\.\d+)?([eE][+-]?\d+)?|true|false|null)(?![A-Za-z0-9_])/.exec(t.slice(i,i+60));if(m){i+=m[0].length;return}E('value',i)};
 const coll=(cl,obj,pk,d)=>{const srv=obj&&d===1&&pk==='mcpServers',seen=new Map();i++;ws();if(t[i]===cl){i++;return}
  for(;;){ws();if(i>=n)E('eof',n);let key=null;const ks=i;let ke=i;
   if(obj){if(t[i]==="'")E('squote',i);if(t[i]!=='"')E('key',i);str();ke=i;try{key=JSON.parse(t.slice(ks,ke))}catch(e){E('str',ks)}
    if(seen.has(key)){if(srv){if(rec)rec.dups.push({key,first:seen.get(key),at:ks})}else E('dup',ks,key)}else seen.set(key,ks);
    ws();if(t[i]!==':')E(i>=n?'eof':'colon',i);i++}
   ws();const vs=i;val(key,d+1);const end=i;if(srv&&rec)rec.members.push({key,ks,ke,vs,ve:end});ws();
   if(t[i]===','){lc=i;i++;ws();if(t[i]===cl)E('trail',lc);continue}
   if(t[i]===cl){i++;return}if(i>=n)E('eof',n);E('comma',end-1)}};
 try{ws();val(null,0);ws();if(i<n)E('extra',i);return null}catch(e){if(e&&e.code)return e;throw e}}
const lineCol=(t,at)=>{const b=t.slice(0,Math.max(0,at));return[b.split('\n').length,at-b.lastIndexOf('\n')]};
const keyAt=(t,k)=>{const m=new RegExp('"'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"\\s*:').exec(t);return m?m.index:0};
const stripBom=t=>String(t??'').replace(/^\uFEFF/,''); // v4.10 (P49-5): tệp lưu bằng Notepad có BOM
function edDiff(ns){const old=servers(),d={add:[],chg:[],minor:[],rm:[]};
 for(const k of Object.keys(ns)){if(!old[k])d.add.push(k);else if(sig(old[k])!==sig(ns[k]))d.chg.push(k);else if(JSON.stringify(old[k])!==JSON.stringify(ns[k]))d.minor.push(k)}
 for(const k of Object.keys(old))if(!ns[k])d.rm.push(k);return d}
const TOPK='(mcp.json)';
function edCheck(t0){const t=stripBom(t0),sh=t0.length-t.length,bad=(at,msg)=>{const[line,col]=lineCol(t0,at+sh);return{ok:false,at:at+sh,line,col,msg}};
 if(new Blob([t]).size>262144)return bad(0,tr('Tệp mcp.json lớn hơn 256 KB.'));
 const rec={members:[],dups:[]},e=jsonScan(t,rec);if(e)return bad(e.at,e.code==='dup'?tr('Tên “{0}” bị trùng trong cùng một khối. Xoá hoặc đổi một tên.',e.k):JERR(e.code));
 const r=parseFile(t);if(r.fatal)return bad(0,r.fatal);
 if(rec.dups.length){const d=rec.dups[0],[line,col]=lineCol(t0,d.at+sh),[l0]=lineCol(t0,d.first+sh);return{ok:true,dup:{...d,line,col,l0},at:d.at+sh,line,col,members:rec.members,changes:0,raw:0}}
 const ks=Object.keys(r.servers);
 for(const k of ks){const v=validateServer(k,r.servers[k]);if(v)return bad(keyAt(t,k),v)}
 {const sm=new Map();for(const kb of ks){const sn=safeName(kb);if(sm.has(sn))return bad(keyAt(t,kb),tr('Tên "{0}" và "{1}" trùng nhau sau khi chuẩn hoá.',sm.get(sn),kb));sm.set(sn,kb)}} // v4.12 (P411-10): O(n) thay cho O(n²)
 const json=JSON.parse(t),{mcpServers:_a,...o1}=json,{mcpServers:_b,...o0}=DB.mcp,top=JSON.stringify(o1)!==JSON.stringify(o0);
 const FS=[...ks.flatMap(k=>scanServer(k,r.servers[k])),...scanServer(TOPK,o1)],raw=FS.length;HLV=new Set(FS.map(f=>f.val));
 const d=edDiff(r.servers);
 return{ok:true,json,servers:r.servers,raw,vals:HLV,diff:d,top,changes:d.add.length+d.chg.length+d.minor.length+d.rm.length+(top?1:0)+(raw?1:0)}}
const edBase=()=>JSON.stringify(DB.mcp,null,2);
const gutHtml=(t,r)=>{const n=t.split('\n').length,w=r.dup?[r.dup.line,r.dup.l0]:[];let h='';for(let x=1;x<=n;x++)h+=`<div${!r.ok&&r.line===x?' class="bad"':w.includes(x)?' class="warn"':''}>${x}</div>`;return h};
// v4.11 (P410-1): MỘT hàm đặt tên mới cho “Giữ cả hai” (nhập, trình sửa, Thêm). Luôn dừng: tối đa 1000 lần thử rồi dùng tên dự phòng.
// Tên chuẩn hoá (safeName) chỉ giữ 24 ký tự đầu, nên với tên dài phải rút gọn phần đầu để hậu tố -N còn nằm trong 24 ký tự — nếu không mọi -N đều trùng nhau (gốc của vòng lặp vô hạn ở 4.10).
// v4.12 (P411-5): tên mới = tên gốc + '-N'; chỉ cắt phần gốc (theo ký tự Unicode) khi tổng vượt 64 — không còn rút gọn theo safeName
function uniqName(k,usedArr){k=nameKey(k)||'srv';const used=new Set([...(usedArr||[])].map(nameKey));used.add(k);
 const ok=c=>!!c&&nlen(c)<=64&&!nameErr(c)&&!used.has(c);
 const m=/^(.*\S)-(\d{1,2})$/.exec(k);const base0=m?m[1]:k;let i=m?+m[2]+1:2;
 for(let n=0;n<1000;n++,i++){const suf='-'+i;const b=nlen(base0)+suf.length<=64?base0:cpSlice(base0,64-suf.length).replace(/[\s\-_.]+$/,'');const c=(b||'srv')+suf;if(ok(c))return c}
 for(let n=0;n<50;n++){const c='srv-'+Math.random().toString(36).slice(2,8);if(ok(c))return c}
 return 'srv-'+Date.now()}
function dupNewName(k,ms){return uniqName(k,[...Object.keys(servers()),...(ms||[]).map(m=>m.key)])}
function edStatus(r,dirty){if(!r.ok)return `<div class="perr ederr" data-testid="json-error"><b>✕ ${esc(tr('Dòng {0}, cột {1}: {2}',r.line,r.col,r.msg))}</b><div class="fix"><a href="#" data-testid="json-goto" onclick="edGo();return false">${tr('Đến chỗ lỗi')}</a> · ${tr('Chưa lưu được cho đến khi sửa xong.')}</div></div>`;
 if(r.dup){const d=r.dup;return `<div class="perr ederr dupbox" data-testid="json-dup"><b>⚠ ${esc(tr('Dòng {0}, cột {1}: {2}',d.line,d.col,tr('Tên “{0}” bị trùng (đã có ở dòng {1}).',d.key,d.l0)))}</b><div class="fix">${esc(tr('Chọn cách xử lý. AIVN không bao giờ ghi đè âm thầm.'))} <a href="#" data-testid="json-goto" onclick="edGo();return false">${tr('Đến chỗ trùng')}</a></div>
  <div class="duprow"><button class="btn sm" data-testid="dup-keep" onclick="edDup('keep')">${esc(tr('Giữ cả hai (đổi tên mới thành {0})',dupNewName(d.key,r.members)))}</button><button class="btn sm danger" data-testid="dup-replace" onclick="edDup('replace')">${tr('Thay thế')}</button><button class="btn sm ghost" data-testid="dup-skip" onclick="edDup('skip')">${tr('Bỏ qua')}</button></div></div>`}
 const d=r.diff,sum=!dirty?tr('Chưa có thay đổi.'):!r.changes?tr('Chỉ đổi khoảng trắng; không có gì để lưu.'):tr('Khi lưu: thêm {0} · đổi lệnh {1} · đổi cài đặt khác {2} · gỡ {3}.',d.add.length,d.chg.length,d.minor.length+(r.top?1:0),d.rm.length);
 return `<div class="tst ok" data-testid="json-ok">✓ ${tr('JSON hợp lệ.')} ${esc(sum)}</div>${r.raw?`<div class="pnote" data-testid="json-raw-key">🔑 ${tr('Có {0} khoá viết thẳng trong tệp. Khi lưu, AIVN hỏi bạn trước khi chuyển từng khoá vào kho khoá và chỉ để lại {1}.',r.raw,'<code>${secret:…}</code>')}</div>`:''}`}
// ===== v4.10: tô màu cú pháp (bộ tách từ riêng, lớp phủ dưới textarea trong suốt); khoá luôn bị che bằng • (giữ đúng số ký tự để thẳng hàng) =====
// v4.12 (P411-1): lớp tô màu che thêm mọi chuỗi mà scanServer đã tìm thấy (cờ tách đôi, mysql -p, env trong args…)
function hlMaskRanges(body,ctxKey,prevStr){const R=[];if(!body||isRef(body))return R;
 if(HLV.size){if(HLV.has(body)){R.push([0,body.length]);return R}if(HLV.size<=400)for(const v of HLV){if(v.length<3)continue;let i=body.indexOf(v);while(i>=0){R.push([i,i+v.length]);i=body.indexOf(v,i+v.length)}}}
 if(ctxKey&&(SECRET_NAME.test(ctxKey)||/^(proxy-)?authorization$/i.test(ctxKey))&&!hasRefIn(body)&&!NONVAL.test(body)){const b=/^(Bearer\s+|Basic\s+)/i.exec(body);R.push([b?b[0].length:0,body.length]);return R}
 if(prevStr&&SECRET_FLAG.test(prevStr)&&!body.startsWith('-')&&!hasRefIn(body)&&!NONVAL.test(body)&&!/^(~|\.{0,2}\/|[A-Za-z]:\\)/.test(body)){R.push([0,body.length]);return R}
 if(prevStr&&REV_FLAG.test(prevStr)&&/^[0-9a-f]{7,64}$/i.test(body))return R;
 const eq=/^(--?[A-Za-z][\w-]*)=(.+)$/.exec(body);if(eq&&SECRET_FLAG.test(eq[1])&&!hasRefIn(eq[2])&&!NONVAL.test(eq[2])){R.push([eq[1].length+1,body.length]);return R}
 const ui=/^[a-z][a-z0-9+.-]*:\/\/[^\/?#@:]*:([^\/?#@]+)@/i.exec(body);if(ui&&!hasRefIn(ui[1])){const a=body.indexOf(ui[1]);R.push([a,a+ui[1].length])}
 const re=/[?&]([^=&#]+)=([^&#]*)/g;let m;while((m=re.exec(body))){if(m[2]&&!m[2].startsWith('${secret')&&(paramSecret(m[1])&&valOk(pctDec(m[2]))||keyLikeIn(m[2]).length)){const a=m.index+m[0].length-m[2].length;R.push([a,a+m[2].length])}}
 for(const h of keyLikeIn(body))R.push([h.a,h.b]);{const bre=/\b(?:Bearer|Basic)\s+([A-Za-z0-9._~+\/\-=]{8,})/gi;let bm;while((bm=bre.exec(body)))if(!hasRefIn(bm[1])){const a=bm.index+bm[0].length-bm[1].length;R.push([a,a+bm[1].length])}}return R}
function hlJson(t){let o='',i=0,lastKey=null,prevStr=null;const n=t.length,st=[];
 const out=(c,s)=>{o+=c?`<span class="${c}">${esc(s)}</span>`:esc(s)};
 while(i<n){const c=t[i];
  if(c==='"'){let j=i+1;while(j<n&&t[j]!=='"'&&t[j]!=='\n'){if(t[j]==='\\')j++;j++}if(j<n&&t[j]==='"')j++;const raw=t.slice(i,j);let k=j;while(k<n&&/[ \t]/.test(t[k]))k++;
   const top=st[st.length-1],isKey=top==='{'&&t[k]===':';
   if(isKey){out('hk',raw);lastKey=raw.slice(1,-1)}
   else{const body=raw.slice(1,raw.length>1&&raw.endsWith('"')?-1:undefined);const R=hlMaskRanges(body,top==='{'?lastKey:null,top==='['?prevStr:null).sort((a,b)=>a[0]-b[0]);
    let s='"',p=0;o+='<span class="hs">';for(const [a,b] of R){if(b<=p)continue;const a1=Math.max(a,p);s+=body.slice(p,a1);o+=esc(s);s='';o+=`<span class="hm">${'•'.repeat(b-a1)}</span>`;p=b}
    o+=esc(s+body.slice(p)+(raw.length>1&&raw.endsWith('"')?'"':''))+'</span>';if(top==='[')prevStr=body}
   i=j;continue}
  if(c==='{'||c==='['){st.push(c);if(c==='[')prevStr=null;out('hp',c);i++;continue}
  if(c==='}'||c===']'){st.pop();out('hp',c);i++;continue}
  if(c===':'||c===','){out('hp',c);i++;continue}
  const m=/^(-?\d+(\.\d+)?([eE][+-]?\d+)?|true|false|null)(?![A-Za-z0-9_])/.exec(t.slice(i,i+40));
  if(m){out(/^[tfn]/.test(m[0])?'hb':'hn',m[0]);i+=m[0].length;continue}
  let j=i+1;while(j<n&&!/["{}\[\]:,\-0-9tfn]/.test(t[j]))j++;out(/\s/.test(c)&&!/\S/.test(t.slice(i,j))?'':'hx',t.slice(i,j));i=j}
 return o+'\n '}
function edHlUpd(){const ta=$('edTxt'),h=$('edHl');if(!ta||!h)return;h.innerHTML=hlJson(ta.value);h.scrollTop=ta.scrollTop;h.scrollLeft=ta.scrollLeft}
function jsonPanel(){const base=edBase();if(!UI.ed)UI.ed={text:base};const t=UI.ed.text,r=edCheck(t),dirty=t!==base;
 return `<div class="detail" data-testid="ca-json">${phead(emojiTile('{ }',56),'mcp.json',null,`<div class="small muted" style="margin-top:4px">${tr('Sửa tay tệp cấu hình.')}</div>`)}
 <div class="pact">${BIG('pri',`id="edSave" data-act="save" ${r.ok&&!r.dup&&dirty&&r.changes?'':'disabled'} onclick="edSave()"`,tr('Lưu…'))}<button class="btn sm ghost" id="edRev" data-testid="json-revert" ${dirty?'':'disabled'} onclick="edRevert()">${tr('Bỏ thay đổi')}</button><span style="flex:1"></span><span class="small muted" id="edPos"></span></div>
 <div class="edbox ${r.ok?'':'bad'}"><div class="edgut" id="edGut" aria-hidden="true">${gutHtml(t,r)}</div><div class="edwrap"><pre class="edhl" id="edHl" aria-hidden="true">${hlJson(t)}</pre><textarea class="edta" id="edTxt" data-testid="connect-apps-json" spellcheck="false" wrap="off" autocomplete="off" aria-label="mcp.json" aria-describedby="edErr" aria-invalid="${!r.ok}" onbeforeinput="edHistBefore(event)" onkeydown="edHistKey(event)" oninput="edInput(this)" onscroll="edScrollSync(this)" onkeyup="edPosUpd()" onclick="edPosUpd()"></textarea></div></div>
 <div id="edErr" role="status" data-testid="json-status">${edStatus(r,dirty)}</div>
 <div id="advMsg" role="status">${UI.advMsg||''}</div>
 ${NOTKEY.size?`<div class="small muted" style="margin:6px 0" data-testid="notkey-row">⚠ ${tr('{0} chuỗi được bạn đánh dấu “không phải khoá” (chỉ ở đúng máy chủ và vị trí đó).',NOTKEY.size)} <button class="btn sm ghost" data-testid="notkey-reset" onclick="nkResetUi()">${tr('Đặt lại các mục “không phải khoá” ({0})',NOTKEY.size)}</button></div>`:''}<div class="small muted" style="margin:6px 0" data-testid="json-secret-note">🔑 ${tr('Chỗ giữ như {0} trỏ tới khoá đã lưu an toàn trên máy. Khoá thật không bao giờ ghi vào mcp.json.','<code>${secret:tim-kiem}</code>')}</div>
 <div class="small muted" style="margin:6px 0" data-testid="json-rule-note">ℹ️ ${tr('Lưu luôn qua thẻ xin phép. Mục mới thêm, hoặc đổi lệnh, đối số, địa chỉ, đầu mục hay tên biến, sẽ được chạy thử ngay sau khi bạn cho phép.')}</div></div>`}
let edTimer=null;
function edInput(ta){UI.ed={text:ta.value};UI.advMsg=null;const m=$('advMsg');if(m)m.innerHTML='';edHlUpd();clearTimeout(edTimer);edTimer=setTimeout(edRefresh,window.FAST?0:150);edPosUpd()}
function edRefresh(){const ta=$('edTxt');if(!ta)return;const t=ta.value,r=edCheck(t),dirty=t!==edBase();
 $('edGut').innerHTML=gutHtml(t,r);$('edGut').scrollTop=ta.scrollTop;$('edErr').innerHTML=edStatus(r,dirty);ta.setAttribute('aria-invalid',String(!r.ok));
 ta.closest('.edbox').classList.toggle('bad',!r.ok);$('edSave').disabled=!(r.ok&&!r.dup&&dirty&&r.changes);$('edRev').disabled=!dirty}
function edScrollSync(ta){$('edGut').scrollTop=ta.scrollTop;const h=$('edHl');if(h){h.scrollTop=ta.scrollTop;h.scrollLeft=ta.scrollLeft}UI.edScroll=ta.scrollTop}
function edPosUpd(){const ta=$('edTxt'),p=$('edPos');if(!ta||!p)return;const[l,c]=lineCol(ta.value,ta.selectionStart);p.textContent=tr('Dòng {0}, cột {1}',l,c)}
function edGo(){const ta=$('edTxt');if(!ta)return;const r=edCheck(ta.value);if(r.ok&&!r.dup)return;ta.focus();ta.setSelectionRange(r.at,Math.min(ta.value.length,r.at+1));
 const lh=parseFloat(getComputedStyle(ta).lineHeight)||18;ta.scrollTop=Math.max(0,(r.line-4)*lh);edScrollSync(ta);edPosUpd()}
// v4.10 (P49-4): thay cả nội dung bằng execCommand('insertText') để Ctrl+Z vẫn lùi lại được; dự phòng gán value
function edApply(text,caret=0){const ta=$('edTxt');if(!ta){UI.ed={text};return renderCA()}if(ta.value!==text)edSnap(ta);EDH.kind='';EDH.mute=true;ta.focus();ta.setSelectionRange(0,ta.value.length);let ok=false;
 try{ok=document.execCommand('insertText',false,text)}catch(e){}if(!ok||ta.value!==text)ta.value=text;
 EDH.mute=false;try{ta.setSelectionRange(caret,caret)}catch(e){}edInput(ta);edRefresh()}
// v4.11 (P410-9): Ctrl+Z / Ctrl+Y (Ctrl+Shift+Z, ⌘Z) theo THAO TÁC chứ không theo từng ký tự: gõ liền một từ (kèm dấu cách sau nó) là một bước,
// mỗi lần dán / cắt / xoá theo đoạn / Bỏ thay đổi / thay cả nội dung là một bước; dừng gõ > 1 giây cũng tách bước. Lịch sử giữ trong bộ nhớ (không ghi xuống).
const EDH={u:[],r:[],last:0,kind:'',mute:false};
function edSnap(ta){const v=ta.value;if(EDH.u.length&&EDH.u[EDH.u.length-1].v===v)return;EDH.u.push({v,a:ta.selectionStart,b:ta.selectionEnd});if(EDH.u.length>200)EDH.u.shift();EDH.r=[]}
function edHistBefore(e){if(EDH.mute)return;const ta=e.target,it=e.inputType||'',now=Date.now();
 if(it==='historyUndo'||it==='historyRedo'){e.preventDefault();return it==='historyUndo'?edUndo():edRedo()}
 const kind=it==='insertText'?(/^\s+$/.test(e.data||'')?'space':'type'):it==='deleteContentBackward'||it==='deleteContentForward'?'del':'other';
 const sel=ta.selectionStart!==ta.selectionEnd,brk=kind==='other'||sel||now-EDH.last>1000||(kind!==EDH.kind&&!(EDH.kind==='type'&&kind==='space'));
 if(brk)edSnap(ta);else EDH.r=[];EDH.kind=kind==='other'||sel?'':kind;EDH.last=now}
function edHistSet(ta,x){ta.value=x.v;try{ta.setSelectionRange(x.a,x.b)}catch(e){}EDH.kind='';edInput(ta)}
function edUndo(){const ta=$('edTxt');if(!ta||!EDH.u.length)return;const x=EDH.u.pop();EDH.r.push({v:ta.value,a:ta.selectionStart,b:ta.selectionEnd});edHistSet(ta,x)}
function edRedo(){const ta=$('edTxt');if(!ta||!EDH.r.length)return;const x=EDH.r.pop();EDH.u.push({v:ta.value,a:ta.selectionStart,b:ta.selectionEnd});edHistSet(ta,x)}
function edHistKey(e){if(!(e.ctrlKey||e.metaKey)||e.altKey)return;const k=e.key.toLowerCase();
 if(k==='z'&&!e.shiftKey){e.preventDefault();edUndo()}else if((k==='z'&&e.shiftKey)||k==='y'){e.preventDefault();edRedo()}}
// v4.11 (P410-7): toast nhận câu dạng hàm → vẽ lại đúng ngôn ngữ khi đổi ngôn ngữ (setLang gọi t._draw)
function undoToast(msg,fn){let t=$('uToast');if(!t){t=document.createElement('div');t.id='uToast';t.className='utoast';t.setAttribute('role','status');document.body.appendChild(t)}
 const mf=typeof msg==='function'?msg:()=>msg;
 t._draw=()=>{t.innerHTML=`<span>${esc(mf())}</span><button class="btn sm" id="uUndo" data-testid="undo-btn">${tr('Hoàn tác')}</button>`;$('uUndo').onclick=()=>{t.classList.remove('show');fn()}};t._draw();t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),window.FAST?60000:8000)}
function edRevert(){const ta=$('edTxt'),prev=ta?ta.value:(UI.ed&&UI.ed.text);UI.advMsg=null;edApply(edBase(),0);
 undoToast(()=>tr('Đã bỏ thay đổi'),()=>{if(typeof prev==='string')edApply(prev,0)})}
function cutMember(t,ms,m){const ix=ms.indexOf(m);if(ix<ms.length-1)return t.slice(0,m.ks)+t.slice(ms[ix+1].ks);if(ix>0)return t.slice(0,ms[ix-1].ve)+t.slice(m.ve);return t.slice(0,m.ks)+t.slice(m.ve)}
async function edDup(kind){const cur=()=>{const ta=$('edTxt');return ta?ta.value:UI.ed.text};const scan=t=>{const rec={members:[],dups:[]};const t1=stripBom(t);if(jsonScan(t1,rec)||!rec.dups.length)return null;
  const d=rec.dups[0],ms=rec.members;return{t:t1,d,ms,first:ms.find(m=>m.ks===d.first),later:ms.find(m=>m.ks===d.at)}};
 let S=scan(cur());if(!S)return edRefresh();
 if(kind==='keep'){const nn=dupNewName(S.d.key,S.ms);return edApply(S.t.slice(0,S.later.ks)+JSON.stringify(nn)+S.t.slice(S.later.ke),S.later.ks)}
 if(kind==='skip')return edApply(cutMember(S.t,S.ms,S.later),S.first.ks);
 let o={},nw={};try{o=JSON.parse(S.t.slice(S.first.vs,S.first.ve));nw=JSON.parse(S.t.slice(S.later.vs,S.later.ve))}catch(e){}const key=S.d.key;
 const a=await withCard(()=>({tool:'mcp_replace',logoHtml:letterTile(key,30),title:tr('Thay thế máy chủ “{0}”?',key),sub:'mcp.json',fields:[[tr('Lệnh cũ'),redact(o),1],[tr('Lệnh mới'),redact(nw),1]],
  lines:[tr('Mục sau thay cho mục trước trong tệp đang sửa.'),tr('Bấm Lưu để áp dụng (vẫn qua thẻ xin phép).')],danger:true,alwaysLabel:null}));
 if(!a.ok){UI.advMsg=`<span class="msg-bad">${esc(tr('Chưa thay thế: bạn đã từ chối. Hai mục trùng tên vẫn còn.'))}</span>`;return render()}
 S=scan(cur());if(S)edApply(cutMember(S.t,S.ms,S.first),S.first.ks)}
async function edSave(){const text=$('edTxt')?$('edTxt').value:UI.ed.text;UI.ed={text};const r=edCheck(text);if(!r.ok||r.dup||!r.changes)return edRefresh();
 const d=r.diff,ns=JSON.parse(JSON.stringify(r.servers)),{mcpServers:_x,...rest}=JSON.parse(JSON.stringify(r.json)),run=[...d.add,...d.chg];
 const g=await secretGate({...ns,[TOPK]:rest},'mcp.json');delete ns[TOPK];
 if(g.blocked.length){UI.advMsg=`<span class="msg-bad" data-testid="json-blocked">${esc(blockMsg(g.blocked.map(b=>b===TOPK?'mcp.json':b)))} ${esc(tr('Nội dung đang sửa vẫn còn.'))}</span>`;return render()}
 const newJson={...rest,mcpServers:ns},newText=JSON.stringify(newJson,null,2);
 const a=await withCard(()=>({tool:'mcp_json_save',logoHtml:letterTile('M',30),title:tr('Lưu thay đổi mcp.json?'),sub:'mcp.json'+(g.count?' · '+tr('Bước {0}/{1}',2,2):''),
  preview:capList([...d.add.map(k=>[k,tr('Thêm mới')+' · '+kindOf(ns[k])+(isDanger(ns[k])?' · ⚠':'')]),...d.chg.map(k=>[k,tr('Đổi lệnh hoặc địa chỉ')+(isDanger(ns[k])?' · ⚠':'')]),...d.minor.map(k=>[k,tr('Đổi cài đặt khác')]),...d.rm.map(k=>[k,'🗑 '+tr('Gỡ')]),...(r.top?[['mcp.json',tr('Đổi cài đặt khác')]]:[])]),
  extraHtml:diffHtml(edBase(),newText,16,g.plain),
  lines:[...(run.length?[TEST_LINE()]:[]),...(d.rm.length?[tr('Mục bị gỡ sẽ dừng ngay và khoá đã lưu của nó bị xoá khỏi máy.')]:[]),...(g.count?['🔑 '+secretLine(g.count)]:[]),...(g.plain.length?['⚠ '+plainLine(g.plain)]:[])],
  details:capList(run.map(k=>[k,redact(ns[k]),1])),...(run.length?{warn:MCP_WARN()}:{}),danger:run.some(k=>isDanger(ns[k])),alwaysLabel:null}));
 if(!a.ok){UI.advMsg=`<span class="msg-bad">${esc(tr('Chưa lưu: bạn đã từ chối. Nội dung đang sửa vẫn còn.'))}</span>`;return render()}
 commitMoves(g.moves);
 const old=servers(),keep=new Set(allRefs(newJson));
 for(const k of d.rm){stop(k);delete DB.meta.servers[k];delete RT.state[k]}
 for(const k of Object.keys(old))allRefs(old[k]).forEach(v=>{if(!keep.has(v))delete SEC[v]});
 const wasOn=Object.fromEntries(d.minor.map(k=>[k,RT.state[k]==='on'||RT.state[k]==='waiting']));
 for(const k of Object.keys(ns))placeholderEmpty(k,ns[k]);
 DB.mcp=newJson;
 const taken=new Set(Object.keys(ns).filter(k=>old[k]).map(k=>(DB.meta.servers[k]||{}).catalogId).filter(Boolean));
 for(const k of d.add){const s=ns[k],c=importSlot(k,s,taken);if(c)taken.add(c);DB.meta.servers[k]={catalogId:c,approvedAt:s.auth?null:now(),alwaysOn:false};RT.state[k]='off';
  if(s.auth){RT.state[k]='error';RT.err[k]=()=>oauthMsg(k)}}
 for(const k of d.chg){stop(k);const m=metaOf(k),c=catalogMatch(ns[k]);m.approvedAt=now();m.alwaysOn=false;delete m.test;if(m.catalogId&&!(c&&c.id===m.catalogId))m.catalogId=null}
 for(const k of d.minor)if(ns[k].disabled||wasOn[k])stop(k);
 saveSec();save();UI.ed=null;UI.edScroll=0;
 UI.advMsg=`<span class="msg-ok">${esc(tr('Đã lưu mcp.json.'))}${run.length?' '+esc(tr('Đang chạy thử {0} mục thêm hoặc đổi lệnh.',run.filter(k=>!ns[k].disabled&&!ns[k].auth).length)):''}</span>`;render();
 d.minor.forEach(k=>{if(wasOn[k]&&!ns[k].disabled)start(k)});runTests(run.filter(k=>!ns[k].disabled&&!ns[k].auth))}
// v4.9 (P48-5): vẽ lại không làm mất focus — nhớ phần tử đang focus (id / data-testid / dòng), vị trí con trỏ, cuộn; rồi trả lại
function renderCA(){const M=$('caModal'),ae=document.activeElement,inM=ae&&M.contains(ae);
 const fk=inM?focusKeyOf(ae):null,frow=inM&&ae.closest('.li')?ae.closest('.li').dataset.sel:null,fpan=inM&&!!ae.closest('#caPanel');
 let fpos=null;try{fpos=fk&&(ae.tagName==='INPUT'||ae.tagName==='TEXTAREA')?[ae.selectionStart,ae.selectionEnd]:null}catch(e){}
 const sc=$('caList')?$('caList').scrollTop:0,sp=$('caPanel')?$('caPanel').scrollTop:0,n=countOn();
 const secs=listSecs(),flat=secs.flatMap(x=>x[1]);if(!UI.sel||!flat.some(x=>selKey(x)===selKey(UI.sel)))UI.sel=flat[0]||null;
 if(!UI.sel)UI.mpane='list';
 const same=M.dataset.sel===String(selKey(UI.sel));M.dataset.sel=String(selKey(UI.sel));
 M.classList.toggle('m-detail',UI.mpane==='detail');M.setAttribute('role','dialog');M.setAttribute('aria-modal','true');M.setAttribute('aria-labelledby','caTitle');
 const chip=(id,l)=>`<button class="chip ${id==='adv'?'adv':id==='connected'?'conn':''} ${UI.tab===id?'on':''}" aria-pressed="${UI.tab===id}" data-testid="connect-apps-tab-${id}" onclick="setTab(UI.tab==='${id}'&&'${id}'==='connected'?'all':'${id}')">${id==='adv'?'⚙ ':id==='connected'?'<span class="cdot" aria-hidden="true"></span>':''}${tr(l)}</button>`;

 const note=fNote();
 M.innerHTML=`<div class="mh"><h2 id="caTitle">${tr('Kết nối ứng dụng')}</h2><button class="badge ${n?'on':''} ${UI.tab==='connected'?'act':''}" data-testid="connect-apps-count" aria-pressed="${UI.tab==='connected'}" title="${esc(UI.tab==='connected'?tr('Bỏ lọc'):tr('Chỉ hiện ứng dụng đã kết nối'))}" onclick="setTab(UI.tab==='connected'?'all':'connected')"><span aria-live="polite">${n?tr('{0} đã kết nối',n):tr('Chưa kết nối')}</span></button><span style="flex:1"></span><button class="x" data-testid="ca-close" onclick="closeCAAsk()" aria-label="${esc(tr('Đóng'))}" title="${esc(tr('Đóng'))}">✕</button></div>
  <div class="ca-top"><div class="search">${ICONS.search}<input class="inp" id="caQ" data-testid="connect-apps-q" aria-label="${esc(tr('Tìm ứng dụng…'))}" placeholder="${tr('Tìm ứng dụng…')}" value="${esc(UI.q)}"></div>
   <div class="chips" role="group" aria-label="${esc(tr('Lọc'))}">${FILTERS.map(([id,l])=>chip(id,l)).join('')}</div>
   <span style="flex:1"></span><button class="btn sm" data-testid="connect-apps-import-top" title="${esc(tr('Nhập mcp.json'))}" aria-label="${esc(tr('Nhập mcp.json'))}" onclick="selectItem('x:import',{kbd:true})">📂<span class="imptxt"> ${tr('Nhập mcp.json')}</span></button><button class="btn sm" data-testid="connect-apps-json-top" title="${esc(tr('Sửa mcp.json'))}" aria-label="${esc(tr('Sửa mcp.json'))}" onclick="selectItem('x:json',{kbd:true})">{ }<span class="imptxt jtxt"> mcp.json</span></button></div>
  <div class="ca-body"><div class="ca-left">${note?`<div class="fnote" data-testid="ca-filter-note">ⓘ ${esc(note)}</div>`:''}<div class="scroll" id="caList" role="list" aria-label="${esc(tr('Danh sách ứng dụng'))}">${listHtml(secs)}</div>${legend()}</div>
   <div class="scroll" id="caPanel" data-testid="ca-panel" tabindex="-1" aria-label="${esc(tr('Chi tiết'))}">${panelHtml()}</div></div>${menuHtml()}`;
 $('caQ').oninput=e=>{UI.q=e.target.value;UI.mpane='list';UI.menu=null;renderCA()};
 $('caList').onkeydown=listKey;$('caList').onscroll=e=>{if(UI.menu&&UI.menu.where==='row'&&Math.abs(e.target.scrollTop-(UI.menu.top??e.target.scrollTop))>2)closeMenu(false)};
 if(!document.querySelector('#caList .li-main[tabindex="0"]')){const f=document.querySelector('#caList .li');if(f)f.querySelectorAll('button').forEach(b=>b.tabIndex=0)}
 $('caList').scrollTop=sc;if(same)$('caPanel').scrollTop=sp;
 // v4.10 (P49-2): chữ người dùng gõ (có thể là khoá) chỉ gán qua .value, không bao giờ nằm trong HTML/thuộc tính
 const ta=$('edTxt');if(ta){ta.value=UI.ed?UI.ed.text:edBase();edHlUpd();ta.scrollTop=UI.edScroll;$('edGut').scrollTop=ta.scrollTop;edScrollSync(ta)}
 {const ki=$('key-in');if(ki&&UI.key)ki.value=UI.key.v||'';for(const [cid,S0] of Object.entries(UI.setup)){const i=$('sec-'+cid);if(i)i.value=S0.v||''}
  if(UI.add){[['addName','name'],['addLine','line'],['addEnv','env']].forEach(([id,f])=>{const e=$(id);if(e)e.value=UI.add[f]||''})}}
 {const ch=document.querySelector('.ca-top .chips');if(ch){const u=()=>ch.classList.toggle('fade',ch.scrollWidth-ch.clientWidth-ch.scrollLeft>2);u();ch.onscroll=u}} // v4.10 (P49-9)
 if(UI.flash)setTimeout(()=>{UI.flash=null},1700);
 if(UI.menu){placeMenu();const m=$('caMenu');if(m){m.onkeydown=menuKey;if(UI.menu.focusFirst){UI.menu.focusFirst=false;m.querySelector('button:not([disabled])')?.focus()}}}
 else if(inM&&(!document.activeElement||document.activeElement===document.body||!M.contains(document.activeElement))){
  let e=fk&&M.querySelector(fk);if(e&&(e.disabled||e.offsetParent===null))e=null;
  if(!e&&frow){const r=M.querySelector(`#caList .li[data-sel="${CSS.escape(frow)}"] .li-main`);if(r&&r.offsetParent!==null)e=r}
  if(!e&&fpan&&$('caPanel').offsetParent!==null)e=$('caPanel');
  if(!e)e=[M.querySelector('#caList .li.cur .li-main'),$('caQ')].find(x=>x&&x.offsetParent!==null);
  if(e){e.focus({preventScroll:true});if(fpos&&e===M.querySelector(fk))try{e.setSelectionRange(fpos[0],fpos[1])}catch(x){}}}
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
const SAMPLE_DESC={'brave-search':'Tìm trên mạng bằng Brave.','nas-nha':'Xem và tìm tệp trên ổ mạng trong nhà.','thoi-tiet':'Xem thời tiết theo thành phố.','may-ngoai':'Dùng các chức năng trên một máy ngoài mạng nội bộ.','nas-ten':'Xem tệp trên ổ mạng (gọi theo tên máy).','sqlite':'Đọc tệp cơ sở dữ liệu SQLite.','thinking':'Suy nghĩ từng bước (qua mạng).','tim-kiem':'Tìm kiếm trên mạng (cần khoá).','bao-cao':'Tạo báo cáo (mẫu chạy quá giờ).','lich-cong-ty':'Xem lịch công ty (mẫu lỗi).'};
// v4.11 (ý quản lý — dòng trùng tên): dòng trùng tên cho thấy KHÁC NHAU Ở ĐÂU theo từng trường — khoá luôn che “•••”, biến môi trường ${X} hiện nguyên
const DIFF_SEC_HDR=/^(authorization|proxy-authorization|cookie)$/i;
function srvDiff(a0,b0){const a=a0||{},b=b0||{},out=[];
 const res=v=>typeof v==='string'?v.replace(/\$\{secret:[^}]+\}/g,r=>typeof SEC[r]==='string'?SEC[r]:r):Array.isArray(v)?v.map(res):v;
 const full=x=>String(x).replace(/[^\s"'=:,\[\]]*••••[^\s"',\]]*/g,'•••');
 const sh=(n,v)=>{if(v===undefined||v===null)return'∅';if(typeof v!=='string')return full(redactText(JSON.stringify(v).replace(/\$\{secret:[^}]+\}/g,'•••')));
  if(/^\$\{(?!secret:)[^}]+\}$/.test(v))return v;
  if(isRef(v)||(n&&(SECRET_NAME.test(n)||DIFF_SEC_HDR.test(n))&&!NONVAL.test(v)&&!/^\$\{(?!secret:)[^}]+\}$/.test(v)))return'•••';
  const t=v.replace(/\$\{secret:[^}]+\}/g,'•••');return keyLikeIn(t).length&&!/^[a-z]+:\/\//i.test(t)?'•••':full(redactText(t))};
 const same=(x,y)=>JSON.stringify(x===undefined?null:x)===JSON.stringify(y===undefined?null:y);
 for(const f of ['type','command','url','cwd'])if(!same(res(a[f]),res(b[f])))out.push(`${f}: ${sh(null,a[f])} → ${sh(null,b[f])}`);
 if(!same(res(a.args),res(b.args)))out.push(`args: ${sh(null,a.args||[])} → ${sh(null,b.args||[])}`);
 for(const o of ['env','headers','auth']){const x=a[o]&&typeof a[o]==='object'?a[o]:{},y=b[o]&&typeof b[o]==='object'?b[o]:{};
  for(const n of [...new Set([...Object.keys(x),...Object.keys(y)])]){if(same(res(x[n]),res(y[n])))continue;
   out.push(`${o==='headers'?'header':o} ${n}: ${sh(n,x[n])} → ${sh(n,y[n])}`)}}
 for(const f of new Set([...Object.keys(a),...Object.keys(b)]))if(!['type','command','url','cwd','args','env','headers','auth'].includes(f)&&!same(a[f],b[f]))out.push(`${f}: ${tr('khác')}`);
 return out}
// v4.10 (P49-3): tên trùng — trong cùng tệp (bản sau) hoặc trùng với máy chủ đã có — không bao giờ ghi đè âm thầm: Giữ cả hai (-2) / Thay thế (qua thẻ) / Bỏ qua
function makePlan(text0,file){const text=stripBom(text0),r=parseFile(text);if(r.fatal)return{file,fatal:r.fatal};
 const plan={file,add:[],skip:[],dup:[],rejected:[],oauthSkipped:[],renamed:[],secretCount:0};const seen={},taken=new Set(),shortOf={};
 const rec={members:[],dups:[]};let entries=Object.entries(r.servers);const SNM=new Map();for(const x of Object.keys(servers()))(SNM.get(safeName(x))||SNM.set(safeName(x),[]).get(safeName(x))).push(x);
 if(!jsonScan(text,rec)&&rec.dups.length){try{entries=rec.members.map(m=>[m.key,JSON.parse(text.slice(m.vs,m.ve))])}catch(e){}}
 const firstOf={};
 for(const [k0,s0] of entries){let k=nameKey(k0);const s=JSON.parse(JSON.stringify(s0));
  // v4.11 (quyết định 23/10): tên > 64 ký tự → rút gọn khi nhập (không từ chối, không treo) và báo trong kế hoạch
  if(nlen(k)>64){if(shortOf[k])k=shortOf[k];else{let c=cpSlice(k,64).replace(/[\s\-_.]+$/,'')||'srv';const used=[...Object.keys(seen),...Object.values(shortOf)]; /* chỉ tránh trùng với tên KHÁC trong cùng tệp; trùng với máy chủ đã có thì thành dòng “Trùng tên” để người dùng chọn */
   if(used.includes(c))c=uniqName(c,used); /* v4.12 (P411-6): trùng với máy chủ đã có → vẫn là dòng “Trùng tên” (Giữ cả hai / Thay thế / Bỏ qua) */shortOf[k]=c;plan.renamed.push({from:k,to:c});k=c}}
  if(firstOf[k]){const e=validateServer(k,s);if(e){plan.rejected.push({name:k,error:e});continue}
   plan.dup.push({name:k,src:'file',server:s,kind:kindOf(s),cmd:redact(s),old:redact(firstOf[k]),diff:srvDiff(firstOf[k],s),danger:isDanger(s)});continue}
  const sn=safeName(k);const clash=(SNM.get(sn)||[]).find(x=>x!==k);(SNM.get(sn)||SNM.set(sn,[]).get(sn)).push(k);
  if(clash){plan.rejected.push({name:k,error:tr('Tên "{0}" và "{1}" trùng nhau sau khi chuẩn hoá.',clash,k)});continue}seen[k]=1;
  const e=validateServer(k,s);if(e){plan.rejected.push({name:k,error:e});continue}firstOf[k]=s;
  if(s.auth){plan.oauthSkipped.push({name:k,server:s,error:oauthMsg(k)});continue}
  const cur=servers()[k];if(cur&&!srvDiff(cur,s).length&&!scanServer(k,s).length) /* v4.11 (ý quản lý — dòng trùng tên): so cả GIÁ TRỊ env/header (khoá so sau khi giải chỗ giữ), không chỉ tên */{plan.skip.push({name:k,error:tr('Đã có "{0}".',k)});continue}
  const slot=cur?null:importSlot(k,s,taken);if(slot)taken.add(slot);
  const x={name:k,slot,kind:kindOf(s),cmd:redact(s),server:s,danger:isDanger(s),why:s.url&&netKind(s.url)==='lan'?'lan':unpinned(s)?'pin':!inCatalog(s)?'cat':null};
  if(cur)plan.dup.push({...x,src:'app',old:redact(cur),diff:srvDiff(cur,s)});else plan.add.push(x)}
 planCount(plan);return plan}
function planCount(p){p.secretCount=[...p.add,...p.oauthSkipped,...p.dup].reduce((n,x)=>n+scanServer(x.name,x.server).length,0)}
const WHY={lan:'Địa chỉ http này nằm trong mạng nội bộ của bạn.',pin:'Lệnh này không ghim phiên bản. npx có thể tải mã mới.',cat:'Lệnh không thuộc danh mục Nâng cao.',catUrl:'Địa chỉ không thuộc danh mục Nâng cao.'};
const whyOf=x=>tr(WHY[x.why==='cat'&&x.kind!=='stdio'?'catUrl':x.why]||WHY.cat);
const secretLine=n=>tr('{0} khoá được chuyển vào kho khoá; mcp.json chỉ giữ {1}.',n,'${secret:…}');
// v4.12 (P411-7): nói rõ chuỗi bạn bỏ chọn sẽ lưu dạng chữ thường (chỉ ở đúng máy chủ và vị trí đó)
const plainLine=pl=>tr('{0} chuỗi bạn bỏ chọn sẽ lưu dạng chữ thường trong mcp.json: {1}.',pl.length,pl.slice(0,4).map(f=>f.name+' › '+f.loc).join('; ')+(pl.length>4?' …':''));
function uniqImport(k){const p=UI.plan;return uniqName(k,[...Object.keys(servers()),...p.add.map(x=>x.name),...p.dup.map(x=>x.name),...p.oauthSkipped.map(x=>x.name),...(p.rejected||[]).map(x=>x.name)])}
function dupKeep(i){const p=UI.plan,x=p.dup[i];if(!x)return;const nn=uniqImport(x.name),s=x.server,taken=new Set(p.add.map(a=>a.slot).filter(Boolean));const slot=importSlot(nn,s,taken);
 p.dup.splice(i,1);p.add.push({name:nn,slot,kind:kindOf(s),cmd:redact(s),server:s,danger:isDanger(s),renamedFrom:x.name,why:s.url&&netKind(s.url)==='lan'?'lan':unpinned(s)?'pin':!inCatalog(s)?'cat':null});planCount(p);render()}
function dupSkip(i){const p=UI.plan,x=p.dup[i];if(!x)return;p.dup.splice(i,1);p.skip.push({name:x.name,error:tr('Bỏ qua “{0}” (trùng tên, bạn chọn bỏ qua).',x.name)});planCount(p);render()}
async function dupReplace(i){const p=UI.plan,x=p.dup[i];if(!x)return;
 if(x.src==='app')return replaceOne(x.name);
 const a=await withCard(()=>({tool:'mcp_replace',logoHtml:letterTile(x.name,30),title:tr('Thay thế máy chủ “{0}”?',x.name),sub:p.file,fields:[[tr('Lệnh cũ'),x.old,1],[tr('Lệnh mới'),x.cmd,1]],
  lines:[tr('Mục sau trong tệp thay cho mục trước cùng tên. Chưa nhập gì cho đến khi bạn bấm Nhập.')],danger:true,alwaysLabel:null}));
 if(!a.ok)return render();const P=UI.plan;const j=P.dup.indexOf(x);if(j<0)return render();P.dup.splice(j,1);
 const tgt=P.add.find(y=>y.name===x.name)||P.dup.find(y=>y.name===x.name&&y.src==='app')||P.oauthSkipped.find(y=>y.name===x.name);
 if(tgt){tgt.server=x.server;tgt.cmd=x.cmd;tgt.kind=x.kind;tgt.danger=x.danger;tgt.replaced=true}else P.add.push({name:x.name,slot:null,kind:x.kind,cmd:x.cmd,server:x.server,danger:x.danger,why:null});
 P.skip.push({name:x.name,error:tr('“{0}”: dùng mục sau trong tệp (đã thay thế).',x.name)});planCount(P);render()}
function importPlan(){const p=UI.plan;if(!p)return'';const grp=(title,arr,f,tid)=>arr.length?`<div class="small" style="margin:10px 0 4px;color:var(--tx3);font-weight:600">${title}</div><div class="pl" ${tid?`data-testid="${tid}"`:''}>${capRows(arr.map(f))}</div>`:'';
 if(p.fatal)return `<div class="msg-bad" style="margin-top:10px">${tr('Tệp: {0}',esc(p.file))} — ${esc(p.fatal)}</div>`;
 return `<div class="impbox" data-testid="connect-apps-import-plan"><div class="small muted">${tr('Tệp: {0}',esc(p.file))} · ${tr('Máy chủ khớp một mục Nâng cao còn trống sẽ vào mục đó. Các máy chủ khác vào Của tôi.')}</div>
  ${p.msg?`<div class="msg-bad small" data-testid="import-blocked" style="margin:8px 0">${esc(p.msg)}</div>`:''}
  ${grp('✚ '+tr('Sẽ thêm ({0})',p.add.length),p.add,a=>`<div class="r">${a.slot?catLogo(ADVC(a.slot),22):letterTile(a.name,22)}<b>${esc(a.name)}</b>${a.renamedFrom?`<span class="st">${esc(tr('đổi tên từ {0}',a.renamedFrom))}</span>`:''}<span class="st">${a.kind}</span><code>${esc(a.cmd)}</code><span class="small dest">→ ${a.slot?tr('Nâng cao: {0}',tr(ADVC(a.slot).name)):tr('Của tôi')}</span>${a.danger?`<span class="danger-tag">⚠ ${esc(whyOf(a))}</span>`:''}</div>`)}
  ${grp('⇄ '+tr('Trùng tên ({0}) — chọn cách xử lý',p.dup.length),p.dup,(a,i)=>`<div class="r duprow2" data-testid="import-dup-${i}"><b>${esc(a.name)}</b><span class="st">${a.src==='file'?tr('trùng trong tệp'):tr('đã có trong AIVN')}</span>${a.diff?`<div class="ddiff" data-testid="import-dup-diff-${i}">${a.diff.length?`<span class="dd-h">${esc(tr('Khác nhau:'))}</span>`+a.diff.map(d=>`<code>${esc(d)}</code>`).join(''):`<span class="dd-h">${esc(tr('Giống hệt bản đang có — không có gì khác.'))}</span>`}</div>`:`<code>${esc(a.old)} → ${esc(a.cmd)}</code>`}<span class="duprow"><button class="btn sm" data-testid="import-dup-keep-${i}" onclick="dupKeep(${i})">${esc(tr('Giữ cả hai (đổi tên mới thành {0})',uniqImport(a.name)))}</button><button class="btn sm danger" data-testid="import-dup-replace-${i}" onclick="dupReplace(${i})">${tr('Thay thế')}</button><button class="btn sm ghost" data-testid="import-dup-skip-${i}" onclick="dupSkip(${i})">${tr('Bỏ qua')}</button></span></div>`,'import-dup')}
  ${grp('✎ '+tr('Đã rút gọn tên dài hơn 64 ký tự ({0})',(p.renamed||[]).length),p.renamed||[],a=>`<div class="r"><b>${esc(a.to)}</b><span class="st" title="${esc(a.from)}">${esc(tr('tên gốc {0} ký tự',nlen(a.from)))}</span></div>`,'import-renamed')}
  ${grp('↷ '+tr('Bỏ qua ({0})',p.skip.length),p.skip,a=>`<div class="r"><span class="muted">${esc(a.error)}</span></div>`)}
  ${grp('🔒 '+tr('Chưa hỗ trợ OAuth ({0})',p.oauthSkipped.length),p.oauthSkipped,a=>`<div class="r"><b>${esc(a.name)}</b><span class="muted small">${esc(a.error)}</span></div>`)}
  ${grp('✕ '+tr('Không nhập được ({0})',p.rejected.length),p.rejected,a=>`<div class="r"><b>${esc(a.name)}</b><span class="msg-bad">${esc(a.error)}</span></div>`,'import-rejected')}
  ${p.secretCount?`<div class="small" style="margin:6px 0" data-testid="import-secret-note">🔑 ${esc(tr('Tệp có {0} khoá viết thẳng. Trước khi nhập, AIVN hỏi bạn từng khoá có chuyển vào kho khoá không.',p.secretCount))}</div>`:''}
  ${p.dup.length?`<div class="small muted" style="margin:6px 0">${esc(tr('Mục trùng tên chưa chọn sẽ không được nhập.'))}</div>`:''}
  <div class="row" style="margin-top:8px"><span style="flex:1"></span>${p.add.length?`<button class="btn pri sm" data-testid="connect-apps-import-apply" onclick="applyImport()">${tr('Nhập các mục mới')} (${p.add.length})</button>`:`<span class="muted small">${tr('Không có mục mới để nhập.')}</span>`}</div></div>`}
// v4.10 (P49-10): danh sách dài chỉ vẽ 50 dòng đầu
const capRows=(rows,n=50)=>rows.length>n?rows.slice(0,n).join('')+`<div class="r muted small">${tr('+{0} máy chủ nữa',rows.length-n)}</div>`:rows.join('');
$('fileIn').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>262144){UI.plan={file:f.name,fatal:tr('Tệp mcp.json lớn hơn 256 KB.')};render();return}f.text().then(t=>{UI.plan=makePlan(t,f.name);render()});e.target.value=''};
async function applyImport(){const p=UI.plan;if(!p||!p.add.length)return;p.msg=null;
 const map={};for(const x of [...p.add,...p.oauthSkipped])map[x.name]=JSON.parse(JSON.stringify(x.server));
 const g=await secretGate(map,p.file);
 const add=p.add.filter(x=>!g.blocked.includes(x.name)),oa=p.oauthSkipped.filter(x=>!g.blocked.includes(x.name));
 if(!add.length){p.msg=blockMsg(g.blocked);return render()}
 const a=await withCard(()=>({tool:'mcp_import',logoHtml:letterTile('M',30),title:tr('Nhập {0} máy chủ từ mcp.json?',add.length),sub:p.file+(g.count?' · '+tr('Bước {0}/{1}',2,2):''),preview:capList(add.map(x=>[x.name,x.kind+' · → '+(x.slot?tr('Nâng cao: {0}',tr(ADVC(x.slot).name)):tr('Của tôi'))+(x.danger?' · ⚠ '+whyOf(x):'')])),
  lines:[TEST_LINE(),...(g.count?['🔑 '+secretLine(g.count)]:[]),...(g.plain&&g.plain.length?['⚠ '+plainLine(g.plain)]:[]),...(g.blocked.length?['⛔ '+blockMsg(g.blocked)]:[]),...(p.dup.length?[tr('Mục trùng tên chưa chọn sẽ không được nhập.')]:[])],details:capList(add.map(x=>[x.name,redact(map[x.name]),1])),warn:MCP_WARN(),danger:add.some(x=>x.danger),alwaysLabel:null}));
 if(!a.ok){p.msg=tr('Chưa nhập: bạn đã từ chối.');return render()}
 commitMoves(g.moves);
 const sd=n=>p.file===SAMPLE_NAME&&SAMPLE_DESC[n]?{sampleDesc:SAMPLE_DESC[n]}:{};
 for(const x of add){const s=map[x.name];placeholderEmpty(x.name,s);servers()[x.name]=s;DB.meta.servers[x.name]={catalogId:x.slot||null,approvedAt:now(),alwaysOn:false,...sd(x.renamedFrom||x.name)}}
 for(const x of oa){const s=map[x.name];placeholderEmpty(x.name,s);servers()[x.name]=s;DB.meta.servers[x.name]={catalogId:null,approvedAt:null,alwaysOn:false,...sd(x.name)};RT.state[x.name]='error';const nm=x.name;RT.err[nm]=()=>oauthMsg(nm)}
 const names=add.map(x=>x.name);saveSec();save();
 if(g.blocked.length||p.dup.length){UI.plan={file:p.file,add:[],skip:[],dup:p.dup,rejected:[],oauthSkipped:[],secretCount:0,msg:g.blocked.length?blockMsg(g.blocked):null};planCount(UI.plan);UI.sel='x:import';UI.mpane='detail'}
 else{UI.plan=null;UI.tab='installed';UI.mpane='list';UI.q='';UI.sel=names[0]||UI.sel}
 render();runTests(names)}
async function replaceOne(name){const p=UI.plan,x=p.dup.find(c=>c.name===name&&c.src==='app');if(!x)return;const s=JSON.parse(JSON.stringify(x.server));
 const g=await secretGate({[name]:s},p.file);if(g.blocked.length){p.msg=blockMsg(g.blocked);return render()}
 const a=await withCard(()=>({tool:'mcp_replace',logoHtml:srvLogo(name,30),title:tr('Thay thế máy chủ “{0}”?',name),sub:name+(g.count?' · '+tr('Bước {0}/{1}',2,2):''),fields:[[tr('Lệnh cũ'),x.old,1],[tr('Lệnh mới'),redact(s),1]],
  lines:[...(g.count?['🔑 '+secretLine(g.count)]:[]),...(g.plain&&g.plain.length?['⚠ '+plainLine(g.plain)]:[])],warn:tr('Tiến trình cũ sẽ bị dừng.'),danger:true,alwaysLabel:null}));
 if(!a.ok)return render();commitMoves(g.moves);stop(name);placeholderEmpty(name,s);
 const old=servers()[name],keep=new Set(allRefs(s));allRefs(old).forEach(v=>{if(!keep.has(v))delete SEC[v]});
 servers()[name]=s;const m=metaOf(name);m.approvedAt=now();m.alwaysOn=false;saveSec();save();
 p.dup=p.dup.filter(c=>c!==x);p.skip.push({name,error:tr('Đã thay thế "{0}".',name)});planCount(p);delete m.test;render();runTest(name)}
async function exportJson(){const ok=await modalAsk(tr('Xuất mcp.json…'),tr('Tệp xuất không có khoá bí mật. Máy khác phải nhập lại khoá.'),tr('Xuất'));if(!ok)return;
 const out={mcpServers:{}};for(const [k,s0] of Object.entries(servers())){if(s0.disabled)continue;const s=JSON.parse(JSON.stringify(s0));delete s.disabled;
  for(const f of ['env','headers'])if(s[f]){for(const [n,v] of Object.entries(s[f]))if(isRef(v))delete s[f][n];if(!Object.keys(s[f]).length)delete s[f]}out.mcpServers[k]=s} // chỗ giữ trong args/url vẫn là ${secret:…} (không phải khoá)
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{type:'application/json'}));a.download='mcp.json';a.click()}
// ===== v4.10: “Thêm máy chủ” ở Nâng cao — tên + lệnh/địa chỉ + biến KEY=VALUE; khoá trong lệnh/địa chỉ/biến đi qua thẻ khoá; tên trùng hỏi 3 lựa chọn =====
function splitCmd(line){const out=[];let cur='',q=null,has=false;for(let i=0;i<line.length;i++){const c=line[i];
  if(q){if(c===q)q=null;else if(c==='\\'&&q==='"'&&line[i+1]==='"'){cur+='"';i++}else cur+=c;continue}
  if(c==='"'||c==="'"){q=c;has=true;continue}if(/\s/.test(c)){if(cur||has){out.push(cur);cur='';has=false}continue}cur+=c}
 if(q)return null;if(cur||has)out.push(cur);return out}
function addPanel(){const A=UI.add||(UI.add={name:'',line:'',env:'',err:null});
 return `<div class="detail" data-testid="ca-add">${phead(emojiTile('＋',56),tr('Thêm máy chủ'),null,`<div class="small muted" style="margin-top:4px">${tr('Nhập lệnh hoặc địa chỉ của máy chủ MCP.')}</div>`)}
 <div class="addf"><label class="flab" for="addName">${tr('Tên')}</label><input class="inp" id="addName" data-testid="add-name" autocomplete="off" spellcheck="false" placeholder="thoi-tiet" oninput="UI.add.name=this.value">
 <label class="flab" for="addLine">${tr('Lệnh hoặc địa chỉ')}</label><input class="inp mono" id="addLine" data-testid="add-line" autocomplete="off" spellcheck="false" placeholder="npx -y @vidu/mcp@1.0.0 · https://…" oninput="UI.add.line=this.value" onkeydown="if(event.key==='Enter')addSave()">
 <label class="flab" for="addEnv">${tr('Biến môi trường, mỗi dòng KEY=VALUE (không bắt buộc)')}</label><textarea class="inp mono" id="addEnv" data-testid="add-env" rows="3" spellcheck="false" autocomplete="off" oninput="UI.add.env=this.value"></textarea></div>
 ${A.err?`<div class="msg-bad small" data-testid="add-err" style="margin:6px 0">${esc(A.err)}</div>`:''}
 <div class="pact">${BIG('pri',`data-act="add" onclick="addSave()"`,tr('Thêm…'))}</div>
 <div class="small muted" data-testid="add-note">🔑 ${tr('Nếu lệnh, địa chỉ hay biến có khoá, AIVN hỏi bạn trước khi chuyển từng khoá vào kho khoá.')}</div></div>`}
function modalChoice(title,body,btns){const back=focusKeyOf(document.activeElement);return new Promise(res=>{
 $('askModal').innerHTML=`<div class="mh"><h2>${esc(title)}</h2></div><div style="padding:0 18px 6px;color:var(--tx2)">${esc(body)}</div><div class="row askrow" style="padding:14px 18px;justify-content:flex-end;flex-wrap:wrap;gap:8px">${btns.map(([id,l,c],i)=>`<button class="btn ${c||''}" id="${i===0?'askNo':'ask_'+id}" data-testid="ask-${id}">${esc(l)}</button>`).join('')}</div>`;
 $('askModal').setAttribute('role','alertdialog');$('askModal').setAttribute('aria-modal','true');$('askBack').classList.add('open');
 const done=v=>{$('askBack').classList.remove('open');res(v);setTimeout(()=>{const e=back&&document.querySelector(back);if(e&&e.offsetParent!==null&&!e.disabled)e.focus()},0)};
 btns.forEach(([id],i)=>{$(i===0?'askNo':'ask_'+id).onclick=()=>done(i===0?null:id)});$('askNo').focus()})}
async function addSave(){const A=UI.add;if(!A)return;const err=m=>{A.err=m;render();setTimeout(()=>{const e=$('addLine');e&&e.focus()},0)};A.err=null;
 const name=(A.name||'').trim(),line=(A.line||'').trim();
 {const ne=nameErr(name);if(ne)return err(ne)} // v4.11: cùng quy tắc tên với nhập và trình sửa (Unicode, ≤ 64 ký tự)
 if(!line)return err(tr('Hãy nhập lệnh hoặc địa chỉ.'));
 let s;if(/^https?:\/\//i.test(line)){if(/\s/.test(line))return err(tr('Địa chỉ không được có khoảng trắng.'));s={url:line}}
 else{const p=splitCmd(line);if(!p||!p.length)return err(tr('Thiếu dấu ngoặc kép đóng.'));s={command:p[0],...(p.length>1?{args:p.slice(1)}:{})}}
 const env={};for(const l of (A.env||'').split('\n')){const t=l.trim();if(!t)continue;const i=t.indexOf('=');if(i<1)return err(tr('Dòng biến “{0}” phải có dạng KEY=VALUE.',redactText(t).slice(0,40)));env[t.slice(0,i).trim()]=t.slice(i+1).trim()}
 if(Object.keys(env).length)s[s.url?'headers':'env']=env;
 const v=validateServer(name,s);if(v)return err(v);
 let k=name,replace=false;const clash=Object.keys(servers()).find(x=>x!==k&&safeName(x)===safeName(k));
 if(clash&&!servers()[k])return err(tr('Tên "{0}" và "{1}" trùng nhau sau khi chuẩn hoá.',clash,k));
 if(servers()[k]){const nn=dupNewName(k);const c=await modalChoice(tr('Đã có máy chủ tên “{0}”',k),tr('Chọn cách xử lý. AIVN không bao giờ ghi đè âm thầm.'),[['skip',tr('Bỏ qua'),''],['keep',tr('Giữ cả hai (đổi tên mới thành {0})',nn),'pri'],['replace',tr('Thay thế'),'danger']]);
  if(!c||c==='skip'){A.err=tr('Chưa thêm: tên “{0}” đã có.',k);return render()}if(c==='keep')k=nn;else replace=true}
 const g=await secretGate({[k]:s},tr('Thêm máy chủ'));if(g.blocked.length)return err(blockMsg(g.blocked));
 const old=replace?servers()[k]:null;
 const a=await withCard(replace?()=>({tool:'mcp_replace',logoHtml:srvLogo(k,30),title:tr('Thay thế máy chủ “{0}”?',k),sub:k+(g.count?' · '+tr('Bước {0}/{1}',2,2):''),fields:[[tr('Lệnh cũ'),redact(old),1],[tr('Lệnh mới'),redact(s),1]],
   lines:[TEST_LINE(),...(g.count?['🔑 '+secretLine(g.count)]:[]),...(g.plain&&g.plain.length?['⚠ '+plainLine(g.plain)]:[])],warn:tr('Tiến trình cũ sẽ bị dừng.'),danger:true,alwaysLabel:null}):mcpSpec(k,s,{test:true}));
 if(!a.ok){A.err=tr('Chưa thêm: bạn đã từ chối.');return render()}
 commitMoves(g.moves);placeholderEmpty(k,s);
 if(replace){stop(k);const keep=new Set(allRefs(s));allRefs(old).forEach(r=>{if(!keep.has(r))delete SEC[r]});const m=metaOf(k);m.approvedAt=now();m.alwaysOn=false;delete m.test}
 else DB.meta.servers[k]={catalogId:null,approvedAt:now(),alwaysOn:false};
 servers()[k]=s;saveSec();save();log(k,'added from Nâng cao');UI.add=null;UI.sel=k;UI.mpane='detail';render();runTest(k)}
// v4.10 (P49-6): đóng khi mcp.json còn thay đổi chưa lưu → hỏi
async function closeCAAsk(){if(UI.ed&&UI.ed.text!==edBase()){const c=await modalChoice(tr('Còn thay đổi chưa lưu trong mcp.json'),tr('Nháp được giữ đến khi bạn tải lại trang (không ghi ra máy vì có thể chứa khoá).'),[['stay',tr('Ở lại'),''],['discard',tr('Bỏ thay đổi'),'danger'],['keep',tr('Giữ nháp và đóng'),'pri']]);
  if(!c)return;if(c==='discard'){UI.ed=null;UI.advMsg=null}}
 closeCA()}
function modalAsk(title,body,okLabel){const back=focusKeyOf(document.activeElement);return new Promise(res=>{$('askModal').innerHTML=`<div class="mh"><h2>${esc(title)}</h2></div><div style="padding:0 18px 6px;color:var(--tx2)">${esc(body)}</div>
  <div class="row" style="padding:14px 18px;justify-content:flex-end"><button class="btn" id="askNo">${tr('Huỷ')}</button><button class="btn pri" id="askYes">${esc(okLabel)}</button></div>`;
 $('askModal').setAttribute('role','alertdialog');$('askModal').setAttribute('aria-modal','true');
 $('askBack').classList.add('open');const done=v=>{$('askBack').classList.remove('open');res(v);setTimeout(()=>{const e=back&&document.querySelector(back);if(e&&e.offsetParent!==null&&!e.disabled)e.focus();else{const r=UI.open&&document.querySelector('#caList .li.cur .li-main');(r||$('caBtn')).focus()}},0)};$('askNo').onclick=()=>done(false);$('askYes').onclick=()=>done(true);$('askNo').focus()})}
function pickFolder(F){return new Promise(res=>{let sel=0;
 const draw=()=>{$('osDlg').innerHTML=`<div class="t">📁 ${tr('Chọn thư mục')}<span style="flex:1"></span><span style="color:#6b7280;font-size:11px">${tr('Mô phỏng hộp thoại chọn thư mục của hệ điều hành')}</span></div><div style="padding:6px 0">${F.map((f,i)=>`<div class="f ${i===sel?'on':''}" data-i="${i}">📁 ${f}</div>`).join('')}</div>
  <div class="b"><button id="osNo">${tr('Huỷ')}</button><button class="p" id="osYes">${tr('Chọn')}</button></div>`;
  $('osDlg').querySelectorAll('.f').forEach(e=>e.onclick=()=>{sel=+e.dataset.i;draw()});$('osNo').onclick=()=>done(null);$('osYes').onclick=()=>done(F[sel])};
 const done=v=>{$('osBack').classList.remove('open');res(v)};draw();$('osBack').classList.add('open');$('osYes').focus()})}
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
 // v4.9 (P48-8): nhãn thanh bên và tiêu đề trang theo ngôn ngữ giao diện
 document.querySelectorAll('.rail a').forEach(a=>{const t=a.querySelector('.tip');if(!t)return;t.dataset.vi=t.dataset.vi||t.textContent;t.textContent=tr(t.dataset.vi);a.setAttribute('aria-label',t.textContent)});
 document.title=tr('AIVN AGENT · Kết nối ứng dụng')+' v4.12 ('+tr('bản nháp')+')';
 $('o_draft').textContent='⚠ '+tr('Bản nháp 4.12 theo F-PLUGINS bản 2 + quyết định ngày 22/10 + báo cáo QA 4.11 (lượt 10)')+' · '+tr('Dữ liệu mẫu · lưu trong trình duyệt');$('o_draft').title=$('o_draft').textContent;
 $('o_v411').textContent=tr('Bản 4.11');$('o_v410').textContent=tr('Bản 4.10');$('o_v49').textContent=tr('Bản 4.9');$('o_v48').textContent=tr('Bản 4.8');$('o_v47').textContent=tr('Bản 4.7');$('o_v46').textContent=tr('Bản 4.6');$('o_v41').textContent=tr('Bản 4.1');$('o_v45').textContent=tr('Bản 4.5');$('o_v44').textContent=tr('Bản 4.4');$('o_v43').textContent=tr('Bản 4.3');$('o_v42').textContent=tr('Bản 4.2');$('o_restart').textContent='↻ '+tr('Mô phỏng mở lại AIVN');$('o_reset').textContent=tr('↺ Đặt lại');$('o_set').textContent='⚙ '+tr('Cài đặt (mô phỏng)');
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
 // v4.9 (P48-2): chấm dùng đúng màu chú thích (xanh lá = đã kết nối, xanh dương = đang chạy thử/kết nối/cài, đỏ = lỗi)
 $('mcpBadges').innerHTML=bk.map(k=>{const s=instOf(k)?'installing':st(k),t=esc(tr(PILL[s]||''));return `<button class="mb" data-testid="mcp-badge-${esc(k)}" title="${t}" aria-label="${esc(displayName(k))} · ${t}" onclick="openCA({scrollTo:'${esc(k)}'})">${srcLogo(k,16)}${esc(displayName(k))}<span class="d ${dotOf(s)}"></span></button>`}).join('');
 $('agentSettings').innerHTML=`<div class="small muted" style="margin:0 2px 10px;font-weight:600">${tr('Cài đặt AIVN AGENT')}</div>
  <div class="sec"><h4>🔌 ${tr('Kết nối ứng dụng')}</h4><div class="srow"><span class="badge ${n?'on':''}">${n?tr('{0} đã kết nối',n):tr('Chưa kết nối')}</span></div>
   <button class="btn sm pri" style="width:100%;justify-content:center" data-testid="connect-apps-settings" onclick="openCA({pane:'main'})">${tr('Kết nối ứng dụng')}</button>
   <div style="margin-top:8px"><a href="#" class="small" data-testid="connect-apps-settings-advanced" onclick="openCA({pane:'adv'});return false">${tr('Nâng cao')}</a></div>
   <div class="srow" style="margin-top:10px;align-items:flex-start"><div class="sw ${DB.master?'on':''}" id="mcpMaster" role="switch" tabindex="0" aria-checked="${DB.master}" onclick="toggleMaster()"></div><span>${tr('Cho AIVN AGENT dùng các ứng dụng đã kết nối')}</span></div></div>
  <div class="sec" data-testid="agent-folder-sec"><h4>📁 ${tr('Thư mục được phép')}</h4><div class="small muted" style="margin-bottom:4px">${tr('Thư mục AIVN AGENT được đọc và ghi. Excel có thư mục riêng.')}</div><div class="small" style="font-family:monospace;color:var(--tx2)" data-testid="agent-folder" title="${esc(agentFolder())}">${esc(agentFolder())}</div>
   <div class="row" style="margin-top:6px;gap:6px"><button class="btn sm" data-testid="agent-folder-change" onclick="changeAgentFolder()">${tr('Đổi thư mục')}</button><button class="btn sm ghost">＋ ${tr('Thêm thư mục')}</button></div></div>
  <div class="sec"><div class="srow"><div class="sw"></div>${tr('Cho phép truy cập mạng')}</div><div class="srow"><div class="sw"></div>${tr('Tự làm không hỏi')}</div><div class="small muted">${tr('Không áp dụng cho các ứng dụng đã kết nối.')}</div></div>
  <div class="sec"><h4>✅ ${tr('Luôn cho phép')}</h4><div class="small muted">${tr('Chưa có mục nào.')}</div></div>`}
function setLang(l){LANG=DB.lang=l;save();render();{const t=document.querySelector('.toast');if(t&&t._f)t.textContent=t._f()}{const u=$('uToast');if(u&&u._draw)u._draw()}if($('tplBack').classList.contains('open'))renderTpl();if(apCur)drawCard()}
function toggleMaster(){DB.master=!DB.master;save();if(!DB.master){Object.keys(servers()).forEach(stop);render()}else{render();startAll(true)}}
function startAll(onlyMcp){ // quyết định 22/10 lượt 2 (c): mọi kết nối chỉ chạy khi dùng lần đầu; máy chủ có “Luôn chạy sẵn” thì chạy ngay
 Object.keys(servers()).forEach(k=>{const m=metaOf(k),s=servers()[k];if(s.auth){RT.state[k]='error';RT.err[k]=()=>oauthMsg(k);return}
  if(!m.approvedAt||s.disabled){RT.state[k]='off';return}if(!DB.master){RT.state[k]='off';return}if(m.test&&m.test.ok===false){RT.state[k]='error';RT.err[k]=()=>testMsg(m.test);return}if(m.alwaysOn)start(k);else{RT.state[k]='waiting';log(k,'lazy: waiting for first use')}});save();render()}
function render(){renderPage();if(UI.open)renderCA()}
$('modelSel').onchange=e=>{DB.model=e.target.value;save();renderPage()};
$('sendBtn').onclick=()=>{if(toolCheck().block){toastT(()=>tr('Chưa gửi được: hãy tắt bớt ứng dụng trước.'));return}toastT(()=>tr('(bản mẫu) Tin nhắn không được gửi thật.'))};
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
// v4.9 (P48-5): giữ Tab trong hộp thoại trên cùng; Esc đóng từng lớp (menu ⋯ → chi tiết trên điện thoại → hộp thoại) và trả focus
const isOpen=id=>$(id).classList.contains('open');
function topModal(){for(const [b,m] of [['palBack','pal'],['osBack','osDlg'],['askBack','askModal'],['tplBack','tplModal'],['caBack','caModal']])if(isOpen(b))return $(m);return null}
function trapTab(e,box){const f=[...box.querySelectorAll('button,a[href],input,textarea,select,summary,[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled&&x.tabIndex>=0&&x.offsetParent!==null&&!x.closest('#caMenu'));if(!f.length)return;
 const a=document.activeElement,i=f.indexOf(a);if(!box.contains(a)||i<0){e.preventDefault();f[e.shiftKey?f.length-1:0].focus();return}
 if(e.shiftKey&&i===0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}
document.addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPal();return}
 if(isOpen('osBack')){if(e.key==='Escape'){e.preventDefault();$('osNo').click()}else if(e.key==='Tab')trapTab(e,$('osDlg'));return}
 if(isOpen('askBack')){if(e.key==='Escape'){e.preventDefault();$('askNo').click()}else if(e.key==='Tab')trapTab(e,$('askModal'));return}
 if(apCur&&!isOpen('palBack')){if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();apAnswer(true)}else if(e.key==='Escape'&&document.activeElement?.id!=='apRs'){e.preventDefault();apAnswer(false)}return}
 if(e.key==='Tab'){const m=topModal();if(m&&m.id!=='pal')trapTab(e,m);return}
 if(e.key==='Escape'){if(isOpen('palBack'))$('palBack').classList.remove('open');else if(isOpen('tplBack'))$('tplBack').classList.remove('open');
  else if(UI.open){if(UI.menu){e.preventDefault();closeMenu(true)}else if(narrow()&&UI.mpane==='detail'&&!(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName)&&document.activeElement.value)){e.preventDefault();mBack()}else{e.preventDefault();closeCAAsk()}}}});
document.addEventListener('mousedown',e=>{if(UI.menu&&!e.target.closest('#caMenu')&&!e.target.closest('.kebab'))closeMenu(false)},true);
addEventListener('resize',()=>{if(UI.menu)placeMenu()});
['caBack','tplBack','palBack'].forEach(id=>$(id).addEventListener('mousedown',e=>{if(e.target.id===id){if(id==='caBack')closeCAAsk();else $(id).classList.remove('open')}}));
$('caBtn').onclick=()=>openCA({pane:'main'});$('tplBtn').onclick=openTpl;
$('o_reset').onclick=()=>{localStorage.removeItem(KEY);localStorage.removeItem(VAULT);localStorage.removeItem(NK_KEY);location.reload()};
$('o_restart').onclick=restartSim;
RT.restarted=!!(DB.meta.connectors.biz||DB.meta.connectors.excel||Object.values(DB.meta.servers).some(m=>m.approvedAt));render();setTimeout(()=>startAll(false),window.FAST?0:400);
