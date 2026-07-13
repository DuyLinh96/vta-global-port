# Triển khai production bằng Docker Hub

Image chính thức của dự án là `docker.io/linhnguyen96/vta-global-port`. Ứng dụng Next.js lắng nghe cổng nội bộ `3000`; Compose bind cổng này vào `127.0.0.1:3000` theo mặc định.

Production chỉ pull image do maintainer build và push thủ công. Server không build source và không cần Node.js hoặc npm.

## 1. Tạo Docker Hub repository

1. Đăng nhập Docker Hub và tạo repository `linhnguyen96/vta-global-port`.
2. Chọn **Public** nếu server được phép pull không cần xác thực, hoặc **Private** nếu image không được công khai.
3. Không lưu password hoặc access token trong source code.

## 2. Build và push image thủ công

Đăng nhập tương tác bằng Docker Hub access token có quyền Read & Write:

```sh
docker login docker.io
```

Kiểm tra Buildx và builder hiện tại:

```sh
docker buildx version
docker buildx ls
```

Nếu chưa có builder phù hợp, tạo và bootstrap builder dùng driver `docker-container`:

```sh
docker buildx create --name vta-global-port-builder --driver docker-container --use
docker buildx inspect --bootstrap
```

Từ thư mục source chứa `Dockerfile`, publish `linux/amd64` với tags `latest` và `sha-<git-short-sha>`:

```sh
sh scripts/publish.sh
```

Thêm version release bằng argument. Cả hai lệnh sau đều thêm Docker tag `1.0.0`:

```sh
sh scripts/publish.sh 1.0.0
sh scripts/publish.sh v1.0.0
```

Nếu source không nằm trong Git repository, truyền commit SHA hợp lệ qua environment:

```sh
GIT_SHA=a1b2c3d4e5f6 sh scripts/publish.sh 1.0.0
```

Lệnh tối giản để chỉ publish `latest`:

```sh
docker buildx build --platform linux/amd64 -t docker.io/linhnguyen96/vta-global-port:latest --push .
```

Script thực hiện một lần build/push cho toàn bộ tags:

- `latest`: trỏ tới lần publish gần nhất và có thể thay đổi.
- `sha-...`: gắn với commit cụ thể, phù hợp để deploy và rollback chính xác.
- `1.0.0`: tag release dễ nhận biết, chỉ được thêm khi truyền version.

Kiểm tra manifest sau khi push:

```sh
docker buildx imagetools inspect docker.io/linhnguyen96/vta-global-port:latest
docker buildx imagetools inspect docker.io/linhnguyen96/vta-global-port:sha-a1b2c3d
```

## 3. Chuẩn bị server

Cài Docker Engine và Docker Compose v2, sau đó xác minh:

```sh
docker version
docker compose version
```

Server chỉ cần các file deployment, không cần source hoặc `Dockerfile`:

```text
/opt/vta-global-port/
├── docker-compose.yml
├── .env
└── scripts/
    └── deploy.sh
```

Tạo `.env` trên server và không commit file này:

```dotenv
IMAGE_TAG=latest
WEB_PORT=3000
```

Nếu repository là private, đăng nhập trên server bằng access token chỉ có quyền cần thiết:

```sh
docker login docker.io
```

Không đặt credential trong `.env`, Compose hoặc script.

## 4. Deploy và rollback

Chạy từ thư mục chứa `docker-compose.yml`:

```sh
sh scripts/deploy.sh
```

Production nên chọn tag bất biến thay vì `latest`:

```dotenv
IMAGE_TAG=sha-a1b2c3d
WEB_PORT=3000
```

Hoặc chọn version release:

```dotenv
IMAGE_TAG=1.0.0
WEB_PORT=3000
```

Sau khi đổi `.env`, chạy lại `sh scripts/deploy.sh`. Để rollback, đổi `IMAGE_TAG` về SHA hoặc version đã chạy ổn định rồi chạy lại script. Script chỉ pull image và cập nhật service; không đăng nhập registry, prune hoặc xóa volume.

Server không chạy `docker compose build`. Mỗi lần cập nhật chỉ cần chọn tag đã có trên Docker Hub rồi chạy deploy.

## 5. Kiểm tra deployment

```sh
docker compose ps web
curl --fail http://127.0.0.1:3000/
docker compose logs --tail=100 web
docker inspect --format '{{.Config.Image}} | health={{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$(docker compose ps -q web)"
```

Kết quả mong đợi là container `healthy`, HTTP trả về `200`, và image đúng tag đã chọn.

## 6. Nginx reverse proxy và HTTPS

Container chỉ bind vào loopback. Thay `YOUR_DOMAIN.example.com` bằng domain thật trong `/etc/nginx/sites-available/vta-global-port`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name YOUR_DOMAIN.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site và kiểm tra cấu hình:

```sh
sudo ln -s /etc/nginx/sites-available/vta-global-port /etc/nginx/sites-enabled/vta-global-port
sudo nginx -t
sudo systemctl reload nginx
```

Sau khi DNS trỏ đúng về server và HTTP hoạt động, cài Certbot rồi cấp HTTPS:

```sh
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_DOMAIN.example.com
sudo certbot renew --dry-run
```

## 7. Build và test local

Developer/QA ghép override local để build `Dockerfile` mà không pull image registry:

```sh
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build --wait --wait-timeout 120 web
curl --fail http://127.0.0.1:3000/
docker compose -f docker-compose.yml -f docker-compose.local.yml down
```

Override dùng image `vta-global-port:local`, `pull_policy: never` và vẫn chạy ứng dụng ở cổng `3000`.
