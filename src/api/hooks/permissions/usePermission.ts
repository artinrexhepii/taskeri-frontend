import { useQuery } from '@tanstack/react-query';
import { getPermissionById } from '../../services/permission.service';
import { PermissionResponse } from '../../../types/role-permission.types';

export const usePermission = (id: number, enabled = true) => {
  return useQuery<PermissionResponse, Error>({
    queryKey: ['permissions', id],
    queryFn: () => getPermissionById(id),
    enabled: !!id && enabled,
  });
};

export default usePermission;