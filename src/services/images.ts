import type { Image } from '../types';

const mockImages: Image[] = [
    {
        id: '1',
        name: 'Conference Schedule',
        filePath: '/images/conference.jpg',
        thumbnailPath: '/images/conference-thumb.jpg',
        format: 'jpeg',
        width: 1920,
        height: 1080,
        fileSize: 256000,
        createdAt: new Date().toISOString(),
        uploadedBy: 'admin',
    },
    {
        id: '2',
        name: 'Welcome Banner',
        filePath: '/images/welcome.png',
        thumbnailPath: '/images/welcome-thumb.png',
        format: 'png',
        width: 1920,
        height: 1080,
        fileSize: 512000,
        createdAt: new Date().toISOString(),
        uploadedBy: 'admin',
    },
];

export const imageService = {
    getAll: async (): Promise<Image[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockImages;
    },

    upload: async (file: File): Promise<Image> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newImage: Image = {
            id: String(mockImages.length + 1),
            name: file.name,
            filePath: `/images/${file.name}`,
            thumbnailPath: `/images/${file.name}-thumb`,
            format: file.type.split('/')[1],
            width: 1920,
            height: 1080,
            fileSize: file.size,
            createdAt: new Date().toISOString(),
            uploadedBy: 'admin',
        };
        mockImages.push(newImage);
        return newImage;
    },

    delete: async (id: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockImages.findIndex(i => i.id === id);
        if (index === -1) throw new Error('Image not found');
        mockImages.splice(index, 1);
    },
};