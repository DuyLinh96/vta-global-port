# 08 — Security Patterns (Template)

> Template chung cho bao mat. Xem `PROJECT_CONFIG.md` cho cau hinh cu the cua du an.

## 1. Authentication Flow

### Dang ky (Register)
```
Client                    Server                      SMS Gateway
  |--- POST /register --->|                               |
  |    {phone, password}  |--- validate phone format ---->|
  |                       |--- hash password (bcrypt) --->|
  |                       |--- create user (pending) ---->|
  |                       |--- generate OTP (6 digits) -->|
  |                       |--- store OTP (Redis, 5min) -->|
  |                       |--- send OTP via SMS --------->|
  |<-- 201 {message} -----|                               |
  |                       |                               |
  |--- POST /verify-otp ->|                               |
  |    {phone, code}      |--- verify OTP from Redis ---->|
  |                       |--- activate user ------------->|
  |                       |--- generate JWT tokens ------->|
  |<-- 200 {tokens} ------|                               |
```

### Dang nhap (Login)
```
Client                    Server                      Redis
  |--- POST /login ------>|                               |
  |    {phone, password}  |--- check failed attempts ---->|
  |                       |--- find user by phone ------->|
  |                       |--- bcrypt.compare() --------->|
  |                       |--- if fail: increment attempts|
  |                       |--- if success: reset attempts |
  |                       |--- generate JWT tokens ------->|
  |                       |--- store refresh in Redis ---->|
  |<-- 200 {tokens} ------|                               |
```

### JWT Token Structure
```typescript
// Access Token (15 min)
{
  sub: userId,        // UUID
  role: '[role]',     // Xem PROJECT_CONFIG.md cho roles
  iat: timestamp,
  exp: timestamp + 15min,
}

// Refresh Token (7 days)
{
  sub: userId,
  type: 'refresh',
  jti: uniqueId,      // de revoke individual tokens
  iat: timestamp,
  exp: timestamp + 7days,
}
```

### Token Refresh Flow
```typescript
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    // Check token not revoked
    const isRevoked = await redis.get(`revoked:${decoded.jti}`);
    if (isRevoked) return res.status(401).json({ error: 'TOKEN_REVOKED' });

    // Generate new tokens
    const accessToken = generateAccessToken(decoded.sub, decoded.role);
    const newRefreshToken = generateRefreshToken(decoded.sub);

    // Revoke old refresh token (rotation)
    await redis.setex(`revoked:${decoded.jti}`, 7 * 24 * 3600, '1');

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch {
    res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
  }
});
```

## 2. OTP Security
```typescript
// OTP Service
class OTPService {
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY = 300; // 5 phut
  private readonly MAX_ATTEMPTS = 5;
  private readonly COOLDOWN = 60; // 1 phut giua cac lan gui

  async sendOTP(phone: string, purpose: string): Promise<void> {
    // Rate limit check
    const cooldownKey = `otp:cooldown:${phone}`;
    const inCooldown = await redis.exists(cooldownKey);
    if (inCooldown) throw new AppError('OTP_COOLDOWN', 429, 'Vui long doi 1 phut');

    // Generate secure random OTP
    const code = crypto.randomInt(100000, 999999).toString();

    // Store in Redis with expiry
    const otpKey = `otp:${phone}:${purpose}`;
    await redis.setex(otpKey, this.OTP_EXPIRY, JSON.stringify({
      code: await bcrypt.hash(code, 10), // Hash OTP too
      attempts: 0,
    }));

    // Set cooldown
    await redis.setex(cooldownKey, this.COOLDOWN, '1');

    // Send via SMS gateway
    await smsGateway.send(phone, `Ma OTP: ${code}. Het han sau 5 phut.`);

    // Audit log
    logger.info({ phone, purpose }, 'OTP sent');
  }

  async verifyOTP(phone: string, purpose: string, code: string): Promise<boolean> {
    const otpKey = `otp:${phone}:${purpose}`;
    const data = await redis.get(otpKey);
    if (!data) throw new AppError('OTP_EXPIRED', 400, 'Ma OTP da het han');

    const { code: hashedCode, attempts } = JSON.parse(data);

    if (attempts >= this.MAX_ATTEMPTS) {
      await redis.del(otpKey);
      throw new AppError('OTP_MAX_ATTEMPTS', 429, 'Qua so lan thu. Vui long gui lai OTP.');
    }

    const isValid = await bcrypt.compare(code, hashedCode);
    if (!isValid) {
      // Increment attempts
      await redis.setex(otpKey, this.OTP_EXPIRY, JSON.stringify({
        code: hashedCode,
        attempts: attempts + 1,
      }));
      throw new AppError('OTP_INVALID', 400, 'Ma OTP khong dung');
    }

    // OTP valid → delete
    await redis.del(otpKey);
    return true;
  }
}
```

