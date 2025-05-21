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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useCompany } from '../../api/hooks/companies/useCompany';
import { useCompanySettings } from '../../api/hooks/company-settings/useCompanySettings';
import { useCreateCompanySettings } from '../../api/hooks/company-settings/useCreateCompanySettings';
import { useUpdateCompanySettings } from '../../api/hooks/company-settings/useUpdateCompanySettings';
import { useDeleteCompanySettings } from '../../api/hooks/company-settings/useDeleteCompanySettings';
import { CompanySettingsCreate, CompanySettingsUpdate } from '../../types/company.types';

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
  const [formData, setFormData] = useState<Omit<CompanySettingsCreate, 'company_id'>>({
    timezone: '',
    work_hours_per_day: 8,
  });

  const createSettings = useCreateCompanySettings();

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
      createSettings.mutate(
        {
          company_id: createCompanyId,
          ...formData,
        },
        {
          onSuccess: () => console.log('Settings created'),
          onError: (err) => console.error(err),
        }
      );
    }
  };

  // Tab 2: View Settings
  const [viewCompanyId, setViewCompanyId] = useState<number | null>(null);
  const [triggerView, setTriggerView] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<CompanySettingsUpdate>({
    timezone: '',
    work_hours_per_day: 8,
  });

  const {
    data: viewSettings,
    isLoading: isLoadingViewSettings,
    refetch: refetchViewSettings,
  } = useCompanySettings(viewCompanyId);

  const updateSettings = useUpdateCompanySettings();
  const deleteSettings = useDeleteCompanySettings();

  const handleEditClick = () => {
    if (viewSettings) {
      setEditForm({
        timezone: viewSettings.timezone,
        work_hours_per_day: viewSettings.work_hours_per_day,
      });
      setEditOpen(true);
    }
  };

  const handleEditSubmit = () => {
    if (viewCompanyId) {
      updateSettings.mutate(
        {
          id: viewCompanyId,
          settingsData: editForm,
        },
        {
          onSuccess: () => {
            setEditOpen(false);
            refetchViewSettings();
          },
          onError: (err) => {
            console.error('Update failed:', err);
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (viewCompanyId && window.confirm('Are you sure you want to delete these settings?')) {
      deleteSettings.mutate(viewCompanyId, {
        onSuccess: () => {
          console.log('Settings deleted');
          setViewCompanyId(null);
        },
        onError: (err) => {
          console.error('Delete failed:', err);
        },
      });
    }
  };

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
                disabled={createSettings.isPending || !createCompanyId}
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

                <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                  <Button variant="outlined" color="primary" onClick={handleEditClick}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleDelete}>
                    Delete
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </TabPanel>
      </Card>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              fullWidth
              label="Timezone"
              name="timezone"
              value={editForm.timezone}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, timezone: e.target.value }))
              }
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
              value={editForm.work_hours_per_day}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  work_hours_per_day: Number(e.target.value),
                }))
              }
              inputProps={{ min: 1, max: 24 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
