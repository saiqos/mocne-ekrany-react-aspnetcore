import type { AuditLog } from '../types';

const mockLogs: AuditLog[] = [
    {
        id: '1',
        userId: '1',
        action: 'CREATE',
        entityType: 'Screen',
        entityId: '1',
        timestamp: new Date().toISOString(),
        description: 'Created new screen',
    },
    {
        id: '2',
        userId: '1',
        action: 'UPDATE',
        entityType: 'Image',
        entityId: '1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        description: 'Updated image metadata',
    },
];

export const logService = {
    getAll: async (): Promise<AuditLog[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockLogs;
    },

    addLog: async (log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> => {
        const newLog: AuditLog = {
            ...log,
            id: String(mockLogs.length + 1),
            timestamp: new Date().toISOString(),
        };
        mockLogs.push(newLog);
        return newLog;
    },
};