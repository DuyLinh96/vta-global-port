# Project Rules — Base Template

> Đây là template quy trình chung. Thông tin cụ thể của dự án nằm trong `PROJECT_CONFIG.md`.
> Nếu `PROJECT_CONFIG.md` chưa được điền → chạy Bước 0 (Init Project) trước.

## !! QUY TRÌNH BẮT BUỘC — ĐỌC TRƯỚC KHI LÀM BẤT CỨ GÌ !!

Mỗi khi nhận yêu cầu từ user (fix lỗi, feature mới, tối ưu, refactor...), PHẢI tuân theo quy trình sau. KHÔNG ĐƯỢC bỏ bước nào.

### Bước 0: Init Project (chỉ chạy 1 lần khi bắt đầu dự án mới)

Nếu `PROJECT_CONFIG.md` còn chứa placeholder `[...]` hoặc chưa tồn tại:
1. Đọc `INIT_TEMPLATE.md` — danh sách câu hỏi cần hỏi user
2. Hỏi user theo từng nhóm câu hỏi (3-4 câu/lần)
3. Điền đầy đủ vào `PROJECT_CONFIG.md`
4. Tạo các file error-logs cho roles cần dùng: `.claude/error-logs/<role>.md`
5. Customize skill files nếu cần (thêm schema, routes cụ thể)
6. Xác nhận với user trước khi bắt đầu code

**Nếu `PROJECT_CONFIG.md` đã được điền đầy đủ → bỏ qua bước này, đi thẳng Bước 1.**

### Bước 1: Phân tích → Lên kế hoạch
- Đọc `PROJECT_CONFIG.md` để hiểu context dự án
- Phân tích scope: modules nào, layers nào bị ảnh hưởng
- Xác định agents cần dùng: backend-eng, mobile-eng, frontend-eng, security-eng, performance-eng, hoặc kết hợp
- Xác định dependencies: agent nào phải xong trước, agent nào chạy song song
- Task lớn → lên plan trước, trình user duyệt rồi mới thực hiện

### Bước 2: Tạo Agent Team
- Tạo agents bằng Agent tool — KHÔNG tự code trực tiếp
- Dùng đúng role từ bảng Agent Team (backend-eng, mobile-eng, frontend-eng, qa-eng...)
- Agents KHÔNG có dependency → chạy SONG SONG (parallel)
- Agents CÓ dependency → chạy TUẦN TỰ (sequential)
- Mỗi agent prompt PHẢI dùng Agent Prompt Template (xem bên dưới) và yêu cầu đọc rules + skills trước khi code

**Sub-agents — khi task của 1 agent quá lớn:**
- Agent (backend-eng, mobile-eng...) có thể tạo sub-agents để chia nhỏ công việc
- **Nguyên tắc chia**: theo FILE, không theo feature — mỗi sub-agent sửa files riêng, KHÔNG overlap
- **Nếu 2 sub-agents cùng sửa 1 file** → PHẢI chạy tuần tự, KHÔNG song song (tránh conflict)
- **Khi nên dùng**: task >3 files cùng pattern, các thay đổi độc lập nhau
- **Khi KHÔNG nên**: task nhỏ (<3 files), hoặc files phụ thuộc chặt nhau
- Parent agent chịu trách nhiệm chia file hợp lý và tổng hợp kết quả

```
Ví dụ chia sub-agents:
team-lead
├── backend-eng
│   ├── sub-agent: user.controller.ts
│   ├── sub-agent: order.controller.ts
│   └── sub-agent: payment.controller.ts
├── mobile-eng (chờ backend xong)
│   ├── sub-agent: screens/User + hooks
│   └── sub-agent: screens/Order + screens/Payment
└── qa-eng (chờ mobile xong)
```

### Bước 3: Mỗi agent + sub-agent PHẢI đọc rules, skills VÀ error log
Mỗi agent (và sub-agent) khi nhận task, việc ĐẦU TIÊN là đọc THEO THỨ TỰ:
1. `PROJECT_CONFIG.md` — thông tin dự án (tech stack, modules, schema...)
2. `.claude/agent-rules/<role>.md` — rules riêng của role đó
3. `.claude/error-logs/<role>.md` — các lỗi đã xảy ra trước đó và cách fix
4. `.claude/skills/coding-guide.md` — coding guide, anti-patterns, lỗi thường gặp
5. Các skill files liên quan (xem trong rule file)

**Error Log là BẮT BUỘC**: agent PHẢI đọc error log của role mình trước khi code.
- Nếu lỗi đang fix trùng với lỗi trong error log → áp dụng bài học, KHÔNG lặp lại cách fix sai
- Sau khi fix lỗi mới → GHI LẠI vào error log để agent sau không mắc lại

