import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFileAttachment } from '../../services/file-attachment.service';

export const useDeleteFileAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; taskId?: number }>({
    mutationFn: ({ id }) => deleteFileAttachment(id),
    onSuccess: (_, variables) => {
      // Invalidate specific file attachment query
      queryClient.invalidateQueries({ queryKey: ['file-attachments', variables.id] });
      
      // Invalidate all file attachments query
      queryClient.invalidateQueries({ queryKey: ['file-attachments'] });
      
      // Invalidate task attachments query if taskId is provided
      if (variables.taskId) {
        queryClient.invalidateQueries({ 
          queryKey: ['file-attachments', 'task', variables.taskId] 
        });
      }
    },
  });
};

export default useDeleteFileAttachment;