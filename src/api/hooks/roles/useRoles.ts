import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../../services/role.service';
import { Role } from '../../../types/role.types';

/**
 * Hook to fetch all available roles, only if token is present
 */
export const useRoles = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  return useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: getRoles,
    enabled: !!token,
  });
};
export default useRoles;
