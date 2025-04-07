export interface HttpResponse<T = any> {
    timestamp: string;
    responseStatusCode: number;
    responseStatus: string;
    responseMessage: string;
    responseDeveloperMessage?: string;
    body?: T;
}

export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalElements: number;
    totalPages: number;
}

export enum MealType {
    BREAKFAST = "BREAKFAST",
    LUNCH = "LUNCH",
    DINNER = "DINNER",
    SNACK = "SNACK",
}

export interface ApiError {
    message: string;
    status: number;
    timestamp?: string;
}