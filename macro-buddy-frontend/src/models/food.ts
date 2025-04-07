export interface Food {
    foodId: number;
    name: string;
    producer: string;
    servingSize: number;
    servingUnits: string;
    kcal: number;
    protein: number;
    fat: number;
    carbs: number;
}

export interface FoodRequest {
    name: string;
    producer: string;
    servingSize: number;
    servingUnits: string;
    kcal: number;
    protein: number;
    fat: number;
    carbs: number;
}

export interface FoodResponse {
    foodId: number;
    name: string;
    producer: string;
    servingSize: number;
    servingUnits: string;
    kcal: number;
    protein: number;
    fat: number;
    carbs: number;
}