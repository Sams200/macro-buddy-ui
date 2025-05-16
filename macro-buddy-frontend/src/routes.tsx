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
import {useAuth} from "./hooks/useAuth";
import Chat from "./pages/Chat";
import TDEE from "./pages/TDEE";


const PrivateRouteComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <PrivateRoute>{children}</PrivateRoute>;
};

const AppRoutes: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutesContent />
            </BrowserRouter>
        </AuthProvider>
    );
};

const AppRoutesContent: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user?.isAdmin || false;

    return (
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

            <Route path="/chat" element={
                isAdmin ?
                    <PrivateRouteComponent>
                        <Chat />
                    </PrivateRouteComponent>
                    :
                    <Navigate to="/dashboard" replace />
            } />

            <Route path="/tdee" element={<TDEE />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;