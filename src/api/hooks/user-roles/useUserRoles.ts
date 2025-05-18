import { useQuery } from '@tanstack/react-query';
import { getUserRoles } from '../../services/user-role.service';
import { RoleResponse } from '../../../types/role-permission.types';

export const useUserRoles = (userId: number, enabled = true) => {
  return useQuery<RoleResponse[], Error>({
    queryKey: ['user-roles', userId],
    queryFn: () => getUserRoles(userId),
    enabled: !!userId && enabled,
  });
};

export default useUserRoles;