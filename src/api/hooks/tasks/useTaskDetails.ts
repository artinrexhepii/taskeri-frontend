import { useQuery } from '@tanstack/react-query';
import { getTaskDetails } from '../../services/task.service';
import { TaskDetailResponse } from '../../../types/task.types';

export const useTaskDetails = (taskId: number) => {
  return useQuery<TaskDetailResponse, Error>({
    queryKey: ['tasks', taskId, 'details'],
    queryFn: () => getTaskDetails(taskId),
    enabled: !!taskId,
  });
};