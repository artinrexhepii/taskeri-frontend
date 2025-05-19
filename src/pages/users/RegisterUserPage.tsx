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
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>();
  const createUserMutation = useCreateUser();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();

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
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="First Name"
              {...register('first_name', { required: 'First name is required' })}
              error={errors.first_name?.message}
            />
            <Input
              label="Last Name"
              {...register('last_name', { required: 'Last name is required' })}
              error={errors.last_name?.message}
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
            <Select
              label="Team"
              {...register('teamId', { required: 'Team is required' })}
              error={errors.teamId?.message}
              disabled={teamsLoading}
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