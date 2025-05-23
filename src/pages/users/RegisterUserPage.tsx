import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNotification } from '../../context/NotificationContext';
import { useCreateUser } from '../../api/hooks/users/useCreateUser';
import { UserCreate } from '../../types/user.types';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { useTeams } from '../../api/hooks/teams/useTeams';
import { useDepartments } from '../../api/hooks/departments/useDepartments';
import Select from '../../components/common/Select/Select';
import { useNavigate } from 'react-router-dom';

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  teamId: string;
  department_id: string;
}

const RegisterUserPage: React.FC = () => {
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<UserFormData>();
  const createUserMutation = useCreateUser();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const navigate = useNavigate();

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      const userCreateData: UserCreate = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role_id: parseInt(data.role),
        team_id: parseInt(data.teamId),
        department_id: parseInt(data.department_id),
        password: '12345678',
      };
      await createUserMutation.mutateAsync(userCreateData);
      showNotification('success', 'User Registered', 'The user has been successfully registered.');
      navigate('/'); // Navigate to the home page
    } catch (error) {
      showNotification('error', 'Registration Failed', 'An error occurred while registering the user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register a New User</h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="First Name"
              {...register('first_name', { required: 'First name is required' })}
              error={errors.first_name?.message}
              className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            />
            <Input
              label="Last Name"
              {...register('last_name', { required: 'Last name is required' })}
              error={errors.last_name?.message}
              className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            />
            <Input
              label="Email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
              className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            />
            <Input
              label="Role"
              {...register('role', { required: 'Role is required' })}
              error={errors.role?.message}
              className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            />
            <Select
              label="Team"
              {...register('teamId', { required: 'Team is required' })}
              error={errors.teamId?.message}
              disabled={teamsLoading}
              onChange={(e) => {
                // Update the value in react-hook-form
                setValue('teamId', e.target.value, { shouldValidate: true });
              }}
              className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Select a team</option>
              {teams?.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Select>
            <Select
              label="Department"
              {...register('department_id', { required: 'Department is required' })}
              error={errors.department_id?.message}
              disabled={departmentsLoading}
              onChange={(e) => {
                // Update the value in react-hook-form
                setValue('department_id', e.target.value, { shouldValidate: true });
              }}
              className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Select a department</option>
              {departments?.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md">
              Register User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserPage;