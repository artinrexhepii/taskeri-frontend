import { useQuery } from '@tanstack/react-query';
import { getCommentById } from '../../services/comment.service';
import { CommentResponse } from '../../../types/comment.types';

export const useComment = (commentId: number) => {
  return useQuery<CommentResponse, Error>({
    queryKey: ['comments', commentId],
    queryFn: () => getCommentById(commentId),
    enabled: !!commentId, // Only run if commentId is provided
  });
};