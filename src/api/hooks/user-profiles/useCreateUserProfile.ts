import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserProfile } from '../../services/user-profile.service';
import { UserProfileCreate, UserProfileResponse } from '../../../types/user-profile.types';

export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UserProfileResponse, Error, UserProfileCreate>({
    mutationFn: (profileData) => createUserProfile(profileData),
    onSuccess: (data) => {
      // Invalidate the user profile query if user ID is available
      if (data.user_id) {
        queryClient.invalidateQueries({ queryKey: ['user-profiles', data.user_id] });
        queryClient.invalidateQueries({ queryKey: ['users', data.user_id] });
      }
    },
  });
};