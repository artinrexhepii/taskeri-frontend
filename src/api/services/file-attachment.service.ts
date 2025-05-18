import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  FileAttachmentCreate, 
  FileAttachmentUpdate, 
  FileAttachmentResponse 
} from '../../types/file.types';

export const getFileAttachments = async (): Promise<FileAttachmentResponse[]> => {
  return apiClient.get(API_ENDPOINTS.ATTACHMENTS.BASE);
};

export const getFileAttachmentById = async (id: number): Promise<FileAttachmentResponse> => {
  return apiClient.get(API_ENDPOINTS.ATTACHMENTS.DETAIL(id));
};

export const getFileAttachmentsByTask = async (taskId: number): Promise<FileAttachmentResponse[]> => {
  return apiClient.get(API_ENDPOINTS.ATTACHMENTS.BY_TASK(taskId));
};

export const createFileAttachment = async (attachment: FileAttachmentCreate): Promise<FileAttachmentResponse> => {
  return apiClient.post(API_ENDPOINTS.ATTACHMENTS.BASE, attachment);
};

export const updateFileAttachment = async (id: number, attachment: FileAttachmentUpdate): Promise<FileAttachmentResponse> => {
  return apiClient.put(API_ENDPOINTS.ATTACHMENTS.DETAIL(id), attachment);
};

export const deleteFileAttachment = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ATTACHMENTS.DETAIL(id));
};