import { useQuery } from '@tanstack/react-query';
import { getFileAttachmentsByTask } from '../../services/file-attachment.service';
import { FileAttachmentResponse } from '../../../types/file.types';

export const useTaskAttachments = (taskId: number, enabled = true) => {
  return useQuery<FileAttachmentResponse[], Error>({
    queryKey: ['file-attachments', 'task', taskId],
    queryFn: () => getFileAttachmentsByTask(taskId),
    enabled: !!taskId && enabled,
  });
};

export default useTaskAttachments;