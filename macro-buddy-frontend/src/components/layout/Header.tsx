import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import React from "react";

const Header: React.FC = () => {
    const { isAuthenticated, user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <header className="bg-[#E9EDC9] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-[#D4A373]">
                                MacroBuddy
                            </Link>
                        </div>
                        <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {isAuthenticated && (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="border-transparent text-[#CCD5AE] hover:border-[#D4A373] hover:text-[#D4A373] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/diary"
                                        className="border-transparent text-[#CCD5AE] hover:border-[#D4A373] hover:text-[#D4A373] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Food Diary
                                    </Link>
                                    <Link
                                        to="/foods"
                                        className="border-transparent text-[#CCD5AE] hover:border-[#D4A373] hover:text-[#D4A373] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Food Database
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="border-transparent text-[#CCD5AE] hover:border-[#D4A373] hover:text-[#D4A373] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Settings
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-[#CCD5AE]">Hi, {user?.username}</span>
                                <Button onClick={handleSignOut} variant="outline" size="sm">
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Button onClick={() => navigate('/login')} variant="outline" size="sm">
                                    Sign In
                                </Button>
                                <Button onClick={() => navigate('/register')} variant="primary" size="sm">
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </header>
    );
};

export default Header;