import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileAttachment } from '../../services/file-attachment.service';
import { FileAttachmentCreate, FileAttachmentResponse } from '../../../types/file.types';

export const useCreateFileAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation<FileAttachmentResponse, Error, FileAttachmentCreate>({
    mutationFn: (attachment) => createFileAttachment(attachment),
    onSuccess: (data) => {
      // Invalidate file attachments queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ['file-attachments'] });
      
      // If the attachment is for a specific task, invalidate that task's attachments
      if (data.task_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['file-attachments', 'task', data.task_id] 
        });
      }
    },
  });
};

export default useCreateFileAttachment;