# Authentication & Authorization

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Auth Context
    participant AP as API
    participant S as Storage

    U->>A: Login Attempt
    A->>AP: Login Request
    AP->>A: JWT Token
    A->>S: Store Token
    A->>U: Redirect to Dashboard

    Note over U,S: Token stored in secure storage
```

## Role-Based Access Control

### User Roles
1. **Admin (role_id: 1)**
   - Full system access
   - Company management
   - User management
   - All features available

2. **Manager (role_id: 2)**
   - Team management
   - Project management
   - Department oversight
   - Limited administrative features

3. **Basic User (role_id: 3)**
   - Task management
   - Time tracking
   - Personal dashboard
   - Limited view access

```mermaid
graph TD
    A[Access Control] --> B[Admin]
    A --> C[Manager]
    A --> D[Basic User]
    
    B --> B1[Company Management]
    B --> B2[User Administration]
    B --> B3[System Settings]
    B --> B4[All Features]
    
    C --> C1[Team Management]
    C --> C2[Project Oversight]
    C --> C3[Department Management]
    C --> C4[Report Access]
    
    D --> D1[Task Operations]
    D --> D2[Time Tracking]
    D --> D3[Personal Profile]
    D --> D4[Basic Features]
```

## Implementation

### Auth Context
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

### Protected Routes
```mermaid
graph TD
    A[Route Access] --> B{Is Authenticated?}
    B -->|Yes| C{Check Role}
    B -->|No| D[Redirect to Login]
    
    C -->|Admin| E[Full Access]
    C -->|Manager| F[Limited Access]
    C -->|Basic| G[Basic Access]
```

### Permission Matrix

| Feature | Admin | Manager | Basic User |
|---------|-------|---------|------------|
| Dashboard | ✓ | ✓ | ✓ |
| Projects | ✓ | ✓ | View Only |
| Teams | ✓ | ✓ | View Only |
| Users | ✓ | ✗ | ✗ |
| Settings | ✓ | ✗ | ✗ |
| Tasks | ✓ | ✓ | ✓ |
| Time Tracking | ✓ | ✓ | ✓ |
| Reports | ✓ | ✓ | Self Only |
| Invoices | ✓ | ✗ | ✗ |

## Security Measures

### Token Management
1. JWT Token Storage
2. Token Refresh Mechanism
3. Secure Headers

### API Security
1. Request Authentication
2. CORS Configuration
3. Rate Limiting

```mermaid
sequenceDiagram
    participant C as Client
    participant M as Middleware
    participant A as API
    
    C->>M: Request with Token
    M->>M: Validate Token
    M->>M: Check Permissions
    M->>A: Forward Request
    A->>C: Response
```

## Error Handling

### Authentication Errors
- Invalid credentials
- Token expiration
- Unauthorized access

### Authorization Errors
- Insufficient permissions
- Role-based restrictions
- Feature access denial

```mermaid
graph TD
    A[Error Handler] --> B{Error Type}
    B --> C[Auth Error]
    B --> D[Permission Error]
    B --> E[Network Error]
    
    C --> C1[Redirect to Login]
    D --> D1[Show Error Message]
    E --> E1[Retry Mechanism]
```