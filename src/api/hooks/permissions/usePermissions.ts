import { useQuery } from '@tanstack/react-query';
import { getPermissions } from '../../services/permission.service';
import { PermissionResponse } from '../../../types/role-permission.types';

export const usePermissions = (enabled = true) => {
  return useQuery<PermissionResponse[], Error>({
    queryKey: ['permissions'],
    queryFn: getPermissions,
    enabled,
  });
};

export default usePermissions;