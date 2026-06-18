import type { Collection, CollectionDetails, CollectionItem } from '../types';
import axiosClient from './axiosClient';

export interface CreateCollectionPayload {
    name: string;
}

export interface UpdateCollectionPayload {
    name: string;
}

export interface CreateCollectionItemPayload {
    imageId: number;
    order: number;
    displayDurationSeconds: number;
}

export interface UpdateCollectionItemPayload {
    order: number;
    displayDurationSeconds: number;
}

export const collectionService = {
    getAll: async (): Promise<Collection[]> => {
        const response = await axiosClient.get<Collection[]>('/api/collections');
        return response.data;
    },

    getById: async (id: number): Promise<CollectionDetails> => {
        const response = await axiosClient.get<CollectionDetails>(`/api/collections/${id}`);
        return response.data;
    },

    create: async (payload: CreateCollectionPayload): Promise<Collection> => {
        const response = await axiosClient.post<Collection>('/api/collections', payload);
        return response.data;
    },

    update: async (id: number, payload: UpdateCollectionPayload): Promise<Collection> => {
        const response = await axiosClient.put<Collection>(`/api/collections/${id}`, payload);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosClient.delete(`/api/collections/${id}`);
    },

    addItem: async (
        collectionId: number,
        payload: CreateCollectionItemPayload,
    ): Promise<CollectionItem> => {
        const response = await axiosClient.post<CollectionItem>(
            `/api/collections/${collectionId}/items`,
            payload,
        );

        return response.data;
    },

    updateItem: async (
        collectionId: number,
        itemId: number,
        payload: UpdateCollectionItemPayload,
    ): Promise<void> => {
        await axiosClient.put(
            `/api/collections/${collectionId}/items/${itemId}`,
            payload,
        );
    },

    deleteItem: async (collectionId: number, itemId: number): Promise<void> => {
        await axiosClient.delete(`/api/collections/${collectionId}/items/${itemId}`);
    },
};