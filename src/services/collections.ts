import type { Collection } from '../types';

const mockCollections: Collection[] = [
    {
        id: '1',
        name: 'Monday Schedule',
        createdAt: new Date().toISOString(),
        uploadedBy: 'admin',
        items: [
            { id: '1', collectionId: '1', imageId: '1', order: 0, displayDuration: 30 },
            { id: '2', collectionId: '1', imageId: '2', order: 1, displayDuration: 30 },
        ],
    },
];

export const collectionService = {
    getAll: async (): Promise<Collection[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockCollections;
    },

    create: async (payload: { name: string }): Promise<Collection> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newCollection: Collection = {
            id: String(mockCollections.length + 1),
            name: payload.name,
            createdAt: new Date().toISOString(),
            uploadedBy: 'admin',
            items: [],
        };
        mockCollections.push(newCollection);
        return newCollection;
    },

    update: async (id: string, payload: Partial<Collection>): Promise<Collection> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const collection = mockCollections.find(c => c.id === id);
        if (!collection) throw new Error('Collection not found');
        Object.assign(collection, payload);
        return collection;
    },

    delete: async (id: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockCollections.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Collection not found');
        mockCollections.splice(index, 1);
    },
};