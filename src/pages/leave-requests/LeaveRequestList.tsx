import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography
} from '@mui/material';
import useLeaveRequests from '../../api/hooks/leave-requests/useLeaveRequests';
import { LeaveRequestResponse } from '../../types/leave-request.types';
import { useDeleteLeaveRequest } from '../../api/hooks/leave-requests/useDeleteLeaveRequest';

export default function LeaveRequestList() {
  const { data } = useLeaveRequests();
  const deleteLeaveRequest = useDeleteLeaveRequest();
  const userId = 1; // Replace with actual user context or prop

  const handleDelete = (id: number) => {
    deleteLeaveRequest.mutate({ id, userId });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        All Leave Requests
      </Typography>
      <Stack spacing={2}>
        {(data?.items || []).map((req: LeaveRequestResponse) => (
          <Card key={req.id} sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography><strong>{req.leave_type}</strong> from {req.start_date} to {req.end_date}</Typography>
              <Typography>Status: {req.status}</Typography>
              <Typography>Reason: {req.reason || '—'}</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(req.id)}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

