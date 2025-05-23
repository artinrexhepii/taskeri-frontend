import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { LeaveRequestCreate, LeaveType } from "../../types/leave-request.types";
import { useCreateLeaveRequest } from "../../api/hooks/leave-requests/useCreateLeaveRequest";
import Card from "../../components/common/Card/Card";
import Button from "../../components/common/Button/Button";
import { useNotification } from "../../context/NotificationContext";
import { motion } from "framer-motion";

export default function LeaveRequestForm() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const createLeaveRequest = useCreateLeaveRequest();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<LeaveRequestCreate>({
    start_date: today,
    end_date: "",
    leave_type: "Vacation" as LeaveType,
    reason: "",
  });

  const handleChange =
    (field: keyof LeaveRequestCreate) =>
    (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLeaveRequest.mutateAsync(formData);
      showNotification(
        "success",
        "Leave request submitted",
        "Your leave request has been submitted successfully"
      );
      navigate("/leave-requests");
    } catch (error) {
      showNotification(
        "error",
        "Submission failed",
        error instanceof Error
          ? error.message
          : "Failed to submit leave request"
      );
    }
  };

  const leaveTypes: { value: LeaveType; color: string }[] = [
    { value: "Vacation", color: "bg-blue-100 text-blue-800" },
    { value: "Sick Leave", color: "bg-red-100 text-red-800" },
    { value: "Personal", color: "bg-purple-100 text-purple-800" },
    { value: "Other", color: "bg-gray-100 text-gray-800" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-8 max-w-2xl"
    >
      <motion.div className="space-y-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-gray-900">
            New Leave Request
          </h1>
          <p className="mt-1 text-gray-500">
            Submit a new leave request for approval
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <motion.div
              className="bg-primary/5 py-4 px-6 border-b border-gray-200"
              variants={itemVariants}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Request Details
              </h2>
            </motion.div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                      value={formData.start_date}
                      onChange={handleChange("start_date")}
                      min={today}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                      value={formData.end_date}
                      onChange={handleChange("end_date")}
                      min={formData.start_date}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {leaveTypes.map((type) => (
                    <motion.button
                      key={type.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          leave_type: type.value,
                        }))
                      }
                      className={`${
                        formData.leave_type === type.value
                          ? `${type.color} border-2 border-primary/20 shadow-md`
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100/80 hover:shadow-md"
                      } p-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                    >
                      {type.value}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <textarea
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 min-h-[120px] resize-y"
                  placeholder="Please provide a reason for your leave request..."
                  value={formData.reason}
                  onChange={handleChange("reason")}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-end space-x-3 pt-4 border-t border-gray-100"
              >
                <Button
                  variant="outline"
                  onClick={() => navigate("/leave-requests")}
                  className="bg-white"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
