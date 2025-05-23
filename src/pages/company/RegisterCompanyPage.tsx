import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNotification } from '../../context/NotificationContext';
import { useCreateCompany } from '../../api/hooks/companies/useCreateCompany';
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
  const [companies, setCompanies] = useState<CompanyFormData[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CompanyFormData>();
  const createCompanyMutation = useCreateCompany();

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setIsLoading(true);
      await createCompanyMutation.mutateAsync(data);
      setCompanies((prev) => [...prev, data]);
      showNotification('success', 'Company Registered', 'Your company has been successfully registered.');
      reset(); // Reset the form for the next entry
    } catch (error) {
      showNotification('error', 'Registration Failed', 'An error occurred while registering the company.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-800">
          Register Your Company
        </h2>
        <form className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Company Name"
              {...register('name', { required: 'Company name is required' })}
              error={errors.name?.message}
              className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            />
            <Input
              label="Industry"
              {...register('industry', { required: 'Industry is required' })}
              error={errors.industry?.message}
              className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            />
            <Input
              label="Country"
              {...register('country', { required: 'Country is required' })}
              error={errors.country?.message}
              className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md">
              Register Company
            </Button>
          </div>
        </form>
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900">Registered Companies</h3>
          <ul className="mt-4 space-y-2">
            {companies.map((company, index) => (
              <li key={index} className="p-4 border rounded-md shadow-sm">
                <p className="text-lg font-medium">{company.name}</p>
                <p className="text-sm text-gray-600">Industry: {company.industry}</p>
                <p className="text-sm text-gray-600">Country: {company.country}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <Button variant="secondary" className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md" onClick={() => navigate('/register-department')}>
            Proceed to Department Registration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompanyPage;