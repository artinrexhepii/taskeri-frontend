import { useQuery } from '@tanstack/react-query';
import { getUserProjects } from '../../services/user-project.service';
import { ProjectBasicInfo } from '../../../types/project.types';

export const useUserProjects = (userId: number, enabled = true) => {
  return useQuery<ProjectBasicInfo[], Error>({
    queryKey: ['user-projects', userId],
    queryFn: () => getUserProjects(userId),
    enabled: !!userId && enabled,
  });
};

export default useUserProjects;