import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLogin } from '../../api/hooks/auth/useLogin';
import { Alert } from '@mui/material';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, error: authError } = useAuth();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    loginMutation.mutate({ email, password });
  };

  const errorMessage = loginMutation.error?.message || authError || 'Login failed. Please check your credentials.';

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card 
      
      className="bg-white shadow-2xl rounded-xl w-full max-w-lg -mt-96">
        <div className="px-6 py-8">
          <h2 className="text-center text-xl sm:text-4xl font-extrabold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-center text-lg text-gray-600 mt-2">
            Sign in to your account
          </p>
        </div>

        <form className="space-y-6 px-6 pb-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Input
              label="Email address"
              type="email"
              className="border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              error={errorMessage}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              className="border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loginMutation.isPending}
              error={errorMessage}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              }
            />
          </div>

          {(loginMutation.isError || authError) && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          <div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              isLoading={loginMutation.isPending}
              disabled={!email || !password}
            >
              Sign In
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-teal-500 hover:text-teal-400"
            >
              Sign up
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;