
export interface Water{
    waterId: number;
    date: string;
    quantity: number;
}

export interface WaterRequest {
    date: string;
    quantity: number;
}

export interface WaterResponse {
    waterId: number;
    date: string;
    quantity: number;
}