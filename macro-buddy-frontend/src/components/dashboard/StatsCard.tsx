import React from 'react';
import { formatNumber } from '../../utils/numbers';

interface StatsCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon?: React.ReactNode;
    progress?: number;
    goalValue?: number;
    colorClass?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
                                                 title,
                                                 value,
                                                 unit,
                                                 icon,
                                                 progress,
                                                 goalValue,
                                                 colorClass = 'bg-[#D4A373]',
                                             }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                {icon && <div className="text-[#D4A373]">{icon}</div>}
            </div>

            <div className="flex items-baseline">
                <p className="text-2xl font-bold text-[#D4A373]">{formatNumber(value)}</p>
                {unit && <p className="ml-1 text-sm text-gray-500">{unit}</p>}
            </div>

            {(progress !== undefined || goalValue !== undefined) && (
                <div className="mt-3">
                    {progress !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div
                                className={`${colorClass} h-2 rounded-full`}
                                style={{ width: `${Math.min(100, progress)}%` }}
                            ></div>
                        </div>
                    )}

                    {goalValue !== undefined && (
                        <p className="text-xs text-gray-500">
                            Goal: {formatNumber(goalValue)} {unit}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatsCard;