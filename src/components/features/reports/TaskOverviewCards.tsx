import { motion } from "framer-motion";
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { containerVariants, itemVariants } from "./animations";
import Card from "../../common/Card/Card";

import { TaskStatistics } from "./types";

interface TaskOverviewCardsProps {
  taskStats: TaskStatistics;
}

export const TaskOverviewCards: React.FC<TaskOverviewCardsProps> = ({
  taskStats,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="h-full">
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ClipboardDocumentListIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Total Tasks
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-gray-900">
                {taskStats?.total_tasks || 0}
              </p>
              <p className="text-sm text-gray-500">All Tasks</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="h-full bg-green-50">
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-green-600">
                {taskStats?.completed_tasks || 0}
              </p>
              <p className="text-sm text-gray-500">Completed Tasks</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="h-full bg-red-50">
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Overdue</h3>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-red-600">
                {taskStats?.overdue_tasks || 0}
              </p>
              <p className="text-sm text-gray-500">Overdue Tasks</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
