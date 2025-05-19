import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';

interface LoginFormData {
  email: string;
  password: string;
  tenantId?: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      showNotification('success', 'Welcome back!', 'You have successfully logged in.');
      navigate('/dashboard');
    } catch (error) {
      showNotification(
        'error',
        'Login failed',
        error instanceof Error ? error.message : 'An error occurred during login'
      );
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
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
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
                  message: 'Password must be at least 8 characters',
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label="Tenant ID (Optional)"
              {...register('tenantId')}
              error={errors.tenantId?.message}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  {...register('rememberMe')}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
            >
              Sign in
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-text-secondary">Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign up now
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;