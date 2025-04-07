import {Food} from "./food";

export interface Entry {
    entryId: number;
    date: string;
    meal: string;
    quantity: number;
    food: Food;
}

export interface EntryRequest {
    date: string;
    meal: string;
    quantity: number;
    foodId: number;
}

export interface EntryResponse {
    entryId: number;
    date: string;
    meal: string;
    quantity: number;
    food: Food;
}