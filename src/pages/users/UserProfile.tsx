import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import { useUserProfile } from '../../api/hooks/user-profiles/useUserProfile';
import { useCreateUserProfile } from '../../api/hooks/user-profiles/useCreateUserProfile';
import { useUpdateUserProfile } from '../../api/hooks/user-profiles/useUpdateUserProfile';
import { useUsers } from '../../api/hooks/users/useUsers';
import { UserProfileCreate, UserProfileUpdate } from '../../types/user-profile.types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-profile-tabpanel-${index}`}
      aria-labelledby={`user-profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserProfiles() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [formCreate, setFormCreate] = useState<UserProfileCreate>({
    user_id: 0,
    position: '',
    skills: '',
    bio: '',
  });

  const [formUpdate, setFormUpdate] = useState<UserProfileUpdate>({
    position: '',
    skills: '',
    bio: '',
  });

  const userProfileQuery = useUserProfile(selectedUserId ?? 0);
  const createProfile = useCreateUserProfile();
  const updateProfile = useUpdateUserProfile();
  const usersQuery = useUsers();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setFormCreate({
        user_id: 0,
        position: '',
        skills: '',
        bio: '',
      });
    }
  };

  const handleCreateSubmit = () => {
    if (!formCreate.user_id) return;
    createProfile.mutate(formCreate);
  };

  const handleUpdateSubmit = () => {
    if (selectedUserId) {
      updateProfile.mutate({
        userId: selectedUserId,
        profileData: formUpdate,
      });
    }
  };

  // Load profile data into update form when a user is selected and profile data is fetched
  useEffect(() => {
    if (userProfileQuery.data && tabValue === 2) {
      setFormUpdate({
        position: userProfileQuery.data.position || '',
        skills: userProfileQuery.data.skills || '',
        bio: userProfileQuery.data.bio || '',
      });
    }
  }, [userProfileQuery.data, selectedUserId, tabValue]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">User Profiles</Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Create Profile" />
            <Tab label="View Profile" />
            <Tab label="Update Profile" />
          </Tabs>
        </Box>

        {/* Tab 0: Create Profile */}
        <TabPanel value={tabValue} index={0}>
          <Stack spacing={2}>
            {usersQuery.isLoading ? (
              <Typography>Loading users...</Typography>
            ) : (
              <TextField
                select
                label="Select User (by Email)"
                value={formCreate.user_id}
                onChange={(e) =>
                  setFormCreate((prev) => ({ ...prev, user_id: Number(e.target.value) }))
                }
              >
                {usersQuery.data?.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.email}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              label="Position"
              value={formCreate.position}
              onChange={(e) =>
                setFormCreate((prev) => ({ ...prev, position: e.target.value }))
              }
            />
            <TextField
              label="Skills"
              multiline
              value={formCreate.skills}
              onChange={(e) =>
                setFormCreate((prev) => ({ ...prev, skills: e.target.value }))
              }
            />
            <TextField
              label="Bio"
              multiline
              value={formCreate.bio}
              onChange={(e) => setFormCreate((prev) => ({ ...prev, bio: e.target.value }))}
            />

            <Button variant="contained" onClick={handleCreateSubmit}>
              Create Profile
            </Button>
          </Stack>
        </TabPanel>

        {/* Tab 1: View Profile */}
        <TabPanel value={tabValue} index={1}>
          <Stack spacing={2}>
            <TextField
              select
              label="Select User (by Email)"
              value={selectedUserId ?? ''}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
            >
              {usersQuery.data?.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.email}
                </MenuItem>
              ))}
            </TextField>

            {selectedUserId && userProfileQuery.data ? (
              <Card sx={{ mt: 2, p: 2 }}>
                <Typography variant="h6">Profile Details</Typography>
                <Typography><strong>Position:</strong> {userProfileQuery.data.position}</Typography>
                <Typography><strong>Skills:</strong> {userProfileQuery.data.skills}</Typography>
                <Typography><strong>Bio:</strong> {userProfileQuery.data.bio}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography><strong>Profile Picture:</strong></Typography>
                  <img
                    src={userProfileQuery.data.profile_pic}
                    alt="Profile"
                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: 8 }}
                  />
                </Box>
              </Card>
            ) : (
              <Typography>Select a user to view their profile.</Typography>
            )}
          </Stack>
        </TabPanel>

        {/* Tab 2: Update Profile */}
        <TabPanel value={tabValue} index={2}>
          <TextField
            select
            label="Select User to Update (by Email)"
            value={selectedUserId ?? ''}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
          >
            {usersQuery.data?.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.email}
              </MenuItem>
            ))}
          </TextField>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Position"
              value={formUpdate.position}
              onChange={(e) =>
                setFormUpdate((prev) => ({ ...prev, position: e.target.value }))
              }
            />
            <TextField
              label="Skills"
              multiline
              value={formUpdate.skills}
              onChange={(e) => setFormUpdate((prev) => ({ ...prev, skills: e.target.value }))}
            />
            <TextField
              label="Bio"
              multiline
              value={formUpdate.bio}
              onChange={(e) => setFormUpdate((prev) => ({ ...prev, bio: e.target.value }))}
            />
            <Button
              variant="contained"
              onClick={handleUpdateSubmit}
              disabled={!selectedUserId}
            >
              Update Profile
            </Button>
          </Stack>
        </TabPanel>
      </Card>
    </Stack>
  );
}
