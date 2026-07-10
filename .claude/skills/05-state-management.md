# 05 — State Management (Template)

> Template chung. Xem `PROJECT_CONFIG.md` cho cac stores va query keys cu the cua du an.

## Strategy
- **Server state**: React Query (TanStack Query) — entities, data tu API
- **Client state**: Zustand — auth token, user session, socket connection, UI state
- **Form state**: React Hook Form — registration, entity creation, search filters
- **Navigation state**: expo-router — managed by framework

## React Query Setup

### Query Client
```typescript
// services/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30s
      gcTime: 5 * 60_000, // 5 phut
      retry: 2,
      refetchOnWindowFocus: false, // mobile khong can
    },
  },
});
```

### Query Key Convention
```typescript
// Luon dung array keys co cau truc
['[entities]']                        // tat ca entities
['[entities]', { status: 'active' }]  // entities filtered
['[entities]', entityId]              // single entity
['[sub-entities]', { parentId }]      // sub-entities cua 1 entity
['[resource]']                        // resource info
['[resource]', 'history']             // resource history
['notifications']                     // notification list
```

> Xem `PROJECT_CONFIG.md` cho danh sach query keys cu the cua du an.

### Invalidation Pattern
```typescript
// Sau khi tao [sub-entity] → invalidate [entities] + [sub-entities]
const createSubEntity = useMutation({
  mutationFn: (data) => apiClient.post('/[sub-entities]', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['[entities]'] });
    queryClient.invalidateQueries({ queryKey: ['[sub-entities]'] });
  },
});
```

## Zustand Stores

### Auth Store
```typescript
// stores/auth-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

### Location Store (neu du an co geolocation)
```typescript
// stores/location-store.ts
import { create } from 'zustand';

interface LocationState {
  currentLocation: { lat: number; lng: number } | null;
  isTracking: boolean;
  setLocation: (lat: number, lng: number) => void;
  startTracking: () => void;
  stopTracking: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  isTracking: false,
  setLocation: (lat, lng) => set({ currentLocation: { lat, lng } }),
  startTracking: () => set({ isTracking: true }),
  stopTracking: () => set({ isTracking: false }),
}));
```

### Socket Store (neu du an co realtime)
```typescript
// stores/socket-store.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  connect: (token) => {
    const socket = io(API_URL, { auth: { token } });
    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));
    set({ socket });
  },
  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null, isConnected: false });
  },
}));
```

## Rules
1. Server data → React Query. Client-only data → Zustand.
2. KHONG duplicate server state trong Zustand
3. Query keys phai consistent va co cau truc
4. Invalidate queries sau mutations
5. Zustand stores phai nho, focused — 1 store per concern
6. Persist auth + user preferences voi AsyncStorage
7. KHONG persist server data — React Query cache du dung
