# 03 — API Controller Patterns (Template)

> Template chung cho Express 5 + TypeScript. Xem `PROJECT_CONFIG.md` cho routes cu the cua du an.

## Express 5 + TypeScript

### Base Controller Pattern
```typescript
import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { entityService } from './service';
import { createEntitySchema, searchEntitySchema } from './validators';

const router = Router();

// List entities (with filters)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const filters: Record<string, unknown> = {};
    if (typeof status === 'string') filters.status = status;

    const { data, total } = await entityService.list(filters, Number(limit), offset);
    res.json({ data, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

// Get single entity
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const entity = await entityService.getById(req.params.id);
    if (!entity) return res.status(404).json({ error: 'ENTITY_NOT_FOUND' });
    res.json({ data: entity });
  } catch (err) {
    next(err);
  }
});

// Create entity (role-restricted)
router.post('/', requireAuth, requireRole('[role]'), validate(createEntitySchema), async (req, res, next) => {
  try {
    const entity = await entityService.create(req.user!.id, req.body);
    res.status(201).json({ data: entity });
  } catch (err) {
    next(err);
  }
});

export default router;
```

### API Route Structure — Template
```
/api/auth
  POST /register          — Dang ky
  POST /login             — Dang nhap
  POST /send-otp          — Gui OTP
  POST /verify-otp        — Xac thuc OTP
  POST /refresh-token     — Refresh JWT
  POST /logout            — Dang xuat

/api/users
  GET  /me                — Profile hien tai
  PUT  /me                — Update profile
  PUT  /me/fcm-token      — Update FCM token

/api/[entities]
  GET  /                  — List (with filters, pagination)
  GET  /:id               — Detail
  POST /                  — Create
  PUT  /:id               — Update
  DELETE /:id             — Delete / Cancel
  GET  /search            — Search (with specific filters)
  GET  /nearby            — Nearby (PostGIS, neu co)

/api/admin
  GET  /[entities]        — List (admin view)
  PUT  /[entities]/:id/approve  — Approve
  PUT  /[entities]/:id/block    — Block
  GET  /stats             — Dashboard stats
```

> Xem `PROJECT_CONFIG.md` cho danh sach routes, roles, va business endpoints cu the.

### Middleware Stack
```typescript
// Auth middleware
export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'UNAUTHORIZED' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'TOKEN_EXPIRED' });
  }
};

// Role middleware
export const requireRole = (...roles: string[]) => (req, res, next) => {
  if (!roles.includes(req.user!.role)) {
    return res.status(403).json({ error: 'FORBIDDEN' });
  }
  next();
};

// Validation middleware (zod)
export const validate = (schema: ZodSchema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', details: result.error.flatten() });
  }
  req.body = result.data;
  next();
};
```

### Error Handling
```typescript
// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.code, message: err.message });
  }
  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json({ error: 'INTERNAL_ERROR' });
});
```

### Rules
1. LUON co `requireAuth` middleware
2. `requireRole` cho endpoints can phan quyen
3. Validate input bang zod schemas
4. Pagination cho list endpoints
5. KHONG return sensitive data (passwordHash, tokens)
6. Response format: `{ data, total?, page?, limit? }` hoac `{ error, message?, details? }`
