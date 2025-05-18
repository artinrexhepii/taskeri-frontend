export interface FileAttachmentBase {
  task_id: number;
  file_path: string;
}

export interface FileAttachmentCreate extends FileAttachmentBase {}

export interface FileAttachmentUpdate {
  file_path?: string;
}

export interface FileAttachmentResponse {
  id: number;
  file_path: string;
  uploaded_at: string;
}