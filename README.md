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
- connect.html = bản 4.4. Mã: `assets/connect.js`; chữ: `assets/connect-i18n.js` (khối v4.4 ở cuối tệp). localStorage `aivn.plugins.v44`.
- (a) "Ghi nhớ MCP" → "Ghi nhớ" (Memory / 记忆); chữ MCP và tên gốc chỉ trong "Chi tiết".
- (b) Công tắc bảng bên: "Cho AIVN AGENT dùng các ứng dụng đã kết nối" (giờ áp dụng cả ứng dụng cửa hàng). Cảnh báo/chặn nhiều ứng dụng dùng chữ thường; số liệu trong "Chi tiết".
- (c) Mọi ứng dụng chỉ chạy khi AIVN AGENT dùng lần đầu. Máy chủ Nâng cao có "Luôn chạy sẵn" (mặc định tắt) thay cho tự khởi động.
- (d) Excel có thư mục riêng (lần đầu = thư mục của AIVN AGENT, hiện trong thẻ xin phép). "Đổi thư mục" của Excel chỉ đổi thư mục Excel; thư mục của AIVN AGENT đổi ở bảng bên. Đổi sang thư mục mới (cả hai) đều qua thẻ xin phép.
- §17.5: so khớp URL sau khi chuẩn hoá (bỏ '/' cuối, host không phân biệt hoa thường, path phân biệt). Gói so khớp bỏ qua phiên bản. Chỉ trùng tên → Của tôi.
- Ảnh: `shots/8*.png`, chạy lại bằng `tools/shots8.py` (in kiểm tra chữ kỹ thuật trên màn hình chính, thanh agent và bảng bên).
