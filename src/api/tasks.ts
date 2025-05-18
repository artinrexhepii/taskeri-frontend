import api from './index';
import { 
  Task, 
  TaskCreate, 
  TaskUpdate, 
  TaskDetail, 
  TaskListResponse,
  TaskFilterParams,
  TaskStatistics
} from '../types/task.types';

const TaskService = {
  /**
   * Get paginated list of tasks with optional filtering
   */
  getTasks: async (page = 1, pageSize = 20, filters?: TaskFilterParams): Promise<TaskListResponse> => {
    return api.get<TaskListResponse>('/tasks', { 
      page, 
      page_size: pageSize, 
      ...filters 
    });
  },
  
  /**
   * Get a specific task by ID
   */
  getTask: async (taskId: number): Promise<TaskDetail> => {
    return api.get<TaskDetail>(`/tasks/${taskId}`);
  },
  
  /**
   * Create a new task
   */
  createTask: async (taskData: TaskCreate): Promise<Task> => {
    return api.post<Task>('/tasks', taskData);
  },
  
  /**
   * Update an existing task
   */
  updateTask: async (taskId: number, taskData: TaskUpdate): Promise<Task> => {
    return api.put<Task>(`/tasks/${taskId}`, taskData);
  },
  
  /**
   * Delete a task
   */
  deleteTask: async (taskId: number): Promise<{ message: string }> => {
    return api.del<{ message: string }>(`/tasks/${taskId}`);
  },
  
  /**
   * Update task status
   */
  updateTaskStatus: async (taskId: number, status: string): Promise<Task> => {
    return api.patch<Task>(`/tasks/${taskId}/status`, { status });
  },
  
  /**
   * Get tasks for a specific project
   */
  getProjectTasks: async (projectId: number): Promise<Task[]> => {
    return api.get<Task[]>(`/tasks/project/${projectId}`);
  },
  
  /**
   * Get tasks assigned to a specific user
   */
  getUserTasks: async (userId: number): Promise<Task[]> => {
    return api.get<Task[]>(`/tasks/user/${userId}`);
  },
  
  /**
   * Assign users to a task
   */
  assignUsers: async (taskId: number, userIds: number[]): Promise<Task> => {
    return api.post<Task>(`/tasks/${taskId}/assign`, { user_ids: userIds });
  },
  
  /**
   * Get task statistics
   */
  getTaskStatistics: async (): Promise<TaskStatistics> => {
    return api.get<TaskStatistics>('/tasks/statistics');
  }
};

export default TaskService;