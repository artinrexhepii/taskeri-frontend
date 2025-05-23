import { motion, Variants } from "framer-motion";
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  PauseCircleIcon,
} from "@heroicons/react/24/outline";
import { containerVariants, itemVariants } from "./animations";
import Card from "../../common/Card/Card";
import { ProjectStatistics } from "./types";

interface ProjectOverviewCardsProps {
  projectStats: ProjectStatistics;
}

export const ProjectOverviewCards: React.FC<ProjectOverviewCardsProps> = ({
  projectStats,
}) => {
  const totalProjects = Object.values(projectStats).reduce(
    (acc, curr) => acc + curr,
    0
  );

  const getPercentage = (value: number): number => {
    if (totalProjects === 0) return 0;
    return Math.round((value / totalProjects) * 100);
  };

  const statusConfigs = [
    {
      label: "Completed",
      value: projectStats.Completed,
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-600",
      icon: CheckCircleIcon,
    },
    {
      label: "In Progress",
      value: projectStats.In_Progress,
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-600",
      icon: ClockIcon,
    },
    {
      label: "Not Started",
      value: projectStats.Not_Started,
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      textColor: "text-gray-600",
      icon: ChartBarIcon,
    },
    {
      label: "On Hold",
      value: projectStats.On_Hold,
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-600",
      icon: PauseCircleIcon,
    },
  ] as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statusConfigs.map((config) => (
        <motion.div
          key={config.label}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card
            className={`h-full ${config.bgColor} hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${config.iconBg} rounded-lg`}>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    <config.icon className={`h-6 w-6 ${config.iconColor}`} />
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {config.label}
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <p className={`text-3xl font-bold ${config.textColor}`}>
                    {config.value}
                  </p>
                  <p className={`text-sm ${config.textColor}`}>
                    {getPercentage(config.value)}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`${config.textColor} bg-current h-1.5 rounded-full transition-all duration-500 ease-in-out`}
                    style={{ width: `${getPercentage(config.value)}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
