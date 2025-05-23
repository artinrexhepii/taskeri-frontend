# Component Structure

## Common Components

### Layout Components
The application uses a consistent layout structure with the following key components:

```mermaid
graph TD
    A[MainLayout] --> B[Header]
    A --> C[Sidebar]
    A --> D[Content Area]
    
    B --> B1[User Menu]
    B --> B2[Notifications]
    B --> B3[Search]
    
    C --> C1[Navigation Items]
    C --> C2[User Info]
    C --> C3[Role Info]
```

### Core UI Components

#### Cards and Containers
- `Card` - Base container component
- `TabPanel` - Container for tab content
- `Modal` - Popup dialog container

#### Interactive Elements
- `Button` variants:
  - Primary
  - Secondary
  - Outline
  - Danger
- `Form` components:
  - Input fields
  - Select dropdowns
  - Date pickers
  - File uploads

#### Data Display
- `Table` - For list views
- `Grid` - For card-based layouts
- `Charts` - For data visualization
- `Badges` - For status indicators

## Feature Components

### Project Management
```mermaid
graph TD
    A[Projects] --> B[ProjectList]
    A --> C[ProjectDetail]
    A --> D[ProjectForm]
    
    B --> B1[ProjectCard]
    B --> B2[ProjectFilters]
    
    C --> C1[ProjectInfo]
    C --> C2[ProjectTasks]
    C --> C3[ProjectMembers]
    
    D --> D1[BasicInfo]
    D --> D2[TeamAssignment]
    D --> D3[Settings]
```

### Task Management
```mermaid
graph TD
    A[Tasks] --> B[TaskBoard]
    A --> C[TaskList]
    A --> D[TaskCalendar]
    
    B --> B1[TaskColumn]
    B --> B2[TaskCard]
    
    C --> C1[TaskTable]
    C --> C2[TaskFilters]
    
    D --> D1[CalendarView]
    D --> D2[TaskModal]
```

### Team Management
```mermaid
graph TD
    A[Teams] --> B[TeamList]
    A --> C[TeamDetail]
    A --> D[MemberManagement]
    
    B --> B1[TeamCard]
    B --> B2[TeamFilters]
    
    C --> C1[TeamInfo]
    C --> C2[MemberList]
    
    D --> D1[AddMember]
    D --> D2[RemoveMember]
    D --> D3[RoleAssignment]
```

## Component Design Patterns

### Composition Pattern
```typescript
interface ComponentProps {
  children: React.ReactNode;
  className?: string;
  // Additional props
}

const Component: React.FC<ComponentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
```

### HOC Pattern
```typescript
const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <WrappedComponent {...props} />;
  };
};
```

### Hook Pattern
```typescript
const useComponentLogic = () => {
  const [state, setState] = useState();
  const { data, isLoading } = useQuery();
  
  const handleAction = useCallback(() => {
    // Logic here
  }, []);
  
  return { state, data, isLoading, handleAction };
};
```

## Styling Approach

The application uses a combination of:
1. Tailwind CSS for utility classes
2. Material-UI for component base
3. Custom CSS modules for component-specific styling

```mermaid
graph TD
    A[Styling] --> B[Tailwind]
    A --> C[Material-UI]
    A --> D[Custom CSS]
    
    B --> B1[Utilities]
    B --> B2[Responsive]
    
    C --> C1[Components]
    C --> C2[Theme]
    
    D --> D1[Modules]
    D --> D2[Global]
```