import type { Screen } from '../types';
import axiosClient from './axiosClient';

export interface CreateScreenPayload {
    name: string;
    uniqueIdentifier: string;
    groupId: number | null;
    location: string;
}

export interface UpdateScreenPayload {
    name: string;
    uniqueIdentifier: string;
    groupId: number | null;
    location: string;
}

export const screenService = {
    getAll: async (): Promise<Screen[]> => {
        const response = await axiosClient.get<Screen[]>('/api/screens');

        return response.data;
    },

    getById: async (id: number): Promise<Screen> => {
        const response = await axiosClient.get<Screen>(`/api/screens/${id}`);

        return response.data;
    },

    create: async (payload: CreateScreenPayload): Promise<Screen> => {
        const response = await axiosClient.post<Screen>('/api/screens', payload);

        return response.data;
    },

    update: async (id: number, payload: UpdateScreenPayload): Promise<Screen> => {
        const response = await axiosClient.put<Screen>(`/api/screens/${id}`, payload);

        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosClient.delete(`/api/screens/${id}`);
    },

    powerControl: async (id: number, action: 'on' | 'off'): Promise<void> => {
        await axiosClient.post(`/api/screens/${id}/power`, {
            isOnline: action === 'on',
        });
    },
};