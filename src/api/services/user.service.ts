import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  UserCreate, 
  UserUpdate, 
  UserResponse,
  UserDetails
} from '../../types/user.types';

export const getUsers = async (): Promise<UserResponse[]> => {
  return apiClient.get(API_ENDPOINTS.USERS.BASE);
};

export const getUserById = async (id: number): Promise<UserResponse> => {
  return apiClient.get(API_ENDPOINTS.USERS.DETAIL(id));
};

export const createUser = async (user: UserCreate): Promise<UserResponse> => {
  return apiClient.post(`${API_ENDPOINTS.USERS.BASE}/create`, user);
};

export const updateUser = async (id: number, user: UserUpdate): Promise<UserResponse> => {
  return apiClient.put(API_ENDPOINTS.USERS.DETAIL(id), user);
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.USERS.DETAIL(id));
};