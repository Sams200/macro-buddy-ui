import React from 'react';
import Layout from '../components/layout/Layout';
import FoodList from '../components/food/FoodList';

const FoodDatabase: React.FC = () => {
    return (
        <Layout>
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#D4A373] mb-4">Food Database</h2>
                <FoodList />
            </div>
        </Layout>
    );
};

export default FoodDatabase;