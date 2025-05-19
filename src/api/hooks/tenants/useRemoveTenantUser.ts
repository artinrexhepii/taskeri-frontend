import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeUserFromTenant } from '../../services/tenant.service';

interface RemoveTenantUserParams {
  tenantId: number;
  userId: number;
}

/**
 * Hook to remove a user from a tenant
 */
export const useRemoveTenantUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RemoveTenantUserParams>({
    mutationFn: ({ tenantId, userId }) => removeUserFromTenant(tenantId, userId),
    onSuccess: (_, { tenantId }) => {
      // Invalidate the tenant users list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['tenants', tenantId, 'users'] });
    },
  });
};

export default useRemoveTenantUser;