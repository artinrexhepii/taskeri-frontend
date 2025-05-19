import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';

interface CompanyFormData {
  name: string;
  industry: string;
  country: string;
}

const RegisterCompanyPage: React.FC = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>();

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setIsLoading(true);
      // Simulate API call to register company
      console.log('Company registered:', data);
      showNotification('success', 'Company Registered', 'Your company has been successfully registered.');
      navigate('/register-department'); // Navigate to department registration
    } catch (error) {
      showNotification('error', 'Registration Failed', 'An error occurred while registering the company.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Your Company
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              label="Company Name"
              {...register('name', { required: 'Company name is required' })}
              error={errors.name?.message}
            />
            <Input
              label="Industry"
              {...register('industry', { required: 'Industry is required' })}
              error={errors.industry?.message}
            />
            <Input
              label="Country"
              {...register('country', { required: 'Country is required' })}
              error={errors.country?.message}
            />
          </div>
          <div>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Register Company
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompanyPage;