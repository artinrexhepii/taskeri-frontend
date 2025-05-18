import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '../../services/comment.service';
import { CommentUpdate, CommentResponse } from '../../../types/comment.types';

interface UpdateCommentVariables {
  id: number;
  commentData: CommentUpdate;
  taskId?: number; // Used for cache invalidation
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CommentResponse, Error, UpdateCommentVariables>({
    mutationFn: ({ id, commentData }) => updateComment(id, commentData),
    onSuccess: (data, variables) => {
      // Invalidate specific comment
      queryClient.invalidateQueries({ queryKey: ['comments', variables.id] });
      
      // If we know the task ID, invalidate comments for that task
      if (variables.taskId) {
        queryClient.invalidateQueries({ 
          queryKey: ['comments', 'task', variables.taskId] 
        });
        
        // Also invalidate task details
        queryClient.invalidateQueries({ 
          queryKey: ['tasks', variables.taskId, 'details'] 
        });
      }
    },
  });
};