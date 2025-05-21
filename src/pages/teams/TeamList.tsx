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
  alpha,
  Fade,
  Grow,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Groups as GroupsIcon,
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTeams } from '../../api/hooks/teams/useTeams';
import { useDeleteTeam } from '../../api/hooks/teams/useDeleteTeam';
import { useCreateTeam } from '../../api/hooks/teams/useCreateTeam';
import { useDepartments } from '../../api/hooks/departments/useDepartments';
import { useUsers } from '../../api/hooks/users/useUsers';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Stack spacing={3}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Card 
            sx={{ 
              p: 4,
              background: `linear-gradient(135deg, ${alpha('#0EA5E9', 0.1)} 0%, ${alpha('#0EA5E9', 0.05)} 100%)`,
              border: `1px solid ${alpha('#0EA5E9', 0.2)}`,
              borderRadius: 2,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
            }}>
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: alpha('#0EA5E9', 0.1),
                      color: '#0EA5E9',
                    }}
                  >
                    <GroupsIcon />
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'text.primary',
                    }}
                  >
                    Teams
                  </Typography>
                </Stack>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    maxWidth: '600px',
                  }}
                >
                  Manage your organization's teams and their members
                </Typography>
              </Box>
              {hasAdminPrivileges && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setModalOpen(true)}
                  sx={{
                    px: 3,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  Add Team
                </Button>
              )}
            </Box>
          </Card>
        </motion.div>

        {/* Search and Teams Grid */}
        <motion.div variants={itemVariants}>
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
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
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
                  {filteredTeams?.map((team, index) => (
                    <TableRow 
                      key={team.id}
                      hover
                      onClick={() => handleTeamClick(team.id)}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: alpha('#0EA5E9', 0.04),
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: alpha('#0EA5E9', 0.1), 
                              color: '#0EA5E9',
                              mr: 2,
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              }
                            }}
                          >
                            <GroupsIcon />
                          </Avatar>
                          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                            {team.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Typography sx={{ color: 'text.primary' }}>
                            {departments?.find((dept) => dept.id === team.department_id)?.name || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Chip
                            label={`${getTeamMemberCount(team.id)} members`}
                            size="small"
                            sx={{
                              bgcolor: alpha('#0EA5E9', 0.1),
                              color: '#0EA5E9',
                              fontWeight: 'medium',
                              '&:hover': {
                                bgcolor: alpha('#0EA5E9', 0.2),
                              }
                            }}
                          />
                        </Box>
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
                              sx={{ 
                                color: 'error.main',
                                '&:hover': {
                                  bgcolor: 'error.lighter',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease-in-out',
                              }}
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
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.lighter',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease-in-out',
                            }}
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
        </motion.div>
      </Stack>

      {/* Create Team Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 4,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: alpha('#0EA5E9', 0.1),
                color: '#0EA5E9',
              }}
            >
              <GroupsIcon />
            </Box>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Create New Team
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              label="Team Name"
              fullWidth
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GroupsIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Select
              fullWidth
              displayEmpty
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              label="Department"
              startAdornment={
                <InputAdornment position="start">
                  <BusinessIcon color="primary" />
                </InputAdornment>
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
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
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setModalOpen(false)}
            sx={{
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2,
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateTeam}
            disabled={createTeamMutation.status === 'pending'}
            sx={{
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }}
          >
            {createTeamMutation.status === 'pending' ? 'Creating...' : 'Create Team'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
