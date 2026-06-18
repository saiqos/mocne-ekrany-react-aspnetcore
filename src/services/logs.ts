import type { AuditLog } from '../types';
import axiosClient from './axiosClient';

export const logService = {
    getAll: async (limit = 100): Promise<AuditLog[]> => {
        const response = await axiosClient.get<AuditLog[]>('/api/logs', {
            params: { limit },
        });

        return response.data;
    },

    getByScreenId: async (screenId: number, limit = 100): Promise<AuditLog[]> => {
        const response = await axiosClient.get<AuditLog[]>(
            `/api/logs/screen/${screenId}`,
            {
                params: { limit },
            },
        );

        return response.data;
    },

    getByUserId: async (userId: number, limit = 100): Promise<AuditLog[]> => {
        const response = await axiosClient.get<AuditLog[]>(
            `/api/logs/user/${userId}`,
            {
                params: { limit },
            },
        );

        return response.data;
    },

    getByAction: async (action: string, limit = 100): Promise<AuditLog[]> => {
        const response = await axiosClient.get<AuditLog[]>(
            `/api/logs/action/${action}`,
            {
                params: { limit },
            },
        );

        return response.data;
    },
};