import { useQuery } from '@tanstack/react-query';
import { getProjectStatistics } from '../../services/project.service';
import { ProjectStatistics } from '../../../types/project.types';

export const useProjectStatistics = () => {
  return useQuery<ProjectStatistics, Error>({
    queryKey: ['projects', 'statistics'],
    queryFn: getProjectStatistics,
    // Statistics might not change as frequently
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};