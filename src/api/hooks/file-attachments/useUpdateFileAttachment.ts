import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFileAttachment } from '../../services/file-attachment.service';
import { FileAttachmentUpdate, FileAttachmentResponse } from '../../../types/file.types';

export const useUpdateFileAttachment = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    FileAttachmentResponse, 
    Error, 
    FileAttachmentUpdate
  >({
    mutationFn: (attachment) => updateFileAttachment(id, attachment),
    onSuccess: (data) => {
      // Invalidate specific file attachment query
      queryClient.invalidateQueries({ queryKey: ['file-attachments', id] });
      
      // Invalidate all file attachments query
      queryClient.invalidateQueries({ queryKey: ['file-attachments'] });
      
      // Invalidate task attachments query if task_id is available
      if (data.task_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['file-attachments', 'task', data.task_id] 
        });
      }
    },
  });
};

export default useUpdateFileAttachment;