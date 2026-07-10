# 09 — Performance Patterns (Template)

> Template chung. Xem `PROJECT_CONFIG.md` cho performance targets va cau hinh cu the cua du an.

## 1. Database Optimization

### Index Strategy
```sql
-- Foreign keys (BAT BUOC cho moi du an)
CREATE INDEX idx_[child]_[parent]_id ON [child_table]([parent]_id);

-- Spatial indexes (PostGIS — neu du an co geolocation)
CREATE INDEX idx_[table]_location ON [table] USING GIST(location);

-- Composite indexes (frequent queries — tuy du an)
CREATE INDEX idx_[table]_status_date ON [table](status, created_at);
CREATE INDEX idx_[table]_status_active ON [table](status) WHERE status = 'active';

-- Partial indexes (filtered queries)
CREATE INDEX idx_[table]_active ON [table](status) WHERE status = 'active';
```

> Xem `PROJECT_CONFIG.md` cho danh sach indexes cu the can tao.

### N+1 Prevention
```typescript
// BAD: N+1 query
const items = await db.select().from(items).where(eq(items.status, 'active'));
for (const item of items) {
  item.owner = await db.select().from(users).where(eq(users.id, item.ownerId)); // N queries!
}

// GOOD: JOIN query
const itemsWithOwners = await db
  .select({
    item: items,
    owner: {
      id: users.id,
      fullName: users.fullName,
    },
  })
  .from(items)
  .innerJoin(users, eq(items.ownerId, users.id))
  .where(eq(items.status, 'active'));
```

### PostGIS Query Optimization (neu co)
```typescript
// BAD: Calculate distance cho TAT CA records roi filter
const allItems = await db.select().from(items);
const nearby = allItems.filter(i => calculateDistance(i.lat, i.lng, userLat, userLng) < radius);

// GOOD: PostGIS filter trong DB (su dung spatial index)
const nearbyItems = await db.execute(sql`
  SELECT i.id, i.title, i.status,
         u.full_name as owner_name,
         ST_Distance(i.location::geography, ST_MakePoint(${lng}, ${lat})::geography) as distance
  FROM [items] i
  JOIN users u ON i.owner_id = u.id
  WHERE i.status = 'active'
    AND ST_DWithin(
      i.location::geography,
      ST_MakePoint(${lng}, ${lat})::geography,
      ${radiusMeters}
    )
  ORDER BY distance ASC
  LIMIT ${limit}
`);
```

### Connection Pooling
```typescript
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool);
```

## 2. Redis Caching

### Cache Patterns
```typescript
// Cache-aside pattern
async function getCachedItems(filters: SearchFilters): Promise<Item[]> {
  const cacheKey = `items:search:${JSON.stringify(filters)}`;

  // Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Query DB
  const items = await searchItems(filters);

  // Cache result (TTL 30s for active data)
  await redis.setex(cacheKey, 30, JSON.stringify(items));

  return items;
}

// Location cache (hot data — neu co)
async function getUserLocation(userId: string) {
  const cached = await redis.get(`user:loc:${userId}`);
  if (cached) return JSON.parse(cached);

  const user = await db.select({ location: users.currentLocation })
    .from(users).where(eq(users.id, userId));
  return user[0]?.location;
}

async function updateUserLocation(userId: string, lat: number, lng: number) {
  // Always update Redis (hot path)
  await redis.setex(`user:loc:${userId}`, 30, JSON.stringify({ lat, lng }));

  // Debounce DB update (cold path) — moi 30s
  const lastUpdate = await redis.get(`user:loc:lastdb:${userId}`);
  if (!lastUpdate) {
    await db.execute(sql`
      UPDATE users SET location = ST_MakePoint(${lng}, ${lat})
      WHERE id = ${userId}
    `);
    await redis.setex(`user:loc:lastdb:${userId}`, 30, '1');
  }
}

// Cache invalidation
async function invalidateItemCache(itemId: string) {
  await redis.del(`item:${itemId}`);
  const keys = await redis.keys('items:search:*');
  if (keys.length > 0) await redis.del(...keys);
}
```

### Redis Data Structures — Template
```
user:loc:{userId}            STRING  {lat,lng}     TTL 30s   — Vi tri user
user:loc:lastdb:{userId}     STRING  "1"           TTL 30s   — Debounce DB write
item:{itemId}                STRING  {item data}   TTL 60s   — Item detail cache
items:search:{hash}          STRING  [items]       TTL 30s   — Search result cache
online:users                 SET     {userIds}     —         — Users online
user:session:{userId}        STRING  {session}     TTL 7d    — User session
otp:{phone}:{purpose}        STRING  {code,attempts} TTL 5m  — OTP storage
rate:{ip}:{endpoint}         STRING  count         TTL varies — Rate limiting
```

> Xem `PROJECT_CONFIG.md` cho danh sach cache keys cu the cua du an.

## 3. React Native Performance

### FlatList Optimization
```tsx
// BAD
<FlatList data={items} renderItem={({ item }) => <ItemCard item={item} />} />

// GOOD
const ITEM_HEIGHT = 120; // Fixed height cho moi item

const renderItem = useCallback(({ item }: { item: Item }) => (
  <ItemCard item={item} onPress={handlePress} />
), [handlePress]);

const keyExtractor = useCallback((item: Item) => item.id, []);

const getItemLayout = useCallback((_: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
}), []);

<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  getItemLayout={getItemLayout}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  initialNumToRender={10}
/>
```

