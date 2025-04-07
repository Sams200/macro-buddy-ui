import { SignInRequest, SignUpRequest, PasswordChangeRequest } from '../models/auth';
import { UserResponse } from '../models/user'
import { post, patch } from './apiClient';

export const signUp = async (data: SignUpRequest): Promise<UserResponse> => {
    return await post<UserResponse>('/authentication/sign-up', data);
};

export const signIn = async (data: SignInRequest): Promise<void> => {
    await post('/authentication/sign-in', data);
};

export const signOut = async (): Promise<void> => {
    await post('/authentication/sign-out');
};

export const changePassword = async (data: PasswordChangeRequest): Promise<void> => {
    await patch('/users/authenticated/change-password', data);
};