import axiosClient from './axiosClient';
import type { User } from '../types';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>('/api/auth/login', payload);

    return response.data;
};