import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../services/user.service';
import { UserResponse } from '../../../types/user.types';

export const useUsers = () => {
  return useQuery<UserResponse[], Error>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};