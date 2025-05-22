import { useEffect, useState } from 'react';
import {
  Box, Card, Typography, Select, MenuItem,
  Stack, Chip, CircularProgress, InputAdornment, Tooltip
} from '@mui/material';
import { useRoles } from '../../api/hooks/roles/useRoles';
import { useRolePermissions } from '../../api/hooks/role-permissions/useRolePermissions';
import { usePermissions } from '../../api/hooks/permissions/usePermissions';
import ShieldIcon from '@mui/icons-material/Shield';
import { motion } from 'framer-motion';

export default function RolePermissionViewer() {
  const [selectedRole, setSelectedRole] = useState<number | ''>('');

  const { data: roles, isLoading: loadingRoles } = useRoles();

  const {
    data: rolePermissions,
    isLoading: loadingRolePerms,
    refetch: refetchRolePerms,
  } = useRolePermissions(!!selectedRole);

  const {
    data: allPermissions,
    isLoading: loadingPermissions,
    refetch: refetchPermissions,
  } = usePermissions(!!selectedRole);

  const isLoading = loadingRoles || loadingRolePerms || loadingPermissions;

  useEffect(() => {
    if (selectedRole) {
      refetchRolePerms();
      refetchPermissions();
    }
  }, [selectedRole, refetchRolePerms, refetchPermissions]);

  const filteredPermissions =
    selectedRole && rolePermissions && allPermissions
      ? rolePermissions
          .filter((rp) => rp.role_id === Number(selectedRole))
          .map((rp) => allPermissions.find((p) => p.id === rp.permission_id))
          .filter(Boolean)
      : [];

  return (
    <Card sx={{ p: 3, boxShadow: 3, mt: 4 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            Role Permissions
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Select a role to view its associated permissions
          </Typography>
        </Box>

        <Select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as number)}
          displayEmpty
          fullWidth
          startAdornment={
            <InputAdornment position="start">
              <ShieldIcon sx={{ color: 'text.primary' }} />
            </InputAdornment>
          }
          sx={{
            bgcolor: 'background.paper',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '& .MuiSelect-select': {
              color: 'text.primary',
            },
          }}
        >
          <MenuItem value="" disabled>Select Role</MenuItem>
          {roles?.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
            {filteredPermissions.length ? (
              filteredPermissions.map((perm, idx) => (
                <motion.div
                  key={perm!.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Tooltip title={perm!.name}>
                    <Chip
                      label={perm!.name}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </Tooltip>
                </motion.div>
              ))
            ) : selectedRole ? (
              <Typography variant="body2" sx={{ mt: 2 }}>
                No permissions found for this role.
              </Typography>
            ) : null}
          </Box>
        )}
      </Stack>
    </Card>
  );
}
