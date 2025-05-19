import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LeaveRequestCreate, LeaveType } from '../../types/leave-request.types';
import { useCreateLeaveRequest } from '../../api/hooks/leave-requests/useCreateLeaveRequest';


export default function LeaveRequestForm() {
  const navigate = useNavigate();
  const createLeaveRequest = useCreateLeaveRequest();

  const [formData, setFormData] = useState<LeaveRequestCreate>({
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    leave_type: 'Vacation',
    reason: '',
  });

  const handleChange = (field: keyof LeaveRequestCreate) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLeaveRequest.mutateAsync(formData);
      navigate('/leave-requests');
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Stack spacing={3}>
        <Typography variant="h4">New Leave Request</Typography>

        <Card>
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Start Date"
                  value={formData.start_date}
                  onChange={handleChange('start_date')}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="End Date"
                  value={formData.end_date}
                  onChange={handleChange('end_date')}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>

              <TextField
                fullWidth
                select
                label="Leave Type"
                value={formData.leave_type}
                onChange={handleChange('leave_type')}
              >
                {['Vacation', 'Sick Leave', 'Personal', 'Other'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Reason (optional)"
                value={formData.reason}
                onChange={handleChange('reason')}
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate('/leave-requests')}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  Submit Request
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}
