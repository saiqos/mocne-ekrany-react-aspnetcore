import type { Schedule } from '../types';

const mockSchedules: Schedule[] = [
    {
        id: '1',
        name: 'Morning Schedule',
        imageId: '1',
        screenId: '1',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        isRecurring: true,
        priority: 1,
    },
];

export const scheduleService = {
    getAll: async (): Promise<Schedule[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockSchedules;
    },

    create: async (payload: Omit<Schedule, 'id'>): Promise<Schedule> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newSchedule: Schedule = {
            ...payload,
            id: String(mockSchedules.length + 1),
        };
        mockSchedules.push(newSchedule);
        return newSchedule;
    },

    update: async (id: string, payload: Partial<Schedule>): Promise<Schedule> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const schedule = mockSchedules.find(s => s.id === id);
        if (!schedule) throw new Error('Schedule not found');
        Object.assign(schedule, payload);
        return schedule;
    },

    delete: async (id: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockSchedules.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Schedule not found');
        mockSchedules.splice(index, 1);
    },
};