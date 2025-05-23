import { useQuery } from '@tanstack/react-query';
import { getTeams } from '../../services/team.service';
import { TeamResponse } from '../../../types/team.types';

export const useTeams = () => {
  return useQuery<TeamResponse[], Error>({
    queryKey: ['teams'],
    queryFn: getTeams,
  });
};

export default useTeams;