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
  alpha,
  Fade,
  Grow,
  Paper,
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
  Groups as GroupsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

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

  if (isLoadingTeam || isLoadingUsers) {
    return <Typography>Loading...</Typography>;
  }

  if (!team) {
    return <Typography>Team not found</Typography>;
  }

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
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/teams')}
                  sx={{ 
                    mb: 3,
                    color: 'text.primary',
                    '&:hover': { 
                      bgcolor: 'action.hover',
                      transform: 'translateX(-4px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Back to Teams
                </Button>
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
                    {team.name}
                  </Typography>
                </Stack>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    maxWidth: '600px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <BusinessIcon fontSize="small" />
                  {department?.name || 'No Department'}
                </Typography>
              </Box>
              
              {hasAdminPrivileges && (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/users/new')}
                    sx={{
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      }
                    }}
                  >
                    Add Member
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    sx={{
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      }
                    }}
                  >
                    Delete Team
                  </Button>
                </Stack>
              )}
            </Box>
          </Card>
        </motion.div>

        {/* Team Stats */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3}>
            <Grid sx={{ width: { xs: '100%', md: '33.33%' } }}>
              <Card 
                sx={{ 
                  p: 3,
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2,
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <GroupsIcon color="primary" />
                  Team Overview
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography 
                      color="text.secondary" 
                      variant="body2"
                      sx={{ mb: 1 }}
                    >
                      Total Members
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: 'text.primary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <PersonIcon color="primary" />
                      {teamMembers.length}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography 
                      color="text.secondary" 
                      variant="body2"
                      sx={{ mb: 1 }}
                    >
                      Department
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: 'text.primary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <BusinessIcon color="primary" />
                      {department?.name || 'No Department'}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid sx={{ width: { xs: '100%', md: '66.67%' } }}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <PersonIcon color="primary" />
                    Team Members
                  </Typography>
                  {teamMembers.length > 0 ? (
                    <List>
                      {teamMembers.map((member: UserBasicInfo, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <ListItem
                            sx={{
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                bgcolor: alpha('#0EA5E9', 0.04),
                                transform: 'translateX(4px)',
                              }
                            }}
                            secondaryAction={
                              <Tooltip title="Send email">
                                <IconButton 
                                  edge="end" 
                                  onClick={() => window.location.href = `mailto:${member.email}`}
                                  sx={{ 
                                    color: 'primary.main',
                                    '&:hover': {
                                      bgcolor: 'primary.lighter',
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                  }}
                                >
                                  <EmailIcon />
                                </IconButton>
                              </Tooltip>
                            }
                          >
                            <ListItemAvatar>
                              <Avatar 
                                sx={{ 
                                  bgcolor: alpha('#0EA5E9', 0.1),
                                  color: '#0EA5E9',
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                  }
                                }}
                              >
                                {member.first_name?.[0]}{member.last_name?.[0]}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography 
                                  sx={{ 
                                    color: 'text.primary',
                                    fontWeight: 'medium',
                                  }}
                                >
                                  {`${member.first_name} ${member.last_name}`}
                                </Typography>
                              }
                              secondary={
                                <Typography 
                                  sx={{ 
                                    color: 'text.secondary',
                                  }}
                                >
                                  {member.email}
                                </Typography>
                              }
                            />
                          </ListItem>
                          <Divider component="li" />
                        </motion.div>
                      ))}
                    </List>
                  ) : (
                    <Box 
                      sx={{ 
                        py: 8, 
                        textAlign: 'center',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        }
                      }}
                    >
                      <PersonIcon 
                        sx={{ 
                          fontSize: 48, 
                          color: 'text.secondary',
                          mb: 2,
                        }} 
                      />
                      <Typography 
                        color="text.secondary" 
                        sx={{ mb: 1 }}
                      >
                        No members in this team
                      </Typography>
                      {hasAdminPrivileges && (
                        <Button 
                          variant="outlined" 
                          onClick={() => navigate('/users/new')}
                          startIcon={<AddIcon />}
                          sx={{
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 2,
                            }
                          }}
                        >
                          Add Team Member
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Stack>
    </motion.div>
  );
}