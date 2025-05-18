import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkIn } from '../../services/attendance.service';
import { AttendanceResponse } from '../../../types/time-logging.types';

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation<AttendanceResponse, Error>({
    mutationFn: checkIn,
    onSuccess: () => {
      // Invalidate attendance queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ['attendance', 'my'] });
    },
  });
};

export default useCheckIn;