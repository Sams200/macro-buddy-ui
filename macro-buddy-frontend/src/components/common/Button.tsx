import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = 'primary',
                                           size = 'md',
                                           isLoading = false,
                                           fullWidth = false,
                                           className = '',
                                           disabled,
                                           ...props
                                       }) => {
    const baseStyles = 'rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantStyles = {
        primary: 'bg-[#D4A373] hover:bg-[#c69c6d] text-white focus:ring-[#D4A373]',
        secondary: 'bg-[#CCD5AE] hover:bg-[#bbc499] text-white focus:ring-[#CCD5AE]',
        outline: 'bg-transparent border border-[#D4A373] text-[#D4A373] hover:bg-[#D4A373] hover:text-white focus:ring-[#D4A373]',
        text: 'bg-transparent text-[#D4A373] hover:bg-[#FEFAE0] focus:ring-[#D4A373]',
    };

    const sizeStyles = {
        sm: 'py-1 px-3 text-sm',
        md: 'py-2 px-4 text-base',
        lg: 'py-3 px-6 text-lg',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className} ${
                disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;