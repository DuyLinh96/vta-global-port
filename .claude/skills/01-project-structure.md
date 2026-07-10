# 01 — Project Structure (Template)

> Template chung cho monorepo. Xem `PROJECT_CONFIG.md` cho danh sach modules cu the cua du an.

## Monorepo Layout
```
[project-name]/
├── apps/
│   ├── mobile/              # React Native (Expo) app
│   │   ├── app/             # expo-router screens (file-based routing)
│   │   │   ├── (auth)/      # Auth screens (login, register, otp)
│   │   │   ├── ([role-1])/  # Screen group theo role
│   │   │   ├── ([role-2])/  # Screen group theo role
│   │   │   └── _layout.tsx  # Root layout
│   │   ├── components/      # Shared UI components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API client, Socket.IO client
│   │   ├── stores/          # Zustand stores
│   │   ├── utils/           # Helpers, constants
│   │   ├── assets/          # Images, fonts
│   │   ├── app.json         # Expo config
│   │   └── package.json
│   │
│   └── admin/               # Admin web dashboard (React + Vite)
│       ├── src/
│       │   ├── pages/       # Admin pages
│       │   ├── components/  # Shared components
│       │   ├── hooks/       # Data fetching hooks
│       │   └── ...
│       └── package.json
│
├── server/                  # Backend API (Express 5)
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   │   ├── auth/        # Authentication (login, register, OTP)
│   │   │   ├── user/        # User management
│   │   │   ├── [module-1]/  # Feature module 1
│   │   │   ├── [module-2]/  # Feature module 2
│   │   │   ├── notification/# Push notifications
│   │   │   └── admin/       # Admin-only endpoints
│   │   ├── middleware/      # Auth, error handler, rate limiter
│   │   ├── socket/          # Socket.IO setup & handlers
│   │   ├── config/          # DB, Redis, Firebase config
│   │   ├── utils/           # Shared utilities
│   │   └── index.ts         # App entry point
│   ├── drizzle/             # Migrations
│   └── package.json
│
├── packages/                # Shared packages
│   └── shared/              # Shared types, constants, validators
│       ├── types/           # Shared TypeScript types
│       ├── validators/      # Zod schemas (shared giua mobile + backend)
│       └── constants/       # Enums, error codes
│
├── docker-compose.yml
├── .env.example
└── package.json             # Root workspace
```

> Xem `PROJECT_CONFIG.md` cho danh sach modules, screen groups, va roles cu the.

## Module Structure (Backend)
Moi module trong `server/src/modules/` co:
```
modules/[module-name]/
├── schema.ts         # Drizzle table definitions
├── controller.ts     # Express router + handlers
├── service.ts        # Business logic
├── types.ts          # TypeScript types
└── events.ts         # Socket.IO events (neu can realtime)
```

## Screen Structure (Mobile)
Moi screen group trong `apps/mobile/app/`:
```
app/([role])/
├── index.tsx         # Home screen
├── [feature-1]/
│   ├── index.tsx     # List screen
│   ├── [id].tsx      # Detail screen
│   └── create.tsx    # Create screen
├── [feature-2]/
│   ├── index.tsx     # Overview screen
│   └── ...
├── profile/
│   └── index.tsx     # Profile screen
└── _layout.tsx       # Tab navigation layout
```

## Naming Conventions
- Backend modules: `kebab-case` folders
- Mobile screens: `kebab-case` files (expo-router convention)
- Components: `PascalCase.tsx`
- Hooks: `use-[name].ts` hoac `useXxx.ts`
- Stores: `[name]-store.ts`
- Types: `types.ts` trong moi module/screen