## 3. File Upload Security
```typescript
// middleware/upload.ts
import multer from 'multer';
import path from 'path';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(new AppError('INVALID_FILE_TYPE', 400, 'Chi chap nhan JPEG, PNG, WebP'));
    }
    // Double check magic bytes (not just extension)
    cb(null, true);
  },
});

// Upload to storage with encryption
async function uploadToStorage(buffer: Buffer, filename: string, userId: string): Promise<string> {
  const safeFilename = `${userId}/${Date.now()}-${crypto.randomUUID()}${path.extname(filename)}`;

  await storageClient.putObject(BUCKET, safeFilename, buffer, {
    'Content-Type': file.mimetype,
    'x-amz-server-side-encryption': 'AES256', // Encrypt at rest
  });

  return safeFilename;
}
```

## 4. Transaction Security (Financial Operations)
```typescript
// Atomic operations — dung cho moi thao tac financial
async function processPayment(fromUserId: string, toUserId: string, amount: number, referenceId: string) {
  return await db.transaction(async (tx) => {
    // Lock sender wallet (SELECT FOR UPDATE)
    const [senderWallet] = await tx.execute(sql`
      SELECT * FROM wallets WHERE user_id = ${fromUserId} FOR UPDATE
    `);

    if (senderWallet.balance < amount) {
      throw new AppError('INSUFFICIENT_BALANCE', 400, 'So du khong du');
    }

    // Lock receiver wallet
    const [receiverWallet] = await tx.execute(sql`
      SELECT * FROM wallets WHERE user_id = ${toUserId} FOR UPDATE
    `);

    // Debit sender
    await tx.execute(sql`
      UPDATE wallets SET balance = balance - ${amount}, updated_at = NOW()
      WHERE user_id = ${fromUserId}
    `);

    // Credit receiver
    await tx.execute(sql`
      UPDATE wallets SET balance = balance + ${amount}, updated_at = NOW()
      WHERE user_id = ${toUserId}
    `);

    // Transaction logs (immutable audit trail)
    await tx.insert(transactions).values([
      {
        walletId: senderWallet.id,
        type: 'payment',
        amount: -amount,
        balanceAfter: senderWallet.balance - amount,
        referenceId,
        description: 'Thanh toan',
      },
      {
        walletId: receiverWallet.id,
        type: 'earning',
        amount: amount,
        balanceAfter: receiverWallet.balance + amount,
        referenceId,
        description: 'Nhan thanh toan',
      },
    ]);

    return { success: true };
  });
}
```

## 5. Socket.IO Security
```typescript
// Room access control
socket.on('join-room', async (entityId: string) => {
  const userId = socket.data.user.id;

  // Verify user belongs to this entity/room
  const isMember = await checkRoomMembership(userId, entityId);

  if (!isMember) {
    socket.emit('error', { code: 'FORBIDDEN', message: 'Ban khong co quyen truy cap' });
    return;
  }

  socket.join(`entity:${entityId}`);
});
```

## 6. Data Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize user input truoc khi luu DB
function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }); // Strip all HTML
}

// Ap dung cho: ten, dia chi, tin nhan, ghi chu
```

## 7. Security Headers (Production)
```typescript
app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-site' },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

## 8. Environment Security
```
# .env — KHONG BAO GIO commit
JWT_SECRET=<random 64 chars>
JWT_REFRESH_SECRET=<random 64 chars>
DATABASE_URL=postgres://user:pass@localhost:[port]/[dbname]
REDIS_URL=redis://localhost:[port]
SMS_API_KEY=<api key>
GOOGLE_MAPS_API_KEY=<api key>
FCM_SERVER_KEY=<firebase key>
STORAGE_ACCESS_KEY=<key>
STORAGE_SECRET_KEY=<key>
```

