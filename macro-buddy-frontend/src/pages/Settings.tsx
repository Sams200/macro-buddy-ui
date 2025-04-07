import React from 'react';
import Layout from '../components/layout/Layout';
import UserSettingsForm from '../components/settings/UserSettingsForm';

const Settings: React.FC = () => {
    return (
        <Layout>
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#D4A373] mb-4">User Settings</h2>
                <UserSettingsForm />
            </div>
        </Layout>
    );
};

export default Settings;