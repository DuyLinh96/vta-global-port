# 04 — React Native & React Patterns (Template)

> Template chung cho React Native (Mobile) va React (Admin). Xem `PROJECT_CONFIG.md` cho screens va components cu the.

## React Native (Mobile App)

### Screen Component Pattern
```tsx
// app/([role])/[feature]/create.tsx — Tao [entity] moi
import { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateEntity } from '@/hooks/use-[entities]';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { styles } from './styles';

export default function CreateEntityScreen() {
  const router = useRouter();
  const createEntity = useCreateEntity();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Loi', 'Vui long nhap thong tin bat buoc');
      return;
    }
    try {
      await createEntity.mutateAsync({ title, description });
      router.back();
    } catch (err) {
      Alert.alert('Loi', 'Khong the tao moi');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Input label="Tieu de" value={title} onChangeText={setTitle} />
      <Input label="Mo ta" value={description} onChangeText={setDescription} />
      <Button title="TAO MOI" onPress={handleSubmit} loading={createEntity.isPending} />
    </ScrollView>
  );
}
```

### Hook Pattern
```typescript
// hooks/use-[entities].ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import type { Entity, CreateEntityInput, SearchFilters } from '@/types/[entity]';

export function useEntities(filters?: SearchFilters) {
  return useQuery({
    queryKey: ['[entities]', filters],
    queryFn: () => apiClient.get<{ data: Entity[]; total: number }>('/[entities]', { params: filters }),
  });
}

export function useEntity(id: string) {
  return useQuery({
    queryKey: ['[entities]', id],
    queryFn: () => apiClient.get<{ data: Entity }>(`/[entities]/${id}`),
    enabled: !!id,
  });
}

export function useCreateEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEntityInput) => apiClient.post('/[entities]', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[entities]'] });
    },
  });
}
```

### Component Pattern
```tsx
// components/[Entity]Card.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '@/utils/format';
import type { Entity } from '@/types/[entity]';
import { styles } from './styles';

interface EntityCardProps {
  item: Entity;
  onPress: (id: string) => void;
}

export function EntityCard({ item, onPress }: EntityCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item.id)}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.info}>
        <Text>{formatDate(item.createdAt)}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );
}
```

### Navigation (expo-router)
```tsx
// app/([role])/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RoleLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Trang chu', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="[feature-1]" options={{ title: '[Tab 1]', tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }} />
      <Tabs.Screen name="[feature-2]" options={{ title: '[Tab 2]', tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Ca nhan', tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}
```

## React (Admin Dashboard)

### Page Pattern
```tsx
// pages/[Entity]Management.tsx
import { Table, Button, Tag, Space } from 'antd';
import { useEntities, useApproveEntity } from '@/hooks/use[Entities]';
import type { Entity } from '@/types';

export default function EntityManagement() {
  const { data, isLoading } = useEntities();
  const approveEntity = useApproveEntity();

  const columns = [
    { title: 'Ten', dataIndex: 'name' },
    { title: 'Email / SDT', dataIndex: 'contact' },
    { title: 'Trang thai', dataIndex: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'orange'}>{s}</Tag> },
    { title: 'Hanh dong', render: (_, record) => (
      <Space>
        <Button onClick={() => approveEntity.mutate(record.id)}>Duyet</Button>
      </Space>
    )},
  ];

  return <Table columns={columns} dataSource={data?.data} loading={isLoading} rowKey="id" />;
}
```

### Rules
1. Screens dung expo-router file-based routing
2. Data fetching qua React Query hooks — KHONG fetch trong component
3. Components nhan props ro rang — co TypeScript interface
4. Khong inline styles cho repeated components — dung StyleSheet
5. FlatList cho lists, KHONG ScrollView
6. Skeleton loading thay spinner
7. UI text theo ngon ngu cua du an (xem PROJECT_CONFIG.md)
