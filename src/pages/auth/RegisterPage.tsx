import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
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
  const { registerTenant } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      
      // Generate tenant schema from company name (lowercase, replace spaces with underscores)
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
      
      const response = await registerTenant(registerData);
      
      showNotification(
        'success', 
        'Registration successful!', 
        'Your company account has been created. You can now log in.'
      );
      
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      showNotification(
        'error',
        'Registration failed',
        error instanceof Error ? error.message : 'An error occurred during registration'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.svg"
            alt="Taskeri"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            Register Company Account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Create a company account to manage your team
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register('firstName', {
                  required: 'First name is required'
                })}
                error={errors.firstName?.message}
              />

              <Input
                label="Last Name"
                {...register('lastName', {
                  required: 'Last name is required'
                })}
                error={errors.lastName?.message}
              />
            </div>

            <Input
              label="Email address"
              type="email"
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
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => 
                  value === password || 'The passwords do not match'
              })}
              error={errors.confirmPassword?.message}
            />

            <Input
              label="Company Name"
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
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                {...register('agreeToTerms', {
                  required: 'You must agree to the terms and conditions'
                })}
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-text-secondary">
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  terms and conditions
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="mt-1 text-sm text-error">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className='w-full'
              isLoading={isSubmitting || isLoading}
            >
              Register Company
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-text-secondary">Already have an account? </span>
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80"
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