import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import PasswordChangeForm from '../auth/PasswordChangeForm';
import { UserSettingsRequest } from '../../models/userSettings';
import { getUserSettings, updateUserSettings } from '../../api/userSettingsApi';
import { ApiError } from '../../models/common';
import {EntryResponse} from "../../models/entry";
import {getEntries} from "../../api/entryApi";
import {Food} from "../../models/food";

const UserSettingsForm: React.FC = () => {
    const [settings, setSettings] = useState<UserSettingsRequest>({
        goalKcal: 0,
        goalProtein: 0,
        goalFat: 0,
        goalCarbs: 0,
        goalWater: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            setError('');

            try {
                const userSettings = await getUserSettings();
                setSettings({
                    goalKcal: userSettings.dailyKcalGoal,
                    goalProtein: userSettings.dailyProteinGoal,
                    goalFat: userSettings.dailyFatGoal,
                    goalCarbs: userSettings.dailyCarbGoal,
                    goalWater: userSettings.dailyWaterGoal,
                });
            } catch (error) {
                const apiError = error as ApiError;
                setError(apiError.message || 'Failed to load settings. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = value === '' ? 0 : parseFloat(value);

        setSettings((prev) => ({ ...prev, [name]: numValue }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (settings.goalKcal < 0) {
            newErrors.goalKcal = 'Calories must be greater or equal to 0';
        }

        if (settings.goalProtein < 0) {
            newErrors.goalProtein = 'Protein must be greater or equal to 0';
        }

        if (settings.goalFat < 0) {
            newErrors.goalFat = 'Fat must be greater or equal to 0';
        }

        if (settings.goalCarbs < 0) {
            newErrors.goalCarbs = 'Carbs must be greater or equal to 0';
        }

        if (settings.goalWater < 0) {
            newErrors.goalCarbs = 'Water must be greater or equal to 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!validate()) {
            return;
        }

        setIsSaving(true);
        try {
            await updateUserSettings(settings);
            setSuccessMessage('Settings updated successfully');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message || 'Failed to update settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const exportDataAsXml = async () => {
        setIsExporting(true);
        setError('');
        setSuccessMessage('');

        try{
            let allEntries: EntryResponse[] = [];
            let page = 0;
            let hasMoreEntries = true;
            const pageSize = 100;

            while(hasMoreEntries){
                const result = await getEntries(page, pageSize);
                allEntries=[...allEntries, ...result.content];

                if (result.totalPages>=page) {
                    hasMoreEntries = false;
                }
                page++;
            }

            const uniqueFoods = new Map<number, Food>();
            allEntries.forEach(entry => {
                if (!uniqueFoods.has(entry.food.foodId)){
                    uniqueFoods.set(entry.food.foodId, entry.food);
                }
            });

            let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xmlContent += '<export>\n';

            xmlContent += '  <foods>\n';
            uniqueFoods.forEach(food => {
                xmlContent += '    <food>\n';
                xmlContent += `      <foodId>${food.foodId}</foodId>\n`;
                xmlContent += `      <name>${escapeXml(food.name)}</name>\n`;
                xmlContent += `      <producer>${escapeXml(food.producer)}</producer>\n`;
                xmlContent += `      <servingSize>${food.servingSize}</servingSize>\n`;
                xmlContent += `      <servingUnits>${escapeXml(food.servingUnits)}</servingUnits>\n`;
                xmlContent += `      <kcal>${food.kcal}</kcal>\n`;
                xmlContent += `      <protein>${food.protein}</protein>\n`;
                xmlContent += `      <fat>${food.fat}</fat>\n`;
                xmlContent += `      <carbs>${food.carbs}</carbs>\n`;
                xmlContent += '    </food>\n';
            });
            xmlContent += '  </foods>\n';

            xmlContent += '  <entries>\n';
            allEntries.forEach(entry => {
                xmlContent += '    <entry>\n';
                xmlContent += `      <entryId>${entry.entryId}</entryId>\n`;
                xmlContent += `      <date>${entry.date}</date>\n`;
                xmlContent += `      <meal>${escapeXml(entry.meal)}</meal>\n`;
                xmlContent += `      <quantity>${entry.quantity}</quantity>\n`;
                xmlContent += `      <foodId>${entry.food.foodId}</foodId>\n`;
                xmlContent += '    </entry>\n';
            });
            xmlContent += '  </entries>\n';
            xmlContent += '</export>';

            const blob = new Blob([xmlContent], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.href = url;
            a.download = `nutrition-data-export-${timestamp}.xml`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccessMessage('Data exported successfully');

            setTimeout(()=> {
                    setSuccessMessage('');
                }, 3000
            );
        }
        catch(error){
            const apiError = error as ApiError;
            setError(apiError.message || 'Failed to export data. Please try again');
        }
        finally {
            setIsExporting(false);
        }
    };

    const escapeXml = (unsafe: string): string => {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
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
                <span className="text-[#CCD5AE]">Loading settings...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-[#D4A373] mb-4">Nutrition Goals</h3>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Daily Calorie Goal (kcal)"
                            type="number"
                            id="goalKcal"
                            name="goalKcal"
                            value={settings.goalKcal === 0 ? '' : settings.goalKcal}
                            onChange={handleChange}
                            error={errors.goalKcal}
                            placeholder="e.g., 2000"
                            fullWidth
                            min="0"
                        />

                        <Input
                            label="Daily Protein Goal (g)"
                            type="number"
                            id="goalProtein"
                            name="goalProtein"
                            value={settings.goalProtein === 0 ? '' : settings.goalProtein}
                            onChange={handleChange}
                            error={errors.goalProtein}
                            placeholder="e.g., 150"
                            fullWidth
                            step="0.1"
                            min="0"
                        />

                        <Input
                            label="Daily Fat Goal (g)"
                            type="number"
                            id="goalFat"
                            name="goalFat"
                            value={settings.goalFat === 0 ? '' : settings.goalFat}
                            onChange={handleChange}
                            error={errors.goalFat}
                            placeholder="e.g., 65"
                            fullWidth
                            step="0.1"
                            min="0"
                        />

                        <Input
                            label="Daily Carbs Goal (g)"
                            type="number"
                            id="goalCarbs"
                            name="goalCarbs"
                            value={settings.goalCarbs === 0 ? '' : settings.goalCarbs}
                            onChange={handleChange}
                            error={errors.goalCarbs}
                            placeholder="e.g., 250"
                            fullWidth
                            step="0.1"
                            min="0"
                        />

                        <Input
                            label="Daily Water Goal (ml)"
                            type="number"
                            id="goalWater"
                            name="goalWater"
                            value={settings.goalWater === 0 ? '' : settings.goalWater}
                            onChange={handleChange}
                            error={errors.goalCarbs}
                            placeholder="e.g., 2500"
                            fullWidth
                            step="100"
                            min="0"
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSaving}
                        >
                            Save Settings
                        </Button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-[#D4A373] mb-4">Export Data</h3>
                <p className="text-gray-600 mb-4">
                    Export all your nutrition entries and foods as an XML file.
                </p>
                <div className="flex justify-start">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={exportDataAsXml}
                        isLoading={isExporting}
                    >
                        {isExporting ? 'Exporting...' : 'Export Data as XML'}
                    </Button>
                </div>
            </div>

            <PasswordChangeForm />


        </div>
    );
};

export default UserSettingsForm;