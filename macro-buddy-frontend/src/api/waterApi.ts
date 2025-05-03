import {PageResponse} from "../models/common";
import {WaterRequest, WaterResponse} from "../models/water";
import {del, get, patch, post} from "./apiClient";

export const getWater = async (page = 0, size = 10): Promise<PageResponse<WaterResponse>> => {
    return await get<PageResponse<WaterResponse>>(`/authenticated/water?page=${page}&size=${size}`);
};

export const getWaterByDate = async (date: string): Promise<WaterResponse> => {
    return await get<WaterResponse>(`/authenticated/water/date=${date}`);
};

export const createWater = async (data: WaterRequest): Promise<WaterResponse> => {
    return await post<WaterResponse>('/authenticated/water', data);
};

export const updateWater = async (id: number, data: WaterRequest): Promise<WaterResponse> => {
    return await patch<WaterResponse>(`/authenticated/water/id=${id}`, data);
};

export const deleteWater = async (id: number): Promise<void> => {
    await del(`/authenticated/water/id=${id}`);
};