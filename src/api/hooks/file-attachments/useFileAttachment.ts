import { useQuery } from '@tanstack/react-query';
import { getFileAttachmentById } from '../../services/file-attachment.service';
import { FileAttachmentResponse } from '../../../types/file.types';

export const useFileAttachment = (id: number, enabled = true) => {
  return useQuery<FileAttachmentResponse, Error>({
    queryKey: ['file-attachments', id],
    queryFn: () => getFileAttachmentById(id),
    enabled: !!id && enabled,
  });
};

export default useFileAttachment;