import api from './index';
import { 
  User, 
  UserCreate, 
  UserUpdate,
  UserListResponse,
  UserFilterParams,
  UserProfile
} from '../types/user.types';

const UserService = {
  /**
   * Get paginated list of users with optional filtering
   */
  getUsers: async (page = 1, pageSize = 20, filters?: UserFilterParams): Promise<UserListResponse> => {
    return api.get<UserListResponse>('/users', { 
      page, 
      page_size: pageSize, 
      ...filters 
    });
  },
  
  /**
   * Get a specific user by ID
   */
  getUser: async (userId: number): Promise<User> => {
    return api.get<User>(`/users/${userId}`);
  },
  
  /**
   * Create a new user
   */
  createUser: async (data: UserCreate): Promise<User> => {
    return api.post<User>('/users', data);
  },
  
  /**
   * Update an existing user
   */
  updateUser: async (userId: number, data: UserUpdate): Promise<User> => {
    return api.put<User>(`/users/${userId}`, data);
  },
  
  /**
   * Delete a user
   */
  deleteUser: async (userId: number): Promise<{ message: string }> => {
    return api.del<{ message: string }>(`/users/${userId}`);
  },
  
  /**
   * Get user profile
   */
  getUserProfile: async (userId: number): Promise<UserProfile> => {
    return api.get<UserProfile>(`/users/${userId}/profile`);
  },
  
  /**
   * Update user profile
   */
  updateUserProfile: async (userId: number, data: Partial<UserProfile>): Promise<UserProfile> => {
    return api.put<UserProfile>(`/users/${userId}/profile`, data);
  },
  
  /**
   * Upload profile image
   */
  uploadProfileImage: async (userId: number, file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use raw apiClient for file upload
    const response = await api.post<User>(`/users/${userId}/profile-image`, formData);
    return response;
  }
};

export default UserService;