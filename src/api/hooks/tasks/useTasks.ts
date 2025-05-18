import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../../services/task.service';
import { TaskResponse, TaskFilterParams } from '../../../types/task.types';
import { PaginatedResponse } from '../../../types/api.types';

interface UseTasksOptions {
  page?: number;
  pageSize?: number;
  filters?: TaskFilterParams;
  enabled?: boolean;
}

export const useTasks = ({
  page = 1,
  pageSize = 10,
  filters,
  enabled = true,
}: UseTasksOptions = {}) => {
  return useQuery<PaginatedResponse<TaskResponse>, Error>({
    queryKey: ['tasks', page, pageSize, filters],
    queryFn: () => getTasks(page, pageSize, filters),
    placeholderData: (previousData) => previousData,
    enabled,
  });
};