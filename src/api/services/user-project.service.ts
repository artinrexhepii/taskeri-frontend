import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { UserResponse } from '../../types/user.types';
import { ProjectResponse } from '../../types/project.types';

export const getProjectUsers = async (projectId: number): Promise<UserResponse[]> => {
  return apiClient.get(API_ENDPOINTS.USER_PROJECTS.PROJECT_USERS(projectId));
};

export const getUserProjects = async (userId: number): Promise<ProjectResponse[]> => {
  return apiClient.get(API_ENDPOINTS.USER_PROJECTS.USER_PROJECTS(userId));
};

export const getMyProjects = async (): Promise<ProjectResponse[]> => {
  return apiClient.get(API_ENDPOINTS.USER_PROJECTS.MY_PROJECTS);
};

export const assignUserToProject = async (userId: number, projectId: number): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.USER_PROJECTS.BASE, { user_id: userId, project_id: projectId });
};

export const removeUserFromProject = async (userId: number, projectId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.USER_PROJECTS.BASE, { 
    data: { user_id: userId, project_id: projectId } 
  });
};