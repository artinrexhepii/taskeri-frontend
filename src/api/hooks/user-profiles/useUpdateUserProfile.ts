import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '../../services/user-profile.service';
import { UserProfileUpdate, UserProfileResponse } from '../../../types/user-profile.types';

interface UpdateUserProfileVariables {
  userId: number;
  profileData: UserProfileUpdate;
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UserProfileResponse, Error, UpdateUserProfileVariables>({
    mutationFn: ({ userId, profileData }) => updateUserProfile(userId, profileData),
    onSuccess: (data, variables) => {
      // Invalidate specific user profile query
      queryClient.invalidateQueries({ queryKey: ['user-profiles', variables.userId] });
      
      // If this also affects user data
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
    },
  });
};