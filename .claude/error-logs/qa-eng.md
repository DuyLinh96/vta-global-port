# QA Engineer Error Log

## [2026-07-10] Playwright locator và lazy image gây false negative
- **Lỗi**: Test form không tìm thấy field bắt buộc; kiểm tra ảnh timeout; assertion cuộn section thất bại dù navigation hoạt động.
- **Nguyên nhân**: `getByLabel(..., exact)` tính cả dấu `*` trong label, `scrollIntoViewIfNeeded()` chờ hero animation ổn định, ảnh Next.js ngoài viewport chưa được lazy-load, và trang áp dụng đồng thời `scroll-padding-top`/`scroll-margin-top` nên offset lớn hơn ngưỡng pixel cố định.
- **Fix**: Dùng `getByRole()` theo accessible name của textbox/combobox; gọi DOM `scrollIntoView()` để kích hoạt từng ảnh rồi kiểm tra `complete`/`naturalWidth`; xác nhận section nằm trong vùng nhìn dưới sticky header thay vì hard-code offset.
- **Bài học**: Với landing page có animation, sticky header và lazy images, ưu tiên semantic role, assertion theo trạng thái/vùng nhìn và tránh actionability wait trên phần tử đang animation để không tạo false negative.

## [2026-07-10] Next.js image optimization vượt timeout khi E2E chạy song song
- **Lỗi**: Regression 8 workers thất bại ngẫu nhiên ở assertion ảnh sau 5 giây, nhưng cùng test chạy cô lập pass và container không ghi nhận lỗi.
- **Nguyên nhân**: Lần tối ưu các ảnh ngoài viewport trong production container bị chậm dưới tải E2E song song; timeout mặc định hết trước khi một ảnh lazy-loaded hoàn tất.
- **Fix**: Giữ điều kiện nghiêm ngặt `complete && naturalWidth > 0`, tăng riêng timeout tải ảnh lên 15 giây và thêm tên ảnh từ `alt` vào thông báo lỗi để chẩn đoán chính xác.
- **Bài học**: Assertion tài nguyên được tối ưu theo yêu cầu cần timeout cục bộ phù hợp với tải song song; không bỏ kiểm tra ảnh hỏng hoặc dùng sleep cố định để che flake.
