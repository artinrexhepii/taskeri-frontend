import { useQuery } from '@tanstack/react-query';
import { getProjectUsers } from '../../services/user-project.service';
import { UserBasicInfo } from '../../../types/user.types';

export const useProjectUsers = (projectId: number, enabled = true) => {
  return useQuery<UserBasicInfo[], Error>({
    queryKey: ['project-users', projectId],
    queryFn: () => getProjectUsers(projectId),
    enabled: !!projectId && enabled,
  });
};

export default useProjectUsers;