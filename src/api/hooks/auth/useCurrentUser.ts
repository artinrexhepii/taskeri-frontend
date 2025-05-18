import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '../../services/auth.service';
import { UserDetails } from '../../../types/user.types';

export const useCurrentUser = () => {
  const queryClient = useQueryClient();
  
  return useQuery<UserDetails, Error>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    meta: {
      onError: (error: Error) => {
        if (error.message.includes('No authentication token found') || 
            (error instanceof Error && error.message.includes('401'))) {
          queryClient.clear();
        }
      }
    },
    retry: (failureCount, error) => {
      // Don't retry if we have auth issues
      if (error.message.includes('No authentication token found') || 
          (error instanceof Error && error.message.includes('401'))) {
        return false;
      }
      return failureCount < 2;
    },
  });
};