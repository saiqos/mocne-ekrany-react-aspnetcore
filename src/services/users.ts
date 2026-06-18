import axiosClient from './axiosClient';
import type { UserDto } from '../types';

export interface CreateUserPayload {
    username: string;
    password: string;
    role: 'Admin' | 'Operator';
}

export interface UpdateUserRolePayload {
    role: 'Admin' | 'Operator';
}

export interface UpdateUserPasswordPayload {
    newPassword: string;
}

export const userService = {
    getAll: async (): Promise<UserDto[]> => {
        const response = await axiosClient.get<UserDto[]>('/api/users');

        return response.data;
    },

    create: async (payload: CreateUserPayload): Promise<UserDto> => {
        const response = await axiosClient.post<UserDto>('/api/users', payload);

        return response.data;
    },

    updateRole: async (
        id: number,
        payload: UpdateUserRolePayload,
    ): Promise<void> => {
        await axiosClient.put(`/api/users/${id}/role`, payload);
    },

    updatePassword: async (
        id: number,
        payload: UpdateUserPasswordPayload,
    ): Promise<void> => {
        await axiosClient.put(`/api/users/${id}/password`, payload);
    },

    delete: async (id: number): Promise<void> => {
        await axiosClient.delete(`/api/users/${id}`);
    },
};