### Memo & Callback
```tsx
// BAD: Component re-render moi khi parent re-render
function ItemCard({ item, onPress }: Props) { ... }

// GOOD: Memo component
const ItemCard = React.memo(function ItemCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity onPress={() => onPress(item.id)}>
      <Text>{item.title}</Text>
      <Text>{formatDate(item.createdAt)}</Text>
    </TouchableOpacity>
  );
});

// BAD: Inline function tao reference moi moi render
<ItemCard item={item} onPress={(id) => navigation.navigate('Detail', { id })} />

// GOOD: Stable callback
const handlePress = useCallback((id: string) => {
  navigation.navigate('Detail', { id });
}, [navigation]);
<ItemCard item={item} onPress={handlePress} />
```

### Image Optimization
```tsx
import FastImage from 'react-native-fast-image';

// BAD: No caching, no resize
<Image source={{ uri: user.avatar }} style={{ width: 50, height: 50 }} />

// GOOD: Cached, prioritized
<FastImage
  source={{ uri: user.avatar, priority: FastImage.priority.normal }}
  style={{ width: 50, height: 50 }}
  resizeMode={FastImage.resizeMode.cover}
/>

// Server-side: resize images on upload
async function processUpload(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();
}
```

### Skeleton Loading
```tsx
// BAD: Spinner
if (isLoading) return <ActivityIndicator />;

// GOOD: Skeleton
if (isLoading) return <ItemCardSkeleton count={5} />;

function ItemCardSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.skeleton}>
          <View style={[styles.skeletonLine, { width: '80%' }]} />
          <View style={[styles.skeletonLine, { width: '60%' }]} />
          <View style={[styles.skeletonLine, { width: '40%' }]} />
        </View>
      ))}
    </>
  );
}
```

## 4. Socket.IO Performance

### Connection Management
```typescript
// Server: limit connections per user
const userSockets = new Map<string, Set<string>>();

io.on('connection', (socket) => {
  const userId = socket.data.user.id;
  const existing = userSockets.get(userId) || new Set();

  if (existing.size >= 3) { // Max 3 connections per user
    socket.disconnect(true);
    return;
  }

  existing.add(socket.id);
  userSockets.set(userId, existing);

  socket.on('disconnect', () => {
    existing.delete(socket.id);
    if (existing.size === 0) userSockets.delete(userId);
  });
});
```

### Event Batching
```typescript
// BAD: Emit location moi 1 giay
setInterval(() => socket.emit('location', { lat, lng }), 1000);

// GOOD: Batch + throttle, chi khi thay doi
let lastSent = { lat: 0, lng: 0 };
const THRESHOLD = 10; // meters

function shouldSendUpdate(lat: number, lng: number): boolean {
  const distance = haversine(lastSent.lat, lastSent.lng, lat, lng);
  return distance > THRESHOLD;
}

// Throttle to 5s intervals
const sendLocation = throttle((lat: number, lng: number) => {
  if (shouldSendUpdate(lat, lng)) {
    socket.emit('location-update', { lat, lng, timestamp: Date.now() });
    lastSent = { lat, lng };
  }
}, 5000);
```

## 5. API Response Optimization

### Pagination
```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

async function paginatedQuery<T>(
  query: SQL,
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedResponse<T>> {
  const offset = (page - 1) * limit;

  const [data, countResult] = await Promise.all([
    db.execute(sql`${query} LIMIT ${limit} OFFSET ${offset}`),
    db.execute(sql`SELECT COUNT(*) as total FROM (${query}) sub`),
  ]);

  const total = Number(countResult[0].total);
  return {
    data: data as T[],
    total,
    page,
    limit,
    hasMore: offset + limit < total,
  };
}
```

### Response Compression
```typescript
import compression from 'compression';

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  threshold: 1024, // Chi compress > 1KB
}));
```

## 6. Background Jobs (BullMQ)

### Job Queues
```typescript
import { Queue, Worker } from 'bullmq';

// Notification queue — gui push notifications async
const notificationQueue = new Queue('notifications', { connection: redis });

// Add job
await notificationQueue.add('push', {
  userId,
  title: 'Cap nhat!',
  body: 'Co thay doi moi',
  data: { entityId },
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
});

// Worker processes jobs
new Worker('notifications', async (job) => {
  const { userId, title, body, data } = job.data;
  const user = await getUserFCMToken(userId);
  if (user?.fcmToken) {
    await sendPushNotification(user.fcmToken, title, body, data);
  }
}, { connection: redis, concurrency: 5 });
```

## Performance Anti-Patterns
- KHONG SELECT * trong production queries
- KHONG N+1 queries (loop + DB call)
- KHONG missing indexes tren foreign keys
- KHONG calculate distance trong JavaScript (dung PostGIS)
- KHONG cache financial balance (phai always fresh)
- KHONG inline styles trong React Native components
- KHONG ScrollView cho lists > 20 items
- KHONG Socket.IO emit moi giay (throttle 5s)
- KHONG synchronous heavy computation trong main thread
- KHONG import toan bo library khi chi dung 1 function
