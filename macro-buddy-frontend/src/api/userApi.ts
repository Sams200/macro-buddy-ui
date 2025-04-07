import { UserResponse } from '../models/user';
import { get, del } from './apiClient';

export const getCurrentUser = async (): Promise<UserResponse> => {
    return await get<UserResponse>('/users/authenticated');
};

export const getUserById = async (id: number): Promise<UserResponse> => {
    return await get<UserResponse>(`/users/id=${id}`);
};

export const deleteUser = async (id: number): Promise<void> => {
    await del(`/users/id=${id}`);
};
