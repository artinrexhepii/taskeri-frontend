import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useTaskTimeLogs } from '../../../api/hooks/time-logs/useTaskTimeLogs';
import { useCreateTimeLog } from '../../../api/hooks/time-logs/useCreateTimeLog';
import { useDeleteTimeLog } from '../../../api/hooks/time-logs/useDeleteTimeLog';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


interface TaskTimeTrackingProps {
  taskId: number;
}

export default function TaskTimeTracking({ taskId }: TaskTimeTrackingProps) {
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const { data: timeEntriesData } = useTaskTimeLogs(taskId);
  const { mutate: createTimeEntry } = useCreateTimeLog();
  const { mutate: deleteTimeEntry } = useDeleteTimeLog();

  const handleCreateEntry = () => {
    if (!startTime || !endTime || !description.trim()) return;

    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    if (duration <= 0) {
      alert("End time must be after start time.");
      return;
    }

    createTimeEntry({
      task_id: taskId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    });

    setStartTime(null);
    setEndTime(null);
    setDescription('');
  };


  const handleDelete = (entryId: number) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      deleteTimeEntry({
        id: entryId,
        taskId,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <DateTimePicker
              label="Start Time"
              value={startTime ? dayjs(startTime) : null}
              onChange={(newValue) => setStartTime(newValue ? newValue.toDate() : null)}
            />
            <DateTimePicker
              label="End Time"
              value={endTime ? dayjs(endTime) : null}
              onChange={(newValue) => setEndTime(newValue ? newValue.toDate() : null)}
            />
            <Button
              variant="contained"
              onClick={handleCreateEntry}
              disabled={!description.trim() || !startTime || !endTime}
            >
              Save Time Entry
            </Button>
          </Stack>
        </LocalizationProvider>
      </Card>


      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeEntriesData?.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.task_id}</TableCell>
                <TableCell>
                  {format(new Date(entry.start_time), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  {format(new Date(entry.end_time), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>{formatDuration(entry.duration)}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
} 