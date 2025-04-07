import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { changePassword } from '../../api/authApi';
import { ApiError } from '../../models/common';

const PasswordChangeForm: React.FC = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        const { currentPassword, newPassword, confirmNewPassword } = formData;

        if (!currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (newPassword.length < 5 || newPassword.length > 40) {
            newErrors.newPassword = 'Password must be between 5 and 40 characters';
        }

        if (!confirmNewPassword) {
            newErrors.confirmNewPassword = 'Please confirm your new password';
        } else if (newPassword !== confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');
        setSuccessMessage('');

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await changePassword(formData);
            setSuccessMessage('Password changed successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        } catch (error) {
            const apiError = error as ApiError;
            setApiError(apiError.message || 'Failed to change password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#D4A373] mb-4">Change Password</h3>

            {apiError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {apiError}
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Current Password"
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    error={errors.currentPassword}
                    fullWidth
                />

                <Input
                    label="New Password"
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    error={errors.newPassword}
                    fullWidth
                />

                <Input
                    label="Confirm New Password"
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    error={errors.confirmNewPassword}
                    fullWidth
                />

                <div className="flex justify-end mt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                    >
                        Change Password
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PasswordChangeForm;