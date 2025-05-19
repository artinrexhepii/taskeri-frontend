import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addUserToTenant } from '../../services/tenant.service';
import { TenantUser } from '../../../types/tenant.types';

/**
 * Hook to add a new user to a tenant
 */
export const useAddUserToTenant = (tenantId: number) => {
  const queryClient = useQueryClient();

  return useMutation<TenantUser, Error, any>({
    mutationFn: (userData) => addUserToTenant(tenantId, userData),
    onSuccess: () => {
      // Invalidate tenant users query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['tenants', tenantId, 'users'] });
    },
  });
};

export default useAddUserToTenant;