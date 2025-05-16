import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signIn, error, clearError } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (username.length < 5 || username.length > 30) {
            newErrors.username = 'Username must be between 5 and 30 characters';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 5 || password.length > 40) {
            newErrors.password = 'Password must be between 5 and 40 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await signIn({ username, password, captcha: 'dummy' });
            navigate('/dashboard');
        } catch (err) {
            // Error is handled in the auth context
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-[#D4A373] mb-6 text-center">Sign In</h2>

            {error && error!=="An unexpected error occurred" && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Username"
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={errors.username}
                    placeholder="Enter your username"
                    fullWidth
                />

                <Input
                    label="Password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    placeholder="Enter your password"
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    fullWidth
                    className="mt-4"
                >
                    Sign In
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-[#CCD5AE]">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-[#D4A373] hover:underline focus:outline-none"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;