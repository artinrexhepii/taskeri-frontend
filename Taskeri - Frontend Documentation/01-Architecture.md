# Architecture Overview

## Application Architecture

```mermaid
graph TB
    A[App Entry] --> B[Router]
    B --> C[Auth Context]
    C --> D[Main Layout]
    D --> E[Pages]
    D --> F[Components]
    
    E --> E1[Dashboard]
    E --> E2[Projects]
    E --> E3[Tasks]
    E --> E4[Teams]
    
    F --> F1[Common Components]
    F --> F2[Layout Components]
    F --> F3[Feature Components]
    
    G[API Layer] --> |Data| C
    G --> |Data| E
```

## Directory Structure

### Core Directories
- `src/` - Application source code
  - `api/` - API integration and hooks
  - `components/` - Reusable UI components
  - `context/` - React Context providers
  - `pages/` - Application views/routes
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions and constants

### Key Architectural Decisions

1. **API Integration**
   - Centralized API client using Axios
   - Custom hooks for each API endpoint
   - TypeScript interfaces for API responses

2. **State Management**
   - React Context for global state
   - React Query for server state
   - Local state for component-specific data

3. **Routing**
   - React Router v6
   - Protected routes based on user roles
   - Nested routing for complex views

4. **Component Organization**
   ```mermaid
   graph TD
       A[Components] --> B[Common]
       A --> C[Layout]
       A --> D[Features]
       
       B --> B1[Buttons]
       B --> B2[Forms]
       B --> B3[Cards]
       
       C --> C1[Sidebar]
       C --> C2[Header]
       C --> C3[MainLayout]
       
       D --> D1[ProjectComponents]
       D --> D2[TaskComponents]
       D --> D3[TeamComponents]
   ```

## Role-based Architecture

```mermaid
graph LR
    A[User Roles] --> B[Admin]
    A --> C[Manager]
    A --> D[Basic User]
    
    B --> B1[Full Access]
    B --> B2[Company Management]
    B --> B3[User Management]
    
    C --> C1[Team Management]
    C --> C2[Project Management]
    C --> C3[Task Management]
    
    D --> D1[Task View/Edit]
    D --> D2[Time Tracking]
    D --> D3[Leave Requests]
```

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant H as Custom Hook
    participant A as API Client
    participant S as Server

    U->>C: Interaction
    C->>H: Call Hook
    H->>A: API Request
    A->>S: HTTP Request
    S->>A: Response
    A->>H: Data/Error
    H->>C: Updated State
    C->>U: UI Update
```