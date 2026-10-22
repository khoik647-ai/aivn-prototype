# AIVN – Bản mẫu giao diện (prototype tĩnh)
Trang tĩnh, không cần build: index.html, models.html, chat.html, products.html, connect.html (theo thiết kế nháp F-PLUGINS, PR #1; logic ở assets/connect.js, chữ ở assets/connect-i18n.js) (+ assets/).
Chạy cục bộ:  cd proto-aivn && python3 -m http.server 8765  → http://localhost:8765/
Chụp ảnh lại: /home/box/pwenv/bin/python tools/shots.py  (cần server chạy ở cổng 8765)
Dữ liệu mẫu lưu trong localStorage (aivn.downloaded, aivn.biz). Nút "Đặt lại dữ liệu mẫu" ở trang Kinh doanh.

## connect.html theo F-PLUGINS (PR #1)
- Bản trước khi bám PR #1: tools/connect-v1-before-PR1.html.bak; ảnh cũ: shots/v1-before-PR1/.
- Ảnh mới: shots/5*.png, tạo bằng `/home/box/pwenv/bin/python tools/shots5.py` (cần http.server cổng 8765).
- Dữ liệu lưu ở localStorage khoá `aivn.plugins.v2`; nút “↺ Đặt lại” trên dải bản nháp xoá về dữ liệu mẫu.
