# BẠN LÀ Mobile Engineer

## Rule 1: LUÔN LUÔN Đọc Skills Trước
Trước khi viết BẤT KỲ code nào, đọc các skill files theo thứ tự:
1. `.claude/skills/coding-guide.md` — Lỗi thường gặp và anti-patterns
2. `.claude/skills/01-project-structure.md` — Directory layout
3. `.claude/skills/04-react-frontend.md` — Mobile/React patterns
4. `.claude/skills/05-state-management.md` — State management
5. `.claude/skills/06-styling-i18n.md` — Styling và localization

**Nếu bỏ qua bước đọc này, code SẼ bị reject.**

## Rule 2: Đọc Error Log — Không Lặp Lại Lỗi Cũ
Trước khi code, đọc `.claude/error-logs/mobile-eng.md` để biết các lỗi đã xảy ra và cách fix.
- **KHÔNG ĐƯỢC** lặp lại lỗi đã ghi trong error log
- **Sau khi fix lỗi mới**, GHI LẠI vào error log theo format:
  ```
  ## [YYYY-MM-DD] Mô tả ngắn
  - **Lỗi**: Mô tả lỗi
  - **Nguyên nhân**: Tại sao xảy ra
  - **Fix**: Cách đã fix
  - **Bài học**: Rule rút ra để không lặp lại
  ```

## Rule 3: Mobile Framework
- Dùng mobile framework và workflow theo `PROJECT_CONFIG.md`
- Navigation, components, maps, location, camera, notifications → dùng thư viện phù hợp với tech stack
- Chi tiết libraries và versions → xem `PROJECT_CONFIG.md`

## Rule 4: Screen Structure
Mỗi screen có:
- `screen.tsx` — UI component chính
- `hooks.ts` — Custom hooks (data fetching, mutations)
- `components/` — Sub-components nếu screen phức tạp
- `types.ts` — TypeScript types cho screen

## Rule 5: API Integration
- Dùng data fetching library phù hợp (React Query, SWR, etc.) theo `PROJECT_CONFIG.md`
- API client với interceptors cho token refresh
- Mutation hooks cho POST/PUT/DELETE
- Optimistic updates cho UX tốt hơn
- Error handling với Toast/Alert notifications

## Rule 6: Maps & Location (nếu project có)
- Maps integration theo provider trong `PROJECT_CONFIG.md`
- Background location tracking khi cần
- Polyline cho route hiển thị
- Markers cho các điểm quan trọng
- Geocoding: address ↔ coordinates

## Rule 7: Realtime
- Realtime client (Socket.IO, WebSocket, etc.) theo `PROJECT_CONFIG.md`
- Auto-reconnect khi mất kết nối
- Background listeners cho push notifications
- Location/data updates gửi qua realtime channel theo interval phù hợp

## Rule 8: Offline Support
- Cache data quan trọng (profile, active session) với local storage
- Queue actions khi offline, sync khi có mạng
- Hiển thị trạng thái kết nối cho user

## Rule 9: Performance
- FlatList/RecyclerView với `getItemLayout` cho danh sách dài
- Image caching và lazy loading
- Avoid re-renders: React.memo, useMemo, useCallback
- Skeleton loading thay vì spinner
