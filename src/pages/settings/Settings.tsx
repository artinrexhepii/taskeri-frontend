// src/pages/settings/Settings.tsx
import { useEffect, useState } from 'react';
import {
  Box,
  Card,
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

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
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
  const { data: companies, isLoading: isLoadingCompany } = useCompany();

  // Tab 1: Create Settings
  const [createCompanyId, setCreateCompanyId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CompanySettingsUpdate>({
    timezone: '',
    work_hours_per_day: 8,
  });

  const updateSettings = useUpdateCompanySettings();

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'work_hours_per_day' ? Number(value) : value,
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createCompanyId) {
      updateSettings.mutate({
        id: createCompanyId,
        settingsData: formData,
      });
    }
  };

  // Tab 2: View Settings
  const [viewCompanyId, setViewCompanyId] = useState<number | null>(null);
  const [triggerView, setTriggerView] = useState(false);

  const {
    data: viewSettings,
    isLoading: isLoadingViewSettings,
    refetch: refetchViewSettings,
  } = useCompanySettings(viewCompanyId);

  useEffect(() => {
    if (triggerView && viewCompanyId) {
      refetchViewSettings();
      setTriggerView(false);
    }
  }, [triggerView, viewCompanyId, refetchViewSettings]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFetchViewSettings = () => {
    if (viewCompanyId) {
      setTriggerView(true);
    }
  };

  if (isLoadingCompany) return <Typography>Loading companies...</Typography>;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Settings</Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Create Settings" />
            <Tab label="View Settings" />
          </Tabs>
        </Box>

        {/* Tab 1: Create Settings */}
        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleCreateSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                select
                label="Select Company"
                value={createCompanyId || ''}
                onChange={(e) => setCreateCompanyId(Number(e.target.value))}
              >
                {companies?.map((c: any) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleCreateInputChange}
                select
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="America/New_York">Eastern Time</MenuItem>
                <MenuItem value="America/Chicago">Central Time</MenuItem>
                <MenuItem value="America/Denver">Mountain Time</MenuItem>
                <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Work Hours Per Day"
                name="work_hours_per_day"
                type="number"
                value={formData.work_hours_per_day}
                onChange={handleCreateInputChange}
                inputProps={{ min: 1, max: 24 }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={updateSettings.isPending || !createCompanyId}
              >
                Save Settings
              </Button>
            </Stack>
          </form>
        </TabPanel>

        {/* Tab 2: View Settings */}
        <TabPanel value={tabValue} index={1}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              select
              label="Select Company"
              value={viewCompanyId || ''}
              onChange={(e) => setViewCompanyId(Number(e.target.value))}
            >
              {companies?.map((c: any) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="outlined"
              onClick={handleFetchViewSettings}
              disabled={!viewCompanyId}
            >
              Load Settings
            </Button>

            {isLoadingViewSettings && <Typography>Loading settings...</Typography>}

            {viewSettings && (
              <Box>
                <Typography><strong>Timezone:</strong> {viewSettings.timezone}</Typography>
                <Typography><strong>Work Hours Per Day:</strong> {viewSettings.work_hours_per_day}</Typography>
              </Box>
            )}
          </Stack>
        </TabPanel>
      </Card>
    </Stack>
  );
}
