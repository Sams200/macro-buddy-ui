import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';

const NotFound: React.FC = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center py-12">
                <h1 className="text-4xl font-bold text-[#D4A373] mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-[#CCD5AE] mb-6">Page Not Found</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link to="/">
                    <Button variant="primary" size="lg">
                        Go to Homepage
                    </Button>
                </Link>
            </div>
        </Layout>
    );
};

export default NotFound;