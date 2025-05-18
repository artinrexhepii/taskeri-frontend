import { useQuery } from '@tanstack/react-query';
import { getFileAttachments } from '../../services/file-attachment.service';
import { FileAttachmentResponse } from '../../../types/file.types';

export const useFileAttachments = (enabled = true) => {
  return useQuery<FileAttachmentResponse[], Error>({
    queryKey: ['file-attachments'],
    queryFn: getFileAttachments,
    enabled,
  });
};

export default useFileAttachments;