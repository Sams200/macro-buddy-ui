import React, { useState } from 'react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import Layout from '../components/layout/Layout';
import DailyEntries from '../components/entries/DailyEntries';
import Button from '../components/common/Button';
import { getUserSettings } from '../api/userSettingsApi';
import { UserSettingsResponse } from '../models/userSettings';

const Diary: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [userSettings, setUserSettings] = useState<UserSettingsResponse | null>(null);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getUserSettings();
                setUserSettings(settings);
            } catch (error) {
                console.error('Failed to load user settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const handlePreviousDay = () => {
        const date = parseISO(selectedDate);
        setSelectedDate(format(subDays(date, 1), 'yyyy-MM-dd'));
    };

    const handleNextDay = () => {
        const date = parseISO(selectedDate);
        setSelectedDate(format(addDays(date, 1), 'yyyy-MM-dd'));
    };

    const handleToday = () => {
        setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-[#D4A373] mb-4">Food Diary</h2>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Button variant="outline" size="sm" onClick={handlePreviousDay}>
                            Previous Day
                        </Button>

                        <Button variant="outline" size="sm" onClick={handleToday}>
                            Today
                        </Button>

                        <Button variant="outline" size="sm" onClick={handleNextDay}>
                            Next Day
                        </Button>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#D4A373] focus:border-[#D4A373]"
                        />
                    </div>
                </div>

                <DailyEntries date={selectedDate} userSettings={userSettings || undefined} />
            </div>
        </Layout>
    );
};

export default Diary;