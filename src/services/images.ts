import type { Image } from '../types';
import axiosClient from './axiosClient';

export const imageService = {
    getAll: async (): Promise<Image[]> => {
        const response = await axiosClient.get<Image[]>('/api/images');

        return response.data;
    },

    upload: async (file: File): Promise<Image> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosClient.post<Image>('/api/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosClient.delete(`/api/images/${id}`);
    },
};