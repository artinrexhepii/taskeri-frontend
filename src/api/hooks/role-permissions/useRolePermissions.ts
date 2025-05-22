import { useQuery } from '@tanstack/react-query';
import { getRolePermissions } from '../../services/role-permission.service';
import { RolePermissionResponse } from '../../../types/role-permission.types';

export const useRolePermissions = (enabled = true) => {
  return useQuery<RolePermissionResponse[], Error>({
    queryKey: ['permissions'],
    queryFn: getRolePermissions,
    enabled,
  });
};

