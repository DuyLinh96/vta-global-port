# Mobile Engineer — Error Log

Ghi lại các lỗi đã gặp và cách fix. Đọc file này TRƯỚC KHI code để không lặp lại lỗi cũ.

---

## [2026-04-08] react-native-webview crash trong Expo Go
- **Lỗi**: `RNCWebViewModule could not be found` khi import `react-native-webview`
- **Nguyên nhân**: `react-native-webview` là native module KHÔNG bundled trong Expo Go SDK 51. Chỉ hoạt động khi build custom dev client (`expo run:android`)
- **Fix**: Xóa WebView, dùng `UrlTile` từ `react-native-maps` (đã bundled sẵn) với OpenStreetMap tiles
- **Bài học**: KHÔNG import native module ngoài Expo Go. Chỉ dùng: React Native core, `expo-*` packages, và các module bundled sẵn (react-native-maps, react-native-screens, etc.)

## [2026-04-08] Google Maps tiles trắng trong Expo Go
- **Lỗi**: Google Maps SDK khởi tạo OK (hiện logo Google) nhưng tiles không load — map trắng/beige
- **Nguyên nhân**: Expo Go dùng API key riêng của Expo (bundled), KHÔNG dùng key trong `app.json` hay `AndroidManifest.xml`. Key Expo bị hạn chế → tiles không load
- **Fix**: Detect Expo Go bằng `Constants.appOwnership === 'expo'` → dùng `mapType="none"` + `UrlTile` với OSM tiles. Production vẫn dùng Google Maps bình thường
- **Bài học**: Trong Expo Go, API key của project KHÔNG được sử dụng. Cần fallback cho các service phụ thuộc API key

## [2026-04-08] onMapReady vẫn fire dù tiles không load
- **Lỗi**: Dùng timeout 5s detect `onMapReady` không fire → fallback. Nhưng `onMapReady` VẪN fire dù tiles trắng
- **Nguyên nhân**: `onMapReady` chỉ báo Google Maps SDK đã khởi tạo, KHÔNG báo tiles đã load thành công
- **Fix**: Không dùng timeout detect. Dùng `Constants.appOwnership` detect Expo Go trực tiếp
- **Bài học**: `onMapReady` ≠ tiles loaded. Không thể detect tile load failure qua react-native-maps API

## [2026-04-08] Static map service timeout
- **Lỗi**: `staticmap.openstreetmap.de` trả HTTP 000 (connection failed)
- **Nguyên nhân**: Service bên thứ 3 không ổn định
- **Fix**: Dùng `UrlTile` + `tile.openstreetmap.org` (tile server chính thức, ổn định)
- **Bài học**: Không dùng service bên thứ 3 không kiểm chứng. Luôn test URL trước khi dùng

## [2026-04-08] MapViewImpl.tsx dynamic require gây map trắng trên Android
- **Lỗi**: Map không hiển thị trên Android — MapView.tsx re-export từ MapViewImpl.tsx dùng dynamic `require('react-native-maps')`, trong khi MapView.native.tsx (có static import đúng) bị bỏ hoang
- **Nguyên nhân**: Metro resolve `.native.tsx` cho Android nhưng MapViewImpl.tsx tạo confusion. Dynamic require cũng gây lỗi tree-shaking và bundling
- **Fix**: Xóa MapViewImpl.tsx. MapView.tsx giờ là fallback re-export từ MapView.native. Android luôn dùng UrlTile + OSM tiles (không chỉ Expo Go)
- **Bài học**: KHÔNG dùng dynamic `require()` cho react-native-maps. Dùng platform-specific files (.native.tsx / .web.tsx) với static imports. Trên Android luôn dùng UrlTile + OSM tiles để không phụ thuộc Google API key

## [2026-04-08] React.forwardRef deprecated trong React 19
- **Lỗi**: `React.forwardRef` deprecated warning trong web-mocks/react-native-maps.js khi dùng React 19
- **Nguyên nhân**: React 19 deprecated `React.forwardRef`, ref giờ là prop thường
- **Fix**: Đổi `React.forwardRef(({...}, ref) => ...)` thành function component nhận `ref` như prop thường
- **Bài học**: React 19 không cần forwardRef nữa. Dùng `function Component({ ref, ...props })` trực tiếp

