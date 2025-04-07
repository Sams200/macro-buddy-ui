import React, { useState, useEffect } from 'react';
import Table from '../common/Table';
import Button from '../common/Button';
import Modal from '../common/Modal';
import FoodForm from './FoodForm';
import { FoodResponse } from '../../models/food';
import { getFoods, deleteFood } from '../../api/foodApi';
import { useAuth } from '../../hooks/useAuth';
import { ApiError } from '../../models/common';

const FoodList: React.FC = () => {
    const [foods, setFoods] = useState<FoodResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [foodToDelete, setFoodToDelete] = useState<FoodResponse | null>(null);
    const { user } = useAuth();

    const isAdmin = user?.isAdmin || false;

    const fetchFoods = async (page = 0) => {
        setIsLoading(true);
        setError('');

        try {
            const result = await getFoods(page);
            setFoods(result.content);
            setTotalPages(result.totalPages);
            setCurrentPage(page);
        } catch (error: any) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Failed to load foods. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleDeleteFood = async () => {
        if (!foodToDelete) return;

        try {
            await deleteFood(foodToDelete.foodId);
            setFoods(foods.filter(food => food.foodId !== foodToDelete.foodId));
            setIsDeleteModalOpen(false);
            setFoodToDelete(null);
        } catch (error: any) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Failed to delete food. Please try again.');
        }
    };

    const handleAddFoodSuccess = () => {
        setIsAddFoodModalOpen(false);
        fetchFoods();
    };

    const columns = [
        { header: 'Name', accessor: 'name' as keyof FoodResponse },
        { header: 'Producer', accessor: 'producer' as keyof FoodResponse },
        { header: 'Serving', accessor: (food: FoodResponse) => `${food.servingSize} ${food.servingUnits}` },
        { header: 'Calories', accessor: 'kcal' as keyof FoodResponse },
        { header: 'Protein (g)', accessor: 'protein' as keyof FoodResponse },
        { header: 'Fat (g)', accessor: 'fat' as keyof FoodResponse },
        { header: 'Carbs (g)', accessor: 'carbs' as keyof FoodResponse },
        {
            header: 'Actions',
            accessor: (food: FoodResponse) => (
                isAdmin && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFoodToDelete(food);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        Delete
                    </Button>
                )
            ),
            width: '100px'
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#D4A373]">Food Database</h2>
                {isAdmin && (
                    <Button
                        variant="primary"
                        onClick={() => setIsAddFoodModalOpen(true)}
                    >
                        Add New Food
                    </Button>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <Table
                columns={columns}
                data={foods}
                keyExtractor={(food) => food.foodId}
                isLoading={isLoading}
                emptyMessage="No foods found."
            />

            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <nav className="inline-flex rounded-md shadow">
                        <Button
                            onClick={() => fetchFoods(currentPage - 1)}
                            disabled={currentPage === 0}
                            variant="outline"
                            size="sm"
                        >
                            Previous
                        </Button>
                        <span className="px-4 py-2 bg-[#FEFAE0] text-[#CCD5AE]">
              Page {currentPage + 1} of {totalPages}
            </span>
                        <Button
                            onClick={() => fetchFoods(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            variant="outline"
                            size="sm"
                        >
                            Next
                        </Button>
                    </nav>
                </div>
            )}

            <Modal
                isOpen={isAddFoodModalOpen}
                onClose={() => setIsAddFoodModalOpen(false)}
                title="Add New Food"
                size="lg"
            >
                <FoodForm
                    onSuccess={handleAddFoodSuccess}
                    onCancel={() => setIsAddFoodModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setFoodToDelete(null);
                }}
                title="Confirm Delete"
                size="sm"
            >
                <div className="p-4">
                    <p className="mb-4 text-[#CCD5AE]">
                        Are you sure you want to delete <strong>{foodToDelete?.name}</strong>?
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setFoodToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleDeleteFood}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FoodList;