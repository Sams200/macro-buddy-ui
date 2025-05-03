import React, { useState, useEffect, useCallback } from 'react';
import { getWaterByDate } from '../../api/waterApi';
import { WaterResponse } from '../../models/water';
import { ApiError } from '../../models/common';
import Button from '../common/Button';
import Modal from '../common/Modal';
import WaterForm from './WaterForm';

interface DailyWaterProps {
    date: string;
    userSettings?: {
        dailyKcalGoal: number;
        dailyProteinGoal: number;
        dailyFatGoal: number;
        dailyCarbGoal: number;
        dailyWaterGoal: number;
    };
}

const DailyWater: React.FC<DailyWaterProps> = ({ date, userSettings }) => {
    const [waterEntry, setWaterEntry] = useState<WaterResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Water goal is either from user settings or default to 2000 ml
    const waterGoal = userSettings?.dailyWaterGoal || 2000;

    // Calculate water progress percentage
    const calculateProgress = () => {
        if (!waterEntry) return 0;
        return Math.min((waterEntry.quantity / waterGoal) * 100, 100);
    };

    // Fetch water entry data
    const fetchWaterEntry = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const result = await getWaterByDate(date);
            // Since there's only one water entry per day, take the first or set null
            setWaterEntry(result.waterId ? result : null);
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Failed to load water data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [date]);

    useEffect(() => {
        fetchWaterEntry();
    }, [fetchWaterEntry]);

    const handleUpdateSuccess = () => {
        setIsModalOpen(false);
        fetchWaterEntry();
    };

    const progressPercentage = calculateProgress();
    const currentWater = waterEntry?.quantity || 0;

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#D4A373] flex items-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#D4A373">
                        <path d="M12 2C12 2 5.5 9 5.5 14.5C5.5 18.09 8.41 21 12 21C15.59 21 18.5 18.09 18.5 14.5C18.5 9 12 2 12 2Z" />
                    </svg>
                    Water Intake
                </h3>
                <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(true)}
                >
                    {waterEntry ? 'Update Water' : 'Add Water'}
                </Button>
            </div>

            {error && (
                <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="py-8 text-center text-gray-500">Loading water data...</div>
            ) : (
                <div>
                    <div className="mb-2 flex justify-between items-center">
                        <span className="text-gray-700">{currentWater} ml</span>
                        <span className="text-gray-500">{waterGoal} ml goal</span>
                    </div>

                    {/* Water progress bar */}
                    <div className="h-5 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>

                    {/* Goal status message */}
                    {waterEntry && (
                        <div className="text-sm">
                            {progressPercentage >= 100 ? (
                                <div className="text-green-600 font-medium">
                                    ✓ Daily water goal achieved!
                                </div>
                            ) : (
                                <div className="text-gray-600">
                                    {Math.round(waterGoal - currentWater)} ml remaining to reach your goal
                                </div>
                            )}
                        </div>
                    )}

                    {!waterEntry && (
                        <div className="text-center py-4 text-gray-500">
                            No water recorded for today. Click "Add Water" to track your hydration.
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={waterEntry ? "Update Water Intake" : "Add Water Intake"}
                size="sm"
            >
                <WaterForm
                    date={date}
                    onSuccess={handleUpdateSuccess}
                    onCancel={() => setIsModalOpen(false)}
                    waterToEdit={waterEntry}
                />
            </Modal>
        </div>
    );
};

export default DailyWater;