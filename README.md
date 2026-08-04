# VTA Global Port

Website Next.js cho VTA Global Port. Dự án chạy production bằng Docker, image chính thức là `docker.io/linhnguyen96/vta-global-port`.

## Chạy Docker Local

Build image từ source và chạy container local:

```sh
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build --wait --wait-timeout 120 web
```

Mở web:

```text
http://127.0.0.1:3000/
```

Kiểm tra container:

```sh
docker compose -f docker-compose.yml -f docker-compose.local.yml ps web
docker compose -f docker-compose.yml -f docker-compose.local.yml logs --tail=100 web
curl --fail http://127.0.0.1:3000/
```

Dừng local container:

```sh
docker compose -f docker-compose.yml -f docker-compose.local.yml down
```

## Build Image Local Không Dùng Compose

```sh
docker build -t vta-global-port:local .
docker run --rm -p 3000:3000 vta-global-port:local
```

Mở web:

```text
http://127.0.0.1:3000/
```

## Publish Lên Docker Hub

Đăng nhập Docker Hub:

```sh
docker login docker.io
```

Kiểm tra Buildx:

```sh
docker buildx version
docker buildx ls
```

Nếu chưa có builder phù hợp:

```sh
docker buildx create --name vta-global-port-builder --driver docker-container --use
docker buildx inspect --bootstrap
```

Publish image `linux/amd64` với tag `latest` và `sha-<git-short-sha>`:

```sh
sh scripts/publish.sh
```

Publish kèm version release:

```sh
sh scripts/publish.sh 1.0.0
```

Lệnh publish tối giản nếu không dùng script:

```sh
docker buildx build --platform linux/amd64 -t docker.io/linhnguyen96/vta-global-port:latest --push .
```

Kiểm tra image sau khi push:

```sh
docker buildx imagetools inspect docker.io/linhnguyen96/vta-global-port:latest
```

## Deploy Trên Server

Server chỉ cần các file deployment, không cần source đầy đủ:

```text
/opt/vta-global-port/
├── docker-compose.yml
├── .env
└── scripts/
    └── deploy.sh
```

File `.env` trên server:

```dotenv
IMAGE_TAG=latest
WEB_PORT=3000
```

Deploy:

```sh
sh scripts/deploy.sh
```

Kiểm tra:

```sh
docker compose ps web
curl --fail http://127.0.0.1:3000/
docker compose logs --tail=100 web
```

## Rollback

Đổi `IMAGE_TAG` trong `.env` về tag cũ, ví dụ:

```dotenv
IMAGE_TAG=sha-a1b2c3d
WEB_PORT=3000
```

Sau đó chạy lại:

```sh
sh scripts/deploy.sh
```

## Lệnh NPM Kiểm Tra Trước Khi Build

```sh
npm run typecheck
npm run lint
npm run build
```

Nếu `npm run build` trên Windows báo lỗi `EPERM: operation not permitted, open '.next/trace'`, thường là do đang có `next dev` giữ lock. Dừng dev server rồi chạy lại build.
