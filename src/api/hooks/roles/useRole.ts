import { useQuery } from '@tanstack/react-query';
import { getRoleById } from '../../services/role.service';
import { RoleResponse } from '../../../types/role-permission.types';

export const useRole = (id: number, enabled = true) => {
  return useQuery<RoleResponse, Error>({
    queryKey: ['roles', id],
    queryFn: () => getRoleById(id),
    enabled: !!id && enabled,
  });
};

export default useRole;