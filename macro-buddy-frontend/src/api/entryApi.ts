import { EntryRequest, EntryResponse } from '../models/entry';
import { PageResponse } from '../models/common'
import { get, post, patch, del } from './apiClient';

export const getEntries = async (page = 0, size = 10): Promise<PageResponse<EntryResponse>> => {
    return await get<PageResponse<EntryResponse>>(`/authenticated/entry?page=${page}&size=${size}`);
};

export const getEntriesByDate = async (date: string, page = 0, size = 50): Promise<PageResponse<EntryResponse>> => {
    return await get<PageResponse<EntryResponse>>(`/authenticated/entry/date=${date}?page=${page}&size=${size}`);
};

export const createEntry = async (data: EntryRequest): Promise<EntryResponse> => {
    return await post<EntryResponse>('/authenticated/entry', data);
};

export const updateEntry = async (id: number, data: EntryRequest): Promise<EntryResponse> => {
    return await patch<EntryResponse>(`/authenticated/entry/id=${id}`, data);
};

export const deleteEntry = async (id: number): Promise<void> => {
    await del(`/authenticated/entry/id=${id}`);
};