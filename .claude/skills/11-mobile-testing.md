# 11 — Mobile E2E Testing voi Maestro (Template)

> Template chung. Xem `PROJECT_CONFIG.md` cho danh sach screens va flows cu the cua du an.

## Tai sao Maestro?
- **Playwright** → test admin web dashboard (browser)
- **Maestro** → test mobile app React Native (Android/iOS emulator)
- Maestro dung YAML, de viet, ho tro React Native + Expo tot

## Setup
```bash
# Cai dat Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash    # macOS/Linux
iwr -useb "https://get.maestro.mobile.dev/windows" | iex  # Windows

# Verify
maestro --version

# Can Android Emulator hoac iOS Simulator dang chay
# App phai da install tren emulator
```

## Cau truc test
```
.maestro/
├── README.md
├── flows/
│   ├── auth-login.yaml          # Dang nhap
│   ├── auth-register.yaml       # Dang ky
│   ├── [feature-1]-flow.yaml    # Flow feature 1
│   ├── [feature-2]-flow.yaml    # Flow feature 2
│   └── ...
```

> Xem `PROJECT_CONFIG.md` cho danh sach flows can viet.

## Chay tests
```bash
# Chay 1 flow
maestro test .maestro/flows/auth-login.yaml

# Chay tat ca flows
maestro test .maestro/flows/

# Chay tren device cu the
maestro test --device emulator-5554 .maestro/flows/

# Record flow moi (tuong tac truc tiep tren emulator)
maestro record .maestro/flows/new-flow.yaml

# Studio mode — visual editor
maestro studio
```

## YAML Syntax — Cac lenh chinh

### Tuong tac co ban
```yaml
# Nhan vao element
- tapOn: "[Button text]"
- tapOn:
    text: "[Text pattern].*"    # regex match
    index: 0                    # element thu may (neu nhieu match)
    optional: true              # khong fail neu khong tim thay

# Nhap text
- tapOn: "[Input label]"
- inputText: "[value]"

# Clear input truoc khi nhap
- clearText
- inputText: "[new value]"

# Long press
- longPressOn: "[Element text]"
```

### Assertions
```yaml
# Kiem tra element hien thi
- assertVisible: "[Expected text]"
- assertVisible:
    text: "[Pattern].*"         # regex
    enabled: true

# Kiem tra element KHONG hien thi
- assertNotVisible: "[Error text]"

# Optional assertion (khong fail neu khong thay)
- assertVisible:
    text: "[Optional text]"
    optional: true
```

### Navigation
```yaml
# Scroll
- scrollDown
- scrollUp

# Swipe
- swipe:
    direction: LEFT
    duration: 500

# Back button
- back

# Mo app
- launchApp
- launchApp:
    appId: "[app.bundle.id]"
    clearState: true          # Clear app data truoc khi mo
```

### Flow composition — tai su dung
```yaml
# Chay flow khac truoc (vi du: login)
- runFlow: auth-login.yaml

# Sau do tiep tuc test
- tapOn: "[Feature tab]"
```

### Doi & Dieu kien
```yaml
# Doi element xuat hien (timeout 5s mac dinh)
- extendedWaitUntil:
    visible: "[Screen title]"
    timeout: 10000            # 10 giay

# Doi co dinh (TRANH dung, chi khi that can)
- waitForAnimationToEnd
```

### Screenshots
```yaml
# Chup screenshot
- takeScreenshot: "after-login"
# Luu tai ~/.maestro/tests/screenshots/
```

## Viet flow — Patterns

### Pattern 1: Login → Action → Verify
```yaml
appId: [app.bundle.id]
---
- launchApp
- runFlow: auth-login.yaml          # Reuse login

- tapOn: "[Feature tab]"            # Navigate
- assertVisible: "[Screen title]"   # Verify screen

- tapOn: "[Input field]"            # Input data
- inputText: "[search value]"
- tapOn:
    text: "[suggestion].*"
    index: 0

- tapOn: "[Action button]"          # Action
- assertVisible:                    # Verify result
    text: ".*[expected].*"
    optional: true
```

### Pattern 2: Form filling
```yaml
# Dien form tu tren xuong duoi
- tapOn: "[Field 1 label]"
- inputText: "[value 1]"
- tapOn: "[Field 2 label]"
- inputText: "[value 2]"
- scrollDown                        # Scroll neu form dai
- tapOn: "[Field 3 label]"
- inputText: "[value 3]"
- tapOn: "[Submit button]"          # Submit
- assertVisible: "[Next screen]"   # Verify next screen
```

### Pattern 3: List & Detail
```yaml
# Xem danh sach → chon item → verify detail
- tapOn: "[List tab]"
- assertVisible: "[List section title]"
- tapOn:
    index: 0                        # Item dau tien trong list
- assertVisible: "[Detail screen title]"
- assertVisible: "[Field 1]"
- assertVisible: "[Field 2]"
```

## Test Coverage — Template
| Screen | Flow file | Tests chinh |
|--------|-----------|-------------|
| Dang nhap | `auth-login.yaml` | Phone + password + OTP |
| Dang ky | `auth-register.yaml` | Form dang ky |
| Trang chu | (sau login) | Stats, recent items |
| [Feature 1] | `[feature-1]-flow.yaml` | CRUD, search, filter |
| [Feature 2] | `[feature-2]-flow.yaml` | CRUD, search, filter |

> Xem `PROJECT_CONFIG.md` cho danh sach screens va flows cu the.

## Locator Strategy (uu tien)
1. `text:` — text hien thi tren UI
2. `id:` — testID/accessibilityLabel tu React Native
3. `index:` — vi tri trong list (khi khong co text unique)
4. TRANH: class names, XPath

## Tips React Native + Maestro
- Them `testID` cho components quan trong: `<View testID="[entity]-map">`
- `testID` map sang `accessibilityLabel` tren Android
- Dung `waitForAnimationToEnd` sau navigation transitions
- `optional: true` cho elements co the khong hien thi (empty state)
- `clearState: true` trong `launchApp` de test tu dau

## Anti-Patterns
- KHONG hard-code sleep/delay — dung `assertVisible` hoac `extendedWaitUntil`
- KHONG test API logic bang Maestro — dung curl/httpie cho API
- KHONG test admin dashboard bang Maestro — dung Playwright
- KHONG dung coordinates (tapOn x,y) — dung text/id
- KHONG viet flow qua dai (>30 steps) — chia nho, dung `runFlow`
