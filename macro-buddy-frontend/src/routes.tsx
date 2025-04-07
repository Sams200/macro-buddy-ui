import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Diary from './pages/Diary';
import FoodDatabase from './pages/FoodDatabase';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Implement PrivateRoute component
const PrivateRouteComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <PrivateRoute>{children}</PrivateRoute>;
};

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={
                        <PrivateRouteComponent>
                            <Dashboard />
                        </PrivateRouteComponent>
                    } />

                    <Route path="/diary" element={
                        <PrivateRouteComponent>
                            <Diary />
                        </PrivateRouteComponent>
                    } />

                    <Route path="/foods" element={<FoodDatabase />} />

                    <Route path="/settings" element={
                        <PrivateRouteComponent>
                            <Settings />
                        </PrivateRouteComponent>
                    } />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRoutes;