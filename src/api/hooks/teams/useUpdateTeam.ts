import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTeam } from '../../services/team.service';
import { TeamUpdate, TeamResponse } from '../../../types/team.types';

interface UpdateTeamVariables {
  id: number;
  teamData: TeamUpdate;
}

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation<TeamResponse, Error, UpdateTeamVariables>({
    mutationFn: ({ id, teamData }) => updateTeam(id, teamData),
    onSuccess: (data, variables) => {
      // Invalidate team query
      queryClient.invalidateQueries({ queryKey: ['teams', variables.id] });
      // Invalidate teams list
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};