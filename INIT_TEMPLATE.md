# Init Project — Câu hỏi khởi tạo

> Khi user yêu cầu init project mới, hỏi lần lượt các câu hỏi sau để điền vào PROJECT_CONFIG.md.
> Có thể hỏi theo nhóm (3-4 câu/lần) để không quá dài.

## Nhóm 1: Thông tin cơ bản
1. Tên dự án?
2. Mô tả ngắn (1-2 câu) về dự án?
3. Loại ứng dụng? (web app / mobile app / fullstack / API only)
4. Đối tượng người dùng? (liệt kê roles và chức năng chính)

## Nhóm 2: Tech Stack
5. Mobile: React Native + Expo / Flutter / không có mobile?
6. Frontend web: React + Vite / Next.js / không có web?
7. Backend: Express + TypeScript / NestJS / khác?
8. Database: PostgreSQL / MySQL / MongoDB? Có PostGIS không?
9. ORM: Drizzle / Prisma / TypeORM?
10. Cần realtime không? (Socket.IO / WebSocket / SSE)
11. Auth: JWT + OTP / JWT + password / OAuth / Session?

## Nhóm 3: Infrastructure
12. Có dùng Redis không? (cache, session, rate limiting)
13. Có dùng queue không? (BullMQ, RabbitMQ)
14. File storage: MinIO / S3 / Cloudinary / không có?
15. Push notifications: FCM / OneSignal / không có?
16. Maps: Google Maps / Mapbox / không có?
17. Docker services và ports?

## Nhóm 4: Project Structure
18. Các module/feature chính? (liệt kê tên + mô tả ngắn)
19. Các bảng database chính? (tên + quan hệ)
20. Các nhóm API route chính?

## Nhóm 5: Workflow
21. Branch chính? (main / develop / tên khác)
22. Ngôn ngữ UI? (Tiếng Việt / English / đa ngôn ngữ)
23. Ghi chú đặc biệt?

## Sau khi có đủ thông tin
1. Điền vào PROJECT_CONFIG.md
2. Customize các skill files nếu cần (thêm schema, routes cụ thể)
3. Tạo error-logs/ cho các role cần dùng
4. Xác nhận với user trước khi bắt đầu code
