import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
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
import { useFileAttachments } from '../../api/hooks/file-attachments/useFileAttachments';
import { useCreateFileAttachment } from '../../api/hooks/file-attachments/useCreateFileAttachment';
import { useDeleteFileAttachment } from '../../api/hooks/file-attachments/useDeleteFileAttachment';
import { format } from 'date-fns';

export default function FileAttachments() {
  const { data: attachments, isLoading } = useFileAttachments();
  const { mutate: createAttachment } = useCreateFileAttachment();
  const { mutate: deleteAttachment } = useDeleteFileAttachment();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);
      createAttachment({
        task_id: 0, // This will be updated when attaching to a task
        file_path: file.name,
      });
    });
  };

  const handleDelete = (attachmentId: number) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      deleteAttachment({
        id: attachmentId,
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

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">File Attachments</Typography>

      <Card>
        <Box sx={{ p: 3 }}>
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

          <List>
            {attachments?.map((attachment) => (
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
                        {attachment.task_id && (
                          <Typography variant="caption">
                            Task ID: {attachment.task_id}
                          </Typography>
                        )}
                      </Stack>
                    }
                  />
                </ListItem>
              </Card>
            ))}
          </List>
        </Box>
      </Card>
    </Stack>
  );
} 