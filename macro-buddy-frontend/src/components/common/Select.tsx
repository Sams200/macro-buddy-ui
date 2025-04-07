import React, { forwardRef } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Option[];
    error?: string;
    fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, fullWidth = false, className = '', ...props }, ref) => {
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
                <select
                    ref={ref}
                    className={`px-3 py-2 bg-white border ${
                        error ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-[#D4A373] focus:border-[#D4A373] ${
                        fullWidth ? 'w-full' : ''
                    } ${className}`}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;