**Áp dụng cho TẤT CẢ cấp**: agent lẫn sub-agent đều phải đọc rules + error log + skills.

**Agent/sub-agent KHÔNG đọc rules hoặc error log → code SẼ bị reject.**

### Bước 4: Code → Verify → Ghi Error Log → QA
Quy trình sau khi agents code xong:

**4.1. Verify code** — agent tự chạy:
- Type check (tsc, mypy, ...) tùy tech stack trong `PROJECT_CONFIG.md`
- Build check nếu cần
- Grep anti-patterns nếu cần
- Nếu lỗi → fix ngay, KHÔNG báo user

**4.2. Ghi Error Log** — nếu trong quá trình code có fix lỗi:
- Ghi vào `.claude/error-logs/<role>.md` theo format trong rule file
- Bao gồm: lỗi gì, nguyên nhân, cách fix, bài học rút ra
- **Mục đích**: agent sau đọc error log → không lặp lại lỗi cũ

**4.3. Chạy trực tiếp** để test nhanh:
- Đảm bảo Docker services đang chạy (xem `PROJECT_CONFIG.md` > Docker Services)
- Chạy backend/frontend/mobile theo tech stack của dự án
- Kiểm tra API endpoint bằng curl nếu cần

**4.4. QA test** (qa-eng agent):
- Test API bằng curl/httpie — verify CRUD, business logic
- Test Web bằng **Playwright** — E2E browser tests (nếu có web)
- Test Mobile bằng **Maestro** — E2E trên emulator (nếu có mobile)
- Kiểm tra không break tính năng cũ
- Nếu QA phát hiện bug → fix → verify lại (4.1) → re-test

### Bước 5: GIT — Feature Branch + Merge
**CHỈ ÁP DỤNG khi có thay đổi code/config/schema.** Nếu yêu cầu chỉ là phân tích, tìm hiểu, mô tả, kiểm tra, hoặc trả lời câu hỏi → KHÔNG tạo branch, KHÔNG commit, KHÔNG push.

> **Branch chính** được định nghĩa trong `PROJECT_CONFIG.md` > Git Config > Branch chính.
> Dưới đây dùng `[BRANCH_CHÍNH]` làm placeholder — thay bằng tên branch thực tế khi thực hiện.

Mỗi yêu cầu có thay đổi code (feature, fix, refactor...) PHẢI làm trên nhánh riêng, sau đó merge vào `[BRANCH_CHÍNH]`:

1. **Tạo nhánh mới** từ `[BRANCH_CHÍNH]`:
   - Feature: `git checkout -b feature/<mô-tả> [BRANCH_CHÍNH]`
   - Fix: `git checkout -b fix/<mô-tả> [BRANCH_CHÍNH]`
   - Refactor: `git checkout -b refactor/<mô-tả> [BRANCH_CHÍNH]`
2. **Code + commit** trên nhánh mới:
   - `git add <specific files>` — KHÔNG dùng `git add .` hoặc `git add -A`
   - `git commit` với format từ `PROJECT_CONFIG.md` > Git Config > Commit format
3. **Verify trước khi merge**:
   - Chạy verify (type check, build) đảm bảo không lỗi
   - `git checkout [BRANCH_CHÍNH] && git pull origin [BRANCH_CHÍNH]` — cập nhật mới nhất
4. **Merge vào [BRANCH_CHÍNH]**:
   - `git merge <feature-branch> --no-ff` — giữ lịch sử merge
   - **Nếu có CONFLICT → DỪNG LẠI, báo user quyết định, KHÔNG tự resolve**
   - Nếu không conflict → push: `git push origin [BRANCH_CHÍNH]`
5. **Cleanup**:
   - Xóa nhánh feature sau khi merge: `git branch -d <feature-branch>`
6. Báo commit/merge hash cho user

**KHÔNG BAO GIỜ kết thúc task CÓ THAY ĐỔI CODE mà không merge vào [BRANCH_CHÍNH] và push.**
**KHÔNG BAO GIỜ tự resolve conflict — luôn hỏi user.**
**Yêu cầu chỉ phân tích/mô tả/kiểm tra → trả lời trực tiếp, KHÔNG push git.**

---

## AGENT TEAM

| Role | Trách nhiệm | Rules | Skills |
|------|-------------|-------|--------|
| team-lead | Phân tích, chia task, điều phối agents | `agent-rules/team-lead.md` | — |
| backend-eng | Schema, controllers, middleware, API, realtime | `agent-rules/backend-eng.md` | coding-guide, 01, 02, 03 |
| mobile-eng | Mobile screens, hooks, navigation, maps | `agent-rules/mobile-eng.md` | coding-guide, 01, 04, 05, 06 |
| frontend-eng | Admin web dashboard | `agent-rules/frontend-eng.md` | coding-guide, 01, 04, 05, 06 |
| security-eng | Auth, encryption, vulnerability, audit | `agent-rules/security-eng.md` | coding-guide, 08 |
| performance-eng | Query optimization, caching, profiling | `agent-rules/performance-eng.md` | coding-guide, 09 |
| devops-eng | Git, Docker, deploy, CI/CD | `agent-rules/devops-eng.md` | — |
| qa-eng | Verify code, API test, Playwright (web), Maestro (mobile), regression | `agent-rules/qa-eng.md` | 10, 11 |

