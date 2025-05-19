import { useQuery } from '@tanstack/react-query';
import { getTenantUsers } from '../../services/tenant.service';
import { TenantUserListResponse } from '../../../types/tenant.types';

interface QueryOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Hook to fetch users for a tenant with pagination
 */
export const useTenantUsers = (tenantId: number, options: QueryOptions = {}) => {
  const { page = 1, pageSize = 10 } = options;

  return useQuery<TenantUserListResponse, Error>({
    queryKey: ['tenants', tenantId, 'users', { page, pageSize }],
    queryFn: () => getTenantUsers(tenantId, page, pageSize),
    enabled: !!tenantId,
  });
};

export default useTenantUsers;