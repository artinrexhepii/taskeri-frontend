import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../../services/role.service';
import { RoleResponse } from '../../../types/role-permission.types';

export const useRoles = (enabled = true) => {
  return useQuery<RoleResponse[], Error>({
    queryKey: ['roles'],
    queryFn: getRoles,
    enabled,
  });
};

export default useRoles;