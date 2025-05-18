export interface TimeLogCreate {
  task_id: number;
  start_time: string;
  end_time: string;
}

export interface TimeLogUpdate {
  start_time?: string;
  end_time?: string;
  duration?: number;
}

export interface TimeLogResponse {
  id: number;
  user_id: number;
  task_id: number;
  start_time: string;
  end_time: string;
  duration: number;
}

export interface AttendanceResponse {
  id: number;
  user_id: number;
  check_in: string;
  check_out?: string;
}