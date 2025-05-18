import { useQuery } from '@tanstack/react-query';
import { getRolePermissions } from '../../services/role-permission.service';
import { PermissionResponse } from '../../../types/role-permission.types';

export const useRolePermissions = (roleId: number, enabled = true) => {
  return useQuery<PermissionResponse[], Error>({
    queryKey: ['role-permissions', roleId],
    queryFn: () => getRolePermissions(roleId),
    enabled: !!roleId && enabled,
  });
};

export default useRolePermissions;