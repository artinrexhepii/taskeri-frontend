/**
 * Application-wide constants
 */

// API constants
export const API = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  TIMEOUT: 15000, // 15 seconds
};

// Authentication constants
export const AUTH = {
  TOKEN_KEY: 'access_token',
  TENANT_KEY: 'tenant_id',
  TOKEN_EXPIRY: 'token_expiry',
};

// Task status constants mapped to CSS classes
export const TASK_STATUS_STYLES = {
  'To Do': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Technical Review': 'bg-purple-100 text-purple-800',
  'Done': 'bg-green-100 text-green-800',
};

// Task priority constants mapped to CSS classes
export const TASK_PRIORITY_STYLES = {
  'Low': 'bg-gray-100 text-gray-800',
  'Medium': 'bg-blue-100 text-blue-800',
  'High': 'bg-red-100 text-red-800',
};

// Project status constants mapped to CSS classes
export const PROJECT_STATUS_STYLES = {
  'Not Started': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Completed': 'bg-green-100 text-green-800',
  'On Hold': 'bg-red-100 text-red-800',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
};

// Date formats
export const DATE_FORMATS = {
  API_DATE: 'YYYY-MM-DD',
  DISPLAY_DATE: 'MMM D, YYYY',
  DISPLAY_DATETIME: 'MMM D, YYYY, h:mm A',
};

// Default timezone
export const DEFAULT_TIMEZONE = 'UTC';

// Routes paths for easy reference
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  TEAM: '/team',
  SETTINGS: '/settings',
  PROFILE: '/profile',
};

// File upload constants
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ],
  ERROR_MESSAGES: {
    SIZE: 'File size exceeds 5MB limit',
    TYPE: 'File type not supported',
  },
};

// Theme colors for charts and UI elements
export const THEME_COLORS = {
  PRIMARY: '#3b82f6', // blue-500
  SECONDARY: '#6b7280', // gray-500
  SUCCESS: '#10b981', // green-500
  DANGER: '#ef4444', // red-500
  WARNING: '#f59e0b', // amber-500
  INFO: '#3b82f6', // blue-500
  LIGHT: '#f3f4f6', // gray-100
  DARK: '#1f2937', // gray-800
  CHART_COLORS: [
    '#3b82f6', // blue-500
    '#ef4444', // red-500
    '#10b981', // green-500
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
    '#6b7280', // gray-500
    '#ec4899', // pink-500
    '#14b8a6', // teal-500
  ],
};

// Time-related constants
export const TIME_CONSTANTS = {
  MILLISECONDS_IN_SECOND: 1000,
  SECONDS_IN_MINUTE: 60,
  MINUTES_IN_HOUR: 60,
  HOURS_IN_DAY: 24,
  DAYS_IN_WEEK: 7,
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
};