import { useQuery } from '@tanstack/react-query';
import { getTasksByUser } from '../../services/task.service';
import { TaskResponse } from '../../../types/task.types';

export const useTasksByUser = (userId: number) => {
  return useQuery<TaskResponse[], Error>({
    queryKey: ['tasks', 'user', userId],
    queryFn: () => getTasksByUser(userId),
    enabled: !!userId,
  });
};