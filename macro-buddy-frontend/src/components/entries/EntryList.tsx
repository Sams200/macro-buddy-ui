import React, { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { EntryResponse } from '../../models/entry';
import { deleteEntry } from '../../api/entryApi';
import { MealType } from '../../models/common';
import { ApiError } from '../../models/common';
import EntryForm from "./EntryForm";
import { formatNumber } from '../../utils/numbers';

interface EntryListProps {
    entries: EntryResponse[];
    onDelete: () => void;
    onUpdate: () => void;
    date: string;
    isLoading?: boolean;
}

const EntryList: React.FC<EntryListProps> = ({ entries, onDelete, onUpdate, date, isLoading = false }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<EntryResponse | null>(null);
    const [entryToEdit, setEntryToEdit] = useState<EntryResponse | null>(null);
    const [error, setError] = useState('');

    // Group entries by meal type
    const mealTypes = Object.values(MealType);
    const entriesByMeal = mealTypes.reduce((acc, mealType) => {
        acc[mealType] = entries.filter(entry => entry.meal === mealType);
        return acc;
    }, {} as Record<string, EntryResponse[]>);

    const handleDeleteEntry = async () => {
        if (!entryToDelete) return;

        try {
            await deleteEntry(entryToDelete.entryId);
            setIsDeleteModalOpen(false);
            setEntryToDelete(null);
            onDelete();
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Failed to delete entry. Please try again.');
        }
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        setEntryToEdit(null);
        onUpdate();
    };

    const calculateTotalNutrition = (entries: EntryResponse[]) => {
        return entries.reduce(
            (totals, entry) => {
                const { food, quantity } = entry;
                totals.kcal += Math.round(food.kcal * quantity);
                totals.protein += parseFloat((food.protein * quantity).toFixed(1));
                totals.fat += parseFloat((food.fat * quantity).toFixed(1));
                totals.carbs += parseFloat((food.carbs * quantity).toFixed(1));
                return totals;
            },
            { kcal: 0, protein: 0, fat: 0, carbs: 0 }
        );
    };

    const formatMealTitle = (mealType: string) => {
        return mealType.charAt(0) + mealType.slice(1).toLowerCase();
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin mr-2 h-6 w-6 text-[#D4A373]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <span className="text-[#CCD5AE]">Loading entries...</span>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-[#CCD5AE] mb-4">No food entries for this day</p>
                <p className="text-gray-500 text-sm mb-6">Add some foods to track your nutrition</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                    {error}
                </div>
            )}

            {mealTypes.map((mealType) => {
                const mealEntries = entriesByMeal[mealType] || [];
                if (mealEntries.length === 0) return null;

                const mealNutrition = calculateTotalNutrition(mealEntries);

                return (
                    <div key={mealType} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="bg-[#E9EDC9] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-[#D4A373]">{formatMealTitle(mealType)}</h3>
                            <div className="text-sm text-[#CCD5AE]">
                                {formatNumber(mealNutrition.kcal)} kcal
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {mealEntries.map((entry) => (
                                <div key={entry.entryId} className="px-6 py-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <h4 className="font-medium text-[#CCD5AE]">{entry.food.name}</h4>
                                            <p className="text-sm text-gray-500">{entry.food.producer}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatNumber(entry.quantity * entry.food.servingSize)} {entry.food.servingUnits}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-[#D4A373]">
                                                {formatNumber(Math.round(entry.food.kcal * entry.quantity))} kcal
                                            </p>
                                            <div className="flex space-x-3 text-xs text-gray-500 mt-1">
                                                <span>P: {formatNumber((entry.food.protein * entry.quantity))}g</span>
                                                <span>F: {formatNumber((entry.food.fat * entry.quantity))}g</span>
                                                <span>C: {formatNumber(entry.food.carbs * entry.quantity)}g</span>
                                            </div>
                                            <div className="flex space-x-2 mt-2">
                                                <Button
                                                    variant="text"
                                                    size="sm"
                                                    className="text-blue-500 hover:text-blue-700"
                                                    onClick={() => {
                                                        setEntryToEdit(entry);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="text"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => {
                                                        setEntryToDelete(entry);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="px-6 py-3 bg-[#FEFAE0] flex justify-between text-sm">
                                <span className="font-medium text-[#CCD5AE]">Total</span>
                                <div className="flex space-x-4">
                                    <span>{formatNumber(mealNutrition.protein)}g protein</span>
                                    <span>{formatNumber(mealNutrition.fat)}g fat</span>
                                    <span>{formatNumber(mealNutrition.carbs)}g carbs</span>
                                    <span className="font-bold">{formatNumber(mealNutrition.kcal)} kcal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setEntryToDelete(null);
                }}
                title="Confirm Delete"
                size="sm"
            >
                <div className="p-4">
                    <p className="mb-4 text-[#CCD5AE]">
                        Are you sure you want to remove <strong>{entryToDelete?.food.name}</strong> from your diary?
                    </p>
                    <div className="flex justify-end space-x-4">
                    <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setEntryToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleDeleteEntry}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEntryToEdit(null);
                }}
                title="Edit Entry"
                size="lg"
            >
                {entryToEdit && (
                    <EntryForm
                        date={date}
                        entryToEdit={entryToEdit}
                        onSuccess={handleEditSuccess}
                        onCancel={() => {
                            setIsEditModalOpen(false);
                            setEntryToEdit(null);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default EntryList;