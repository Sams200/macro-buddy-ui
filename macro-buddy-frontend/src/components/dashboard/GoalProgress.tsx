import React from 'react';
import {formatNumber} from "../../utils/numbers";

interface GoalProgressProps {
    title: string;
    consumed: number;
    goal: number;
    unit: string;
    colorClass?: string;
}

const GoalProgress: React.FC<GoalProgressProps> = ({
                                                       title,
                                                       consumed,
                                                       goal,
                                                       unit,
                                                       colorClass = 'bg-[#D4A373]'
                                                   }) => {
    const percentage = goal > 0 ? Math.min(Math.round((consumed / goal) * 100), 100) : 0;
    const remaining = Math.max(goal - consumed, 0);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>

            <div className="flex justify-between items-end mb-2">
                <div>
                    <p className="text-2xl font-bold text-[#D4A373]">{formatNumber(consumed)}</p>
                    <p className="text-xs text-gray-500">consumed</p>
                </div>

                <div className="text-right">
                    <p className="text-lg font-medium">{formatNumber(goal)}</p>
                    <p className="text-xs text-gray-500">goal</p>
                </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                    className={`${colorClass} h-3 rounded-full`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
                <span>{percentage}% of goal</span>
                <span>{formatNumber(remaining)} {unit} remaining</span>
            </div>
        </div>
    );
};

export default GoalProgress;