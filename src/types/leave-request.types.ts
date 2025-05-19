export type LeaveType = "Vacation" | "Sick" | "Personal" | "Other";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRequestCreate {
  start_date: string;
  end_date: string;
  leave_type: LeaveType;
  reason?: string;
}

export interface LeaveRequestUpdate {
  start_date?: string;
  end_date?: string;
  leave_type?: LeaveType;
  reason?: string;
  status?: LeaveStatus;
}

export interface LeaveRequestResponse {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  leave_type: LeaveType;
  reason?: string;
  status: LeaveStatus;
  created_at: string;
}

export interface LeaveRequestListResponse {
  items: LeaveRequestResponse[];
  total: number;
  page: number;
  pagesize: number;
}