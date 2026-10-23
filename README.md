# AIVN – Bản mẫu giao diện (prototype tĩnh)
Trang tĩnh, không cần build: index.html, models.html, chat.html, products.html, connect.html (theo thiết kế nháp F-PLUGINS, PR #1; logic ở assets/connect.js, chữ ở assets/connect-i18n.js) (+ assets/).
Chạy cục bộ:  cd proto-aivn && python3 -m http.server 8765  → http://localhost:8765/
Chụp ảnh lại: /home/box/pwenv/bin/python tools/shots.py  (cần server chạy ở cổng 8765)
Dữ liệu mẫu lưu trong localStorage (aivn.downloaded, aivn.biz). Nút "Đặt lại dữ liệu mẫu" ở trang Kinh doanh.

## connect.html theo F-PLUGINS (PR #1)
- Bản trước khi bám PR #1: tools/connect-v1-before-PR1.html.bak; ảnh cũ: shots/v1-before-PR1/.
- Ảnh mới: shots/5*.png, tạo bằng `/home/box/pwenv/bin/python tools/shots5.py` (cần http.server cổng 8765).
- Dữ liệu lưu ở localStorage khoá `aivn.plugins.v2`; nút “↺ Đặt lại” trên dải bản nháp xoá về dữ liệu mẫu.

## connect.html v4.2 (hướng mới)
- connect.html = bản 4.2: lưới ứng dụng theo nhóm; phần MCP kỹ thuật ở Nâng cao / Của tôi. Mã: assets/connect.js, chữ: assets/connect-i18n.js. Lưu ở localStorage `aivn.plugins.v42`.
- connect-v4.1.html = bản 4.1 giữ nguyên để so sánh (assets/connect-v41.js, assets/connect-i18n-v41.js, localStorage `aivn.plugins.v2`).
- Ảnh: shots/6*.png, tạo bằng `/home/box/pwenv/bin/python tools/shots6.py`. Kiểm tra khoá i18n còn thiếu: `node tools/i18n-missing.js`.

## connect.html v4.2 theo F-PLUGINS bản 2 (PR #5)
- Thiết kế: `F-PLUGINS.design.v2-pr5.md` (thay cho wip016 và các ghi chú trước). Mã: `assets/connect.js`; chữ: `assets/connect-i18n.js` (cuối tệp có `STR_PR5_DOC`, chép nguyên bảng chữ của tài liệu, và `STR_PR5_PROTO`, chữ do bản mẫu viết). localStorage `aivn.plugins.v42pr5`.
- Bản 4.2 trước PR #5 được giữ ở `tools/*before-PR5*.bak` và ảnh cũ ở `shots/v42-before-PR5/`. Bản 4.1 không đổi.
- Ảnh: `tools/shots6.py` → `shots/6*.png` (1280×800). Kiểm tra chữ thiếu: `node tools/i18n-missing.js`.
- Ngôn ngữ: không có nút trong hộp thoại. Dùng nút “⚙ Cài đặt (mô phỏng)” trên dải bản nháp (`#uiLangSel`).
- Logo: xem `assets/logos/NOTICE.md`.

## connect.html v4.3 (F-PLUGINS bản 2 + quyết định ngày 22/10)
- Bản 4.3 giữ nguyên ở `connect-v4.3.html` (+ `assets/connect-v43.js`, `assets/connect-i18n-v43.js`), localStorage `aivn.plugins.v43`.
- Bản 4.2 giữ nguyên ở `connect-v4.2.html` (+ `assets/connect-v42.js`, `assets/connect-i18n-v42.js`); bản 4.1 ở `connect-v4.1.html`.
- Mới: trang chi tiết ứng dụng (bấm ô), nút "Báo tôi khi có" ở ô Sắp có (chỉ lưu cờ trên máy), gợi ý "Không thấy? Thêm máy chủ MCP ở Nâng cao" khi tìm không ra, thẻ Excel chỉ hiện tên thư mục (rê chuột xem đường dẫn) + "Đổi thư mục", kết nối được nhớ khi mở lại AIVN (chạy khi AIVN AGENT dùng lần đầu; lần ghi đầu vẫn hỏi). Nút "↻ Mô phỏng mở lại AIVN" trên dải bản nháp.
- Ảnh: `shots/7*.png`, chạy lại bằng `tools/shots7.py` (in ra cả kiểm tra chữ MCP/máy chủ/công cụ trên màn hình chính).

## connect.html v4.4 (quyết định ngày 22/10, lượt 2)
- Bản 4.4 giờ là `connect-v4.4.html` (bản chụp, mã riêng `assets/connect-v44.js` + `assets/connect-i18n-v44.js`, localStorage `aivn.plugins.v44`).
- (a) "Ghi nhớ MCP" → "Ghi nhớ" (Memory / 记忆); chữ MCP và tên gốc chỉ trong "Chi tiết".
- (b) Công tắc bảng bên: "Cho AIVN AGENT dùng các ứng dụng đã kết nối" (giờ áp dụng cả ứng dụng cửa hàng). Cảnh báo/chặn nhiều ứng dụng dùng chữ thường; số liệu trong "Chi tiết".
- (c) Mọi ứng dụng chỉ chạy khi AIVN AGENT dùng lần đầu. Máy chủ Nâng cao có "Luôn chạy sẵn" (mặc định tắt) thay cho tự khởi động.
- (d) Excel có thư mục riêng (lần đầu = thư mục của AIVN AGENT, hiện trong thẻ xin phép). "Đổi thư mục" của Excel chỉ đổi thư mục Excel; thư mục của AIVN AGENT đổi ở bảng bên. Đổi sang thư mục mới (cả hai) đều qua thẻ xin phép.
- §17.5: so khớp URL sau khi chuẩn hoá (bỏ '/' cuối, host không phân biệt hoa thường, path phân biệt). Gói so khớp bỏ qua phiên bản. Chỉ trùng tên → Của tôi.
- Ảnh: `shots/8*.png`, chạy lại bằng `tools/shots8.py` (in kiểm tra chữ kỹ thuật trên màn hình chính, thanh agent và bảng bên).

## WIP issue #48 — TẠM DỪNG (models-48.html, không liên kết từ index)
- Bản đang chạy vẫn là #44: `models.html` + `assets/models-v2.js` + `assets/models-i18n.js` (giống hệt trước #48). `models-v2.html` là bản chụp #44 (JS `-44`). WIP #48: `models-48.html` + `assets/models-48.js` + `assets/models-i18n-48.js` + `assets/data/models-hf-moe-2026-10-23.js`. Đã làm / còn lại: `PROGRESS-48.md`.
- **Dữ liệu MoE:** API HF công khai, lấy 2026-10-22T20:47:16Z–20:47:23Z (= 03:47 ngày 23/10/2026 giờ Bangkok) bằng `tools/fetch-hf/fetch4.py` (gốc ở `tools/fetch-hf/raw-moe-2026-10-23/`) → `tools/fetch-hf/build48.py` → `assets/data/models-hf-moe-2026-10-23.{json,js}` (`window.HFDATA_MOE`, 8 kho: ggml-org gpt-oss-20b/120b, unsloth gpt-oss-20b, ibm-granite + unsloth granite-4.0-h-tiny, granite-4.0-h-small, unsloth Qwen3-30B-A3B-Instruct-2507 và Qwen3-Coder-30B-A3B). ggml-org/Qwen3-30B-A3B-Instruct-2507-GGUF trả 401 nên dùng bản unsloth. Gộp với 36 kho cũ = 44 kho.
- **MoE từ đầu tệp GGUF:** expert_count / expert_used_count / expert_feed_forward_length. Phần chuyên gia E = 3 × emb × expert_ff × số chuyên gia × số lớp; gpt-oss: chuyên gia ở MXFP4 (4,25 bit). Khi không vừa VRAM: phần chung + KV + bộ đệm trên GPU, chuyên gia của N lớp trên CPU (= `--n-cpu-moe N` của llama.cpp), mức mới **Chạy được (MoE)** khi ước tính ≥ 8 tok/s.
- **tok/s (áp dụng việc chờ của #44):** 0,9 / (GB đọc trên GPU / (0,75 × băng thông GPU) + GB đọc trên CPU / (0,3 × băng thông RAM) + 2,5 ms). Công thức GPU theo `src/fit.js` (wip-0.16); CPU 0,3 và hệ số 0,9 để không ước cao. Hiện mờ “≈ ~N tok/s (ước tính)”, làm tròn xuống, có chú thích (title). Khi có số đo B-LADDER thì điền `PICKS[].measured` → hiện “N tok/s (đã đo)”.
- **Mạnh nhất cho máy của bạn:** `PICKS` (Qwen3-30B-A3B-2507 Q4_K_M cần RAM ≥ 32 GB; gpt-oss-20b MXFP4 và Granite-4.0-H-Tiny Q4_K_M cần RAM ≥ 16 GB), chỉ giữ khi không “Không chạy được” và tok/s (đo hoặc ≈) ≥ 8. Bấm thẻ → mở kho, tab Tệp, chọn sẵn bản đó.
- **Quá to:** khung `role=alert` với cần ≈ / máy có / AIVN dùng được ≈ (90% VRAM + 60% RAM) / thiếu ≈, nút chọn bản nhỏ hơn vừa máy, nút thử mô hình MoE, câu báo lỗi giả lập ở bước Nạp mô hình (A5), nút tải đổi thành phụ “Vẫn tải về … (để dùng trên máy khác)”. Danh sách: dòng “máy dùng được ≈”.
- **Nâng cao: đọc thẳng từ SSD (mmap):** chỉ trong khung quá to, thu gọn mặc định, cảnh báo đỏ/vàng, ô “Tôi hiểu…” (mặc định không tích, không lưu), giới hạn ngữ cảnh 1.024/2.048/4.096, nút chạy mờ đến khi tích; khi chạy có thanh cố định với nút ■ Dừng luôn bấm được. Giả lập; đổi kho/máy là dừng. s/token ≈ GB đọc mỗi token × phần không nằm trong RAM / 3 GB/s × 1,5.
- **Việc chờ của #44 đã làm luôn:** tok/s mờ không ước cao (trên); lọc Dùng công cụ dự phòng theo README (“function calling / tool use”), đánh dấu `*` và chú thích; kho gated chưa đọc được đầu tệp → “🔒 chưa đọc được thông tin · repo cần quyền truy cập” thay cho “cần kiểm tra”.
- Kiểm: `node tools/i18n-models.js assets/models-48.js assets/models-i18n-48.js`; `MODELS_URL=http://127.0.0.1:8765/models-48.html python tools/touch-check-models.py` (và trunc-check), các trạng thái #48 trong `tools/models_states.py` chỉ chạy khi URL chứa “48”. Ảnh `shots/17*.png` (`tools/shots17.py`), so sánh #44 | #48 ở `shots/cmp48m/` (`tools/compare48m.py`). Ghi chú: `PROGRESS-48.md`.

## models.html bản 2 (issue #44: dán link HF là ra, huy hiệu vừa máy ở danh sách)
- Bản 1 giữ nguyên ở `models-v1.html` (để so sánh). Bản 2: `models.html` + `assets/models-v2.js` + chữ ở `assets/models-i18n.js` (vi/en/中文). Không thêm cài đặt mới. Khoá lưu: `aivn.models.v2.machine`, `aivn.models.v2.real` (số thật đã lưu đệm), `aivn.models.v2.downloaded`. Tham số URL: `?lang=vi|en|zh`, `?open=tên-người/tên-mô-hình`, `?fresh=1` (xoá lưu đệm).
- **Dữ liệu:** API Hugging Face thật, lấy một lần ngày 23/10/2026 bằng `tools/fetch-hf/fetch.py`, `fetch2.py`, `fetch3.py` → `build.py` ra `assets/data/models-hf-2026-10-23.json` (+ `.js` cho chạy ngoại tuyến), 36 kho GGUF (Qwen3/Qwen3-VL/Qwen3.5, Gemma 3/3n/4, Llama 3.x, Phi, Mistral/Ministral, 1 kho cần đồng ý điều khoản: google/gemma-3-4b-it-qat-q4_0-gguf). Danh sách dùng đúng 1 lời gọi kiểu `/api/models?search=…&filter=gguf&expand[]=gguf&expand[]=siblings…`; khi mở kho dùng `/tree/main` + README + đầu tệp GGUF (Range 2 MiB) để lấy số lớp/đầu KV/SWA. Bản mẫu không gọi mạng: “mở kho” dùng dữ liệu đã lấy sẵn; kho không có trong mẫu thì hiện bảng “ngoại tuyến”.
- **Dán link:** nhận `https://huggingface.co/…`, `hf.co/…`, dạng `/tree/`, `/blob/…gguf` (chọn sẵn bản lượng tử), `/resolve/`, `/models/` và `tên-người/tên-mô-hình`; từ chối datasets/spaces. Dán là mở thẳng trang mô hình ở tab README; gõ tay thì có dòng gợi ý, Enter để mở.
- **Ước tính ở danh sách (chưa mở kho):** Q4_K_M ≈ số tham số (gguf.total) × 4,85 / 8 byte × 1,1 (+ ≈ 0,8 GB nếu kho có mmproj — phần nhìn ảnh). Ngưỡng T = 90% VRAM. |cần − T| ≤ 15% T ⇒ “≈ cần kiểm tra” (không bao giờ tính là Mượt); cần < T (thực tế < 0,85 T) ⇒ “≈ Chạy mượt”; ≤ T + 60% RAM ⇒ “≈ Chạy chậm”; còn lại “≈ Không chạy được”. Máy 4 GB/16 GB: Mượt < 3,06 GB, kiểm tra 3,06–4,14, Chậm ≤ 13,2. Máy 12 GB/32 GB: Mượt < 9,18, kiểm tra 9,18–12,42, Chậm ≤ 30 (GB = GiB).
- **Số thật khi mở kho:** dung lượng tệp thật + KV cache ở ngữ cảnh 4.096 (KV q8_0 nếu VRAM < 6 GB, ngược lại f16; tính SWA, lớp dùng chung KV, lớp lai; thiếu đầu GGUF thì cộng 0,5 GB) + 0,4 GB bộ đệm tính toán + mmproj thật (ưu tiên Q8_0 > F16 > BF16 > F32) + 0,15 GB nếu có ảnh. Số này lưu đệm và thay huy hiệu ≈ ở danh sách (bỏ dấu ≈). tok/s chỉ là đoán thô từ băng thông bộ nhớ (hiệu suất 0,55; 192 GB/s cho 3050 Ti, 504 GB/s cho 4070 SUPER, RAM 51 GB/s; MoE tính theo tham số hoạt động) — chưa hiệu chỉnh.
- **Nhìn màn hình** = kho có tệp mmproj. **Dùng công cụ** = mẫu chat GGUF có phần công cụ hoặc thẻ kho (tool/function-calling). Mọi kết quả đều hiện, nhóm “Chạy mượt” lên đầu.
- **Kiểm tự động:** `node tools/i18n-models.js` (thiếu khoá / còn tiếng Việt ở en, zh / sai {n}), `python tools/touch-check-models.py` (đích chạm ≥ 44 px khi pointer:coarse ở 280/320/375 × vi/en/zh + tràn ngang + lỗi JS), `python tools/trunc-check-models.py` (chữ bị cắt ở 1280/1024/390, chữ Việt sót ở en/zh, tràn ngang, lỗi JS). Chạy bằng /home/box/pwenv/bin/python, cần máy chủ tĩnh ở cổng 8765.
- Ảnh: `shots/14*.png` (`tools/shots14.py`), so sánh bản 1 | bản 2 ở `shots/cmp-models/` (`tools/compare-models.py`). Tiến độ và câu hỏi còn mở: `PROGRESS-44.md`.

## connect.html v4.12 (góp ý QA bản 4.11, lượt 10)
- Bản 4.11 giữ nguyên ở `connect-v4.11.html` (JS riêng `assets/connect-v411.js`, `assets/connect-i18n-v411.js`, khoá lưu `aivn.plugins.v411`). Bản 4.12 dùng khoá `aivn.plugins.v412` / `aivn.secrets.v412` / `aivn.notkey.v412`.
- P411-1/2/3 (chặn PR #15): nhận diện khoá theo LUẬT, không theo danh sách tên. Một luật “tên = giá trị” / “tên: giá trị” áp cho mọi chuỗi: env trong args (`docker -e A=b`, `--env=A=b`, `"OPENAI_API_KEY=sk…"`), cờ tách rời (`--x-token v`, `-k v`), cờ tách đôi (`--api key v`), `mysql -p v` / `-pV`, khoá JSON lồng nhau ở mọi độ sâu (camelCase: `refreshToken`, `clientSecret`…), tên env ngắn (PAT, DSN, BEARER, JWT, OTP). URL xét mọi phần bằng cùng luật: userinfo (`user:mật-khẩu@`, `:mật-khẩu@`, `token@`), truy vấn (kể cả tên mã hoá `%5F`), fragment (`#access_token=`). Che ở thẻ khoá, kế hoạch nhập, bản so sánh, chi tiết, nhật ký/crash-log, lớp tô màu trình sửa (kể cả khi tệp còn lỗi cấu trúc), localStorage.
- P411-7: “không phải khoá” chỉ áp cho ĐÚNG máy chủ + vị trí + chuỗi đó (chỉ lưu dấu băm); máy chủ khác có cùng chuỗi vẫn được hỏi lại; có nút đặt lại; số đếm ở tiêu đề thẻ khoá đúng sau khi bỏ chọn.
- P411-4/5/6 (tên): xét trùng theo CẢ tên (1–64 ký tự Unicode, bỏ khoảng trắng hai đầu, NFC) — mã nội bộ safeName dùng hai băm 32-bit giữ đủ chữ số (4.11 cắt còn 6 chữ số nên `…-xx-3`/`…-xx-4` ra cùng mã; 80 000 tên dài thử: 0 trùng), nếu hiếm hoi vẫn trùng thì trình sửa báo lỗi và không cho Lưu; “Giữ cả hai” = tên gốc + `-2/-3…`, chỉ cắt phần gốc khi tổng vượt 64; đếm theo ký tự Unicode ở cả ba nơi (Thêm, nhập, trình sửa) với cùng một luật.
- P411-8: digest/SRI (`sha256:…`, `sha512-…`) và giá trị của tên kiểu băm/mã (`GIT_SHA=`, `KEY_ID=`, `"digest":`) không bao giờ là khoá.
- P411-9: dưới 400 px nút “📂 Chọn tệp mcp.json…” chiếm cả hàng và xuống dòng (vi/zh không còn bị cắt ở 280–360 px).
- P411-10 (hiệu năng): nhớ kết quả dò theo chuỗi (trình sửa 3000 máy chủ chỉ quét lại phần đã đổi); kiểm trùng tên O(n). Dán nhiều dòng: trình duyệt bắn beforeinput/input/scroll cho TỪNG dòng, trước đây mỗi lần đều đọc lại cả văn bản, tô màu lại, chụp hoàn tác và đồng bộ cuộn (bậc hai) → nay gom cả loạt thành một lần; mỗi phím thật vẫn là một thao tác riêng nên Ctrl+Z/Ctrl+Y vẫn theo thao tác (một từ, một lần dán).
- Trình sửa chỉ bật Lưu khi cả tệp hợp lệ; máy chủ sai cấu trúc MCP (ví dụ `url` không phải http/https như `redis://…`, hoặc có cả `command` lẫn `url`) được nêu tên ở dòng lỗi kèm “Đến chỗ lỗi”, khoá trong đó vẫn bị che.
- Cỡ điều khiển (quy tắc min24, 23/10): mọi điều khiển ở mọi khổ (280/320/375/1280 px), cả khi dùng chuột, có hộp hiển thị cao ≥ 24 px — không dùng ngoại lệ khoảng cách của WCAG. Công tắc thêm viền trong suốt trên/dưới (`background-clip:padding-box`) nên rãnh và nút gạt nhìn như cũ; liên kết, `summary`, huy hiệu, nút Đóng, nhãn “Luôn chạy sẵn” có `min-height:24px`. Màn chạm vẫn ≥ 44×44. Kiểm: `python tools/min24-check.py [URL]` (4.11: 1385 lần đo dưới 24 px trên 46 phần tử).
- Kiểm tự động (bọc `flock /workspace/.aivn-heavy.lock timeout 840`, chạy từng việc một): `node tools/secret-rule-test.js assets/connect.js` (bộ ca luật 148 ca), `node tools/secret-scan-test.js` (e2e, gồm ca 7: 138 máy chủ dán/nhập, 7b: P411-7, 7c: Ctrl+V/fill → Lưu bật + hoàn tác theo thao tác), `node tools/longname-test.js`, `python tools/touch-check.py`, `python tools/min24-check.py`, `python tools/p411-small-checks.py`, `python tools/toolbar-row-check.py`, `python tools/trunc-check.py`, `python tools/p49-small-checks.py`, `node tools/i18n-missing.js` (python = /home/box/pwenv/bin/python).
- Ảnh: `shots/20-*.png`, so sánh 4.11 | 4.12 ở `shots/cmp412/` (`tools/shots20.py`).
- Kết quả: (đang chạy lại sau đợt đóng băng khoá; xem bên dưới khi xong)

## connect.html v4.11 (góp ý QA bản 4.10, lượt 9)
- Bản 4.10 giữ nguyên ở `connect-v4.10.html` (JS riêng `assets/connect-v410.js`, `assets/connect-i18n-v410.js`, khoá lưu `aivn.plugins.v410`). Bản 4.11 dùng khoá `aivn.plugins.v411` / `aivn.secrets.v411` / `aivn.notkey.v411`.
- P410-1 (chặn): “Giữ cả hai” với tên ≥ 24 ký tự không còn treo. Tên mới so với TOÀN BỘ tên đang có (trừ chính nó), rút ngắn phần gốc để đuôi -2/-3… không bị cắt khi chuẩn hoá, vòng lặp có giới hạn + tên dự phòng. Quy tắc tên chung cho Thêm, nhập và trình sửa (quyết định 23/10): tên Unicode (có dấu, chữ Hán, emoji) dài 1–64 ký tự; tên chữ Hán/emoji khác nhau không bị coi là trùng (chuẩn hoá thêm mã băm ngắn); tên Latin hoặc tiếng Việt có dấu vẫn so theo 24 ký tự đầu sau khi bỏ dấu, nên hai tên chỉ khác nhau sau ký tự thứ 24 bị báo “trùng nhau sau khi chuẩn hoá” (như 4.10); nhập tệp có tên > 64 ký tự thì rút gọn còn 64 và báo trong kế hoạch (nhóm “Đã rút gọn tên dài…”); Thêm và trình sửa báo lỗi “từ 1 đến 64 ký tự”. Kiểm: `node tools/longname-test.js` (24/40/200 ký tự, có dấu, chữ Hán, 64 và 70 chữ Hán, emoji, tên đã có -2/-3; nhập, trình sửa, Thêm).
- P410-2 (chặn): dò thêm secret AWS (theo tên khoá), tiêu đề tuỳ ý dạng *-API-Key / *-Token / X-Session, access_key/secret_key, mật khẩu trong URL `user:mật-khẩu@` ở mọi chuỗi, DB_PASS/DB_PASSWORD/*_PW, tham số `--db-password`. Che ở thẻ khoá, bản so sánh, chi tiết, nhật ký, lớp tô màu, kế hoạch nhập, thông báo, title/aria-label và localStorage. `node tools/secret-scan-test.js [url]` có thêm ca 6 = đúng ma trận 24 khoá của QA (§1a): 4.10 lọt 6/24, 4.11 lọt 0/24.
- P410-8: nút “Kết nối ứng dụng” trên trang chính ≥ 44 px (mọi con trỏ); thanh nháp của prototype ≥ 44 px khi chạm. `tools/touch-check.py` đo thêm trang chính.
- P410-3: bỏ chọn một dòng trong thẻ khoá = “không phải khoá”, chỉ dòng đó giữ nguyên, các máy chủ khác vẫn lưu; thẻ hiện vài ký tự đầu (ví dụ `hf_Qa••••`) và câu giải thích. Dòng bị bỏ chọn có thêm một dòng cảnh báo: “Giá trị này sẽ được lưu trong mcp.json dưới dạng chữ thường (không che).” (quyết định 23/10; secret-scan-test ca 4 kiểm).
- P410-4/5/6/7: JWT là một khoá; sha256/digest/tệp .gguf không coi là khoá; toast “Hoàn tác” dịch lại khi đổi ngôn ngữ.
- Theo trả lời của quản lý: dòng trùng tên cùng URL hiện đúng chỗ khác (ví dụ `header Authorization: ••• → ${HF_TOKEN}`, khoá luôn che; giống hệt thì nói “Giống hệt…”); lich-cong-ty nêu rõ kiểu đăng nhập chưa hỗ trợ và cách xử lý (gỡ máy chủ hoặc chờ bản sau), công tắc xám có tooltip, mô tả cho trình đọc màn hình và chạm vào thì hiện giải thích; thanh công cụ một hàng từ 1024 px (`{ }` chỉ biểu tượng + tooltip, 1024–1279 ẩn chữ “Nhập”), dưới 1024 được xuống dòng. Kiểm: `tools/toolbar-row-check.py`.
- P410-9: Ctrl+Z / Ctrl+Y trong trình sửa mcp.json theo thao tác (một từ, một lần dán, một lần Bỏ thay đổi…). P410-10: ở 280–399 px header, tên máy chủ và banner nháp xuống dòng thay vì bị cắt.
- Kiểm tự động (máy dùng chung: bọc bằng `flock /workspace/.aivn-heavy.lock`, chạy từng việc một): `node tools/secret-scan-test.js`, `node tools/longname-test.js`, `python tools/touch-check.py`, `python tools/trunc-check.py`, `python tools/toolbar-row-check.py`, `python tools/p411-small-checks.py`, `python tools/p49-small-checks.py`, `node tools/i18n-missing.js` (python = /home/box/pwenv/bin/python).
- Ảnh: `shots/18-*.png`, so sánh 4.10 | 4.11 ở `shots/cmp411/` (`tools/shots18.py`).
- Kết quả lần chạy cuối (23/10, giờ Bangkok): ma trận khoá 4.11 lọt 0/24 (119 phép kiểm), 4.10 lọt 6/24 như QA báo; tên dài 32/32; vùng chạm 0 lỗi (117 trạng thái, 2469 phép đo); kiểm nhỏ 4.11 30/30; kiểm nhỏ 4.9 5/5; cắt chữ 0/24282; 280/320 px 30 tổ hợp, 0 dòng bị cắt; thanh công cụ một hàng ở 1024/1280/1440 (0 lỗi, 12 phép đo); i18n thiếu 0 khoá; ảnh 18-* và cmp411 không có lỗi JS.

## connect.html v4.10 (góp ý QA bản 4.9, lượt 8)
- Bản 4.9 giữ nguyên ở `connect-v4.9.html` (JS riêng `assets/connect-v49.js`, `assets/connect-i18n-v49.js`, khoá lưu `aivn.plugins.v49`). Bản 4.10 dùng khoá `aivn.plugins.v410`.
- P49-2 (khoá): dò khoá ở mọi chỗ trong mcp.json — giá trị env có tên *_KEY/*_TOKEN/*_SECRET/*_APPID/*PASSWORD*…, tham số `--api-key X`, `--token=X`, `-k X`, URL `?api_key=/token=/key=/access_token=/auth=`, tiêu đề Authorization/Bearer, chuỗi trông như khoá (sk-, ghp_, github_pat_, hf_, xox*, AIza, base64/hex dài ≥20). Áp dụng khi nhập, khi lưu trong trình sửa, khi Thêm (Nâng cao). Thẻ xin phép liệt kê từng khoá đã che + vị trí, chọn từng mục; sau khi chuyển, mcp.json có `${secret:…}` (URL chỉ thay giá trị tham số). Từ chối → máy chủ không được lưu với khoá lộ. Kho khoá trong bản mẫu chỉ là mục giả lập đã làm rối (`sim1:`); ứng dụng thật dùng kho khoá của hệ điều hành. Lưu trong trình sửa là nguyên khối: còn một máy chủ bị chặn thì cả tệp không lưu; nhập thì chặn từng máy chủ. Bản nháp trình sửa chỉ giữ trong bộ nhớ, không ghi xuống.
- P49-1: dưới `@media (pointer: coarse)` mọi vùng chạm ≥ 44×44 px.
- P49-3: trùng tên (nhập, trình sửa, Thêm): Giữ cả hai (đổi tên mới thành …-2) / Thay thế (qua thẻ xin phép) / Bỏ qua.
- Theo trả lời của quản lý: “Của tôi” chỉ gồm mục tự thêm; thẻ Lưu mcp.json có bản so sánh ngắn (khoá đã che); thẻ lọc riêng “Đã kết nối” (huy hiệu mở cùng bộ lọc); mô tả EN/ZH rút ngắn, không bị cắt ở 1280/1024/390 (chú thích rê chuột giữ câu đầy đủ).
- Lỗi nhỏ P49-4..10: Bỏ thay đổi hoàn tác được (Ctrl+Z một bước + thông báo “Hoàn tác”); bỏ BOM khi nhập/dán; Esc/✕ hỏi khi còn sửa dở; công tắc dòng lỗi bật/đỏ “Đang lỗi, bấm để thử lại”; dưới 400px mô tả 2 dòng, nhãn “Tự thêm” thành biểu tượng có aria-label; dải thẻ lọc mờ dần ở mép; thẻ nhập nhiều máy chủ giới hạn danh sách + “+N máy chủ nữa”. Tô màu cú pháp nhẹ cho trình sửa mcp.json (bộ tách từ riêng, lớp phủ, giữ số dòng và “Đến chỗ lỗi”).
- Kiểm tự động: `node tools/secret-scan-test.js`, `python tools/touch-check.py`, `python tools/trunc-check.py`, `python tools/p49-small-checks.py` (chạy bằng /home/box/pwenv/bin/python).
- Ảnh: `shots/15*.png`, `shots/16*.png` (`tools/shots15.py`), so sánh 4.9 | 4.10 ở `shots/cmp410/` (`tools/compare410.py`).

## connect.html v4.9 (góp ý QA bản 4.8, lượt 7)
- Bản 4.8 giữ nguyên ở `connect-v4.8.html` (JS riêng `assets/connect-v48.js`, `assets/connect-i18n-v48.js`, khoá lưu `aivn.plugins.v48`). Bản 4.9 dùng khoá `aivn.plugins.v49`.
- Hướng LM Studio: mỗi dòng có công tắc bật/tắt (`role="switch"`, `aria-checked`, Space/Enter), bật/tắt vẫn qua thẻ xin phép như đã thống nhất; nút “⋯” trên dòng và ở bảng phải thay hàng 5 nút (Mở chi tiết, Kết nối lại, Chạy thử lại, Đổi tên hiển thị, Thêm khoá, Xem chi tiết kỹ thuật, Gỡ/Xoá — chỉ hiện mục áp dụng được). Bảng phải còn một nút chính lớn.
- Dưới 768px: danh sách → chi tiết (một khung mỗi lúc), nút “Quay lại” (Esc cũng quay lại); từ 768px trở lên giữ hai cột.
- Bộ lọc: “Tất cả” gồm cả mục đã kết nối và mục tự thêm; ô tìm cũng tìm trong đó. **Đã cài** = ứng dụng có sẵn đã kết nối + mọi ứng dụng tự thêm (kể cả đang tắt hay lỗi); có dòng chú thích dưới bộ lọc. Bấm huy hiệu “x đã kết nối” → lọc “Đã kết nối” (chỉ mục đang bật, chấm xanh lá), bấm lại hoặc ✕ để bỏ.
- Màu chấm dưới ô chat khớp chú thích: xanh dương = đang chạy thử / đang cài, xanh lá = đã kết nối, đỏ = lỗi.
- Bàn phím: focus giữ nguyên khi vẽ lại; ↑/↓ chọn dòng, Enter mở chi tiết; Tab bị giữ trong hộp; đóng thì focus về nút đã mở; vòng focus rõ.
- Sửa mcp.json trong ứng dụng (nút `{ }` trên thanh trên, hoặc Nâng cao → mcp.json): số dòng, kiểm tra JSON báo lỗi dễ hiểu kèm dòng/cột và “Đến chỗ lỗi”, khoá chỉ hiện `${secret:…}` (khoá thô dán vào sẽ được cất an toàn), Lưu qua thẻ xin phép, mục thêm/đổi được chạy thử theo luật cũ.
- Sửa lỗi nhỏ: tóm tắt quyền Excel khớp bảng; ẩn “＋ Thêm khoá (nếu cần)” khi đã có ô khoá (thêm khoá phụ qua ⋯); chữ thanh bên, tiêu đề, tiêu đề trang, thông báo đã dịch EN/ZH; nút “Kết nối ứng dụng” không bị che ở 768/1024; mô tả bị cắt có chú thích khi rê chuột; mô tả tiếng Anh ngắn hơn.
- Ảnh: `shots/13*.png` (`tools/shots13.py`), so sánh 4.8 | 4.9 ở `shots/cmp49/` (`tools/compare49.py`).

## connect.html v4.8 (quyết định ngày 22/10, lượt 6)
- Bản 4.7 giữ nguyên ở `connect-v4.7.html` (+ `assets/connect-v47.js`, `assets/connect-i18n-v47.js`, khoá lưu v47). Bản 4.8 dùng khoá `aivn.plugins.v48` / `aivn.secrets.v48`.
- Dòng lỗi trong danh sách bên trái chỉ còn chấm đỏ + “Lỗi” (Error / 错误); “(mẫu lỗi)” chỉ ở bảng bên phải của lich-cong-ty.
- Chú thích màu thêm xanh dương = đang chạy thử / đang cài.
- Ứng dụng tự thêm / nhập không khai báo khoá: không có ô khoá lớn, chỉ liên kết nhỏ “＋ Thêm khoá (nếu cần)” để mở ô. Ô khoá tô sáng chỉ hiện qua Nhập khoá khi chạy thử báo thiếu/sai khoá. Ứng dụng đã khai báo khoá (brave-search, tim-kiem) vẫn hiện dòng khoá.
- Ứng dụng tự thêm có nhãn “Tự thêm” (Added by you / 自行添加) và mô tả nói rõ việc làm (vd thoi-tiet: “Xem thời tiết theo thành phố.”); không đoán được thì “Chưa có mô tả. Mở Chi tiết để xem lệnh.”
- “N đã kết nối” đếm mọi mục đã kết nối, gồm cả mục Nâng cao (đã kiểm: 7 = 7 dòng xanh trong Của tôi).
- Ảnh: `tools/shots12.py` → `shots/12*.png`; so sánh cạnh nhau `tools/compare48.py` → `shots/cmp48/`.

## connect.html v4.7 (quyết định ngày 22/10, lượt 5)
Phản hồi bản 4.6: “chưa trực quan, chưa tốt như LM Studio”. Bản 4.6 giữ nguyên để so sánh: `connect-v4.6.html` (+ `assets/connect-v46.js`, `assets/connect-i18n-v46.js`, khoá `aivn.plugins.v46`/`aivn.secrets.v46`). Bản 4.7 dùng khoá `aivn.plugins.v47`/`aivn.secrets.v47`.
- Hai cột: trái là danh sách gọn (logo lớn, tên, một dòng mô tả, chấm trạng thái), phải là chi tiết với một nút chính lớn theo trạng thái; nút phụ nhỏ hơn. Chữ kỹ thuật trong Chi tiết.
- Thanh trên: ô tìm, các nhóm lọc, Của tôi và ⚙ Nâng cao là bộ lọc (không còn màn riêng), nút 📂 Nhập mcp.json.
- Màu trạng thái: xanh đã kết nối, xám chưa, đỏ lỗi, vàng sắp có, xanh dương đang chạy thử/đang cài. Chú thích ở dưới danh sách.
- Sửa của QA: khoá Hugging Face ghi “Không bắt buộc”; GitHub một mục (cách chạy bằng Docker trong Chi tiết); lich-cong-ty mô tả “(mẫu lỗi)”; ô vừa nội dung.
- Ảnh: `shots/11*.png`; so sánh 4.6 ↔ 4.7 cùng trạng thái: `shots/cmp/c*.png` (`tools/compare47.py`). Script ảnh: `tools/shots11.py`.

## connect.html v4.6 (quyết định ngày 22/10, lượt 4)
- connect.html = bản 4.6. Mã: `assets/connect.js`; chữ: `assets/connect-i18n.js` (khối v4.6 ở cuối tệp). localStorage `aivn.plugins.v46`; kho khoá giả lập `aivn.secrets.v46`. Bản 4.5 để so sánh: `connect-v4.5.html`.
- (a) Chữ trên ô lấy theo TÊN HIỂN THỊ (id chỉ dùng bên trong). Đổi tên thì chữ đổi theo (vd. `thoi-tiet` → "Dự báo thời tiết" → D). "Sổ tay agent" có biểu tượng sổ tay riêng (`assets/logos/agent-notebook.svg`, tự vẽ, CC0, xem CREDITS.md).
- (b) Chỉ chạy thử khi: nhập mcp.json, thêm ở Nâng cao, bấm "Chạy thử lại", hoặc kết nối lại mục đang Lỗi. Kết nối lại một mục đã chạy thử được thì KHÔNG chạy thử (nhanh), có thông báo nhỏ "Lần trước chạy thử đã được nên không chạy thử lại." Mục chưa từng chạy thử thì lần kết nối đầu vẫn chạy thử. Nâng cao có hai nút: "Kết nối lại" (không chạy thử nếu đã được) và "Chạy thử lại" (luôn chạy thử). Chữ trên thẻ xin phép đổi theo.
- (c) Ô khoá ở Nâng cao (máy chủ người dùng thêm và mục cần khoá): ô che (••••) có nút 👁 hiện/ẩn; "Lưu an toàn trên máy, không ghi vào mcp.json." mcp.json chỉ giữ chỗ `${secret:tim-kiem}` (nếu một máy chủ có nhiều khoá: `${secret:ten:BIEN}`). Khoá đã lưu hiện "🔒 Đã lưu ••••••••" với "Thay khoá"/"Xoá khoá", không bao giờ điền lại vào ô. Chi tiết, stderr và nhật ký che khoá (••••). Lỗi thiếu/sai khoá có nút "Nhập khoá" mở thẳng Nâng cao tới ô khoá (đã chọn sẵn, tô sáng); lưu xong có nút "Chạy thử lại".
  - Lựa chọn: lưu/đổi/xoá GIÁ TRỊ khoá do người dùng tự bấm nên không qua thẻ xin phép. "＋ Thêm khoá" (thêm BIẾN khoá mới) làm đổi cách chạy ứng dụng nên qua thẻ, giống quy tắc "đổi tên biến thì mất duyệt".
  - Giả lập khoá sai: ngắn hơn 8 ký tự hoặc bắt đầu bằng `sai`/`wrong`/`test` → "Khoá truy cập không đúng hoặc đã hết hạn."
- (d) Thiếu chương trình (QA 93e): câu dễ hiểu ("Máy này chưa có uv, một chương trình mà ứng dụng này cần để chạy."), nút "Hướng dẫn cài ↗" tới trang chính thức (uv: docs.astral.sh, Node.js: nodejs.org/en/download, Docker: docs.docker.com/get-started/get-docker/). Với uv và Node.js có thêm "Cài giúp tôi": thẻ xin phép ghi chương trình, nơi cài (`C:\Users\Khoi\AppData\Local\AIVN\tools\<tên>`), dung lượng "khoảng N MB (ước tính)", nguồn tải; không đổi PATH, không cần quyền quản trị → thanh tiến trình giả lập (ô hiện "Đang cài…") → tự "Chạy thử lại". Docker chỉ có hướng dẫn (AIVN không tự cài). Tệp ví dụ có `sqlite` (uvx) và thêm `github` (máy chủ GitHub chính thức chạy bằng docker, khoá được chuyển vào kho khoá khi nhập).
- Ảnh: `shots/10*.png`, chạy lại bằng `tools/shots10.py`.
- Câu hỏi mở: (1) bản thật cài uv/Node.js vào đâu, có ghim phiên bản không, kiểm tra chữ ký thế nào; (2) "Kết nối lại" một mục đã được có cần khởi động lại tiến trình đang chạy không; (3) mục cửa hàng/Hugging Face kết nối không có token có cần ô khoá không; (4) ghi chú GitHub trong cửa hàng và bản mẫu `github` chạy bằng docker có nên gộp; (5) khoá trên máy dùng kho khoá của hệ điều hành (bản mẫu giả lập bằng localStorage riêng).

## connect.html v4.5 (quyết định ngày 22/10, lượt 3)
- Bản 4.5 được giữ ở `connect-v4.5.html` (mã `assets/connect-v45.js`, chữ `assets/connect-i18n-v45.js`, localStorage `aivn.plugins.v45`). Bản 4.4 để so sánh: `connect-v4.4.html`.
- (1) Giữ: công tắc chính bật/tắt TẤT CẢ ứng dụng đã kết nối; việc ghi vẫn qua thẻ xin phép.
- (2) Máy chủ "Ghi nhớ" đổi tên thành "Sổ tay agent" / "Agent notebook" / "智能体笔记本". "Ghi nhớ" dành cho tính năng có sẵn của AIVN. Mô tả mới: "Sổ tay riêng của AIVN AGENT, nằm trong ứng dụng này. Không phải tính năng Ghi nhớ của AIVN và không ghi vào đó." Chữ trên ô lấy theo id (`memory` → M), không theo tên hiển thị.
- (3) Chạy thử một lần khi nhập mcp.json và khi thêm/kết nối ở Nâng cao: mở → xem danh sách chức năng → tắt ngay, tối đa 15 giây, có thanh "Đang chạy thử… n/15 giây". Thẻ xin phép nói trước là sẽ chạy thử. Được: "Chạy thử được · N chức năng". Lỗi: câu dễ hiểu + cách sửa (quá giờ, thiếu chương trình, thiếu khoá, không tới được qua mạng); mã lỗi, mã thoát, stderr nằm trong "Chi tiết". Nút "Chạy thử lại". Sau khi chạy thử vẫn chờ dùng lần đầu. Tệp ví dụ có `sqlite` (lệnh `uvx` không có → lỗi), `tim-kiem` (khoá trống), `bao-cao` (quá 15 giây), `nas-nha` (không tới được).
  Bản mẫu giả lập kết quả theo cấu hình (không chạy tiến trình thật).
- (4) Máy chủ người dùng thêm hiện tên gốc (khoá trong mcp.json). Có nút "Đổi tên hiển thị": sửa ngay tại chỗ, không cho để trống, "Dùng tên gốc" để quay lại. Tên gốc luôn có trong "Chi tiết" (và trong "Chi tiết" của thẻ xin phép). Tên hiển thị dùng ở màn hình chính, huy hiệu, cảnh báo, thẻ. Chữ trên ô vẫn theo tên gốc.
- Ảnh: `shots/9*.png`, chạy lại bằng `tools/shots9.py`.

### Khác với Doc bản 2 (cho designer)
- Phạm vi công tắc chính: Doc bản 2 chỉ nói máy chủ MCP; bản mẫu: công tắc "Cho AIVN AGENT dùng các ứng dụng đã kết nối" bật/tắt TẤT CẢ ứng dụng đã kết nối (cả AIVN Kinh doanh, Excel). Việc ghi vẫn qua thẻ xin phép.
- Bỏ tự khởi động ứng dụng cửa hàng khi mở AIVN.
- Chạy khi dùng lần đầu cho mọi thứ (Doc §5.6/§8.3 tự khởi động máy chủ đã duyệt). Máy chủ Nâng cao có tuỳ chọn "Luôn chạy sẵn" (mặc định tắt, bật thì qua thẻ xin phép).
- Ô "Sắp có" có nút "Báo tôi khi có" (chỉ báo trong ứng dụng, không gửi gì ra ngoài).
- Trạng thái mới "Đã kết nối · chờ dùng lần đầu" (và "Đang chạy thử…").
- Nhóm Tài chính trống: "Chưa có ứng dụng tài chính. Nhóm này sẽ có thêm ứng dụng trong các bản sau."
- Excel có thư mục riêng (lần đầu = thư mục của AIVN AGENT), đổi qua thẻ xin phép; thư mục của AIVN AGENT đổi ở bảng bên.
- Đổi tên: "Plugin/MCP" → "Kết nối ứng dụng"; "Ghi nhớ MCP" → "Sổ tay agent"; công tắc → "Cho AIVN AGENT dùng các ứng dụng đã kết nối"; chữ "máy chủ/công cụ/tool" không có trên màn hình chính (chỉ trong Nâng cao và "Chi tiết").
- Mới trong 4.5 (Doc chưa có): chạy thử một lần khi nhập/thêm (tối đa 15 giây) và "Đổi tên hiển thị" cho máy chủ người dùng thêm.
