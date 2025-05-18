export interface FileAttachmentResponse {
  id: number;
  file_path: string;
  uploaded_at: string;
}

export interface FileAttachmentCreate {
  task_id: number;
  file: File; // Browser File object
}