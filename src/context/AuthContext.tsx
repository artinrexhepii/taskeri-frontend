import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login, logout } from '../api/services/auth.service';
import { registerTenant } from '../api/services/tenant.service';
import { LoginRequest, AuthResponse, TenantRegisterRequest, RegisterResponse } from '../types/auth.types';
import { UserDetails } from '../types/user.types';

interface AuthContextType {
  user: UserDetails | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  registerTenant: (data: TenantRegisterRequest) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
}

// Default context values
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  login: async () => false,
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
        }
      }
    };

    checkAuthStatus();
  }, []);

  // Login handler
  const handleLogin = async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      if (credentials.user) {
        // Make sure we store the complete user object including role_id
        const completeUser = {
          ...credentials.user,
          role_id: credentials.user.role_id
        };
        setUser(completeUser);
        localStorage.setItem('user', JSON.stringify(completeUser));
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      return false;
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
      const errorMessage = error.response?.data?.detail || error.message || 'Registration failed. Please try again later.';
      setError(errorMessage);
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
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Logout failed.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Update isAuthenticated whenever user or token changes
  const isAuthenticated = !!user && !!localStorage.getItem('access_token');

  // Context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
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