import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
        return (
            <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
                {label && (
                    <label
                        htmlFor={props.id}
                        className="block text-[#CCD5AE] text-sm font-medium mb-1"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`px-3 py-2 bg-white border ${
                        error ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-[#D4A373] focus:border-[#D4A373] ${
                        fullWidth ? 'w-full' : ''
                    } ${className}`}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;