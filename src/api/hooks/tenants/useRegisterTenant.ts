import { useMutation } from '@tanstack/react-query';
import { registerTenant } from '../../services/tenant.service';
import { TenantRegisterRequest, RegisterResponse } from '../../../types/auth.types';

/**
 * Hook to register a new tenant (company) with an admin user
 */
export const useRegisterTenant = () => {
  return useMutation<RegisterResponse, Error, TenantRegisterRequest>({
    mutationFn: (data) => registerTenant(data),
  });
};

export default useRegisterTenant;