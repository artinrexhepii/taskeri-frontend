import { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { useCompany } from '../../api/hooks/companies/useCompany';
import { useCompanySettings } from '../../api/hooks/company-settings/useCompanySettings';
import { useUpdateCompanySettings } from '../../api/hooks/company-settings/useUpdateCompanySettings';
import { CompanySettingsUpdate } from '../../types/company.types';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const { data: company, isLoading: isLoadingCompany } = useCompany();
  const { data: settings, isLoading: isLoadingSettings } = useCompanySettings(company?.[0]?.id || 0);
  const updateSettings = useUpdateCompanySettings();

  const [formData, setFormData] = useState<CompanySettingsUpdate>({
    timezone: settings?.timezone || '',
    work_hours_per_day: settings?.work_hours_per_day || 8,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'work_hours_per_day' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company?.[0]?.id) {
      updateSettings.mutate({
        id: company[0].id,
        settingsData: formData,
      });
    }
  };

  if (isLoadingCompany || isLoadingSettings) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Settings</Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Company Settings" />
            <Tab label="User Preferences" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
            <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextField
                  fullWidth
                  label="Timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  select
                >
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="America/New_York">Eastern Time</MenuItem>
                  <MenuItem value="America/Chicago">Central Time</MenuItem>
                  <MenuItem value="America/Denver">Mountain Time</MenuItem>
                  <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                </TextField>
              </Grid>
              <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextField
                  fullWidth
                  label="Work Hours Per Day"
                  name="work_hours_per_day"
                  type="number"
                  value={formData.work_hours_per_day}
                  onChange={handleInputChange}
                  inputProps={{ min: 1, max: 24 }}
                />
              </Grid>
              <Grid sx={{ width: '100%' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={updateSettings.isPending}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography>User preferences coming soon...</Typography>
        </TabPanel>
      </Card>
    </Stack>
  );
} 