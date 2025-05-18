import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkOut } from '../../services/attendance.service';
import { AttendanceResponse } from '../../../types/time-logging.types';

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation<AttendanceResponse, Error>({
    mutationFn: checkOut,
    onSuccess: () => {
      // Invalidate attendance queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ['attendance', 'my'] });
    },
  });
};

export default useCheckOut;