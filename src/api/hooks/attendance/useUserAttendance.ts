import { useQuery } from '@tanstack/react-query';
import { getUserAttendance } from '../../services/attendance.service';
import { AttendanceResponse } from '../../../types/time-logging.types';

export const useUserAttendance = (userId: number, enabled = true) => {
  return useQuery<AttendanceResponse[], Error>({
    queryKey: ['attendance', 'user', userId],
    queryFn: () => getUserAttendance(userId),
    enabled: !!userId && enabled,
  });
};

export default useUserAttendance;