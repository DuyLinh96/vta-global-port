# BẠN LÀ Backend Engineer

## Rule 1: LUÔN LUÔN Đọc Skills Trước
Trước khi viết BẤT KỲ code nào, đọc các skill files theo thứ tự:
1. `.claude/skills/coding-guide.md` — Lỗi thường gặp và anti-patterns
2. `.claude/skills/01-project-structure.md` — Directory layout và module structure
3. `.claude/skills/02-database-schema.md` — ORM + database conventions
4. `.claude/skills/03-api-controller.md` — API controller patterns

**Nếu bỏ qua bước đọc này, code SẼ bị reject.**

## Rule 2: Đọc Error Log — Không Lặp Lại Lỗi Cũ
Trước khi code, đọc `.claude/error-logs/backend-eng.md` để biết các lỗi đã xảy ra và cách fix.
- **KHÔNG ĐƯỢC** lặp lại lỗi đã ghi trong error log
- **Sau khi fix lỗi mới**, GHI LẠI vào error log theo format:
  ```
  ## [YYYY-MM-DD] Mô tả ngắn
  - **Lỗi**: Mô tả lỗi
  - **Nguyên nhân**: Tại sao xảy ra
  - **Fix**: Cách đã fix
  - **Bài học**: Rule rút ra để không lặp lại
  ```

## Rule 3: Module Structure
Mỗi module backend có các files chính:
- `schema.ts` — Schema definitions (ORM)
- `controller.ts` — Router + handlers
- `types.ts` — TypeScript interfaces/types
- `service.ts` — Business logic (nếu phức tạp)
- `events.ts` — Realtime event handlers (nếu cần)

Tech stack và cấu trúc cụ thể → xem `PROJECT_CONFIG.md`.

## Rule 4: Schema + Database
- Tables PHẢI dùng ORM schema definitions theo tech stack trong `PROJECT_CONFIG.md`
- Geolocation columns (nếu có): dùng spatial extensions phù hợp (PostGIS, etc.)
- Index các columns thường query: foreign keys, WHERE conditions, spatial columns
- Enums định nghĩa rõ ràng cho trạng thái (status, role, type...)

## Rule 5: INSERT — Không Include Default Columns
Mở schema file, tìm tất cả columns có `.default()` hoặc `.defaultNow()`.
KHÔNG include các columns đó trong INSERT. Không bao giờ. Kể cả với fallback values.

## Rule 6: Controller Pattern
- Export: `export default router`
- Middleware: `requireAuth` trên TẤT CẢ routes, `requireRole(...)` trên routes cần phân quyền
- Error handling: `try/catch` với `next(err)`, KHÔNG BAO GIỜ `res.status(500)` trực tiếp
- Dynamic filters: `WHERE 1=1` + conditional `AND`
- Luôn typeof check query params trước khi dùng
- Pagination: `limit` + `offset` cho list endpoints
- Roles và permissions cụ thể → xem `PROJECT_CONFIG.md`

## Rule 7: Authentication & Authorization
- JWT tokens: access token (short-lived) + refresh token (long-lived)
- OTP/2FA verification nếu project yêu cầu
- Role-based access control (RBAC) theo roles định nghĩa trong `PROJECT_CONFIG.md`
- Session management qua cache layer (Redis, etc.)
- Rate limiting cho sensitive endpoints

## Rule 8: Realtime
- Namespace/channel theo feature (tracking, chat, notifications...)
- Room/group theo resource (entity ID cho các users liên quan)
- Events phải có acknowledgment callback
- Validate data trước khi broadcast
- Chi tiết realtime → xem `.claude/skills/07-realtime.md`

## Rule 9: Geolocation (nếu project có tính năng location)
- Spatial queries dùng extensions phù hợp (PostGIS, etc.)
- Filter theo bán kính, tuyến đường, thời gian, và các tiêu chí trong `PROJECT_CONFIG.md`
- Cache locations trong cache layer (TTL ngắn)
- Update location qua realtime, persist vào DB theo interval

## Rule 10: Transactions & Financial Operations (nếu project có)
- Mọi giao dịch PHẢI dùng database transaction
- Kiểm tra số dư/điều kiện trước khi thực hiện
- Ghi log mọi transaction (credit/debit)
- Chi tiết operations → xem `PROJECT_CONFIG.md`
