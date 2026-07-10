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
