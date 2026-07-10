# 10 — Playwright E2E Testing (Admin Dashboard Template)

> Template chung cho Playwright E2E. Xem `PROJECT_CONFIG.md` cho danh sach pages va test scenarios cu the.

## Muc dich
Playwright dung de test **Admin Web Dashboard**.
KHONG dung Playwright cho mobile app (dung Maestro hoac Detox).

## Setup
```
.playwright-mcp/
├── playwright.config.ts    # Config: baseURL, devices, webServer
├── package.json
├── tests/
│   ├── auth.spec.ts        # Dang nhap, dang xuat, phan quyen
│   ├── [entity]-management.spec.ts  # CRUD [entity]
│   ├── dashboard.spec.ts           # Dashboard chi so, bieu do
│   └── helpers/
│       ├── auth.ts         # Login helper
│       └── fixtures.ts     # Test data
└── test-results/           # Screenshots, traces (gitignored)
```

## Chay tests
```bash
cd .playwright-mcp
npm install                    # Lan dau
npx playwright install         # Install browsers
npx playwright test            # Chay tat ca tests
npx playwright test --headed   # Chay co UI browser
npx playwright test --ui       # Interactive UI mode
npx playwright show-report     # Xem report
```

## Test Patterns

### 1. Login Helper (dung lai trong moi test)
```typescript
// tests/helpers/auth.ts
import { Page, expect } from '@playwright/test';

export async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.getByPlaceholder('[Phone/Email placeholder]').fill('[admin-account]');
  await page.getByPlaceholder('[Password placeholder]').fill('[admin-password]');
  await page.getByRole('button', { name: '[Login button text]' }).click();
  await expect(page).toHaveURL('/dashboard');
}

// Dung trong beforeEach
test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
});
```

### 2. Table Testing Pattern
```typescript
// Kiem tra bang co du lieu
test('hien thi danh sach', async ({ page }) => {
  await page.goto('/[entities]');

  // Doi table load
  await expect(page.getByRole('table')).toBeVisible();

  // Kiem tra headers
  const headers = ['Ten', 'Lien he', 'Trang thai'];
  for (const header of headers) {
    await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
  }

  // Kiem tra co data rows
  const rows = page.getByRole('row');
  await expect(rows).toHaveCount(await rows.count()); // > header row
});
```

### 3. Filter & Search Pattern
```typescript
test('loc theo trang thai', async ({ page }) => {
  await page.goto('/[entities]');

  // Select filter
  await page.getByRole('combobox', { name: 'Trang thai' }).click();
  await page.getByRole('option', { name: '[Status label]' }).click();

  // Verify filter applied
  await expect(page).toHaveURL(/status=[value]/);

  // Search by text
  await page.getByPlaceholder('Tim kiem').fill('[search text]');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('cell', { name: /[expected text]/ })).toBeVisible();
});
```

### 4. CRUD Action Pattern
```typescript
test('thuc hien hanh dong tren entity', async ({ page }) => {
  await page.goto('/[entities]');

  // Click action button tren row dau tien
  const firstRow = page.getByRole('row').nth(1);
  await firstRow.getByRole('button', { name: '[Action name]' }).click();

  // Confirm dialog
  await expect(page.getByText('[Confirm message]')).toBeVisible();
  await page.getByRole('button', { name: 'Xac nhan' }).click();

  // Verify success
  await expect(page.getByText('[Success message]')).toBeVisible();
});
```

### 5. Dashboard & Chart Pattern
```typescript
test('dashboard hien thi chi so', async ({ page }) => {
  await page.goto('/dashboard');

  // Stat cards — thay doi theo du an
  const stats = ['[Stat 1]', '[Stat 2]', '[Stat 3]', '[Stat 4]'];
  for (const stat of stats) {
    await expect(page.getByText(stat)).toBeVisible();
  }

  // Chart rendered (check canvas hoac SVG)
  await expect(page.locator('[data-testid="dashboard-chart"]')).toBeVisible();
});
```

### 6. Pagination Pattern
```typescript
test('phan trang hoat dong', async ({ page }) => {
  await page.goto('/[entities]');

  // Check pagination controls
  const pagination = page.locator('[data-testid="pagination"]');
  await expect(pagination).toBeVisible();

  // Navigate to page 2
  await pagination.getByRole('button', { name: '2' }).click();
  await expect(page).toHaveURL(/page=2/);

  // Table should still have data
  await expect(page.getByRole('table')).toBeVisible();
});
```

### 7. Modal & Form Pattern
```typescript
test('xem chi tiet entity trong modal', async ({ page }) => {
  await page.goto('/[entities]');

  await page.getByRole('row').nth(1).getByRole('button', { name: 'Chi tiet' }).click();

  // Modal visible
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal.getByText('[Modal title]')).toBeVisible();

  // Verify fields
  await expect(modal.getByText('[Field 1]')).toBeVisible();
  await expect(modal.getByText('[Field 2]')).toBeVisible();

  // Close modal
  await modal.getByRole('button', { name: 'Dong' }).click();
  await expect(modal).not.toBeVisible();
});
```

## Locator Strategy (uu tien)
1. `getByRole()` — buttons, links, headings, tables (tot nhat)
2. `getByText()` — text content hien thi
3. `getByPlaceholder()` — input fields
4. `getByLabel()` — form labels
5. `getByTestId()` — `data-testid` attribute (fallback)
6. TRANH: CSS selectors, XPath — de broken

## UI Text trong Tests
- Match chinh xac text hien thi tren UI
- Dung ngon ngu giong UI (xem PROJECT_CONFIG.md)
- Vi du: `getByRole('button', { name: 'Dang nhap' })` KHONG phai `{ name: 'Login' }`

## Admin Dashboard Pages — Template
| Page | URL | Tests chinh |
|------|-----|-------------|
| Dang nhap | `/login` | Login, logout, redirect, validation |
| Dashboard | `/dashboard` | Stats cards, charts, recent items |
| Quan ly [Entity 1] | `/[entities-1]` | List, filter, CRUD, detail |
| Quan ly [Entity 2] | `/[entities-2]` | List, filter, CRUD, detail |
| Cau hinh | `/settings` | Settings forms |

> Xem `PROJECT_CONFIG.md` cho danh sach pages cu the cua du an.

## Anti-Patterns
- KHONG dung `page.waitForTimeout()` — dung `expect` assertions thay
- KHONG dung CSS selectors cho dynamic content
- KHONG hard-code test data IDs — dung filter/search tim
- KHONG skip error case tests — test ca happy path lan error path
- KHONG test mobile app bang Playwright — dung cho admin web only
