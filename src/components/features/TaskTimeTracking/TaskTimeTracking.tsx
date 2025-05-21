import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Paper,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  AddCircleOutline as AddCircleIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useTaskTimeLogs } from '../../../api/hooks/time-logs/useTaskTimeLogs';
import { useCreateTimeLog } from '../../../api/hooks/time-logs/useCreateTimeLog';
import { useDeleteTimeLog } from '../../../api/hooks/time-logs/useDeleteTimeLog';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskTimeTrackingProps {
  taskId: number;
}

export default function TaskTimeTracking({ taskId }: TaskTimeTrackingProps) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const { data: timeEntriesData } = useTaskTimeLogs(taskId);
  const { mutate: createTimeEntry } = useCreateTimeLog();
  const { mutate: deleteTimeEntry } = useDeleteTimeLog();

  const handleCreateEntry = () => {
    if (!startTime || !endTime) return;
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    if (duration <= 0) {
      alert('End time must be after start time.');
      return;
    }
    createTimeEntry({
      task_id: taskId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    });
    setStartTime(null);
    setEndTime(null);
  };

  const handleDelete = (entryId: number) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      deleteTimeEntry({
        id: entryId,
        taskId,
      });
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(90deg, #e0f2fe 0%, #f1f5f9 100%)' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AccessTimeIcon color="primary" fontSize="large" />
            <Box>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Time Tracking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Log and review time entries for this task
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </motion.div>

      {/* Time Entry Form */}
      <motion.div variants={itemVariants}>
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <DateTimePicker
                label="Start Time"
                value={startTime ? dayjs(startTime) : null}
                onChange={(newValue) => setStartTime(newValue ? newValue.toDate() : null)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
              <DateTimePicker
                label="End Time"
                value={endTime ? dayjs(endTime) : null}
                onChange={(newValue) => setEndTime(newValue ? newValue.toDate() : null)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={handleCreateEntry}
                disabled={!startTime || !endTime}
                sx={{ minWidth: 160, fontWeight: 600 }}
              >
                Save Time Entry
              </Button>
            </Stack>
          </LocalizationProvider>
        </Paper>
      </motion.div>

      {/* Time Entries Table */}
      <motion.div variants={itemVariants}>
        <Paper elevation={1} sx={{ p: 0 }}>
          <Box sx={{ px: 3, pt: 2, pb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
              Time Entries
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Task ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">End Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {timeEntriesData?.map((entry, idx) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="bg-white hover:bg-blue-50 transition-colors"
                      style={{ display: 'table-row' }}
                    >
                      <td className="px-6 py-3 text-sm text-gray-700">{entry.task_id}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        <CalendarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        {format(new Date(entry.start_time), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        <CalendarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        {format(new Date(entry.end_time), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700 font-mono">
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        {formatDuration(entry.duration)}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <Tooltip title="Delete Entry">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {(!timeEntriesData || timeEntriesData.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-gray-400 text-sm">
                      No time entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Paper>
      </motion.div>
    </motion.div>
  );
} 