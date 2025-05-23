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
import { LeaveRequestResponse } from '../../types/leave-request.types';
import { useUsersByIds } from '../../api/hooks/users/useUser';

export default function AdminLeaveActions() {
  const { data } = useLeaveRequests();
  const updateStatus = useUpdateLeaveStatus();

  const userIds = data?.items.map((req) => req.user_id) || [];
  const { data: users } = useUsersByIds(userIds);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Approve/Reject Requests
      </Typography>
      <Stack spacing={2}>
        {(data?.items || []).map((req: LeaveRequestResponse) => {
          const user = users?.find((u) => u.id === req.user_id);
          return (
            <Card key={req.id} sx={{ p: 2 }}>
              <Stack spacing={1}>
                {user && (
                  <Typography variant="h6">
                   {user.first_name} {user.last_name}
                  </Typography>
                )}
                <Typography><strong>{req.leave_type}</strong> from {req.start_date} to {req.end_date}</Typography>
                <Typography>Status: {req.status}</Typography>
                <Typography>Reason: {req.reason || '—'}</Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => updateStatus.mutate({ id: req.id, status: 'Approved' })}
                    disabled={req.status === 'Approved'}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => updateStatus.mutate({ id: req.id, status: 'Rejected' })}
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
