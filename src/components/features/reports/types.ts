import type { TaskResponse } from "../../../types/task.types";
import {
  ProjectStatus,
  ProjectStatistics as IProjectStatistics,
} from "../../../types/project.types";

export type { IProjectStatistics as ProjectStatistics };
export { ProjectStatus };

export interface TaskStatistics {
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  tasks_by_status: {
    [key: string]: number;
  };
  tasks_by_priority: {
    [key: string]: number;
  };
}

export interface TasksByStatus {
  [key: string]: TaskResponse[];
}

