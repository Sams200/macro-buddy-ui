import { UserSettingsRequest, UserSettingsResponse } from '../models/userSettings';
import { get, patch } from './apiClient';

export const getUserSettings = async (): Promise<UserSettingsResponse> => {
    return await get<UserSettingsResponse>('/authenticated/user-settings');
};

export const updateUserSettings = async (data: UserSettingsRequest): Promise<UserSettingsResponse> => {
    return await patch<UserSettingsResponse>('/authenticated/user-settings', data);
};