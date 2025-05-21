import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Groups as GroupsIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useTeams } from '../../api/hooks/teams/useTeams';
import { useDeleteTeam } from '../../api/hooks/teams/useDeleteTeam';
import { useCreateTeam } from '../../api/hooks/teams/useCreateTeam';
import { useDepartments } from '../../api/hooks/departments/useDepartments';
import { useUsers } from '../../api/hooks/users/useUsers';
import { useAuth } from '../../context/AuthContext';

export default function TeamList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: teams, isLoading } = useTeams();
  const { mutate: deleteTeam } = useDeleteTeam();
  const createTeamMutation = useCreateTeam();
  const { data: departments } = useDepartments();
  const { data: users = [] } = useUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');

  const filteredTeams = teams?.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTeamMemberCount = (teamId: number) => {
    return users.filter(user => user.team_id === teamId).length;
  };

  const handleDelete = (teamId: number) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      deleteTeam(teamId);
    }
  };

  const handleCreateTeam = () => {
    if (!newTeamName || !selectedDepartmentId) {
      alert('All fields are required');
      return;
    }

    createTeamMutation.mutate(
      {
        name: newTeamName,
        department_id: parseInt(selectedDepartmentId),
      },
      {
        onSuccess: () => {
          setModalOpen(false);
          setNewTeamName('');
          setSelectedDepartmentId('');
        },
      }
    );
  };

  const handleTeamClick = (teamId: number) => {
    navigate(`/teams/${teamId}`);
  };

  const hasAdminPrivileges = user?.role_id !== 3;

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>Teams</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your organization's teams and their members
            </Typography>
          </Box>
          {hasAdminPrivileges && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
              sx={{ px: 3 }}
            >
              Add Team
            </Button>
          )}
        </Box>

        {/* Search and Teams Grid */}
        <Card>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Team</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Members</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTeams?.map((team) => (
                  <TableRow 
                    key={team.id}
                    hover
                    onClick={() => handleTeamClick(team.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                          <GroupsIcon />
                        </Avatar>
                        <Typography variant="subtitle2">{team.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {departments?.find((dept) => dept.id === team.department_id)?.name || '—'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${getTeamMemberCount(team.id)} members`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {hasAdminPrivileges && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(team.id);
                            }}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/teams/${team.id}`);
                          }}
                          color="primary"
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Stack>

      {/* Create Team Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Team Name"
              fullWidth
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
            <Select
              fullWidth
              displayEmpty
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              label="Department"
            >
              <MenuItem value="" disabled>
                Select Department
              </MenuItem>
              {departments?.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateTeam}
            disabled={createTeamMutation.status === 'pending'}
          >
            {createTeamMutation.status === 'pending' ? 'Creating...' : 'Create Team'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
