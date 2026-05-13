import type { Screen } from '../types';

const mockScreens: Screen[] = [
    {
        id: '1',
        name: 'Main Hall Display',
        uniqueIdentifier: 'SCREEN-001',
        location: 'Main Hall',
        status: 'Online',
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Lobby Screen',
        uniqueIdentifier: 'SCREEN-002',
        location: 'Lobby',
        status: 'Offline',
        lastSeen: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Conference Room',
        uniqueIdentifier: 'SCREEN-003',
        location: 'Conference Room',
        status: 'Online',
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    },
];

export const screenService = {
    getAll: async (): Promise<Screen[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockScreens;
    },

    create: async (payload: { name: string; location?: string }): Promise<Screen> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newScreen: Screen = {
            id: String(mockScreens.length + 1),
            name: payload.name,
            uniqueIdentifier: `SCREEN-${String(mockScreens.length + 1).padStart(3, '0')}`,
            location: payload.location,
            status: 'Offline',
            lastSeen: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };
        mockScreens.push(newScreen);
        return newScreen;
    },

    update: async (id: string, payload: Partial<Screen>): Promise<Screen> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const screen = mockScreens.find(s => s.id === id);
        if (!screen) throw new Error('Screen not found');
        Object.assign(screen, payload);
        return screen;
    },

    delete: async (id: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockScreens.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Screen not found');
        mockScreens.splice(index, 1);
    },

    powerControl: async (id: string, action: 'on' | 'off'): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const screen = mockScreens.find(s => s.id === id);
        if (!screen) throw new Error('Screen not found');
        screen.status = action === 'on' ? 'Online' : 'Offline';
    },
};