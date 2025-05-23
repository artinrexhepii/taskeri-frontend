import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography
} from '@mui/material';
import { useUserLeaveRequests } from '../../api/hooks/leave-requests/useUserLeaveRequests';
import { useDeleteLeaveRequest } from '../../api/hooks/leave-requests/useDeleteLeaveRequest';
import { useAuth } from '../../context/AuthContext'; // or wherever it's defined


export default function UserLeaveRequests() {
  const { user } = useAuth();
  const userId = user?.id ?? 1;
  const { data } = useUserLeaveRequests(userId);
  const deleteLeaveRequest = useDeleteLeaveRequest();

  const handleDelete = (id: number) => {
    deleteLeaveRequest.mutate({ id, userId });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        My Leave Requests
      </Typography>
      <Stack spacing={2}>
        {(data || []).map((req) => (
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