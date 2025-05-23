import { lazy } from 'react';
import LeaveRequestForm from '../pages/leave-requests/LeaveRequestForm';

// Lazy load page components
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/RegisterPage'));
// const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const ProjectList = lazy(() => import('../pages/projects/ProjectList'));
const ProjectDetails = lazy(() => import('../pages/projects/ProjectDetail'));
const ProjectForm = lazy(() => import('../pages/projects/ProjectForm'));
const TaskList = lazy(() => import('../pages/tasks/TaskList'));
const TaskBoard = lazy(() => import('../pages/tasks/TaskBoard'));
const TaskCalendar = lazy(() => import('../pages/tasks/TaskCalendar'));
const TaskDetails = lazy(() => import('../pages/tasks/TaskDetail'));
const TaskForm = lazy(() => import('../pages/tasks/TaskForm'));
const TeamList = lazy(() => import('../pages/teams/TeamList'));
const TeamDetails = lazy(() => import('../pages/teams/TeamDetail'));
const UserList = lazy(() => import('../pages/users/UserList'));
const UserProfile = lazy(() => import('../pages/users/UserProfile'));
const TenantUsers = lazy(() => import('../pages/users/tenant/TenantUsersPage'));
const TimeTracking = lazy(() => import('../pages/time-tracking/TimeTracking'));
const Reports = lazy(() => import('../pages/reports/Reports'));
const Settings = lazy(() => import('../pages/settings/Settings'));
const FileAttachments = lazy(() => import('../pages/file-attachments/FileAttachments'));
const RegisterCompanyPage = lazy(() => import('../pages/company/RegisterCompanyPage'));
const RegisterDepartmentPage = lazy(() => import('../pages/department/RegisterDepartmentPage'));
const RegisterTeamPage = lazy(() => import('../pages/team/RegisterTeamPage'));
const RegisterUserPage = lazy(() => import('../pages/users/RegisterUserPage'));
const LeaveRequests = lazy(() => import('../pages/leave-requests/LeaveRequestBase'))
const Invoices = lazy(() => import('../pages/invoices/InvoiceNav'))
const Companies = lazy(() => import('../pages/company/CompanyList'))
const CompanyDepartmentsPage = lazy(() => import('../pages/company/CompanyDepartments'));
const RolePermissionPage = lazy(() => import('../pages/role-permissions/RolePermissions'));


export interface Route {
  path: string;
  component: React.LazyExoticComponent<any>;
  protected?: boolean;
}

export interface Routes {
  [key: string]: Route;
}

export const routes: Routes = {
  // Auth routes
  login: {
    path: '/login',
    component: Login
  },
  register: {
    path: '/register',
    component: Register
  },
//   forgotPassword: {
//     path: '/forgot-password',
//     component: ForgotPassword
//   },

  // Protected routes
  dashboard: {
    path: '/',
    component: Dashboard,
    protected: true
  },

  // Project routes
  projects: {
    path: '/projects',
    component: ProjectList,
    protected: true
  },
  createProject: {
    path: '/projects/new',
    component: ProjectForm,
    protected: true
  },
  editProject: {
    path: '/projects/:id/edit',
    component: ProjectForm,
    protected: true
  },
  projectDetails: {
    path: '/projects/:id',
    component: ProjectDetails,
    protected: true
  },

  // Task routes
  tasks: {
    path: '/tasks',
    component: TaskBoard,
    protected: true
  },
  taskList: {
    path: '/tasks/list',
    component: TaskList,
    protected: true
  },
  taskCalendar: {
    path: '/tasks/calendar',
    component: TaskCalendar,
    protected: true
  },
  createTask: {
    path: '/tasks/new',
    component: TaskForm,
    protected: true
  },
  editTask: {
    path: '/tasks/:id/edit',
    component: TaskForm,
    protected: true
  },
  taskDetails: {
    path: '/tasks/:id',
    component: TaskDetails,
    protected: true
  },

  // Team routes
  teams: {
    path: '/teams',
    component: TeamList,
    protected: true
  },
  teamDetails: {
    path: '/teams/:id',
    component: TeamDetails,
    protected: true
  },

  // User routes
  users: {
    path: '/users',
    component: UserList,
    protected: true
  },
  userProfile: {
    path: '/users/:id',
    component: UserProfile,
    protected: true
  },
  tenantUsers: {
    path: '/company/users',
    component: TenantUsers,
    protected: true
  },

  // Time tracking routes
  timeTracking: {
    path: '/time-tracking',
    component: TimeTracking,
    protected: true
  },

  // Report routes
  reports: {
    path: '/reports',
    component: Reports,
    protected: true
  },

  // Settings routes
  settings: {
    path: '/settings',
    component: Settings,
    protected: true
  },

  // File attachment routes
  attachments: {
    path: '/attachments',
    component: FileAttachments,
    protected: true
  },

  // Registration routes
  registerCompany: {
    path: '/register-company',
    component: RegisterCompanyPage
  },
  registerDepartment: {
    path: '/register-department',
    component: RegisterDepartmentPage
  },
  registerTeam: {
    path: '/register-team',
    component: RegisterTeamPage
  },
  registerUser: {
    path: '/register-user',
    component: RegisterUserPage
  },
  // Leave request routes
  leaveRequests:{
    path: '/leave-requests',
    component: LeaveRequests,
    protected: true
  },

  invoices:{
    path: '/invoices',
    component: Invoices,
    protected: true
  },

  companies:{
    path: '/companies',
    component: Companies,
    protected: true
  },

  companyDepartments: {
  path: '/companies/:companyId/departments',
  component: CompanyDepartmentsPage,
  protected: true
},

 rolePermissions: {
  path: '/rolepermissions',
  component: RolePermissionPage,
  protected: true
 }

};

export const getRoute = (key: keyof Routes): Route => routes[key];
export const getPath = (key: keyof Routes): string => routes[key].path;