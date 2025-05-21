import React, { Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  IconButton,
  Divider,
  Tooltip,
  Grid,
} from '@mui/material';
import { useTeam } from '../../api/hooks/teams/useTeam';
import { useUsers } from '../../api/hooks/users/useUsers';
import { useDepartments } from '../../api/hooks/departments/useDepartments';
import { UserBasicInfo } from '../../types/user.types';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';


export default function TeamDetail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const teamId = parseInt(id || '0', 10);

  const { data: team, isLoading: isLoadingTeam } = useTeam(teamId);
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: departments } = useDepartments();

  // Filter users that belong to this team
  const teamMembers = users.filter(user => user.team_id === teamId);
  const department = departments?.find(dept => dept.id === team?.department_id);

  // Check if user has admin privileges (role_id 1 or 2)
  const hasAdminPrivileges = user?.role_id === 1 || user?.role_id === 2;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      // Add your delete logic here
      navigate('/teams');
    }
  };

  if (isLoadingTeam || isLoadingUsers) {
    return <Typography>Loading...</Typography>;
  }

  if (!team) {
    return <Typography>Team not found</Typography>;
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/teams')}
            sx={{ mb: 2 }}
          >
            Back to Teams
          </Button>
          <Typography variant="h4" sx={{ mb: 1 }}>{team.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon fontSize="small" />
            {department?.name || 'No Department'}
          </Typography>
        </Box>
        
        {hasAdminPrivileges && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/users/new')}
            >
              Add Member
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete Team
            </Button>
          </Box>
        )}
      </Box>

      {/* Team Stats */}
      <Grid container spacing={3}>
        <Grid sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Team Overview</Typography>
            <Stack spacing={2}>
              <Box>
                <Typography color="text.secondary" variant="body2">Total Members</Typography>
                <Typography variant="h4">{teamMembers.length}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2">Department</Typography>
                <Typography>{department?.name || 'No Department'}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <Card>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Team Members</Typography>
              {teamMembers.length > 0 ? (
                <List>
                  {teamMembers.map((member: UserBasicInfo) => (
                    <Fragment key={member.id}>
                      <ListItem
                        secondaryAction={
                          <Tooltip title="Send email">
                            <IconButton edge="end" onClick={() => window.location.href = `mailto:${member.email}`}>
                              <EmailIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {member.first_name?.[0]}{member.last_name?.[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${member.first_name} ${member.last_name}`}
                          secondary={member.email}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>No members in this team</Typography>
                  {hasAdminPrivileges && (
                    <Button variant="outlined" onClick={() => navigate('/users/new')}>
                      Add Team Member
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}