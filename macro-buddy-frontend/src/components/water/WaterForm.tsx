import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { WaterRequest, WaterResponse } from '../../models/water';
import { createWater, updateWater } from '../../api/waterApi';
import { ApiError } from '../../models/common';

interface WaterFormProps {
    date: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    waterToEdit?: WaterResponse | null;
}

const WaterForm: React.FC<WaterFormProps> = ({ date, onSuccess, onCancel, waterToEdit }) => {
    const [quantity, setQuantity] = useState<number>(250);
    const [quantityDisplayValue, setQuantityDisplayValue] = useState<string>('250');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [apiError, setApiError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Common water amounts in ml for quick selection
    const quickAmounts = [500, 1000, 1500, 2000, 2500, 3000];

    // Initialize with existing water values when editing
    useEffect(() => {
        if (waterToEdit) {
            setQuantity(waterToEdit.quantity);
            setQuantityDisplayValue(waterToEdit.quantity.toString());
        }
    }, [waterToEdit]);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setQuantityDisplayValue(inputValue);

        const value = inputValue ? parseFloat(inputValue) : 0;
        setQuantity(value);

        // Clear errors when the input changes
        if (errors.quantity) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.quantity;
                return newErrors;
            });
        }
    };

    const handleQuickAmountSelect = (amount: number) => {
        setQuantity(amount);
        setQuantityDisplayValue(amount.toString());

        // Clear errors when a quick amount is selected
        if (errors.quantity) {
            setErrors({});
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (quantity < 0) {
            newErrors.quantity = 'Water quantity must be greater than 0';
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

        const waterRequest: WaterRequest = {
            date,
            quantity,
        };

        setIsSubmitting(true);
        try {
            if (waterToEdit) {
                // Update existing entry
                await updateWater(waterToEdit.waterId, waterRequest);
            } else {
                // Create new entry
                await createWater(waterRequest);
            }

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            const apiError = error as ApiError;
            setApiError(apiError.message || `Failed to ${waterToEdit ? 'update' : 'add'} water intake. Please try again.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4">
            {apiError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quick Add (ml)
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {quickAmounts.map(amount => (
                            <button
                                key={amount}
                                type="button"
                                className={`py-2 px-4 rounded-md transition-colors ${
                                    quantity === amount
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                                onClick={() => handleQuickAmountSelect(amount)}
                            >
                                {amount} ml
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <Input
                        label="Custom Amount (ml)"
                        type="number"
                        id="quantity"
                        value={quantityDisplayValue}
                        onChange={handleQuantityChange}
                        error={errors.quantity}
                        min="0"
                        step="100"
                        fullWidth
                    />
                </div>

                <div className="flex justify-end space-x-4">
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
                    >
                        {waterToEdit ? 'Update Water' : 'Add Water'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default WaterForm;