import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useTaskStatistics } from "../../api/hooks/tasks/useTaskStatistics";
import { useProjectStatistics } from "../../api/hooks/projects/useProjectStatistics";
import { useTasks } from "../../api/hooks/tasks/useTasks";
import {
  containerVariants,
  itemVariants,
  ProjectOverviewCards,
  TaskOverviewCards,
  TaskDistributionCard,
  ReportTabs,
} from "../../components/features/reports";

import {
  TaskStatistics,
  ProjectStatistics,
} from "../../components/features/reports/types";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("projects");
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);

  const { data: taskStats, isLoading: isLoadingTaskStats } =
    useTaskStatistics();
  const { data: projectStats, isLoading: isLoadingProjectStats } =
    useProjectStatistics();
  const { data: tasksData } = useTasks({ pageSize: 100 }); // Fetch all tasks
  const tasks = tasksData?.items || [];

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: { [key: string]: typeof tasks } = {};

    // First initialize all status groups from taskStats
    if (taskStats?.tasks_by_status) {
      Object.keys(taskStats.tasks_by_status).forEach((status) => {
        grouped[status] = [];
      });
    }

    // Then populate with actual tasks
    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        if (task?.status) {
          if (!grouped[task.status]) {
            grouped[task.status] = [];
          }
          grouped[task.status].push(task);
        }
      });
    }

    return grouped;
  }, [tasks, taskStats?.tasks_by_status]);

  const exportTaskStatisticsToCSV = () => {
    if (!taskStats || !tasks) return;

    // Create CSV content for task statistics
    const statsHeaders = ["Status", "Number of Tasks"];
    const statsRows = Object.entries(taskStats.tasks_by_status || {}).map(
      ([status, count]) => [status, count]
    );

    const statsContent = [statsHeaders, ...statsRows]
      .map((row) => row.join(","))
      .join("\n");

    // Create CSV content for task details
    const taskDetailsHeaders = ["Task Name", "Status", "Created Date"];
    const taskDetailsRows = tasks.map((task) => [
      task.name?.replace(/,/g, ";") || "",
      task.status || "",
      task.created_at ? new Date(task.created_at).toLocaleDateString() : "",
    ]);

    const taskDetailsContent = [taskDetailsHeaders, ...taskDetailsRows]
      .map((row) => row.join(","))
      .join("\n");

    // Download task statistics CSV
    const date = new Date().toISOString().split("T")[0];
    downloadCSV(statsContent, `task_statistics_summary_${date}.csv`);
    downloadCSV(taskDetailsContent, `task_details_${date}.csv`);
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleStatusClick = (status: string) => {
    setExpandedStatus(expandedStatus === status ? null : status);
  };

  if (isLoadingProjectStats || isLoadingTaskStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const projectStatistics =
    projectStats ||
    ({
      Not_Started: 0,
      In_Progress: 0,
      Completed: 0,
      On_Hold: 0,
    } as ProjectStatistics);

  const taskStatistics = taskStats || {
    total_tasks: 0,
    completed_tasks: 0,
    overdue_tasks: 0,
    tasks_by_status: {},
    tasks_by_priority: {},
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      <motion.div variants={itemVariants} className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-gray-500">
            View detailed statistics and analytics about your tasks and projects
          </p>
        </div>

        <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        {activeTab === "projects" ? (
          <ProjectOverviewCards projectStats={projectStatistics} />
        ) : (
          <>
            <TaskOverviewCards taskStats={taskStatistics} />
            <TaskDistributionCard
              taskStats={taskStatistics}
              tasksByStatus={tasksByStatus}
              expandedStatus={expandedStatus}
              onStatusClick={handleStatusClick}
              onExportClick={exportTaskStatisticsToCSV}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
