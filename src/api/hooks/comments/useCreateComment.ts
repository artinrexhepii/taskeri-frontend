import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../../services/comment.service';
import { CommentCreate, CommentResponse } from '../../../types/comment.types';

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CommentResponse, Error, CommentCreate>({
    mutationFn: (commentData) => createComment(commentData),
    onSuccess: (data) => {
      // Invalidate comments for the task
      queryClient.invalidateQueries({ 
        queryKey: ['comments', 'task', data.task_id] 
      });
      
      // Invalidate task details as it might include comments
      queryClient.invalidateQueries({ 
        queryKey: ['tasks', data.task_id, 'details'] 
      });
    },
  });
};