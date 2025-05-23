# State Management

## Overview

Taskeri uses a combination of Context API and React Query for state management. This hybrid approach allows for efficient handling of both server and client state.

```mermaid
graph TD
    A[State Management] --> B[Server State]
    A --> C[Client State]
    A --> D[UI State]
    
    B --> B1[React Query]
    B --> B2[Cache Management]
    
    C --> C1[Context API]
    C --> C2[Local Storage]
    
    D --> D1[Component State]
    D --> D2[Form State]
```

## Context Management

### Available Contexts

1. **AuthContext**
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

2. **RoleContext**
```typescript
interface RoleContextType {
  roles: Role[];
  userRole: Role | null;
  getRoleName: (roleId: number) => string;
  hasPermission: (permission: string) => boolean;
}
```

3. **NotificationContext**
```typescript
interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message: string) => void;
  hideNotification: () => void;
}
```

4. **ThemeContext**
```typescript
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
```

## State Organization

### Server State (React Query)
```mermaid
flowchart TD
    A[React Query] --> B[Queries]
    A --> C[Mutations]
    A --> D[Cache]
    
    B --> B1[Data Fetching]
    B --> B2[Auto Refresh]
    B --> B3[Error Handling]
    
    C --> C1[Data Updates]
    C --> C2[Optimistic Updates]
    C --> C3[Rollbacks]
    
    D --> D1[Cache Storage]
    D --> D2[Cache Invalidation]
    D --> D3[Cache Updates]
```

### Local State Management

#### Component-Level State
- Form state
- UI interactions
- Loading states
- Error states

#### Application-Level State
- Authentication state
- User preferences
- Theme settings
- Role-based permissions

## State Flow Patterns

### Authentication Flow
```mermaid
sequenceDiagram
    participant U as User
    participant AC as AuthContext
    participant RQ as React Query
    participant API as API
    
    U->>AC: Login
    AC->>API: Send Credentials
    API->>AC: Return Token
    AC->>AC: Store Token
    AC->>RQ: Invalidate Queries
    RQ->>API: Refetch Data
    API->>RQ: Return Fresh Data
    RQ->>U: Update UI
```

### Data Management Flow
```mermaid
sequenceDiagram
    participant C as Component
    participant RQ as React Query
    participant API as API
    participant CTX as Context
    
    C->>RQ: Request Data
    RQ->>RQ: Check Cache
    alt Cache Hit
        RQ->>C: Return Cached Data
    else Cache Miss
        RQ->>API: Fetch Data
        API->>RQ: Return Data
        RQ->>RQ: Update Cache
        RQ->>C: Return Fresh Data
    end
    C->>CTX: Update UI State
```

## Best Practices

### State Updates
1. **Atomic Updates**
   - Update smallest possible state unit
   - Avoid nested state updates
   - Use immutable update patterns

2. **Optimistic Updates**
   - Update UI immediately
   - Rollback on error
   - Show loading states

3. **Cache Management**
   - Define appropriate stale times
   - Implement cache invalidation
   - Handle cache updates

### Example Implementation

```typescript
// Task list with optimistic updates
export const useTaskList = () => {
  const queryClient = useQueryClient();

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const updateTask = useMutation({
    mutationFn: updateTaskApi,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries(['tasks']);
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.map(task => 
          task.id === newTask.id ? { ...task, ...newTask } : task
        )
      );
      
      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  return { tasks, updateTask };
};
```