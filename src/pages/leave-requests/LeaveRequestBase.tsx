import { useState } from 'react';
import {
  Box,
  Card,
  Stack,
  Tab,
  Tabs,
  Typography,
  Container,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

import LeaveRequestForm from './LeaveRequestForm';
import LeaveRequestList from './LeaveRequestList';
import AdminLeaveActions from './LeaveRequestUpdate';
import UserLeaveRequests from './LeaveRequestUser';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leave-tabpanel-${index}`}
      aria-labelledby={`leave-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function LeaveManagementTabs() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Define which tabs should be visible based on role
  const isAdmin = user?.role_id === 1;
  const isManager = user?.role_id === 2;
  const isEmployee = user?.role_id === 3;

  const getTabs = () => {
    if (isAdmin) {
      return [{ label: "Admin Approval", component: <AdminLeaveActions /> }];
    }
    
    if (isManager) {
      return [
        { label: "Create Request", component: <LeaveRequestForm /> },
        { label: "My Requests", component: <UserLeaveRequests /> },
        { label: "All Requests", component: <LeaveRequestList /> },
        { label: "Admin Approval", component: <AdminLeaveActions /> }
      ];
    }
    
    // Employee (role_id 3) or default case
    return [
      { label: "Create Request", component: <LeaveRequestForm /> },
      { label: "My Requests", component: <UserLeaveRequests /> }
    ];
  };

  const tabs = getTabs();

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Typography variant="h4">Leave Management</Typography>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable" 
              scrollButtons="auto"
            >
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </Tabs>
          </Box>

          {tabs.map((tab, index) => (
            <TabPanel key={index} value={tabValue} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </Card>
      </Stack>
    </Container>
  );
}
