import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeam } from '../../services/team.service';
import { TeamCreate, TeamResponse } from '../../../types/team.types';

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation<TeamResponse, Error, TeamCreate>({
    mutationFn: (teamData) => createTeam(teamData),
    onSuccess: (data) => {
      // Invalidate teams list
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      
      // If we know the department ID, invalidate related queries
      if (data.department_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['departments', data.department_id] 
        });
      }
    },
  });
};