## [2026-04-08] MapView.web.tsx @ts-ignore cho iframe
- **Lỗi**: `@ts-ignore` comment không cần thiết cho `allowFullScreen` prop trên iframe
- **Nguyên nhân**: TypeScript với react-native-web đã nhận diện iframe element, không cần suppress
- **Fix**: Xóa `@ts-ignore` comment, giữ `allowFullScreen={true}` bình thường
- **Bài học**: Kiểm tra xem TS error có thực sự tồn tại trước khi thêm @ts-ignore/@ts-expect-error

## [2026-04-08] useTripFeed() hardcode lat/lng thay vì dùng GPS thực tế
- **Lỗi**: Trip feed luôn query từ vị trí cố định (21.0285, 105.8542) → tài xế B không thấy chuyến của tài xế A nếu chuyến ngoài radius từ vị trí hardcode
- **Nguyên nhân**: `useTripFeed()` hardcode lat/lng trong params thay vì đọc từ `useLocationStore`
- **Fix**: Import `useLocationStore`, lấy `currentLocation` từ store, fallback về Hà Nội khi chưa có GPS. Thêm lat/lng vào queryKey để refetch khi vị trí thay đổi
- **Bài học**: KHÔNG hardcode tọa độ trong hooks/API calls. Luôn dùng GPS store với fallback rõ ràng

## [2026-04-08] Navigate before mounting Root Layout trên iOS Expo Go
- **Lỗi**: `Attempted to navigate before mounting the Root Layout component` khi mở app trên iOS
- **Nguyên nhân**: `_layout.tsx` dùng `useRootNavigationState` + `router.replace()` trong `useEffect` để redirect auth. Trên iOS, `useEffect` có thể fire trước khi Root Layout mount xong, gây lỗi navigation
- **Fix**: Bỏ `useProtectedRoute()` hook (useEffect + router.replace). Dùng `<Redirect>` component từ expo-router trực tiếp trong JSX của RootLayout. `<Redirect>` là declarative và chỉ navigate khi component đã mount
- **Bài học**: KHÔNG dùng `router.replace()` hay `router.push()` trong useEffect ở `_layout.tsx`. Luôn dùng `<Redirect>` component cho auth redirect trong layout files. Đây là cách chính thức của expo-router v6 (SDK 54)

## [2026-04-08] Quick actions grid 3x2 thay vì 2x3 trên iOS
- **Lỗi**: 6 menu buttons hiển thị 3 hàng x 2 cột trên iOS, trong khi Android đúng 2x3
- **Nguyên nhân**: `gap` trong `flexWrap` container xử lý khác nhau giữa Android và iOS. iOS tính gap vào chiều rộng khác, khiến item width + gap vượt quá row width → chỉ fit 2 items/row
- **Fix**: Thay `gap: spacing.sm` bằng `justifyContent: 'space-between'` + `rowGap: spacing.sm`. Dùng `Math.floor()` cho item width để tránh sub-pixel rounding
- **Bài học**: KHÔNG dùng `gap` trong `flexWrap` container khi cần cross-platform consistency. Dùng `justifyContent: 'space-between'` + `rowGap` thay thế. Luôn `Math.floor()` width tính toán để tránh rounding issues

## [2026-04-08] OSM UrlTile 403 trên Android Expo Go
- **Lỗi**: `useOSMTiles = isExpoGo` khiến Android Expo Go dùng OSM tiles thay vì Google Maps. OSM tile server trả 403 vì thiếu User-Agent header
- **Nguyên nhân**: Android Expo Go CÓ react-native-maps bundled + Google Maps hoạt động (Expo bundled API key). Không cần OSM fallback. iOS Expo Go không có react-native-maps nên đã fallback UI (mapsAvailable=false), không bao giờ chạy đến UrlTile
- **Fix**: Xóa hoàn toàn OSM UrlTile logic (biến useOSMTiles, RNUrlTile import, mapType='none', UrlTile JSX). Luôn dùng `provider={PROVIDER_GOOGLE}`. Xóa import `expo-constants` (không còn cần isExpoGo)
- **Bài học**: Android Expo Go hỗ trợ Google Maps qua bundled API key. KHÔNG cần OSM fallback trên Android. Chỉ cần fallback UI cho iOS Expo Go (mapsAvailable=false)
