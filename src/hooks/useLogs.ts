import { useQuery } from '@tanstack/react-query';
import { logService } from '../services/logs';

export const useLogs = () => {
    const logsQuery = useQuery({
        queryKey: ['logs'],
        queryFn: logService.getAll,
    });

    return {
        logs: logsQuery.data || [],
        isLoading: logsQuery.isLoading,
        isError: logsQuery.isError,
        error: logsQuery.error,
    };
};