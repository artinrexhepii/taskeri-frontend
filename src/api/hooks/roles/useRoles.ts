import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../../services/role.service';
import { Role } from '../../../types/role.types';

/**
 * Hook to fetch all available roles
 */
export const useRoles = () => {
  return useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: () => getRoles(),
  });
};

export default useRoles;