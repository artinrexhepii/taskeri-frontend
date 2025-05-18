export interface NotificationCreate {
  user_id: number;
  message: string;
  link?: string;
  is_read?: boolean;
}

export interface NotificationUpdate {
  is_read?: boolean;
}

export interface NotificationResponse {
  id: number;
  user_id: number;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}