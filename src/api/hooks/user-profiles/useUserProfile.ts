import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../../services/user-profile.service';
import { UserProfileResponse } from '../../../types/user-profile.types';

export const useUserProfile = (userId: number) => {
  return useQuery<UserProfileResponse, Error>({
    queryKey: ['user-profiles', userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
};