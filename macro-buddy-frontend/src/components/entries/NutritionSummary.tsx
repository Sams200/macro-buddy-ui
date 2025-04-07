import React from 'react';
import { EntryResponse } from '../../models/entry';
import { formatNumber } from '../../utils/numbers';

interface NutritionSummaryProps {
    entries: EntryResponse[];
    userSettings?: {
        dailyKcalGoal: number;
        dailyProteinGoal: number;
        dailyFatGoal: number;
        dailyCarbGoal: number;
    };
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ entries, userSettings }) => {
    // Calculate totals
    const totals = entries.reduce(
        (acc, entry) => {
            const { food, quantity } = entry;
            acc.kcal += Math.round(food.kcal * quantity);
            acc.protein += parseFloat((food.protein * quantity).toFixed(1));
            acc.fat += parseFloat((food.fat * quantity).toFixed(1));
            acc.carbs += parseFloat((food.carbs * quantity).toFixed(1));
            return acc;
        },
        { kcal: 0, protein: 0, fat: 0, carbs: 0 }
    );

    // Calculate percentages if settings exist
    const getPercentage = (value: number, goal: number) => {
        if (!goal) return 0;
        return Math.min(Math.round((value / goal) * 100), 100);
    };

    const hasGoals = userSettings &&
        (userSettings.dailyKcalGoal > 0 ||
            userSettings.dailyProteinGoal > 0 ||
            userSettings.dailyFatGoal > 0 ||
            userSettings.dailyCarbGoal > 0);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-[#D4A373] mb-4">Daily Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Calories</p>
                    <p className="text-2xl font-bold text-[#D4A373]">{formatNumber(totals.kcal)}</p>
                    {hasGoals && userSettings?.dailyKcalGoal > 0 && (
                        <>
                            <div className="mt-2 h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-2 bg-[#D4A373] rounded-full"
                                    style={{ width: `${getPercentage(totals.kcal, userSettings.dailyKcalGoal)}%` }}
                                ></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {formatNumber(userSettings.dailyKcalGoal - totals.kcal)} kcal remaining
                            </p>
                        </>
                    )}
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">Protein</p>
                    <p className="text-2xl font-bold">{formatNumber(totals.protein)}g</p>
                    {hasGoals && userSettings?.dailyProteinGoal > 0 && (
                        <>
                            <div className="mt-2 h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-2 bg-blue-500 rounded-full"
                                    style={{ width: `${getPercentage(totals.protein, userSettings.dailyProteinGoal)}%` }}
                                ></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {formatNumber(userSettings?.dailyProteinGoal - totals.protein)}g remaining
                            </p>
                        </>
                    )}
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">Fat</p>
                    <p className="text-2xl font-bold">{formatNumber(totals.fat)}g</p>
                    {hasGoals && userSettings?.dailyFatGoal > 0 && (
                        <>
                            <div className="mt-2 h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-2 bg-yellow-500 rounded-full"
                                    style={{ width: `${getPercentage(totals.fat, userSettings.dailyFatGoal)}%` }}
                                ></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {formatNumber(userSettings?.dailyFatGoal - totals.fat)}g remaining
                            </p>
                        </>
                    )}
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">Carbs</p>
                    <p className="text-2xl font-bold">{formatNumber(totals.carbs)}g</p>
                    {hasGoals && userSettings?.dailyCarbGoal > 0 && (
                        <>
                            <div className="mt-2 h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-2 bg-green-500 rounded-full"
                                    style={{ width: `${getPercentage(totals.carbs, userSettings.dailyCarbGoal)}%` }}
                                ></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {formatNumber(userSettings?.dailyCarbGoal - totals.carbs)}g remaining
                            </p>
                        </>
                    )}
                </div>
            </div>

            {entries.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium text-[#CCD5AE] mb-2">Macronutrient Breakdown</h4>
                    <div className="flex h-6 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-500"
                            style={{
                                width: `${
                                    Math.round(
                                        (totals.protein * 4 / Math.max(totals.kcal, 1)) * 100
                                    )
                                }%`,
                            }}
                            title={`Protein: ${Math.round(
                                (totals.protein * 4 / Math.max(totals.kcal, 1)) * 100
                            )}%`}
                        ></div>
                        <div
                            className="bg-yellow-500"
                            style={{
                                width: `${
                                    Math.round(
                                        (totals.fat * 9 / Math.max(totals.kcal, 1)) * 100
                                    )
                                }%`,
                            }}
                            title={`Fat: ${Math.round(
                                (totals.fat * 9 / Math.max(totals.kcal, 1)) * 100
                            )}%`}
                        ></div>
                        <div
                            className="bg-green-500"
                            style={{
                                width: `${
                                    Math.round(
                                        (totals.carbs * 4 / Math.max(totals.kcal, 1)) * 100
                                    )
                                }%`,
                            }}
                            title={`Carbs: ${Math.round(
                                (totals.carbs * 4 / Math.max(totals.kcal, 1)) * 100
                            )}%`}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Protein: {Math.round((totals.protein * 4 / Math.max(totals.kcal, 1)) * 100)}%</span>
                        <span>Fat: {Math.round((totals.fat * 9 / Math.max(totals.kcal, 1)) * 100)}%</span>
                        <span>Carbs: {Math.round((totals.carbs * 4 / Math.max(totals.kcal, 1)) * 100)}%</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NutritionSummary;