> **Lưu ý**: Không phải dự án nào cũng cần tất cả roles. Chỉ dùng roles phù hợp với tech stack trong `PROJECT_CONFIG.md`.
> Ví dụ: dự án API only → không cần mobile-eng, frontend-eng. Dự án không có mobile → không cần mobile-eng.

### Agent Prompt Template
```
BẠN LÀ [role]. TRƯỚC KHI LÀM BẤT CỨ GÌ:
1. Đọc `PROJECT_CONFIG.md` — thông tin dự án
2. Đọc `.claude/agent-rules/[role].md` — rules của bạn
3. Đọc `.claude/error-logs/[role].md` — các lỗi đã xảy ra, KHÔNG ĐƯỢC lặp lại
4. Nếu role có skills (xem bảng Agent Team): đọc `.claude/skills/coding-guide.md` + các skill files liên quan
5. Nếu role KHÔNG có skills (qa-eng, devops-eng): chỉ cần đọc rules + error log ở bước 1-3

SAU KHI FIX LỖI: ghi lại lỗi + cách fix vào `.claude/error-logs/[role].md`

TASK: [mô tả task]
MODULE: [module name]
FILES: [files cần tạo/sửa]
```

---

## CODING RULES

### Tech Stack
> Xem chi tiết trong `PROJECT_CONFIG.md` > Tech Stack.
> Agents PHẢI đọc PROJECT_CONFIG.md để biết chính xác tech stack đang dùng.

### Docker Services
> Xem chi tiết trong `PROJECT_CONFIG.md` > Docker Services.

### Git Rules — Feature Branch Workflow
- Branch chính: xem `PROJECT_CONFIG.md` > Git Config > Branch chính
- **Mỗi task → tạo nhánh riêng** (`feature/`, `fix/`, `refactor/`) từ branch chính
- Merge về branch chính bằng `--no-ff` sau khi verify xong
- **Conflict → DỪNG, hỏi user** — KHÔNG tự resolve
- KHÔNG `git add .` — add từng file cụ thể
- KHÔNG `git push --force`
- KHÔNG commit `.env`, `node_modules/`, `dist/`, `.expo/`, build artifacts
- Commit format: xem `PROJECT_CONFIG.md` > Git Config > Commit format

### Error Logs
Tất cả nằm trong `.claude/error-logs/`:
- `backend-eng.md` — Lỗi backend đã gặp và cách fix
- `mobile-eng.md` — Lỗi mobile đã gặp và cách fix
- `frontend-eng.md` — Lỗi frontend đã gặp và cách fix
- `security-eng.md` — Lỗi security đã gặp và cách fix
- `performance-eng.md` — Lỗi performance đã gặp và cách fix

> Chỉ tạo error log files cho các roles thực sự dùng trong dự án.

### Skills Reference
Tất cả nằm trong `.claude/skills/`:
- `coding-guide.md` — Coding guide, anti-patterns, lỗi thường gặp
- `01-project-structure.md` — Project structure conventions
- `02-database-schema.md` — Database schema + ORM conventions
- `03-api-controller.md` — API controller patterns
- `04-react-frontend.md` — React / React Native patterns
- `05-state-management.md` — State management patterns
- `06-styling-i18n.md` — Styling và i18n
- `07-realtime.md` — Realtime, Push Notifications, Location tracking
- `08-security.md` — Authentication, encryption, audit, vulnerability
- `09-performance.md` — Query optimization, caching, profiling
- `10-playwright-testing.md` — Playwright E2E cho Web
- `11-mobile-testing.md` — Maestro E2E cho Mobile App

> Không phải dự án nào cũng cần tất cả skills. Chỉ dùng skills phù hợp với tech stack.

---

## QUICK REFERENCE
- **Dự án**: Xem `PROJECT_CONFIG.md` > Thông tin dự án
- **Tech Stack**: Xem `PROJECT_CONFIG.md` > Tech Stack
- **Docker**: Xem `PROJECT_CONFIG.md` > Docker Services
- **Git Branch chính**: Xem `PROJECT_CONFIG.md` > Git Config
- **Init project mới**: Đọc `INIT_TEMPLATE.md` → hỏi user → điền `PROJECT_CONFIG.md`
