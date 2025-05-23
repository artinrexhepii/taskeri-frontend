import { useQuery } from "@tanstack/react-query";
import { getTaskStatistics } from "../../services/task.service";
import { TaskStatistics } from "../../../types/task.types";

export const useTaskStatistics = () => {
  return useQuery<TaskStatistics, Error>({
    queryKey: ["tasks", "statistics"],
    queryFn: getTaskStatistics,
    // Statistics might not change as frequently, so we can increase staleTime
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
