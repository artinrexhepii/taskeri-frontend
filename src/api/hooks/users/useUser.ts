import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../../services/user.service';
import { UserResponse } from '../../../types/user.types';

export const useUser = (userId: number) => {
  return useQuery<UserResponse, Error>({
    queryKey: ['users', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId, // Only run if userId is provided
  });
};