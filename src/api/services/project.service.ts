import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  ProjectCreate, 
  ProjectUpdate, 
  ProjectResponse,
  ProjectStatistics 
} from '../../types/project.types';

export const getProjects = async (): Promise<ProjectResponse[]> => {
  return apiClient.get(API_ENDPOINTS.PROJECTS.BASE);
};

export const getProjectById = async (id: number): Promise<ProjectResponse> => {
  return apiClient.get(API_ENDPOINTS.PROJECTS.DETAIL(id));
};

export const createProject = async (project: ProjectCreate): Promise<ProjectResponse> => {
  return apiClient.post(API_ENDPOINTS.PROJECTS.BASE, project);
};

export const updateProject = async (id: number, project: ProjectUpdate): Promise<ProjectResponse> => {
  return apiClient.put(API_ENDPOINTS.PROJECTS.DETAIL(id), project);
};

export const deleteProject = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.PROJECTS.DETAIL(id));
};

export const getProjectStatistics = async (): Promise<ProjectStatistics> => {
  return apiClient.get(API_ENDPOINTS.PROJECTS.STATISTICS);
};