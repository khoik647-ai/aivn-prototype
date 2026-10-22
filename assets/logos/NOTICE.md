# NOTICE: logo, nhãn hiệu và giấy phép / Logos, trademarks and licences

Tệp này thay cho CREDITS.md (F-PLUGINS bản 2, PR #5: “logo lưu cục bộ, kèm tệp NOTICE”). Mọi logo nằm trong `assets/logos/` và được tải cục bộ; trang không lấy logo từ site khác khi chạy.

## Nhãn hiệu
Tên và logo Excel, Microsoft Excel, Gmail, Google Drive, Google Calendar, Google, Notion, Zalo, GitHub, Brave, Hugging Face, Slack, SQLite, Qwen, Meta, Mistral AI, NVIDIA, AMD và Model Context Protocol là nhãn hiệu của chủ sở hữu tương ứng. Bản mẫu chỉ dùng chúng để người dùng nhận ra ứng dụng. Việc dùng logo không có nghĩa là các hãng này tài trợ, liên kết hay chứng nhận AIVN. Trước khi phát hành thật, cần kiểm tra hướng dẫn thương hiệu của từng hãng.

## Logo dùng trong connect.html v4.2 (theo PR #5)

| Ô | Tệp | Nguồn | Giấy phép tệp | Ghi chú |
|---|---|---|---|---|
| AIVN Kinh doanh (`biz`) | aivn-app.svg | Biểu tượng của chính ứng dụng AIVN, chép nguyên từ `src/renderer/logo-tile.svg` của mã AIVN (chỉ đọc, không sửa nguồn) | Thuộc dự án AIVN | Mục 5.4: biz dùng biểu tượng của AIVN |
| Excel (`excel`) | microsoftexcel.svg (giữ nguyên tệp, không đổi màu hay hình; màu #217346 theo simple-icons; sha256 3392b76e2c1791f6622bc6a27bcf332ea6985cf263f8cb7153a37d43d74d2940) | simple-icons@12.4.0 (https://unpkg.com/simple-icons@12.4.0/icons/microsoftexcel.svg) | **Giấy phép riêng của Microsoft** (https://aka.ms/fluentui-assets-license), không phải CC0 | Khôi quyết định giữ logo thật (22/10/2026). Hướng dẫn nhãn hiệu Microsoft: https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks. Cần duyệt điều khoản trước khi phát hành |
| Drive, Calendar, Gmail (Sắp có) | googledrive.svg, googlecalendar.svg, gmail.svg | simple-icons@16.35.0 | CC0 1.0 cho bộ sưu tập; nhãn hiệu thuộc Google | |
| Notion, Zalo (Sắp có) | notion.svg, zalo.svg | simple-icons@16.35.0 | CC0 1.0 cho bộ sưu tập; nhãn hiệu thuộc chủ sở hữu | |
| Năm dòng Nâng cao (Thư mục, Đọc trang web, Hugging Face, Ghi nhớ MCP, Suy nghĩ từng bước) và máy chủ trong mcp.json | không dùng tệp: ô chữ cái đầu, màu trung tính (CSS `.lt`). Chữ lấy từ id danh mục hoặc khoá mcp.json (không dịch), nên giống nhau ở cả ba ngôn ngữ | — | — | Đề xuất 17.11: chưa dùng logo hãng cho tới khi có logo được duyệt. Đã bỏ ô vàng Hugging Face. Brave và máy chủ GitHub cũ đã bỏ khỏi danh mục |

`brave.svg`, `huggingface.svg`, `github.svg`, `modelcontextprotocol.svg` và các `generic-*.svg` vẫn còn trong thư mục vì bản 4.1 (`connect-v4.1.html`) và các trang khác còn dùng. Bản 4.2 không dùng chúng.

---

## Chi tiết nguồn từng tệp (nội dung cũ của CREDITS.md)


Tải một lần vào ngày 22/10/2026 (UTC+7) và dùng cục bộ; trang không tải gì từ site khác khi chạy.

## Logo thương hiệu: Simple Icons
- Gói npm `simple-icons@16.35.0` (https://simpleicons.org, https://github.com/simple-icons/simple-icons), tải bằng `npm pack`.
- **Slack** không còn trong simple-icons 16.x nên lấy từ bản cũ `simple-icons@15.22.0`. Trang media kit của Slack (https://slack.com/media-kit) không có tệp SVG logo tải trực tiếp.
- Bộ sưu tập Simple Icons phát hành theo **CC0 1.0 Universal**. Theo DISCLAIMER.md của Simple Icons, CC0 áp dụng cho bộ sưu tập; **logo vẫn là nhãn hiệu của chủ sở hữu** và có thể kèm hướng dẫn sử dụng thương hiệu riêng.
- Ở đây logo chỉ dùng để nhận diện ứng dụng / nhà phát hành trong bản mẫu. Không ngụ ý được tài trợ, liên kết hay chứng nhận. Trước khi phát hành thật, nên kiểm tra hướng dẫn thương hiệu của từng hãng.
- Màu thương hiệu (hex) lấy từ `data/simple-icons.json` của cùng phiên bản và được khai báo trong `assets/shell.js` (đối tượng `LOGOS`).

| Tệp | Thương hiệu | Màu (hex) | Phiên bản simple-icons | Nguồn gốc SVG theo Simple Icons | Ghi chú giấy phép |
|---|---|---|---|---|---|
| gmail.svg | Gmail | #EA4335 | 16.35.0 | https://fonts.gstatic.com/s/i/productlogos/gmail_2020q4/v8/192px.svg | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| googledrive.svg | Google Drive | #4285F4 | 16.35.0 | https://developers.google.com/drive/web/branding | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| googlecalendar.svg | Google Calendar | #4285F4 | 16.35.0 | https://fonts.gstatic.com/s/i/productlogos/calendar_2020q4/v8/192px.svg | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| googlesheets.svg | Google Sheets | #34A853 | 16.35.0 | https://sheets.google.com | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| github.svg | GitHub | #181717 | 16.35.0 | https://github.com/logos (hướng dẫn: https://github.com/logos) | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| zalo.svg | Zalo | #0068FF | 16.35.0 | https://zalo.me | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| notion.svg | Notion | #000000 | 16.35.0 | https://www.notion.so | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| sqlite.svg | SQLite | #003B57 | 16.35.0 | https://github.com/sqlite/sqlite/blob/43e862723ec680542ca6f608f9963c0993dd7324/art/sqlite370.eps | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| slack.svg | Slack | #4A154B | 15.22.0 | https://slack.com/brand-guidelines (hướng dẫn: https://slack.com/brand-guidelines) | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| qwen.svg | QWen | #6950EF | 16.35.0 | https://qwen.ai | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| meta.svg | Meta | #0467DF | 16.35.0 | https://www.meta.com (hướng dẫn: https://www.facebook.com/brand/resources/meta/company-brand) | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| google.svg | Google | #4285F4 | 16.35.0 | https://partnermarketinghub.withgoogle.com (hướng dẫn: https://about.google/brand-resource-center/brand-elements/) | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| mistralai.svg | Mistral AI | #FA520F | 16.35.0 | https://chat.mistral.ai | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| nvidia.svg | NVIDIA | #76B900 | 16.35.0 | https://www.nvidia.com/en-us | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| amd.svg | AMD | #ED1C24 | 16.35.0 | https://www.amd.com | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |

## Không dùng logo thương hiệu (fallback)
- **Microsoft** (nhà phát hành Phi-4, trang Khám phá mô hình): không có trong simple-icons 13+ (đã bị gỡ khỏi Simple Icons). Dùng biểu tượng chung `generic-org.svg`.

## Biểu tượng chung tự vẽ cho bản mẫu AIVN (dùng tự do trong dự án)
- `generic-folder.svg`: Tệp trên máy (Filesystem)
- `generic-computer.svg`: Điều khiển máy tính
- `generic-business.svg`: AIVN Kinh doanh
- `generic-websearch.svg`: Tìm kiếm web (kết nối này không gắn với nhà cung cấp cụ thể nên không dùng logo hãng nào)
- `generic-mcp.svg`: máy chủ MCP nhập từ mcp.json
- `generic-org.svg`: nhà phát hành không có logo
- `generic-cpu.svg`: lựa chọn "Chỉ dùng CPU"

## Bổ sung khi bám theo F-PLUGINS (PR #1)

| Tệp | Thương hiệu | Màu | Bản simple-icons | Trang thương hiệu | Giấy phép |
|---|---|---|---|---|---|
| brave.svg | Brave | #FB542B | 16.35.0 | https://brave.com/brave-branding-assets | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| huggingface.svg | Hugging Face | #FFD21E (nền ô vàng, hình đen) | 16.35.0 | https://huggingface.co/brand | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| modelcontextprotocol.svg | Model Context Protocol (dùng cho máy chủ “Của tôi”) | #000000 (vẽ trên ô trắng) | 16.35.0 | https://modelcontextprotocol.io | CC0 1.0 (gói simple-icons); nhãn hiệu thuộc chủ sở hữu |
| generic-fetch.svg, generic-memory.svg, generic-time.svg, generic-thinking.svg | Biểu tượng chung tự vẽ cho Đọc trang web / Ghi nhớ MCP / Giờ và múi giờ / Suy nghĩ từng bước | nền accent, hình trắng | — | — | Tự vẽ cho bản mẫu |

## Bổ sung cho bản 4.2: Microsoft Excel

| Tệp | Thương hiệu | Màu | Nguồn | Trang thương hiệu | Giấy phép |
|---|---|---|---|---|---|
| microsoftexcel.svg | Microsoft Excel | #217346 | `simple-icons@12.4.0` (https://unpkg.com/simple-icons@12.4.0/icons/microsoftexcel.svg). Biểu tượng này có tới bản 12.4.0 và không còn từ 12.5.0; bản 16.x không có. Tệp giống hệt bản 12.0.0. sha256 3392b76e2c1791f6622bc6a27bcf332ea6985cf263f8cb7153a37d43d74d2940 | Màu lấy theo simple-icons: https://developer.microsoft.com/en-us/fluentui#/styles/web/colors/products · Hướng dẫn nhãn hiệu: https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks | simple-icons ghi giấy phép **riêng của Microsoft** (https://aka.ms/fluentui-assets-license), không phải CC0. Chỉ dùng cho bản mẫu nội bộ; trước khi phát hành cần kiểm tra điều khoản hoặc thay bằng biểu tượng bảng tính trung tính. |

Theo thứ tự dự phòng đã thống nhất (simple-icons cũ → SVG chính thức của Microsoft → biểu tượng trung tính), bước đầu đã có nên không cần tải SVG từ Microsoft.
