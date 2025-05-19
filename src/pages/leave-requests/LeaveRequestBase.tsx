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
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Typography variant="h4">Leave Management</Typography>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="Create Request" />
              <Tab label="My Requests" />
              <Tab label="All Requests" />
              <Tab label="Admin Approval" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <LeaveRequestForm />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <UserLeaveRequests />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <LeaveRequestList />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <AdminLeaveActions />
          </TabPanel>
        </Card>
      </Stack>
    </Container>
  );
}
