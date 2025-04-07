import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import StatsCard from './StatsCard';
import NutritionChart from './NutritionChart';
import GoalProgress from './GoalProgress';
import { getEntriesByDate } from '../../api/entryApi';
import { getUserSettings } from '../../api/userSettingsApi';
import { EntryResponse } from '../../models/entry';
import { UserSettingsResponse } from '../../models/userSettings';
import { ApiError } from '../../models/common';
import {formatNumber} from "../../utils/numbers";

const Dashboard: React.FC = () => {
    const [todayEntries, setTodayEntries] = useState<EntryResponse[]>([]);
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [userSettings, setUserSettings] = useState<UserSettingsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Calculate today's date
    const today = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');

            try {
                // Fetch today's entries
                const todayResult = await getEntriesByDate(today);
                setTodayEntries(todayResult.content);

                // Fetch user settings
                const settings = await getUserSettings();
                setUserSettings(settings);

                // Fetch past 7 days data for chart
                const pastWeekData = [];
                const now = new Date();

                for (let i = 6; i >= 0; i--) {
                    const date = format(subDays(now, i), 'yyyy-MM-dd');
                    try {
                        const dayResult = await getEntriesByDate(date);

                        // Calculate day totals
                        const totals = dayResult.content.reduce(
                            (acc, entry) => {
                                const { food, quantity } = entry;
                                acc.calories += Math.round(food.kcal * quantity);
                                acc.protein += parseFloat((food.protein * quantity).toFixed(1));
                                acc.fat += parseFloat((food.fat * quantity).toFixed(1));
                                acc.carbs += parseFloat((food.carbs * quantity).toFixed(1));
                                return acc;
                            },
                            { calories: 0, protein: 0, fat: 0, carbs: 0 }
                        );

                        pastWeekData.push({
                            date,
                            ...totals
                        });
                    } catch (error) {
                        // Still add the date but with zeros
                        pastWeekData.push({
                            date,
                            calories: 0,
                            protein: 0,
                            fat: 0,
                            carbs: 0
                        });
                    }
                }

                setWeeklyData(pastWeekData);
            } catch (error) {
                const apiError = error as ApiError;
                setError(apiError.message || 'Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [today]);

    // Calculate today's totals
    const todayTotals = todayEntries.reduce(
        (acc, entry) => {
            const { food, quantity } = entry;
            acc.calories += Math.round(food.kcal * quantity);
            acc.protein += parseFloat((food.protein * quantity).toFixed(1));
            acc.fat += parseFloat((food.fat * quantity).toFixed(1));
            acc.carbs += parseFloat((food.carbs * quantity).toFixed(1));
            return acc;
        },
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );

    // Last week average
    const weeklyAvg = weeklyData.reduce(
        (acc, day) => {
            acc.calories += day.calories / weeklyData.length;
            acc.protein += day.protein / weeklyData.length;
            acc.fat += day.fat / weeklyData.length;
            acc.carbs += day.carbs / weeklyData.length;
            return acc;
        },
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin mr-2 h-8 w-8 text-[#D4A373]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <span className="text-[#CCD5AE]">Loading dashboard data...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-[#D4A373] mb-6">
                    Your Nutrition Dashboard
                </h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Today's Calories"
                    value={todayTotals.calories}
                    unit="kcal"
                    progress={userSettings?.dailyKcalGoal ? (todayTotals.calories / userSettings.dailyKcalGoal) * 100 : undefined}
                    goalValue={userSettings?.dailyKcalGoal}
                />

                <StatsCard
                    title="Today's Protein"
                    value={todayTotals.protein}
                    unit="g"
                    progress={userSettings?.dailyProteinGoal ? (todayTotals.protein / userSettings.dailyProteinGoal) * 100 : undefined}
                    goalValue={userSettings?.dailyProteinGoal}
                    colorClass="bg-blue-500"
                />

                <StatsCard
                    title="Today's Fat"
                    value={todayTotals.fat}
                    unit="g"
                    progress={userSettings?.dailyFatGoal ? (todayTotals.fat / userSettings.dailyFatGoal) * 100 : undefined}
                    goalValue={userSettings?.dailyFatGoal}
                    colorClass="bg-yellow-500"
                />

                <StatsCard
                    title="Today's Carbs"
                    value={todayTotals.carbs}
                    unit="g"
                    progress={userSettings?.dailyCarbGoal ? (todayTotals.carbs / userSettings.dailyCarbGoal) * 100 : undefined}
                    goalValue={userSettings?.dailyCarbGoal}
                    colorClass="bg-green-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <NutritionChart data={weeklyData} />
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-[#D4A373] mb-4">Weekly Average</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-gray-500">Calories</span>
                                <span className="font-semibold">{formatNumber(weeklyAvg.calories)} kcal</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-gray-500">Protein</span>
                                <span className="font-semibold">{formatNumber(weeklyAvg.protein)} g</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-gray-500">Fat</span>
                                <span className="font-semibold">{formatNumber(weeklyAvg.fat)} g</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-gray-500">Carbs</span>
                                <span className="font-semibold">{formatNumber(weeklyAvg.carbs)} g</span>
                            </div>
                        </div>
                    </div>

                    {userSettings && userSettings.dailyKcalGoal > 0 && (
                        <GoalProgress
                            title="Today's Calorie Goal"
                            consumed={todayTotals.calories}
                            goal={userSettings.dailyKcalGoal}
                            unit="kcal"
                            colorClass="bg-[#D4A373]"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;