## 9. OWASP Top 10 — Checklist Bat Buoc

Moi code PHAI duoc review theo OWASP Top 10 (2021). Day la tieu chuan bao mat toi thieu.

### A01: Broken Access Control
- Tat ca endpoints PHAI co `requireAuth` middleware
- RBAC: `requireRole([...])` cho moi endpoint
- Resource ownership: user chi truy cap data cua minh (`WHERE user_id = req.user.id`)
- CORS cau hinh dung (chi cho phep origins cu the, KHONG dung `*`)
- KHONG expose admin endpoints cho public
- Directory listing: tat trong production
- Rate limit tren moi endpoint (dac biet auth, financial)

```typescript
// DUNG — kiem tra ownership
router.get('/orders/:id', requireAuth, async (req, res, next) => {
  const order = await orderService.findById(req.params.id);
  if (!order) throw new AppError('NOT_FOUND', 404);
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('FORBIDDEN', 403);
  }
  res.json({ data: order });
});

// SAI — khong kiem tra ownership
router.get('/orders/:id', requireAuth, async (req, res) => {
  const order = await orderService.findById(req.params.id); // Bat ky user nao cung xem duoc!
  res.json({ data: order });
});
```

### A02: Cryptographic Failures
- Passwords: bcrypt (min 12 rounds) hoac argon2id
- JWT secret: random >= 64 chars, KHONG hard-code
- OTP: hash truoc khi luu (bcrypt)
- Sensitive data in transit: HTTPS only (HSTS header)
- Sensitive data at rest: encrypt (AES-256)
- KHONG dung MD5, SHA1 cho passwords
- KHONG luu tokens/secrets trong localStorage (dung httpOnly cookies)

```typescript
// DUNG — hash password
const hashedPassword = await bcrypt.hash(password, 12);

// DUNG — hash OTP truoc khi luu
const hashedOTP = await bcrypt.hash(otpCode, 10);
await redis.setex(key, 300, JSON.stringify({ code: hashedOTP, attempts: 0 }));

// SAI — luu plain-text
await redis.setex(key, 300, otpCode); // KHONG BAO GIO!
```

### A03: Injection
- SQL Injection: LUON dung ORM/parameterized queries, KHONG string concatenation
- NoSQL Injection: validate input types (khong cho object khi expect string)
- XSS: sanitize moi user input truoc khi render (DOMPurify)
- Command Injection: KHONG dung `exec()`, `eval()`, `child_process` voi user input
- Path Traversal: validate file paths, KHONG cho `../` trong uploads
- Template Injection: KHONG interpolate user input vao templates

```typescript
// DUNG — parameterized query (ORM)
const users = await db.select().from(users).where(eq(users.email, userInput));

// SAI — string concatenation
const users = await db.execute(`SELECT * FROM users WHERE email = '${userInput}'`);

// DUNG — sanitize HTML
import DOMPurify from 'isomorphic-dompurify';
const clean = DOMPurify.sanitize(userInput, { ALLOWED_TAGS: [] });

// SAI — trust user input
const content = userInput; // Co the chua <script>alert('xss')</script>
```

### A04: Insecure Design
- Validate business logic: check permissions O MOI BUOC, khong chi UI
- Rate limit moi chuc nang nhay cam (auth, payment, OTP)
- Fail securely: khi loi xay ra, deny access (khong grant)
- Threat modeling: xac dinh attack surface truoc khi implement
- KHONG rely on client-side validation — LUON validate server-side

```typescript
// DUNG — server-side validation
const schema = z.object({
  amount: z.number().positive().max(100_000_000),
  recipientId: z.string().uuid(),
});
const validated = schema.parse(req.body);

// SAI — trust client
const { amount } = req.body; // Client co the gui amount = -1000000
```

### A05: Security Misconfiguration
- Tat debug/verbose error trong production
- Remove default accounts, unused endpoints
- Security headers: helmet() voi day du config
- Docker: KHONG chay container voi root user
- Dependencies: update thuong xuyen, scan vulnerabilities
- .env: KHONG commit, dung .env.example lam template
- CORS: chi allow origins cu the

