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

// For backward compatibility
export interface FileAttachmentCreate {
  task_id: number;
  file: File; // Browser File object
}