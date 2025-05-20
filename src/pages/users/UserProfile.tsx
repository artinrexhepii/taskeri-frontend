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
    profile_pic: '',
  });

  const [formUpdate, setFormUpdate] = useState<UserProfileUpdate>({
    position: '',
    skills: '',
    bio: '',
    profile_pic: '',
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
        profile_pic: '',
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
        profile_pic: userProfileQuery.data.profile_pic || '',
      });
    }
  }, [userProfileQuery.data, selectedUserId, tabValue]);