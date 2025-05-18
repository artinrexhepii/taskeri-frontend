import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../../services/comment.service';

interface DeleteCommentVariables {
  id: number;
  taskId?: number; // Used for cache invalidation
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, DeleteCommentVariables>({
    mutationFn: ({ id }) => deleteComment(id),
    onSuccess: (_, variables) => {
      // Remove specific comment from cache
      queryClient.removeQueries({ queryKey: ['comments', variables.id] });
      
      // If we know the task ID, invalidate related queries
      if (variables.taskId) {
        queryClient.invalidateQueries({ 
          queryKey: ['comments', 'task', variables.taskId] 
        });
        
        // Invalidate task details
        queryClient.invalidateQueries({ 
          queryKey: ['tasks', variables.taskId, 'details'] 
        });
      }
    },
  });
};