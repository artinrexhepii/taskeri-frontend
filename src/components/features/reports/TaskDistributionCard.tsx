import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { itemVariants } from "./animations";
import { TaskStatistics, TasksByStatus } from "./types";
import Card from "../../common/Card/Card";
import Button from "../../common/Button/Button";

interface TaskDistributionCardProps {
  taskStats: TaskStatistics;
  tasksByStatus: TasksByStatus;
  expandedStatus: string | null;
  onStatusClick: (status: string) => void;
  onExportClick: () => void;
}

export const TaskDistributionCard: React.FC<TaskDistributionCardProps> = ({
  taskStats,
  tasksByStatus,
  expandedStatus,
  onStatusClick,
  onExportClick,
}) => {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Task Distribution
              </h3>
            </div>
            <Button
              variant="outline"
              onClick={onExportClick}
              className="bg-white"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                By Status
              </h4>
              <div className="space-y-3">
                {taskStats?.tasks_by_status ? (
                  Object.entries(taskStats.tasks_by_status).map(
                    ([status, count]) => (
                      <motion.div
                        key={status}
                        variants={itemVariants}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => onStatusClick(status)}
                        >
                          <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {status}
                            <motion.div
                              animate={{
                                rotate: expandedStatus === status ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                            </motion.div>
                          </span>
                          <span className="text-sm font-semibold text-primary">
                            {count} tasks
                          </span>
                        </div>

                        <AnimatePresence>
                          {expandedStatus === status && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 space-y-2">
                                {tasksByStatus[status]?.length ? (
                                  tasksByStatus[status].map((task) => (
                                    <div
                                      key={task.id}
                                      className="p-2 bg-white rounded border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-900">
                                          {task.name}
                                        </span>
                                        {task.due_date && (
                                          <span className="text-xs text-gray-500">
                                            Due:{" "}
                                            {new Date(
                                              task.due_date
                                            ).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                      {task.description && (
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                          {task.description}
                                        </p>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-4 text-center">
                                    <p className="text-sm text-gray-500">
                                      No tasks found with this status
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  )
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">
                      No task status data available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Priority Distribution */}
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
                    <p className="text-sm text-gray-500">
                      No priority data available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
