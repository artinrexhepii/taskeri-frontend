import { useQuery } from '@tanstack/react-query';
import { getRolePermissionsByRoleId } from '../../services/role-permission.service';
import { PermissionResponse } from '../../../types/role-permission.types';

export const useRolePermissionsByRole = (roleId: number, enabled = true) => {
  return useQuery<PermissionResponse[], Error>({
    queryKey: ['role-permissions', roleId],
    queryFn: () => getRolePermissionsByRoleId(roleId),
    enabled: !!roleId && enabled,
  });
};

export default useRolePermissionsByRole;
