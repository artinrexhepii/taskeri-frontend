import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useTeams } from '../../api/hooks/teams/useTeams';
import { useDeleteTeam } from '../../api/hooks/teams/useDeleteTeam';
import { useCreateTeam } from '../../api/hooks/teams/useCreateTeam';
import { useDepartments } from '../../api/hooks/departments/useDepartments';

export default function TeamList() {
  const navigate = useNavigate();
  const { data: teams, isLoading } = useTeams();
  const { mutate: deleteTeam } = useDeleteTeam();
  const createTeamMutation = useCreateTeam();
  const { data: departments } = useDepartments();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');

  const filteredTeams = teams?.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Teams</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
          >
            Add Team
          </Button>
        </Box>

        {/* Search Field */}
        <Card>
          <Box sx={{ p: 2 }}>
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

          {/* Teams Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTeams?.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>
                      {
                        departments?.find((dept) => dept.id === team.department_id)?.name || '—'
                      }
                    </TableCell>                    
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => navigate(`/teams/${team.id}`)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(team.id)}>
                          <DeleteIcon />
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
            {createTeamMutation.status === 'pending' ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
