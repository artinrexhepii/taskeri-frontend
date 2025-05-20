import { useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, InputAdornment, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography, Collapse
} from '@mui/material';
import {
  Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon,
  ExpandLess, ExpandMore, Search as SearchIcon
} from '@mui/icons-material';
import { useDepartments } from '../../api/hooks/departments/useDepartments';
import { useCreateDepartment } from '../../api/hooks/departments/useCreateDepartment';
import { useDeleteDepartment } from '../../api/hooks/departments/useDeleteDepartment';
import { useUpdateDepartment } from '../../api/hooks/departments/useUpdateDepartment';
import { useCompanyById } from '../../api/hooks/companies/useCompanyById';
import { useTeams } from '../../api/hooks/teams/useTeams';
import { useCreateTeam } from '../../api/hooks/teams/useCreateTeam';
import { useDeleteTeam } from '../../api/hooks/teams/useDeleteTeam';
import { useUpdateTeam } from '../../api/hooks/teams/useUpdateTeam';

export default function CompanyDepartmentsPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const companyIdNum = parseInt(companyId || '', 10);
  const { data: company, isLoading: companyLoading } = useCompanyById(companyIdNum);
  const { data: departments, isLoading } = useDepartments();
  const { data: teams } = useTeams();

  const { mutate: createDepartment } = useCreateDepartment();
  const { mutate: deleteDepartment } = useDeleteDepartment();
  const { mutate: updateDepartment } = useUpdateDepartment();

  const { mutate: createTeam } = useCreateTeam();
  const { mutate: deleteTeam } = useDeleteTeam();
  const { mutate: updateTeam } = useUpdateTeam();

  const [expandedDeptId, setExpandedDeptId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);

  const [teamName, setTeamName] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);

  const filteredDepartments = departments
    ?.filter((dept) => dept.company_id === companyIdNum)
    .filter((dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const departmentTeams = (departmentId: number) =>
    teams?.filter((team) => team.department_id === departmentId) || [];

  const openCreateModal = () => {
    setEditingDepartmentId(null);
    setDepartmentName('');
    setModalOpen(true);
  };

  const openEditModal = (id: number, name: string) => {
    setEditingDepartmentId(id);
    setDepartmentName(name);
    setModalOpen(true);
  };

  const handleSaveDepartment = () => {
    if (!departmentName) return alert('Department name is required');
    const payload = { name: departmentName, company_id: companyIdNum };

    if (editingDepartmentId !== null) {
      updateDepartment({ id: editingDepartmentId, departmentData: { name: departmentName } }, {
        onSuccess: () => {
          setModalOpen(false);
          setEditingDepartmentId(null);
        },
      });
    } else {
      createDepartment(payload, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const openTeamModal = (deptId: number, teamId: number | null = null, name = '') => {
    setTeamName(name);
    setSelectedDeptId(deptId);
    setEditingTeamId(teamId);
    setTeamModalOpen(true);
  };

  const handleSaveTeam = () => {
    if (!teamName || !selectedDeptId) return alert('Team name and department are required');

    const payload = { name: teamName, department_id: selectedDeptId };
    if (editingTeamId !== null) {
      updateTeam({ id: editingTeamId, teamData: { name: teamName } }, {
        onSuccess: () => setTeamModalOpen(false),
      });
    } else {
      createTeam(payload, {
        onSuccess: () => setTeamModalOpen(false),
      });
    }
  };

  const handleDelete = (departmentId: number) => {
    if (window.confirm('Delete this department?')) deleteDepartment(departmentId);
  };

  const handleDeleteTeam = (teamId: number) => {
    if (window.confirm('Delete this team?')) deleteTeam(teamId);
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Departments of {companyLoading ? '...' : company?.name || `Company #${companyId}`}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal}>
          Add Department
        </Button>
      </Box>

      <Card>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search departments..."
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
                <TableCell>Department Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDepartments?.map((dept) => (
                <Box key={dept.id}>
                  <TableRow>
                    <TableCell onClick={() => setExpandedDeptId(expandedDeptId === dept.id ? null : dept.id)} sx={{ cursor: 'pointer' }}>
                      {expandedDeptId === dept.id ? <ExpandLess /> : <ExpandMore />} {dept.name}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => openEditModal(dept.id, dept.name)}><EditIcon /></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(dept.id)}><DeleteIcon /></IconButton>
                        <Button size="small" onClick={() => openTeamModal(dept.id)}>+ Add Team</Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={"w-full"} sx={{ py: 0 }}>
                      <Collapse in={expandedDeptId === dept.id} timeout="auto" unmountOnExit>
                        <Box sx={{ pl: 4, pr: 4, width: '100%' }}>
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Teams:</Typography>
                            <Stack spacing={1}>
                            {departmentTeams(dept.id).map((team) => (
                                <Box
                                key={team.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    px: 2,
                                    py: 0.5,
                                    borderBottom: '1px solid #eee',
                                    '&:hover': { backgroundColor: '#f9f9f9' },
                                    width: '100%',
                                }}
                                >
                                <Typography sx={{ flexGrow: 1 }}>{team.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton size="small" onClick={() => openTeamModal(dept.id, team.id, team.name)}>
                                    <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteTeam(team.id)}>
                                    <DeleteIcon />
                                    </IconButton>
                                </Box>
                                </Box>
                            ))}
                            </Stack>
                        </Box>
                        </Collapse>

                    </TableCell>
                  </TableRow>
                </Box>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Department Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingDepartmentId ? 'Edit Department' : 'Create Department'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Department Name"
              fullWidth
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveDepartment}>
            {editingDepartmentId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Team Modal */}
      <Dialog open={teamModalOpen} onClose={() => setTeamModalOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingTeamId ? 'Edit Team' : 'Create Team'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Team Name"
              fullWidth
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTeamModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTeam}>
            {editingTeamId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
