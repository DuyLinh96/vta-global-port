# 06 — Styling & i18n (Template)

> Template chung. Xem `PROJECT_CONFIG.md` cho design system, colors, va strings cu the cua du an.

## React Native Styling

### StyleSheet Pattern
```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
});
```

### Design System — Template
```typescript
// utils/theme.ts
// Thay doi colors, spacing cho phu hop du an. Xem PROJECT_CONFIG.md.
export const colors = {
  primary: '#2563EB',        // Mau chinh cua du an
  primaryDark: '#1D4ED8',
  secondary: '#F59E0B',      // Mau phu
  success: '#10B981',        // Xanh la (active, thanh cong)
  danger: '#EF4444',         // Do (loi, huy)
  warning: '#F59E0B',        // Vang (canh bao)
  background: '#F5F7FA',
  surface: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  divider: '#F3F4F6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};
```

> Xem `PROJECT_CONFIG.md` cho bang mau va design tokens cu the cua du an.

### Responsive Design
```typescript
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375; // iPhone X

export function wp(size: number): number {
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size);
}
```

## i18n — Internationalization

### Quy tac
- Dung i18n library (i18next + react-i18next) cho da ngon ngu
- Tach strings ra constants — KHONG hard-code trong components
- Ngon ngu mac dinh tuy du an (xem PROJECT_CONFIG.md)

### String Constants — Template
```typescript
// utils/strings.ts
export const strings = {
  // Auth
  login: 'Dang nhap',
  register: 'Dang ky',
  phone: 'So dien thoai',
  password: 'Mat khau',
  otp: 'Ma OTP',
  forgotPassword: 'Quen mat khau?',

  // Navigation — tuy du an
  home: 'Trang chu',
  // ... them cac tab theo PROJECT_CONFIG.md

  // Status — chung
  active: 'Dang hoat dong',
  completed: 'Da hoan thanh',
  cancelled: 'Da huy',
  pending: 'Cho xac nhan',

  // Common
  loading: 'Dang tai...',
  error: 'Da co loi xay ra',
  retry: 'Thu lai',
  confirm: 'Xac nhan',
  save: 'Luu',
  delete: 'Xoa',
  noData: 'Khong co du lieu',
};
```

> Xem `PROJECT_CONFIG.md` cho danh sach strings cu the cua du an.

### Format Utilities
```typescript
// utils/format.ts

// Currency — thay doi locale va suffix theo du an
export function formatCurrency(amount: number, locale = 'vi-VN', suffix = 'd'): string {
  return new Intl.NumberFormat(locale).format(amount) + suffix;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatTime(date: string | Date, locale = 'vi-VN'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatDate(date: string | Date, locale = 'vi-VN'): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatPhone(phone: string): string {
  // 0906888999 → 0906 888 999
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}
```

## Rules
1. UI text theo ngon ngu cua du an (xem PROJECT_CONFIG.md)
2. Dung StyleSheet.create — KHONG inline styles
3. Colors tu theme — KHONG hard-code hex values
4. Responsive sizes dung wp() hoac Dimensions
5. Format currency/date/time dung locale phu hop
6. Elevation (Android) + shadow (iOS) cho cards
