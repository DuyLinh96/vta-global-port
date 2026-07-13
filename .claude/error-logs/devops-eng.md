# DevOps Engineer Error Log

## [2026-07-10] npm ci trong Linux khong tuong thich voi lockfile tao tren Windows
- **Lỗi**: Docker build dung npm 10.9.8 hoac 11.16.0 bao `package.json` va `package-lock.json` khong dong bo, thieu `@emnapi/runtime@1.11.2` va `@emnapi/core@1.11.2`.
- **Nguyên nhân**: Lockfile duoc tao va xac minh bang npm 11.6.2 tren Windows; cac phien ban npm khac tai Linux tinh lai cay optional dependency theo nen tang va yeu cau them cac entry khong co trong lockfile.
- **Fix**: Dung Node 24 LTS Alpine va pin npm 11.6.2 trong stage cai dependency truoc khi chay `npm ci`, khong thay doi package dependency hoac lockfile.
- **Bài học**: Voi build da nen tang, can dung cung phien ban npm da tao lockfile va xac minh `npm ci` ben trong image Linux thay vi chi dua vao local build.

## [2026-07-13] GIT_SHA fallback bi validate sau khi cat ngan
- **Lỗi**: `publish.sh` co the chap nhan `GIT_SHA` co suffix khong hop le neu 7 ky tu dau la hexadecimal.
- **Nguyên nhân**: Gia tri environment bi cat con 7 ky tu truoc khi kiem tra dinh dang.
- **Fix**: Validate toan bo `GIT_SHA` truoc, sau do moi rut gon toi da 12 ky tu de tao Docker tag.
- **Bài học**: Luon validate input goc truoc moi phep normalize hoac truncate de khong che mat du lieu khong hop le.
