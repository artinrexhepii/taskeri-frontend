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

interface TaskTimeTrackingProps {
  taskId: number;
}

export default function TaskTimeTracking({ taskId }: TaskTimeTrackingProps) {
  const [description, setDescription] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { data: timeEntriesData } = useTaskTimeLogs(taskId);
  const { mutate: createTimeEntry } = useCreateTimeLog();
  const { mutate: deleteTimeEntry } = useDeleteTimeLog();

  const handleStartTracking = () => {
    setIsTracking(true);
    setStartTime(new Date());
  };

  const handleStopTracking = () => {
    if (!startTime) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    createTimeEntry({
      task_id: taskId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    });

    setIsTracking(false);
    setStartTime(null);
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
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isTracking}
          />
          <Box>
            {!isTracking ? (
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleStartTracking}
                disabled={!description.trim()}
              >
                Start Tracking
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                startIcon={<StopIcon />}
                onClick={handleStopTracking}
              >
                Stop Tracking
              </Button>
            )}
          </Box>
        </Stack>
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