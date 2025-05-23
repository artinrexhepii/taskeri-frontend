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
import { useUsersByIds } from '../../api/hooks/users/useUser';

export default function LeaveRequestList() {
  const { data } = useLeaveRequests();
  const deleteLeaveRequest = useDeleteLeaveRequest();

  const userIds = data?.items.map((req) => req.user_id) || [];
  const { data: users } = useUsersByIds(userIds);

  const handleDelete = (id: number) => {
    deleteLeaveRequest.mutate({ id });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        All Leave Requests
      </Typography>
      <Stack spacing={2}>
        {(data?.items || []).map((req: LeaveRequestResponse) => {
          const user = users?.find((u) => u.id === req.user_id);
          return (
            <Card key={req.id} sx={{ p: 2 }}>
              <Stack spacing={1}>
                {user && (
                  <Typography variant="h6">
                    User: {user.first_name} {user.last_name}
                  </Typography>
                )}
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
          );
        })}
      </Stack>
    </Container>
  );
}

