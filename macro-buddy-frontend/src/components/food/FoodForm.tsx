import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { FoodRequest } from '../../models/food';
import { createFood } from '../../api/foodApi';
import { ApiError } from '../../models/common';

interface FoodFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const FoodForm: React.FC<FoodFormProps> = ({ onSuccess, onCancel }) => {
    const initialFormData: FoodRequest = {
        name: '',
        producer: '',
        servingSize: 0,
        servingUnits: '',
        kcal: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
    };

    // Use a separate state for form display values
    const [formDisplayValues, setFormDisplayValues] = useState({
        servingSize: '',
        kcal: '',
        protein: '',
        fat: '',
        carbs: '',
    });

    const [formData, setFormData] = useState<FoodRequest>(initialFormData);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [apiError, setApiError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            // For number input
            setFormDisplayValues(prev => ({
                ...prev,
                [name]: value
            }));

            const numericValue = value === '' ? 0 : parseFloat(value);
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else {
            // For text input
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        const { name, producer, servingSize, servingUnits, kcal, protein, fat, carbs } = formData;

        if (!name.trim()) {
            newErrors.name = 'Food name is required';
        } else if (name.length > 100) {
            newErrors.name = 'Food name can have at most 100 characters';
        }

        if (!producer.trim()) {
            newErrors.producer = 'Food producer is required';
        } else if (producer.length > 50) {
            newErrors.producer = 'Food producer can have at most 50 characters';
        }

        if (!servingSize || servingSize <= 0) {
            newErrors.servingSize = 'Serving size must be greater than 0';
        }

        if (!servingUnits.trim()) {
            newErrors.servingUnits = 'Serving units is required';
        } else if (servingUnits.length > 20) {
            newErrors.servingUnits = 'Serving units can have at most 20 characters';
        }

        if (kcal < 0) {
            newErrors.kcal = 'Calories must be greater or equal to 0';
        }

        if (protein < 0) {
            newErrors.protein = 'Protein must be greater or equal to 0';
        }

        if (fat < 0) {
            newErrors.fat = 'Fat must be greater or equal to 0';
        }

        if (carbs < 0) {
            newErrors.carbs = 'Carbs must be greater or equal to 0';
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

        setIsSubmitting(true);
        try {
            await createFood(formData);
            if (onSuccess) {
                onSuccess();
            }
            // Reset both form data and display values
            setFormData(initialFormData);
            setFormDisplayValues({
                servingSize: '',
                kcal: '',
                protein: '',
                fat: '',
                carbs: '',
            });
        } catch (error) {
            const apiError = error as ApiError;
            setApiError(apiError.message || 'Failed to create food. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-[#D4A373] mb-4">Add New Food</h3>

            {apiError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Food Name"
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="e.g., Apple"
                        fullWidth
                    />

                    <Input
                        label="Producer/Brand"
                        type="text"
                        id="producer"
                        name="producer"
                        value={formData.producer}
                        onChange={handleChange}
                        error={errors.producer}
                        placeholder="e.g., Generic"
                        fullWidth
                    />

                    <Input
                        label="Serving Size"
                        type="number"
                        id="servingSize"
                        name="servingSize"
                        value={formDisplayValues.servingSize}
                        onChange={handleChange}
                        error={errors.servingSize}
                        placeholder="e.g. 100"
                        min="0"
                        fullWidth
                        step="1"
                    />

                    <Input
                        label="Serving Units"
                        type="text"
                        id="servingUnits"
                        name="servingUnits"
                        value={formData.servingUnits}
                        onChange={handleChange}
                        error={errors.servingUnits}
                        placeholder="e.g. g, ml, oz"
                        fullWidth
                    />

                    <Input
                        label="Calories (kcal)"
                        type="number"
                        id="kcal"
                        name="kcal"
                        value={formDisplayValues.kcal}
                        onChange={handleChange}
                        error={errors.kcal}
                        placeholder="e.g. 52"
                        min="0"
                        fullWidth
                    />

                    <Input
                        label="Protein (g)"
                        type="number"
                        id="protein"
                        name="protein"
                        value={formDisplayValues.protein}
                        onChange={handleChange}
                        error={errors.protein}
                        placeholder="e.g. 0.3"
                        fullWidth
                        step="0.1"
                        min="0"
                    />

                    <Input
                        label="Fat (g)"
                        type="number"
                        id="fat"
                        name="fat"
                        value={formDisplayValues.fat}
                        onChange={handleChange}
                        error={errors.fat}
                        placeholder="e.g. 0.2"
                        fullWidth
                        step="0.1"
                        min="0"
                    />

                    <Input
                        label="Carbs (g)"
                        type="number"
                        id="carbs"
                        name="carbs"
                        value={formDisplayValues.carbs}
                        onChange={handleChange}
                        error={errors.carbs}
                        placeholder="e.g. 14"
                        fullWidth
                        step="0.1"
                        min="0"
                    />
                </div>

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
                    >
                        Save Food
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FoodForm;