import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  Avatar,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { useCreateComment } from '../../../api/hooks/comments/useCreateComment';
import { useCommentsByTask } from '../../../api/hooks/comments/useCommentsByTask';
import { useAuth } from '../../../context/AuthContext';

interface TaskCommentsProps {
  taskId: number;
}

export default function TaskComments({ taskId }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const { data: commentsData } = useCommentsByTask(taskId);
  const { mutate: createComment } = useCreateComment();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    createComment({
      task_id: taskId,
      content: newComment,
      user_id: user.id,
    });
    setNewComment('');
  };

  return (
    <Stack spacing={3}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={!newComment.trim() || !user}
        >
          Post Comment
        </Button>
      </Box>

      <Stack spacing={2}>
        {commentsData?.items.map((comment) => (
          <Card key={comment.id} sx={{ p: 2 }}>
            <Stack direction="row" spacing={2}>
              <Avatar>
                {comment.user?.first_name?.[0]}
                {comment.user?.last_name?.[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle2">
                    {comment.user?.first_name} {comment.user?.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Stack>
                <Typography variant="body2">{comment.content}</Typography>
              </Box>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
} 