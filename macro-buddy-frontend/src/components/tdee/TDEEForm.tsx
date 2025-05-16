import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

interface TDEEResult {
    bmr: number;
    tdee: number;
    mildWeightLoss: number;
    weightLoss: number;
    extremeWeightLoss: number;
    mildWeightGain: number;
    weightGain: number;
    fastWeightGain: number;
}

const TDEEForm: React.FC = () => {
    const [gender, setGender] = useState<string>('male');
    const [age, setAge] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [activityLevel, setActivityLevel] = useState<string>('1.2');
    const [bodyFat, setBodyFat] = useState<string>('');
    const [result, setResult] = useState<TDEEResult | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isCalculating, setIsCalculating] = useState(false);

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!age) {
            newErrors.age = 'Age is required';
        } else if (parseInt(age) < 15 || parseInt(age) > 80) {
            newErrors.age = 'Age must be between 15 and 80';
        }

        if (!weight) {
            newErrors.weight = 'Weight is required';
        } else if (parseFloat(weight) < 40 || parseFloat(weight) > 200) {
            newErrors.weight = 'Weight must be between 40 and 200 kg';
        }

        if (!height) {
            newErrors.height = 'Height is required';
        } else if (parseInt(height) < 130 || parseInt(height) > 230) {
            newErrors.height = 'Height must be between 130 and 230 cm';
        }

        if (bodyFat && (parseFloat(bodyFat) < 3 || parseFloat(bodyFat) > 50)) {
            newErrors.bodyFat = 'Body fat must be between 3 and 50%';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTDEE = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsCalculating(true);

        setTimeout(() => {
            const ageNum = parseInt(age);
            const weightNum = parseFloat(weight);
            const heightNum = parseInt(height);
            const bodyFatNum = bodyFat ? parseFloat(bodyFat) : null;
            const activityFactor = parseFloat(activityLevel);

            let bmr = 0;

            if (bodyFatNum) {
                // Katch-McArdle Formula
                const leanBodyMass = weightNum * (1 - (bodyFatNum / 100));
                bmr = 370 + (21.6 * leanBodyMass);
            } else {
                // Mifflin-St Jeor Equation
                if (gender === 'male') {
                    bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
                } else {
                    bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
                }
            }

            const tdee = Math.round(bmr * activityFactor);

            setResult({
                bmr: Math.round(bmr),
                tdee,
                mildWeightLoss: Math.round(tdee * 0.9),
                weightLoss: Math.round(tdee * 0.8),
                extremeWeightLoss: Math.round(tdee * 0.75),
                mildWeightGain: Math.round(tdee * 1.1),
                weightGain: Math.round(tdee * 1.15),
                fastWeightGain: Math.round(tdee * 1.2),
            });

            setIsCalculating(false);
        }, 500);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-[#D4A373] mb-4">Calculate Your Daily Calories</h3>

            <form onSubmit={calculateTDEE}>
                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label className="mb-2 font-medium text-gray-700">Gender</label>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={gender === 'male'}
                                    onChange={() => setGender('male')}
                                    className="form-radio h-4 w-4 text-[#D4A373]"
                                />
                                <span className="ml-2">Male</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={gender === 'female'}
                                    onChange={() => setGender('female')}
                                    className="form-radio h-4 w-4 text-[#D4A373]"
                                />
                                <span className="ml-2">Female</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Age"
                            type="number"
                            id="age"
                            name="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            error={errors.age}
                            min="15"
                            max="80"
                            placeholder="Years"
                            fullWidth
                        />

                        <Input
                            label="Weight"
                            type="number"
                            id="weight"
                            name="weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            error={errors.weight}
                            min="40"
                            max="200"
                            step="0.5"
                            placeholder="kg"
                            fullWidth
                        />

                        <Input
                            label="Height"
                            type="number"
                            id="height"
                            name="height"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            error={errors.height}
                            min="130"
                            max="230"
                            placeholder="cm"
                            fullWidth
                        />

                        <div className="flex flex-col">
                            <label htmlFor="activity" className="mb-2 font-medium text-gray-700">Activity Level</label>
                            <select
                                id="activity"
                                name="activity"
                                value={activityLevel}
                                onChange={(e) => setActivityLevel(e.target.value)}
                                className="form-select w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent"
                            >
                                <option value="1.2">Sedentary (office job)</option>
                                <option value="1.375">Light Exercise (1-2 days/week)</option>
                                <option value="1.55">Moderate Exercise (3-5 days/week)</option>
                                <option value="1.725">Heavy Exercise (6-7 days/week)</option>
                                <option value="1.9">Athlete (2x per day)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-end">
                        <div className="w-full md:w-1/2">
                            <div className="flex flex-col">
                                <label htmlFor="bodyFat" className="mb-2 font-medium text-gray-700">
                                    Body Fat % <span className="text-sm text-gray-500">(optional)</span>
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        id="bodyFat"
                                        name="bodyFat"
                                        value={bodyFat}
                                        onChange={(e) => setBodyFat(e.target.value)}
                                        className={`form-input w-20 p-2 border ${errors.bodyFat ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent`}
                                        min="3"
                                        max="50"
                                        step="0.5"
                                        placeholder="15"
                                    />
                                    <span className="ml-1">%</span>
                                </div>
                                {errors.bodyFat && (
                                    <p className="mt-1 text-sm text-red-500">{errors.bodyFat}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isCalculating}
                        >
                            Calculate!
                        </Button>
                    </div>
                </div>
            </form>

            {result && (
                <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold text-[#D4A373] mb-3">Your Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-700 font-medium">Basal Metabolic Rate (BMR):</p>
                            <p className="text-xl font-bold text-[#D4A373]">{result.bmr} calories/day</p>
                            <p className="text-sm text-gray-500 mt-1">Calories your body needs at complete rest</p>
                        </div>
                        <div>
                            <p className="text-gray-700 font-medium">Total Daily Energy Expenditure (TDEE):</p>
                            <p className="text-xl font-bold text-[#D4A373]">{result.tdee} calories/day</p>
                            <p className="text-sm text-gray-500 mt-1">Calories your body burns daily with activity</p>
                        </div>
                    </div>

                    <h5 className="text-md font-semibold text-gray-700 mt-6 mb-3">Calorie Targets</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-red-50 rounded-md">
                            <h6 className="font-medium text-red-700">Weight Loss</h6>
                            <ul className="mt-1 space-y-1">
                                <li className="text-sm text-gray-600">Mild: <span className="font-medium">{result.mildWeightLoss} cal</span></li>
                                <li className="text-sm text-gray-600">Moderate: <span className="font-medium">{result.weightLoss} cal</span></li>
                                <li className="text-sm text-gray-600">Extreme: <span className="font-medium">{result.extremeWeightLoss} cal</span></li>
                            </ul>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-md">
                            <h6 className="font-medium text-blue-700">Maintenance</h6>
                            <p className="mt-1 text-sm font-medium text-gray-600">{result.tdee} calories</p>
                            <p className="text-xs text-gray-500">Maintain current weight</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-md">
                            <h6 className="font-medium text-green-700">Weight Gain</h6>
                            <ul className="mt-1 space-y-1">
                                <li className="text-sm text-gray-600">Mild: <span className="font-medium">{result.mildWeightGain} cal</span></li>
                                <li className="text-sm text-gray-600">Moderate: <span className="font-medium">{result.weightGain} cal</span></li>
                                <li className="text-sm text-gray-600">Fast: <span className="font-medium">{result.fastWeightGain} cal</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-[#FEFAE0] rounded-md border border-[#CCD5AE]">
                        <p className="text-sm text-gray-700">
                            These calculations provide estimates based on formulas and may vary from actual needs.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TDEEForm;