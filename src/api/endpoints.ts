export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
      LOGIN: '/token',
      REFRESH: '/token/refresh',
      REGISTER_TENANT: '/tenant-users/',
    },
    
    // User endpoints
    USERS: {
      BASE: '/users',
      DETAIL: (id: number | string) => `/users/${id}`,
      PROFILE: (id: number) => `/users/${id}/profile`,
    },
    
    // Task endpoints
    TASKS: {
      BASE: '/tasks/',
      DETAIL: (id: number) => `/tasks/${id}`,
      DETAILS: (id: number) => `/tasks/${id}/details`,
      BY_PROJECT: (projectId: number) => `/tasks/project/${projectId}`,
      BY_USER: (userId: number) => `/tasks/user/${userId}`,
      STATISTICS: '/tasks/statistics',
    },
    
    // Project endpoints
    PROJECTS: {
      BASE: '/projects/',
      DETAIL: (id: number) => `/projects/${id}`,
      STATISTICS: '/projects/statistics',
    },
    
    // Team endpoints
    TEAMS: {
      BASE: '/teams',
      DETAIL: (id: number) => `/teams/${id}`,
    },
    
    // Department endpoints
    DEPARTMENTS: {
      BASE: '/departments',
      DETAIL: (id: number) => `/departments/${id}`,
    },
    
    // Comment endpoints
    COMMENTS: {
      BASE: '/comments',
      DETAIL: (id: number) => `/comments/${id}`,
      BY_TASK: (taskId: number) => `/comments/task/${taskId}`,
    },
    
    // File attachment endpoints
    ATTACHMENTS: {
      BASE: '/attachments/',
      DETAIL: (id: number) => `/attachments/${id}`,
      BY_TASK: (taskId: number) => `/attachments/task/${taskId}`,
    },
    
    // Time logging endpoints
    TIME_LOGS: {
      BASE: '/time-logs/',
      DETAIL: (id: number) => `/time-logs/${id}`,
      BY_TASK: (taskId: number) => `/time-logs/task/${taskId}`,
      BY_USER: (userId: number) => `/time-logs/user/${userId}`,
    },
    
    // Attendance endpoints
    ATTENDANCE: {
      BASE: '/attendance',
      DETAIL: (id: number) => `/attendance/${id}`,
      CHECK_IN: '/attendance/check-in',
      CHECK_OUT: '/attendance/check-out',
    },
    
    // Leave request endpoints
    LEAVE_REQUESTS: {
      BASE: '/leave-requests/',
      DETAIL: (id: number) => `/leave-requests/${id}`,
      BY_USER: (userId: number) => `/leave-requests/user/${userId}`,
    },
    
    // Role endpoints
    ROLES: {
      BASE: '/roles',
      DETAIL: (id: number) => `/roles/${id}`,
    },
    
    // Permission endpoints
    PERMISSIONS: {
      BASE: '/permissions',
      DETAIL: (id: number) => `/permissions/${id}`,
    },
    
    // User roles endpoints
    USER_ROLES: {
      USER_ROLES: (userId: number) => `/user-roles/${userId}/roles`,
      ASSIGN_ROLE: (userId: number, roleId: number) => `/user-roles/${userId}/roles/${roleId}`,
    },
    
    // Role permissions endpoints
    ROLE_PERMISSIONS: {
      ROLE_PERMISSIONS: (roleId: number) => `/role-permissions/${roleId}/permissions`,
      ADD_PERMISSION: (roleId: number, permissionId: number) => 
        `/role-permissions/${roleId}/permissions/${permissionId}`,
    },
    
    // Company endpoints
    COMPANIES: {
      BASE: '/companies/',
      DETAIL: (id: number) => `/companies/${id}`,
      SETTINGS: (id: number) => `/companies/${id}/settings`,
    },
    
    // Invoice endpoints
    INVOICES: {
      BASE: '/invoices/',
      DETAIL: (id: number) => `/invoices/${id}`,
    },
  
    // User project endpoints
    USER_PROJECTS: {
      BASE: '/project-users',
      PROJECT_USERS: (projectId: number) => `/project-users/${projectId}/users`,
      USER_PROJECTS: (userId: number) => `/project-users/users/${userId}/projects`,
      MY_PROJECTS: '/project-users/me/projects',
    },
  
    // Notification endpoints
    NOTIFICATIONS: {
      BASE: '/notifications',
      MARK_READ: (id: number) => `/notifications/${id}/read`,
    },

    TENANTS: {
        BASE: '/tenants',
        DETAIL: (id: number) => `/tenants/${id}`,
        USERS: (tenantId: number) => `/tenants/${tenantId}/users`,
        ADD_USER: (tenantId: number) => `/tenants/${tenantId}/users`,
    },
  };