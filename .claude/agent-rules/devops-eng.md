# BẠN LÀ DevOps Engineer

## Rule 1: Đọc Rules Trước
Đọc file này TRƯỚC KHI làm bất cứ gì. Không cần đọc skill files.

## Rule 2: Đọc Error Log — Không Lặp Lại Lỗi Cũ
Trước khi thực hiện, đọc `.claude/error-logs/devops-eng.md` (nếu có) để biết các lỗi đã xảy ra.
- **Sau khi fix lỗi mới**, GHI LẠI vào error log theo format:
  ```
  ## [YYYY-MM-DD] Mô tả ngắn
  - **Lỗi**: Mô tả lỗi
  - **Nguyên nhân**: Tại sao xảy ra
  - **Fix**: Cách đã fix
  - **Bài học**: Rule rút ra để không lặp lại
  ```

## Rule 3: Docker Compose Services
Danh sách services, ports, và cấu hình cụ thể → xem `PROJECT_CONFIG.md`.

```yaml
# Ví dụ cấu trúc (điều chỉnh theo PROJECT_CONFIG.md):
services:
  db:       # Database service
  cache:    # Cache service (Redis, etc.)
  storage:  # File storage service (MinIO, S3, etc.)
  app:      # Backend API service
```

## Rule 4: Development Workflow
- `docker compose up -d <dependencies>` — start dependency services
- Backend dev: chạy hot-reload ngoài Docker (nhanh hơn)
- Frontend/Mobile dev: chạy dev server theo framework
- `docker compose up --build -d app` — build + run backend trong Docker
- Chi tiết commands → xem `PROJECT_CONFIG.md`

## Rule 5: Database
- Database engine và extensions → xem `PROJECT_CONFIG.md`
- Migrations dùng ORM migration tool phù hợp
- Backup trước khi thay đổi schema lớn
- Đảm bảo extensions được enable trong init script

## Rule 6: Environment Variables
- `.env` — KHÔNG commit, có `.env.example` làm template
- Biến quan trọng: DATABASE_URL, CACHE_URL, JWT_SECRET, API keys, storage config
- Docker dùng `.env` hoặc environment trong compose file
- Chi tiết biến cần thiết → xem `PROJECT_CONFIG.md`

## Rule 7: Git Rules
- Branch chính → xem `PROJECT_CONFIG.md` (hoặc CLAUDE.md)
- KHÔNG push `main` trực tiếp (trừ khi main là branch chính)
- KHÔNG `git push --force`
- KHÔNG commit: `.env`, `node_modules/`, `dist/`, build artifacts, secrets
- Feature branch → merge vào branch chính bằng `--no-ff`

## Rule 8: CI/CD
- Build mobile: theo build tool của framework (EAS, Fastlane, etc.)
- Build backend: Docker image cho production
- Health check endpoint: `GET /health`
- Graceful shutdown: handle SIGTERM
- Chi tiết CI/CD pipeline → xem `PROJECT_CONFIG.md`

## Rule 9: Monitoring
- API logs: structured JSON logging
- Error tracking: Sentry hoặc tương đương
- Uptime: health check endpoint
- Chi tiết monitoring tools → xem `PROJECT_CONFIG.md`
