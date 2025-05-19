import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import Button from '../../common/Button/Button';
import Card from '../../common/Card/Card';
import Input from '../../common/Input/Input';
import Select from '../../common/Select/Select';
import { useRoles } from '../../../api/hooks/roles/useRoles';
import { useAddUserToTenant } from '../../../api/hooks/tenants/useAddUserToTenant';
import { TenantUserCreate } from '../../../types/tenant.types';

interface UserInviteFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  roleId: string;
}

interface UserInviteFormProps {
  tenantId: number;
  onSuccess?: () => void;
}

const UserInviteForm: React.FC<UserInviteFormProps> = ({ tenantId, onSuccess }) => {
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const addUserMutation = useAddUserToTenant(tenantId);
  
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<UserInviteFormData>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      roleId: ''
    }
  });
  const password = watch('password');

  const onSubmit = async (data: UserInviteFormData) => {
    try {
      setIsLoading(true);
      
      const roleId = data.roleId ? parseInt(data.roleId) : undefined;
      
      // Create a request that matches your backend API expectations
      const userData = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
        role_id: roleId,
        is_active: true
      };
      
      // The backend should create the user and link it to the tenant
      await addUserMutation.mutateAsync(userData as any);
      
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
            {...register('firstName', {
              required: 'First name is required'
            })}
            error={errors.firstName?.message}
          />

          <Input
            label="Last Name"
            {...register('lastName', {
              required: 'Last name is required'
            })}
            error={errors.lastName?.message}
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
          {...register('roleId', {
            required: 'Please select a role for this user'
          })}
          error={errors.roleId?.message}
          disabled={rolesLoading}
        >
          <option value="">Select a role</option>
          {roles?.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
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