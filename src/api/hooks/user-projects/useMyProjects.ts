import { useQuery } from '@tanstack/react-query';
import { getMyProjects } from '../../services/user-project.service';
import { ProjectBasicInfo } from '../../../types/project.types';

export const useMyProjects = (enabled = true) => {
  return useQuery<ProjectBasicInfo[], Error>({
    queryKey: ['user-projects', 'me'],
    queryFn: getMyProjects,
    enabled,
  });
};

export default useMyProjects;