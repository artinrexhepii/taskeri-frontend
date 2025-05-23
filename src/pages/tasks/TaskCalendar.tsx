import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../api/hooks/tasks/useTasks';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TaskStatus } from '../../types/task.types';

export default function TaskCalendar() {
  const navigate = useNavigate();
  const { data: tasksData } = useTasks();
  const tasks = tasksData?.items || [];

  const getEventColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return '#757575';
      case TaskStatus.IN_PROGRESS:
        return '#1976d2';
      case TaskStatus.TECHNICAL_REVIEW:
        return '#ed6c02';
      case TaskStatus.DONE:
        return '#2e7d32';
      default:
        return '#1976d2';
    }
  };

  const events = tasks.map((task) => ({
    id: task.id.toString(),
    title: task.name,
    start: task.due_date,
    end: task.due_date,
    backgroundColor: getEventColor(task.status),
    borderColor: getEventColor(task.status),
    textColor: '#ffffff',
    extendedProps: {
      description: task.description,
      status: task.status,
    },
  }));

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Task Calendar</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/tasks/new')}
            sx={{ bgcolor: 'teal', color: 'white' }}
          >
            New Task
          </Button>
        </Box>

        <Box sx={{ height: 'calc(100vh - 200px)' }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            eventClick={(info) => {
              navigate(`/tasks/${info.event.id}`);
            }}
            eventContent={(eventInfo) => (
              <Box sx={{ p: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {eventInfo.event.title}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  {eventInfo.event.extendedProps.status}
                </Typography>
              </Box>
            )}
            height="100%"
          />
        </Box>
      </Stack>
    </Container>
  );
} 