# API Integration

## Overview

The application uses a robust API integration layer built with React Query and Axios. This ensures efficient data fetching, caching, and state management for all API calls.

```mermaid
graph TD
    A[API Layer] --> B[React Query]
    A --> C[Axios Client]
    A --> D[API Services]
    
    B --> B1[Hooks]
    B --> B2[Cache]
    B --> B3[State Management]
    
    C --> C1[Interceptors]
    C --> C2[Error Handling]
    C --> C3[Authentication]
    
    D --> D1[Task Service]
    D --> D2[Project Service]
    D --> D3[User Service]
```

## API Structure

### Service Layer Organization
```
api/
├── apiClient.ts        # Base Axios configuration
├── endpoints.ts        # API endpoint definitions
├── hooks/             # React Query hooks
└── services/          # API service implementations
```

## Core API Services

### Task Management
- `getTasks()` - Fetch paginated tasks
- `getTaskById()` - Get single task details
- `createTask()` - Create new task
- `updateTask()` - Update existing task
- `deleteTask()` - Delete task

### Project Management
- `getProjects()` - Fetch all projects
- `getProjectById()` - Get project details
- `createProject()` - Create new project
- `updateProject()` - Update project
- `deleteProject()` - Delete project

### User Management
- `getUsers()` - Fetch all users
- `getUserById()` - Get user details
- `createUser()` - Create new user
- `updateUser()` - Update user
- `deleteUser()` - Delete user

## React Query Implementation

### Example Hook Implementation
```typescript
export const useTasks = (params?: TaskFilterParams) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => getTasks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Cache Management
```mermaid
sequenceDiagram
    participant C as Component
    participant Q as React Query
    participant A as API
    
    C->>Q: Request Data
    Q->>Q: Check Cache
    alt Data in Cache
        Q->>C: Return Cached Data
    else Cache Miss
        Q->>A: Fetch Data
        A->>Q: Return Data
        Q->>Q: Update Cache
        Q->>C: Return Fresh Data
    end
```

## Error Handling

### Error Types
1. API Errors
2. Network Errors
3. Validation Errors
4. Authentication Errors

### Error Handling Flow
```mermaid
graph TD
    A[API Call] --> B{Error Type?}
    B -->|Network| C[Retry Logic]
    B -->|Auth| D[Redirect to Login]
    B -->|Validation| E[Show Error Message]
    B -->|API| F[Handle API Error]
    
    C --> G[Show Retry UI]
    D --> H[Clear Auth State]
    E --> I[Update Form State]
    F --> J[Show Error Notification]
```

## Authentication

### JWT Token Management
- Token storage in secure localStorage
- Automatic token refresh
- Token inclusion in requests
- Token validation

### Auth Flow
```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant S as Server
    
    U->>A: Login Request
    A->>S: Auth Request
    S->>A: JWT Token
    A->>A: Store Token
    A->>S: API Request + Token
    S->>A: Protected Data
```

## API Endpoint Configuration

### Endpoint Structure
```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  TASKS: {
    BASE: '/tasks',
    DETAIL: (id: number) => `/tasks/${id}`,
  },
  // ... other endpoints
};
```

## Data Fetching Strategies

### Optimistic Updates
For better user experience, the application implements optimistic updates for:
- Task status changes
- Task assignments
- Comments
- Project updates

### Example Optimistic Update
```typescript
const updateTask = useMutation({
  mutationFn: (data: TaskUpdate) => updateTaskApi(data),
  onMutate: async (newData) => {
    await queryClient.cancelQueries(['task', newData.id]);
    const previousData = queryClient.getQueryData(['task', newData.id]);
    queryClient.setQueryData(['task', newData.id], newData);
    return { previousData };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(
      ['task', newData.id],
      context?.previousData
    );
  },
});
```