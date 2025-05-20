import React, { createContext, useContext, ReactNode } from 'react';
import { useRoles } from '../api/hooks/roles/useRoles';
import { Role } from '../types/role.types';

interface RoleContextType {
  roles: Role[] | undefined;
  isLoading: boolean;
  error: Error | null;
  getRoleName: (roleId: number | undefined) => string;
}

const RoleContext = createContext<RoleContextType>({
  roles: undefined,
  isLoading: false,
  error: null,
  getRoleName: () => 'Unknown Role',
});

export const useRoleContext = () => useContext(RoleContext);

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { data: roles, isLoading, error } = useRoles();

  const getRoleName = (roleId: number | undefined): string => {
    if (!roleId || !roles) return 'No role assigned';
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  };

  return (
    <RoleContext.Provider 
      value={{ 
        roles, 
        isLoading, 
        error: error || null,
        getRoleName
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;