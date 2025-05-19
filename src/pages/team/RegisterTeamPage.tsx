import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNotification } from '../../context/NotificationContext';
import { useCreateTeam } from '../../api/hooks/teams/useCreateTeam';
import { TeamCreate } from '../../types/team.types';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';

interface TeamFormData {
  name: string;
  departmentId: string;
}

const RegisterTeamPage: React.FC = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<TeamFormData>();
  const createTeamMutation = useCreateTeam();

  const onSubmit = async (data: TeamFormData) => {
    try {
      setIsLoading(true);
      const teamCreateData: TeamCreate = {
        name: data.name,
        department_id: parseInt(data.departmentId),
      };
      await createTeamMutation.mutateAsync(teamCreateData);
      showNotification('success', 'Team Registered', 'Your team has been successfully registered.');
      navigate('/register-user'); // Navigate to user registration
    } catch (error) {
      showNotification('error', 'Registration Failed', 'An error occurred while registering the team.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Your Team
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              label="Team Name"
              {...register('name', { required: 'Team name is required' })}
              error={errors.name?.message}
            />
            <Input
              label="Department ID"
              {...register('departmentId', { required: 'Department ID is required' })}
              error={errors.departmentId?.message}
            />
          </div>
          <div>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Register Team
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterTeamPage;