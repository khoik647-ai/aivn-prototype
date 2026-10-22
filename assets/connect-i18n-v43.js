// Khoá là câu tiếng Việt (giống src/i18n/core.js trong thiết kế F-PLUGINS mục 11). Giá trị: [en, zh]. Số vào {0}, {1}.
const STR={
// --- vỏ bản mẫu
'Bản nháp theo thiết kế nháp F-PLUGINS (PR #1), chưa phải thiết kế chính thức':['Draft following the F-PLUGINS draft design (PR #1), not the official design','按照 F-PLUGINS 设计草案（PR #1）制作的草稿，并非正式设计'],
'Dữ liệu mẫu · lưu trong trình duyệt':['Sample data · saved in the browser','示例数据 · 保存在浏览器中'],
'Ngôn ngữ giao diện':['Interface language','界面语言'],
'↺ Đặt lại':['↺ Reset','↺ 重置'],
'Trò chuyện mới':['New chat','新对话'],
'Hôm nay':['Today','今天'],
'Xin chào! Mình là AIVN AGENT. Mình làm việc trên máy bạn và luôn hỏi trước khi làm việc quan trọng.':['Hi! I’m AIVN AGENT. I work on your computer and always ask before doing anything important.','你好！我是 AIVN AGENT。我在您的电脑上工作，做重要操作前一定会先询问。'],
'Nhắn cho AIVN AGENT…':['Message AIVN AGENT…','给 AIVN AGENT 发消息…'],
'Gửi':['Send','发送'],
'Mô hình: Qwen3-VL 4B · chạy trên máy':['Model: Qwen3-VL 4B · on this computer','模型：Qwen3-VL 4B · 本机运行'],
// --- 11.1
'Kết nối ứng dụng':['Connect apps','连接应用'],
'{0} đã kết nối':['{0} connected','已连接 {0} 个'],
'Chưa kết nối':['Not connected','未连接'],
'Tìm ứng dụng, máy chủ, công cụ…':['Search apps, servers, tools…','搜索应用、服务器、工具…'],
'Không thấy “{0}”. Bạn có thể nhập tệp mcp.json.':['Nothing matches “{0}”. You can import an mcp.json file.','没有找到“{0}”。可以导入 mcp.json 文件。'],
'Nhập mcp.json…':['Import mcp.json…','导入 mcp.json…'],
'Nâng cao: mcp.json':['Advanced: mcp.json','高级：mcp.json'],
'Lưu & kết nối lại':['Save and reconnect','保存并重新连接'],
'Xuất mcp.json…':['Export mcp.json…','导出 mcp.json…'],
'Kết nối':['Connect','连接'],
'Ngắt kết nối':['Disconnect','断开连接'],
'Kết nối lại':['Reconnect','重新连接'],
'Thử lại':['Try again','重试'],
'Gỡ':['Remove','移除'],
'Đang kết nối…':['Connecting…','正在连接…'],
'Đã kết nối':['Connected','已连接'],
'Đã tắt':['Off','已关闭'],
'Lỗi':['Error','出错'],
'Cần thiết lập':['Needs setup','需要设置'],
'Chưa có máy chủ riêng. Nhập mcp.json hoặc sửa ở phần Nâng cao.':['No servers of your own yet. Import mcp.json or edit it under Advanced.','还没有您自己的服务器。请导入 mcp.json，或在“高级”里修改。'],
'Tự kết nối khi mở AIVN':['Connect automatically when AIVN opens','打开 AIVN 时自动连接'],
'Mẫu: {0}':['Template: {0}','模板：{0}'],
'Đang dùng':['In use','正在使用'],
'Tạo mẫu của tôi':['Create my template','创建我的模板'],
'Lưu thành mẫu của tôi':['Save as my template','另存为我的模板'],
'Mẫu này dùng được với: {0}':['This template can use: {0}','此模板可以使用：{0}'],
// --- 5.3 tab
'Tất cả':['All','全部'],'Tệp':['Files','文件'],'Mạng':['Web','网络'],'Lập trình':['Coding','编程'],'Tri thức':['Knowledge','知识'],'Của tôi':['Mine','我的'],
// --- 5.4 danh mục
'Thư mục':['Folder','文件夹'],'Đọc trang web':['Read web pages','读取网页'],'Tìm kiếm Brave':['Brave Search','Brave 搜索'],'Hugging Face':['Hugging Face','Hugging Face'],'GitHub':['GitHub','GitHub'],
'Ghi nhớ MCP':['MCP memory','MCP 记忆'],'Giờ và múi giờ':['Time and time zones','时间和时区'],'Suy nghĩ từng bước':['Step-by-step thinking','分步思考'],
'Đọc và ghi một thư mục bạn chọn. Khác với “Thư mục được phép” của công cụ tệp AIVN.':['Read and write one folder you choose. Separate from AIVN’s allowed folders.','读写您选择的一个文件夹。与 AIVN 自己的允许文件夹不是一回事。'],
'Tiến trình này tự mở mạng, kể cả khi “Cho phép truy cập mạng” đang tắt.':['This program opens the network itself, even if “Allow network access” is off.','此程序会自行访问网络，即使“允许访问网络”是关闭的。'],
'Tìm trên Brave. Cần khoá API. Truy vấn tìm kiếm rời khỏi máy bạn.':['Search with Brave. Needs an API key. Search queries leave your computer.','使用 Brave 搜索。需要 API 密钥。搜索内容会离开这台电脑。'],
'Máy chủ từ xa của Hugging Face. Đối số công cụ và kết quả được gửi tới huggingface.co.':['Hugging Face’s remote server. Tool arguments and results are sent to huggingface.co.','Hugging Face 的远程服务器。工具参数和结果会发到 huggingface.co。'],
'Kho, issue và pull request trên GitHub. Cần mã truy cập.':['Repos, issues, and pull requests on GitHub. Needs an access token.','GitHub 上的仓库、issue 和 pull request。需要访问令牌。'],
'Bộ nhớ của riêng máy chủ MCP này, không ghi vào mục Ghi nhớ của AIVN.':['This MCP server’s own memory, not AIVN’s Memory.','这是此 MCP 服务器自己的记忆，不会写入 AIVN 的“记忆”。'],
'Xem giờ theo múi giờ.':['Look up the time in a time zone.','按时间区域查看时间。'],
'Máy chủ giữ các bước suy nghĩ trung gian.':['The server keeps intermediate thinking steps.','服务器保存中间的思考步骤。'],
'Máy chủ MCP trong mcp.json của bạn.':['An MCP server from your mcp.json.','来自您的 mcp.json 的 MCP 服务器。'],
// --- thẻ máy chủ
'{0} công cụ':['{0} tools','{0} 个工具'],'Công cụ':['Tools','工具'],'Nhật ký (60 dòng cuối)':['Log (last 60 lines)','日志（最后 60 行）'],
'Máy chủ MCP là chương trình chạy trên máy bạn hoặc dịch vụ bên ngoài. Chúng có thể đọc và ghi dữ liệu. Chỉ thêm máy chủ bạn tin tưởng.':['MCP servers are programs that run on your computer or outside services. They can read and write data. Only add servers you trust.','MCP 服务器是在您电脑上运行的程序或外部服务，可以读写数据。只添加您信任的服务器。'],
'Dán khoá vào đây':['Paste the key here','在此粘贴密钥'],'Tiếp tục':['Continue','继续'],'Huỷ':['Cancel','取消'],
'Khoá được mã hoá bằng kho khoá hệ điều hành, không ghi vào mcp.json.':['The key is encrypted with the OS key store and never written to mcp.json.','密钥由操作系统密钥库加密，不会写入 mcp.json。'],
'Tuỳ chọn: chữ “Bearer …”. Bỏ trống vẫn kết nối được, nhưng yêu cầu có thể bị từ chối.':['Optional: “Bearer …”. You can leave it empty, but requests may be refused.','可选：“Bearer …”。可以留空，但请求可能被拒绝。'],
'Công tắc “Cho AIVN AGENT dùng công cụ MCP” đang tắt. Bật lại trong cài đặt để kết nối.':['“Let AIVN AGENT use MCP tools” is off. Turn it on in settings to connect.','“允许 AIVN AGENT 使用 MCP 工具”已关闭。请在设置中打开后再连接。'],
'Chưa được duyệt: bấm Kết nối để xin phép.':['Not approved: click Connect to ask for permission.','未批准：点击“连接”以请求许可。'],
// --- chọn thư mục (mô phỏng hộp thoại hệ điều hành)
'Chọn thư mục':['Choose folder','选择文件夹'],'Chọn':['Select','选择'],
'Mô phỏng hộp thoại chọn thư mục của hệ điều hành':['Simulated OS folder picker','模拟系统文件夹选择框'],
// --- 11.2 thẻ xin phép
'Cho phép kết nối “{0}”?':['Allow “{0}” to connect?','允许连接“{0}”？'],
'Tự kết nối lại máy chủ này khi mở AIVN':['Connect this server again when AIVN opens','打开 AIVN 时重新连接此服务器'],
'Nhập {0} máy chủ từ mcp.json?':['Import {0} servers from mcp.json?','从 mcp.json 导入 {0} 个服务器？'],
'Tự kết nối các máy chủ này khi mở AIVN':['Connect these servers when AIVN opens','打开 AIVN 时连接这些服务器'],
'Thay thế máy chủ “{0}”?':['Replace server “{0}”?','替换服务器“{0}”？'],
'Đã tách {0} khoá bí mật ra khỏi tệp. Chúng được mã hoá bằng kho khoá hệ điều hành và không ghi dạng chữ vào mcp.json.':['Moved {0} secrets out of the file. They are encrypted with the operating system key store and are not written in mcp.json as plain text.','已从文件中取出 {0} 个密钥。它们由操作系统密钥库加密，不会以明文写入 mcp.json。'],
'Dữ liệu gửi tới máy chủ này rời khỏi máy bạn.':['Data sent to this server leaves your computer.','发给此服务器的数据会离开您的电脑。'],
'Gỡ máy chủ “{0}”?':['Remove server “{0}”?','移除服务器“{0}”？'],
'Công cụ của máy chủ này sẽ biến mất. Các mục “Luôn cho phép” của nó cũng bị xoá. Khoá bí mật của máy chủ này bị xoá khỏi máy.':['This server’s tools will disappear. Its “Always allow” entries are removed too. Its secrets are deleted from this computer.','此服务器的工具会消失。“始终允许”也会一并移除。此服务器的密钥会从这台电脑删除。'],
'Loại':['Type','类型'],'Lệnh':['Command','命令'],'Địa chỉ':['Address','地址'],'Khoá bí mật':['Secrets','密钥'],'không có':['none','无'],
'Chương trình này chạy trên máy bạn.':['This program runs on your computer.','此程序在您的电脑上运行。'],
'Thư mục này khác “Thư mục được phép” của AIVN.':['This folder is separate from AIVN’s allowed folders.','此文件夹与 AIVN 的允许文件夹不是一回事。'],
'Không có mã truy cập: máy chủ có thể từ chối yêu cầu.':['No access token: the server may refuse requests.','没有访问令牌：服务器可能拒绝请求。'],
'Cho phép máy chủ này tự chạy mỗi khi mở AIVN.':['Allow this server to start by itself whenever AIVN opens.','允许此服务器在每次打开 AIVN 时自动运行。'],
'Lệnh không thuộc danh mục':['Command not in the catalog','不在目录中的命令'],
'Lệnh cũ':['Old command','旧命令'],'Lệnh mới':['New command','新命令'],'Tiến trình cũ sẽ bị dừng.':['The old process will be stopped.','旧进程将被停止。'],
'Cho phép':['Allow','允许'],'Từ chối':['Deny','拒绝'],'Từ chối kèm lý do':['Deny with reason','拒绝并说明原因'],'Lý do…':['Reason…','原因…'],
'Tự từ chối sau {0}':['Auto-deny in {0}','{0} 后自动拒绝'],'Thẻ xin phép':['Permission card','许可卡'],
// --- 6 nhập
'Chọn tệp mcp.json để xem tóm tắt trước khi nhập.':['Choose an mcp.json file to review a summary before importing.','选择 mcp.json 文件，先查看摘要再导入。'],
'Chọn tệp…':['Choose file…','选择文件…'],'(bản mẫu) Dùng tệp ví dụ':['(prototype) Use sample file','（原型）使用示例文件'],
'← Quay lại':['← Back','← 返回'],'Tệp: {0}':['File: {0}','文件：{0}'],
'Sẽ thêm ({0})':['Will add ({0})','将添加（{0}）'],'Bỏ qua ({0})':['Skipped ({0})','跳过（{0}）'],
'Trùng tên, khác nội dung ({0})':['Same name, different content ({0})','同名但内容不同（{0}）'],'Thay thế':['Replace','替换'],
'Không nhập được ({0})':['Not imported ({0})','未导入（{0}）'],'Chưa hỗ trợ OAuth ({0})':['OAuth not supported yet ({0})','暂不支持 OAuth（{0}）'],
'Nhập các mục mới':['Import new entries','导入新条目'],'Không có mục mới để nhập.':['Nothing new to import.','没有可导入的新条目。'],
// --- 11.3 lỗi
'mcp.json phải là một đối tượng JSON.':['mcp.json must be a JSON object.','mcp.json 必须是一个 JSON 对象。'],
'Thiếu “mcpServers”. Nếu tệp dùng khoá “servers”, hãy đổi thành “mcpServers”.':['Missing “mcpServers”. If the file uses the key “servers”, rename it to “mcpServers”.','缺少“mcpServers”。如果文件用的是“servers”，请改成“mcpServers”。'],
'Máy chủ “{0}” chỉ được có command hoặc url.':['Server “{0}” must have either command or url, not both.','服务器“{0}”只能有 command 或 url 其中之一。'],
'“url” của “{0}” dùng http thì chỉ được trỏ tới máy này (localhost). Hãy dùng https.':['An http “url” for “{0}” can only point at this computer (localhost). Use https.','“{0}”的 http“url”只能指向本机（localhost）。请改用 https。'],
'Tên “{0}” và “{1}” trùng nhau sau khi chuẩn hoá.':['The names “{0}” and “{1}” are the same once normalised.','名称“{0}”和“{1}”规范化之后相同。'],
'AIVN chưa hỗ trợ đăng nhập OAuth (trường auth) của máy chủ “{0}”.':['AIVN does not support OAuth sign-in (the auth field) for server “{0}” yet.','AIVN 尚不支持服务器“{0}”的 OAuth 登录（auth 字段）。'],
'Tệp mcp.json lớn hơn 256 KB.':['The mcp.json file is larger than 256 KB.','mcp.json 文件超过 256 KB。'],
'Tệp xuất không có khoá bí mật. Máy khác phải nhập lại khoá.':['The exported file has no secrets. Another computer will need the keys entered again.','导出的文件不含密钥。换一台电脑需要重新填写密钥。'],
'Đã có “{0}”.':['“{0}” is already there.','已经有“{0}”。'],
// câu validate đang có (tạm đặt chữ, xem phần giả định)
'Tệp không phải JSON hợp lệ.':['The file is not valid JSON.','文件不是有效的 JSON。'],
'Máy chủ “{0}” cần command hoặc url.':['Server “{0}” needs a command or url.','服务器“{0}”需要 command 或 url。'],
'“args” của “{0}” phải là mảng chuỗi.':['“args” for “{0}” must be an array of strings.','“{0}”的“args”必须是字符串数组。'],
'“env” của “{0}” phải là đối tượng.':['“env” for “{0}” must be an object.','“{0}”的“env”必须是对象。'],
'Tên máy chủ phải dài 1–64 ký tự.':['Server names must be 1–64 characters.','服务器名称须为 1–64 个字符。'],
'“type” của “{0}” chỉ được là “sse”.':['“type” for “{0}” can only be “sse”.','“{0}”的“type”只能是“sse”。'],
'“timeout” của “{0}” phải từ 1.000 đến 600.000 ms.':['“timeout” for “{0}” must be 1,000–600,000 ms.','“{0}”的“timeout”须在 1,000 到 600,000 毫秒之间。'],
// --- nâng cao
'Đã lưu.':['Saved.','已保存。'],'Không lưu: {0}':['Not saved: {0}','未保存：{0}'],
'Đã lưu. {0} máy chủ cần cho phép lại trước khi chạy.':['Saved. {0} server(s) need approval again before they run.','已保存。{0} 个服务器需要重新许可才能运行。'],
'Đổi lệnh, đối số, địa chỉ, đầu mục hoặc tên biến thì máy chủ mất duyệt và phải qua thẻ xin phép.':['Changing a command, args, url, headers or variable names removes approval; the server needs a permission card again.','修改命令、参数、地址、请求头或变量名会取消许可，服务器需要重新通过许可卡。'],
'Xuất':['Export','导出'],'Lỗi tệp: {0}':['File error: {0}','文件错误：{0}'],
// --- mẫu
'Mẫu AIVN AGENT':['AIVN AGENT templates','AIVN AGENT 模板'],'Dùng mẫu này':['Use this template','使用此模板'],
'Gợi ý kết nối: {0}':['Suggested connection: {0}','建议连接：{0}'],'Đổi tên':['Rename','重命名'],'Sửa':['Edit','编辑'],'Xoá':['Delete','删除'],
'Tên mẫu':['Template name','模板名称'],'Đoạn vai trò':['Role text','角色说明'],'Câu gợi ý (mỗi dòng một câu, tối đa 6)':['Starter prompts (one per line, up to 6)','开场提示（每行一句，最多 6 句）'],
'Lưu':['Save','保存'],'Mẫu của tôi':['My templates','我的模板'],'Mẫu gắn sẵn':['Built-in','内置模板'],'Bản sao của {0}':['Copy of {0}','{0} 的副本'],
'Mẫu chỉ thêm một đoạn vai trò vào lời nhắc. Mẫu không bật công tắc và không tự kết nối ứng dụng. Khác với cấu hình mẫu của Trò chuyện.':['A template only adds a role paragraph to the prompt. It never turns on switches or connects apps. Separate from Chat presets.','模板只会在提示中加入一段角色说明，不会打开开关，也不会自动连接应用。与“聊天”的预设不同。'],
'Lượt sau sẽ dùng mẫu mới.':['The next turn uses the new template.','下一轮对话将使用新模板。'],
'Tên tối đa 40 ký tự, đoạn vai trò tối đa 4.000 ký tự.':['Name up to 40 characters, role text up to 4,000.','名称最多 40 个字符，角色说明最多 4,000 个字符。'],
'Trợ lý tổng quát':['General assistant','通用助手'],'Lập trình viên':['Coder','编程助手'],'Đọc tài liệu':['Read documents','阅读文档'],'Tra cứu':['Research','查资料'],'Thư ký tệp':['File clerk','文件助理'],
'Cách làm việc mặc định, không thêm vai trò.':['Default behaviour, no extra role.','默认工作方式，不添加角色。'],
'Đọc và sửa tệp trong thư mục được phép, nói ngắn.':['Read and edit files in allowed folders, keep it short.','在允许的文件夹里读写文件，回答从简。'],
'Trả lời câu hỏi về tệp đính kèm, có trích chỗ tìm thấy.':['Answers questions about attached files, quoting where it found them.','回答与附件有关的问题，并引用出处。'],
'Tìm trên mạng khi mạng đang bật và ghi rõ địa chỉ nguồn.':['Searches the web when network access is on and cites the addresses.','在允许联网时上网搜索并注明来源地址。'],
'Liệt kê trước khi ghi; ghi đè và xoá vẫn chờ thẻ xin phép.':['Lists before writing; overwriting and deleting still wait for a permission card.','写入前先列出；覆盖和删除仍需许可卡。'],
'Xem cấu trúc thư mục được phép và tóm tắt dự án.':['Look through the allowed folder and summarise the project.','查看允许的文件夹并概括这个项目。'],
'Tìm chỗ gây lỗi trong tệp tôi chỉ ra.':['Find the bug in the file I point to.','在我指定的文件里找出错误。'],
'Tóm tắt tệp đính kèm trong 5 ý.':['Summarise the attached file in 5 points.','用 5 点概括附件。'],
'Trong tài liệu này, hạn nộp là ngày nào?':['In this document, what is the deadline?','这份文件里的截止日期是哪天？'],
'Tìm 3 nguồn mới về Qwen3-VL và tóm tắt.':['Find 3 recent sources about Qwen3-VL and summarise them.','找 3 篇关于 Qwen3-VL 的最新资料并总结。'],
'Liệt kê các tệp lớn nhất trong thư mục được phép.':['List the largest files in the allowed folder.','列出允许文件夹里最大的文件。'],
'Sắp xếp ảnh chụp màn hình theo tháng.':['Sort screenshots into folders by month.','按月份整理截图。'],
// --- cài đặt bên phải
'Cài đặt AIVN AGENT':['AIVN AGENT settings','AIVN AGENT 设置'],
'Cho AIVN AGENT dùng công cụ MCP':['Let AIVN AGENT use MCP tools','允许 AIVN AGENT 使用 MCP 工具'],
'Thư mục được phép':['Allowed folders','允许的文件夹'],'Thêm thư mục':['Add folder','添加文件夹'],
'Cho phép truy cập mạng':['Allow network access','允许访问网络'],'Tự làm không hỏi':['Act without asking','无需询问直接执行'],
'Không bao giờ áp dụng cho công cụ MCP.':['Never applies to MCP tools.','从不适用于 MCP 工具。'],
'Luôn cho phép':['Always allow','始终允许'],'Chưa có công cụ nào.':['No tools yet.','还没有工具。'],
// --- Ctrl+K
'Gõ lệnh…':['Type a command…','输入命令…'],'Khám phá mô hình':['Discover models','发现模型'],'Kinh doanh':['Business','业务'],'Lệnh nhanh':['Commands','命令'],
// --- v4.2 (hướng mới) ---
'Bản nháp 4.2 theo hướng mới, chờ PR tài liệu cập nhật':['Draft 4.2 following the new direction, awaiting the design-doc update PR','草稿 4.2，按新方向制作，等待设计文档更新的 PR'],
'Bản 4.1 (kỹ thuật, để so sánh)':['Version 4.1 (technical, for comparison)','4.1 版（技术版，供对比）'],
'Mô hình:':['Model:','模型：'],'ngữ cảnh {0}':['context {0}','上下文 {0}'],
'Năng suất':['Productivity','效率'],'Giao tiếp':['Communication','沟通'],'Bán hàng':['Sales','销售'],'Tài chính':['Finance','财务'],
'Nâng cao':['Advanced','高级'],'Tìm ứng dụng…':['Search apps…','搜索应用…'],
'AIVN Kinh doanh':['AIVN Business','AIVN 业务'],
'Hỏi nhanh về sản phẩm, tồn kho, đơn bán và hoá đơn trong mục Kinh doanh của AIVN.':['Ask about products, stock, sales orders and invoices in AIVN Business.','快速查询 AIVN 业务中的产品、库存、销售订单和发票。'],
'Dữ liệu nằm trên máy bạn, không gửi ra ngoài.':['Your data stays on this computer and is not sent anywhere.','数据保存在您的电脑上，不会发送出去。'],
'Đọc và cập nhật tệp Excel trong thư mục bạn chọn: xem bảng, tính tổng, thêm dòng. Không cần cài Excel.':['Read and update Excel files in a folder you choose: view tables, add up totals, add rows. Excel does not need to be installed.','读取和更新您所选文件夹中的 Excel 文件：查看表格、求和、添加行。无需安装 Excel。'],
'Chạy trên máy bạn. Tệp không gửi ra ngoài.':['Runs on your computer. Files are not sent anywhere.','在您的电脑上运行。文件不会发送出去。'],
'Đọc và trả lời tin nhắn khách hàng gửi tới Zalo OA của cửa hàng.':['Read and reply to customer messages sent to your shop’s Zalo OA.','阅读并回复客户发到店铺 Zalo OA 的消息。'],
'Tóm tắt thư mới và soạn thư trả lời nháp.':['Summarize new mail and draft replies.','总结新邮件并起草回复。'],
'Tìm và đọc tài liệu, bảng tính trong Google Drive.':['Find and read docs and spreadsheets in Google Drive.','在 Google Drive 中查找和阅读文档、表格。'],
'Xem lịch, nhắc lịch hẹn và đặt lịch họp.':['View your calendar, get reminders and schedule meetings.','查看日历、提醒约会并安排会议。'],
'Đọc trang và ghi chú vào Notion.':['Read pages and take notes in Notion.','阅读页面并在 Notion 中记笔记。'],
'Xem sản phẩm, giá và tồn kho':['See products, prices and stock','查看产品、价格和库存'],'Xem đơn bán và hoá đơn':['See sales orders and invoices','查看销售订单和发票'],'Tạo đơn bán nháp':['Create draft sales orders','创建销售订单草稿'],
'Mở và đọc tệp Excel trong thư mục bạn chọn':['Open and read Excel files in the folder you choose','打开并读取您所选文件夹中的 Excel 文件'],'Thêm hoặc sửa ô, tạo trang tính mới':['Add or edit cells, create new sheets','添加或修改单元格，新建工作表'],
'Trên máy':['On this computer','本机'],'Sắp có':['Coming soon','即将推出'],'Báo tôi khi có':['Notify me','上线时通知我'],
'Đã ghi nhận. AIVN sẽ báo khi {0} dùng được.':['Noted. AIVN will let you know when {0} is available.','已记录。{0} 可用时 AIVN 会通知您。'],
'Cần xem kỹ':['Review carefully','请仔细查看'],'Chi tiết':['Details','详情'],'Ẩn chi tiết':['Hide details','隐藏详情'],
'Cho phép AIVN AGENT dùng “{0}”?':['Allow AIVN AGENT to use “{0}”?','允许 AIVN AGENT 使用“{0}”吗？'],
'AIVN AGENT sẽ có thể:':['AIVN AGENT will be able to:','AIVN AGENT 将可以：'],
'Mỗi lần ghi hoặc sửa dữ liệu, AIVN AGENT vẫn hỏi bạn trước.':['AIVN AGENT still asks you before each write or edit.','每次写入或修改数据前，AIVN AGENT 仍会先询问您。'],
'Công cụ gắn sẵn trong AIVN':['Built into AIVN','AIVN 内置工具'],'không có (không chạy chương trình ngoài)':['none (no external program runs)','无（不运行外部程序）'],
'Tự kết nối lại ứng dụng này khi mở AIVN':['Reconnect this app automatically when AIVN opens','打开 AIVN 时自动重新连接此应用'],
'Địa chỉ http này nằm trong mạng nội bộ của bạn.':['This http address is on your local network.','此 http 地址位于您的局域网内。'],
'Lệnh này không ghim phiên bản. npx có thể tải mã mới.':['This command does not pin a version. npx can download new code.','此命令没有固定版本。npx 可能会下载新代码。'],
'“url” của “{0}” dùng http ra ngoài mạng nội bộ. Hãy dùng https, hoặc một địa chỉ trong mạng nội bộ.':['The http “url” for “{0}” points outside the local network. Use https, or an address on the local network.','“{0}”的 http“url”指向局域网之外。请改用 https，或使用局域网内的地址。'],
'Chưa hỗ trợ':['Not supported yet','暂不支持'],'Chưa hỗ trợ đăng nhập OAuth':['OAuth sign-in not supported yet','暂不支持 OAuth 登录'],'Chưa được duyệt':['Not approved yet','尚未批准'],
'Có sẵn':['Built-in','内置'],'Do bạn thêm':['Added by you','由您添加'],
'Máy chủ MCP bạn tự thêm hoặc bật trong Nâng cao. Dành cho người dùng quen kỹ thuật.':['MCP servers you added yourself or turned on in Advanced. For technical users.','您自行添加或在“高级”中开启的 MCP 服务器。适合熟悉技术的用户。'],
'Thêm máy chủ có sẵn':['Add a built-in server','添加内置服务器'],'Không thấy “{0}”.':['Nothing matches “{0}”.','没有找到“{0}”。'],
'Có {0} máy chủ MCP khớp trong Nâng cao.':['{0} MCP servers in Advanced match.','“高级”中有 {0} 个 MCP 服务器匹配。'],'Xem trong Nâng cao':['View in Advanced','在“高级”中查看'],
'Mọi kết nối cần bạn cho phép. Việc ghi hoặc sửa dữ liệu luôn hỏi lại trước.':['Every connection needs your permission. Writing or editing data always asks first.','每个连接都需要您的许可。写入或修改数据前总会再次询问。'],
'Máy chủ MCP, lệnh và tệp mcp.json — dành cho người dùng quen kỹ thuật.':['MCP servers, commands and the mcp.json file — for technical users.','MCP 服务器、命令和 mcp.json 文件——适合熟悉技术的用户。'],
'Tìm máy chủ, công cụ…':['Search servers, tools…','搜索服务器、工具…'],
'{0} chỉ hiện ở tab riêng của chúng cho đến khi đã có trong mcp.json.':['{0} only appear in their own tabs until they are in mcp.json.','{0} 在加入 mcp.json 之前只显示在各自的标签中。'],
'Vẫn giữ trong mcp.json, không chạy.':['Kept in mcp.json, not run.','保留在 mcp.json 中，不运行。'],
'Một mẫu cho cả hồ sơ: đổi mẫu là đổi cho mọi cuộc trò chuyện, từ lượt sau.':['One template per profile: changing it applies to every conversation from the next turn.','每个档案一个模板：更换后从下一轮起对所有对话生效。'],
'Mô hình này đang thấy {0} công cụ, nhiều hơn mức hợp với ngữ cảnh {1}. Hãy tắt bớt máy chủ. AIVN không tự bỏ công cụ.':['This model can see {0} tools, more than fits context {1}. Turn some servers off. AIVN does not drop tools on its own.','此模型能看到 {0} 个工具，超过上下文 {1} 所能承受的。请关闭一些服务器。AIVN 不会自行丢掉工具。'],
'Mô tả công cụ (khoảng {0} token) vượt ngân sách {1} token. Lượt sau chưa bắt đầu cho đến khi bạn tắt bớt.':['Tool descriptions (about {0} tokens) exceed the {1}-token budget. The next turn will not start until you turn some off.','工具描述（约 {0} 个 token）超出 {1} 个 token 的预算。在您关闭一些之前，下一轮不会开始。'],
'Công cụ của AIVN AGENT':['AIVN AGENT’s own tools','AIVN AGENT 自带工具'],'Tắt':['Turn off','关闭'],'Mở Kết nối ứng dụng':['Open Connect apps','打开“连接应用”'],'Đã hiểu':['Got it','知道了'],
'Chưa bắt đầu lượt: hãy tắt bớt máy chủ trước.':['Turn not started: turn some servers off first.','未开始本轮：请先关闭一些服务器。'],
'(bản mẫu) Tin nhắn không được gửi thật.':['(prototype) The message is not actually sent.','（原型）消息不会真正发送。'],
'Máy chủ có sẵn':['Built-in servers','内置服务器'],'Sửa mcp.json':['Edit mcp.json','编辑 mcp.json'],
'Gmail':['Gmail','Gmail'],'Google Calendar':['Google Calendar','Google 日历'],'Google Drive':['Google Drive','Google 云端硬盘'],'Microsoft Excel':['Microsoft Excel','Microsoft Excel'],'Notion':['Notion','Notion'],'Zalo OA':['Zalo OA','Zalo OA'],
};
let LANG='vi';
function tr(k,...a){let s=k;if(LANG!=='vi'){const v=STR[k];if(v)s=v[LANG==='en'?0:1];else console.warn('i18n thiếu:',k)}return s.replace(/\{(\d)\}/g,(m,i)=>a[+i])}
const foldVi=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();

