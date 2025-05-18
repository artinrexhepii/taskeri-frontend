import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  CommentCreate, 
  CommentUpdate, 
  CommentResponse 
} from '../../types/comment.types';
import { PaginatedResponse } from '../../types/api.types';

export const getCommentById = async (id: number): Promise<CommentResponse> => {
  return apiClient.get(API_ENDPOINTS.COMMENTS.DETAIL(id));
};

export const getCommentsByTask = async (taskId: number): Promise<PaginatedResponse<CommentResponse>> => {
  return apiClient.get(API_ENDPOINTS.COMMENTS.BY_TASK(taskId));
};

export const createComment = async (comment: CommentCreate): Promise<CommentResponse> => {
  return apiClient.post(API_ENDPOINTS.COMMENTS.BASE, comment);
};

export const updateComment = async (id: number, comment: CommentUpdate): Promise<CommentResponse> => {
  return apiClient.put(API_ENDPOINTS.COMMENTS.DETAIL(id), comment);
};

export const deleteComment = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.COMMENTS.DETAIL(id));
};