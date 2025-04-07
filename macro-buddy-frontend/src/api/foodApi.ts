import { FoodRequest, FoodResponse } from '../models/food';
import { PageResponse } from '../models/common'
import { get, post, del } from './apiClient';

export const getFoods = async (page = 0, size = 10): Promise<PageResponse<FoodResponse>> => {
    return await get<PageResponse<FoodResponse>>(`/food?page=${page}&size=${size}`);
};

export const getFoodById = async (id: number): Promise<FoodResponse> => {
    return await get<FoodResponse>(`/food/id=${id}`);
};

export const searchFoodsByName = async (name: string, page = 0, size = 10): Promise<PageResponse<FoodResponse>> => {
    return await get<PageResponse<FoodResponse>>(`/food/name=${name}?page=${page}&size=${size}`);
};

export const createFood = async (data: FoodRequest): Promise<FoodResponse> => {
    // For multipart/form-data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
    });

    return await post<FoodResponse>('/food', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteFood = async (id: number): Promise<void> => {
    await del(`/food/id=${id}`);
};
