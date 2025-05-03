export interface UserSettings {
    dailyKcalGoal: number;
    dailyProteinGoal: number;
    dailyFatGoal: number;
    dailyCarbGoal: number;
    dailyWaterGoal: number;
}

export interface UserSettingsRequest {
    goalKcal: number;
    goalProtein: number;
    goalFat: number;
    goalCarbs: number;
    goalWater: number;
}

export interface UserSettingsResponse {
    dailyKcalGoal: number;
    dailyProteinGoal: number;
    dailyFatGoal: number;
    dailyCarbGoal: number;
    dailyWaterGoal: number;
}