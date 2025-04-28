import api from './index';
import { 
  Project, 
  ProjectCreate, 
  ProjectUpdate,
  ProjectDetailResponse,
  ProjectListResponse,
  ProjectFilterParams
} from '../types/project.types';

const ProjectService = {
  /**
   * Get paginated list of projects with optional filtering
   */
  getProjects: async (page = 1, pageSize = 20, filters?: ProjectFilterParams): Promise<ProjectListResponse> => {
    return api.get<ProjectListResponse>('/projects', { 
      page, 
      page_size: pageSize, 
      ...filters 
    });
  },
  
  /**
   * Get a specific project by ID
   */
  getProject: async (projectId: number): Promise<ProjectDetailResponse> => {
    return api.get<ProjectDetailResponse>(`/projects/${projectId}`);
  },
  
  /**
   * Create a new project
   */
  createProject: async (data: ProjectCreate): Promise<Project> => {
    return api.post<Project>('/projects', data);
  },
  
  /**
   * Update an existing project
   */
  updateProject: async (projectId: number, data: ProjectUpdate): Promise<Project> => {
    return api.put<Project>(`/projects/${projectId}`, data);
  },
  
  /**
   * Delete a project
   */
  deleteProject: async (projectId: number): Promise<{ message: string }> => {
    return api.del<{ message: string }>(`/projects/${projectId}`);
  },
  
  /**
   * Update project status
   */
  updateProjectStatus: async (projectId: number, status: string): Promise<Project> => {
    return api.patch<Project>(`/projects/${projectId}/status`, { status });
  },
  
  /**
   * Add members to a project
   */
  addMembersToProject: async (projectId: number, userIds: number[]): Promise<Project> => {
    return api.post<Project>(`/projects/${projectId}/members`, { user_ids: userIds });
  },
  
  /**
   * Remove members from a project
   */
  removeMembersFromProject: async (projectId: number, userIds: number[]): Promise<Project> => {
    return api.del<Project>(`/projects/${projectId}/members`, { user_ids: userIds });
  }
};

export default ProjectService;