// ---- PR #5 (F-PLUGINS bản 2): câu trong bảng mục 11 của tài liệu được chép nguyên văn; phần còn lại do bản mẫu viết ----
const STR_PR5_DOC={
"Kết nối ứng dụng": [
"Connect apps",
"连接应用"
],
"{0} đã kết nối": [
"{0} connected",
"已连接 {0} 个"
],
"Chưa kết nối": [
"Not connected",
"未连接"
],
"Tìm ứng dụng…": [
"Search apps…",
"搜索应用…"
],
"Không thấy “{0}”.": [
"Nothing matches “{0}”.",
"没有找到“{0}”。"
],
"Nâng cao": [
"Advanced",
"高级"
],
"Nhập mcp.json…": [
"Import mcp.json…",
"导入 mcp.json…"
],
"Nâng cao: mcp.json": [
"Advanced: mcp.json",
"高级：mcp.json"
],
"Lưu & kết nối lại": [
"Save and reconnect",
"保存并重新连接"
],
"Xuất mcp.json…": [
"Export mcp.json…",
"导出 mcp.json…"
],
"Kết nối": [
"Connect",
"连接"
],
"Ngắt kết nối": [
"Disconnect",
"断开连接"
],
"Kết nối lại": [
"Reconnect",
"重新连接"
],
"Thử lại": [
"Try again",
"重试"
],
"Gỡ": [
"Remove",
"移除"
],
"Đang kết nối…": [
"Connecting…",
"正在连接…"
],
"Đã kết nối": [
"Connected",
"已连接"
],
"Đã tắt": [
"Off",
"已关闭"
],
"Lỗi": [
"Error",
"出错"
],
"Cần thiết lập": [
"Needs setup",
"需要设置"
],
"Sắp có": [
"Coming soon",
"即将推出"
],
"Chờ đăng nhập Google.": [
"Waiting on Google sign-in.",
"等待 Google 登录。"
],
"Chưa có ứng dụng trong nhóm này.": [
"Nothing in this group yet.",
"这个分组里还没有应用。"
],
"Chưa kết nối ứng dụng nào.": [
"No apps connected yet.",
"还没有连接任何应用。"
],
"Năng suất": [
"Productivity",
"效率"
],
"Giao tiếp": [
"Communication",
"沟通"
],
"Bán hàng": [
"Sales",
"销售"
],
"Tài chính": [
"Finance",
"财务"
],
"Của tôi": [
"Mine",
"我的"
],
"Tất cả": [
"All",
"全部"
],
"Chi tiết": [
"Details",
"详情"
],
"Lệnh": [
"Command",
"命令"
],
"Loại": [
"Kind",
"类型"
],
"Mô hình này đang thấy {0} công cụ, nhiều hơn mức hợp với ngữ cảnh {1}. Hãy tắt bớt máy chủ. AIVN không tự bỏ công cụ.": [
"This model can see {0} tools, more than fits context {1}. Turn some servers off. AIVN does not drop tools on its own.",
"此模型能看到 {0} 个工具，超过上下文 {1} 所能承受的。请关闭一些服务器。AIVN 不会自行丢掉工具。"
],
"Tắt": [
"Turn off",
"关闭"
],
"Tự kết nối khi mở AIVN": [
"Connect automatically when AIVN opens",
"打开 AIVN 时自动连接"
],
"Mẫu: {0}": [
"Template: {0}",
"模板：{0}"
],
"Đang dùng": [
"In use",
"正在使用"
],
"Tạo mẫu của tôi": [
"Create my template",
"创建我的模板"
],
"Lưu thành mẫu của tôi": [
"Save as my template",
"另存为我的模板"
],
"Mẫu này dùng được với: {0}": [
"This template can use: {0}",
"此模板可以使用：{0}"
],
"Công tắc “Cho AIVN AGENT dùng công cụ MCP” đang tắt. Máy chủ ở phần Nâng cao sẽ không chạy. Ứng dụng trên cửa hàng vẫn kết nối được.": [
"The “Let AIVN AGENT use MCP tools” switch is off. Servers under Advanced will not run. Store apps can still be connected.",
"“允许 AIVN AGENT 使用 MCP 工具”开关已关闭。高级里的服务器不会运行。商店里的应用仍可连接。"
],
"Cho phép kết nối “{0}”?": [
"Allow “{0}” to connect?",
"允许连接“{0}”？"
],
"Tự kết nối lại máy chủ này khi mở AIVN": [
"Connect this server again when AIVN opens",
"打开 AIVN 时重新连接此服务器"
],
"Tự bật lại kết nối này khi mở AIVN": [
"Turn this connection back on when AIVN opens",
"打开 AIVN 时重新启用此连接"
],
"Nhập {0} máy chủ từ mcp.json?": [
"Import {0} servers from mcp.json?",
"从 mcp.json 导入 {0} 个服务器？"
],
"Tự kết nối các máy chủ này khi mở AIVN": [
"Connect these servers when AIVN opens",
"打开 AIVN 时连接这些服务器"
],
"Thay thế máy chủ “{0}”?": [
"Replace server “{0}”?",
"替换服务器“{0}”？"
],
"Đã tách {0} khoá bí mật ra khỏi tệp. Chúng được mã hoá bằng kho khoá hệ điều hành và không ghi dạng chữ vào mcp.json.": [
"Moved {0} secrets out of the file. They are encrypted with the operating system key store and are not written in mcp.json as plain text.",
"已从文件中取出 {0} 个密钥。它们由操作系统密钥库加密，不会以明文写入 mcp.json。"
],
"Dữ liệu gửi tới máy chủ này rời khỏi máy bạn.": [
"Data sent to this server leaves your computer.",
"发给此服务器的数据会离开您的电脑。"
],
"Địa chỉ http này nằm trong mạng nội bộ của bạn.": [
"This http address is on your local network.",
"此 http 地址位于您的局域网内。"
],
"Lệnh này không ghim phiên bản. npx có thể tải mã mới.": [
"This command does not pin a version. npx can download new code.",
"此命令没有固定版本。npx 可能会下载新代码。"
],
"AIVN Kinh doanh đọc và sửa dữ liệu kinh doanh trên máy này. Xoá, huỷ và ghi nhận thanh toán vẫn hỏi bạn từng lần.": [
"AIVN Business reads and changes business data on this computer. Delete, cancel, and record-payment still ask you each time.",
"AIVN 业务会读取并修改这台电脑上的业务数据。删除、取消和登记付款仍会每次询问你。"
],
"Ghi tệp Excel trong thư mục được phép. Ghi đè vẫn hỏi bạn trước.": [
"Write Excel files in allowed folders. Overwriting still asks you first.",
"在允许的文件夹里写 Excel 文件。覆盖前仍会询问你。"
],
"Gỡ “{0}”?": [
"Remove “{0}”?",
"移除“{0}”？"
],
"Công cụ của kết nối này sẽ biến mất. Các mục “Luôn cho phép” của nó cũng bị xoá.": [
"This connection’s tools will disappear. Its “Always allow” entries are removed too.",
"此连接的工具会消失。“始终允许”也会一并移除。"
],
"Gỡ máy chủ “{0}”?": [
"Remove server “{0}”?",
"移除服务器“{0}”？"
],
"Công cụ của máy chủ này sẽ biến mất. Các mục “Luôn cho phép” của nó cũng bị xoá. Khoá bí mật của máy chủ này bị xoá khỏi máy.": [
"This server’s tools will disappear. Its “Always allow” entries are removed too. Its secrets are deleted from this computer.",
"此服务器的工具会消失。“始终允许”也会一并移除。此服务器的密钥会从这台电脑删除。"
],
"Cho phép máy chủ này tự chạy mỗi khi mở AIVN.": [
"Let this server start each time AIVN opens.",
"允许此服务器在每次打开 AIVN 时自行启动。"
],
"mcp.json phải là một đối tượng JSON.": [
"mcp.json must be a JSON object.",
"mcp.json 必须是一个 JSON 对象。"
],
"Thiếu \"mcpServers\": { tên: { command, args, env } }.": [
"Missing \"mcpServers\": { name: { command, args, env } }.",
"缺少 \"mcpServers\": { 名称: { command, args, env } }。"
],
"Máy chủ \"{0}\" không hợp lệ.": [
"Server \"{0}\" is not valid.",
"服务器“{0}”无效。"
],
"Máy chủ \"{0}\" cần \"command\" (stdio) hoặc \"url\" (http/SSE).": [
"Server \"{0}\" needs \"command\" (stdio) or \"url\" (http/SSE).",
"服务器“{0}”需要 \"command\"（stdio）或 \"url\"（http/SSE）。"
],
"\"args\" của \"{0}\" phải là mảng.": [
"\"args\" of \"{0}\" must be an array.",
"“{0}”的 \"args\" 必须是数组。"
],
"\"env\" của \"{0}\" phải là đối tượng.": [
"\"env\" of \"{0}\" must be an object.",
"“{0}”的 \"env\" 必须是对象。"
],
"\"url\" của \"{0}\" phải bắt đầu bằng http:// hoặc https://": [
"\"url\" of \"{0}\" must start with http:// or https://",
"“{0}”的 \"url\" 必须以 http:// 或 https:// 开头"
],
"Thiếu \"mcpServers\". Nếu tệp dùng khoá \"servers\", hãy đổi thành \"mcpServers\".": [
"Missing \"mcpServers\". If the file uses the key \"servers\", rename it to \"mcpServers\".",
"缺少“mcpServers”。如果文件用的是“servers”，请改成“mcpServers”。"
],
"mcp.json không phải JSON hợp lệ.": [
"mcp.json is not valid JSON.",
"mcp.json 不是有效的 JSON。"
],
"Tên máy chủ phải từ 1 đến 64 ký tự.": [
"A server name must be 1 to 64 characters.",
"服务器名称须为 1 到 64 个字符。"
],
"Máy chủ \"{0}\" chỉ được có command hoặc url.": [
"Server \"{0}\" must have either command or url, not both.",
"服务器“{0}”只能有 command 或 url 其中之一。"
],
"\"args\" của \"{0}\" chỉ được chứa chuỗi.": [
"\"args\" of \"{0}\" may only contain strings.",
"“{0}”的 \"args\" 只能包含字符串。"
],
"\"type\" của \"{0}\" chỉ được là \"sse\".": [
"\"type\" of \"{0}\" may only be \"sse\".",
"“{0}”的 \"type\" 只能是 \"sse\"。"
],
"\"timeout\" của \"{0}\" phải là số nguyên từ 1000 đến 600000.": [
"\"timeout\" of \"{0}\" must be an integer from 1000 to 600000.",
"“{0}”的 \"timeout\" 必须是 1000 到 600000 的整数。"
],
"\"cwd\" của \"{0}\" phải là thư mục có sẵn.": [
"\"cwd\" of \"{0}\" must be a folder that already exists.",
"“{0}”的 \"cwd\" 必须是已存在的文件夹。"
],
"\"url\" của \"{0}\" dùng http ra ngoài mạng nội bộ. Hãy dùng https, hoặc một địa chỉ trong mạng nội bộ.": [
"The http \"url\" for \"{0}\" points outside the local network. Use https, or an address on the local network.",
"“{0}”的 http“url”指向局域网之外。请改用 https，或使用局域网内的地址。"
],
"Tên \"{0}\" và \"{1}\" trùng nhau sau khi chuẩn hoá.": [
"The names \"{0}\" and \"{1}\" are the same once normalised.",
"名称“{0}”和“{1}”规范化之后相同。"
],
"AIVN chưa hỗ trợ đăng nhập OAuth (trường auth) của máy chủ \"{0}\".": [
"AIVN does not support OAuth sign-in (the auth field) for server \"{0}\" yet.",
"AIVN 尚不支持服务器“{0}”的 OAuth 登录（auth 字段）。"
],
"Tệp mcp.json lớn hơn 256 KB.": [
"The mcp.json file is larger than 256 KB.",
"mcp.json 文件超过 256 KB。"
],
"Tệp xuất không có khoá bí mật. Máy khác phải nhập lại khoá.": [
"The exported file has no secrets. Another computer will need the keys entered again.",
"导出的文件不含密钥。换一台电脑需要重新填写密钥。"
],
"Đã có \"{0}\".": [
"\"{0}\" is already there.",
"已经有“{0}”。"
]
};
const STR_PR5_PROTO={
"Khoá được mã hoá bằng kho khoá của hệ điều hành và không bao giờ hiện lại hay ghi vào nhật ký.": [
"The key is encrypted with the operating system's keychain and is never shown again or written to logs.",
"密钥用操作系统的钥匙串加密，不会再次显示，也不会写入日志。"
],
"Máy này không có kho khoá an toàn của hệ điều hành: khoá chỉ giữ trong bộ nhớ đến khi thoát AIVN (không ghi ra đĩa).": [
"This computer has no secure OS keychain: the key is kept in memory only until AIVN quits (never written to disk).",
"本机没有安全的系统钥匙串：密钥只保存在内存中，直到退出 AIVN（不会写入磁盘）。"
],
"⚠ Máy chủ MCP là chương trình chạy trên máy bạn (stdio) hoặc dịch vụ bên ngoài (http/SSE) và có thể đọc/ghi dữ liệu. Chỉ thêm máy chủ bạn tin tưởng. AIVN luôn xin phép trước mỗi lần gọi công cụ MCP (trừ khi bạn chọn “Luôn cho phép”).": [
"⚠ An MCP server is a program running on your computer (stdio) or an external service (http/SSE) and can read/write data. Only add servers you trust. AIVN always asks permission before each MCP tool call (unless you choose “Always allow”).",
"⚠ MCP 服务器是在你电脑上运行的程序（stdio）或外部服务（http/SSE），可以读写数据。请只添加你信任的服务器。每次调用 MCP 工具前 AIVN 都会请求许可（除非你选择“始终允许”）。"
],
"Gói này trên npm đã ngừng được hỗ trợ. AIVN ghim đúng bản cuối và không tự tải bản khác.": [
"This npm package is no longer supported. AIVN pins the last published version and does not download another.",
"此 npm 包已停止维护。AIVN 固定最后发布的版本，不会另行下载。"
],
"Bản nháp 4.2 theo thiết kế F-PLUGINS bản 2 (PR #5)": [
"Draft 4.2 following F-PLUGINS design v2 (PR #5)",
"草稿 4.2，按 F-PLUGINS 设计第 2 版（PR #5）"
],
"AIVN Kinh doanh": [
"AIVN Business",
"AIVN 业务"
],
"Excel": [
"Excel",
"Excel"
],
"Zalo": [
"Zalo",
"Zalo"
],
"Drive": [
"Drive",
"云端硬盘"
],
"Calendar": [
"Calendar",
"日历"
],
"Notion": [
"Notion",
"Notion"
],
"Gmail": [
"Gmail",
"Gmail"
],
"Khách hàng, đơn bán, kho và hoá đơn ngay trong AIVN. Dữ liệu nằm trên máy này.": [
"Customers, sales orders, stock, and invoices inside AIVN. The data stays on this computer.",
"客户、销售单、库存和发票都在 AIVN 里。数据留在这台电脑上。"
],
"Đọc và ghi tệp Excel trong thư mục được phép. Không cần cài Microsoft Excel.": [
"Read and write Excel files in allowed folders. Microsoft Excel does not need to be installed.",
"在允许的文件夹里读写 Excel 文件。不必安装 Microsoft Excel。"
],
"Nhắn tin Zalo.": [
"Send Zalo messages.",
"发送 Zalo 消息。"
],
"Đọc và gửi thư Gmail.": [
"Read and send Gmail.",
"阅读和发送 Gmail。"
],
"Tệp trên Google Drive.": [
"Files on Google Drive.",
"Google 云端硬盘上的文件。"
],
"Lịch Google.": [
"Google Calendar.",
"Google 日历。"
],
"Trang và cơ sở dữ liệu Notion.": [
"Notion pages and databases.",
"Notion 的页面和数据库。"
],
"Việc": [
"Does",
"用途"
],
"Khách hàng, đơn bán, kho và hoá đơn trong AIVN Kinh doanh.": [
"Customers, sales orders, stock and invoices in AIVN Business.",
"AIVN 业务里的客户、销售单、库存和发票。"
],
"Đọc và ghi tệp .xlsx và .csv.": [
"Read and write .xlsx and .csv files.",
"读写 .xlsx 和 .csv 文件。"
],
"Dữ liệu nằm trên máy này (crm.db).": [
"The data stays on this computer (crm.db).",
"数据留在这台电脑上（crm.db）。"
],
"Chỉ trong thư mục được phép.": [
"Only in allowed folders.",
"只在允许的文件夹里。"
],
"Không cần cài Microsoft Excel.": [
"Microsoft Excel does not need to be installed.",
"不必安装 Microsoft Excel。"
],
"Cho phép kết nối này tự bật mỗi khi mở AIVN.": [
"Let this connection turn on each time AIVN opens.",
"允许此连接在每次打开 AIVN 时自动启用。"
],
"Lưu khoá": [
"Key storage",
"密钥保存"
],
"Gói này nằm sẵn trong bản cài AIVN. Khi chạy, AIVN không gọi npx và không tải gì.": [
"This package ships inside the AIVN installer. When it runs, AIVN does not call npx and downloads nothing.",
"此包随 AIVN 安装程序附带。运行时 AIVN 不调用 npx，也不下载任何内容。"
],
"đóng sẵn trong bản cài": [
"bundled with the installer",
"随安装程序附带"
],
"Máy chủ có sẵn": [
"Built-in servers",
"内置服务器"
],
"Máy chủ khác trong mcp.json": [
"Other servers in mcp.json",
"mcp.json 里的其他服务器"
],
"Nhập / xuất": [
"Import / export",
"导入 / 导出"
],
"Mọi máy chủ nhập vào nằm ở Của tôi.": [
"Every imported server goes to Mine.",
"所有导入的服务器都放在“我的”里。"
],
"Mẫu của bạn giữ nguyên ngôn ngữ bạn viết, không dịch máy.": [
"Your templates stay in the language you wrote them in; they are not machine-translated.",
"你的模板保持你写的语言，不做机器翻译。"
],
"Cài đặt (mô phỏng)": [
"Settings (mock)",
"设置（模拟）"
],
"Cài đặt": [
"Settings",
"设置"
],
"Giao diện": [
"Appearance",
"外观"
],
"Ngôn ngữ giao diện": [
"Interface language",
"界面语言"
],
"Chỗ này đóng vai mục Cài đặt của ứng dụng. Hộp thoại Kết nối ứng dụng không có nút đổi ngôn ngữ.": [
"This stands in for the app's Settings. The Connect apps dialog has no language switch.",
"这里代替应用的“设置”。“连接应用”对话框没有切换语言的按钮。"
],
"Lệnh không thuộc danh mục Nâng cao.": [
"The command is not in the Advanced catalogue.",
"此命令不在“高级”目录中。"
],
"Chỉ xem, không hỏi": [
"View only, no question asked",
"只查看，不询问"
],
"Thay đổi dữ liệu, hỏi bạn trước": [
"Changes data, asks you first",
"会修改数据，先询问你"
],
"Xoá, huỷ, thanh toán, hỏi bạn từng lần": [
"Delete, cancel, payment: asks you every time",
"删除、取消、付款：每次都询问你"
],
"Xem tồn kho": [
"View stock",
"查看库存"
],
"Xem một phiếu kho": [
"View a stock transfer",
"查看一张库存单"
],
"Xem danh sách phiếu kho": [
"List stock transfers",
"列出库存单"
],
"Xem một đơn bán": [
"View a sales order",
"查看一张销售单"
],
"Xem danh sách đơn bán": [
"List sales orders",
"列出销售单"
],
"Xem một hoá đơn": [
"View an invoice",
"查看一张发票"
],
"Xem danh sách hoá đơn": [
"List invoices",
"列出发票"
],
"Xem báo cáo bán hàng": [
"View the sales report",
"查看销售报表"
],
"Xem báo cáo hoá đơn": [
"View the invoice report",
"查看发票报表"
],
"Xem báo cáo kho": [
"View the stock report",
"查看库存报表"
],
"Xem tổng quan kinh doanh": [
"View the business overview",
"查看业务概览"
],
"Tạo phiếu nhập kho": [
"Create a goods receipt",
"创建入库单"
],
"Đánh dấu phiếu kho đã xong": [
"Mark a stock transfer as done",
"将库存单标记为完成"
],
"Xác nhận phiếu kho": [
"Validate a stock transfer",
"确认库存单"
],
"Điều chỉnh số tồn": [
"Adjust stock quantity",
"调整库存数量"
],
"Gửi báo giá": [
"Send a quotation",
"发送报价"
],
"Xác nhận đơn bán": [
"Confirm a sales order",
"确认销售单"
],
"Đưa đơn bán về báo giá": [
"Set a sales order back to quotation",
"将销售单退回报价"
],
"Lưu hoá đơn": [
"Save an invoice",
"保存发票"
],
"Lập hoá đơn từ đơn bán": [
"Invoice a sales order",
"根据销售单开票"
],
"Ghi sổ hoá đơn": [
"Post an invoice",
"过账发票"
],
"Đưa hoá đơn về nháp": [
"Set an invoice back to draft",
"将发票退回草稿"
],
"Huỷ phiếu kho": [
"Cancel a stock transfer",
"取消库存单"
],
"Huỷ đơn bán": [
"Cancel a sales order",
"取消销售单"
],
"Huỷ hoá đơn": [
"Cancel an invoice",
"取消发票"
],
"Ghi nhận thanh toán": [
"Record a payment",
"登记付款"
],
"Lập hoá đơn điều chỉnh giảm": [
"Create a credit note",
"开具红字发票"
],
"Xoá hoá đơn": [
"Delete an invoice",
"删除发票"
],
"Đọc tệp Excel hoặc CSV trong thư mục được phép": [
"Read an Excel or CSV file in allowed folders",
"读取允许文件夹里的 Excel 或 CSV 文件"
],
"Ghi tệp Excel hoặc CSV trong thư mục được phép (ghi đè thì hỏi kỹ hơn)": [
"Write an Excel or CSV file in allowed folders (overwriting asks more carefully)",
"在允许的文件夹里写 Excel 或 CSV 文件（覆盖时会更谨慎地询问）"
],
"Cần xem kỹ": [
"Look carefully",
"请仔细查看"
],
"Không có mã truy cập: máy chủ có thể từ chối yêu cầu.": [
"No access token: the server may refuse requests.",
"没有访问令牌：服务器可能会拒绝请求。"
],
"Tuỳ chọn: chữ “Bearer …”. Bỏ trống vẫn kết nối được, nhưng yêu cầu có thể bị từ chối.": [
"Optional: the text “Bearer …”. You can leave it empty and still connect, but requests may be refused.",
"可选：填“Bearer …”。留空也能连接，但请求可能被拒绝。"
],
"Máy chủ MCP trong mcp.json của bạn.": [
"An MCP server in your mcp.json.",
"你 mcp.json 里的 MCP 服务器。"
],
"← Quay lại": [
"← Back",
"← 返回"
],
"(bản mẫu) Dùng tệp ví dụ": [
"(prototype) Use the sample file",
"（原型）使用示例文件"
],
"Nhập các mục mới": [
"Import the new entries",
"导入新条目"
],
"Tiến trình cũ sẽ bị dừng.": [
"The old process will be stopped.",
"旧进程会被停止。"
],
"Lệnh mới": [
"New command",
"新命令"
],
"Mô tả công cụ (khoảng {0} token) vượt ngân sách {1} token. Lượt sau chưa bắt đầu cho đến khi bạn tắt bớt.": [
"Tool descriptions (about {0} tokens) exceed the {1}-token budget. The next turn will not start until you turn some off.",
"工具说明（约 {0} 个 token）超出 {1} token 的预算。在你关闭一些之前，下一轮不会开始。"
],
"Công cụ của AIVN AGENT": [
"AIVN AGENT tools",
"AIVN AGENT 工具"
],
"Mở Kết nối ứng dụng": [
"Open Connect apps",
"打开“连接应用”"
],
"Đã hiểu": [
"Got it",
"知道了"
],
"Không bao giờ áp dụng cho công cụ MCP.": [
"Never applies to MCP tools.",
"从不适用于 MCP 工具。"
],
"Chưa bắt đầu lượt: hãy tắt bớt máy chủ trước.": [
"Turn not started: turn some servers off first.",
"本轮未开始：请先关闭一些服务器。"
],
"Bản sao của {0}": [
"Copy of {0}",
"{0} 的副本"
]
};
Object.assign(STR,STR_PR5_PROTO,STR_PR5_DOC);

