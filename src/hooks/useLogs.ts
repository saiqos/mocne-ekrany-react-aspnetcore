import { useCallback, useEffect, useState } from 'react';
import { logService } from '../services/logs';
import type { AuditLog } from '../types';

export const useLogs = (limit = 100) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await logService.getAll(limit);
            setLogs(data);
        } catch {
            setError('Failed to load logs');
        } finally {
            setIsLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return {
        logs,
        isLoading,
        isError: Boolean(error),
        error,
        refetchLogs: fetchLogs,
    };
};