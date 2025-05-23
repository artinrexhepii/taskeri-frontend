import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useLogin } from '../../api/hooks/auth/useLogin';
import { Alert } from '@mui/material';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import { TenantRegisterRequest } from '../../types/auth.types';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  tenantSchema: string;
  agreeToTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const { registerTenant, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const password = watch('password');

  // Only redirect if authenticated and not in the process of registering
  useEffect(() => {
    if (isAuthenticated && !isRegistering && localStorage.getItem('company_registered') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, isRegistering]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setIsRegistering(true);

      const tenantSchema = data.companyName
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');

      const registerData: TenantRegisterRequest = {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        company_name: data.companyName,
        tenant_schema: tenantSchema
      };

      // Register the tenant
      const response = await registerTenant(registerData);

      // Login the user
      await loginMutation.mutateAsync({ email: data.email, password: data.password });

      showNotification(
        'success',
        'Registration successful!',
        'Your company account has been created. You can now proceed to set up your company.'
      );

      // Set a flag to indicate company registration is not complete
      localStorage.setItem('company_registered', 'false');

      // Navigate to company registration
      navigate('/register-company');
    } catch (error) {
      showNotification(
        'error',
        'Registration failed',
        error instanceof Error ? error.message : 'An error occurred during registration'
      );
    } finally {
      setIsLoading(false);
      setIsRegistering(false);
    }
  };

  const errorMessage = loginMutation.error?.message || 'Login failed. Please check your credentials.';

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="bg-white shadow-2xl rounded-xl -mt-20">
        <div className="px-6 py-8">
          <h2 className="text-center text-4xl font-extrabold text-gray-800">
            Register Company Account
          </h2>
          <p className="text-center text-lg text-gray-600 mt-2">
            Create a company account to manage your team
          </p>
        </div>

        <form className="space-y-6 px-6 pb-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                className="border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                {...register('firstName', {
                  required: 'First name is required'
                })}
                error={errors.firstName?.message}
              />

              <Input
                label="Last Name"
                className="border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                {...register('lastName', {
                  required: 'Last name is required'
                })}
                error={errors.lastName?.message}
              />
            </div>

            <Input
              label="Email address"
              type="email"
              className="border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              className="border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              className="border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => 
                  value === password || 'The passwords do not match'
              })}
              error={errors.confirmPassword?.message}
            />

            <Input
              label="Company Name"
              className="border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              {...register('companyName', {
                required: 'Company name is required'
              })}
              error={errors.companyName?.message}
              helperText="This will be your organization's workspace name"
            />

            <div className="flex items-center">
              <input
                id="agree-terms"
                type="checkbox"
                className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-300 rounded"
                {...register('agreeToTerms', {
                  required: 'You must agree to the terms and conditions'
                })}
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-600">
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="font-medium text-teal-500 hover:text-teal-400"
                >
                  terms and conditions
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          {(loginMutation.isError) && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          <div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              isLoading={isSubmitting || isLoading || loginMutation.isPending}
            >
              Register Company
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="font-medium text-teal-500 hover:text-teal-400"
            >
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;