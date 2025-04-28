import api from './index';
import { 
  CommentResponse, 
  CommentCreate, 
  CommentUpdate,
  CommentListResponse
} from '../types/comment.types';

const CommentService = {
  /**
   * Get paginated comments for a specific task
   */
  getTaskComments: async (taskId: number, page = 1, pageSize = 20): Promise<CommentListResponse> => {
    return api.get<CommentListResponse>(`/comments/task/${taskId}`, { 
      page, 
      page_size: pageSize 
    });
  },
  
  /**
   * Get a specific comment by ID
   */
  getComment: async (commentId: number): Promise<CommentResponse> => {
    return api.get<CommentResponse>(`/comments/${commentId}`);
  },
  
  /**
   * Create a new comment
   */
  createComment: async (data: CommentCreate): Promise<CommentResponse> => {
    return api.post<CommentResponse>('/comments', data);
  },
  
  /**
   * Update an existing comment
   */
  updateComment: async (commentId: number, data: CommentUpdate): Promise<CommentResponse> => {
    return api.put<CommentResponse>(`/comments/${commentId}`, data);
  },
  
  /**
   * Delete a comment
   */
  deleteComment: async (commentId: number): Promise<{ message: string }> => {
    return api.del<{ message: string }>(`/comments/${commentId}`);
  },
  
  /**
   * Get recent comments across all tasks
   */
  getRecentComments: async (limit: number = 10): Promise<CommentResponse[]> => {
    return api.get<CommentResponse[]>('/comments/recent', { limit });
  }
};

export default CommentService;