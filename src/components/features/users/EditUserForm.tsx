import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateTenantUser } from '../../../api/hooks/tenants/useUpdateTenantUser';
import { useAssignRoleToUser } from '../../../api/hooks/user-roles/useAssignRoleToUser';
import { useTeams } from '../../../api/hooks/teams/useTeams';
import { useDepartments } from '../../../api/hooks/departments/useDepartments';
import { useRoleContext } from '../../../context/RoleContext';
import { TenantUser } from '../../../types/tenant.types';
import { UserUpdate } from '../../../types/user.types';
import { useNotification } from '../../../context/NotificationContext';
import Button from '../../common/Button/Button';
import Select from '../../common/Select/Select';
import Input from '../../common/Input/Input';
import Card from '../../common/Card/Card';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';

interface EditUserFormProps {
  user: TenantUser;
  tenantId: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData extends UserUpdate {
  role_id: string;
}

export const EditUserForm: React.FC<EditUserFormProps> = ({ user, tenantId, onClose, onSuccess }) => {
  const { showNotification } = useNotification();
  const updateUserMutation = useUpdateTenantUser();
  const assignRoleMutation = useAssignRoleToUser();
  const { data: teams } = useTeams();
  const { data: departments } = useDepartments();
  const { roles } = useRoleContext();

  const [selectedRole, setSelectedRole] = useState<string>(user.role_id?.toString() || '');
  const [selectedTeam, setSelectedTeam] = useState<string>(user.team_id?.toString() || '');
  const [selectedDepartment, setSelectedDepartment] = useState<string>(user.department_id?.toString() || '');

  // Effect to update department selection when departments data loads
  useEffect(() => {
    if (departments && user.department_id) {
      const userDepartment = departments.find(dept => dept.id === user.department_id);
      if (userDepartment) {
        setSelectedDepartment(userDepartment.id.toString());
      }
    }
  }, [departments, user.department_id]);

  // Effect to update team selection when teams data loads
  useEffect(() => {
    if (teams && user.team_id) {
      const userTeam = teams.find(team => team.id === user.team_id);
      if (userTeam) {
        setSelectedTeam(userTeam.id.toString());
      }
    }
  }, [teams, user.team_id]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      email: user.user?.email || '',
      first_name: user.user?.first_name || '',
      last_name: user.user?.last_name || '',
      department_id: user.department_id,
      team_id: user.team_id,
      role_id: user.role_id?.toString() || ''
    }
  });

  // Get department name helper function
  const getDepartmentName = (departmentId: number | undefined): string => {
    if (!departmentId || !departments) return '';
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : '';
  };

  // Get team name helper function
  const getTeamName = (teamId: number | undefined): string => {
    if (!teamId || !teams) return '';
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : '';
  };

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Starting user update process...');
      console.log('Current user role_id:', user.role_id);
      console.log('Selected role from state:', selectedRole);
      console.log('Selected team from state:', selectedTeam);
      console.log('Selected department from state:', selectedDepartment);
      
      // Extract role_id and user data
      const { role_id, ...userData } = data;
      
      // Update user information first
      await updateUserMutation.mutateAsync({
        tenantId,
        userId: user.user_id,
        data: {
          ...userData,
          team_id: selectedTeam ? parseInt(selectedTeam) : null,
          department_id: selectedDepartment ? parseInt(selectedDepartment) : null
        }
      });

      console.log('User info updated successfully');

      // Handle role update if selected role is different from current role
      if (selectedRole && selectedRole !== user.role_id?.toString()) {
        console.log('Role change detected:', {
          currentRole: user.role_id,
          newRole: selectedRole
        });
        
        const numericRoleId = parseInt(selectedRole);
        if (!isNaN(numericRoleId)) {
          console.log('Making API call to assign role:', numericRoleId);
          await assignRoleMutation.mutateAsync({
            userId: user.user_id,
            roleId: numericRoleId
          });
          console.log('Role assignment successful');
        }
      }

      showNotification(
        'success',
        'User updated',
        'User information has been updated successfully'
      );
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error in update process:', error);
      showNotification(
        'error',
        'Update failed',
        error instanceof Error ? error.message : 'Failed to update user'
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-primary/10 text-primary p-1.5 rounded-lg">
              <UserIcon className="h-5 w-5" />
            </span>
            Edit User Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      error={errors.email?.message}
                    />

                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Role Assignment</h3>
                  <Select
                    label="Role"
                    value={selectedRole}
                    onChange={(e) => {
                      console.log('Role selection changed to:', e.target.value);
                      setSelectedRole(e.target.value);
                    }}
                    error={errors.role_id?.message}
                    className="w-full"
                  >
                    <option value="">Select a role</option>
                    {roles?.map((role) => (
                      <option key={role.id} value={role.id.toString()}>
                        {role.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Organization Details</h3>
                  <div className="space-y-4">
                    <Select
                      label="Team"
                      value={selectedTeam}
                      onChange={(e) => {
                        console.log('Team selection changed to:', e.target.value);
                        setSelectedTeam(e.target.value);
                      }}
                      error={errors.team_id?.message}
                    >
                      <option value="">Select a team</option>
                      {teams?.map((team) => (
                        <option key={team.id} value={team.id.toString()}>
                          {team.name}
                        </option>
                      ))}
                    </Select>

                    <Select
                      label="Department"
                      value={selectedDepartment}
                      onChange={(e) => {
                        console.log('Department selection changed to:', e.target.value);
                        setSelectedDepartment(e.target.value);
                      }}
                      error={errors.department_id?.message}
                    >
                      <option value="">Select a department</option>
                      {departments?.map((department) => (
                        <option key={department.id} value={department.id.toString()}>
                          {department.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="px-4 py-2 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="px-4 py-2 text-sm"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;