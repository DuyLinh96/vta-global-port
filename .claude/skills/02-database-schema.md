# 02 — Database Schema Patterns (Template)

> Template chung cho Drizzle ORM + PostgreSQL + PostGIS. Xem `PROJECT_CONFIG.md` cho schema cu the cua du an.

## Tech: Drizzle ORM + PostgreSQL 16 + PostGIS

## Base Table Pattern

### users (vi du chung — hau het du an deu co)
```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: varchar('phone', { length: 15 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // Xem PROJECT_CONFIG.md cho roles
  fullName: varchar('full_name', { length: 100 }).notNull(),
  avatar: varchar('avatar', { length: 500 }),
  status: varchar('status', { length: 20 }).default('active'), // 'active' | 'blocked' | 'pending'
  fcmToken: varchar('fcm_token', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### [entity] — Template cho business entity
```typescript
export const [entities] = pgTable('[entities]', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Foreign key toi user hoac entity khac
  userId: uuid('user_id').references(() => users.id).notNull(),
  // Business fields — tuy du an
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).default('active'),
  // Geolocation (neu can)
  location: geometry('location', { type: 'point', srid: 4326 }),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### otp_codes (vi du chung)
```typescript
export const otpCodes = pgTable('otp_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: varchar('phone', { length: 15 }).notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  purpose: varchar('purpose', { length: 20 }).notNull(), // 'login' | 'register' | 'reset_password'
  attempts: integer('attempts').default(0),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## PostGIS Queries

### Tim entity trong ban kinh
```typescript
// Tim [entities] trong ban kinh N km tu vi tri
const nearbyEntities = await db.execute(sql`
  SELECT e.*, ST_Distance(
    e.location::geography,
    ST_MakePoint(${lng}, ${lat})::geography
  ) as distance_meters
  FROM [entities] e
  WHERE e.status = 'active'
    AND ST_DWithin(
      e.location::geography,
      ST_MakePoint(${lng}, ${lat})::geography,
      ${radiusMeters}
    )
  ORDER BY distance_meters ASC
  LIMIT ${limit} OFFSET ${offset}
`);
```

### Update location
```typescript
await db.execute(sql`
  UPDATE [entities]
  SET location = ST_MakePoint(${lng}, ${lat})::geometry
  WHERE id = ${entityId}
`);
```

## Transaction Pattern
```typescript
// Atomic operations — dung cho financial, status changes
await db.transaction(async (tx) => {
  // Lock row (SELECT FOR UPDATE)
  const [record] = await tx.execute(sql`
    SELECT * FROM [entities] WHERE id = ${id} FOR UPDATE
  `);

  if (!record) throw new AppError('NOT_FOUND', 404);

  // Update trong transaction
  await tx.execute(sql`
    UPDATE [entities] SET status = 'completed', updated_at = NOW()
    WHERE id = ${id}
  `);

  // Insert audit log
  await tx.insert(auditLogs).values({
    entityId: id,
    action: 'status_change',
    oldValue: record.status,
    newValue: 'completed',
  });
});
```

## Rules
1. KHONG insert columns co `.default()` hoac `.defaultNow()`
2. Geolocation LUON dung SRID 4326 (WGS84)
3. Money dung integer (don vi nho nhat, khong can decimal)
4. LUON co index tren foreign keys
5. Spatial index cho geometry columns
6. Financial operations PHAI trong transaction
7. Soft delete preferred: `status = 'deleted'` thay vi DELETE

> Xem `PROJECT_CONFIG.md` cho danh sach tables, relationships, va business rules cu the.
