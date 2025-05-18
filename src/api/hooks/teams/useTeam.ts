import { useQuery } from '@tanstack/react-query';
import { getTeamById } from '../../services/team.service';
import { TeamResponse } from '../../../types/team.types';

export const useTeam = (teamId: number) => {
  return useQuery<TeamResponse, Error>({
    queryKey: ['teams', teamId],
    queryFn: () => getTeamById(teamId),
    enabled: !!teamId,
  });
};