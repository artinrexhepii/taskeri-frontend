import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography
} from '@mui/material';
import { useLeaveRequests } from '../../api/hooks/leave-requests/useLeaveRequests';
import { useUpdateLeaveStatus } from '../../api/hooks/leave-requests/useUpdateLeaveStatus';

export default function AdminLeaveActions() {
  const { data } = useLeaveRequests();

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Approve/Reject Requests
      </Typography>
      <Stack spacing={2}>
        {(data?.items || []).map((req) => {
          const updateStatus = useUpdateLeaveStatus(req.id);
          return (
            <Card key={req.id} sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Typography><strong>{req.leave_type}</strong> from {req.start_date} to {req.end_date}</Typography>
                <Typography>Status: {req.status}</Typography>
                <Typography>Reason: {req.reason || '—'}</Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => updateStatus.mutate('Approved')}
                    disabled={req.status === 'Approved'}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => updateStatus.mutate('Rejected')}
                    disabled={req.status === 'Rejected'}
                  >
                    Reject
                  </Button>
                </Stack>
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}