```typescript
// DUNG — production error handler
app.use((err, req, res, next) => {
  logger.error({ err, path: req.path, userId: req.user?.id });
  res.status(err.status || 500).json({
    error: err.code || 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production'
      ? 'Loi he thong'
      : err.message,
  });
});

// SAI — expose stack trace
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack }); // KHONG!
});
```

### A06: Vulnerable and Outdated Components
- `npm audit` — chay thuong xuyen, fix critical/high ngay
- KHONG dung packages da deprecated hoac khong maintained
- Lock versions: dung package-lock.json, KHONG dung `*` hoac `latest`
- Review transitive dependencies (dependencies cua dependencies)
- CI/CD: tich hop `npm audit` vao pipeline

### A07: Identification and Authentication Failures
- Multi-factor: OTP/2FA cho actions nhay cam
- Password policy: min 8 chars (hoac theo project config)
- Brute force protection: lock after N failed attempts
- Session management: expire, invalidate on logout/password change
- Token rotation: revoke old refresh token khi issue new one
- KHONG expose user existence qua error messages

```typescript
// DUNG — generic error message
if (!user || !await bcrypt.compare(password, user.passwordHash)) {
  throw new AppError('INVALID_CREDENTIALS', 401, 'Sai thong tin dang nhap');
}

// SAI — leak user existence
if (!user) throw new AppError('USER_NOT_FOUND', 404); // Attacker biet email ton tai
if (!await bcrypt.compare(password, user.passwordHash)) throw new AppError('WRONG_PASSWORD', 401);
```

### A08: Software and Data Integrity Failures
- Verify file integrity khi upload (magic bytes, KHONG chi extension)
- CI/CD pipeline: protect branches, require reviews
- Dependencies: verify checksums, dung lock files
- KHONG trust deserialized data tu untrusted sources
- Webhook/callback: verify signatures (HMAC)

```typescript
// DUNG — verify file magic bytes
const fileType = await fileTypeFromBuffer(buffer);
if (!fileType || !ALLOWED_TYPES.includes(fileType.mime)) {
  throw new AppError('INVALID_FILE', 400, 'File khong hop le');
}

// SAI — chi check extension
if (!filename.endsWith('.jpg')) throw new Error('Invalid'); // Co the rename malware.exe -> malware.jpg
```

### A09: Security Logging and Monitoring Failures
- Log moi action nhay cam: login, logout, failed auth, permission denied, financial ops
- KHONG log sensitive data: password, token, OTP, PII
- Structured logging: JSON format voi timestamp, userId, action, IP, userAgent
- Alert: setup cho suspicious patterns (nhieu failed logins, unusual activity)
- Retention: giu logs du lau cho audit (min 90 ngay)

```typescript
// DUNG — structured security logging
logger.warn({
  event: 'auth.failed_login',
  phone: maskPhone(phone), // 0906***999
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  reason: 'invalid_password',
  attemptCount: failedAttempts,
});

// SAI — log sensitive data
logger.info({ phone, password, otp }, 'Login attempt'); // KHONG BAO GIO!
```

### A10: Server-Side Request Forgery (SSRF)
- Validate va whitelist URLs truoc khi server fetch
- KHONG cho user input URLs de server request truc tiep
- Block internal IPs (127.0.0.1, 10.x, 172.16.x, 192.168.x, 169.254.x)
- Neu can fetch external: dung allowlist domains
- Disable HTTP redirects hoac gioi han redirect count

```typescript
// DUNG — whitelist domains
const ALLOWED_DOMAINS = ['api.payment.com', 'maps.googleapis.com'];
function isAllowedUrl(url: string): boolean {
  const parsed = new URL(url);
  return ALLOWED_DOMAINS.includes(parsed.hostname) && parsed.protocol === 'https:';
}

// SAI — fetch bat ky URL nao user gui
const response = await fetch(req.body.webhookUrl); // SSRF! Co the truy cap internal services
```

## Anti-Patterns — TUYET DOI KHONG
- KHONG store plain-text passwords
- KHONG log OTP codes, tokens, passwords
- KHONG return stack traces trong API responses
- KHONG trust client-side role/permission checks
- KHONG skip rate limiting tren auth endpoints
- KHONG financial operations NGOAI transaction
- KHONG accept file uploads khong validate mime type
- KHONG hard-code secrets trong source code
- KHONG disable CORS trong production
- KHONG skip SSL cho database connections
