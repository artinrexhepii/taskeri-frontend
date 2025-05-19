import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTenantUser } from '../../services/tenant.service';
import { TenantUser, TenantUserUpdate } from '../../../types/tenant.types';

interface UpdateTenantUserParams {
  tenantId: number;
  userId: number;
  data: TenantUserUpdate;
}

/**
 * Hook to update a tenant user (change role or active status)
 */
export const useUpdateTenantUser = () => {
  const queryClient = useQueryClient();

  return useMutation<TenantUser, Error, UpdateTenantUserParams>({
    mutationFn: ({ tenantId, userId, data }) => updateTenantUser(tenantId, userId, data),
    onSuccess: (_, { tenantId }) => {
      // Invalidate the tenant users list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['tenants', tenantId, 'users'] });
    },
  });
};

export default useUpdateTenantUser;