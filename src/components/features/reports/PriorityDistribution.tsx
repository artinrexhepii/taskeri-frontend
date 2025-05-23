import { motion } from "framer-motion";
import { TaskStatistics } from "./types";
import { itemVariants } from "./animations";

interface PriorityDistributionProps {
  taskStats: TaskStatistics;
}

export const PriorityDistribution: React.FC<PriorityDistributionProps> = ({
  taskStats,
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        By Priority
      </h4>
      <div className="space-y-3">
        {taskStats?.tasks_by_priority ? (
          Object.entries(taskStats.tasks_by_priority).map(
            ([priority, count]) => (
              <motion.div
                key={priority}
                variants={itemVariants}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {priority}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {count} tasks
                  </span>
                </div>
              </motion.div>
            )
          )
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">No priority data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
