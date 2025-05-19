import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTenantUsers } from '../../../api/hooks/tenants/useTenantUsers';
import { useUpdateTenantUser } from '../../../api/hooks/tenants/useUpdateTenantUser';
import { useRemoveTenantUser } from '../../../api/hooks/tenants/useRemoveTenantUser';
import { useRoles } from '../../../api/hooks/roles/useRoles';
import UserInviteForm from '../../../components/features/users/UserInviteForm';
import { TenantUser, TenantUserUpdate } from '../../../types/tenant.types';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';
import Select from '../../../components/common/Select/Select';
import { useNotification } from '../../../context/NotificationContext';
import { XMarkIcon, UserPlusIcon, UserIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const TenantUsersPage: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [tenantId, setTenantId] = useState<number>(0);

  // Get tenant ID from localStorage or extract from tenant_schema
  useEffect(() => {
    const storedTenantId = localStorage.getItem('tenant_id');
    if (storedTenantId) {
      setTenantId(parseInt(storedTenantId, 10));
    }
  }, []);

  const { data: tenantUsers, isLoading, refetch } = useTenantUsers(tenantId, {
    page: currentPage,
    pageSize
  });
  const { data: roles } = useRoles();
  const updateUserMutation = useUpdateTenantUser();
  const removeUserMutation = useRemoveTenantUser();

  const toggleInviteForm = () => {
    setShowInviteForm(!showInviteForm);
  };

  const handleInviteSuccess = () => {
    setShowInviteForm(false);
    refetch();
  };

  const getStatusBadgeClass = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const startEditing = (tenantUser: TenantUser) => {
    setEditingUserId(tenantUser.id);
    setSelectedRole(tenantUser.role_id?.toString() || '');
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setSelectedRole('');
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const saveUserChanges = async (tenantUser: TenantUser) => {
    try {
      const updateData: TenantUserUpdate = {};
      
      if (selectedRole) {
        updateData.role_id = parseInt(selectedRole);
      }
      
      await updateUserMutation.mutateAsync({
        tenantId,
        userId: tenantUser.user_id,
        data: updateData
      });
      
      showNotification(
        'success',
        'User updated',
        'User role has been updated successfully'
      );
      
      cancelEditing();
    } catch (error) {
      showNotification(
        'error',
        'Update failed',
        error instanceof Error ? error.message : 'Failed to update user'
      );
    }
  };

  const toggleUserStatus = async (tenantUser: TenantUser) => {
    try {
      await updateUserMutation.mutateAsync({
        tenantId,
        userId: tenantUser.user_id,
        data: { is_active: !tenantUser.is_active }
      });
      
      showNotification(
        'success',
        'Status updated',
        `User has been ${tenantUser.is_active ? 'deactivated' : 'activated'}`
      );
    } catch (error) {
      showNotification(
        'error',
        'Update failed',
        error instanceof Error ? error.message : 'Failed to update user status'
      );
    }
  };

  const removeUser = async (tenantUser: TenantUser) => {
    if (window.confirm(`Are you sure you want to remove ${tenantUser.user?.first_name} ${tenantUser.user?.last_name}?`)) {
      try {
        await removeUserMutation.mutateAsync({
          tenantId,
          userId: tenantUser.user_id
        });
        
        showNotification(
          'success',
          'User removed',
          'User has been removed from your company'
        );
      } catch (error) {
        showNotification(
          'error',
          'Removal failed',
          error instanceof Error ? error.message : 'Failed to remove user'
        );
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Company Team Members</h1>
        <Button
          variant="primary"
          onClick={toggleInviteForm}
          leftIcon={showInviteForm ? <XMarkIcon /> : <UserPlusIcon />}
        >
          {showInviteForm ? 'Cancel' : 'Add User'}
        </Button>
      </div>

      {showInviteForm && (
        <div className="mb-8">
          <UserInviteForm tenantId={tenantId} onSuccess={handleInviteSuccess} />
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : !tenantUsers || !tenantUsers.items || tenantUsers.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                tenantUsers.items.map((tenantUser: TenantUser) => (
                  <tr key={tenantUser.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tenantUser.user?.first_name} {tenantUser.user?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tenantUser.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingUserId === tenantUser.id ? (
                        <Select
                          value={selectedRole}
                          onChange={handleRoleChange}
                          className="w-full text-sm"
                        >
                          <option value="">No role</option>
                          {roles?.map(role => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        tenantUser.role?.name || 'No role assigned'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(tenantUser.is_active)}`}>
                        {tenantUser.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tenantUser.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingUserId === tenantUser.id ? (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() => saveUserChanges(tenantUser)}
                            className="text-primary hover:text-primary-dark mr-2"
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={cancelEditing}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() => startEditing(tenantUser)}
                            className="text-primary hover:text-primary-dark mr-2"
                            leftIcon={<PencilIcon />}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => toggleUserStatus(tenantUser)}
                            className={tenantUser.is_active ? "text-amber-600 hover:text-amber-900 mr-2" : "text-green-600 hover:text-green-900 mr-2"}
                          >
                            {tenantUser.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => removeUser(tenantUser)}
                            className="text-red-600 hover:text-red-900"
                            leftIcon={<TrashIcon/>}
                          >
                            Remove
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {tenantUsers && tenantUsers.total && tenantUsers.total > pageSize && (
          <div className="px-6 py-3 flex justify-between items-center border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {Math.min((currentPage - 1) * pageSize + 1, tenantUsers.total)} to{' '}
              {Math.min(currentPage * pageSize, tenantUsers.total)} of {tenantUsers.total} users
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * pageSize >= tenantUsers.total}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TenantUsersPage;