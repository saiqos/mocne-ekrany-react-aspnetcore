import type { Schedule } from '../types';
import axiosClient from './axiosClient';

export interface CreateSchedulePayload {
    name: string;
    imageId: number | null;
    collectionId: number | null;
    screenId: number;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
    recurrencePattern: string | null;
    priority: number;
}

export type UpdateSchedulePayload = CreateSchedulePayload;

export const scheduleService = {
    getAll: async (): Promise<Schedule[]> => {
        const response = await axiosClient.get<Schedule[]>('/api/schedules');

        return response.data;
    },

    getById: async (id: number): Promise<Schedule> => {
        const response = await axiosClient.get<Schedule>(`/api/schedules/${id}`);

        return response.data;
    },

    create: async (payload: CreateSchedulePayload): Promise<Schedule> => {
        const response = await axiosClient.post<Schedule>('/api/schedules', payload);

        return response.data;
    },

    update: async (id: number, payload: UpdateSchedulePayload): Promise<Schedule> => {
        const response = await axiosClient.put<Schedule>(`/api/schedules/${id}`, payload);

        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosClient.delete(`/api/schedules/${id}`);
    },
};