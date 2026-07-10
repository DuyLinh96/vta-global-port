# QA Engineer Error Log

## [2026-07-10] Playwright locator và lazy image gây false negative
- **Lỗi**: Test form không tìm thấy field bắt buộc; kiểm tra ảnh timeout; assertion cuộn section thất bại dù navigation hoạt động.
- **Nguyên nhân**: `getByLabel(..., exact)` tính cả dấu `*` trong label, `scrollIntoViewIfNeeded()` chờ hero animation ổn định, ảnh Next.js ngoài viewport chưa được lazy-load, và trang áp dụng đồng thời `scroll-padding-top`/`scroll-margin-top` nên offset lớn hơn ngưỡng pixel cố định.
- **Fix**: Dùng `getByRole()` theo accessible name của textbox/combobox; gọi DOM `scrollIntoView()` để kích hoạt từng ảnh rồi kiểm tra `complete`/`naturalWidth`; xác nhận section nằm trong vùng nhìn dưới sticky header thay vì hard-code offset.
- **Bài học**: Với landing page có animation, sticky header và lazy images, ưu tiên semantic role, assertion theo trạng thái/vùng nhìn và tránh actionability wait trên phần tử đang animation để không tạo false negative.
