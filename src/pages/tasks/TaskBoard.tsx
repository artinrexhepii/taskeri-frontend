import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../api/hooks/tasks/useTasks';
import { TaskPriority, TaskStatus } from '../../types/task.types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useUpdateTask } from '../../api/hooks/tasks/useUpdateTask';
import { TaskResponse } from '../../types/task.types';

interface Task extends TaskResponse {
  due_date?: string;
}

export default function TaskBoard() {
  const navigate = useNavigate();
  const { data: tasksData } = useTasks();
  const { mutate: updateTask } = useUpdateTask();
  const tasks = tasksData?.items || [];

  const columns = {
    [TaskStatus.TODO]: {
      title: 'To Do',
      items: tasks.filter((task) => task.status === TaskStatus.TODO),
    },
    [TaskStatus.IN_PROGRESS]: {
      title: 'In Progress',
      items: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS),
    },
    [TaskStatus.TECHNICAL_REVIEW]: {
      title: 'Technical Review',
      items: tasks.filter((task) => task.status === TaskStatus.TECHNICAL_REVIEW),
    },
    [TaskStatus.DONE]: {
      title: 'Done',
      items: tasks.filter((task) => task.status === TaskStatus.DONE),
    },
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const task = tasks.find((t) => t.id === Number(draggableId));
    if (task) {
      updateTask({
        id: task.id,
        taskData: {
          ...task,
          status: destination.droppableId as TaskStatus,
        },
      });
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Task Board</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/tasks/new')}
          >
            New Task
          </Button>
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={2}>
            {Object.entries(columns).map(([columnId, column]) => (
              <Grid key={columnId} sx={{ width: { xs: '100%', md: '25%' } }}>
                <Card sx={{ height: '100%' }}>
                  <Box p={2}>
                    <Typography variant="h6" gutterBottom>
                      {column.title}
                    </Typography>
                    <Droppable droppableId={columnId}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{ minHeight: 500 }}
                        >
                          {column.items.map((task: Task, index: number) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    p: 2,
                                    mb: 2,
                                    cursor: 'pointer',
                                    '&:hover': {
                                      bgcolor: 'action.hover',
                                    },
                                  }}
                                  onClick={() => navigate(`/tasks/${task.id}`)}
                                >
                                  <Typography variant="subtitle1">
                                    {task.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                    }}
                                  >
                                    {task.description}
                                  </Typography>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      </Stack>
    </Container>
  );
}
