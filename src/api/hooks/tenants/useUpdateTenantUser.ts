import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTenantUser } from '../../services/tenant.service';
import { TenantUser } from '../../../types/tenant.types';
import { UserUpdate } from '../../../types/user.types';

interface UpdateTenantUserParams {
  tenantId: number;
  userId: number;
  data: UserUpdate;
}

/**
 * Hook to update a tenant user's information (email, name, department, team)
 */
export const useUpdateTenantUser = () => {
  const queryClient = useQueryClient();

  return useMutation<TenantUser, Error, UpdateTenantUserParams>({
    mutationFn: ({ tenantId, userId, data }) => updateTenantUser(tenantId, userId, data),
    onSuccess: (_, { tenantId, userId }) => {
      // Invalidate both tenant users list and specific user queries
      queryClient.invalidateQueries({ queryKey: ['tenants', tenantId, 'users'] });
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
    },
  });
};

export default useUpdateTenantUser;