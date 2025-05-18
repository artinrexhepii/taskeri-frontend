import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeam } from "../../services/team.service";

export const useDeleteTeam = () => {
    const queryClient = useQueryClient();
    
    return useMutation<{ message: string }, Error, number>({
      mutationFn: (teamId) => deleteTeam(teamId),
      onSuccess: (_, teamId) => {
        // Invalidate teams list
        queryClient.invalidateQueries({ queryKey: ['teams'] });
        // Remove team from cache
        queryClient.removeQueries({ queryKey: ['teams', teamId] });
      },
    });
  };