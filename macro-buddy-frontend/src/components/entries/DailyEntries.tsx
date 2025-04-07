import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import Button from '../common/Button';
import Modal from '../common/Modal';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import NutritionSummary from './NutritionSummary';
import { EntryResponse } from '../../models/entry';
import { getEntriesByDate } from '../../api/entryApi';
import { ApiError } from '../../models/common';

interface DailyEntriesProps {
    date: string;
    userSettings?: {
        dailyKcalGoal: number;
        dailyProteinGoal: number;
        dailyFatGoal: number;
        dailyCarbGoal: number;
    };
}

const DailyEntries: React.FC<DailyEntriesProps> = ({ date, userSettings }) => {
    const [entries, setEntries] = useState<EntryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Wrap fetchEntries with useCallback
    const fetchEntries = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const result = await getEntriesByDate(date);
            setEntries(result.content);
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Failed to load entries. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [date]); // Only recreate if date changes

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const handleAddSuccess = () => {
        setIsModalOpen(false);
        fetchEntries();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="text-xl font-semibold text-[#D4A373]">
                    {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                </h2>
                <Button
                    variant="primary"
                    className="mt-2 sm:mt-0"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Food
                </Button>
            </div>

            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <NutritionSummary entries={entries} userSettings={userSettings} />

            <EntryList
                entries={entries}
                onDelete={fetchEntries}
                onUpdate={fetchEntries}
                date={date}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Food to Diary"
                size="lg"
            >
                <EntryForm
                    date={date}
                    onSuccess={handleAddSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default DailyEntries;