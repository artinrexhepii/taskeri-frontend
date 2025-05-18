import { useQuery } from '@tanstack/react-query';
import { getMyAttendance } from '../../services/attendance.service';
import { AttendanceResponse } from '../../../types/time-logging.types';

export const useMyAttendance = (enabled = true) => {
  return useQuery<AttendanceResponse[], Error>({
    queryKey: ['attendance', 'my'],
    queryFn: getMyAttendance,
    enabled,
  });
};

export default useMyAttendance;