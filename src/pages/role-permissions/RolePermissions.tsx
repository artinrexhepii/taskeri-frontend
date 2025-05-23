import { useState } from 'react';
import {
  Box, Card, Typography, Select, MenuItem,
  Stack, Chip, CircularProgress, InputAdornment, Tooltip
} from '@mui/material';
import { useRoles } from '../../api/hooks/roles/useRoles';
import { useRolePermissionsByRole } from '../../api/hooks/role-permissions/useGetPermissionFromRole';
import ShieldIcon from '@mui/icons-material/Shield';
import { motion } from 'framer-motion';

export default function RolePermissionViewer() {
  const [selectedRole, setSelectedRole] = useState<number | ''>('');
  const { data: roles, isLoading: loadingRoles } = useRoles();

  const {
    data: rolePermissions,
    isLoading: loadingRolePerms,
    refetch: refetchRolePerms,
  } = useRolePermissionsByRole(Number(selectedRole), !!selectedRole);

  const isLoading = loadingRoles || loadingRolePerms;

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
            {rolePermissions && rolePermissions.length > 0 ? (
              rolePermissions.map((perm, idx) => (
                <motion.div
                  key={perm.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Tooltip title={perm.name}>
                    <Chip
                      label={perm.name}
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
