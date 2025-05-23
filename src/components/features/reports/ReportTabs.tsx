import {
  DocumentChartBarIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

interface ReportTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange("projects")}
          className={`${
            activeTab === "projects"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } whitespace-nowrap border-b-2 py-4 px-1 font-medium transition-colors duration-200`}
        >
          <DocumentChartBarIcon className="h-5 w-5 inline-block mr-2" />
          Project Statistics
        </button>
        <button
          onClick={() => onTabChange("tasks")}
          className={`${
            activeTab === "tasks"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } whitespace-nowrap border-b-2 py-4 px-1 font-medium transition-colors duration-200`}
        >
          <ClipboardDocumentListIcon className="h-5 w-5 inline-block mr-2" />
          Task Statistics
        </button>
      </nav>
    </div>
  );
};
