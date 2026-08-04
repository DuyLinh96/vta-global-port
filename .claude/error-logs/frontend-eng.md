# Frontend Engineer — Error Log

Ghi lại các lỗi đã gặp và cách fix. Đọc file này TRƯỚC KHI code để không lặp lại lỗi cũ.

---

<!-- Template cho mỗi lỗi mới:
## [Ngày] Mô tả ngắn
- **Lỗi**: Mô tả lỗi
- **Nguyên nhân**: Tại sao xảy ra
- **Fix**: Cách đã fix
- **Bài học**: Rule rút ra để không lặp lại
-->

## [2026-07-10] Dependency advisory và cảnh báo CSS khi production build
- **Lỗi**: Next.js 15.5.7 kéo theo các advisory bảo mật; build cũng cảnh báo Autoprefixer về giá trị `align-items: end`.
- **Nguyên nhân**: Phiên bản framework ban đầu chưa chứa các bản vá mới nhất và giá trị logical alignment chưa có hỗ trợ đồng đều trên các trình duyệt mục tiêu.
- **Fix**: Nâng Next.js cùng `eslint-config-next` lên 15.5.20, override PostCSS 8.5.10, cập nhật lockfile và thay `align-items: end` bằng `align-items: flex-end`.
- **Bài học**: Luôn chạy `npm audit` và production build ngay sau khi cài dependency; dùng bản vá framework hiện hành và xử lý toàn bộ warning tương thích trước khi QA.

## [2026-07-10] ESLint quét output sinh tự động của Next.js
- **Lỗi**: `npm run lint` phát sinh hàng nghìn cảnh báo và lỗi trong `.next/` sau khi chạy production build.
- **Nguyên nhân**: ESLint flat config dùng `eslint .` nhưng chưa khai báo global ignores cho output framework và artifacts kiểm thử.
- **Fix**: Thêm ignore cho `.next`, `node_modules`, `out`, `build`, `dist`, `.playwright-mcp` và `next-env.d.ts` trong `eslint.config.mjs`.
- **Bài học**: Với ESLint flat config, luôn khai báo ignores tường minh và kiểm tra lint lại sau build, không chỉ trước build.

## [2026-07-10] Nội dung landing page sai lệch tài liệu nguồn
- **Lỗi**: Landing page rút gọn nội dung chính và hiển thị thêm headline, mô tả, số liệu trình bày không có trong các PDF được duyệt.
- **Nguyên nhân**: Bản triển khai trước biên tập lại copy thay vì coi nội dung PDF theo từng trang là nguồn chuẩn bắt buộc.
- **Fix**: Đồng bộ nguyên văn nội dung tiếng Việt từ PDF, dịch trung thành sang tiếng Anh và thu hẹp data shape/UI theo đúng số lượng mục được tài liệu quy định.
- **Bài học**: Với nội dung doanh nghiệp có nguồn duyệt, chỉ thêm nhãn chức năng hoặc trạng thái demo cần thiết; không paraphrase, rút gọn hay sáng tác claims ngoài tài liệu.

## [2026-08-04] Paragraph bị rơi về font serif mặc định
- **Lỗi**: Một số đoạn nội dung render bằng `Times New Roman` trong khi heading/subtitle dùng font sans-serif.
- **Nguyên nhân**: Reset CSS dùng `body, button, input, select, textarea { font: inherit; }`, khiến `body` kế thừa font mặc định từ `html` và ghi đè `font-family: var(--font-body)` đã khai báo trước đó.
- **Fix**: Bỏ `body` khỏi selector reset, chỉ để form controls kế thừa font từ ngữ cảnh hiện tại.
- **Bài học**: Không dùng shorthand `font: inherit` trên `body` sau khi đã set font-family cho body; nếu reset form controls thì target trực tiếp controls.
