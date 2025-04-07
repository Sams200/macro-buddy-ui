import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { signUp } from '../../api/authApi';
import { ApiError } from '../../models/common';

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [apiError, setApiError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        const { username, email, password, confirmPassword } = formData;

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (username.length < 5 || username.length > 30) {
            newErrors.username = 'Username must be between 5 and 30 characters';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Enter a valid email address';
        } else if (email.length > 50) {
            newErrors.email = 'Email must be at most 50 characters';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 5 || password.length > 40) {
            newErrors.password = 'Password must be between 5 and 40 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await signUp({
                ...formData,
                recaptchaToken: 'dummy',
            });
            navigate('/login', { state: { message: 'Registration successful. Please sign in.' } });
        } catch (error) {
            const apiError = error as ApiError;
            setApiError(apiError.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-[#D4A373] mb-6 text-center">Sign Up</h2>

            {apiError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Username"
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    placeholder="Choose a username"
                    fullWidth
                />

                <Input
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="Enter your email"
                    fullWidth
                />

                <Input
                    label="Password"
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Create a password"
                    fullWidth
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm your password"
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    fullWidth
                    className="mt-4"
                >
                    Sign Up
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-[#CCD5AE]">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[#D4A373] hover:underline focus:outline-none"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;