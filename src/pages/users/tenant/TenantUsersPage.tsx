import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTenantUsers } from "../../../api/hooks/tenants/useTenantUsers";
import { useDeleteUser } from "../../../api/hooks/users/useDeleteUser";
import { useRoles } from "../../../api/hooks/roles/useRoles";
import { useDepartments } from "../../../api/hooks/departments/useDepartments";
import { useTeams } from "../../../api/hooks/teams/useTeams";
import UserInviteForm from "../../../components/features/users/UserInviteForm";
import EditUserForm from "../../../components/features/users/EditUserForm";
import { TenantUser } from "../../../types/tenant.types";
import Button from "../../../components/common/Button/Button";
import Card from "../../../components/common/Card/Card";
import Select from "../../../components/common/Select/Select";
import { useNotification } from "../../../context/NotificationContext";
import {
  XMarkIcon,
  UserPlusIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../utils/formatters";
import { useRoleContext } from "../../../context/RoleContext";

const getDepartmentName = (
  departmentId?: number,
  departments?: any[]
): string => {
  if (!departmentId || !departments || departments.length === 0)
    return "No department";
  const department = departments.find((dept) => dept.id === departmentId);
  return department ? department.name : "No department";
};

const getTeamName = (teamId?: number, teams?: any[]): string => {
  if (!teamId || !teams || teams.length === 0) return "No team";
  const team = teams.find((team) => team.id === teamId);
  return team ? team.name : "No team";
};

const TenantUsersPage: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [editingUser, setEditingUser] = useState<TenantUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Get tenant ID from user context
  const tenantId = user?.tenant_id || 1;

  const {
    data: tenantUsers,
    isLoading,
    refetch,
  } = useTenantUsers(tenantId, {
    page: currentPage,
    pageSize,
  });
  const { data: roles } = useRoles();
  const { data: departments } = useDepartments();
  const { data: teams } = useTeams();
  const deleteUserMutation = useDeleteUser();
  const { getRoleName } = useRoleContext();

  // Filter users based on search query and filters
  const filteredUsers = tenantUsers?.items.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      `${user.user?.first_name} ${user.user?.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      filterRole === "" || user.role_id?.toString() === filterRole;

    return matchesSearch && matchesRole;
  });

  const toggleInviteForm = () => {
    setShowInviteForm(!showInviteForm);
  };

  const handleInviteSuccess = () => {
    setShowInviteForm(false);
    refetch();
  };

  const startEditing = (user: TenantUser) => {
    setEditingUser(user);
  };

  const handleEditSuccess = () => {
    setEditingUser(null);
    refetch();
  };

  const removeUser = async (tenantUser: TenantUser) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${tenantUser.user?.first_name} ${tenantUser.user?.last_name}?`
      )
    ) {
      try {
        await deleteUserMutation.mutateAsync(tenantUser.user_id);

        showNotification(
          "success",
          "User removed",
          "User has been removed successfully"
        );

        refetch();
      } catch (error) {
        showNotification(
          "error",
          "Removal failed",
          error instanceof Error ? error.message : "Failed to remove user"
        );
      }
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterRole("");
  };

  const exportUsers = () => {
    if (!filteredUsers?.length) {
      showNotification(
        "warning",
        "No data to export",
        "There are no users matching your current filters"
      );
      return;
    }

    // Prepare headers and rows
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Role",
      "Department",
      "Team",
      "Member Since",
    ].join(",");

    // Prepare rows data
    const rows = filteredUsers.map((user) =>
      [
        user.user?.first_name || "",
        user.user?.last_name || "",
        user.user?.email || "",
        getRoleName(user.role_id),
        getDepartmentName(user.department_id, departments),
        getTeamName(user.team_id, teams),
        user.created_at ? formatDate(user.created_at) : "N/A",
      ]
        .map((cell) => `"${cell.toString().trim().replace(/"/g, '""')}"`)
        .join(",")
    );

    // Combine headers and rows
    const csvContent = [headers, ...rows].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const currentDate = new Date().toISOString().split("T")[0];

    link.href = url;
    link.setAttribute("download", `company-users-${currentDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification(
      "success",
      "Export successful",
      "User data has been exported to CSV"
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section with Title and Controls */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900  mb-2">
              Company Users
            </h1>
            <p className="text-gray-500">
              Manage your team members, assign roles, and control access
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              onClick={exportUsers}
              className="flex items-center bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={toggleInviteForm}
              className="flex items-center"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Role
                </label>
                <Select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full"
                >
                  <option value="">All Roles</option>
                  {roles?.map((role) => (
                    <option key={role.id} value={role.id.toString()}>
                      {role.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* User Invite Form */}
      {showInviteForm && (
        <Card className="mb-8 shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-primary/5  py-4 px-6 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Invite New User
            </h2>
            <button
              onClick={toggleInviteForm}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            <UserInviteForm
              tenantId={tenantId}
              onSuccess={handleInviteSuccess}
            />
          </div>
        </Card>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <EditUserForm
              user={editingUser}
              tenantId={tenantId}
              onClose={() => setEditingUser(null)}
              onSuccess={handleEditSuccess}
            />
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <Card className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 ">
              No users found
            </h3>
            <p className="mt-1 text-gray-500">
              {searchQuery || filterRole
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Add a new user to get started."}
            </p>
            {(searchQuery || filterRole) && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="mt-4 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((tenantUser: TenantUser) => (
              <Card
                key={tenantUser.id}
                className="overflow-hidden border border-gray-100 transition-shadow hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-primary/10 rounded-full">
                        <UserIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {tenantUser.user?.first_name}{" "}
                          {tenantUser.user?.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {tenantUser.user?.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(tenantUser)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-900 uppercase tracking-wider mb-1">
                      Role
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {getRoleName(tenantUser.role_id)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Department
                    </p>
                    <p className="text-sm text-gray-800">
                      {getDepartmentName(tenantUser.department_id, departments)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Team
                    </p>
                    <p className="text-sm text-gray-800">
                      {getTeamName(tenantUser.team_id, teams)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Member Since
                    </p>
                    <p className="text-sm text-gray-800">
                      {tenantUser.created_at
                        ? formatDate(tenantUser.created_at)
                        : "N/A"}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeUser(tenantUser)}
                        className="bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {tenantUsers?.total && tenantUsers.total > pageSize && (
        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {Math.min((currentPage - 1) * pageSize + 1, tenantUsers.total)} to{" "}
            {Math.min(currentPage * pageSize, tenantUsers.total)} of{" "}
            {tenantUsers.total} users
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage * pageSize >= tenantUsers.total}
              className="flex items-center bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantUsersPage;
