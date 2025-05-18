import { useQuery } from '@tanstack/react-query';
import { getCommentsByTask } from '../../services/comment.service';
import { CommentResponse } from '../../../types/comment.types';
import { PaginatedResponse } from '../../../types/api.types';

export const useCommentsByTask = (taskId: number) => {
  return useQuery<PaginatedResponse<CommentResponse>, Error>({
    queryKey: ['comments', 'task', taskId],
    queryFn: () => getCommentsByTask(taskId),
    enabled: !!taskId,
  });
};