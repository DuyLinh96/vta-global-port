# 07 — Realtime: Socket.IO, Push Notifications, Location (Template)

> Template chung. Xem `PROJECT_CONFIG.md` cho events va namespaces cu the cua du an.

## Socket.IO Architecture

### Server Setup
```typescript
// socket/index.ts
import { Server } from 'socket.io';
import { verifyToken } from '../middleware/auth';

export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const user = await verifyToken(token);
      socket.data.user = user;
      next();
    } catch {
      next(new Error('UNAUTHORIZED'));
    }
  });

  // Namespaces — tuy du an
  setupTrackingNamespace(io);  // Location tracking (neu co)
  setupChatNamespace(io);      // Chat (neu co)
  setupNotificationNamespace(io); // Notifications

  return io;
}
```

### Tracking Namespace (neu du an co location tracking)
```typescript
// socket/tracking.ts
const tracking = io.of('/tracking');

tracking.on('connection', (socket) => {
  const userId = socket.data.user.id;

  // User joins entity room
  socket.on('join-room', (entityId: string) => {
    socket.join(`entity:${entityId}`);
  });

  // User sends location update
  socket.on('location-update', async (data: { lat: number; lng: number; entityId: string }) => {
    // Broadcast to other users in room
    socket.to(`entity:${data.entityId}`).emit('user-location', {
      userId,
      lat: data.lat,
      lng: data.lng,
      timestamp: Date.now(),
    });

    // Cache in Redis (TTL 30s)
    await redis.setex(`user:location:${userId}`, 30, JSON.stringify({ lat: data.lat, lng: data.lng }));

    // Persist to DB every 30s (debounced)
    await updateUserLocation(userId, data.lat, data.lng);
  });

  // Status changes
  socket.on('status-update', (data: { entityId: string; status: string }) => {
    tracking.to(`entity:${data.entityId}`).emit('status-changed', {
      entityId: data.entityId,
      status: data.status,
    });
  });

  socket.on('disconnect', () => {
    // Mark user offline after timeout
  });
});
```

### Chat Namespace
```typescript
// socket/chat.ts
const chat = io.of('/chat');

chat.on('connection', (socket) => {
  socket.on('join-chat', (roomId: string) => {
    socket.join(`chat:${roomId}`);
  });

  socket.on('send-message', async (data: { roomId: string; content: string }) => {
    const message = await saveMessage({
      roomId: data.roomId,
      senderId: socket.data.user.id,
      content: data.content,
    });

    chat.to(`chat:${data.roomId}`).emit('new-message', message);

    // Send push notification to offline users
    await sendPushToOfflineUsers(data.roomId, socket.data.user.id, data.content);
  });
});
```

### Client Setup (React Native)
```typescript
// services/socket.ts
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

class SocketService {
  private tracking: Socket | null = null;
  private chat: Socket | null = null;

  connect() {
    const token = useAuthStore.getState().token;
    if (!token) return;

    this.tracking = io(`${API_URL}/tracking`, { auth: { token }, autoConnect: true });
    this.chat = io(`${API_URL}/chat`, { auth: { token }, autoConnect: true });
  }

  joinRoom(entityId: string) {
    this.tracking?.emit('join-room', entityId);
    this.chat?.emit('join-chat', entityId);
  }

  sendLocation(entityId: string, lat: number, lng: number) {
    this.tracking?.emit('location-update', { entityId, lat, lng });
  }

  sendMessage(roomId: string, content: string) {
    this.chat?.emit('send-message', { roomId, content });
  }

  onUserLocation(callback: (data: { lat: number; lng: number }) => void) {
    this.tracking?.on('user-location', callback);
  }

  onNewMessage(callback: (message: Message) => void) {
    this.chat?.on('new-message', callback);
  }

  onStatusChanged(callback: (data: { entityId: string; status: string }) => void) {
    this.tracking?.on('status-changed', callback);
  }

  disconnect() {
    this.tracking?.disconnect();
    this.chat?.disconnect();
  }
}

export const socketService = new SocketService();
```

## Push Notifications (FCM)

### Server — Send notification
```typescript
// services/notification.ts
import admin from 'firebase-admin';

export async function sendPushNotification(
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data,
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default' } } },
    });
  } catch (err) {
    // Token invalid → remove from DB
    if (err.code === 'messaging/registration-token-not-registered') {
      await removeInvalidToken(fcmToken);
    }
  }
}

// Notification templates — tuy du an
// Xem PROJECT_CONFIG.md cho danh sach notification types cu the
export const notifications = {
  entityCreated: (name: string) => ({
    title: 'Muc moi!',
    body: `${name} da tao muc moi`,
  }),
  statusChanged: (entityName: string, status: string) => ({
    title: 'Cap nhat trang thai',
    body: `${entityName} da chuyen sang ${status}`,
  }),
};
```

### Client — Register for notifications
```typescript
// services/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { apiClient } from './api';

export async function registerForPushNotifications() {
  if (!Device.isDevice) return;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await apiClient.put('/users/me/fcm-token', { token });
  return token;
}

// Handle notification tap
Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;
  if (data.entityId) {
    // Navigate to entity detail
    router.push(`/[entities]/${data.entityId}`);
  }
});
```

## Location Tracking (neu du an can)

### Background Location
```typescript
// services/location.ts
import * as Location from 'expo-location';
import { socketService } from './socket';
import { useLocationStore } from '@/stores/location-store';

export async function startLocationTracking(entityId: string) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return;

  // Background permission neu can
  const bgStatus = await Location.requestBackgroundPermissionsAsync();

  useLocationStore.getState().startTracking();

  // Update location moi 5 giay
  await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 10, // minimum 10m movement
    },
    (location) => {
      const { latitude, longitude } = location.coords;
      useLocationStore.getState().setLocation(latitude, longitude);
      socketService.sendLocation(entityId, latitude, longitude);
    },
  );
}

export async function stopLocationTracking() {
  useLocationStore.getState().stopTracking();
}
```

## Socket Events Reference — Template
| Event | Direction | Namespace | Description |
|-------|-----------|-----------|-------------|
| `join-room` | Client→Server | /tracking | User join entity room |
| `location-update` | Client→Server | /tracking | User gui vi tri moi |
| `user-location` | Server→Client | /tracking | Broadcast vi tri user |
| `status-changed` | Server→Client | /tracking | Trang thai entity thay doi |
| `join-chat` | Client→Server | /chat | Join chat room |
| `send-message` | Client→Server | /chat | Gui tin nhan |
| `new-message` | Server→Client | /chat | Tin nhan moi |

> Xem `PROJECT_CONFIG.md` cho danh sach events cu the cua du an.

## Rules
1. Socket.IO authentication qua token — KHONG public
2. Join room TRUOC khi listen events
3. Client tu reconnect — dung Socket.IO built-in reconnection
4. Location updates moi 5s khi active, dung khi hoan thanh
5. Push notifications cho offline users — KHONG spam online users
6. Redis cache locations (TTL 30s)
7. Persist location to DB moi 30s (debounced, KHONG moi 5s)
