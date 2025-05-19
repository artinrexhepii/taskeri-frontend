import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';

interface UserFormData {
  name: string;
  email: string;
  role: string;
  teamId: string;
}

const RegisterUserPage: React.FC = () => {
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>();

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      // Simulate API call to register user
      console.log('User registered:', data);
      showNotification('success', 'User Registered', 'The user has been successfully registered.');
    } catch (error) {
      showNotification('error', 'Registration Failed', 'An error occurred while registering the user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register a User
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              label="Name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
            <Input
              label="Role"
              {...register('role', { required: 'Role is required' })}
              error={errors.role?.message}
            />
            <Input
              label="Team ID"
              {...register('teamId', { required: 'Team ID is required' })}
              error={errors.teamId?.message}
            />
          </div>
          <div>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Register User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserPage;