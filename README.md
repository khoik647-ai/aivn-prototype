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
