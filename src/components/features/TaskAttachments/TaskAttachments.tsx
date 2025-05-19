import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useTaskAttachments } from '../../../api/hooks/file-attachments/useTaskAttachments';
import { useCreateFileAttachment } from '../../../api/hooks/file-attachments/useCreateFileAttachment';
import { useDeleteFileAttachment } from '../../../api/hooks/file-attachments/useDeleteFileAttachment';
import { format } from 'date-fns';

interface TaskAttachmentsProps {
  taskId: number;
}

export default function TaskAttachments({ taskId }: TaskAttachmentsProps) {
  const { data: attachmentsData } = useTaskAttachments(taskId);
  const { mutate: createAttachment } = useCreateFileAttachment();
  const { mutate: deleteAttachment } = useDeleteFileAttachment();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);
      createAttachment({
        task_id: taskId,
        file_path: file.name,
      });
    });
  };

  const handleDelete = (attachmentId: number) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      deleteAttachment({
        id: attachmentId,
        taskId,
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon />;
    }
    return <FileIcon />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Stack spacing={3}>
      <Box>
        <input
          type="file"
          id="file-upload"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <label htmlFor="file-upload">
          <Button
            component="span"
            variant="contained"
            startIcon={<AttachFileIcon />}
          >
            Upload Files
          </Button>
        </label>
      </Box>

      <List>
        {attachmentsData?.map((attachment) => (
          <Card key={attachment.id} sx={{ mb: 2 }}>
            <ListItem
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <IconButton
                    edge="end"
                    onClick={() => window.open(attachment.file_path, '_blank')}
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(attachment.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              }
            >
              <ListItemIcon>
                {getFileIcon(attachment.file_path)}
              </ListItemIcon>
              <ListItemText
                primary={attachment.file_path.split('/').pop()}
                secondary={
                  <Stack direction="row" spacing={2}>
                    <Typography variant="caption">
                      {format(new Date(attachment.uploaded_at), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
          </Card>
        ))}
      </List>
    </Stack>
  );
}