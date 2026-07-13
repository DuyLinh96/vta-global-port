# Project Configuration

> File này chứa thông tin cụ thể của dự án, được hoàn tất trong Bước 0 theo `INIT_TEMPLATE.md`.
> Tất cả agents phải đọc file này để hiểu context dự án trước khi thực hiện task.

## Thông tin dự án
- **Tên**: VTA Global Port
- **Mô tả ngắn**: Website/cổng logistics toàn cầu giới thiệu dịch vụ logistics, vận tải và giải pháp chuỗi cung ứng của VTA Global Port.
- **Loại ứng dụng**: Frontend web; giai đoạn đầu chỉ triển khai landing page.

## Mô tả chi tiết
VTA Global Port là website giới thiệu năng lực, dịch vụ logistics, đội tàu và các giải pháp quản lý chuỗi cung ứng cho khách hàng trong nước và quốc tế. Hệ thống dự kiến bao phủ các trang Home, About, Services, Fleet, News, Smart Management và Contact. Phạm vi triển khai hiện tại là Home landing với hero mang slogan "Vững bước thành công", các phần dịch vụ, đội tàu, tin tức, quản lý thông minh và liên hệ.

Tracking là công cụ nổi bật trên trang: cung cấp ô theo dõi lô hàng cùng các shortcut báo giá, lịch tàu và tra cứu cảng.

## Đối tượng người dùng
| Role | Mô tả | Tính năng chính |
|------|-------|-----------------|
| Khách hàng doanh nghiệp | Doanh nghiệp cần dịch vụ vận tải, cảng, kho bãi và logistics | Tìm hiểu năng lực và dịch vụ, theo dõi lô hàng, xem lịch tàu, tra cứu cảng, yêu cầu báo giá và liên hệ |
| Khách hàng cá nhân | Cá nhân cần tra cứu thông tin vận chuyển hoặc dịch vụ logistics | Theo dõi lô hàng, xem dịch vụ, tin tức và thông tin liên hệ |
| Đối tác quốc tế | Hãng tàu, cảng, đại lý và đối tác chuỗi cung ứng quốc tế | Xem hồ sơ doanh nghiệp, năng lực đội tàu, dịch vụ, thông tin hợp tác và nội dung tiếng Anh |

## Tech Stack
| Layer | Technology |
|-------|------------|
| Mobile | Không có |
| Frontend Web | Next.js + TypeScript, App Router |
| Package Manager | npm |
| Backend | Không có |
| Database | Không có |
| ORM | Không có |
| Realtime | Không có |
| Push Notifications | Không có |
| Maps | Không có |
| Auth | Không có |
| Storage | Không có |
| Cache | Không có |
| Queue | Không có |

## Docker Services
| Service | Image | Port |
|---------|-------|------|
| web | `docker.io/linhnguyen96/vta-global-port:${IMAGE_TAG:-latest}`, pull từ Docker Hub | `127.0.0.1:${WEB_PORT:-3000}` → 3000 |

- Production dùng `docker-compose.yml` image-only; maintainer dùng `scripts/publish.sh` để build/push thủ công image `linux/amd64` lên Docker Hub, không dùng CI publish image; server chỉ pull và chạy image.
- Developer/QA dùng thêm `docker-compose.local.yml` để build `Dockerfile` tại local.
- Hướng dẫn publish, deploy, rollback, Nginx và HTTPS nằm trong `DEPLOYMENT.md`.

## Modules / Features chính
| Module | Mô tả | Backend | Frontend Web |
|--------|-------|---------|--------------|
| Home | Landing page gồm hero "Vững bước thành công", dịch vụ, đội tàu, tin tức, quản lý thông minh và liên hệ | Không có | Phạm vi triển khai hiện tại |
| About | Sứ mệnh, tầm nhìn, giá trị cốt lõi và lãnh đạo | Không có | Trang nội dung theo PDF tương ứng trong `doc/` |
| Services | Vận tải đường biển, khai thác cảng, kho bãi và logistics | Không có | Trang nội dung theo PDF tương ứng trong `doc/` |
| Fleet | Thông tin tàu biển và tàu sông | Không có | Trang nội dung theo PDF tương ứng trong `doc/` |
| News | Hoạt động, sự kiện, truyền thông và tuyển dụng | Không có | Trang nội dung theo PDF tương ứng trong `doc/` |
| Smart Management | My VTA Port, lịch tàu, theo dõi hàng hóa và biểu cước | Không có | Khu vực công cụ nổi bật; tracking kèm shortcut báo giá, lịch tàu và tra cứu cảng |
| Contact | Thông tin và kênh liên hệ với VTA Global Port | Không có | Section trên Home và trang nội dung theo PDF tương ứng trong `doc/` |

## Database Schema (tóm tắt)
Không có database hoặc schema trong phạm vi dự án hiện tại.

## API Routes (tóm tắt)
Không có backend hoặc API routes trong phạm vi dự án hiện tại.

## Git Config
- **Branch chính**: `main`
- **Branch convention**: `feature/`, `fix/`, `refactor/`
- **Commit format**: `type(module): mô tả`

## Ngôn ngữ UI
- **Ngôn ngữ chính**: Tiếng Việt
- **Ngôn ngữ hỗ trợ**: Tiếng Anh
- **i18n**: Có; toàn bộ UI và nội dung hiển thị hỗ trợ song ngữ Việt/Anh.

## UI/UX và chất lượng
- Màu chủ đạo: navy theo logo, kết hợp cyan/teal gợi liên tưởng cảng biển.
- Tham khảo trải nghiệm của Maersk nhưng xây dựng thiết kế riêng cho VTA Global Port.
- Responsive trên desktop và mobile, animation nhẹ, ưu tiên accessibility và hiệu năng.
- Assets nhận diện hiện có: `doc/icon/light.png` và `doc/icon/dark.png`.

## Nguồn nội dung
- Nội dung chính thức nằm trong các file PDF dưới `doc/`; phải sử dụng PDF tương ứng làm nguồn cho từng trang.
- CSV sitemap hiện rỗng và không được dùng làm nguồn nội dung.

## Thông tin liên hệ
- **Địa chỉ**: Tỉnh Hải Dương, Việt Nam
- **Điện thoại**: +84 123 456 789
- **Fax**: +84 123 456 780
- **Email**: info@vtagroup.vn
- **Lưu ý**: Đây là dữ liệu lấy từ tài liệu PDF và có thể cần doanh nghiệp xác nhận lại trước khi phát hành chính thức.
