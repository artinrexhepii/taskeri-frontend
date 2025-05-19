import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login, logout, getCurrentUser } from '../api/services/auth.service';
import { registerTenant } from '../api/services/tenant.service';
import { LoginRequest, AuthResponse, TenantRegisterRequest, RegisterResponse } from '../types/auth.types';
import { UserDetails } from '../types/user.types';

interface AuthContextType {
  user: UserDetails | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  registerTenant: (data: TenantRegisterRequest) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
}

// Default context values
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  login: async () => {},
  registerTenant: async () => ({ message: '', user_id: 0, tenant_id: 0 }),
  logout: async () => {},
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear any invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('tenant_id');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login handler
  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login(credentials);
      setUser(response.user);
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Tenant registration handler
  const handleTenantRegistration = async (data: TenantRegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerTenant(data);
      return response;
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again later.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (error: any) {
      setError(error.message || 'Logout failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login: handleLogin,
    registerTenant: handleTenantRegistration,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;