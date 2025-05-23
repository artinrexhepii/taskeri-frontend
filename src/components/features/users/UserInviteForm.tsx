import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateUser } from '../../../api/hooks/users/useCreateUser';
import { useTeams } from '../../../api/hooks/teams/useTeams';
import { useDepartments } from '../../../api/hooks/departments/useDepartments';
import { useRoleContext } from '../../../context/RoleContext';
import { useNotification } from '../../../context/NotificationContext';
import Input from '../../common/Input/Input';
import Select from '../../common/Select/Select';
import Button from '../../common/Button/Button';
import Card from '../../common/Card/Card';

interface UserInviteFormData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
  role: string;
  teamId: string;
  department_id: string;
}

interface UserInviteFormProps {
  tenantId: number;
  onSuccess?: () => void;
}

const UserInviteForm: React.FC<UserInviteFormProps> = ({ tenantId, onSuccess }) => {
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const { roles } = useRoleContext();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const createUserMutation = useCreateUser();
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  
  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm<UserInviteFormData>({
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirmPassword: '',
      role: '',
      teamId: '',
      department_id: ''
    }
  });
  const password = watch('password');
  
  
  useEffect(() => {
    if (selectedRoleId) {
      setValue('role', selectedRoleId);
    }
  }, [selectedRoleId, setValue]);

  const onSubmit = async (data: UserInviteFormData) => {
    try {
      setIsLoading(true);
      
      const roleId = data.role ? parseInt(data.role) : undefined;
      const teamId = data.teamId ? parseInt(data.teamId) : undefined;
      const departmentId = data.department_id ? parseInt(data.department_id) : undefined;
      
      // Create a request that matches your backend API expectations - using the same format as RegisterUserPage
      const userData = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        role_id: roleId,
        team_id: teamId,
        department_id: departmentId,
      };
      
      console.log('Submitting with role_id:', roleId); // Debug log
      
      // The backend should create the user and link it to the tenant
      await createUserMutation.mutateAsync(userData as any);
      
      showNotification(
        'success', 
        'Team member added successfully!', 
        'The user has been added to your company and can now log in.'
      );
      
      // Reset form after successful submission
      reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      showNotification(
        'error',
        'Failed to add team member',
        error instanceof Error ? error.message : 'An error occurred while adding the user'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary">
          Add Team Member
        </h2>
        <p className="text-sm text-text-secondary">
          Add a new user to your company. They will receive access credentials to log in.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            {...register('first_name', {
              required: 'First name is required'
            })}
            error={errors.first_name?.message}
          />

          <Input
            label="Last Name"
            {...register('last_name', {
              required: 'Last name is required'
            })}
            error={errors.last_name?.message}
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
          helperText="This will be their username for logging in"
        />

        <Input
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
            }
          })}
          error={errors.password?.message}
          helperText="Must be at least 8 characters with mixed case, numbers, and symbols"
        />

        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm password',
            validate: value => 
              value === password || 'The passwords do not match'
          })}
          error={errors.confirmPassword?.message}
        />

        <Select
          label="Role"
          {...register('role', {
            required: 'Please select a role for this user',
            onChange: (e) => {
              console.log('Role changed to:', e.target.value); // Debug log
              setSelectedRoleId(e.target.value);
            }
          })}
          error={errors.role?.message}
          disabled={false}
        >
          <option value="">Select a role</option>
          {roles?.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </Select>

        <Select
          label="Team"
          {...register('teamId', { required: 'Team is required' })}
          error={errors.teamId?.message}
          disabled={teamsLoading}
          onChange={(e) => {
            // Update the value in react-hook-form
            setValue('teamId', e.target.value, { shouldValidate: true });
          }}
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
        >
          <option value="">Select a department</option>
          {departments?.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </Select>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            className="mr-2"
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting || isLoading}
          >
            Add User
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UserInviteForm;