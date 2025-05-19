import { useQuery } from '@tanstack/react-query';
import { getRole } from '../../services/role.service';
import { RoleResponse } from '../../../types/role-permission.types';

export const useRole = (id: number, enabled = true) => {
  return useQuery<RoleResponse, Error>({
    queryKey: ['roles', id],
    queryFn: () => getRole(id),
    enabled: !!id && enabled,
  });
};

export default useRole;