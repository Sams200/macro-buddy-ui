import React, {useState, useEffect, useMemo} from 'react';
import { debounce } from 'lodash';
import Input from '../common/Input';
import { FoodResponse } from '../../models/food';
import { searchFoodsByName } from '../../api/foodApi';

interface FoodSearchProps {
    onSelectFood: (food: FoodResponse) => void;
}

const FoodSearch: React.FC<FoodSearchProps> = ({ onSelectFood }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [foods, setFoods] = useState<FoodResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const debouncedSearch = useMemo(() => {
        return debounce(async (term: string) => {
            if (!term) {
                setFoods([]);
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                const result = await searchFoodsByName(term);
                setFoods(result.content);
            } catch (error: any) {
                setFoods([]);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }, 500);
    }, []);

    useEffect(() => {
        const search=searchTerm.trim();
        if(search)
            debouncedSearch(search);
        else{
            setFoods([]);
        }

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="mb-6">
            <Input
                label="Search for a food"
                type="text"
                id="foodSearch"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Type to search foods by name..."
                fullWidth
            />

            {isLoading && (
                <div className="text-center py-4">
                    <span className="text-[#CCD5AE]">Searching...</span>
                </div>
            )}

            {error && (
                <div className="p-3 mt-2 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {!isLoading && !error && foods.length > 0 && (
                <div className="mt-4 max-h-60 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        {foods.map((food) => (
                            <li
                                key={food.foodId}
                                className="py-3 px-2 hover:bg-[#FEFAE0] cursor-pointer transition-colors"
                                onClick={() => onSelectFood(food)}
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <h4 className="font-medium text-[#CCD5AE]">{food.name}</h4>
                                        <p className="text-sm text-gray-500">{food.producer}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[#D4A373] font-bold">{food.kcal}</span> kcal per {food.servingSize} {food.servingUnits}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!isLoading && !error && searchTerm && foods.length === 0 && (
                <div className="text-center py-4">
                    <p className="text-[#CCD5AE]">No foods found matching "{searchTerm.trim()}"</p>
                </div>
            )}
        </div>
    );
};

export default FoodSearch;