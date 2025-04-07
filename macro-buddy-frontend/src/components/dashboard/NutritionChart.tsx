import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface NutritionData {
    date: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
}

interface NutritionChartProps {
    data: NutritionData[];
    showMacros?: boolean;
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
};

const NutritionChart: React.FC<NutritionChartProps> = ({ data, showMacros = true }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-[#D4A373] mb-4">Nutrition Trends</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            stroke="#CCD5AE"
                        />
                        <YAxis stroke="#CCD5AE" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#FEFAE0', borderColor: '#D4A373' }}
                            labelStyle={{ color: '#D4A373' }}
                            formatter={(value, name) => {
                                const nameStr = name as string;
                                const formattedName = nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
                                return [`${value}${nameStr === 'calories' ? '' : 'g'}`, formattedName];
                            }}
                            labelFormatter={(label) => {
                                return `Date: ${new Date(label).toLocaleDateString()}`;
                            }}
                        />
                        <Legend wrapperStyle={{ color: '#CCD5AE' }} />
                        <Line
                            type="monotone"
                            dataKey="calories"
                            stroke="#D4A373"
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                            name="Calories"
                        />
                        {showMacros && (
                            <>
                                <Line type="monotone" dataKey="protein" stroke="#3B82F6" name="Protein" />
                                <Line type="monotone" dataKey="fat" stroke="#F59E0B" name="Fat" />
                                <Line type="monotone" dataKey="carbs" stroke="#10B981" name="Carbs" />
                            </>
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default NutritionChart;