import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNotification } from '../../context/NotificationContext';
import { useCreateDepartment } from '../../api/hooks/departments/useCreateDepartment';
import { useCompany } from '../../api/hooks/companies/useCompany';
import { DepartmentCreate } from '../../types/department.types';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';

interface DepartmentFormData {
  name: string;
  companyId: string;
}

const RegisterDepartmentPage: React.FC = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<DepartmentFormData>();
  const createDepartmentMutation = useCreateDepartment();
  const { data: companies, isLoading: companiesLoading } = useCompany();

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      setIsLoading(true);
      const departmentCreateData: DepartmentCreate = {
        name: data.name,
        company_id: parseInt(data.companyId),
      };
      await createDepartmentMutation.mutateAsync(departmentCreateData);
      showNotification('success', 'Department Registered', 'Your department has been successfully registered.');
      navigate('/register-team'); // Navigate to team registration
    } catch (error) {
      showNotification('error', 'Registration Failed', 'An error occurred while registering the department.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Your Department
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Department Name"
              {...register('name', { required: 'Department name is required' })}
              error={errors.name?.message}
            />
            <Select
              label="Company"
              {...register('companyId', {
                required: 'Company is required',
                validate: (value) => !!value || 'Please select a valid company',
              })}
              error={errors.companyId?.message}
              disabled={companiesLoading}
            >
              <option value="">Select a company</option>
              {companies?.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Register Department
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterDepartmentPage;