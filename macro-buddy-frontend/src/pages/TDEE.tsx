import React from 'react';
import Layout from '../components/layout/Layout';
import TDEEForm from "../components/tdee/TDEEForm";

const TDEE: React.FC = () => {
    return (
        <Layout>
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#D4A373] mb-4">TDEE Calculator</h2>
                <p className="text-gray-600 mb-4">
                    Learn How Many Calories You Burn Every Day
                </p>
                <TDEEForm/>
            </div>
        </Layout>
    );
};

export default TDEE;