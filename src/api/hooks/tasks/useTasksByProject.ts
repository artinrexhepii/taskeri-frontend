import { useQuery } from '@tanstack/react-query';
import { getTasksByProject } from '../../services/task.service';
import { TaskResponse } from '../../../types/task.types';

export const useTasksByProject = (projectId: number) => {
  return useQuery<TaskResponse[], Error>({
    queryKey: ['tasks', 'project', projectId],
    queryFn: () => getTasksByProject(projectId),
    enabled: !!projectId,
  });
};