# Coding Guide & Anti-Patterns

> Template chung cho mọi dự án. Xem `PROJECT_CONFIG.md` cho thông tin cụ thể của dự án.

## 1. TypeScript Strict Rules
- KHONG dung `any` — luon define type cu the
- KHONG dung `as` type assertion tru khi that su can
- KHONG dung `!` non-null assertion — kiem tra null truoc
- Dung `unknown` thay vi `any` cho external data
- Export types tu `types.ts`, khong inline

## 2. Async/Await
- LUON try/catch trong controller handlers
- KHONG dung `.then().catch()` — dung async/await
- KHONG forget `await` — eslint rule `no-floating-promises`
- Database transactions: `await db.transaction(async (tx) => { ... })`

## 3. Database Anti-Patterns
- KHONG raw SQL khi Drizzle query builder du dung
- KHONG SELECT * — chi select columns can thiet
- KHONG insert default columns (id, created_at, updated_at)
- KHONG forget index cho foreign keys va frequently queried columns
- PostGIS: KHONG dung LIKE cho geolocation — dung ST_DWithin

## 4. API Anti-Patterns
- KHONG return stack trace trong production errors
- KHONG trust client input — validate bang zod
- KHONG hard-code status messages — dung error codes
- KHONG forget pagination cho list endpoints
- KHONG mix authentication logic trong controllers — dung middleware

## 5. React Native Anti-Patterns
- KHONG dung inline styles cho repeated components — dung StyleSheet
- KHONG setState trong useEffect loop — se gay infinite re-render
- KHONG dung index lam key trong FlatList — dung unique id
- KHONG fetch data trong component body — dung useQuery hooks
- KHONG hard-code dimensions — dung Dimensions API hoac responsive units
- KHONG dung ScrollView cho list dai — dung FlatList

## 6. Security
- Passwords: hash bang bcrypt (min 12 rounds)
- JWT: access token short-lived (15min), refresh token in httpOnly cookie
- OTP: 6 digits, expire 5 phut, max 5 attempts
- File upload: validate mime type, max size 5MB
- SQL injection: LUON dung parameterized queries
- Rate limiting: sensitive endpoints (login, OTP, payment)

## 7. Naming Conventions
- Files: `kebab-case.ts` (backend), `PascalCase.tsx` (components)
- Variables/functions: `camelCase`
- Types/Interfaces: `PascalCase`
- Database tables: `snake_case`
- API routes: `kebab-case` (vi du: `/api/[entities]/active-[entities]`)
- Socket events: `kebab-case` (vi du: `entity-update`, `status-changed`)

## 8. Error Handling Pattern
```typescript
// Controller pattern
router.get('/[entities]', requireAuth, async (req, res, next) => {
  try {
    const result = await entityService.getAll(req.query);
    res.json({ data: result });
  } catch (err) {
    next(err); // global error handler se xu ly
  }
});

// Service pattern — throw specific errors
if (!entity) throw new AppError('ENTITY_NOT_FOUND', 404);
if (entity.status !== 'active') throw new AppError('ENTITY_NOT_ACTIVE', 400);
if (wallet.balance < amount) throw new AppError('INSUFFICIENT_BALANCE', 400);
```

## 9. Logging
- Dung structured logger (pino/winston), KHONG console.log
- Log levels: error (bugs), warn (business issues), info (events), debug (dev)
- Log context: userId, entityId, action
- KHONG log sensitive data: passwords, tokens, OTP codes, so CCCD/CMND

## 10. Testing Checklist
Truoc khi submit code, kiem tra:
- [ ] `npx tsc --noEmit` pass
- [ ] Khong co `console.log` con sot
- [ ] Khong co `any` type
- [ ] API endpoints co auth middleware
- [ ] Database queries co error handling
- [ ] Geolocation queries dung PostGIS functions (neu co)
- [ ] Financial operations trong transaction (neu co)

> Xem `PROJECT_CONFIG.md` cho danh sach cac module va checklist cu the cua du an.
