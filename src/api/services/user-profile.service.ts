import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  UserProfileCreate, 
  UserProfileUpdate, 
  UserProfileResponse 
} from '../../types/user-profile.types';

export const getUserProfile = async (userId: number): Promise<UserProfileResponse> => {
  return apiClient.get(`/profiles/${userId}`);
};

export const createUserProfile = async (profile: UserProfileCreate): Promise<UserProfileResponse> => {
  return apiClient.post('/profiles', profile);
};

export const updateUserProfile = async (userId: number, profile: UserProfileUpdate): Promise<UserProfileResponse> => {
  return apiClient.put(`/profiles/${userId}`, profile);
};

export const deleteUserProfile = async (userId: number): Promise<void> => {
  await apiClient.delete(`/profiles/${userId}`);
};