Object.assign(STR,{
"Chưa có ứng dụng tài chính.": [
"No finance apps yet.",
"还没有财务应用。"
],
"Nhóm này sẽ có thêm ứng dụng trong các bản sau.": [
"More apps will be added to this group in later versions.",
"以后的版本会在这个分组里加入更多应用。"
],
"GitHub sẽ dùng máy chủ MCP chính thức từ xa (qua URL) trong một bản sau.": [
"GitHub will use its official remote MCP server (by URL) in a later version.",
"GitHub 将在以后的版本中通过 URL 使用官方的远程 MCP 服务器。"
],
"Nâng cao: {0}": [
"Advanced: {0}",
"高级：{0}"
],
"Máy chủ khớp một mục Nâng cao còn trống sẽ vào mục đó. Các máy chủ khác vào Của tôi.": [
"A server that matches an empty Advanced entry takes that entry. Other servers go to Mine.",
"与空着的“高级”条目匹配的服务器会放进该条目，其他服务器放进“我的”。"
]
});

// ---- v4.3: quyết định ngày 22/10 (chữ bản mẫu) ----
Object.assign(STR,{
"Thư mục:": [
"Folder:",
"文件夹："
],
"Đổi thư mục": [
"Change folder",
"更换文件夹"
],
"Quyền": [
"Permissions",
"权限"
],
"Chỉ đọc {0} · Ghi {1} · Hỏi trước {2}": [
"Read only {0} · Write {1} · Ask first {2}",
"只读 {0} · 写入 {1} · 先询问 {2}"
],
"Kết nối được giữ khi bạn mở lại AIVN.": [
"The connection stays when you reopen AIVN.",
"重新打开 AIVN 后连接仍会保留。"
],
"{0} bắt đầu chạy (lần dùng đầu).": [
"{0} started (first use).",
"{0} 已启动（首次使用）。"
],
"AIVN AGENT muốn: {0}": [
"AIVN AGENT wants to: {0}",
"AIVN AGENT 想要：{0}"
],
"Ứng dụng": [
"App",
"应用"
],
"Lần ghi đầu tiên sau khi mở lại AIVN.": [
"First write since AIVN was reopened.",
"重新打开 AIVN 后的第一次写入。"
],
"Việc này luôn hỏi bạn mỗi lần.": [
"This always asks you every time.",
"这件事每次都会询问你。"
],
"Bạn đã từ chối: {0}": [
"You declined: {0}",
"你已拒绝：{0}"
],
"(bản mẫu) Đã mở lại AIVN. Kết nối vẫn còn; ứng dụng chạy khi AIVN AGENT dùng lần đầu.": [
"(prototype) AIVN reopened. Connections are kept; an app starts when AIVN AGENT first uses it.",
"（原型）已重新打开 AIVN。连接仍保留；AIVN AGENT 第一次使用时应用才启动。"
],
"Sẽ báo bạn": [
"We'll tell you",
"会通知你"
],
"Báo tôi khi có": [
"Tell me when it's ready",
"可用时通知我"
],
"AIVN sẽ báo bạn ngay trong ứng dụng khi có. Không gửi gì ra ngoài.": [
"AIVN will tell you inside the app when it's ready. Nothing is sent out.",
"可用时 AIVN 会在应用内通知你。不会向外发送任何内容。"
],
"Làm được {0} việc": [
"Can do {0} things",
"可做 {0} 件事"
],
"{0} việc": [
"actions: {0}",
"{0} 项"
],
"Dữ liệu nằm ở": [
"Where the data lives",
"数据位置"
],
"Nhà phát triển và phiên bản": [
"Developer and version",
"开发者和版本"
],
"bản {0} (số mẫu)": [
"version {0} (sample number)",
"版本 {0}（示例编号）"
],
"Cách chạy": [
"How it runs",
"运行方式"
],
"Trong AIVN, không có tiến trình riêng, không qua mcp.json.": [
"Inside AIVN, no separate process, not through mcp.json.",
"在 AIVN 内运行，没有单独进程，不经过 mcp.json。"
],
"Đường truyền": [
"Transport",
"传输方式"
],
"Gọi trực tiếp trong ứng dụng (không stdio, không http).": [
"Called directly inside the app (no stdio, no http).",
"在应用内直接调用（不用 stdio，也不用 http）。"
],
"Không kết nối được. Mở Nâng cao để xem.": [
"Couldn't connect. Open Advanced to see why.",
"无法连接。打开“高级”查看原因。"
],
"Bạn thêm ở Nâng cao.": [
"You added this in Advanced.",
"你在“高级”里添加的。"
],
"Không thấy? Thêm máy chủ MCP ở Nâng cao": [
"Not here? Add an MCP server in Advanced",
"没找到？在“高级”里添加 MCP 服务器"
],
"Bản nháp 4.3 theo F-PLUGINS bản 2 + quyết định ngày 22/10": [
"Draft 4.3 following F-PLUGINS v2 + decisions of 22 Oct",
"草稿 4.3，按 F-PLUGINS 第 2 版 + 10 月 22 日的决定"
],
"Bản 4.1": [
"Version 4.1",
"4.1 版"
],
"Bản 4.2": [
"Version 4.2",
"4.2 版"
],
"Mô phỏng mở lại AIVN": [
"Simulate reopening AIVN",
"模拟重新打开 AIVN"
],
"(bản mẫu) Cho AIVN AGENT thử dùng ứng dụng:": [
"(prototype) Let AIVN AGENT try an app:",
"（原型）让 AIVN AGENT 试用应用："
],
"Trên máy này (tệp crm.db).": [
"On this computer (the crm.db file).",
"在这台电脑上（crm.db 文件）。"
],
"Trên máy này, trong thư mục bạn chọn.": [
"On this computer, in the folder you chose.",
"在这台电脑上，你选择的文件夹里。"
],
"Đã kết nối · chờ dùng lần đầu": [
"Connected · waiting for first use",
"已连接 · 等待首次使用"
],
"Cho AIVN AGENT xem và cập nhật khách hàng, đơn bán, kho và hoá đơn của bạn. Mọi dữ liệu nằm trên máy này.": [
"Lets AIVN AGENT view and update your customers, sales orders, stock and invoices. All the data stays on this computer.",
"让 AIVN AGENT 查看并更新你的客户、销售单、库存和发票。所有数据都留在这台电脑上。"
],
"Cho AIVN AGENT đọc và ghi bảng tính .xlsx, .csv trong thư mục bạn chọn. Bạn không cần cài Microsoft Excel.": [
"Lets AIVN AGENT read and write .xlsx and .csv spreadsheets in the folder you choose. You don't need Microsoft Excel installed.",
"让 AIVN AGENT 在你选择的文件夹里读写 .xlsx、.csv 表格。不必安装 Microsoft Excel。"
],
"AIVN": [
"AIVN",
"AIVN"
],
"AIVN (không phải Microsoft)": [
"AIVN (not Microsoft)",
"AIVN（不是微软）"
],
"Chỉ đọc": [
"Read only",
"只读"
],
"Ghi": [
"Write",
"写入"
],
"Hỏi trước": [
"Ask first",
"先询问"
],
"Không hỏi.": [
"Doesn't ask.",
"不询问。"
],
"Hỏi bạn trước.": [
"Asks you first.",
"先询问你。"
],
"Hỏi bạn mỗi lần.": [
"Asks you every time.",
"每次都询问你。"
],
"Đọc tệp Excel": [
"Read an Excel file",
"读取 Excel 文件"
],
"Ghi tệp Excel": [
"Write an Excel file",
"写入 Excel 文件"
]
});
