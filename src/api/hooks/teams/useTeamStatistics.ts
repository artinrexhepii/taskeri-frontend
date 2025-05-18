import { useQuery } from "@tanstack/react-query";
import { TeamStatistics } from "../../../types/team.types";
import { getTeamStatistics } from "../../services/team.service";

export const useTeamStatistics = () => {
    return useQuery<TeamStatistics, Error>({
      queryKey: ['teams', 'statistics'],
      queryFn: getTeamStatistics,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };