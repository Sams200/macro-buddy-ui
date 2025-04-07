import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { message?: string, from?: Location } | undefined;

    useEffect(() => {
        if (isAuthenticated && !loading) {
            const destination = state?.from?.pathname || '/dashboard';
            navigate(destination, { replace: true });
        }
    }, [isAuthenticated, loading, navigate, state]);

    if (loading) {
        return (
            <Layout withoutFooter>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A373]"></div>
                </div>
            </Layout>
        );
    }

    if (!isAuthenticated) {
        return (
            <Layout withoutFooter>
                <div className="max-w-md mx-auto mt-8">
                    {state?.message && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {state.message}
                        </div>
                    )}
                    <LoginForm />
                </div>
            </Layout>
        );
    }

    return null;
};

export default Login;