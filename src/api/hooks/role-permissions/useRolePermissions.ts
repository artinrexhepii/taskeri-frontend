import { useQuery } from "@tanstack/react-query";
import { getRolePermissions } from "../../services/role-permission.service";
import { RolePermissionResponse } from "../../../types/role-permission.types";

export const useRolePermissions = (roleId: number, enabled = true) => {
  return useQuery<RolePermissionResponse[], Error>({
    queryKey: ["role-permissions", roleId],
    queryFn: () => getRolePermissions(),
    enabled: !!roleId && enabled,
  });
};
