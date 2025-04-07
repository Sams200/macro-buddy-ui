import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import FoodSearch from '../food/FoodSearch';
import { EntryRequest, EntryResponse } from '../../models/entry';
import { FoodResponse } from '../../models/food';
import { MealType } from '../../models/common';
import { createEntry, updateEntry } from '../../api/entryApi';
import { ApiError } from '../../models/common';

interface EntryFormProps {
    date: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    entryToEdit?: EntryResponse;
}

const EntryForm: React.FC<EntryFormProps> = ({ date, onSuccess, onCancel, entryToEdit }) => {
    const [selectedFood, setSelectedFood] = useState<FoodResponse | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [quantityDisplayValue, setQuantityDisplayValue] = useState<string>('1');
    const [meal, setMeal] = useState<string>(MealType.BREAKFAST);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [apiError, setApiError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // When editing initialize with entry values
    useEffect(() => {
        if (entryToEdit) {
            setSelectedFood(entryToEdit.food);
            setQuantity(entryToEdit.quantity);
            setQuantityDisplayValue(entryToEdit.quantity.toString());

            setMeal(entryToEdit.meal);
        }
    }, [entryToEdit]);

    const handleFoodSelect = (food: FoodResponse) => {
        setSelectedFood(food);
        if (errors.food) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.food;
                return newErrors;
            });
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setQuantityDisplayValue(inputValue);

        const value = e.target.value ? parseFloat(e.target.value) : 0;
        setQuantity(value);
        if (errors.quantity) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.quantity;
                return newErrors;
            });
        }
    };

    const handleMealChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMeal(e.target.value);
    };

    const mealOptions = Object.values(MealType).map(mealType => ({
        value: mealType,
        label: mealType.charAt(0) + mealType.slice(1).toLowerCase()
    }));

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!selectedFood) {
            newErrors.food = 'Please select a food';
        }

        if (!quantity || quantity <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');

        if (!validate()) {
            return;
        }

        if (!selectedFood) return;

        const entryRequest: EntryRequest = {
            date,
            meal,
            quantity,
            foodId: selectedFood.foodId,
        };

        setIsSubmitting(true);
        try {
            if (entryToEdit) {
                // Update existing entry
                await updateEntry(entryToEdit.entryId, entryRequest);
            } else {
                // Create new entry
                await createEntry(entryRequest);
            }

            if (onSuccess) {
                onSuccess();
            }

            // Reset form if not editing
            if (!entryToEdit) {
                setSelectedFood(null);
                setQuantity(1);
                setQuantityDisplayValue('1');
                setMeal(MealType.BREAKFAST);
            }
        } catch (error) {
            const apiError = error as ApiError;
            setApiError(apiError.message || `Failed to ${entryToEdit ? 'update' : 'add'} entry. Please try again.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-[#D4A373] mb-4">
                {entryToEdit ? 'Edit Food Entry' : 'Add Food Entry'}
            </h3>

            {apiError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {!entryToEdit ? (
                    // Only show food search when adding a new entry
                    <>
                        <FoodSearch onSelectFood={handleFoodSelect} />
                        {errors.food && <p className="mb-4 text-sm text-red-500">{errors.food}</p>}
                    </>
                ) : (
                    // When editing show the food name without allowing change
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Food</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                            {selectedFood?.name}
                        </div>
                    </div>
                )}

                {selectedFood && (
                    <div className="mb-4 p-4 bg-[#FEFAE0] rounded-md">
                        <h4 className="font-medium text-[#CCD5AE]">Selected Food:</h4>
                        <div className="flex justify-between mt-2">
                            <div>
                                <p className="font-semibold">{selectedFood.name}</p>
                                <p className="text-sm text-gray-600">{selectedFood.producer}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-[#D4A373]">{selectedFood.kcal} kcal</p>
                                <p className="text-sm">per {selectedFood.servingSize} {selectedFood.servingUnits}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm text-gray-600">
                            <div>Protein: {selectedFood.protein}g</div>
                            <div>Fat: {selectedFood.fat}g</div>
                            <div>Carbs: {selectedFood.carbs}g</div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Meal"
                        id="meal"
                        value={meal}
                        onChange={handleMealChange}
                        options={mealOptions}
                        fullWidth
                    />

                    <Input
                        label={`Quantity (servings)`}
                        type="number"
                        id="quantity"
                        value={quantityDisplayValue}
                        onChange={handleQuantityChange}
                        error={errors.quantity}
                        step="0.1"
                        min="0.1"
                        fullWidth
                    />
                </div>

                {selectedFood && (
                    <div className="mt-4 p-3 bg-[#FEFAE0] rounded-md">
                        <h4 className="text-sm font-medium text-[#CCD5AE]">Nutrition with selected quantity:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                            <div>
                                <p className="text-xs text-gray-500">Calories</p>
                                <p className="font-semibold text-[#D4A373]">
                                    {Math.round(selectedFood.kcal * quantity)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Protein</p>
                                <p className="font-semibold">
                                    {(selectedFood.protein * quantity).toFixed(1)}g
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Fat</p>
                                <p className="font-semibold">
                                    {(selectedFood.fat * quantity).toFixed(1)}g
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Carbs</p>
                                <p className="font-semibold">
                                    {(selectedFood.carbs * quantity).toFixed(1)}g
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-6 space-x-4">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                        disabled={!selectedFood}
                    >
                        {entryToEdit ? 'Update Entry' : 'Add to Diary'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EntryForm;